// @power-seo/content-analysis — Previously Used Keyphrase Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

/**
 * Normalize a keyphrase for comparison: lowercase, collapse whitespace, trim.
 */
function normalize(kp: string): string {
  return kp.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Check whether two keyphrases have a partial/fuzzy overlap
 * (one contains the other as a substring).
 */
function hasPartialOverlap(a: string, b: string): boolean {
  return a.includes(b) || b.includes(a);
}

/**
 * Check if the focus keyphrase was already used in another post.
 *
 * - Exact match: the same keyphrase is used word-for-word elsewhere.
 * - Partial overlap: one keyphrase contains the other (e.g. "running shoes" vs "best running shoes").
 * - Unique: no conflict found.
 *
 * This helps avoid keyword cannibalization where multiple pages compete
 * for the same search query.
 */
export function checkPreviouslyUsedKeyphrase(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, previouslyUsedKeyphrases } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'previously-used-keyphrase',
      title: 'Previously used keyphrase',
      description: 'No focus keyphrase set. Set one to check for duplicate keyphrase usage.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  if (!previouslyUsedKeyphrases || previouslyUsedKeyphrases.length === 0) {
    return {
      id: 'previously-used-keyphrase',
      title: 'Previously used keyphrase',
      description:
        'No previously used keyphrases data available. Provide this data to detect keyword cannibalization.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const normalizedFocus = normalize(focusKeyphrase);

  // Check for exact match first
  for (const entry of previouslyUsedKeyphrases) {
    const normalizedExisting = normalize(entry.keyphrase);
    if (normalizedFocus === normalizedExisting) {
      const urlNote = entry.postUrl ? ` (${entry.postUrl})` : '';
      return {
        id: 'previously-used-keyphrase',
        title: 'Previously used keyphrase',
        description:
          `This exact keyphrase has already been used in "${entry.postTitle}"${urlNote}. ` +
          'Using the same keyphrase on multiple pages causes keyword cannibalization. ' +
          'Choose a unique keyphrase for this content.',
        status: 'poor',
        score: 0,
        maxScore: 5,
      };
    }
  }

  // Check for partial overlap (one contains the other)
  for (const entry of previouslyUsedKeyphrases) {
    const normalizedExisting = normalize(entry.keyphrase);
    if (hasPartialOverlap(normalizedFocus, normalizedExisting)) {
      return {
        id: 'previously-used-keyphrase',
        title: 'Previously used keyphrase',
        description:
          `This keyphrase partially overlaps with "${entry.keyphrase}" used in "${entry.postTitle}". ` +
          'Consider differentiating your keyphrase further to avoid competing with your own content.',
        status: 'ok',
        score: 3,
        maxScore: 5,
      };
    }
  }

  // No conflicts
  return {
    id: 'previously-used-keyphrase',
    title: 'Previously used keyphrase',
    description:
      'This keyphrase has not been used on any other page. No keyword cannibalization risk detected.',
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
