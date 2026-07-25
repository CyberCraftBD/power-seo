// @power-seo/content-analysis — AEO: Fact Density Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, countEffectiveMatches } from '@power-seo/core';

// Verifiable fact signal patterns. AI engines prefer content with measurable
// claims. Target: 1 fact signal per 150–200 words (8–12 citations per 1,500
// words). Princeton GEO study: adding statistics = +40% AI visibility.
const FACT_SIGNAL_PATTERNS: RegExp[] = [
  // Numeric percentages: 42%, 3.5%, 99.9%
  /\d+(?:\.\d+)?%/g,
  // Dollar/currency amounts: $1.2B, $42, €100, £50
  /[$€£¥]\s*\d+(?:[.,]\d+)?(?:\s*[BMKbmk](?:illion)?\b)?/g,
  // Year references: in 2024, since 2019, by 2026
  /\b(?:in|since|by|from|until|through)\s+20\d{2}\b/gi,
  // Standalone years in parentheses (citations): (2024), (2023)
  /\(20\d{2}\)/g,
  // Multipliers: 3.5x, 2×, 4.8x — note: no \b after × (a non-word char), or
  // "2× more" would never match; require no following word char instead.
  /\d+(?:\.\d+)?[x×](?!\w)/g,
  // "According to" and attribution phrases
  /\baccording\s+to\b|\bstudy\s+(?:found|shows|revealed)\b|\bresearch\s+(?:found|shows|suggests)\b/gi,
  // Numeric measurements with units: 42ms, 3.2GB, 150km, 42dB
  /\d+(?:\.\d+)?\s*(?:ms|gb|mb|kb|km|cm|mm|kg|lbs?|db|fps|mph|rpm)\b/gi,
];

/**
 * Count verifiable fact signals with diminishing returns (#152): distinct
 * facts ("42%", "17%", "since 2019") each earn full credit, while repeating
 * the same phrase ("since 2019" three times) earns log-scaled credit —
 * repetition is not additional evidence.
 */
function countFactSignals(text: string): number {
  return countEffectiveMatches(text, FACT_SIGNAL_PATTERNS);
}

export function checkAeoFactDensity(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;
  const plain = stripHtml(content);
  const words = getWords(plain);
  const wordCount = words.length;

  if (wordCount < 100) {
    return {
      id: 'aeo-fact-density',
      title: 'Fact density (AEO)',
      description: 'Add more content to measure fact density.',
      status: 'na',
      score: 0,
      maxScore: 8,
    };
  }

  const factCount = countFactSignals(plain);
  const factsPerHundredWords = (factCount / wordCount) * 100;
  // Effective counts can be fractional after repetition discounting
  const factDisplay = Math.round(factCount);

  if (factsPerHundredWords >= 2) {
    return {
      id: 'aeo-fact-density',
      title: 'Fact density (AEO)',
      description: `${factDisplay} fact signals detected across ${wordCount} words (${factsPerHundredWords.toFixed(1)} per 100 words). Strong fact density — AI engines like Perplexity and ChatGPT strongly favour content with verifiable data points.`,
      status: 'good',
      score: 8,
      maxScore: 8,
    };
  }

  if (factsPerHundredWords >= 0.8) {
    return {
      id: 'aeo-fact-density',
      title: 'Fact density (AEO)',
      description: `${factDisplay} fact signals in ${wordCount} words (${factsPerHundredWords.toFixed(1)} per 100 words). Aim for at least 1 data point every 150 words — add more statistics, percentages, dates, or study citations. Princeton GEO study: adding statistics increases AI visibility by 40%.`,
      status: 'ok',
      score: 4,
      maxScore: 8,
    };
  }

  return {
    id: 'aeo-fact-density',
    title: 'Fact density (AEO)',
    description: `Only ${factDisplay} fact signal${factDisplay === 1 ? '' : 's'} in ${wordCount} words (${factsPerHundredWords.toFixed(1)} per 100 words). AI engines prioritise content with measurable claims. Add statistics (e.g. "42% of users…"), study citations ("according to…"), dates, and measurement data. Target: 8–12 cited facts per 1,500 words.`,
    status: 'poor',
    score: 0,
    maxScore: 8,
  };
}
