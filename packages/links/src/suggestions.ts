// ============================================================================
// @power-seo/links — Link Suggestion Engine
// ============================================================================

import { stripHtml, getWords, extractSlug } from '@power-seo/core';
import type { PageData, LinkSuggestion, LinkSuggestionOptions } from './types.js';

/**
 * Suggest internal links between pages based on keyword overlap.
 *
 * For each page, extracts keywords from content and URL slug,
 * then finds other pages that mention those keywords but don't
 * already link to the target page.
 */
export function suggestLinks(pages: PageData[], options?: LinkSuggestionOptions): LinkSuggestion[] {
  const maxSuggestions = options?.maxSuggestions ?? 20;
  const minRelevance = options?.minRelevance ?? 0.1;

  if (pages.length < 2) return [];

  // Build keyword maps for each page
  const pageKeywords = new Map<string, Set<string>>();
  const pageTitles = new Map<string, string>();

  for (const page of pages) {
    const keywords = new Set<string>();

    // Extract keywords from content
    if (page.content) {
      const text = stripHtml(page.content);
      const words = getWords(text);
      for (const word of words) {
        if (word.length >= 4) {
          keywords.add(word.toLowerCase());
        }
      }
    }

    // Extract keywords from slug
    const slug = extractSlug(page.url);
    if (slug) {
      for (const part of slug.split('-')) {
        if (part.length >= 3) {
          keywords.add(part.toLowerCase());
        }
      }
    }

    // Extract keywords from title
    if (page.title) {
      const titleWords = page.title.split(/\s+/);
      for (const word of titleWords) {
        const cleaned = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleaned.length >= 4) {
          keywords.add(cleaned);
        }
      }
    }

    pageKeywords.set(page.url, keywords);
    if (page.title) pageTitles.set(page.url, page.title);
  }

  const suggestions: LinkSuggestion[] = [];

  // Compare all page pairs
  for (const fromPage of pages) {
    const fromKeywords = pageKeywords.get(fromPage.url);
    if (!fromKeywords || fromKeywords.size === 0) continue;

    const existingLinks = new Set(fromPage.links);

    for (const toPage of pages) {
      if (fromPage.url === toPage.url) continue;
      if (existingLinks.has(toPage.url)) continue;

      const toKeywords = pageKeywords.get(toPage.url);
      if (!toKeywords || toKeywords.size === 0) continue;

      // Count keyword overlap
      let overlapCount = 0;
      for (const keyword of toKeywords) {
        if (fromKeywords.has(keyword)) {
          overlapCount++;
        }
      }

      if (overlapCount === 0) continue;

      const relevanceScore = Math.min(1, overlapCount / Math.max(toKeywords.size, 1));
      if (relevanceScore < minRelevance) continue;

      // Generate anchor text from target page title or slug
      const anchorText = pageTitles.get(toPage.url) || extractSlug(toPage.url).replace(/-/g, ' ');

      suggestions.push({
        from: fromPage.url,
        to: toPage.url,
        anchorText,
        relevanceScore: Math.round(relevanceScore * 100) / 100,
      });
    }
  }

  // Sort by relevance descending, then take top N
  suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return suggestions.slice(0, maxSuggestions);
}
