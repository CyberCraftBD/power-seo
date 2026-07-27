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

  it('should count non-Latin (Bangla) keyphrases', () => {
    // \b recognizes only [A-Za-z0-9_], so Bangla keyphrases previously counted 0,
    // yielding a false "keyphrase never used" / 0% density report.
    expect(countKeywordOccurrences('আমাদের সেবা এবং আরও সেবা সম্পর্কে জানুন', 'সেবা')).toBe(2);
  });

  it('should count keyphrases containing punctuation like C++', () => {
    // "C++" has no ASCII \b after the trailing '+', so it previously counted 0.
    expect(countKeywordOccurrences('Learn C++ today. C++ is powerful.', 'C++')).toBe(2);
  });

  it('should still respect word boundaries for Latin words', () => {
    // "reactor" must not match the keyphrase "react".
    expect(countKeywordOccurrences('a reactor is not react', 'react')).toBe(1);
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

  it('should match the documented density example (#135)', () => {
    // 2 occurrences of the 'react seo' phrase in a 10-word body => 20.0%
    const result = calculateKeywordDensity(
      'react seo',
      'Learn React SEO for your React application. React SEO matters.',
    );
    expect(result.count).toBe(2);
    expect(result.totalWords).toBe(10);
    expect(result.density).toBe(20);
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
