// ============================================================================
// @power-seo/redirects — Express Adapter
// ============================================================================

import type { RedirectRule } from '@power-seo/core';
import { createRedirectEngine } from '../engine.js';
import type { RedirectEngineConfig } from '../types.js';

interface ExpressRequest {
  url: string;
}

interface ExpressResponse {
  redirect(statusCode: number, url: string): void;
  status(code: number): ExpressResponse;
  end(): void;
}

type NextFunction = () => void;

/**
 * Create an Express-compatible middleware for redirect rules.
 *
 * Matches `req.url` against rules and calls `res.redirect()` or `next()`.
 */
export function createExpressRedirectMiddleware(
  rules: RedirectRule[],
  config?: RedirectEngineConfig,
): (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void {
  const engine = createRedirectEngine(rules, config);

  return (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void => {
    const result = engine.match(req.url);
    if (!result) {
      next();
      return;
    }

    // 410 Gone — return empty response
    if (result.statusCode === 410) {
      res.status(410).end();
      return;
    }

    res.redirect(result.statusCode, result.resolvedDestination);
  };
}
