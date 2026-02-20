// ============================================================================
// @power-seo/sitemap — Sitemap Index Generator
// ============================================================================

import type { SitemapConfig } from '@power-seo/core';
import type { SitemapIndexConfig, SitemapIndexEntry } from './types.js';
import { MAX_URLS_PER_SITEMAP } from './types.js';
import { generateSitemap } from './generator.js';

/** Escape special XML characters. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a sitemap index XML string.
 *
 * @example
 * ```ts
 * const indexXml = generateSitemapIndex({
 *   sitemaps: [
 *     { loc: 'https://example.com/sitemap-0.xml', lastmod: '2024-01-01' },
 *     { loc: 'https://example.com/sitemap-1.xml', lastmod: '2024-01-01' },
 *   ],
 * });
 * ```
 */
export function generateSitemapIndex(config: SitemapIndexConfig): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const sitemap of config.sitemaps) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${escapeXml(sitemap.loc)}</loc>\n`;
    if (sitemap.lastmod) {
      xml += `    <lastmod>${escapeXml(sitemap.lastmod)}</lastmod>\n`;
    }
    xml += '  </sitemap>\n';
  }

  xml += '</sitemapindex>\n';
  return xml;
}

/**
 * Split a large sitemap config into multiple sitemaps + an index.
 *
 * When a site has more than 50,000 URLs, this function splits them into
 * multiple sitemap files and returns both the individual sitemaps and
 * the index that references them.
 *
 * @example
 * ```ts
 * const { index, sitemaps } = splitSitemap({
 *   hostname: 'https://example.com',
 *   urls: largeUrlArray,
 * });
 * // sitemaps[0].xml, sitemaps[1].xml, etc.
 * // index = sitemap index XML
 * ```
 */
export function splitSitemap(
  config: SitemapConfig,
  sitemapUrlPattern = '/sitemap-{index}.xml',
): { index: string; sitemaps: Array<{ filename: string; xml: string }> } {
  const maxPerSitemap = config.maxUrlsPerSitemap ?? MAX_URLS_PER_SITEMAP;
  const { hostname, urls } = config;

  if (urls.length <= maxPerSitemap) {
    const xml = generateSitemap(config);
    const filename = sitemapUrlPattern.replace('{index}', '0');
    const indexEntries: SitemapIndexEntry[] = [{ loc: `${hostname}${filename}` }];
    return {
      index: generateSitemapIndex({ sitemaps: indexEntries }),
      sitemaps: [{ filename, xml }],
    };
  }

  const sitemaps: Array<{ filename: string; xml: string }> = [];
  const indexEntries: SitemapIndexEntry[] = [];

  for (let i = 0; i < urls.length; i += maxPerSitemap) {
    const chunk = urls.slice(i, i + maxPerSitemap);
    const chunkIndex = Math.floor(i / maxPerSitemap);
    const filename = sitemapUrlPattern.replace('{index}', String(chunkIndex));
    const xml = generateSitemap({ hostname, urls: chunk });

    sitemaps.push({ filename, xml });
    indexEntries.push({ loc: `${hostname}${filename}` });
  }

  return {
    index: generateSitemapIndex({ sitemaps: indexEntries }),
    sitemaps,
  };
}
