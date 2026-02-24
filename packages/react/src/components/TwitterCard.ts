// @power-seo/react — <TwitterCard> Component
// ----------------------------------------------------------------------------

import { createElement, Fragment } from 'react';
import type { TwitterCardConfig } from '@power-seo/core';
import { buildTwitterTags } from '@power-seo/core';
import { renderMetaTags } from '../head-tags.js';

export type TwitterCardProps = TwitterCardConfig;

/**
 * Render Twitter Card meta tags.
 *
 * @example
 * ```tsx
 * <TwitterCard
 *   cardType="summary_large_image"
 *   site="@mysite"
 *   creator="@author"
 *   title="My Article"
 *   description="Article description"
 *   image="https://example.com/twitter.jpg"
 *   imageAlt="Twitter card image"
 * />
 * ```
 */
export function TwitterCard(props: TwitterCardProps) {
  const tags = buildTwitterTags(props);
  return createElement(Fragment, null, renderMetaTags(tags));
}
