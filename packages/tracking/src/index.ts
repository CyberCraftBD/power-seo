// @power-seo/tracking — Main Entry Point
// ----------------------------------------------------------------------------

// Types
export type {
  ConsentCategory,
  ScriptConfig,
  ConsentState,
  ConsentManager,
  ConsentChangeCallback,
  GA4Config,
  GA4ReportRequest,
  GA4ReportRow,
  GA4ReportResponse,
  GA4Client,
  GA4Metadata,
  ClarityConfig,
  ClarityProject,
  ClarityInsight,
  ClarityHeatmapData,
  ClarityClient,
  PostHogConfig,
  PostHogEvent,
  PostHogTrendResult,
  PostHogFunnelStep,
  PostHogClient,
  PlausibleConfig,
  PlausibleTimeseriesPoint,
  PlausibleBreakdownEntry,
  PlausibleAggregateResult,
  PlausibleClient,
  FathomConfig,
  FathomSite,
  FathomPageview,
  FathomReferrer,
  FathomClient,
} from './types.js';

// Consent
export { createConsentManager } from './consent.js';

// Script Builders
export { buildGA4Script } from './scripts/ga4.js';
export { buildClarityScript } from './scripts/clarity.js';
export { buildPostHogScript } from './scripts/posthog.js';
export { buildPlausibleScript } from './scripts/plausible.js';
export { buildFathomScript } from './scripts/fathom.js';

// API Clients
export { createGA4Client } from './api/ga4.js';
export { createClarityClient } from './api/clarity.js';
export { createPostHogClient } from './api/posthog.js';
export { createPlausibleClient } from './api/plausible.js';
export { createFathomClient } from './api/fathom.js';
