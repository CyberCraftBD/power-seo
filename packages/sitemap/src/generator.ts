// ============================================================================
// @ccbd-seo/sitemap — XML Sitemap Generator
// ============================================================================

import type { SitemapConfig, SitemapURL, SitemapImage, SitemapVideo, SitemapNews } from '@ccbd-seo/core';
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

/** Determine which namespace extensions are needed. */
function detectNamespaces(urls: SitemapURL[]): { image: boolean; video: boolean; news: boolean } {
  let image = false;
  let video = false;
  let news = false;
  for (const url of urls) {
    if (url.images && url.images.length > 0) image = true;
    if (url.videos && url.videos.length > 0) video = true;
    if (url.news) news = true;
    if (image && video && news) break;
  }
  return { image, video, news };
}

function buildImageXml(images: SitemapImage[]): string {
  return images
    .map((img) => {
      let xml = '    <image:image>\n';
      xml += `      <image:loc>${escapeXml(img.loc)}</image:loc>\n`;
      if (img.caption) xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
      if (img.geoLocation) xml += `      <image:geo_location>${escapeXml(img.geoLocation)}</image:geo_location>\n`;
      if (img.title) xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
      if (img.license) xml += `      <image:license>${escapeXml(img.license)}</image:license>\n`;
      xml += '    </image:image>\n';
      return xml;
    })
    .join('');
}

function buildVideoXml(videos: SitemapVideo[]): string {
  return videos
    .map((vid) => {
      let xml = '    <video:video>\n';
      xml += `      <video:thumbnail_loc>${escapeXml(vid.thumbnailLoc)}</video:thumbnail_loc>\n`;
      xml += `      <video:title>${escapeXml(vid.title)}</video:title>\n`;
      xml += `      <video:description>${escapeXml(vid.description)}</video:description>\n`;
      if (vid.contentLoc) xml += `      <video:content_loc>${escapeXml(vid.contentLoc)}</video:content_loc>\n`;
      if (vid.playerLoc) xml += `      <video:player_loc>${escapeXml(vid.playerLoc)}</video:player_loc>\n`;
      if (vid.duration !== undefined) xml += `      <video:duration>${vid.duration}</video:duration>\n`;
      if (vid.expirationDate) xml += `      <video:expiration_date>${escapeXml(vid.expirationDate)}</video:expiration_date>\n`;
      if (vid.rating !== undefined) xml += `      <video:rating>${vid.rating}</video:rating>\n`;
      if (vid.viewCount !== undefined) xml += `      <video:view_count>${vid.viewCount}</video:view_count>\n`;
      if (vid.publicationDate) xml += `      <video:publication_date>${escapeXml(vid.publicationDate)}</video:publication_date>\n`;
      if (vid.familyFriendly !== undefined) xml += `      <video:family_friendly>${vid.familyFriendly ? 'yes' : 'no'}</video:family_friendly>\n`;
      if (vid.live !== undefined) xml += `      <video:live>${vid.live ? 'yes' : 'no'}</video:live>\n`;
      xml += '    </video:video>\n';
      return xml;
    })
    .join('');
}

function buildNewsXml(news: SitemapNews): string {
  let xml = '    <news:news>\n';
  xml += '      <news:publication>\n';
  xml += `        <news:name>${escapeXml(news.publication.name)}</news:name>\n`;
  xml += `        <news:language>${escapeXml(news.publication.language)}</news:language>\n`;
  xml += '      </news:publication>\n';
  xml += `      <news:publication_date>${escapeXml(news.publicationDate)}</news:publication_date>\n`;
  xml += `      <news:title>${escapeXml(news.title)}</news:title>\n`;
  xml += '    </news:news>\n';
  return xml;
}

function buildUrlXml(url: SitemapURL, hostname: string): string {
  const loc = url.loc.startsWith('http') ? url.loc : normalizeUrl(`${hostname}${url.loc.startsWith('/') ? '' : '/'}${url.loc}`);

  let xml = '  <url>\n';
  xml += `    <loc>${escapeXml(loc)}</loc>\n`;
  if (url.lastmod) xml += `    <lastmod>${escapeXml(url.lastmod)}</lastmod>\n`;
  if (url.changefreq) xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
  if (url.priority !== undefined) xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
  if (url.images && url.images.length > 0) xml += buildImageXml(url.images);
  if (url.videos && url.videos.length > 0) xml += buildVideoXml(url.videos);
  if (url.news) xml += buildNewsXml(url.news);
  xml += '  </url>\n';
  return xml;
}

/**
 * Generate an XML sitemap string from a sitemap configuration.
 *
 * @example
 * ```ts
 * const xml = generateSitemap({
 *   hostname: 'https://example.com',
 *   urls: [
 *     { loc: '/', changefreq: 'daily', priority: 1.0 },
 *     { loc: '/about', changefreq: 'monthly', priority: 0.8 },
 *   ],
 * });
 * ```
 */
export function generateSitemap(config: SitemapConfig): string {
  const { hostname, urls } = config;
  const ns = detectNamespaces(urls);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  if (ns.image) xml += '\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  if (ns.video) xml += '\n        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"';
  if (ns.news) xml += '\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"';
  xml += '>\n';

  for (const url of urls) {
    xml += buildUrlXml(url, hostname);
  }

  xml += '</urlset>\n';
  return xml;
}
