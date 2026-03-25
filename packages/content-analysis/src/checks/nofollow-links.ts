// @power-seo/content-analysis — Nofollow Links Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkNofollowLinks(input: ContentAnalysisInput): AnalysisResult {
  const { content, siteUrl } = input;

  // Parse all <a> tags from content
  const anchorRegex = /<a\s([^>]*)>/gi;
  const externalLinks: Array<{ href: string; rel: string }> = [];

  let match;
  while ((match = anchorRegex.exec(content)) !== null) {
    const attrs = match[1]!;

    // Extract href
    const hrefMatch = attrs.match(/href=["']([^"'#]+)["']/i);
    if (!hrefMatch) continue;

    const url = hrefMatch[1]!.trim();

    // Skip non-http links
    if (
      !url ||
      url.startsWith('mailto:') ||
      url.startsWith('tel:') ||
      url.startsWith('javascript:') ||
      url.startsWith('/') ||
      url.startsWith('./') ||
      url.startsWith('../')
    ) {
      continue;
    }

    // Skip same-origin links
    if (siteUrl && url.toLowerCase().startsWith(siteUrl.toLowerCase())) {
      continue;
    }

    // Only consider external http(s) links
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const relMatch = attrs.match(/rel=["']([^"']*)["']/i);
      const rel = relMatch ? relMatch[1]! : '';
      externalLinks.push({ href: url, rel });
    }
  }

  if (externalLinks.length === 0) {
    return {
      id: 'nofollow-links',
      title: 'Nofollow links',
      description: 'No external links found.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const nofollowCount = externalLinks.filter((link) =>
    link.rel.toLowerCase().includes('nofollow'),
  ).length;

  if (nofollowCount < externalLinks.length) {
    // Some are dofollow — this is good
    return {
      id: 'nofollow-links',
      title: 'Nofollow links',
      description:
        'Your external links include dofollow links. This is natural and healthy for SEO.',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // All external links are nofollow
  return {
    id: 'nofollow-links',
    title: 'Nofollow links',
    description: `All ${externalLinks.length} external link${externalLinks.length === 1 ? ' is' : 's are'} nofollow. Consider making some dofollow to appear more natural.`,
    status: 'ok',
    score: 3,
    maxScore: 5,
  };
}
