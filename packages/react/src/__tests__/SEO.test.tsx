import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { SEO } from '../components/SEO.js';
import { DefaultSEO } from '../components/DefaultSEO.js';
import React from 'react';

// React 19 hoists <title>, <meta>, <link> to document.head.
// Clean up after each test to avoid leaking between tests.
afterEach(() => {
  cleanup();
  document.head.innerHTML = '';
});

describe('SEO component', () => {
  it('should render title', () => {
    render(<SEO title="Test Page" />);
    const title = document.head.querySelector('title');
    expect(title?.textContent).toBe('Test Page');
  });

  it('should render meta description', () => {
    render(<SEO description="A test description" />);
    const meta = document.head.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe('A test description');
  });

  it('should render canonical link', () => {
    render(<SEO canonical="https://example.com/page" />);
    const link = document.head.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://example.com/page');
  });

  it('should render Open Graph tags', () => {
    render(
      <SEO
        openGraph={{
          title: 'OG Title',
          type: 'website',
        }}
      />,
    );
    const ogTitle = document.head.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')).toBe('OG Title');
  });

  it('should render Twitter Card tags', () => {
    render(
      <SEO
        twitter={{
          cardType: 'summary_large_image',
          site: '@example',
        }}
      />,
    );
    const card = document.head.querySelector('meta[name="twitter:card"]');
    expect(card?.getAttribute('content')).toBe('summary_large_image');
  });

  it('should render noindex robots tag', () => {
    render(<SEO noindex={true} />);
    const robots = document.head.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toContain('noindex');
  });

  it('should apply title template', () => {
    render(<SEO title="About" titleTemplate="%s | My Site" />);
    const title = document.head.querySelector('title');
    expect(title?.textContent).toBe('About | My Site');
  });
});

describe('DefaultSEO component', () => {
  it('should render default title', () => {
    render(<DefaultSEO defaultTitle="My Site" description="Default description" />);
    const title = document.head.querySelector('title');
    expect(title?.textContent).toBe('My Site');
  });

  it('should provide context to child SEO components', () => {
    render(
      <DefaultSEO titleTemplate="%s | My Site" openGraph={{ siteName: 'My Site' }}>
        <SEO title="About" openGraph={{ title: 'About Us' }} />
      </DefaultSEO>,
    );

    const title = document.head.querySelector('title');
    expect(title?.textContent).toBe('About | My Site');

    const ogSiteName = document.head.querySelector('meta[property="og:site_name"]');
    expect(ogSiteName?.getAttribute('content')).toBe('My Site');
  });
});
