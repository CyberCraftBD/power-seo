// @power-seo/core — Meta Tag Builder
// ----------------------------------------------------------------------------

import type {
  MetaTag,
  LinkTag,
  SEOConfig,
  OpenGraphConfig,
  TwitterCardConfig,
  HreflangConfig,
} from './types.js';
import { buildRobotsContent } from './robots-builder.js';

/**
 * Build an array of meta tags from an SEO configuration.
 * This is the framework-agnostic engine — frameworks render these as actual HTML.
 */
export function buildMetaTags(config: SEOConfig): MetaTag[] {
  const tags: MetaTag[] = [];

  // Description
  if (config.description) {
    tags.push({ name: 'description', content: config.description });
  }

  // Robots
  if (config.noindex || config.nofollow || config.robots) {
    const robotsContent = buildRobotsContent({
      index: config.noindex ? false : config.robots?.index,
      follow: config.nofollow ? false : config.robots?.follow,
      ...config.robots,
    });
    if (robotsContent) {
      tags.push({ name: 'robots', content: robotsContent });
    }
  }

  // Open Graph
  if (config.openGraph) {
    tags.push(...buildOpenGraphTags(config.openGraph));
  }

  // Twitter Card
  if (config.twitter) {
    tags.push(...buildTwitterTags(config.twitter));
  }

  // Additional meta tags
  if (config.additionalMetaTags) {
    tags.push(...config.additionalMetaTags);
  }

  return tags;
}

/**
 * Build an array of link tags from an SEO configuration.
 */
export function buildLinkTags(config: SEOConfig): LinkTag[] {
  const tags: LinkTag[] = [];

  // Canonical
  if (config.canonical) {
    tags.push({ rel: 'canonical', href: config.canonical });
  }

  // Language alternates (hreflang)
  if (config.languageAlternates) {
    tags.push(...buildHreflangTags(config.languageAlternates));
  }

  // Additional link tags
  if (config.additionalLinkTags) {
    tags.push(...config.additionalLinkTags);
  }

  return tags;
}

/**
 * Build Open Graph meta tags.
 */
export function buildOpenGraphTags(og: OpenGraphConfig): MetaTag[] {
  const tags: MetaTag[] = [];

  if (og.type) tags.push({ property: 'og:type', content: og.type });
  if (og.url) tags.push({ property: 'og:url', content: og.url });
  if (og.title) tags.push({ property: 'og:title', content: og.title });
  if (og.description) tags.push({ property: 'og:description', content: og.description });
  if (og.siteName) tags.push({ property: 'og:site_name', content: og.siteName });
  if (og.locale) tags.push({ property: 'og:locale', content: og.locale });

  if (og.localeAlternate) {
    for (const alt of og.localeAlternate) {
      tags.push({ property: 'og:locale:alternate', content: alt });
    }
  }

  if (og.images) {
    for (const image of og.images) {
      tags.push({ property: 'og:image', content: image.url });
      if (image.secureUrl) tags.push({ property: 'og:image:secure_url', content: image.secureUrl });
      if (image.type) tags.push({ property: 'og:image:type', content: image.type });
      if (image.width) tags.push({ property: 'og:image:width', content: String(image.width) });
      if (image.height) tags.push({ property: 'og:image:height', content: String(image.height) });
      if (image.alt) tags.push({ property: 'og:image:alt', content: image.alt });
    }
  }

  if (og.videos) {
    for (const video of og.videos) {
      tags.push({ property: 'og:video', content: video.url });
      if (video.secureUrl) tags.push({ property: 'og:video:secure_url', content: video.secureUrl });
      if (video.type) tags.push({ property: 'og:video:type', content: video.type });
      if (video.width) tags.push({ property: 'og:video:width', content: String(video.width) });
      if (video.height) tags.push({ property: 'og:video:height', content: String(video.height) });
    }
  }

  // Article-specific tags
  if (og.article) {
    if (og.article.publishedTime)
      tags.push({ property: 'article:published_time', content: og.article.publishedTime });
    if (og.article.modifiedTime)
      tags.push({ property: 'article:modified_time', content: og.article.modifiedTime });
    if (og.article.expirationTime)
      tags.push({ property: 'article:expiration_time', content: og.article.expirationTime });
    if (og.article.section) tags.push({ property: 'article:section', content: og.article.section });
    if (og.article.authors) {
      for (const author of og.article.authors) {
        tags.push({ property: 'article:author', content: author });
      }
    }
    if (og.article.tags) {
      for (const tag of og.article.tags) {
        tags.push({ property: 'article:tag', content: tag });
      }
    }
  }

  // Profile-specific tags
  if (og.profile) {
    if (og.profile.firstName)
      tags.push({ property: 'profile:first_name', content: og.profile.firstName });
    if (og.profile.lastName)
      tags.push({ property: 'profile:last_name', content: og.profile.lastName });
    if (og.profile.username)
      tags.push({ property: 'profile:username', content: og.profile.username });
    if (og.profile.gender) tags.push({ property: 'profile:gender', content: og.profile.gender });
  }

  return tags;
}

