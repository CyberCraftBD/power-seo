// @power-seo/content-analysis — URL Length Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { MAX_URL_LENGTH } from '@power-seo/core';

export function checkUrlLength(input: ContentAnalysisInput): AnalysisResult {
  const url = input.canonicalUrl || input.slug;

  if (!url || url.trim().length === 0) {
    return {
      id: 'url-length',
      title: 'URL length',
      description: 'No URL set.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const length = url.trim().length;

  if (length <= MAX_URL_LENGTH) {
    return {
      id: 'url-length',
      title: 'URL length',
      description: `URL length is good (${length} characters). Short URLs perform better in search.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (length <= 100) {
    return {
      id: 'url-length',
      title: 'URL length',
      description: `URL is ${length} characters. Consider keeping it under ${MAX_URL_LENGTH} characters.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'url-length',
    title: 'URL length',
    description: `URL is too long (${length} characters). Keep URLs under ${MAX_URL_LENGTH} characters for better SEO.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
