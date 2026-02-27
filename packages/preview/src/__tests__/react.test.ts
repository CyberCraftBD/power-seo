import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { SerpPreview, OgPreview, TwitterPreview, PreviewPanel } from '../react.js';

describe('SerpPreview', () => {
  it('renders title, URL, and description', () => {
    const { container } = render(
      createElement(SerpPreview, {
        title: 'Test Page Title',
        description: 'This is a test page description.',
        url: 'https://example.com/test',
      }),
    );

    expect(container.textContent).toContain('Test Page Title');
    expect(container.textContent).toContain('example.com');
    expect(container.textContent).toContain('This is a test page description.');
  });

  it('shows truncation warning for long titles', () => {
    const { container } = render(
      createElement(SerpPreview, {
        title: 'A'.repeat(200),
        description: 'Short desc.',
        url: 'https://example.com',
      }),
    );

    expect(container.textContent).toContain('truncated');
  });
});

describe('OgPreview', () => {
  it('renders title and description', () => {
    const { container } = render(
      createElement(OgPreview, {
        title: 'OG Title',
        description: 'OG Description',
        url: 'https://example.com',
      }),
    );

    expect(container.textContent).toContain('OG Title');
    expect(container.textContent).toContain('OG Description');
  });

  it('renders site name', () => {
    const { container } = render(
      createElement(OgPreview, {
        title: 'Title',
        description: 'Desc',
        url: 'https://example.com',
        siteName: 'My Cool Site',
      }),
    );

    expect(container.textContent).toContain('My Cool Site');
  });

  it('renders image validation warning for invalid images', () => {
    const { container } = render(
      createElement(OgPreview, {
        title: 'Title',
        description: 'Desc',
        url: 'https://example.com',
        image: { url: 'https://example.com/img.jpg', width: 50, height: 50 },
      }),
    );

    expect(container.textContent).toContain('Minimum');
  });
});

describe('TwitterPreview', () => {
  it('renders summary card', () => {
    const { container } = render(
      createElement(TwitterPreview, {
        cardType: 'summary',
        title: 'Tweet Title',
        description: 'Tweet description.',
      }),
    );

    expect(container.textContent).toContain('Tweet Title');
    expect(container.textContent).toContain('Tweet description.');
  });

  it('renders domain from site handle', () => {
    const { container } = render(
      createElement(TwitterPreview, {
        cardType: 'summary',
        title: 'Title',
        description: 'Desc',
        site: '@myhandle',
      }),
    );

    expect(container.textContent).toContain('@myhandle');
  });

  it('renders summary_large_image card', () => {
    const { container } = render(
      createElement(TwitterPreview, {
        cardType: 'summary_large_image',
        title: 'Large Card Title',
        description: 'Large card desc.',
        image: { url: 'https://example.com/img.jpg', width: 800, height: 418 },
      }),
    );

    expect(container.textContent).toContain('Large Card Title');
  });
});

describe('PreviewPanel', () => {
  it('renders with tab buttons', () => {
    const { container } = render(
      createElement(PreviewPanel, {
        title: 'Test Title',
        description: 'Test description.',
        url: 'https://example.com',
      }),
    );

    expect(container.textContent).toContain('Google');
    expect(container.textContent).toContain('Facebook');
    expect(container.textContent).toContain('Twitter');
  });

  it('shows Google preview by default', () => {
    const { container } = render(
      createElement(PreviewPanel, {
        title: 'Default Tab Test',
        description: 'Description.',
        url: 'https://example.com/page',
      }),
    );

    // Google SERP preview shows breadcrumb URL
    expect(container.textContent).toContain('example.com');
    expect(container.textContent).toContain('Default Tab Test');
  });
});
