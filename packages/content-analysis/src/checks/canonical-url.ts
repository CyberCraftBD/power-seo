// @power-seo/content-analysis — Canonical URL Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkCanonicalUrl(input: ContentAnalysisInput): AnalysisResult {
  const { canonicalUrl } = input;

  if (!canonicalUrl || canonicalUrl.trim().length === 0) {
    return {
      id: 'canonical-url',
      title: 'Canonical URL',
      description:
        'No canonical URL set. Add a canonical URL to prevent duplicate content issues and consolidate link equity.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  const trimmed = canonicalUrl.trim();

  // Check for bare slugs (no slashes, no protocol)
  if (!trimmed.includes('/') && !trimmed.startsWith('http')) {
    return {
      id: 'canonical-url',
      title: 'Canonical URL',
      description:
        'Canonical URL appears to be a slug, not a full URL. Use the complete URL including the domain (e.g., https://example.com/blog/my-post).',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  // Check for relative paths
  if (trimmed.startsWith('/')) {
    return {
      id: 'canonical-url',
      title: 'Canonical URL',
      description:
        'Canonical URL is a relative path. It must be an absolute URL starting with https:// (e.g., https://example.com/blog/my-post).',
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  // Check for HTTP instead of HTTPS
  if (trimmed.startsWith('http://')) {
    return {
      id: 'canonical-url',
      title: 'Canonical URL',
      description: 'Canonical URL uses HTTP. Consider using HTTPS for better security and SEO.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // Valid HTTPS canonical URL
  if (trimmed.startsWith('https://')) {
    return {
      id: 'canonical-url',
      title: 'Canonical URL',
      description:
        'Canonical URL is set and uses HTTPS. Good for SEO and duplicate content prevention.',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // Unrecognized format
  return {
    id: 'canonical-url',
    title: 'Canonical URL',
    description:
      'Canonical URL format is not recognized. Use an absolute URL starting with https:// (e.g., https://example.com/blog/my-post).',
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
