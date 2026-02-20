// ============================================================================
// @power-seo/react — Head Tag Rendering (React 19 native + fallback)
// ============================================================================

import { createElement, Fragment } from 'react';
import type { MetaTag, LinkTag } from '@power-seo/core';

/**
 * Render meta tags as React elements.
 * In React 19, these automatically hoist to <head>.
 * In React 18, wrap with a Helmet provider or use a framework's Head component.
 */
export function renderMetaTags(tags: MetaTag[]) {
  return createElement(
    Fragment,
    null,
    ...tags.map((tag, i) => {
      const props: Record<string, string> = { content: tag.content };
      if (tag.name) props.name = tag.name;
      if (tag.property) props.property = tag.property;
      if (tag.httpEquiv) props.httpEquiv = tag.httpEquiv;
      props.key = `meta-${tag.name ?? tag.property ?? tag.httpEquiv ?? i}`;
      return createElement('meta', props);
    }),
  );
}

/**
 * Render link tags as React elements.
 */
export function renderLinkTags(tags: LinkTag[]) {
  return createElement(
    Fragment,
    null,
    ...tags.map((tag, i) => {
      const props: Record<string, string | undefined> = {
        rel: tag.rel,
        href: tag.href,
        key: `link-${tag.rel}-${tag.hreflang ?? i}`,
      };
      if (tag.hreflang) props.hrefLang = tag.hreflang;
      if (tag.type) props.type = tag.type;
      if (tag.sizes) props.sizes = tag.sizes;
      if (tag.media) props.media = tag.media;
      if (tag.as) props.as = tag.as;
      if (tag.crossOrigin) props.crossOrigin = tag.crossOrigin;
      return createElement('link', props);
    }),
  );
}
