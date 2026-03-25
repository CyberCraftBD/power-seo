// @power-seo/content-analysis — Subheading Distribution Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

const MAX_WORDS_BETWEEN_SUBHEADINGS = 300;
const IDEAL_WORDS_BETWEEN_SUBHEADINGS = 250;

/**
 * Split content into sections based on headings (H2-H6).
 * Returns word counts for text between headings.
 */
function getTextSectionLengths(html: string): number[] {
  // Split on any heading tag (h2-h6)
  const sections = html.split(/<h[2-6][^>]*>/i);
  return sections
    .map((section) => {
      // Remove closing heading tags and other HTML
      const cleaned = section.replace(/<\/h[2-6]>/gi, '');
      const text = stripHtml(cleaned).trim();
      return text.split(/\s+/).filter((w) => w.length > 0).length;
    })
    .filter((count) => count > 0);
}

function countWords(text: string): number {
  const plain = stripHtml(text).trim();
  return plain.split(/\s+/).filter((w) => w.length > 0).length;
}

export function checkSubheadingDistribution(input: ContentAnalysisInput): AnalysisResult {
  const totalWords = countWords(input.content);

  // Short content doesn't need subheadings
  if (totalWords < 300) {
    return {
      id: 'subheading-distribution',
      title: 'Subheading distribution',
      description: 'Content is short enough that subheading distribution is not a concern.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const sectionLengths = getTextSectionLengths(input.content);

  // If there are no subheadings at all in long content
  if (sectionLengths.length <= 1) {
    return {
      id: 'subheading-distribution',
      title: 'Subheading distribution',
      description: `The content is ${totalWords} words long but has no subheadings. Add H2/H3 subheadings to break up the text and improve readability.`,
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  const tooLongSections = sectionLengths.filter((len) => len > MAX_WORDS_BETWEEN_SUBHEADINGS);
  const slightlyLongSections = sectionLengths.filter(
    (len) => len > IDEAL_WORDS_BETWEEN_SUBHEADINGS && len <= MAX_WORDS_BETWEEN_SUBHEADINGS,
  );

  if (tooLongSections.length > 0) {
    return {
      id: 'subheading-distribution',
      title: 'Subheading distribution',
      description: `${tooLongSections.length} text section${tooLongSections.length === 1 ? '' : 's'} exceed${tooLongSections.length === 1 ? 's' : ''} ${MAX_WORDS_BETWEEN_SUBHEADINGS} words without a subheading. Add more subheadings to break up long sections.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  if (slightlyLongSections.length > 0) {
    return {
      id: 'subheading-distribution',
      title: 'Subheading distribution',
      description: `${slightlyLongSections.length} section${slightlyLongSections.length === 1 ? ' is' : 's are'} between ${IDEAL_WORDS_BETWEEN_SUBHEADINGS} and ${MAX_WORDS_BETWEEN_SUBHEADINGS} words. Consider adding subheadings to improve structure.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'subheading-distribution',
    title: 'Subheading distribution',
    description: 'Subheadings are well-distributed throughout the content. Great structure!',
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
