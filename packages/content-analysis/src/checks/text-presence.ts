// @power-seo/content-analysis — Text Presence Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { getWords } from '@power-seo/core';

export function checkTextPresence(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;

  const wordCount = getWords(content).length;

  if (wordCount === 0) {
    return {
      id: 'text-presence',
      title: 'Text presence',
      description: 'No text content found. Add text content to your page.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  if (wordCount < 50) {
    return {
      id: 'text-presence',
      title: 'Text presence',
      description: `Very little text content (${wordCount} words). Search engines need substantial content to understand your page.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  return {
    id: 'text-presence',
    title: 'Text presence',
    description: 'Text content is present. Good foundation for SEO.',
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
