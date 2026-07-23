// @power-seo/content-analysis — Table of Contents Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { getWords, extractTagContents } from '@power-seo/core';

/**
 * Detect a ToC-style list: a single <ul>/<ol> element containing 2 or more
 * anchor links (href="#..."). The check is bounded to each list's own inner
 * HTML so an unrelated list plus a lone back-to-top anchor elsewhere in the
 * document is not a false positive.
 */
function hasAnchorLinkList(content: string): boolean {
  const lists = extractTagContents(content, 'ul').concat(extractTagContents(content, 'ol'));
  for (const list of lists) {
    const anchorLinks = list.match(/<a[^>]*href=["']#/gi);
    if (anchorLinks !== null && anchorLinks.length >= 2) {
      return true;
    }
  }
  return false;
}

export function checkTableOfContents(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;

  const wordCount = getWords(content).length;

  if (wordCount < 1500) {
    return {
      id: 'table-of-contents',
      title: 'Table of contents',
      description: 'Content is short enough that a table of contents is not needed.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Check for common table of contents patterns
  const hasToc =
    /id=["']table-of-contents["']/i.test(content) ||
    /id=["']toc["']/i.test(content) ||
    /class=["'][^"']*\btoc\b[^"']*["']/i.test(content) ||
    /<nav[^>]*>[\s\S]*?<a[^>]*href=["']#/i.test(content) ||
    hasAnchorLinkList(content);

  if (hasToc) {
    return {
      id: 'table-of-contents',
      title: 'Table of contents',
      description: 'Table of contents detected. This helps readers navigate long content.',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  return {
    id: 'table-of-contents',
    title: 'Table of contents',
    description: `Content is ${wordCount} words long. Consider adding a table of contents for better navigation and potential SERP feature.`,
    status: 'ok',
    score: 3,
    maxScore: 5,
  };
}
