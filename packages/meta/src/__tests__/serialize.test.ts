import { describe, it, expect } from 'vitest';
import type { SEOConfig } from '@ccbd-seo/core';
import { createHeadTags, createHeadTagObjects } from '../serialize.js';

describe('createHeadTags', () => {
  it('should return empty string for empty config', () => {
    const result = createHeadTags({});
    expect(result).toBe('');
  });

  it('should serialize title tag', () => {
    const config: SEOConfig = { title: 'My Page' };
    const result = createHeadTags(config);
    expect(result).toContain('<title>My Page</title>');
  });

  it('should serialize meta tags with name and property', () => {
    const config: SEOConfig = {
      description: 'A description',
      openGraph: { title: 'OG Title' },
    };
    const result = createHeadTags(config);
    expect(result).toContain('<meta name="description" content="A description">');
    expect(result).toContain('<meta property="og:title" content="OG Title">');
  });

  it('should serialize link tags', () => {
    const config: SEOConfig = {
      canonical: 'https://example.com/page',
    };
    const result = createHeadTags(config);
    expect(result).toContain('<link rel="canonical" href="https://example.com/page">');
  });

  it('should serialize full config to multi-line HTML', () => {
    const config: SEOConfig = {
      title: 'Full Page',
      description: 'Full description',
      canonical: 'https://example.com',
    };
    const result = createHeadTags(config);
    const lines = result.split('\n');
    expect(lines.length).toBe(3); // title + description meta + canonical link
  });

  it('should HTML-escape special characters in attributes', () => {
    const config: SEOConfig = {
      title: 'Page "with" <special> & chars',
      description: 'Desc with "quotes" & <angle> brackets',
    };
    const result = createHeadTags(config);
    expect(result).toContain('<title>Page &quot;with&quot; &lt;special&gt; &amp; chars</title>');
    expect(result).toContain(
      'content="Desc with &quot;quotes&quot; &amp; &lt;angle&gt; brackets"',
    );
  });

  it('should apply title template before serializing', () => {
    const config: SEOConfig = {
      title: 'Home',
      titleTemplate: '%s | My Site',
    };
    const result = createHeadTags(config);
    expect(result).toContain('<title>Home | My Site</title>');
  });
});

describe('createHeadTagObjects', () => {
  it('should return structured HeadTag objects', () => {
    const config: SEOConfig = {
      title: 'Test',
      description: 'A test page',
      canonical: 'https://example.com/test',
    };
    const result = createHeadTagObjects(config);
    expect(result).toEqual([
      { tag: 'title', attributes: {}, content: 'Test' },
      { tag: 'meta', attributes: { name: 'description', content: 'A test page' } },
      { tag: 'link', attributes: { rel: 'canonical', href: 'https://example.com/test' } },
    ]);
  });

  it('should return empty array for empty config', () => {
    const result = createHeadTagObjects({});
    expect(result).toEqual([]);
  });
});
