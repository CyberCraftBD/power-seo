// @power-seo/content-analysis — AEO: Fact Density Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

/**
 * Count verifiable fact signals in plain text.
 * AI engines prefer content with measurable claims.
 * Target: 1 fact signal per 150–200 words (8–12 citations per 1,500 words).
 * Princeton GEO study: adding statistics = +40% AI visibility.
 */
function countFactSignals(text: string): number {
  let count = 0;

  // Numeric percentages: 42%, 3.5%, 99.9%
  const percentages = text.match(/\d+(?:\.\d+)?%/g);
  count += percentages?.length ?? 0;

  // Dollar/currency amounts: $1.2B, $42, €100, £50
  const currencies = text.match(/[$€£¥]\s*\d+(?:[.,]\d+)?(?:\s*[BMKbmk](?:illion|illion)?)?/g);
  count += currencies?.length ?? 0;

  // Year references: in 2024, since 2019, by 2026
  const years = text.match(/\b(?:in|since|by|from|until|through)\s+20\d{2}\b/gi);
  count += years?.length ?? 0;

  // Standalone years in parentheses (citations): (2024), (2023)
  const citedYears = text.match(/\(20\d{2}\)/g);
  count += citedYears?.length ?? 0;

  // Multipliers: 3.5x, 2×, 4.8x
  const multipliers = text.match(/\d+(?:\.\d+)?[x×]\b/g);
  count += multipliers?.length ?? 0;

  // "According to" and attribution phrases
  const attributions = text.match(/\baccording\s+to\b|\bstudy\s+(?:found|shows|revealed)\b|\bresearch\s+(?:found|shows|suggests)\b/gi);
  count += attributions?.length ?? 0;

  // Numeric measurements with units: 42ms, 3.2GB, 150km, 42dB
  const measurements = text.match(/\d+(?:\.\d+)?\s*(?:ms|gb|mb|kb|km|cm|mm|kg|lbs?|db|fps|mph|rpm)\b/gi);
  count += measurements?.length ?? 0;

  return count;
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

  if (factsPerHundredWords >= 2) {
    return {
      id: 'aeo-fact-density',
      title: 'Fact density (AEO)',
      description: `${factCount} fact signals detected across ${wordCount} words (${factsPerHundredWords.toFixed(1)} per 100 words). Strong fact density — AI engines like Perplexity and ChatGPT strongly favour content with verifiable data points.`,
      status: 'good',
      score: 8,
      maxScore: 8,
    };
  }

  if (factsPerHundredWords >= 0.8) {
    return {
      id: 'aeo-fact-density',
      title: 'Fact density (AEO)',
      description: `${factCount} fact signals in ${wordCount} words (${factsPerHundredWords.toFixed(1)} per 100 words). Aim for at least 1 data point every 150 words — add more statistics, percentages, dates, or study citations. Princeton GEO study: adding statistics increases AI visibility by 40%.`,
      status: 'ok',
      score: 4,
      maxScore: 8,
    };
  }

  return {
    id: 'aeo-fact-density',
    title: 'Fact density (AEO)',
    description: `Only ${factCount} fact signal${factCount === 1 ? '' : 's'} in ${wordCount} words (${factsPerHundredWords.toFixed(1)} per 100 words). AI engines prioritise content with measurable claims. Add statistics (e.g. "42% of users…"), study citations ("according to…"), dates, and measurement data. Target: 8–12 cited facts per 1,500 words.`,
    status: 'poor',
    score: 0,
    maxScore: 8,
  };
}
