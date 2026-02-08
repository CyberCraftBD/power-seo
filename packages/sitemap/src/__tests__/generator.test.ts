import { describe, it, expect } from 'vitest';
import { generateSitemap } from '../generator.js';

describe('generateSitemap', () => {
  it('generates a basic sitemap', () => {
    const xml = generateSitemap({
      hostname: 'https://example.com',
      urls: [
        { loc: '/', changefreq: 'daily', priority: 1.0 },
        { loc: '/about', changefreq: 'monthly', priority: 0.8 },
      ],
    });

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<loc>https://example.com/</loc>');
    expect(xml).toContain('<loc>https://example.com/about</loc>');
    expect(xml).toContain('<changefreq>daily</changefreq>');
    expect(xml).toContain('<priority>1.0</priority>');
    expect(xml).toContain('</urlset>');
  });

  it('handles absolute URLs in loc', () => {
    const xml = generateSitemap({
      hostname: 'https://example.com',
      urls: [{ loc: 'https://example.com/custom-path' }],
    });

    expect(xml).toContain('<loc>https://example.com/custom-path</loc>');
  });

  it('includes lastmod', () => {
    const xml = generateSitemap({
      hostname: 'https://example.com',
      urls: [{ loc: '/page', lastmod: '2024-01-15' }],
    });

    expect(xml).toContain('<lastmod>2024-01-15</lastmod>');
  });

  it('includes image namespace and tags when images present', () => {
    const xml = generateSitemap({
      hostname: 'https://example.com',
      urls: [
        {
          loc: '/gallery',
          images: [
            { loc: 'https://example.com/img1.jpg', caption: 'Photo 1', title: 'Image One' },
            { loc: 'https://example.com/img2.jpg' },
          ],
        },
      ],
    });

    expect(xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
    expect(xml).toContain('<image:image>');
    expect(xml).toContain('<image:loc>https://example.com/img1.jpg</image:loc>');
    expect(xml).toContain('<image:caption>Photo 1</image:caption>');
    expect(xml).toContain('<image:title>Image One</image:title>');
  });

  it('includes video namespace and tags when videos present', () => {
    const xml = generateSitemap({
      hostname: 'https://example.com',
      urls: [
        {
          loc: '/video-page',
          videos: [
            {
              thumbnailLoc: 'https://example.com/thumb.jpg',
              title: 'My Video',
              description: 'A great video.',
              contentLoc: 'https://example.com/video.mp4',
              duration: 120,
              rating: 4.5,
              viewCount: 1000,
              familyFriendly: true,
            },
          ],
        },
      ],
    });

    expect(xml).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
    expect(xml).toContain('<video:video>');
    expect(xml).toContain('<video:title>My Video</video:title>');
    expect(xml).toContain('<video:duration>120</video:duration>');
    expect(xml).toContain('<video:rating>4.5</video:rating>');
    expect(xml).toContain('<video:family_friendly>yes</video:family_friendly>');
  });

  it('includes news namespace and tags when news present', () => {
    const xml = generateSitemap({
      hostname: 'https://example.com',
      urls: [
        {
          loc: '/news/breaking',
          news: {
            publication: { name: 'Example News', language: 'en' },
            publicationDate: '2024-01-15',
            title: 'Breaking News Story',
          },
        },
      ],
    });

    expect(xml).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');
    expect(xml).toContain('<news:name>Example News</news:name>');
    expect(xml).toContain('<news:language>en</news:language>');
    expect(xml).toContain('<news:title>Breaking News Story</news:title>');
  });

  it('escapes special XML characters', () => {
    const xml = generateSitemap({
      hostname: 'https://example.com',
      urls: [{ loc: '/search?q=a&b=c' }],
    });

    expect(xml).toContain('&amp;');
    expect(xml).not.toMatch(/<loc>[^<]*[^;]&[^a]/);
  });

  it('generates empty sitemap for no URLs', () => {
    const xml = generateSitemap({
      hostname: 'https://example.com',
      urls: [],
    });

    expect(xml).toContain('<urlset');
    expect(xml).toContain('</urlset>');
    expect(xml).not.toContain('<url>');
  });

  it('does not include unused namespaces', () => {
    const xml = generateSitemap({
      hostname: 'https://example.com',
      urls: [{ loc: '/simple' }],
    });

    expect(xml).not.toContain('xmlns:image');
    expect(xml).not.toContain('xmlns:video');
    expect(xml).not.toContain('xmlns:news');
  });
});
