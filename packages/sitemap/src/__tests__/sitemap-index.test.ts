import { describe, it, expect } from 'vitest';
import { generateSitemapIndex, splitSitemap } from '../sitemap-index.js';

describe('generateSitemapIndex', () => {
  it('generates a valid sitemap index', () => {
    const xml = generateSitemapIndex({
      sitemaps: [
        { loc: 'https://example.com/sitemap-0.xml', lastmod: '2024-01-15' },
        { loc: 'https://example.com/sitemap-1.xml' },
      ],
    });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<loc>https://example.com/sitemap-0.xml</loc>');
    expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
    expect(xml).toContain('<loc>https://example.com/sitemap-1.xml</loc>');
    expect(xml).toContain('</sitemapindex>');
  });

  it('generates empty sitemap index', () => {
    const xml = generateSitemapIndex({ sitemaps: [] });

    expect(xml).toContain('<sitemapindex');
    expect(xml).toContain('</sitemapindex>');
    expect(xml).not.toContain('<sitemap>');
  });
});

describe('splitSitemap', () => {
  it('returns single sitemap when under limit', () => {
    const urls = Array.from({ length: 10 }, (_, i) => ({ loc: `/page-${i}` }));
    const result = splitSitemap({
      hostname: 'https://example.com',
      urls,
    });

    expect(result.sitemaps).toHaveLength(1);
    expect(result.index).toContain('<sitemapindex');
    expect(result.sitemaps[0]!.xml).toContain('<urlset');
  });

  it('splits into multiple sitemaps when over limit', () => {
    const urls = Array.from({ length: 15 }, (_, i) => ({ loc: `/page-${i}` }));
    const result = splitSitemap(
      { hostname: 'https://example.com', urls, maxUrlsPerSitemap: 5 },
    );

    expect(result.sitemaps).toHaveLength(3);
    expect(result.index).toContain('sitemap-0.xml');
    expect(result.index).toContain('sitemap-1.xml');
    expect(result.index).toContain('sitemap-2.xml');

    // Each sitemap should have 5 URLs
    for (const sitemap of result.sitemaps) {
      expect(sitemap.xml).toContain('<urlset');
    }
  });

  it('uses custom URL pattern', () => {
    const urls = Array.from({ length: 3 }, (_, i) => ({ loc: `/p${i}` }));
    const result = splitSitemap(
      { hostname: 'https://example.com', urls, maxUrlsPerSitemap: 2 },
      '/sitemaps/pages-{index}.xml',
    );

    expect(result.sitemaps[0]!.filename).toBe('/sitemaps/pages-0.xml');
    expect(result.sitemaps[1]!.filename).toBe('/sitemaps/pages-1.xml');
    expect(result.index).toContain('/sitemaps/pages-0.xml');
  });
});
