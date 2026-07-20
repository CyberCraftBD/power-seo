// @power-seo/redirects — URL Pattern Matching
// ----------------------------------------------------------------------------

import type { RedirectEngineConfig } from './types.js';

/**
 * Normalize a URL path for comparison.
 * Strips protocol/host if present, handles trailing slash and case sensitivity.
 */
function normalizePath(url: string, config?: RedirectEngineConfig): string {
  let path = url;

  // Extract path from full URLs — match on the pathname only. Query strings
  // (UTM tags, `?ref=`, etc.) must not affect matching; the engine re-appends
  // the original query to the resolved destination.
  try {
    const parsed = new globalThis.URL(url, 'http://localhost');
    path = parsed.pathname;
  } catch {
    // keep as-is
  }

  // Handle trailing slash
  const trailingSlash = config?.trailingSlash ?? 'remove';
  if (trailingSlash === 'remove' && path !== '/' && path.endsWith('/')) {
    while (path.endsWith('/') && path !== '/') path = path.slice(0, -1);
  } else if (trailingSlash === 'add' && path !== '/' && !path.endsWith('/')) {
    path = path + '/';
  }

  // Case sensitivity
  if (!config?.caseSensitive) {
    path = path.toLowerCase();
  }

  return path;
}

/**
 * Exact string match after normalization.
 */
export function matchExact(url: string, source: string, config?: RedirectEngineConfig): boolean {
  return normalizePath(url, config) === normalizePath(source, config);
}

/**
 * Glob/wildcard match supporting `*` and `:param` patterns.
 *
 * - `/blog/*` matches `/blog/post`, `/blog/post/nested`
 * - `/users/:id` matches `/users/123`
 */
export function matchGlob(
  url: string,
  pattern: string,
  config?: RedirectEngineConfig,
): { matched: boolean; params: Record<string, string> } {
  const normalizedUrl = normalizePath(url, config);
  const normalizedPattern = normalizePath(pattern, config);

  const params: Record<string, string> = {};

  // Split into segments
  const urlParts = normalizedUrl.split('/').filter(Boolean);
  const patternParts = normalizedPattern.split('/').filter(Boolean);
  // Keep original pattern parts for param names (before case normalization)
  let trimmedPattern = pattern;
  while (trimmedPattern.endsWith('/')) trimmedPattern = trimmedPattern.slice(0, -1);
  const originalPatternParts = trimmedPattern.split('/').filter(Boolean);

  let urlIdx = 0;
  let patIdx = 0;

  while (patIdx < patternParts.length) {
    const pat = patternParts[patIdx]!;

    if (pat === '*') {
      // Wildcard matches all remaining segments
      params['*'] = urlParts.slice(urlIdx).join('/');
      return { matched: true, params };
    }

    if (pat.startsWith(':')) {
      // Named parameter — use original pattern part for param name
      if (urlIdx >= urlParts.length) {
        return { matched: false, params: {} };
      }
      const originalPat = originalPatternParts[patIdx] ?? pat;
      const paramName = originalPat.startsWith(':') ? originalPat.slice(1) : pat.slice(1);
      params[paramName] = urlParts[urlIdx]!;
      urlIdx++;
      patIdx++;
      continue;
    }

    // Literal segment
    if (urlIdx >= urlParts.length || urlParts[urlIdx] !== pat) {
      return { matched: false, params: {} };
    }

    urlIdx++;
    patIdx++;
  }

  // All pattern parts consumed — url must also be fully consumed
  if (urlIdx !== urlParts.length) {
    return { matched: false, params: {} };
  }

  return { matched: true, params };
}

/**
 * Regex match with capture group substitution in destination.
 *
 * @example
 * ```ts
 * matchRegex('/old/hello', '/old/(.*)', '/new/$1');
 * // => { matched: true, destination: '/new/hello' }
 * ```
 */
