// @power-seo/content-analysis — Keyphrase Position in Title Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkKeyphraseTitlePosition(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, title } = input;

  if (
    !focusKeyphrase ||
    focusKeyphrase.trim().length === 0 ||
    !title ||
    title.trim().length === 0
  ) {
    return {
      id: 'keyphrase-title-position',
      title: 'Keyphrase position in title',
      description: 'No focus keyphrase or title set.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const kp = focusKeyphrase.toLowerCase().trim();
  const titleLower = title.toLowerCase();
  const position = titleLower.indexOf(kp);

  if (position === -1) {
    return {
      id: 'keyphrase-title-position',
      title: 'Keyphrase position in title',
      description: 'The focus keyphrase does not appear in the title.',
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  const halfLength = Math.floor(title.length / 2);

  if (position <= halfLength) {
    return {
      id: 'keyphrase-title-position',
      title: 'Keyphrase position in title',
      description: 'Focus keyphrase appears near the beginning of the title. Well done!',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  return {
    id: 'keyphrase-title-position',
    title: 'Keyphrase position in title',
    description:
      'The focus keyphrase appears in the title but not near the beginning. Move it closer to the start.',
    status: 'ok',
    score: 3,
    maxScore: 5,
  };
}
