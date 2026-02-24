// ============================================================================
// @power-seo/sitemap — Next.js App Router Adapter
// ============================================================================

import type { SitemapURL } from '@power-seo/core';
import { validateSitemapUrl } from './validate.js';

/**
 * A plain object that matches the shape of Next.js `MetadataRoute.Sitemap[number]`.
 * Typed locally so `@power-seo/sitemap` has no dependency on `next`.
 */
export interface NextSitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
  alternates?: {
    languages?: Record<string, string>;
  };
}

/**
 * Convert an array of `SitemapURL` objects to a Next.js-compatible sitemap array.
 *
 * Use this in `app/sitemap.ts` to bridge `@power-seo/sitemap` with Next.js's
 * built-in `MetadataRoute.Sitemap` convention.
 *
 * @example
 * ```ts
 * // app/sitemap.ts
 * import type { MetadataRoute } from 'next';
 * import { toNextSitemap } from '@power-seo/sitemap';
 *
 * export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 *   const urls = [
 *     { loc: 'https://example.com', changefreq: 'daily', priority: 1.0 },
 *     { loc: 'https://example.com/about', changefreq: 'monthly', priority: 0.8 },
 *   ];
 *   return toNextSitemap(urls) as MetadataRoute.Sitemap;
 * }
 * ```
 */
export function toNextSitemap(urls: SitemapURL[]): NextSitemapEntry[] {
  const entries: NextSitemapEntry[] = [];

  for (const url of urls) {
    const { valid } = validateSitemapUrl(url);
    if (!valid) continue;

    const entry: NextSitemapEntry = { url: url.loc };

    if (url.lastmod) {
      entry.lastModified = url.lastmod;
    }

    if (url.changefreq) {
      entry.changeFrequency = url.changefreq as NextSitemapEntry['changeFrequency'];
    }

    if (url.priority !== undefined) {
      entry.priority = url.priority;
    }

    entries.push(entry);
  }

  return entries;
}
