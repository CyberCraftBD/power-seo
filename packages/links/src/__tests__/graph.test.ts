import { describe, it, expect } from 'vitest';
import { buildLinkGraph } from '../graph.js';
import type { PageData } from '../types.js';

describe('buildLinkGraph', () => {
  it('builds graph from page data', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/b'] },
      { url: 'https://example.com/b', links: ['https://example.com/a'] },
    ];
    const graph = buildLinkGraph(pages);
    expect(graph.totalPages).toBe(2);
    expect(graph.totalLinks).toBe(2);
    expect(graph.nodes.size).toBe(2);
  });

  it('normalizes URLs', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a/', links: ['https://example.com/b/'] },
      { url: 'https://example.com/b', links: [] },
    ];
    const graph = buildLinkGraph(pages);
    // Both /a/ and /a should normalize to the same thing
    const nodeA = graph.nodes.get('https://example.com/a');
    expect(nodeA).toBeDefined();
    expect(nodeA!.outboundCount).toBe(1);
  });

  it('de-duplicates edges (same link on a page counts once)', () => {
    const pages: PageData[] = [
      {
        url: 'https://example.com/a',
        links: ['https://example.com/b', 'https://example.com/b'],
      },
      { url: 'https://example.com/b', links: [] },
    ];
    const graph = buildLinkGraph(pages);
    const nodeA = graph.nodes.get('https://example.com/a');
    expect(nodeA!.outboundCount).toBe(1);
    expect(graph.totalLinks).toBe(1);
  });

  it('ignores self-links', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/a'] },
    ];
    const graph = buildLinkGraph(pages);
    const nodeA = graph.nodes.get('https://example.com/a');
    expect(nodeA!.outboundCount).toBe(0);
    expect(nodeA!.inboundCount).toBe(0);
  });

  it('handles relative links', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['/b'] },
      { url: 'https://example.com/b', links: [] },
    ];
    const graph = buildLinkGraph(pages);
    const nodeB = graph.nodes.get('https://example.com/b');
    expect(nodeB).toBeDefined();
    expect(nodeB!.inboundCount).toBe(1);
  });

  it('creates nodes for link targets not in pages array', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/external'] },
    ];
    const graph = buildLinkGraph(pages);
    expect(graph.nodes.has('https://example.com/external')).toBe(true);
  });

  it('handles empty pages array', () => {
    const graph = buildLinkGraph([]);
    expect(graph.totalPages).toBe(0);
    expect(graph.totalLinks).toBe(0);
    expect(graph.nodes.size).toBe(0);
  });

  it('counts inbound and outbound correctly', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/c'] },
      { url: 'https://example.com/b', links: ['https://example.com/c'] },
      { url: 'https://example.com/c', links: ['https://example.com/a'] },
    ];
    const graph = buildLinkGraph(pages);
    const nodeC = graph.nodes.get('https://example.com/c');
    expect(nodeC!.inboundCount).toBe(2);
    expect(nodeC!.outboundCount).toBe(1);
    expect(graph.totalLinks).toBe(3);
  });

  it('tracks inbound source URLs correctly', () => {
    const pages: PageData[] = [
      { url: 'https://example.com/a', links: ['https://example.com/b'] },
      { url: 'https://example.com/b', links: [] },
    ];
    const graph = buildLinkGraph(pages);
    const nodeB = graph.nodes.get('https://example.com/b');
    expect(nodeB!.inbound).toContain('https://example.com/a');
  });

  it('skips invalid relative URLs', () => {
    const pages: PageData[] = [
      { url: 'not-a-url', links: [':::invalid'] },
    ];
    const graph = buildLinkGraph(pages);
    // Should not crash; the invalid link is skipped
    expect(graph.totalLinks).toBe(0);
  });
});
