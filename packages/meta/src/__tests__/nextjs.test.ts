import { describe, it, expect } from 'vitest';
import type { SEOConfig } from '@power-seo/core';
import { createMetadata } from '../nextjs.js';

describe('createMetadata', () => {
  it('should return empty object for empty config', () => {
    const result = createMetadata({});
    expect(result).toEqual({});
  });

  it('should map basic title and description', () => {
    const config: SEOConfig = {
      title: 'My Page',
      description: 'A description of my page',
    };
    const result = createMetadata(config);
    expect(result.title).toBe('My Page');
    expect(result.description).toBe('A description of my page');
  });

  it('should use title template with default/template object format', () => {
    const config: SEOConfig = {
      title: 'Home',
      titleTemplate: '%s | My Site',
      defaultTitle: 'My Site',
    };
    const result = createMetadata(config);
    expect(result.title).toEqual({
      template: '%s | My Site',
      default: 'My Site',
    });
  });

  it('should use title as default when defaultTitle is missing with template', () => {
    const config: SEOConfig = {
      title: 'Home',
      titleTemplate: '%s | My Site',
    };
    const result = createMetadata(config);
    expect(result.title).toEqual({
      template: '%s | My Site',
      default: 'Home',
    });
  });

  it('should map robots noindex/nofollow', () => {
    const config: SEOConfig = {
      noindex: true,
      nofollow: true,
    };
    const result = createMetadata(config);
    expect(result.robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it('should map OpenGraph images', () => {
    const config: SEOConfig = {
      openGraph: {
        title: 'OG Title',
        images: [
          { url: 'https://example.com/image.jpg', width: 1200, height: 630, alt: 'Example' },
        ],
      },
    };
    const result = createMetadata(config);
    expect(result.openGraph?.images).toEqual([
      { url: 'https://example.com/image.jpg', width: 1200, height: 630, alt: 'Example' },
    ]);
  });

  it('should map Twitter card fields', () => {
    const config: SEOConfig = {
      twitter: {
        cardType: 'summary_large_image',
        site: '@example',
        creator: '@author',
        title: 'Twitter Title',
        description: 'Twitter Description',
        image: 'https://example.com/twitter.jpg',
      },
    };
    const result = createMetadata(config);
    expect(result.twitter).toEqual({
      card: 'summary_large_image',
      site: '@example',
      creator: '@author',
      title: 'Twitter Title',
      description: 'Twitter Description',
      images: ['https://example.com/twitter.jpg'],
    });
  });

  it('should map canonical and language alternates to alternates', () => {
    const config: SEOConfig = {
      canonical: 'https://example.com/page',
      languageAlternates: [
        { hrefLang: 'en', href: 'https://example.com/en/page' },
        { hrefLang: 'fr', href: 'https://example.com/fr/page' },
      ],
    };
    const result = createMetadata(config);
    expect(result.alternates).toEqual({
      canonical: 'https://example.com/page',
      languages: {
        en: 'https://example.com/en/page',
        fr: 'https://example.com/fr/page',
      },
    });
  });

  it('should map additional meta tags to other', () => {
    const config: SEOConfig = {
      additionalMetaTags: [
        { name: 'author', content: 'John Doe' },
        { name: 'theme-color', content: '#ffffff' },
      ],
    };
    const result = createMetadata(config);
    expect(result.other).toEqual({
      author: 'John Doe',
      'theme-color': '#ffffff',
    });
  });

  it('should map article-specific OG fields', () => {
    const config: SEOConfig = {
      openGraph: {
        type: 'article',
        article: {
          publishedTime: '2024-01-15T00:00:00Z',
          modifiedTime: '2024-01-16T00:00:00Z',
          authors: ['https://example.com/author1'],
          section: 'Technology',
          tags: ['seo', 'typescript'],
        },
      },
    };
    const result = createMetadata(config);
    expect(result.openGraph?.type).toBe('article');
    expect(result.openGraph?.article).toEqual({
      publishedTime: '2024-01-15T00:00:00Z',
      modifiedTime: '2024-01-16T00:00:00Z',
      authors: ['https://example.com/author1'],
      section: 'Technology',
      tags: ['seo', 'typescript'],
    });
  });

  it('should use defaultTitle when title is not provided', () => {
    const config: SEOConfig = {
      defaultTitle: 'Default Title',
    };
    const result = createMetadata(config);
    expect(result.title).toBe('Default Title');
  });
});
