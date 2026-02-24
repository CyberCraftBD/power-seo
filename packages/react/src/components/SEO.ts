'use client';
// @power-seo/react — SEO Component


import { createElement, Fragment } from 'react';
import type { SEOConfig } from '@power-seo/core';
import { buildMetaTags, buildLinkTags, resolveTitle } from '@power-seo/core';
import { useDefaultSEO } from '../context.js';
import { renderMetaTags, renderLinkTags } from '../head-tags.js';

export type SEOProps = SEOConfig;

/** All-in-one SEO component. Merges page config with DefaultSEO context if present. */
export function SEO(props: SEOProps) {
  const defaults = useDefaultSEO();
  const config: SEOConfig = {
    ...defaults,
    ...props,
    openGraph: {
      ...defaults?.openGraph,
      ...props.openGraph,
      images: props.openGraph?.images ?? defaults?.openGraph?.images,
      videos: props.openGraph?.videos ?? defaults?.openGraph?.videos,
    },
    twitter: { ...defaults?.twitter, ...props.twitter },
    additionalMetaTags: [...(defaults?.additionalMetaTags ?? []), ...(props.additionalMetaTags ?? [])],
    additionalLinkTags: [...(defaults?.additionalLinkTags ?? []), ...(props.additionalLinkTags ?? [])],
    languageAlternates: props.languageAlternates ?? defaults?.languageAlternates,
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
