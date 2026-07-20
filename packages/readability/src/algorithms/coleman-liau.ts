// @power-seo/readability — Coleman-Liau Index
// ----------------------------------------------------------------------------

import type { TextStatistics } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

/**
 * Calculate the Coleman-Liau Index.
 *
 * Formula: 0.0588 * L - 0.296 * S - 15.8
 *
 * Where:
 * - L = average number of letters per 100 words
 * - S = average number of sentences per 100 words
 *
 * `L` is defined over alphabetic letters only. Pass `content` (the original
 * text, HTML allowed) so letters can be counted directly; punctuation and
 * digits are excluded, matching the Coleman-Liau definition. When `content`
 * is omitted, letters are approximated from `characterCount`.
 *
 * Returns a US school grade level.
 */
export function colemanLiau(stats: TextStatistics, content?: string): number {
  if (stats.wordCount === 0 || stats.sentenceCount === 0) return 0;

  // L: average letters per 100 words.
  // Count alphabetic letters directly when the source text is available,
  // otherwise fall back to approximating from characterCount (which includes
  // punctuation, digits and inter-word spaces).
  const letterCount =
    content !== undefined
      ? (stripHtml(content).match(/[A-Za-z]/g) || []).length
      : stats.characterCount - (stats.wordCount - 1); // subtract spaces between words
  const L = (letterCount / stats.wordCount) * 100;

  // S: average sentences per 100 words
  const S = (stats.sentenceCount / stats.wordCount) * 100;

  const index = 0.0588 * L - 0.296 * S - 15.8;
  return Math.round(Math.max(0, index) * 100) / 100;
}
