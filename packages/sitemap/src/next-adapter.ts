// @power-seo/sitemap — Next.js App Router Adapter
// ----------------------------------------------------------------------------

import type { SitemapURL } from '@power-seo/core';
import { validateSitemapUrl } from './validate.js';

/** Plain object matching the shape of Next.js `MetadataRoute.Sitemap[number]`. */
export interface NextSitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Convert `SitemapURL[]` to a plain array compatible with Next.js `MetadataRoute.Sitemap`.
 *
 * @example
 * ```ts
 * // app/sitemap.ts
 * import { toNextSitemap } from '@power-seo/sitemap';
 * export default async function sitemap() {
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
    if (url.lastmod) entry.lastModified = url.lastmod;
    if (url.changefreq) entry.changeFrequency = url.changefreq as NextSitemapEntry['changeFrequency'];
    if (url.priority !== undefined) entry.priority = url.priority;
    entries.push(entry);
  }
  return entries;
}
