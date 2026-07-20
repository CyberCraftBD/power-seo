import { describe, it, expect } from 'vitest';
import { buildMetaTags, buildLinkTags, resolveTitle } from '../meta-builder.js';

describe('buildMetaTags', () => {
  it('should build description tag', () => {
    const tags = buildMetaTags({ description: 'A test description' });
    expect(tags).toContainEqual({ name: 'description', content: 'A test description' });
  });

  it('should build robots tag for noindex', () => {
    const tags = buildMetaTags({ noindex: true });
    const robotsTag = tags.find((t) => t.name === 'robots');
    expect(robotsTag).toBeDefined();
    expect(robotsTag?.content).toContain('noindex');
  });

  it('should build Open Graph tags', () => {
    const tags = buildMetaTags({
      openGraph: {
        title: 'OG Title',
        type: 'website',
        url: 'https://example.com',
      },
    });
    expect(tags).toContainEqual({ property: 'og:title', content: 'OG Title' });
    expect(tags).toContainEqual({ property: 'og:type', content: 'website' });
  });

  it('should build Twitter Card tags', () => {
    const tags = buildMetaTags({
      twitter: {
        cardType: 'summary_large_image',
        site: '@example',
        title: 'Twitter Title',
      },
    });
    expect(tags).toContainEqual({ name: 'twitter:card', content: 'summary_large_image' });
    expect(tags).toContainEqual({ name: 'twitter:site', content: '@example' });
  });

  it('should include OG image properties', () => {
    const tags = buildMetaTags({
      openGraph: {
        images: [
          {
            url: 'https://example.com/image.jpg',
            width: 1200,
            height: 630,
            alt: 'Test image',
          },
        ],
      },
    });
    expect(tags).toContainEqual({ property: 'og:image', content: 'https://example.com/image.jpg' });
    expect(tags).toContainEqual({ property: 'og:image:width', content: '1200' });
    expect(tags).toContainEqual({ property: 'og:image:height', content: '630' });
    expect(tags).toContainEqual({ property: 'og:image:alt', content: 'Test image' });
  });

  it('should include additional meta tags', () => {
    const tags = buildMetaTags({
      additionalMetaTags: [{ name: 'author', content: 'John Doe' }],
    });
    expect(tags).toContainEqual({ name: 'author', content: 'John Doe' });
  });

  it('should derive og/twitter title, description, and url from top-level fields', () => {
    const tags = buildMetaTags({
      title: 'Page Title',
      description: 'Page description',
      canonical: 'https://example.com/page',
      openGraph: { images: [{ url: 'https://example.com/og.png' }] },
      twitter: { cardType: 'summary_large_image' },
    });
    expect(tags).toContainEqual({ property: 'og:title', content: 'Page Title' });
    expect(tags).toContainEqual({ property: 'og:description', content: 'Page description' });
    expect(tags).toContainEqual({ property: 'og:url', content: 'https://example.com/page' });
    expect(tags).toContainEqual({ name: 'twitter:title', content: 'Page Title' });
    expect(tags).toContainEqual({ name: 'twitter:description', content: 'Page description' });
  });

  it('should prefer explicit og/twitter fields over top-level fallbacks', () => {
    const tags = buildMetaTags({
      title: 'Page Title',
      description: 'Page description',
      canonical: 'https://example.com/page',
      openGraph: {
        title: 'OG Title',
        description: 'OG description',
        url: 'https://example.com/og',
      },
      twitter: { title: 'TW Title', description: 'TW description' },
    });
    expect(tags).toContainEqual({ property: 'og:title', content: 'OG Title' });
    expect(tags).toContainEqual({ property: 'og:description', content: 'OG description' });
    expect(tags).toContainEqual({ property: 'og:url', content: 'https://example.com/og' });
    expect(tags).toContainEqual({ name: 'twitter:title', content: 'TW Title' });
    expect(tags).toContainEqual({ name: 'twitter:description', content: 'TW description' });
  });
});

describe('buildLinkTags', () => {
  it('should build canonical tag', () => {
    const tags = buildLinkTags({ canonical: 'https://example.com/page' });
    expect(tags).toContainEqual({ rel: 'canonical', href: 'https://example.com/page' });
  });

  it('should build hreflang tags', () => {
    const tags = buildLinkTags({
      languageAlternates: [
        { hrefLang: 'en', href: 'https://example.com/en' },
        { hrefLang: 'fr', href: 'https://example.com/fr' },
      ],
    });
    expect(tags).toHaveLength(2);
    expect(tags[0]).toEqual({
      rel: 'alternate',
      hreflang: 'en',
      href: 'https://example.com/en',
    });
  });
});

describe('resolveTitle', () => {
  it('should apply template to title', () => {
    expect(resolveTitle({ title: 'About', titleTemplate: '%s | My Site' })).toBe('About | My Site');
  });

  it('should return title when no template', () => {
    expect(resolveTitle({ title: 'About' })).toBe('About');
  });

  it('should fall back to defaultTitle', () => {
    expect(resolveTitle({ defaultTitle: 'My Site' })).toBe('My Site');
  });

  it('should prefer title over defaultTitle', () => {
    expect(resolveTitle({ title: 'About', defaultTitle: 'My Site' })).toBe('About');
  });
});
