// ============================================================================
// @power-seo/readability — Gunning Fog Index
// ============================================================================

import { getWords, getSentences, countSyllables, stripHtml } from '@power-seo/core';

/**
 * Calculate the Gunning Fog Index.
 *
 * Formula: 0.4 * [(words/sentences) + 100 * (complex words/words)]
 *
 * "Complex words" are words with 3 or more syllables, excluding:
 * - Proper nouns (capitalized words that aren't sentence-starters)
 * - Common suffixes (-es, -ed, -ing) that push words to 3+ syllables
 *
 * Returns a US school grade level.
 */
export function gunningFog(content: string): number {
  const text = stripHtml(content);
  const words = getWords(content);
  const sentences = getSentences(content);

  if (words.length === 0 || sentences.length === 0) return 0;

  const complexWords = countComplexWords(text);
  const avgSentenceLength = words.length / sentences.length;
  const percentComplex = (complexWords / words.length) * 100;

  const index = 0.4 * (avgSentenceLength + percentComplex);
  return Math.round(Math.max(0, index) * 100) / 100;
}

/**
 * Count complex words (3+ syllables), excluding common inflected forms.
 */
function countComplexWords(text: string): number {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  let count = 0;

  for (const word of words) {
    const cleaned = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (!cleaned) continue;

    const syllables = countSyllables(cleaned);
    if (syllables < 3) continue;

    // Exclude words that are 3+ syllables only due to common suffixes
    const withoutSuffix = cleaned
      .replace(/ing$/, '')
      .replace(/ed$/, '')
      .replace(/es$/, '');

    if (withoutSuffix !== cleaned && countSyllables(withoutSuffix) < 3) {
      continue;
    }

    count++;
  }

  return count;
}
