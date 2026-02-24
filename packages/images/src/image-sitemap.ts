// @power-seo/images — Image Sitemap Generator
// ----------------------------------------------------------------------------

import { normalizeUrl, isAbsoluteUrl } from '@power-seo/core';
import type { SitemapImage } from '@power-seo/core';
import type { ImageInfo, ImageSitemapPage } from './types.js';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function resolveImageUrl(src: string, pageUrl: string): string {
  if (isAbsoluteUrl(src)) {
    return src;
  }
  try {
    const base = new globalThis.URL(pageUrl);
    return new globalThis.URL(src, base).href;
  } catch {
    return src;
  }
}

export function extractImageEntries(pageUrl: string, images: ImageInfo[]): SitemapImage[] {
  return images
    .filter((img) => img.src && img.src.trim().length > 0)
    .map((img) => {
      const entry: SitemapImage = {
        loc: resolveImageUrl(img.src, pageUrl),
      };
      if (img.alt) {
        entry.caption = img.alt;
        entry.title = img.alt;
      }
      return entry;
    });
}

export function generateImageSitemap(pages: ImageSitemapPage[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  for (const page of pages) {
    const entries = extractImageEntries(page.pageUrl, page.images);
    if (entries.length === 0) continue;

    const normalizedUrl = normalizeUrl(page.pageUrl);
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(normalizedUrl)}</loc>\n`;

    for (const entry of entries) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${escapeXml(entry.loc)}</image:loc>\n`;
      if (entry.caption)
        xml += `      <image:caption>${escapeXml(entry.caption)}</image:caption>\n`;
      if (entry.title) xml += `      <image:title>${escapeXml(entry.title)}</image:title>\n`;
      if (entry.license)
        xml += `      <image:license>${escapeXml(entry.license)}</image:license>\n`;
      xml += '    </image:image>\n';
    }

    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}
