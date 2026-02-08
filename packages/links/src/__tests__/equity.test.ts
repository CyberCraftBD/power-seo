import { describe, it, expect } from 'vitest';
import { buildLinkGraph } from '../graph.js';
import { analyzeLinkEquity } from '../equity.js';
import type { PageData } from '../types.js';

describe('analyzeLinkEquity', () => {
  it('gives equal distribution for fully connected graph', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/b', 'https://example.com/c'] },
      { url: 'https://example.com/b', links: ['https://example.com/a', 'https://example.com/c'] },
      { url: 'https://example.com/c', links: ['https://example.com/a', 'https://example.com/b'] },
    ];
    const graph = buildLinkGraph(pages);
    const equity = analyzeLinkEquity(graph);

    // All pages should have similar scores in a fully connected graph
    expect(equity).toHaveLength(3);
    const scores = equity.map((e) => e.score);
    expect(Math.max(...scores) - Math.min(...scores)).toBeLessThan(0.1);
  });

  it('hub pages get higher scores', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/hub', links: [] },
      { url: 'https://example.com/a', links: ['https://example.com/hub'] },
      { url: 'https://example.com/b', links: ['https://example.com/hub'] },
      { url: 'https://example.com/c', links: ['https://example.com/hub'] },
    ];
    const graph = buildLinkGraph(pages);
    const equity = analyzeLinkEquity(graph);

    // Hub should have highest score
    expect(equity[0]!.url).toBe('https://example.com/hub');
    expect(equity[0]!.score).toBe(1);
  });

  it('dead-end pages still have a base score', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: [] },
      { url: 'https://example.com/b', links: ['https://example.com/a'] },
    ];
    const graph = buildLinkGraph(pages);
    const equity = analyzeLinkEquity(graph);

    // Both should have non-zero scores
    for (const e of equity) {
      expect(e.score).toBeGreaterThan(0);
    }
  });

  it('accepts custom damping and iterations', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/b'] },
      { url: 'https://example.com/b', links: ['https://example.com/a'] },
    ];
    const graph = buildLinkGraph(pages);
    const equity = analyzeLinkEquity(graph, { damping: 0.5, iterations: 5 });
    expect(equity).toHaveLength(2);
    // With lower damping, scores should still be valid
    for (const e of equity) {
      expect(e.score).toBeGreaterThan(0);
      expect(e.score).toBeLessThanOrEqual(1);
    }
  });

  it('returns scores sorted descending', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/c'] },
      { url: 'https://example.com/b', links: ['https://example.com/c'] },
      { url: 'https://example.com/c', links: [] },
    ];
    const graph = buildLinkGraph(pages);
    const equity = analyzeLinkEquity(graph);
    for (let i = 1; i < equity.length; i++) {
      expect(equity[i]!.score).toBeLessThanOrEqual(equity[i - 1]!.score);
    }
  });

  it('handles single page graph', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: [] },
    ];
    const graph = buildLinkGraph(pages);
    const equity = analyzeLinkEquity(graph);
    expect(equity).toHaveLength(1);
    expect(equity[0]!.score).toBe(1);
  });

  it('handles empty graph', () => {
    const graph = buildLinkGraph([]);
    const equity = analyzeLinkEquity(graph);
    expect(equity).toEqual([]);
  });
});
