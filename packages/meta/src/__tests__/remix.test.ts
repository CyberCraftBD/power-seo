import { describe, it, expect } from 'vitest';
import type { SEOConfig } from '@power-seo/core';
import { createMetaDescriptors } from '../remix.js';

describe('createMetaDescriptors', () => {
  it('should return empty array for empty config', () => {
    const result = createMetaDescriptors({});
    expect(result).toEqual([]);
  });

  it('should include title descriptor', () => {
    const config: SEOConfig = { title: 'My Page' };
    const result = createMetaDescriptors(config);
    expect(result).toContainEqual({ title: 'My Page' });
  });

  it('should include description meta descriptor', () => {
    const config: SEOConfig = { description: 'Page description' };
    const result = createMetaDescriptors(config);
    expect(result).toContainEqual({ name: 'description', content: 'Page description' });
  });

  it('should include OG property descriptors', () => {
    const config: SEOConfig = {
      openGraph: {
        title: 'OG Title',
        description: 'OG Description',
        type: 'website',
      },
    };
    const result = createMetaDescriptors(config);
    expect(result).toContainEqual({ property: 'og:type', content: 'website' });
    expect(result).toContainEqual({ property: 'og:title', content: 'OG Title' });
    expect(result).toContainEqual({ property: 'og:description', content: 'OG Description' });
  });

  it('should include Twitter name descriptors', () => {
    const config: SEOConfig = {
      twitter: {
        cardType: 'summary',
        site: '@example',
      },
    };
    const result = createMetaDescriptors(config);
    expect(result).toContainEqual({ name: 'twitter:card', content: 'summary' });
    expect(result).toContainEqual({ name: 'twitter:site', content: '@example' });
  });

  it('should include link descriptors for canonical and hreflang', () => {
    const config: SEOConfig = {
      canonical: 'https://example.com/page',
      languageAlternates: [{ hrefLang: 'es', href: 'https://example.com/es/page' }],
    };
    const result = createMetaDescriptors(config);
    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://example.com/page',
    });
    expect(result).toContainEqual({
      tagName: 'link',
      rel: 'alternate',
      href: 'https://example.com/es/page',
      hrefLang: 'es',
    });
  });

  it('should produce correct descriptor count for full config', () => {
    const config: SEOConfig = {
      title: 'Full Page',
      description: 'Full description',
      canonical: 'https://example.com/full',
      noindex: true,
      openGraph: {
        type: 'website',
        title: 'OG Full',
      },
      twitter: {
        cardType: 'summary',
      },
    };
    const result = createMetaDescriptors(config);
    // title + description + robots + og:type + og:title + twitter:card + canonical link
    expect(result.length).toBe(7);
  });

  it('should include robots meta descriptor', () => {
    const config: SEOConfig = {
      noindex: true,
      nofollow: true,
    };
    const result = createMetaDescriptors(config);
    expect(result).toContainEqual({
      name: 'robots',
      content: expect.stringContaining('noindex'),
    });
  });
});
