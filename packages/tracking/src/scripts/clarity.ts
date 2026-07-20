// @power-seo/tracking — Clarity Script Builder
// ----------------------------------------------------------------------------

import type { ScriptConfig, ClarityConfig, ConsentState } from '../types.js';

// Clarity project IDs are short lowercase-alphanumeric tokens. Validating against a
// strict allow-list prevents the ID from breaking out of the inline script string
// and injecting arbitrary JS (XSS).
const CLARITY_PROJECT_ID_PATTERN = /^[a-z0-9]+$/;

export function buildClarityScript(config: ClarityConfig): ScriptConfig {
  const { projectId } = config;

  if (!CLARITY_PROJECT_ID_PATTERN.test(projectId)) {
    throw new Error(
      `Invalid Clarity projectId: "${projectId}". Expected a lowercase-alphanumeric token.`,
    );
  }

  return {
    id: `clarity-${projectId}`,
    innerHTML: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`,
    consentCategory: 'analytics',
    shouldLoad: (consent: ConsentState) => consent.analytics,
  };
}