/**
 * Build Twitter Card meta tags.
 */
export function buildTwitterTags(twitter: TwitterCardConfig): MetaTag[] {
  const tags: MetaTag[] = [];

  if (twitter.cardType) tags.push({ name: 'twitter:card', content: twitter.cardType });
  if (twitter.site) tags.push({ name: 'twitter:site', content: twitter.site });
  if (twitter.creator) tags.push({ name: 'twitter:creator', content: twitter.creator });
  if (twitter.title) tags.push({ name: 'twitter:title', content: twitter.title });
  if (twitter.description) tags.push({ name: 'twitter:description', content: twitter.description });
  if (twitter.image) tags.push({ name: 'twitter:image', content: twitter.image });
  if (twitter.imageAlt) tags.push({ name: 'twitter:image:alt', content: twitter.imageAlt });

  // Player card
  if (twitter.player) {
    tags.push({ name: 'twitter:player', content: twitter.player });
    if (twitter.playerWidth)
      tags.push({ name: 'twitter:player:width', content: String(twitter.playerWidth) });
    if (twitter.playerHeight)
      tags.push({ name: 'twitter:player:height', content: String(twitter.playerHeight) });
    if (twitter.playerStream)
      tags.push({ name: 'twitter:player:stream', content: twitter.playerStream });
  }

  // App card
  if (twitter.appIdIphone)
    tags.push({ name: 'twitter:app:id:iphone', content: twitter.appIdIphone });
  if (twitter.appIdIpad) tags.push({ name: 'twitter:app:id:ipad', content: twitter.appIdIpad });
  if (twitter.appIdGooglePlay)
    tags.push({ name: 'twitter:app:id:googleplay', content: twitter.appIdGooglePlay });
  if (twitter.appUrlIphone)
    tags.push({ name: 'twitter:app:url:iphone', content: twitter.appUrlIphone });
  if (twitter.appUrlIpad) tags.push({ name: 'twitter:app:url:ipad', content: twitter.appUrlIpad });
  if (twitter.appUrlGooglePlay)
    tags.push({ name: 'twitter:app:url:googleplay', content: twitter.appUrlGooglePlay });
  if (twitter.appNameIphone)
    tags.push({ name: 'twitter:app:name:iphone', content: twitter.appNameIphone });
  if (twitter.appNameIpad)
    tags.push({ name: 'twitter:app:name:ipad', content: twitter.appNameIpad });
  if (twitter.appNameGooglePlay)
    tags.push({ name: 'twitter:app:name:googleplay', content: twitter.appNameGooglePlay });

  return tags;
}

/**
 * Build hreflang link tags.
 */
export function buildHreflangTags(alternates: HreflangConfig[]): LinkTag[] {
  return alternates.map((alt) => ({
    rel: 'alternate',
    hreflang: alt.hrefLang,
    href: alt.href,
  }));
}

/**
 * Resolve the page title using template, default, and page-specific title.
 */
export function resolveTitle(config: SEOConfig): string | undefined {
  if (config.title && config.titleTemplate) {
    return config.titleTemplate.replace(/%s/g, config.title);
  }

  return config.title ?? config.defaultTitle;
}
