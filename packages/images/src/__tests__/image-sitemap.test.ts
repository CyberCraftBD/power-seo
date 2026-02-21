import { describe, it, expect } from 'vitest';
import { extractImageEntries, generateImageSitemap } from '../image-sitemap.js';
import type { ImageInfo, ImageSitemapPage } from '../types.js';

describe('extractImageEntries', () => {
  it('should convert ImageInfo to SitemapImage entries', () => {
    const images: ImageInfo[] = [{ src: 'https://example.com/photo.jpg', alt: 'A nice photo' }];
    const entries = extractImageEntries('https://example.com/page', images);
    expect(entries).toHaveLength(1);
    expect(entries[0].loc).toBe('https://example.com/photo.jpg');
    expect(entries[0].caption).toBe('A nice photo');
    expect(entries[0].title).toBe('A nice photo');
  });

  it('should resolve relative URLs against page URL', () => {
    const images: ImageInfo[] = [{ src: '/images/photo.jpg', alt: 'Photo' }];
    const entries = extractImageEntries('https://example.com/blog/post', images);
    expect(entries[0].loc).toBe('https://example.com/images/photo.jpg');
  });

  it('should filter out images with empty src', () => {
    const images: ImageInfo[] = [
      { src: '', alt: 'Empty' },
      { src: '/valid.jpg', alt: 'Valid' },
    ];
    const entries = extractImageEntries('https://example.com/', images);
    expect(entries).toHaveLength(1);
    expect(entries[0].loc).toContain('valid.jpg');
  });
});

describe('generateImageSitemap', () => {
  it('should generate valid XML with image extensions', () => {
    const pages: ImageSitemapPage[] = [
      {
        pageUrl: 'https://example.com/page',
        images: [{ src: 'https://example.com/photo.jpg', alt: 'Test photo' }],
      },
    ];
    const xml = generateImageSitemap(pages);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    expect(xml).toContain('<image:loc>https://example.com/photo.jpg</image:loc>');
    expect(xml).toContain('<image:caption>Test photo</image:caption>');
    expect(xml).toContain('</urlset>');
  });

  it('should skip pages with no images', () => {
    const pages: ImageSitemapPage[] = [{ pageUrl: 'https://example.com/page', images: [] }];
    const xml = generateImageSitemap(pages);
    expect(xml).not.toContain('<url>');
    expect(xml).toContain('<urlset');
    expect(xml).toContain('</urlset>');
  });

  it('should handle empty pages array', () => {
    const xml = generateImageSitemap([]);
    expect(xml).toContain('<?xml version');
    expect(xml).toContain('</urlset>');
    expect(xml).not.toContain('<url>');
  });

  it('should escape special XML characters', () => {
    const pages: ImageSitemapPage[] = [
      {
        pageUrl: 'https://example.com/page?a=1&b=2',
        images: [{ src: 'https://example.com/photo.jpg', alt: 'Rock & Roll <live>' }],
      },
    ];
    const xml = generateImageSitemap(pages);
    expect(xml).toContain('&amp;');
    expect(xml).toContain('&lt;live&gt;');
  });
});
