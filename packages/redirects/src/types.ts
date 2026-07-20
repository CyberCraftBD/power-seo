// @power-seo/redirects — Types
// ----------------------------------------------------------------------------

export type { RedirectStatusCode, RedirectRule } from '@power-seo/core';

import type { RedirectRule, RedirectStatusCode } from '@power-seo/core';

export interface RedirectMatch {
  rule: RedirectRule;
  resolvedDestination: string;
  statusCode: RedirectStatusCode;
}

export interface RedirectEngineConfig {
  trailingSlash?: 'keep' | 'remove' | 'add';
  caseSensitive?: boolean;
  /**
   * Allow a rule's destination to resolve to an off-origin (absolute or
   * protocol-relative) URL even when the raw destination template was a
   * same-origin path. Defaults to `false` — this prevents open-redirect
   * injection where a user-controlled capture group turns a relative
   * destination into an external one. Rules whose destination template is
   * itself external are always allowed regardless of this flag. Dangerous
   * schemes (`javascript:`, `data:`, `vbscript:`, `file:`) are always blocked.
   */
  allowExternalRedirects?: boolean;
}

export interface RedirectEngine {
  match(url: string): RedirectMatch | null;
  addRule(rule: RedirectRule): void;
  removeRule(source: string): boolean;
  getRules(): RedirectRule[];
}

export interface NextRedirect {
  source: string;
  destination: string;
  permanent: boolean;
  has?: Array<{ type: string; key: string; value?: string }>;
}
