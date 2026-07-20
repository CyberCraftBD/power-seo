// @power-seo/redirects — Next.js Adapter
// ----------------------------------------------------------------------------

import type { RedirectRule } from '@power-seo/core';
import type { NextRedirect } from '../types.js';

/**
 * Convert RedirectRule[] to Next.js `redirects` config format.
 *
 * - 301/308 → `permanent: true`
 * - 302/307 → `permanent: false`
 * - Regex and wildcard patterns are converted to Next.js path matching syntax:
 *   - `isRegex` rules: each `(...)` capture group becomes a Next.js named
 *     segment (`:p1`, `:p2`, ...), and the matching `$1`/`$2` in the
 *     destination becomes `:p1`/`:p2`. A trailing `(.*)`/`(.+)` capture becomes
 *     a catch-all `:p*` segment.
 *   - Glob rules: a bare `*` wildcard becomes a `:splat*` catch-all segment on
 *     both source and destination. `:param` segments are already valid Next.js
 *     syntax and pass through unchanged.
 */
export function toNextRedirects(rules: RedirectRule[]): NextRedirect[] {
  return rules
    .filter((rule) => rule.statusCode !== 410)
    .map((rule) => {
      const permanent = rule.statusCode === 301 || rule.statusCode === 308;

      const { source, destination } = rule.isRegex
        ? convertRegexRule(rule.source, rule.destination)
        : convertGlobRule(rule.source, rule.destination);

      return {
        source,
        destination,
        permanent,
      };
    });
}

/**
 * Translate a regex rule (`/old/(.*)` → `/new/$1`) into Next.js named-segment
 * syntax (`/old/:p1*` → `/new/:p1`).
 */
function convertRegexRule(
  source: string,
  destination: string,
): { source: string; destination: string } {
  let index = 0;
  const nextSource = source.replace(/\(([^)]*)\)/g, (_full, inner: string) => {
    index += 1;
    const name = `p${index}`;
    // A `.*` / `.+` capture is a catch-all in Next.js terms.
    if (inner === '.*' || inner === '.+') {
      return `:${name}*`;
    }
    // Any other capture becomes a constrained named segment.
    return `:${name}(${inner})`;
  });

  // Map `$1`, `$2`, … in the destination onto the named segments.
  let nextDestination = destination;
  for (let i = index; i >= 1; i--) {
    nextDestination = nextDestination.split(`$${i}`).join(`:p${i}`);
  }

  return { source: nextSource, destination: nextDestination };
}

/**
 * Translate a glob rule containing a bare `*` wildcard into a Next.js catch-all
 * named segment. `:param` segments are already valid Next.js syntax.
 */
function convertGlobRule(
  source: string,
  destination: string,
): { source: string; destination: string } {
  if (!source.includes('*')) {
    return { source, destination };
  }
  return {
    source: source.split('*').join(':splat*'),
    destination: destination.split('*').join(':splat*'),
  };
}
