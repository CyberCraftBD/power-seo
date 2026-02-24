// ============================================================================
// @power-seo/sitemap — Public API
// ============================================================================

export { generateSitemap } from './generator.js';
export { generateSitemapIndex, splitSitemap } from './sitemap-index.js';
export { streamSitemap } from './stream.js';
export { validateSitemapUrl } from './validate.js';
export { toNextSitemap } from './next-adapter.js';
export type { NextSitemapEntry } from './next-adapter.js';

export type {
  SitemapURL,
  SitemapImage,
  SitemapVideo,
  SitemapNews,
  SitemapConfig,
  SitemapIndexEntry,
  SitemapIndexConfig,
  SitemapValidationResult,
} from './types.js';

export { MAX_URLS_PER_SITEMAP, MAX_SITEMAP_SIZE_BYTES } from './types.js';
