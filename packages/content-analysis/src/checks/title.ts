// @power-seo/content-analysis — Title Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { validateTitle } from '@power-seo/core';

export function checkTitle(input: ContentAnalysisInput): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  const { title, focusKeyphrase } = input;

  // --- Presence & validity check ---
  if (!title || title.trim().length === 0) {
    results.push({
      id: 'title-presence',
      title: 'SEO title',
      description: 'No title has been set. Add a title to improve search visibility.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    });
    return results;
  }

  const validation = validateTitle(title);

  if (!validation.valid) {
    results.push({
      id: 'title-presence',
      title: 'SEO title',
      description: validation.message,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  } else if (validation.severity === 'warning') {
    results.push({
      id: 'title-presence',
      title: 'SEO title',
      description: validation.message,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'title-presence',
      title: 'SEO title',
      description: validation.message,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  }

  // --- Keyphrase in title check ---
  if (focusKeyphrase && focusKeyphrase.trim().length > 0) {
    const kp = focusKeyphrase.toLowerCase().trim();
    const titleLower = title.toLowerCase();

    if (titleLower.includes(kp)) {
      results.push({
        id: 'title-keyphrase',
        title: 'Keyphrase in title',
        description: 'The focus keyphrase appears in the SEO title. Good job!',
        status: 'good',
        score: 5,
        maxScore: 5,
      });
    } else {
      results.push({
        id: 'title-keyphrase',
        title: 'Keyphrase in title',
        description:
          'The focus keyphrase does not appear in the SEO title. Add it to improve relevance.',
        status: 'ok',
        score: 2,
        maxScore: 5,
      });
    }
  }

  return results;
}
