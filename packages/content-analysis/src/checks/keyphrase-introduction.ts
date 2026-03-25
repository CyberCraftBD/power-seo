// @power-seo/content-analysis — Keyphrase in Introduction Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

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

  // Parse first <p> tag from HTML content
  const firstParagraphMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);

  if (!firstParagraphMatch) {
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

  // Strip HTML tags from the first paragraph
  const firstParagraphText = firstParagraphMatch[1]!.replace(/<[^>]*>/g, '');
  const kp = focusKeyphrase.toLowerCase().trim();
  const paragraphLower = firstParagraphText.toLowerCase();

  if (paragraphLower.includes(kp)) {
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