export function matchRegex(
  url: string,
  pattern: string,
  destination: string,
  config?: RedirectEngineConfig,
): { matched: boolean; destination: string } {
  const normalizedUrl = normalizePath(url, config);

  const flags = config?.caseSensitive ? '' : 'i';
  let regex: RegExp;
  try {
    regex = new RegExp(`^${pattern}$`, flags);
  } catch {
    return { matched: false, destination };
  }

  const match = normalizedUrl.match(regex);
  if (!match) {
    return { matched: false, destination };
  }

  // Substitute capture groups ($1, $2, etc.) in destination — every
  // occurrence of each `$n`, not just the first. Iterate high-to-low so `$1`
  // does not partially consume `$10`+ tokens.
  let resolved = destination;
  for (let i = match.length - 1; i >= 1; i--) {
    resolved = resolved.split(`$${i}`).join(match[i] ?? '');
  }

  return { matched: true, destination: resolved };
}

/**
 * Substitute params into a destination string.
 * Replaces `:param` tokens and `*` with matched values.
 */
export function substituteParams(destination: string, params: Record<string, string>): string {
  let result = destination;

  // Replace all `*` wildcards.
  if ('*' in params) {
    result = result.split('*').join(params['*']!);
  }

  // Replace `:param` tokens. Sort keys longest-first so a longer key (`:idx`)
  // is substituted before a shorter one that is a prefix of it (`:id`), and use
  // a boundary-aware global regex so `:id` does not match inside `:idx`.
  const keys = Object.keys(params)
    .filter((k) => k !== '*')
    .sort((a, b) => b.length - a.length);

  for (const key of keys) {
    const value = params[key]!;
    // Match `:key` only when not immediately followed by another identifier
    // character (so `:id` won't match the `:id` prefix inside `:idx`).
    const token = new RegExp(`:${escapeRegExp(key)}(?![A-Za-z0-9_])`, 'g');
    result = result.replace(token, () => value);
  }

  return result;
}

/** Escape a string for safe use inside a RegExp. */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Dangerous URL schemes that must never be used as a redirect destination.
// Leading control/whitespace characters are tolerated (browsers strip them).
// eslint-disable-next-line no-control-regex -- control chars are the attack vector being matched
const DANGEROUS_SCHEME = /^[\x00-\x20]*(?:javascript|data|vbscript|file):/i;

/**
 * True when a destination points off the current origin — an absolute
 * scheme-prefixed URL, or a protocol-relative reference (`//host`, `/\host`,
 * `\\host`; browsers treat `\` like `/`). Any scheme prefix counts, not just
 * `scheme://`: browsers parse `https:/host` and `https:host` as `https://host`
 * (WHATWG URL special-scheme normalization).
 */
function isExternalDestination(dest: string): boolean {
  // eslint-disable-next-line no-control-regex -- strip the control chars browsers ignore
  const s = dest.replace(/^[\x00-\x20]+/, '');
  if (/^[/\\]{2}/.test(s)) return true; // //host or \\host or /\host
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return true; // scheme: absolute URL
  return false;
}

/**
 * Guard against open-redirect injection. A resolved destination is unsafe when:
 *  - it uses a dangerous scheme (`javascript:`, `data:`, `vbscript:`, `file:`), or
 *  - it became off-origin/protocol-relative through capture-group substitution
 *    (the raw rule template was NOT external but the resolved value is) and
 *    external redirects are not explicitly allowed via config.
 *
 * Intentional external redirects — where the author's destination template is
 * itself external — are always preserved.
 */
export function isDestinationSafe(
  rawDestination: string,
  resolvedDestination: string,
  config?: RedirectEngineConfig,
): boolean {
  if (DANGEROUS_SCHEME.test(resolvedDestination)) return false;

  if (isExternalDestination(resolvedDestination)) {
    if (config?.allowExternalRedirects) return true;
    return isExternalDestination(rawDestination);
  }

  return true;
}
