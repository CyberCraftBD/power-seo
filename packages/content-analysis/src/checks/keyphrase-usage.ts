// @power-seo/content-analysis — Keyphrase Usage Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import {
  analyzeKeyphraseOccurrences,
  calculateKeywordDensity,
  KEYWORD_DENSITY,
} from '@power-seo/core';

export function checkKeyphraseUsage(input: ContentAnalysisInput): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  const { focusKeyphrase, title, metaDescription, content, slug, images } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    results.push({
      id: 'keyphrase-density',
      title: 'Keyphrase density',
      description: 'No focus keyphrase set. Set one to get keyphrase analysis.',
      status: 'good',
      score: 5,
      maxScore: 5,
    });
    return results;
  }

  const occurrences = analyzeKeyphraseOccurrences({
    keyphrase: focusKeyphrase,
    title,
    metaDescription,
    content,
    slug,
    images,
  });

  const densityResult = calculateKeywordDensity(focusKeyphrase, content);

  // --- Density check ---
  if (densityResult.density < KEYWORD_DENSITY.MIN) {
    results.push({
      id: 'keyphrase-density',
      title: 'Keyphrase density',
      description: `Keyphrase density is ${densityResult.density}%, which is below the recommended minimum of ${KEYWORD_DENSITY.MIN}%. Use the keyphrase more often.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    });
  } else if (densityResult.density > KEYWORD_DENSITY.MAX) {
    results.push({
      id: 'keyphrase-density',
      title: 'Keyphrase density',
      description: `Keyphrase density is ${densityResult.density}%, which exceeds the recommended maximum of ${KEYWORD_DENSITY.MAX}%. Reduce usage to avoid keyword stuffing.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    });
  } else if (
    densityResult.density >= KEYWORD_DENSITY.MIN &&
    densityResult.density <= KEYWORD_DENSITY.MAX
  ) {
    const isOptimal = Math.abs(densityResult.density - KEYWORD_DENSITY.OPTIMAL) < 0.5;
    results.push({
      id: 'keyphrase-density',
      title: 'Keyphrase density',
      description: `Keyphrase density is ${densityResult.density}%.${isOptimal ? ' Great — this is close to the optimal density.' : ' This is within the recommended range.'}`,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  }

  // --- Distribution check ---
  const distributionPoints: string[] = [];
  if (!occurrences.inFirstParagraph) distributionPoints.push('introduction');
  if (!occurrences.inH1 && occurrences.inHeadings === 0) distributionPoints.push('headings');
  if (!occurrences.inSlug) distributionPoints.push('slug');
  if (occurrences.inAltText === 0 && images && images.length > 0)
    distributionPoints.push('image alt text');

  if (distributionPoints.length === 0) {
    results.push({
      id: 'keyphrase-distribution',
      title: 'Keyphrase distribution',
      description:
        'The focus keyphrase is well-distributed across the introduction, headings, slug, and image alt text.',
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else if (distributionPoints.length <= 2) {
    results.push({
      id: 'keyphrase-distribution',
      title: 'Keyphrase distribution',
      description: `Consider adding the keyphrase to: ${distributionPoints.join(', ')}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'keyphrase-distribution',
      title: 'Keyphrase distribution',
      description: `The keyphrase is missing from: ${distributionPoints.join(', ')}. Distribute it more broadly.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    });
  }

  return results;
}
