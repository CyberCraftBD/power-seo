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
