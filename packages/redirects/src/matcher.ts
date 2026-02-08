// ============================================================================
// @ccbd-seo/redirects — URL Pattern Matching
// ============================================================================

import type { RedirectEngineConfig } from './types.js';

/**
 * Normalize a URL path for comparison.
 * Strips protocol/host if present, handles trailing slash and case sensitivity.
 */
function normalizePath(url: string, config?: RedirectEngineConfig): string {
  let path = url;

  // Extract path from full URLs
  try {
    const parsed = new globalThis.URL(url, 'http://localhost');
    path = parsed.pathname + parsed.search;
  } catch {
    // keep as-is
  }

  // Handle trailing slash
  const trailingSlash = config?.trailingSlash ?? 'remove';
  if (trailingSlash === 'remove' && path !== '/' && path.endsWith('/')) {
    path = path.replace(/\/+$/, '');
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
export function matchExact(
  url: string,
  source: string,
  config?: RedirectEngineConfig,
): boolean {
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
  const originalPatternParts = pattern.replace(/\/+$/, '').split('/').filter(Boolean);

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

  // Substitute capture groups ($1, $2, etc.) in destination
  let resolved = destination;
  for (let i = 1; i < match.length; i++) {
    resolved = resolved.replace(`$${i}`, match[i] ?? '');
  }

  return { matched: true, destination: resolved };
}

/**
 * Substitute params into a destination string.
 * Replaces `:param` tokens and `*` with matched values.
 */
export function substituteParams(
  destination: string,
  params: Record<string, string>,
): string {
  let result = destination;
  for (const [key, value] of Object.entries(params)) {
    if (key === '*') {
      result = result.replace('*', value);
    } else {
      result = result.replace(`:${key}`, value);
    }
  }
  return result;
}
