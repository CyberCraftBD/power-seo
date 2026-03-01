// @power-seo/meta — Next.js App Router Metadata


import type { SEOConfig } from '@power-seo/core';
import { resolveTitle, buildRobotsContent } from '@power-seo/core';
import type { NextMetadata, NextOGImage } from './types.js';

/** Convert an SEOConfig to a Next.js App Router Metadata object. */
export function createMetadata(config: SEOConfig): NextMetadata {
  const metadata: NextMetadata = {};

  // Title
  if (config.titleTemplate) {
    metadata.title = {
      template: config.titleTemplate,
      default: config.defaultTitle ?? config.title ?? '',
    };
  } else {
    const title = resolveTitle(config);
    if (title !== undefined) metadata.title = title;
  }

  // Description
  if (config.description) metadata.description = config.description;

  // Robots
  if (config.noindex !== undefined || config.nofollow !== undefined || config.robots) {
    const r = config.robots;
    const index = config.noindex ? false : r?.index;
    const follow = config.nofollow ? false : r?.follow;
    metadata.robots = {};
    if (index !== undefined) metadata.robots.index = index;
    if (follow !== undefined) metadata.robots.follow = follow;
    if (r?.noarchive !== undefined) metadata.robots.noarchive = r.noarchive;
    if (r?.nosnippet !== undefined) metadata.robots.nosnippet = r.nosnippet;
    if (r?.noimageindex !== undefined) metadata.robots.noimageindex = r.noimageindex;
    if (r?.notranslate !== undefined) metadata.robots.notranslate = r.notranslate;
    if (r?.unavailableAfter !== undefined) metadata.robots.unavailableAfter = r.unavailableAfter;

    // Handle advanced robots directives (maxSnippet, maxImagePreview, maxVideoPreview) via buildRobotsContent
    if (r?.maxSnippet !== undefined || r?.maxImagePreview !== undefined || r?.maxVideoPreview !== undefined) {
      const robotsContent = buildRobotsContent({
        index,
        follow,
        noarchive: r?.noarchive,
        nosnippet: r?.nosnippet,
        noimageindex: r?.noimageindex,
        notranslate: r?.notranslate,
        unavailableAfter: r?.unavailableAfter,
        maxSnippet: r?.maxSnippet,
        maxImagePreview: r?.maxImagePreview,
        maxVideoPreview: r?.maxVideoPreview,
      });
      if (!metadata.other) metadata.other = {};
      metadata.other['robots'] = robotsContent;
    }
  }

  // Open Graph
  if (config.openGraph) {
    const og = config.openGraph;
    metadata.openGraph = {};
    if (og.type) metadata.openGraph.type = og.type;
    if (og.title) metadata.openGraph.title = og.title;
    if (og.description) metadata.openGraph.description = og.description;
    if (og.url) metadata.openGraph.url = og.url;
    if (og.siteName) metadata.openGraph.siteName = og.siteName;
    if (og.locale) metadata.openGraph.locale = og.locale;
    if (og.images && og.images.length > 0) {
      metadata.openGraph.images = og.images.map(
        (img): NextOGImage => ({
          url: img.url,
          ...(img.width !== undefined && { width: img.width }),
          ...(img.height !== undefined && { height: img.height }),
          ...(img.alt !== undefined && { alt: img.alt }),
          ...(img.type !== undefined && { type: img.type }),
        }),
      );
    }
    if (og.article) {
      metadata.openGraph.article = {};
      if (og.article.publishedTime) metadata.openGraph.article.publishedTime = og.article.publishedTime;
      if (og.article.modifiedTime) metadata.openGraph.article.modifiedTime = og.article.modifiedTime;
      if (og.article.authors) metadata.openGraph.article.authors = og.article.authors;
      if (og.article.section) metadata.openGraph.article.section = og.article.section;
      if (og.article.tags) metadata.openGraph.article.tags = og.article.tags;
    }
  }

  // Twitter
  if (config.twitter) {
    const tw = config.twitter;
    metadata.twitter = {};
    if (tw.cardType) metadata.twitter.card = tw.cardType;
    if (tw.site) metadata.twitter.site = tw.site;
    if (tw.creator) metadata.twitter.creator = tw.creator;
    if (tw.title) metadata.twitter.title = tw.title;
    if (tw.description) metadata.twitter.description = tw.description;
    if (tw.image) metadata.twitter.images = [tw.image];
  }

  // Alternates
  if (config.canonical || config.languageAlternates) {
    metadata.alternates = {};
    if (config.canonical) metadata.alternates.canonical = config.canonical;
    if (config.languageAlternates && config.languageAlternates.length > 0) {
      metadata.alternates.languages = {};
      for (const alt of config.languageAlternates) {
        metadata.alternates.languages[alt.hrefLang] = alt.href;
      }
    }
  }

  // Additional meta tags
  if (config.additionalMetaTags && config.additionalMetaTags.length > 0) {
    metadata.other = {};
    for (const tag of config.additionalMetaTags) {
      const key = tag.name ?? tag.property ?? tag.httpEquiv;
      if (key) metadata.other[key] = tag.content;
    }
  }

  return metadata;
}
