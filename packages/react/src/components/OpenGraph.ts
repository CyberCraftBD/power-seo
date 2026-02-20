// ============================================================================
// @power-seo/react — <OpenGraph> Component
// ============================================================================

import { createElement, Fragment } from 'react';
import type { OpenGraphConfig } from '@power-seo/core';
import { buildOpenGraphTags } from '@power-seo/core';
import { renderMetaTags } from '../head-tags.js';

export type OpenGraphProps = OpenGraphConfig;

/**
 * Render Open Graph meta tags.
 *
 * @example
 * ```tsx
 * <OpenGraph
 *   type="article"
 *   title="My Article"
 *   description="Article description"
 *   url="https://example.com/article"
 *   images={[{
 *     url: 'https://example.com/og.jpg',
 *     width: 1200,
 *     height: 630,
 *     alt: 'Article image',
 *   }]}
 *   article={{
 *     publishedTime: '2025-01-01',
 *     authors: ['https://example.com/author'],
 *     tags: ['react', 'seo'],
 *   }}
 * />
 * ```
 */
export function OpenGraph(props: OpenGraphProps) {
  const tags = buildOpenGraphTags(props);
  return createElement(Fragment, null, renderMetaTags(tags));
}
