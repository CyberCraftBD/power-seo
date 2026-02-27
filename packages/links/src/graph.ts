// @power-seo/links — Link Graph Builder
// ----------------------------------------------------------------------------

import { normalizeUrl, isAbsoluteUrl } from '@power-seo/core';
import type { PageData, LinkGraph, LinkNode } from './types.js';

/**
 * Build a directed link graph from an array of pages.
 *
 * - Normalizes all URLs
 * - Resolves relative links against the page URL
 * - De-duplicates edges (same link on a page counts once)
 * - Ignores self-links
 */
export function buildLinkGraph(pages: PageData[]): LinkGraph {
  const nodes = new Map<string, LinkNode>();
  let totalLinks = 0;

  // Initialize all page nodes
  for (const page of pages) {
    const normalized = normalizeUrl(page.url);
    if (!nodes.has(normalized)) {
      nodes.set(normalized, {
        url: normalized,
        inbound: [],
        outbound: [],
        inboundCount: 0,
        outboundCount: 0,
      });
    }
  }

  // Build edges
  for (const page of pages) {
    const sourceUrl = normalizeUrl(page.url);
    const sourceNode = nodes.get(sourceUrl)!;

    // De-duplicate links from this page
    const seenTargets = new Set<string>();

    for (const link of page.links) {
      // Resolve relative links
      let targetUrl: string;
      if (isAbsoluteUrl(link)) {
        targetUrl = normalizeUrl(link);
      } else {
        try {
          targetUrl = normalizeUrl(new globalThis.URL(link, page.url).toString());
        } catch {
          continue; // skip invalid URLs
        }
      }

      // Skip self-links and duplicates
      if (targetUrl === sourceUrl || seenTargets.has(targetUrl)) {
        continue;
      }
      seenTargets.add(targetUrl);

      // Add outbound edge
      sourceNode.outbound.push(targetUrl);
      sourceNode.outboundCount++;
      totalLinks++;

      // Add inbound edge (create node if it doesn't exist)
      if (!nodes.has(targetUrl)) {
        nodes.set(targetUrl, {
          url: targetUrl,
          inbound: [],
          outbound: [],
          inboundCount: 0,
          outboundCount: 0,
        });
      }
      const targetNode = nodes.get(targetUrl)!;
      targetNode.inbound.push(sourceUrl);
      targetNode.inboundCount++;
    }
  }

  return {
    nodes,
    totalPages: pages.length,
    totalLinks,
  };
}
