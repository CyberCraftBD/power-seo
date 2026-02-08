// ============================================================================
// @ccbd-seo/content-analysis — Links Check
// ============================================================================

import type { ContentAnalysisInput, AnalysisResult } from '@ccbd-seo/core';

export function checkLinks(input: ContentAnalysisInput): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  const { internalLinks, externalLinks } = input;

  const hasInternal = internalLinks && internalLinks.length > 0;
  const hasExternal = externalLinks && externalLinks.length > 0;

  if (!hasInternal) {
    results.push({
      id: 'internal-links',
      title: 'Internal links',
      description:
        'No internal links found. Add links to other pages on your site to improve crawlability and distribute link equity.',
      status: 'ok',
      score: 2,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'internal-links',
      title: 'Internal links',
      description: `Found ${internalLinks!.length} internal link${internalLinks!.length === 1 ? '' : 's'}. Good for site structure and SEO.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  }

  if (!hasExternal) {
    results.push({
      id: 'external-links',
      title: 'External links',
      description:
        'No external links found. Consider adding outbound links to authoritative sources to strengthen your content.',
      status: 'ok',
      score: 2,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'external-links',
      title: 'External links',
      description: `Found ${externalLinks!.length} external link${externalLinks!.length === 1 ? '' : 's'}. Linking to quality sources adds credibility.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  }

  return results;
}
