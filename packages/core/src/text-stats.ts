// ============================================================================
// @ccbd-seo/core — Text Statistics Engine
// ============================================================================

import type { TextStatistics } from './types.js';

/**
 * Strip HTML tags from content, returning plain text.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split text into words.
 */
export function getWords(text: string): string[] {
  const cleaned = stripHtml(text);
  if (!cleaned) return [];
  return cleaned.split(/\s+/).filter((w) => w.length > 0);
}

/**
 * Split text into sentences using common sentence boundary rules.
 */
export function getSentences(text: string): string[] {
  const cleaned = stripHtml(text);
  if (!cleaned) return [];

  // Split on sentence-ending punctuation followed by space or end of string
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return sentences;
}

/**
 * Split HTML content into paragraphs.
 */
export function getParagraphs(html: string): string[] {
  // Split by paragraph tags or double newlines
  const blocks = html
    .split(/<\/p>|<br\s*\/?>.*<br\s*\/?>/gi)
    .map((block) => stripHtml(block).trim())
    .filter((block) => block.length > 0);

  if (blocks.length === 0) {
    // Fall back to double newline splitting
    return stripHtml(html)
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  return blocks;
}

/**
 * Count syllables in a word using a heuristic approach.
 *
 * This is a simplified English syllable counter. For production use with
 * high accuracy, consider using the `syllable` npm package.
 */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 2) return 1;

  // Special suffixes
  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;

  for (let i = 0; i < w.length; i++) {
    const isVowel = vowels.includes(w[i]!);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }

  // Handle silent 'e' at end
  if (w.endsWith('e') && !w.endsWith('le') && count > 1) {
    count--;
  }

  // Handle common suffixes
  if (w.endsWith('es') || w.endsWith('ed')) {
    // Don't count 'es' or 'ed' as extra unless preceded by 't' or 'd'
    const beforeSuffix = w[w.length - (w.endsWith('es') ? 3 : 3)];
    if (beforeSuffix !== 't' && beforeSuffix !== 'd') {
      // Already handled by vowel counting
    }
  }

  return Math.max(1, count);
}

/**
 * Count total syllables in text.
 */
export function countTotalSyllables(text: string): number {
  const words = getWords(text);
  return words.reduce((total, word) => total + countSyllables(word), 0);
}

/**
 * Get comprehensive text statistics.
 *
 * @example
 * ```ts
 * const stats = getTextStatistics('<p>Hello world. This is a test.</p>');
 * // => { wordCount: 7, sentenceCount: 2, ... }
 * ```
 */
export function getTextStatistics(content: string): TextStatistics {
  const words = getWords(content);
  const sentences = getSentences(content);
  const paragraphs = getParagraphs(content);
  const syllableCount = countTotalSyllables(content);
  const plainText = stripHtml(content);

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const paragraphCount = paragraphs.length;

  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    syllableCount,
    characterCount: plainText.length,
    avgWordsPerSentence: sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0,
    avgSyllablesPerWord: wordCount > 0 ? Math.round((syllableCount / wordCount) * 100) / 100 : 0,
  };
}
