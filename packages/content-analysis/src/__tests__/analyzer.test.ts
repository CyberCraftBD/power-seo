import { describe, it, expect } from 'vitest';
import { analyzeContent } from '../analyzer.js';
import type { ContentAnalysisInput } from '@power-seo/core';

describe('analyzeContent', () => {
  it('returns a complete analysis output', () => {
    const input: ContentAnalysisInput = {
      title: 'React SEO Best Practices for Developers',
      metaDescription:
        'Learn the best practices for React SEO. This comprehensive guide covers everything you need to know about optimizing React apps.',
      content:
        '<h1>React SEO Best Practices</h1><h2>Why React SEO matters</h2><p>' +
        Array(100).fill('React SEO is essential for modern web applications.').join(' ') +
        '</p>',
      focusKeyphrase: 'react seo',
      slug: 'react-seo-best-practices',
      internalLinks: ['/blog', '/about'],
      externalLinks: ['https://reactjs.org'],
      images: [{ src: 'hero.jpg', alt: 'React SEO overview' }],
    };

    const output = analyzeContent(input);

    expect(output.score).toBeGreaterThan(0);
    expect(output.maxScore).toBeGreaterThan(0);
    expect(output.results).toBeInstanceOf(Array);
    expect(output.results.length).toBeGreaterThan(0);
    expect(output.recommendations).toBeInstanceOf(Array);

    // Every result should have required fields
    for (const result of output.results) {
      expect(result.id).toBeTruthy();
      expect(result.title).toBeTruthy();
      expect(result.description).toBeTruthy();
      expect(['good', 'ok', 'poor']).toContain(result.status);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.maxScore).toBeGreaterThan(0);
    }
  });

  it('works with minimal input', () => {
    const output = analyzeContent({ content: '' });

    expect(output.score).toBeGreaterThanOrEqual(0);
    expect(output.maxScore).toBeGreaterThan(0);
    expect(output.results.length).toBeGreaterThan(0);
  });

  it('respects disabledChecks config', () => {
    const input: ContentAnalysisInput = {
      title: 'Test Title',
      content: '<p>Some content.</p>',
    };

    const withAll = analyzeContent(input);
    const withDisabled = analyzeContent(input, {
      disabledChecks: ['title-presence', 'word-count'],
    });

    expect(withDisabled.results.length).toBeLessThan(withAll.results.length);
    expect(withDisabled.results.find((r) => r.id === 'title-presence')).toBeUndefined();
    expect(withDisabled.results.find((r) => r.id === 'word-count')).toBeUndefined();
  });

  it('generates recommendations from poor and ok results', () => {
    const output = analyzeContent({ content: 'Short.' });

    // Should have at least some recommendations (no title, no meta desc, thin content, etc.)
    expect(output.recommendations.length).toBeGreaterThan(0);
  });

  it('calculates score as sum of individual results', () => {
    const output = analyzeContent({
      content: '<p>Test content.</p>',
      title: 'Test Title for This Page',
    });

    const expectedScore = output.results.reduce((sum, r) => sum + r.score, 0);
    const expectedMaxScore = output.results.reduce((sum, r) => sum + r.maxScore, 0);

    expect(output.score).toBe(expectedScore);
    expect(output.maxScore).toBe(expectedMaxScore);
  });
});
