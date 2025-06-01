import { describe, it, expect } from 'vitest';
import {
  calculateKeywordDensity,
  countKeywordOccurrences,
  analyzeKeyphraseOccurrences,
} from '../keyword-density.js';

describe('countKeywordOccurrences', () => {
  it('should count single word occurrences', () => {
    expect(countKeywordOccurrences('react is great for building react apps', 'react')).toBe(2);
  });

  it('should count phrase occurrences', () => {
    expect(
      countKeywordOccurrences('react seo is important for react seo optimization', 'react seo'),
    ).toBe(2);
  });

  it('should be case insensitive', () => {
    expect(countKeywordOccurrences('React REACT react', 'react')).toBe(3);
  });

  it('should return 0 for empty keyword', () => {
    expect(countKeywordOccurrences('some text', '')).toBe(0);
  });
});

describe('calculateKeywordDensity', () => {
  it('should calculate density percentage', () => {
    const result = calculateKeywordDensity(
      'seo',
      'Learn about seo techniques. Good seo matters for your website.',
    );
    expect(result.count).toBe(2);
    expect(result.density).toBeGreaterThan(0);
    expect(result.totalWords).toBeGreaterThan(0);
  });

  it('should handle empty content', () => {
    const result = calculateKeywordDensity('test', '');
    expect(result.count).toBe(0);
    expect(result.density).toBe(0);
  });

  it('should handle multi-word keyphrases', () => {
    const result = calculateKeywordDensity(
      'react seo',
      'Learn about react seo. React seo is important.',
    );
    expect(result.count).toBe(2);
  });
});

describe('analyzeKeyphraseOccurrences', () => {
  it('should detect keyphrase in title', () => {
    const result = analyzeKeyphraseOccurrences({
      keyphrase: 'react seo',
      title: 'Ultimate React SEO Guide',
      content: '<p>Content about react seo.</p>',
    });
    expect(result.inTitle).toBe(true);
  });

  it('should detect keyphrase in meta description', () => {
    const result = analyzeKeyphraseOccurrences({
      keyphrase: 'react seo',
      metaDescription: 'Learn how to do react seo properly',
      content: '<p>Some content.</p>',
    });
    expect(result.inMetaDescription).toBe(true);
  });

  it('should detect keyphrase in H1', () => {
    const result = analyzeKeyphraseOccurrences({
      keyphrase: 'react seo',
      content: '<h1>React SEO Guide</h1><p>Content here.</p>',
    });
    expect(result.inH1).toBe(true);
  });

  it('should detect keyphrase in slug', () => {
    const result = analyzeKeyphraseOccurrences({
      keyphrase: 'react seo',
      slug: '/blog/react-seo-guide',
      content: '<p>Content.</p>',
    });
    expect(result.inSlug).toBe(true);
  });

  it('should count keyphrase in alt text', () => {
    const result = analyzeKeyphraseOccurrences({
      keyphrase: 'react seo',
      content: '<p>Content.</p>',
      images: [
        { alt: 'react seo diagram' },
        { alt: 'some other image' },
        { alt: 'react seo workflow' },
      ],
    });
    expect(result.inAltText).toBe(2);
  });
});
