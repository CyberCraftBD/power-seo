// @power-seo/content-analysis — Table of Contents Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkTableOfContents(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;

  // Strip HTML, count words
  const textOnly = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = textOnly.length > 0 ? textOnly.split(/\s+/) : [];
  const wordCount = words.length;

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
    /<[ou]l[^>]*>[\s\S]*?<a[^>]*href=["']#/i.test(content);

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
