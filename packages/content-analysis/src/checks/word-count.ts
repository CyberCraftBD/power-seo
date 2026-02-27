// @power-seo/content-analysis — Word Count Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { getWords, MIN_WORD_COUNT, RECOMMENDED_WORD_COUNT } from '@power-seo/core';

export function checkWordCount(input: ContentAnalysisInput): AnalysisResult {
  const words = getWords(input.content);
  const count = words.length;

  if (count < MIN_WORD_COUNT) {
    return {
      id: 'word-count',
      title: 'Word count',
      description: `The content is ${count} words, which is below the recommended minimum of ${MIN_WORD_COUNT}. Add more content to improve SEO.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  if (count < RECOMMENDED_WORD_COUNT) {
    return {
      id: 'word-count',
      title: 'Word count',
      description: `The content is ${count} words. Consider expanding to at least ${RECOMMENDED_WORD_COUNT} words for more comprehensive coverage.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'word-count',
    title: 'Word count',
    description: `The content is ${count} words. Good — this provides enough depth for search engines.`,
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
