// ============================================================================
// @power-seo/core — Keyword Density Calculator
// ============================================================================

import { getWords, stripHtml } from './text-stats.js';

export interface KeywordDensityResult {
  keyword: string;
  count: number;
  density: number;
  totalWords: number;
}

export interface KeyphraseOccurrences {
  inTitle: boolean;
  inMetaDescription: boolean;
  inFirstParagraph: boolean;
  inH1: boolean;
  inHeadings: number;
  inContent: number;
  inSlug: boolean;
  inAltText: number;
  density: number;
  totalWords: number;
}

/**
 * Calculate keyword density as a percentage.
 *
 * @example
 * ```ts
 * calculateKeywordDensity('react seo', 'Learn React SEO for your React application. React SEO matters.');
 * // => { keyword: 'react seo', count: 2, density: 20.0, totalWords: 10 }
 * ```
 */
export function calculateKeywordDensity(keyword: string, content: string): KeywordDensityResult {
  const plainText = stripHtml(content).toLowerCase();
  const words = getWords(content);
  const normalizedKeyword = keyword.toLowerCase().trim();

  if (!normalizedKeyword || words.length === 0) {
    return { keyword, count: 0, density: 0, totalWords: words.length };
  }

  // Count occurrences of the keyphrase
  const count = countKeywordOccurrences(plainText, normalizedKeyword);

  // Density = (keyword occurrences / total words) * 100
  // For multi-word keyphrases, we count phrase occurrences
  const keywordWordCount = normalizedKeyword.split(/\s+/).length;
  const density =
    words.length > 0 ? Math.round(((count * keywordWordCount) / words.length) * 1000) / 10 : 0;

  return {
    keyword,
    count,
    density,
    totalWords: words.length,
  };
}

/**
 * Count occurrences of a keyword/keyphrase in text (case-insensitive).
 */
export function countKeywordOccurrences(text: string, keyword: string): number {
  const normalizedText = text.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase().trim();

  if (!normalizedKeyword) return 0;

  // Use word boundary matching for single words
  const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
  const matches = normalizedText.match(regex);

  return matches?.length ?? 0;
}

/**
 * Analyze where a focus keyphrase appears throughout page content.
 */
export function analyzeKeyphraseOccurrences(config: {
  keyphrase: string;
  title?: string;
  metaDescription?: string;
  content: string;
  slug?: string;
  images?: Array<{ alt?: string }>;
}): KeyphraseOccurrences {
  const { keyphrase, title, metaDescription, content, slug, images } = config;
  const kp = keyphrase.toLowerCase().trim();

  const plainContent = stripHtml(content).toLowerCase();
  const words = getWords(content);

  // Check title
  const inTitle = title ? title.toLowerCase().includes(kp) : false;

  // Check meta description
  const inMetaDescription = metaDescription ? metaDescription.toLowerCase().includes(kp) : false;

  // Check first paragraph — use non-backtracking pattern to avoid ReDoS
  const firstParagraphMatch = content.match(/<p[^>]*>((?:[^<]|<(?!\/p>))*)<\/p>/i);
  const firstParagraph = firstParagraphMatch
    ? stripHtml(firstParagraphMatch[1] ?? '').toLowerCase()
    : (plainContent.split(/\n\n/)[0]?.toLowerCase() ?? '');
  const inFirstParagraph = firstParagraph.includes(kp);

  // Check H1 — use non-backtracking pattern to avoid ReDoS
  const h1Match = content.match(/<h1[^>]*>((?:[^<]|<(?!\/h1>))*)<\/h1>/i);
  const inH1 = h1Match
    ? stripHtml(h1Match[1] ?? '')
        .toLowerCase()
        .includes(kp)
    : false;

  // Count in headings (h2-h6) — use non-backtracking pattern to avoid ReDoS
  const headingRegex = /<h([2-6])[^>]*>((?:[^<]|<(?!\/h[2-6]>))*)<\/h\1>/gi;
  let headingMatch;
  let inHeadings = 0;
  while ((headingMatch = headingRegex.exec(content)) !== null) {
    if (
      stripHtml(headingMatch[2] ?? '')
        .toLowerCase()
        .includes(kp)
    ) {
      inHeadings++;
    }
  }

  // Count in content
  const inContent = countKeywordOccurrences(plainContent, kp);

  // Check slug
  const inSlug = slug ? slug.toLowerCase().includes(kp.replace(/\s+/g, '-')) : false;

  // Count in alt text
  const inAltText = images ? images.filter((img) => img.alt?.toLowerCase().includes(kp)).length : 0;

  // Calculate density
  const keywordWordCount = kp.split(/\s+/).length;
  const density =
    words.length > 0 ? Math.round(((inContent * keywordWordCount) / words.length) * 1000) / 10 : 0;

  return {
    inTitle,
    inMetaDescription,
    inFirstParagraph,
    inH1,
    inHeadings,
    inContent,
    inSlug,
    inAltText,
    density,
    totalWords: words.length,
  };
}
