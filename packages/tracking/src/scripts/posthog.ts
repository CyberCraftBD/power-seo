// @power-seo/tracking — PostHog Script Builder
// ----------------------------------------------------------------------------

import type { ScriptConfig, PostHogConfig, ConsentState } from '../types.js';

// PostHog project API keys look like `phc_` followed by an alphanumeric token.
// The host is embedded into the same inline script, so it must be a plain http(s)
// URL. Validating both prevents breaking out of the inline script string and
// injecting arbitrary JS (XSS).
const POSTHOG_API_KEY_PATTERN = /^phc_[A-Za-z0-9]+$/;

function isValidPostHogHost(host: string): boolean {
  try {
    const parsed = new URL(host);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    // Only a bare origin is allowed — no path, query, fragment, or credentials.
    // A valid https URL can otherwise carry `</script>` or a quote in its path and
    // break out of the inline script string (XSS). Requiring the input to equal the
    // parsed origin (optionally with a trailing slash) guarantees no injected
    // characters survived.
    if (parsed.pathname !== '/' && parsed.pathname !== '') return false;
    if (parsed.search || parsed.hash || parsed.username || parsed.password) return false;
    return host === parsed.origin || host === `${parsed.origin}/`;
  } catch {
    return false;
  }
}

export function buildPostHogScript(config: PostHogConfig): ScriptConfig {
  const { apiKey, host = 'https://us.i.posthog.com' } = config;

  if (!POSTHOG_API_KEY_PATTERN.test(apiKey)) {
    throw new Error(`Invalid PostHog apiKey: "${apiKey}". Expected format "phc_...".`);
  }

  if (!isValidPostHogHost(host)) {
    throw new Error(`Invalid PostHog host: "${host}". Expected an http(s) URL.`);
  }

  return {
    id: `posthog-${apiKey}`,
    innerHTML: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${apiKey}',{api_host:'${host}',person_profiles:'identified_only'});`,
    consentCategory: 'analytics',
    shouldLoad: (consent: ConsentState) => consent.analytics,
  };
}
