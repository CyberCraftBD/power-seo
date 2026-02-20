// ============================================================================
// @power-seo/redirects — Public API
// ============================================================================

export { createRedirectEngine } from './engine.js';
export { matchExact, matchGlob, matchRegex, substituteParams } from './matcher.js';
export { toNextRedirects } from './adapters/nextjs.js';
export { createRemixRedirectHandler } from './adapters/remix.js';
export { createExpressRedirectMiddleware } from './adapters/express.js';

export type {
  RedirectStatusCode,
  RedirectRule,
  RedirectMatch,
  RedirectEngineConfig,
  RedirectEngine,
  NextRedirect,
} from './types.js';
