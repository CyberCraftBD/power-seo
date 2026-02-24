// @power-seo/tracking — GA4 Script Builder
// ----------------------------------------------------------------------------

import type { ScriptConfig, GA4Config, ConsentState } from '../types.js';

export function buildGA4Script(config: GA4Config): ScriptConfig[] {
  const { measurementId, consentModeV2 = true, anonymizeIp = true, sendPageView = true } = config;

  const scripts: ScriptConfig[] = [];

  if (consentModeV2) {
    scripts.push({
      id: `ga4-consent-${measurementId}`,
      innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied','ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied'});`,
      consentCategory: 'necessary',
      shouldLoad: () => true,
    });
  }

  scripts.push({
    id: `ga4-gtag-${measurementId}`,
    src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    async: true,
    consentCategory: 'analytics',
    shouldLoad: (consent: ConsentState) => consent.analytics,
  });

  const configParts = [
    `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`,
    `gtag('config','${measurementId}',{${anonymizeIp ? "'anonymize_ip':true," : ''}${!sendPageView ? "'send_page_view':false" : ''}});`,
  ];

  if (consentModeV2) {
    configParts.push(`gtag('consent','update',{'analytics_storage':'granted'});`);
  }

  scripts.push({
    id: `ga4-config-${measurementId}`,
    innerHTML: configParts.join(''),
    consentCategory: 'analytics',
    shouldLoad: (consent: ConsentState) => consent.analytics,
  });

  return scripts;
}
