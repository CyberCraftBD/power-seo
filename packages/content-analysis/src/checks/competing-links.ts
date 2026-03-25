// @power-seo/content-analysis — Competing Links Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

interface ParsedLink {
  href: string;
  anchorText: string;
  isExternal: boolean;
}

/**
 * Extract all <a href> links from HTML, capturing href and anchor text.
 */
function extractLinks(html: string, siteUrl?: string): ParsedLink[] {
  const links: ParsedLink[] = [];
  const linkRegex = /<a\s[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1]!.trim();
    const rawAnchor = match[2]!;

    // Skip non-navigable links
    if (
      !href ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    ) {
      continue;
    }

    const anchorText = stripHtml(rawAnchor).toLowerCase().trim();

    // Determine if external
    let isExternal = false;
    if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
      isExternal = false;
    } else if (siteUrl && href.toLowerCase().startsWith(siteUrl.toLowerCase())) {
      isExternal = false;
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      isExternal = true;
    }

    links.push({ href, anchorText, isExternal });
  }

  return links;
}

/**
 * Check whether anchor text or URL path contains the keyphrase or a close variant.
 * A close variant is checked by matching individual keyphrase words (for multi-word keyphrases).
 */
function matchesKeyphrase(text: string, keyphrase: string): boolean {
  const kpLower = keyphrase.toLowerCase().trim();
  const textLower = text.toLowerCase();

  // Exact match
  if (textLower.includes(kpLower)) return true;

  // For multi-word keyphrases, check if all significant words appear
  const kpWords = kpLower.split(/\s+/).filter((w) => w.length > 2);
  if (kpWords.length > 1) {
    const matchingWords = kpWords.filter((w) => textLower.includes(w));
    // Consider it a variant if 80%+ of significant words match
    if (matchingWords.length >= Math.ceil(kpWords.length * 0.8)) return true;
  }

  return false;
}

/**
 * Supporting context patterns — links with these phrases are citations/references,
 * not competing content.
 */
const SUPPORTING_PATTERNS = [
  'learn more about',
  'read more about',
  'according to',
  'source:',
  'reference:',
  'cited by',
  'as reported by',
  'study by',
  'research from',
  'data from',
  'published by',
  'via ',
  'see also',
];

/**
 * Determine if a link is a supporting reference or a competing link.
 */
function isSupportingLink(anchorText: string): boolean {
  return SUPPORTING_PATTERNS.some((pattern) => anchorText.includes(pattern));
}

/**
 * Extract the URL path for keyphrase matching in URLs.
 */
function getUrlPath(href: string): string {
  try {
    const url = new URL(href);
    return url.pathname.replace(/[-_/]/g, ' ').toLowerCase();
  } catch {
    return href.replace(/[-_/]/g, ' ').toLowerCase();
  }
}

export function checkCompetingLinks(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content, siteUrl } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'competing-links',
      title: 'Competing links',
      description: 'No focus keyphrase set. Set one to check for competing links.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const links = extractLinks(content, siteUrl);
  const externalLinks = links.filter((l) => l.isExternal);

  const competingLinks: { href: string; anchorText: string }[] = [];

  for (const link of externalLinks) {
    const anchorMatches = matchesKeyphrase(link.anchorText, focusKeyphrase);
    const urlMatches = matchesKeyphrase(getUrlPath(link.href), focusKeyphrase);

    if ((anchorMatches || urlMatches) && !isSupportingLink(link.anchorText)) {
      competingLinks.push({ href: link.href, anchorText: link.anchorText });
    }
  }

  if (competingLinks.length === 0) {
    return {
      id: 'competing-links',
      title: 'Competing links',
      description:
        'No competing links found. Your external links do not compete with your focus keyphrase.',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  const linkList = competingLinks
    .map((l) => `"${l.anchorText || '(no text)'}" -> ${l.href}`)
    .join('; ');

  if (competingLinks.length === 1) {
    return {
      id: 'competing-links',
      title: 'Competing links',
      description: `Found 1 competing external link that targets your focus keyphrase: ${linkList}. Consider removing it or changing the anchor text to avoid sending link equity to a competitor.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'competing-links',
    title: 'Competing links',
    description: `Found ${competingLinks.length} competing external links targeting your focus keyphrase: ${linkList}. These links send link equity to competitors for the same keyword. Remove them or change their anchor text.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
