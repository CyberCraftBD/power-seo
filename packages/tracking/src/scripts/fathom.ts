// ============================================================================
// @power-seo/tracking — Fathom Script Builder
// ============================================================================

import type { ScriptConfig, FathomConfig, ConsentState } from '../types.js';

export function buildFathomScript(config: FathomConfig): ScriptConfig {
  const { siteId } = config;

  return {
    id: `fathom-${siteId}`,
    src: 'https://cdn.usefathom.com/script.js',
    defer: true,
    consentCategory: 'analytics',
    attributes: {
      'data-site': siteId,
    },
    shouldLoad: (consent: ConsentState) => consent.analytics,
  };
}
