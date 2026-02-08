// ============================================================================
// @ccbd-seo/readability — Coleman-Liau Index
// ============================================================================

import type { TextStatistics } from '@ccbd-seo/core';

/**
 * Calculate the Coleman-Liau Index.
 *
 * Formula: 0.0588 * L - 0.296 * S - 15.8
 *
 * Where:
 * - L = average number of letters per 100 words
 * - S = average number of sentences per 100 words
 *
 * Returns a US school grade level.
 */
export function colemanLiau(stats: TextStatistics): number {
  if (stats.wordCount === 0 || stats.sentenceCount === 0) return 0;

  // L: average letters per 100 words
  // characterCount from core includes spaces, so count only letters
  const letterCount = stats.characterCount - (stats.wordCount - 1); // subtract spaces between words
  const L = (letterCount / stats.wordCount) * 100;

  // S: average sentences per 100 words
  const S = (stats.sentenceCount / stats.wordCount) * 100;

  const index = 0.0588 * L - 0.296 * S - 15.8;
  return Math.round(Math.max(0, index) * 100) / 100;
}
