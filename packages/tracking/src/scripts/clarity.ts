// @power-seo/tracking — Clarity Script Builder
// ----------------------------------------------------------------------------

import type { ScriptConfig, ClarityConfig, ConsentState } from '../types.js';

export function buildClarityScript(config: ClarityConfig): ScriptConfig {
  const { projectId } = config;

  return {
    id: `clarity-${projectId}`,
    innerHTML: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`,
    consentCategory: 'analytics',
    shouldLoad: (consent: ConsentState) => consent.analytics,
  };
}
