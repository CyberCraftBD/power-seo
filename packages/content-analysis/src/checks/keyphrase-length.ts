// @power-seo/content-analysis — Keyphrase Length Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkKeyphraseLength(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'keyphrase-length',
      title: 'Keyphrase length',
      description: 'No focus keyphrase set.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const words = focusKeyphrase.trim().split(/\s+/);
  const wordCount = words.length;

  if (wordCount <= 4) {
    return {
      id: 'keyphrase-length',
      title: 'Keyphrase length',
      description: `Focus keyphrase length is good (${wordCount} word${wordCount === 1 ? '' : 's'}).`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (wordCount <= 6) {
    return {
      id: 'keyphrase-length',
      title: 'Keyphrase length',
      description: `Focus keyphrase is ${wordCount} words long. Consider using a shorter, more focused keyphrase.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'keyphrase-length',
    title: 'Keyphrase length',
    description: `Focus keyphrase is too long (${wordCount} words). Use 1-4 words for better targeting.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
