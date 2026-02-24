'use client';
// ============================================================================
// @power-seo/react — <SEO> Component
// ============================================================================

import { createElement, Fragment } from 'react';
import type { SEOConfig } from '@power-seo/core';
import { buildMetaTags, buildLinkTags, resolveTitle } from '@power-seo/core';
import { useDefaultSEO } from '../context.js';
import { renderMetaTags, renderLinkTags } from '../head-tags.js';

export type SEOProps = SEOConfig;

/**
 * All-in-one SEO component for per-page meta tag management.
 * Merges with DefaultSEO context if available.
 *
 * In React 19, <title>, <meta>, and <link> tags automatically hoist to <head>.
 * In React 18, use with a Helmet provider or framework Head component.
 *
 * @example
 * ```tsx
 * <SEO
 *   title="About Us"
 *   description="Learn about our company"
 *   canonical="https://example.com/about"
 *   openGraph={{
 *     title: 'About Us',
 *     description: 'Learn about our company',
 *     images: [{ url: 'https://example.com/about-og.jpg', width: 1200, height: 630 }],
 *   }}
 *   twitter={{
 *     cardType: 'summary_large_image',
 *   }}
 * />
 * ```
 */
export function SEO(props: SEOProps) {
  const defaults = useDefaultSEO();

  // Merge page config with defaults
  const config: SEOConfig = {
    ...defaults,
    ...props,
    // Deep merge for nested objects
    openGraph: {
      ...defaults?.openGraph,
      ...props.openGraph,
      images: props.openGraph?.images ?? defaults?.openGraph?.images,
      videos: props.openGraph?.videos ?? defaults?.openGraph?.videos,
    },
    twitter: {
      ...defaults?.twitter,
      ...props.twitter,
    },
    additionalMetaTags: [
      ...(defaults?.additionalMetaTags ?? []),
      ...(props.additionalMetaTags ?? []),
    ],
    additionalLinkTags: [
      ...(defaults?.additionalLinkTags ?? []),
      ...(props.additionalLinkTags ?? []),
    ],
    languageAlternates: props.languageAlternates ?? defaults?.languageAlternates,
    // Use page-specific title template or default
    titleTemplate: props.titleTemplate ?? defaults?.titleTemplate,
  };

  const title = resolveTitle(config);
  const metaTags = buildMetaTags(config);
  const linkTags = buildLinkTags(config);

  return createElement(
    Fragment,
    null,
    title ? createElement('title', null, title) : null,
    renderMetaTags(metaTags),
    renderLinkTags(linkTags),
  );
}
