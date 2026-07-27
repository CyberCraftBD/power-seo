// @power-seo/content-analysis — Keyphrase in Introduction Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

// The "introduction" is the opening of the visible content. Defining it by the
// first N words of plain text (rather than only the first <p> element) avoids a
// false "not in the introduction" when the intro is not wrapped in <p> (e.g. a
// leading <div>) or spans a short lead-in plus the first paragraph.
const INTRODUCTION_WORDS = 150;

export function checkKeyphraseIntroduction(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'keyphrase-introduction',
      title: 'Keyphrase in introduction',
      description: 'No focus keyphrase set.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const kp = focusKeyphrase.toLowerCase().trim();
  const introText = stripHtml(content)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, INTRODUCTION_WORDS)
    .join(' ');

  if (introText.includes(kp)) {
    return {
      id: 'keyphrase-introduction',
      title: 'Keyphrase in introduction',
      description: 'The focus keyphrase appears in the introduction. Good job!',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  return {
    id: 'keyphrase-introduction',
    title: 'Keyphrase in introduction',
    description:
      'The focus keyphrase does not appear in the introduction. Add it to the first paragraph for better relevance.',
    status: 'ok',
    score: 2,
    maxScore: 5,
  };
}
