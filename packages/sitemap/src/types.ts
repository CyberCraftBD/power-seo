// ============================================================================
// @ccbd-seo/sitemap — Types
// ============================================================================

export type {
  SitemapURL,
  SitemapImage,
  SitemapVideo,
  SitemapNews,
  SitemapConfig,
} from '@ccbd-seo/core';

/** A sitemap entry in a sitemap index. */
export interface SitemapIndexEntry {
  loc: string;
  lastmod?: string;
}

/** Configuration for the sitemap index generator. */
export interface SitemapIndexConfig {
  sitemaps: SitemapIndexEntry[];
}

/** Result of URL validation. */
export interface SitemapValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/** Maximum URLs allowed per sitemap file. */
export const MAX_URLS_PER_SITEMAP = 50_000;

/** Maximum sitemap file size in bytes (50MB). */
export const MAX_SITEMAP_SIZE_BYTES = 50 * 1024 * 1024;
