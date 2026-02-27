import { describe, it, expect } from 'vitest';
import { streamSitemap } from '../stream.js';

describe('streamSitemap', () => {
  it('streams a valid sitemap', () => {
    const urls = [
      { loc: '/', changefreq: 'daily' as const, priority: 1.0 },
      { loc: '/about', lastmod: '2024-01-15' },
    ];

    const chunks: string[] = [];
    for (const chunk of streamSitemap('https://example.com', urls)) {
      chunks.push(chunk);
    }

    const xml = chunks.join('');
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset');
    expect(xml).toContain('<loc>https://example.com/</loc>');
    expect(xml).toContain('<loc>https://example.com/about</loc>');
    expect(xml).toContain('<changefreq>daily</changefreq>');
    expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
    expect(xml).toContain('</urlset>');
  });

  it('streams an empty sitemap', () => {
    const chunks: string[] = [];
    for (const chunk of streamSitemap('https://example.com', [])) {
      chunks.push(chunk);
    }

    const xml = chunks.join('');
    expect(xml).toContain('<urlset');
    expect(xml).toContain('</urlset>');
    expect(xml).not.toContain('<url>');
  });

  it('produces multiple chunks', () => {
    const urls = [{ loc: '/page' }];
    const chunks: string[] = [];
    for (const chunk of streamSitemap('https://example.com', urls)) {
      chunks.push(chunk);
    }

    // Should have header chunks + url chunks + closing chunk
    expect(chunks.length).toBeGreaterThan(3);
  });

  it('streams images', () => {
    const urls = [
      {
        loc: '/gallery',
        images: [{ loc: 'https://example.com/img.jpg', caption: 'A photo' }],
      },
    ];

    const chunks: string[] = [];
    for (const chunk of streamSitemap('https://example.com', urls)) {
      chunks.push(chunk);
    }

    const xml = chunks.join('');
    expect(xml).toContain('<image:image>');
    expect(xml).toContain('<image:loc>https://example.com/img.jpg</image:loc>');
    expect(xml).toContain('<image:caption>A photo</image:caption>');
  });

  it('streams news', () => {
    const urls = [
      {
        loc: '/news/story',
        news: {
          publication: { name: 'Test News', language: 'en' },
          publicationDate: '2024-06-01',
          title: 'Big Story',
        },
      },
    ];

    const chunks: string[] = [];
    for (const chunk of streamSitemap('https://example.com', urls)) {
      chunks.push(chunk);
    }

    const xml = chunks.join('');
    expect(xml).toContain('<news:news>');
    expect(xml).toContain('<news:name>Test News</news:name>');
    expect(xml).toContain('<news:title>Big Story</news:title>');
  });

  it('works with iterable (generator)', () => {
    function* urlGenerator() {
      yield { loc: '/page-1' };
      yield { loc: '/page-2' };
    }

    const chunks: string[] = [];
    for (const chunk of streamSitemap('https://example.com', urlGenerator())) {
      chunks.push(chunk);
    }

    const xml = chunks.join('');
    expect(xml).toContain('/page-1');
    expect(xml).toContain('/page-2');
  });
});
