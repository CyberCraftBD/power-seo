// @power-seo/sitemap — Next.js App Router Adapter

import type { SitemapURL } from '@power-seo/core';
import { normalizeUrl } from '@power-seo/core';
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
 * Relative `loc` values (e.g. `/about`) are resolved against `hostname` when it is
 * provided, matching `generateSitemap`. Without a `hostname`, relative URLs cannot be
 * made absolute and are skipped (Next.js requires absolute URLs).
 *
 * @example
 * ```ts
 * // app/sitemap.ts
 * import { toNextSitemap } from '@power-seo/sitemap';
 * export default async function sitemap() {
 *   return toNextSitemap(urls, 'https://example.com') as MetadataRoute.Sitemap;
 * }
 * ```
 */
export function toNextSitemap(urls: SitemapURL[], hostname?: string): NextSitemapEntry[] {
  const entries: NextSitemapEntry[] = [];
  for (const url of urls) {
    const loc = url.loc.startsWith('http')
      ? url.loc
      : hostname
        ? normalizeUrl(`${hostname}${url.loc.startsWith('/') ? '' : '/'}${url.loc}`)
        : url.loc;
    const { valid } = validateSitemapUrl({ ...url, loc });
    if (!valid) continue;
    const entry: NextSitemapEntry = { url: loc };
    if (url.lastmod) entry.lastModified = url.lastmod;
    if (url.changefreq)
      entry.changeFrequency = url.changefreq as NextSitemapEntry['changeFrequency'];
    if (url.priority !== undefined) entry.priority = url.priority;
    entries.push(entry);
  }
  return entries;
}
