// @power-seo/content-analysis — AEO: TL;DR / Summary Section Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

/**
 * Heading texts that qualify as a summary/TL;DR heading. The heading text must
 * BE one of these (full-text match after trimming, case-insensitive) — a
 * substring match would wrongly flag e.g. "Product Overview Dashboard".
 */
const SUMMARY_HEADINGS: readonly string[] = [
  'tl;dr',
  'tldr',
  'key takeaways',
  'key takeaway',
  'summary',
  'in brief',
  'at a glance',
  'quick summary',
  'quick answer',
  'the short version',
  'overview',
];

function isSummaryHeading(headingText: string): boolean {
  const normalized = headingText.trim().toLowerCase().replace(/\s+/g, ' ');
  return SUMMARY_HEADINGS.includes(normalized);
}

/**
 * Detects a TL;DR or summary block — a structured overview that AI engines
 * can extract as a standalone answer. Content with a summary block receives
 * 2.1× more AI citations (Moz AI Content Study, 2025).
 */
function detectSummaryBlock(html: string): { found: boolean; hasBullets: boolean } {
  const headingRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;

  let found = false;
  let hasBullets = false;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html)) !== null) {
    if (!isSummaryHeading(stripHtml(match[1] ?? ''))) continue;
    found = true;

    // A bullet list only counts if it appears between the summary heading and
    // the next heading (any level) — not just anywhere in the document.
    const rest = html.slice(match.index + match[0].length);
    const nextHeading = rest.search(/<h[1-6][^>]*>/i);
    const section = nextHeading === -1 ? rest : rest.slice(0, nextHeading);
    if (/<ul[\s>]/i.test(section) || /<ol[\s>]/i.test(section)) {
      hasBullets = true;
      break;
    }
  }

  // Also check for a <strong>TL;DR</strong> or bold summary inline
  const boldTldr = /<(?:strong|b)[^>]*>[^<]*(?:tl;?dr|summary|key\s+takeaway)[^<]*<\/(?:strong|b)>/i.test(html);
  if (boldTldr) found = true;

  return { found, hasBullets };
}

export function checkAeoTldrSummary(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;
  const plain = stripHtml(content);
  const wordCount = getWords(plain).length;

  if (wordCount < 300) {
    return {
      id: 'aeo-tldr-summary',
      title: 'TL;DR / summary section (AEO)',
      description: 'Content is too short to require a summary section.',
      status: 'na',
      score: 0,
      maxScore: 7,
    };
  }

  const { found, hasBullets } = detectSummaryBlock(content);

  if (found && hasBullets) {
    return {
      id: 'aeo-tldr-summary',
      title: 'TL;DR / summary section (AEO)',
      description: 'TL;DR / summary section with bullet points detected. Excellent — AI engines extract structured summaries 2.1× more often than narrative-only content.',
      status: 'good',
      score: 7,
      maxScore: 7,
    };
  }

  if (found) {
    return {
      id: 'aeo-tldr-summary',
      title: 'TL;DR / summary section (AEO)',
      description: 'Summary section detected. Add 3–5 bullet points summarising key insights — bullet lists in summaries increase AI snippet extraction rate by 40%.',
      status: 'ok',
      score: 4,
      maxScore: 7,
    };
  }

  return {
    id: 'aeo-tldr-summary',
    title: 'TL;DR / summary section (AEO)',
    description: 'No TL;DR or summary section found. Add a "Key Takeaways" or "TL;DR" H2 section near the top with 3–5 bullet points covering the main answers. This pattern is cited 2.1× more by AI engines.',
    status: 'poor',
    score: 0,
    maxScore: 7,
  };
}
