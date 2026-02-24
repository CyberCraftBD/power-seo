// @power-seo/react — <Hreflang> Component
// ----------------------------------------------------------------------------

import { createElement, Fragment } from 'react';
import type { HreflangConfig } from '@power-seo/core';

export interface HreflangProps {
  /** Language alternates */
  alternates: HreflangConfig[];
  /** Whether to include x-default (usually same as default language) */
  xDefault?: string;
}

/**
 * Render hreflang link tags for multi-language pages.
 *
 * @example
 * ```tsx
 * <Hreflang
 *   alternates={[
 *     { hrefLang: 'en', href: 'https://example.com/en/page' },
 *     { hrefLang: 'fr', href: 'https://example.com/fr/page' },
 *     { hrefLang: 'de', href: 'https://example.com/de/page' },
 *   ]}
 *   xDefault="https://example.com/en/page"
 * />
 * ```
 */
export function Hreflang({ alternates, xDefault }: HreflangProps) {
  const links = alternates.map((alt) =>
    createElement('link', {
      key: `hreflang-${alt.hrefLang}`,
      rel: 'alternate',
      hrefLang: alt.hrefLang,
      href: alt.href,
    }),
  );

  if (xDefault) {
    links.push(
      createElement('link', {
        key: 'hreflang-x-default',
        rel: 'alternate',
        hrefLang: 'x-default',
        href: xDefault,
      }),
    );
  }

  return createElement(Fragment, null, ...links);
}
