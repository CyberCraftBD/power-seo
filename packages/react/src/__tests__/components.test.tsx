import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Canonical } from '../components/Canonical.js';
import { Robots } from '../components/Robots.js';
import { Hreflang } from '../components/Hreflang.js';
import { Breadcrumb } from '../components/Breadcrumb.js';
import { OpenGraph } from '../components/OpenGraph.js';
import { TwitterCard } from '../components/TwitterCard.js';
import React from 'react';

// React 19 hoists <title>, <meta>, <link> to document.head.
// Clean up after each test to avoid leaking between tests.
afterEach(() => {
  cleanup();
  document.head.innerHTML = '';
});

describe('Canonical component', () => {
  it('should render canonical link', () => {
    render(<Canonical url="https://example.com/page" />);
    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://example.com/page');
  });

  it('should resolve relative URL with baseUrl', () => {
    render(<Canonical url="/blog/post" baseUrl="https://example.com" />);
    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://example.com/blog/post');
  });
});

describe('Robots component', () => {
  it('should render robots meta tag', () => {
    render(<Robots index={false} follow={true} />);
    const meta = document.head.querySelector('meta[name="robots"]');
    expect(meta?.getAttribute('content')).toBe('noindex, follow');
  });

  it('should return null for empty directive', () => {
    const { container } = render(<Robots />);
    const meta = container.querySelector('meta[name="robots"]');
    expect(meta).toBeNull();
  });
});

describe('Hreflang component', () => {
  it('should render hreflang links', () => {
    render(
      <Hreflang
        alternates={[
          { hrefLang: 'en', href: 'https://example.com/en' },
          { hrefLang: 'fr', href: 'https://example.com/fr' },
        ]}
      />,
    );
    const links = document.head.querySelectorAll('link[rel="alternate"]');
    expect(links).toHaveLength(2);
    expect(links[0]?.getAttribute('hreflang')).toBe('en');
    expect(links[1]?.getAttribute('hreflang')).toBe('fr');
  });

  it('should include x-default', () => {
    render(
      <Hreflang
        alternates={[{ hrefLang: 'en', href: 'https://example.com/en' }]}
        xDefault="https://example.com/en"
      />,
    );
    const xDefault = document.head.querySelector('link[hreflang="x-default"]');
    expect(xDefault).not.toBeNull();
    expect(xDefault?.getAttribute('href')).toBe('https://example.com/en');
  });
});

describe('Breadcrumb component', () => {
  it('should render visual breadcrumb', () => {
    const { container } = render(
      <Breadcrumb
        items={[{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }, { name: 'Post' }]}
      />,
    );
    const nav = container.querySelector('nav[aria-label="Breadcrumb"]');
    expect(nav).not.toBeNull();
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2); // Home and Blog are links, Post is not
  });

  it('should render JSON-LD', () => {
    const { container } = render(
      <Breadcrumb items={[{ name: 'Home', url: '/' }, { name: 'Blog' }]} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script?.textContent ?? '{}');
    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement).toHaveLength(2);
  });

  it('should optionally exclude JSON-LD', () => {
    const { container } = render(
      <Breadcrumb items={[{ name: 'Home', url: '/' }]} includeJsonLd={false} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeNull();
  });
});

describe('OpenGraph component', () => {
  it('should render OG meta tags', () => {
    render(
      <OpenGraph
        type="article"
        title="My Article"
        description="Article description"
        url="https://example.com/article"
      />,
    );
    expect(document.head.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'article',
    );
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'My Article',
    );
  });
});

describe('TwitterCard component', () => {
  it('should render Twitter Card meta tags', () => {
    render(<TwitterCard cardType="summary_large_image" site="@example" title="Card Title" />);
    expect(document.head.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    );
    expect(document.head.querySelector('meta[name="twitter:site"]')?.getAttribute('content')).toBe(
      '@example',
    );
  });
});
