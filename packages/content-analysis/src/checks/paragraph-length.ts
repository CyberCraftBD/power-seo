// @power-seo/content-analysis — Paragraph Length Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

const MAX_PARAGRAPH_WORDS = 150;
const IDEAL_MAX_PARAGRAPH_WORDS = 120;

/**
 * Extract paragraphs from HTML content.
 * Splits on <p>, <br>, or double newlines.
 */
function extractParagraphs(html: string): string[] {
  // Split on closing/opening paragraph tags or double line breaks
  const blocks = html
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?p[^>]*>/gi, '\n\n')
    .split(/\n{2,}/);

  return blocks
    .map((block) => stripHtml(block).trim())
    .filter((text) => text.length > 0);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

export function checkParagraphLength(input: ContentAnalysisInput): AnalysisResult {
  const paragraphs = extractParagraphs(input.content);

  if (paragraphs.length === 0) {
    return {
      id: 'paragraph-length',
      title: 'Paragraph length',
      description: 'No paragraphs found. Structure your content into paragraphs for better readability.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  const longParagraphs = paragraphs.filter((p) => countWords(p) > MAX_PARAGRAPH_WORDS);
  const slightlyLong = paragraphs.filter(
    (p) => countWords(p) > IDEAL_MAX_PARAGRAPH_WORDS && countWords(p) <= MAX_PARAGRAPH_WORDS,
  );

  if (longParagraphs.length > 0) {
    return {
      id: 'paragraph-length',
      title: 'Paragraph length',
      description: `${longParagraphs.length} paragraph${longParagraphs.length === 1 ? ' is' : 's are'} over ${MAX_PARAGRAPH_WORDS} words. Break long paragraphs into shorter ones for better readability.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  if (slightlyLong.length > 0) {
    return {
      id: 'paragraph-length',
      title: 'Paragraph length',
      description: `${slightlyLong.length} paragraph${slightlyLong.length === 1 ? ' is' : 's are'} between ${IDEAL_MAX_PARAGRAPH_WORDS} and ${MAX_PARAGRAPH_WORDS} words. Consider shortening them.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'paragraph-length',
    title: 'Paragraph length',
    description: 'All paragraphs are a good length. Nice work!',
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
