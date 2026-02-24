// @power-seo/content-analysis — Meta Description Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { validateMetaDescription } from '@power-seo/core';

export function checkMetaDescription(input: ContentAnalysisInput): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  const { metaDescription, focusKeyphrase } = input;

  // --- Presence & validity check ---
  if (!metaDescription || metaDescription.trim().length === 0) {
    results.push({
      id: 'meta-description-presence',
      title: 'Meta description',
      description:
        'No meta description has been set. Add one to control how your page appears in search results.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    });
    return results;
  }

  const validation = validateMetaDescription(metaDescription);

  if (!validation.valid) {
    results.push({
      id: 'meta-description-presence',
      title: 'Meta description',
      description: validation.message,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  } else if (validation.severity === 'warning') {
    results.push({
      id: 'meta-description-presence',
      title: 'Meta description',
      description: validation.message,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'meta-description-presence',
      title: 'Meta description',
      description: validation.message,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  }

  // --- Keyphrase in meta description check ---
  if (focusKeyphrase && focusKeyphrase.trim().length > 0) {
    const kp = focusKeyphrase.toLowerCase().trim();
    const descLower = metaDescription.toLowerCase();

    if (descLower.includes(kp)) {
      results.push({
        id: 'meta-description-keyphrase',
        title: 'Keyphrase in meta description',
        description: 'The focus keyphrase appears in the meta description. Well done!',
        status: 'good',
        score: 5,
        maxScore: 5,
      });
    } else {
      results.push({
        id: 'meta-description-keyphrase',
        title: 'Keyphrase in meta description',
        description:
          'The focus keyphrase does not appear in the meta description. Add it to improve click-through rate.',
        status: 'ok',
        score: 2,
        maxScore: 5,
      });
    }
  }

  return results;
}
