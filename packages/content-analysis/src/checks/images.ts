// ============================================================================
// @power-seo/content-analysis — Images Check
// ============================================================================

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkImages(input: ContentAnalysisInput): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  const { images, focusKeyphrase } = input;

  if (!images || images.length === 0) {
    results.push({
      id: 'image-alt',
      title: 'Image alt attributes',
      description: 'No images found. Consider adding images to make your content more engaging.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
    return results;
  }

  // --- Alt text check ---
  const missingAlt = images.filter((img) => !img.alt || img.alt.trim().length === 0);

  if (missingAlt.length === 0) {
    results.push({
      id: 'image-alt',
      title: 'Image alt attributes',
      description: 'All images have alt text. Great for accessibility and SEO!',
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else if (missingAlt.length === images.length) {
    results.push({
      id: 'image-alt',
      title: 'Image alt attributes',
      description: 'None of the images have alt text. Add descriptive alt attributes for accessibility and SEO.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'image-alt',
      title: 'Image alt attributes',
      description: `${missingAlt.length} of ${images.length} images are missing alt text. Add alt attributes to all images.`,
      status: 'ok',
      score: 2,
      maxScore: 5,
    });
  }

  // --- Keyphrase in alt text check ---
  if (focusKeyphrase && focusKeyphrase.trim().length > 0) {
    const kp = focusKeyphrase.toLowerCase().trim();
    const hasKeyphraseInAlt = images.some(
      (img) => img.alt && img.alt.toLowerCase().includes(kp),
    );

    if (hasKeyphraseInAlt) {
      results.push({
        id: 'image-keyphrase',
        title: 'Keyphrase in image alt',
        description: 'The focus keyphrase appears in at least one image alt attribute.',
        status: 'good',
        score: 5,
        maxScore: 5,
      });
    } else {
      results.push({
        id: 'image-keyphrase',
        title: 'Keyphrase in image alt',
        description:
          'The focus keyphrase does not appear in any image alt attribute. Add it to at least one image.',
        status: 'ok',
        score: 2,
        maxScore: 5,
      });
    }
  }

  return results;
}
