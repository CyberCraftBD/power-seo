// ============================================================================
// @ccbd-seo/tracking — Plausible Script Builder
// ============================================================================

import type { ScriptConfig, PlausibleConfig, ConsentState } from '../types.js';

export function buildPlausibleScript(config: PlausibleConfig): ScriptConfig {
  const { domain, selfHostedUrl } = config;
  const scriptSrc = selfHostedUrl
    ? `${selfHostedUrl.replace(/\/$/, '')}/js/script.js`
    : 'https://plausible.io/js/script.js';

  return {
    id: `plausible-${domain}`,
    src: scriptSrc,
    defer: true,
    consentCategory: 'analytics',
    attributes: {
      'data-domain': domain,
    },
    shouldLoad: (consent: ConsentState) => consent.analytics,
  };
}
