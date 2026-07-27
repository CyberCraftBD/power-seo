// @power-seo/core — Keyword Density Calculator
// ----------------------------------------------------------------------------

import { getWords, stripHtml, extractFirstTagContent, extractTagContents } from './text-stats.js';

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

  // Density = (keyphrase occurrences / total words) * 100.
  // A multi-word keyphrase counts as a single occurrence (matching the
  // documented example: 2 occurrences of 'react seo' in 10 words => 20.0).
  const density = words.length > 0 ? Math.round((count / words.length) * 1000) / 10 : 0;

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

  const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Unicode-aware boundaries. \b only recognizes [A-Za-z0-9_], so non-Latin
  // keyphrases (e.g. Bangla) counted as zero, and keyphrases containing
  // punctuation (e.g. "C++", ".NET") failed the trailing \b — both producing a
  // false "keyphrase never used" / 0% density report. Lookarounds on the
  // letter/number classes give real word boundaries for every script.
  try {
    const regex = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'giu');
    return normalizedText.match(regex)?.length ?? 0;
  } catch {
    // Runtime without lookbehind / Unicode property escapes — fall back to ASCII \b.
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    return normalizedText.match(regex)?.length ?? 0;
  }
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

  // Check first paragraph — use string-based extraction to avoid regex ReDoS
  const firstParaInner = extractFirstTagContent(content, 'p');
  const firstParagraph =
    firstParaInner !== null
      ? stripHtml(firstParaInner).toLowerCase()
      : (plainContent.split(/\n\n/)[0]?.toLowerCase() ?? '');
  const inFirstParagraph = firstParagraph.includes(kp);

  // Check H1 — use string-based extraction to avoid regex ReDoS
  const h1Inner = extractFirstTagContent(content, 'h1');
  const inH1 = h1Inner !== null ? stripHtml(h1Inner).toLowerCase().includes(kp) : false;

  // Count in headings (h2-h6) — use string-based extraction to avoid regex ReDoS
  let inHeadings = 0;
  for (let level = 2; level <= 6; level++) {
    for (const inner of extractTagContents(content, `h${level}`)) {
      if (stripHtml(inner).toLowerCase().includes(kp)) {
        inHeadings++;
      }
    }
  }

  // Count in content
  const inContent = countKeywordOccurrences(plainContent, kp);

  // Check slug
  const inSlug = slug ? slug.toLowerCase().includes(kp.replace(/\s+/g, '-')) : false;

  // Count in alt text
  const inAltText = images ? images.filter((img) => img.alt?.toLowerCase().includes(kp)).length : 0;

  // Calculate density — occurrences / total words, matching calculateKeywordDensity
  // (a multi-word keyphrase counts as a single occurrence). Previously this
  // multiplied by the keyphrase word count, so the same keyphrase reported a
  // different density here than in the keyphrase-density check.
  const density = words.length > 0 ? Math.round((inContent / words.length) * 1000) / 10 : 0;

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
