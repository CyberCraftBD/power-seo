// @power-seo/redirects — Remix Adapter
// ----------------------------------------------------------------------------

import type { RedirectRule } from '@power-seo/core';
import { createRedirectEngine } from '../engine.js';
import type { RedirectEngineConfig } from '../types.js';

/**
 * Create a Remix-compatible redirect handler from redirect rules.
 *
 * Returns a function that takes a Request and returns a Response (redirect)
 * or null if no rule matches.
 */
export function createRemixRedirectHandler(
  rules: RedirectRule[],
  config?: RedirectEngineConfig,
): (request: globalThis.Request) => globalThis.Response | null {
  const engine = createRedirectEngine(rules, config);

  return (request: globalThis.Request): globalThis.Response | null => {
    const url = new globalThis.URL(request.url);
    const pathname = url.pathname + url.search;

    const result = engine.match(pathname);
    if (!result) return null;

    // 410 Gone — return empty response
    if (result.statusCode === 410) {
      return new globalThis.Response(null, { status: 410 });
    }

    return globalThis.Response.redirect(
      new globalThis.URL(result.resolvedDestination, url.origin).toString(),
      result.statusCode,
    );
  };
}
