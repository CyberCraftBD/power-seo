// ============================================================================
// @ccbd-seo/links — Link Equity (PageRank) Analysis
// ============================================================================

import type { LinkGraph, LinkEquityScore, LinkEquityOptions } from './types.js';

/**
 * Analyze link equity using a simplified PageRank algorithm.
 *
 * - Initial score = 1/N for all pages
 * - Each iteration: score = (1-d)/N + d * sum(inbound page scores / outbound count)
 * - Returns normalized scores (0-1) sorted descending
 */
export function analyzeLinkEquity(
  graph: LinkGraph,
  options?: LinkEquityOptions,
): LinkEquityScore[] {
  const damping = options?.damping ?? 0.85;
  const iterations = options?.iterations ?? 20;

  const urls = [...graph.nodes.keys()];
  const n = urls.length;

  if (n === 0) return [];

  // Initialize scores
  const scores = new Map<string, number>();
  for (const url of urls) {
    scores.set(url, 1 / n);
  }

  // Iterative computation
  for (let iter = 0; iter < iterations; iter++) {
    const newScores = new Map<string, number>();

    for (const url of urls) {
      const node = graph.nodes.get(url)!;
      let inboundSum = 0;

      for (const inboundUrl of node.inbound) {
        const inboundNode = graph.nodes.get(inboundUrl);
        if (inboundNode) {
          const inboundScore = scores.get(inboundUrl) ?? 0;
          const outboundCount = inboundNode.outboundCount || 1;
          inboundSum += inboundScore / outboundCount;
        }
      }

      newScores.set(url, (1 - damping) / n + damping * inboundSum);
    }

    // Update scores
    for (const [url, score] of newScores) {
      scores.set(url, score);
    }
  }

  // Normalize to 0-1 range
  let maxScore = 0;
  for (const score of scores.values()) {
    if (score > maxScore) maxScore = score;
  }

  const results: LinkEquityScore[] = [];
  for (const url of urls) {
    const node = graph.nodes.get(url)!;
    const rawScore = scores.get(url) ?? 0;
    results.push({
      url,
      score: maxScore > 0 ? Math.round((rawScore / maxScore) * 1000) / 1000 : 0,
      inboundCount: node.inboundCount,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}
