// @power-seo/sitemap — Next.js App Router Adapter
// ----------------------------------------------------------------------------

import type { SitemapURL } from '@power-seo/core';
import { validateSitemapUrl } from './validate.js';

/**
 * Next.js MetadataRoute.Sitemap entry shape.
 * Mirrors `import type { MetadataRoute } from 'next'` — no next dependency required.
 */
export interface NextSitemapEntry {
  url: string;
  lastModified?: Date | string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Convert an array of SitemapURL objects to the format expected by
 * Next.js App Router's `app/sitemap.ts` convention.
 *
 * Invalid URLs (per validateSitemapUrl) are filtered out automatically.
 * Relative `loc` values are returned as-is; pass absolute URLs for
 * compatibility with Next.js's sitemap renderer.
 *
 * @example
 * ```ts
 * // app/sitemap.ts
 * import { toNextSitemap } from '@power-seo/sitemap/next';
 *
 * export default function sitemap() {
 *   return toNextSitemap([
 *     { loc: 'https://example.com/', lastmod: '2026-01-01', changefreq: 'daily', priority: 1.0 },
 *     { loc: 'https://example.com/about', changefreq: 'monthly', priority: 0.8 },
 *   ]);
 * }
 * ```
 */
export function toNextSitemap(urls: SitemapURL[]): NextSitemapEntry[] {
  return urls
    .filter((url) => validateSitemapUrl(url).valid)
    .map((url) => {
      const entry: NextSitemapEntry = { url: url.loc };
      if (url.lastmod !== undefined) entry.lastModified = new Date(url.lastmod);
      if (url.changefreq !== undefined) entry.changeFrequency = url.changefreq;
      if (url.priority !== undefined) entry.priority = url.priority;
      return entry;
    });
}
