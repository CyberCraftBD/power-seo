import { describe, it, expect } from 'vitest';
import { buildLinkGraph } from '../graph.js';
import { findOrphanPages } from '../orphans.js';
import type { PageData } from '../types.js';

describe('findOrphanPages', () => {
  it('finds pages with no inbound links', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/b'] },
      { url: 'https://example.com/b', links: [] },
      { url: 'https://example.com/c', links: ['https://example.com/b'] },
    ];
    const graph = buildLinkGraph(pages);
    const orphans = findOrphanPages(graph);

    // a and c have no inbound links
    const orphanUrls = orphans.map((o) => o.url);
    expect(orphanUrls).toContain('https://example.com/a');
    expect(orphanUrls).toContain('https://example.com/c');
    expect(orphanUrls).not.toContain('https://example.com/b');
  });

  it('excludes entry points', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/', links: ['https://example.com/about'] },
      { url: 'https://example.com/about', links: [] },
      { url: 'https://example.com/orphan', links: [] },
    ];
    const graph = buildLinkGraph(pages);
    const orphans = findOrphanPages(graph, ['https://example.com/']);

    const orphanUrls = orphans.map((o) => o.url);
    expect(orphanUrls).not.toContain('https://example.com/');
    expect(orphanUrls).toContain('https://example.com/orphan');
  });

  it('returns empty when no orphans', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/b'] },
      { url: 'https://example.com/b', links: ['https://example.com/a'] },
    ];
    const graph = buildLinkGraph(pages);
    const orphans = findOrphanPages(graph);
    expect(orphans).toEqual([]);
  });

  it('sorts by outbound count descending', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/d', 'https://example.com/e'] },
      { url: 'https://example.com/b', links: [] },
      { url: 'https://example.com/c', links: ['https://example.com/d'] },
      { url: 'https://example.com/d', links: [] },
      { url: 'https://example.com/e', links: [] },
    ];
    const graph = buildLinkGraph(pages);
    const orphans = findOrphanPages(graph);

    // a has 2 outbound, c has 1, b has 0
    expect(orphans[0]!.url).toBe('https://example.com/a');
    expect(orphans[0]!.outboundCount).toBe(2);
  });

  it('handles empty graph', () => {
    const graph = buildLinkGraph([]);
    const orphans = findOrphanPages(graph);
    expect(orphans).toEqual([]);
  });

  it('considers all pages with no inbound as orphans', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: [] },
      { url: 'https://example.com/b', links: [] },
    ];
    const graph = buildLinkGraph(pages);
    const orphans = findOrphanPages(graph);
    expect(orphans).toHaveLength(2);
  });
});
