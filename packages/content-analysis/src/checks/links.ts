// @power-seo/content-analysis — Links Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

/**
 * Parse all <a href="..."> links from HTML content and classify as internal or external.
 */
function parseLinksFromContent(
  html: string,
  siteUrl?: string,
): { internal: string[]; external: string[] } {
  const internal: string[] = [];
  const external: string[] = [];

  const hrefRegex = /<a\s[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const url = match[1]!.trim();
    // Skip anchors, mailto, tel, javascript
    if (
      !url ||
      url.startsWith('mailto:') ||
      url.startsWith('tel:') ||
      url.startsWith('javascript:')
    )
      continue;

    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      // Relative paths are internal
      internal.push(url);
    } else if (siteUrl && url.toLowerCase().startsWith(siteUrl.toLowerCase())) {
      // Same-origin absolute URLs are internal
      internal.push(url);
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      // Other absolute URLs are external
      external.push(url);
    }
  }

  return { internal, external };
}

export function checkLinks(input: ContentAnalysisInput): AnalysisResult[] {
  const results: AnalysisResult[] = [];

  // Use provided arrays if available, otherwise parse from content HTML
  let internalLinks = input.internalLinks;
  let externalLinks = input.externalLinks;

  if (
    (!internalLinks || internalLinks.length === 0) &&
    (!externalLinks || externalLinks.length === 0) &&
    input.content
  ) {
    const parsed = parseLinksFromContent(input.content, input.siteUrl);
    if (parsed.internal.length > 0 || parsed.external.length > 0) {
      internalLinks = parsed.internal.length > 0 ? parsed.internal : undefined;
      externalLinks = parsed.external.length > 0 ? parsed.external : undefined;
    }
  }

  const hasInternal = internalLinks && internalLinks.length > 0;
  const hasExternal = externalLinks && externalLinks.length > 0;

  if (!hasInternal) {
    results.push({
      id: 'internal-links',
      title: 'Internal links',
      description:
        'No internal links found. Add links to other pages on your site to improve crawlability and distribute link equity.',
      status: 'poor',
      score: 0,
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
      status: 'poor',
      score: 0,
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
