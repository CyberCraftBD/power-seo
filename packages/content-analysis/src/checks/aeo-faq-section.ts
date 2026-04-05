// @power-seo/content-analysis — AEO: FAQ Section Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, extractTagContents } from '@power-seo/core';

/**
 * Count Q&A pairs: question-phrased H2/H3 headings followed by an answer paragraph (30–200 words).
 * FAQPage schema + FAQ section = 2.7–3.2× higher AI Overview citation rate (Relixir, 50-site study).
 */
function countQaPairs(html: string): number {
  const questionWordPattern = /\b(?:what|how|why|when|where|who|which|can|does|is|are|will|should)\b/i;
  const headingRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;

  let pairCount = 0;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html)) !== null) {
    const headingContent = match[1];
    if (headingContent === undefined) continue;

    const headingText = stripHtml(headingContent);
    const isQuestion =
      questionWordPattern.test(headingText) ||
      headingText.trim().endsWith('?');

    if (!isQuestion) continue;

    // Check the immediately following content for a valid answer paragraph
    const afterHeading = html.slice(match.index + match[0].length);
    const nextParagraphs = extractTagContents(afterHeading, 'p');
    const firstPara = nextParagraphs[0];

    if (firstPara !== undefined) {
      const paraWordCount = getWords(stripHtml(firstPara)).length;
      if (paraWordCount >= 30 && paraWordCount <= 200) {
        pairCount++;
      }
    }
  }

  return pairCount;
}

export function checkAeoFaqSection(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;
  const plain = stripHtml(content);
  const wordCount = getWords(plain).length;

  if (wordCount < 200) {
    return {
      id: 'aeo-faq-section',
      title: 'FAQ section (AEO)',
      description: 'Add more content to evaluate FAQ structure.',
      status: 'na',
      score: 0,
      maxScore: 10,
    };
  }

  const pairCount = countQaPairs(content);

  if (pairCount >= 3) {
    return {
      id: 'aeo-faq-section',
      title: 'FAQ section (AEO)',
      description: `${pairCount} FAQ-style Q&A pairs detected. Excellent — add FAQPage schema (JSON-LD) to these sections for a 2.7–3.2× AI Overview citation boost. AI engines cite FAQ content in 41% of answers vs 15% for pages without FAQ structure.`,
      status: 'good',
      score: 10,
      maxScore: 10,
    };
  }

  if (pairCount >= 1) {
    return {
      id: 'aeo-faq-section',
      title: 'FAQ section (AEO)',
      description: `${pairCount} Q&A pair${pairCount === 1 ? '' : 's'} detected. Aim for 5–8 FAQ pairs. Write each H2/H3 as a question (ending with "?"), followed by a 40–80 word direct answer paragraph.`,
      status: 'ok',
      score: 5,
      maxScore: 10,
    };
  }

  return {
    id: 'aeo-faq-section',
    title: 'FAQ section (AEO)',
    description: 'No FAQ-style Q&A structure found. Add a "Frequently Asked Questions" section with 5–8 question headings (H2/H3 ending in "?") each answered in 40–80 words. This is the single highest-impact AEO signal for citation in AI answers.',
    status: 'poor',
    score: 0,
    maxScore: 10,
  };
}
