// @power-seo/links — Link Graph Builder
// ----------------------------------------------------------------------------

import { normalizeUrl, isAbsoluteUrl } from '@power-seo/core';
import type { PageData, LinkGraph, LinkNode } from './types.js';

/**
 * Strip the URL fragment (`#section`) and reject non-http(s) schemes
 * (`mailto:`, `tel:`, `javascript:`, …).
 *
 * Returns the fragment-free URL, or `null` if the link should not be
 * treated as a page node (bare fragments like `#top`, or non-http schemes).
 */
function canonicalizeTarget(url: string): string | null {
  try {
    const parsed = new globalThis.URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null; // skip mailto:, tel:, javascript:, etc.
    }
    parsed.hash = '';
    return normalizeUrl(parsed.toString());
  } catch {
    return null;
  }
}

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
    const existing = nodes.get(normalized);
    if (!existing) {
      nodes.set(normalized, {
        url: normalized,
        title: page.title,
        inbound: [],
        outbound: [],
        inboundCount: 0,
        outboundCount: 0,
      });
    } else if (existing.title === undefined && page.title !== undefined) {
      existing.title = page.title;
    }
  }

  // Build edges
  for (const page of pages) {
    const sourceUrl = normalizeUrl(page.url);
    const sourceNode = nodes.get(sourceUrl)!;

    // De-duplicate links from this page
    const seenTargets = new Set<string>();

    for (const link of page.links) {
      // Resolve relative links against the page URL, strip fragments, and
      // reject non-http(s) schemes (mailto:, tel:, #fragments, …) so they
      // do not become phantom nodes that inflate counts / skew PageRank.
      const resolved = isAbsoluteUrl(link)
        ? link
        : (() => {
            try {
              return new globalThis.URL(link, page.url).toString();
            } catch {
              return null;
            }
          })();
      if (resolved === null) {
        continue; // skip invalid URLs
      }

      const targetUrl = canonicalizeTarget(resolved);
      if (targetUrl === null) {
        continue; // skip non-http(s) schemes and bare fragments
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
