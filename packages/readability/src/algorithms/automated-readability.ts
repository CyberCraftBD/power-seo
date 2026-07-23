// @power-seo/readability — Automated Readability Index (ARI)
// ----------------------------------------------------------------------------

import type { TextStatistics } from '@power-seo/core';

/**
 * Calculate the Automated Readability Index (ARI).
 *
 * Formula: 4.71 * (characters/words) + 0.5 * (words/sentences) - 21.43
 *
 * Returns a US school grade level.
 */
export function automatedReadability(stats: TextStatistics): number {
  if (stats.wordCount === 0 || stats.sentenceCount === 0) return 0;

  // ARI is defined over letters and digits per word. characterCount includes
  // spaces and punctuation, which inflates the grade (issue #165).
  const charsPerWord = stats.letterDigitCount / stats.wordCount;
  const wordsPerSentence = stats.wordCount / stats.sentenceCount;

  const index = 4.71 * charsPerWord + 0.5 * wordsPerSentence - 21.43;
  return Math.round(Math.max(0, index) * 100) / 100;
}
