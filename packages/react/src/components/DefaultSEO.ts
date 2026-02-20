// ============================================================================
// @power-seo/react — <DefaultSEO> Component
// ============================================================================

import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { SEOConfig } from '@power-seo/core';
import { buildMetaTags, buildLinkTags, resolveTitle } from '@power-seo/core';
import { SEOContext } from '../context.js';
import { renderMetaTags, renderLinkTags } from '../head-tags.js';

export interface DefaultSEOProps extends SEOConfig {
  children?: ReactNode;
}

/**
 * Provide global default SEO configuration.
 * Renders default meta tags and wraps children with SEO context.
 *
 * @example
 * ```tsx
 * <DefaultSEO
 *   titleTemplate="%s | My Site"
 *   defaultTitle="My Site"
 *   description="Default description"
 *   openGraph={{
 *     type: 'website',
 *     siteName: 'My Site',
 *   }}
 * >
 *   <App />
 * </DefaultSEO>
 * ```
 */
export function DefaultSEO({ children, ...config }: DefaultSEOProps) {
  const title = resolveTitle(config);
  const metaTags = buildMetaTags(config);
  const linkTags = buildLinkTags(config);

  return createElement(
    SEOContext.Provider,
    { value: config },
    title ? createElement('title', null, title) : null,
    renderMetaTags(metaTags),
    renderLinkTags(linkTags),
    children,
  );
}
