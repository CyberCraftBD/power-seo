// ============================================================================
// @power-seo/redirects — Next.js Adapter
// ============================================================================

import type { RedirectRule } from '@power-seo/core';
import type { NextRedirect } from '../types.js';

/**
 * Convert RedirectRule[] to Next.js `redirects` config format.
 *
 * - 301/308 → `permanent: true`
 * - 302/307 → `permanent: false`
 * - Regex patterns are converted to Next.js path matching syntax
 */
export function toNextRedirects(rules: RedirectRule[]): NextRedirect[] {
  return rules
    .filter((rule) => rule.statusCode !== 410)
    .map((rule) => {
      const permanent = rule.statusCode === 301 || rule.statusCode === 308;

      let source = rule.source;
      let destination = rule.destination;

      if (rule.isRegex) {
        // Wrap regex source in Next.js regex syntax
        source = rule.source;
        destination = rule.destination;
      }

      return {
        source,
        destination,
        permanent,
      };
    });
}
