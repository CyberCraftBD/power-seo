// ============================================================================
// @power-seo/readability — Flesch-Kincaid Algorithms
// ============================================================================

import type { TextStatistics } from '@power-seo/core';

/**
 * Calculate the Flesch Reading Ease score.
 *
 * Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
 *
 * Scale:
 * - 90-100: Very Easy (5th grade)
 * - 80-89: Easy (6th grade)
 * - 70-79: Fairly Easy (7th grade)
 * - 60-69: Standard (8th-9th grade)
 * - 50-59: Fairly Difficult (10th-12th grade)
 * - 30-49: Difficult (College)
 * - 0-29: Very Confusing (Graduate)
 */
export function fleschReadingEase(stats: TextStatistics): number {
  if (stats.wordCount === 0 || stats.sentenceCount === 0) return 0;

  const score =
    206.835 - 1.015 * stats.avgWordsPerSentence - 84.6 * stats.avgSyllablesPerWord;

  return Math.round(Math.max(0, Math.min(100, score)) * 100) / 100;
}

/**
 * Calculate the Flesch-Kincaid Grade Level.
 *
 * Formula: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
 *
 * Returns a US school grade level (e.g., 8.0 = 8th grade).
 */
export function fleschKincaidGrade(stats: TextStatistics): number {
  if (stats.wordCount === 0 || stats.sentenceCount === 0) return 0;

  const grade =
    0.39 * stats.avgWordsPerSentence + 11.8 * stats.avgSyllablesPerWord - 15.59;

  return Math.round(Math.max(0, grade) * 100) / 100;
}
