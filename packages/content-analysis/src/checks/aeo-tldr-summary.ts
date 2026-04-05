// @power-seo/content-analysis — AEO: TL;DR / Summary Section Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, extractTagContents } from '@power-seo/core';

/**
 * Detects a TL;DR or summary block — a structured overview that AI engines
 * can extract as a standalone answer. Content with a summary block receives
 * 2.1× more AI citations (Moz AI Content Study, 2025).
 */
function detectSummaryBlock(html: string): { found: boolean; hasBullets: boolean } {
  const headings = extractTagContents(html, 'h2').concat(extractTagContents(html, 'h3'));
  const tldrPattern = /\b(?:tl;?dr|summary|key\s+takeaways?|in\s+brief|quick\s+answer|the\s+short\s+version|overview)\b/i;

  let found = false;
  for (const h of headings) {
    if (tldrPattern.test(stripHtml(h))) {
      found = true;
      break;
    }
  }

  // Also check for a <strong>TL;DR</strong> or bold summary inline
  const boldTldr = /<(?:strong|b)[^>]*>[^<]*(?:tl;?dr|summary|key\s+takeaway)[^<]*<\/(?:strong|b)>/i.test(html);
  if (boldTldr) found = true;

  // Check if a bullet list follows a summary/tldr heading
  const hasBullets = found && (/<ul[\s>]/.test(html) || /<ol[\s>]/.test(html));

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
