// ============================================================================
// @ccbd-seo/preview — SERP Preview Generator
// ============================================================================

import {
  TITLE_MAX_PIXELS,
  META_DESCRIPTION_MAX_PIXELS,
  validateTitle,
  validateMetaDescription,
} from '@ccbd-seo/core';
import type { SerpPreviewInput, SerpPreviewData } from './types.js';
import { truncateAtPixelWidth } from './truncate.js';

/**
 * Format a URL as a Google-style breadcrumb path.
 * e.g., "https://example.com/blog/my-post?q=1" → "example.com › blog › my-post"
 */
function formatBreadcrumbUrl(url: string): string {
  try {
    const parsed = new globalThis.URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const pathSegments = parsed.pathname
      .split('/')
      .filter((seg) => seg.length > 0);

    if (pathSegments.length === 0) {
      return host;
    }

    return [host, ...pathSegments].join(' › ');
  } catch {
    return url;
  }
}

/**
 * Generate a Google SERP preview from title, description, and URL.
 */
export function generateSerpPreview(config: SerpPreviewInput): SerpPreviewData {
  const { title, description, url, siteTitle } = config;

  const displayTitle = siteTitle ? `${title} - ${siteTitle}` : title;

  const truncatedTitle = truncateAtPixelWidth(displayTitle, TITLE_MAX_PIXELS);
  const truncatedDescription = truncateAtPixelWidth(description, META_DESCRIPTION_MAX_PIXELS);

  const titleValidation = validateTitle(displayTitle);
  const descriptionValidation = validateMetaDescription(description);

  return {
    title: truncatedTitle.text,
    displayUrl: formatBreadcrumbUrl(url),
    description: truncatedDescription.text,
    titleTruncated: truncatedTitle.truncated,
    descriptionTruncated: truncatedDescription.truncated,
    titleValidation,
    descriptionValidation,
  };
}
