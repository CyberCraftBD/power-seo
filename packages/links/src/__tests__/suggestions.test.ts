import { describe, it, expect } from 'vitest';
import { suggestLinks } from '../suggestions.js';
import type { PageData } from '../types.js';

describe('suggestLinks', () => {
  it('suggests links based on keyword overlap', () => {
    const pages: PageData[] = [
      {
        url: 'https://example.com/typescript-guide',
        title: 'TypeScript Guide',
        content: 'This guide covers typescript programming language features.',
        links: [],
      },
      {
        url: 'https://example.com/typescript-tips',
        title: 'TypeScript Tips',
        content: 'Useful typescript tips and tricks for programming.',
        links: [],
      },
    ];
    const suggestions = suggestLinks(pages);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]!.relevanceScore).toBeGreaterThan(0);
  });

  it('does not suggest already existing links', () => {
    const pages: PageData[] = [
      {
        url: 'https://example.com/a',
        title: 'Page A',
        content: 'Content about typescript programming language features.',
        links: ['https://example.com/b'],
      },
      {
        url: 'https://example.com/b',
        title: 'Page B',
        content: 'Content about typescript programming language features.',
        links: [],
      },
    ];
    const suggestions = suggestLinks(pages);
    // Should not suggest A → B since that link already exists
    const aToB = suggestions.find((s) => s.from === 'https://example.com/a' && s.to === 'https://example.com/b');
    expect(aToB).toBeUndefined();
  });

  it('respects maxSuggestions limit', () => {
    const pages: PageData[] = Array.from({ length: 10 }, (_, i) => ({
      url: `https://example.com/page-${i}`,
      title: `Page ${i} about testing`,
      content: 'Common testing content with shared keywords for analysis.',
      links: [],
    }));
    const suggestions = suggestLinks(pages, { maxSuggestions: 5 });
    expect(suggestions.length).toBeLessThanOrEqual(5);
  });

  it('respects minRelevance threshold', () => {
    const pages: PageData[] = [
      {
        url: 'https://example.com/a',
        title: 'Page A',
        content: 'Completely unique words like apple banana cherry dragonfruit elderberry.',
        links: [],
      },
      {
        url: 'https://example.com/b',
        title: 'Page B',
        content: 'Totally different vocabulary: quantum physics thermodynamics relativity.',
        links: [],
      },
    ];
    const suggestions = suggestLinks(pages, { minRelevance: 0.9 });
    // Very high threshold — unlikely to get suggestions between unrelated pages
    expect(suggestions).toHaveLength(0);
  });

  it('returns empty when fewer than 2 pages', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', content: 'some content', links: [] },
    ];
    expect(suggestLinks(pages)).toEqual([]);
    expect(suggestLinks([])).toEqual([]);
  });

  it('handles pages without content', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: [] },
      { url: 'https://example.com/b', links: [] },
    ];
    // Should not crash
    const suggestions = suggestLinks(pages);
    expect(Array.isArray(suggestions)).toBe(true);
  });

  it('sorts suggestions by relevance descending', () => {
    const pages: PageData[] = [
      {
        url: 'https://example.com/typescript-advanced',
        title: 'Advanced TypeScript',
        content: 'Advanced typescript generics conditional types mapped types.',
        links: [],
      },
      {
        url: 'https://example.com/typescript-basics',
        title: 'TypeScript Basics',
        content: 'Basic typescript types interfaces classes modules.',
        links: [],
      },
      {
        url: 'https://example.com/python-guide',
        title: 'Python Guide',
        content: 'Python programming basics variables functions classes.',
        links: [],
      },
    ];
    const suggestions = suggestLinks(pages);
    for (let i = 1; i < suggestions.length; i++) {
      expect(suggestions[i]!.relevanceScore).toBeLessThanOrEqual(suggestions[i - 1]!.relevanceScore);
    }
  });

  it('uses title as anchor text when available', () => {
    const pages: PageData[] = [
      {
        url: 'https://example.com/about-testing',
        title: 'About Testing',
        content: 'Content about software testing methodologies and frameworks.',
        links: [],
      },
      {
        url: 'https://example.com/testing-guide',
        title: 'Testing Guide',
        content: 'Guide about software testing frameworks and methodologies.',
        links: [],
      },
    ];
    const suggestions = suggestLinks(pages);
    if (suggestions.length > 0) {
      expect(suggestions[0]!.anchorText).toBeTruthy();
    }
  });
});
