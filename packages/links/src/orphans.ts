// ============================================================================
// @power-seo/links — Orphan Page Detection
// ============================================================================

import { normalizeUrl } from '@power-seo/core';
import type { LinkGraph, OrphanPage } from './types.js';

/**
 * Find pages with zero inbound links (no other page links to them).
 *
 * @param graph - The link graph to analyze
 * @param entryPoints - URLs to exclude (e.g. homepage, known entry pages)
 * @returns Orphan pages sorted by outbound count descending
 */
export function findOrphanPages(graph: LinkGraph, entryPoints: string[] = []): OrphanPage[] {
  const excludeSet = new Set(entryPoints.map((url) => normalizeUrl(url)));
  const orphans: OrphanPage[] = [];

  for (const [url, node] of graph.nodes) {
    if (excludeSet.has(url)) continue;

    if (node.inboundCount === 0) {
      orphans.push({
        url: node.url,
        outboundCount: node.outboundCount,
      });
    }
  }

  // Sort by outbound count descending (pages with outbound links but no
  // inbound are highest priority — they exist but aren't linked to)
  orphans.sort((a, b) => b.outboundCount - a.outboundCount);

  return orphans;
}
