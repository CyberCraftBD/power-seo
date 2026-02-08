// ============================================================================
// @ccbd-seo/sitemap — Streaming Sitemap Generator
// ============================================================================

import type { SitemapURL } from '@ccbd-seo/core';
import { normalizeUrl } from '@ccbd-seo/core';

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
 * A streaming sitemap generator that yields XML chunks.
 *
 * Useful for server responses where you want to stream the sitemap
 * instead of building the entire XML string in memory.
 *
 * @example
 * ```ts
 * const stream = streamSitemap('https://example.com', urls);
 * for (const chunk of stream) {
 *   response.write(chunk);
 * }
 * ```
 */
export function* streamSitemap(
  hostname: string,
  urls: Iterable<SitemapURL>,
): Generator<string, void, undefined> {
  yield '<?xml version="1.0" encoding="UTF-8"?>\n';
  yield '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  yield '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
  yield '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n';
  yield '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  for (const url of urls) {
    const loc = url.loc.startsWith('http')
      ? url.loc
      : normalizeUrl(`${hostname}${url.loc.startsWith('/') ? '' : '/'}${url.loc}`);

    yield '  <url>\n';
    yield `    <loc>${escapeXml(loc)}</loc>\n`;

    if (url.lastmod) yield `    <lastmod>${escapeXml(url.lastmod)}</lastmod>\n`;
    if (url.changefreq) yield `    <changefreq>${url.changefreq}</changefreq>\n`;
    if (url.priority !== undefined) yield `    <priority>${url.priority.toFixed(1)}</priority>\n`;

    // Images
    if (url.images) {
      for (const img of url.images) {
        yield '    <image:image>\n';
        yield `      <image:loc>${escapeXml(img.loc)}</image:loc>\n`;
        if (img.caption) yield `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
        if (img.title) yield `      <image:title>${escapeXml(img.title)}</image:title>\n`;
        yield '    </image:image>\n';
      }
    }

    // Videos
    if (url.videos) {
      for (const vid of url.videos) {
        yield '    <video:video>\n';
        yield `      <video:thumbnail_loc>${escapeXml(vid.thumbnailLoc)}</video:thumbnail_loc>\n`;
        yield `      <video:title>${escapeXml(vid.title)}</video:title>\n`;
        yield `      <video:description>${escapeXml(vid.description)}</video:description>\n`;
        if (vid.contentLoc) yield `      <video:content_loc>${escapeXml(vid.contentLoc)}</video:content_loc>\n`;
        if (vid.playerLoc) yield `      <video:player_loc>${escapeXml(vid.playerLoc)}</video:player_loc>\n`;
        yield '    </video:video>\n';
      }
    }

    // News
    if (url.news) {
      yield '    <news:news>\n';
      yield '      <news:publication>\n';
      yield `        <news:name>${escapeXml(url.news.publication.name)}</news:name>\n`;
      yield `        <news:language>${escapeXml(url.news.publication.language)}</news:language>\n`;
      yield '      </news:publication>\n';
      yield `      <news:publication_date>${escapeXml(url.news.publicationDate)}</news:publication_date>\n`;
      yield `      <news:title>${escapeXml(url.news.title)}</news:title>\n`;
      yield '    </news:news>\n';
    }

    yield '  </url>\n';
  }

  yield '</urlset>\n';
}
