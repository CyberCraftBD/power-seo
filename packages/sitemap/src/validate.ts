// ============================================================================
// @power-seo/sitemap — URL Validation
// ============================================================================

import type { SitemapURL } from '@power-seo/core';
import { isAbsoluteUrl, MAX_URL_LENGTH } from '@power-seo/core';
import type { SitemapValidationResult } from './types.js';

const VALID_CHANGEFREQ = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

/**
 * Validate a sitemap URL entry against the sitemap protocol spec.
 */
export function validateSitemapUrl(url: SitemapURL): SitemapValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // loc is required
  if (!url.loc || url.loc.trim().length === 0) {
    errors.push('URL "loc" is required and cannot be empty.');
  } else {
    if (!isAbsoluteUrl(url.loc)) {
      errors.push(`URL "${url.loc}" must be an absolute URL (starting with http:// or https://).`);
    }

    if (url.loc.length > 2048) {
      errors.push(`URL "${url.loc}" exceeds the maximum length of 2048 characters.`);
    }

    if (url.loc.length > MAX_URL_LENGTH) {
      warnings.push(
        `URL "${url.loc}" is ${url.loc.length} characters. URLs under ${MAX_URL_LENGTH} characters are recommended for SEO.`,
      );
    }
  }

  // lastmod validation
  if (url.lastmod) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)?)?$/;
    if (!dateRegex.test(url.lastmod)) {
      errors.push(
        `"lastmod" value "${url.lastmod}" is not a valid W3C datetime format (YYYY-MM-DD or ISO 8601).`,
      );
    }
  }

  // changefreq validation
  if (url.changefreq && !VALID_CHANGEFREQ.includes(url.changefreq)) {
    errors.push(
      `"changefreq" value "${url.changefreq}" is invalid. Must be one of: ${VALID_CHANGEFREQ.join(', ')}.`,
    );
  }

  // priority validation
  if (url.priority !== undefined) {
    if (url.priority < 0 || url.priority > 1) {
      errors.push(`"priority" value ${url.priority} is out of range. Must be between 0.0 and 1.0.`);
    }
  }

  // Image validation
  if (url.images) {
    for (let i = 0; i < url.images.length; i++) {
      const img = url.images[i]!;
      if (!img.loc || img.loc.trim().length === 0) {
        errors.push(`Image ${i + 1}: "loc" is required.`);
      } else if (!isAbsoluteUrl(img.loc)) {
        errors.push(`Image ${i + 1}: "${img.loc}" must be an absolute URL.`);
      }
    }
    if (url.images.length > 1000) {
      warnings.push(`URL has ${url.images.length} images. Google supports up to 1,000 images per page.`);
    }
  }

  // Video validation
  if (url.videos) {
    for (let i = 0; i < url.videos.length; i++) {
      const vid = url.videos[i]!;
      if (!vid.title) errors.push(`Video ${i + 1}: "title" is required.`);
      if (!vid.description) errors.push(`Video ${i + 1}: "description" is required.`);
      if (!vid.thumbnailLoc) errors.push(`Video ${i + 1}: "thumbnailLoc" is required.`);
      if (!vid.contentLoc && !vid.playerLoc) {
        errors.push(`Video ${i + 1}: either "contentLoc" or "playerLoc" must be provided.`);
      }
      if (vid.rating !== undefined && (vid.rating < 0 || vid.rating > 5)) {
        errors.push(`Video ${i + 1}: "rating" must be between 0.0 and 5.0.`);
      }
    }
  }

  // News validation
  if (url.news) {
    if (!url.news.publication?.name) errors.push('News: "publication.name" is required.');
    if (!url.news.publication?.language) errors.push('News: "publication.language" is required.');
    if (!url.news.publicationDate) errors.push('News: "publicationDate" is required.');
    if (!url.news.title) errors.push('News: "title" is required.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
