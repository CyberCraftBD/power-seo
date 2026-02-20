// ============================================================================
// @power-seo/content-analysis — Content Analyzer Orchestrator
// ============================================================================

import type { ContentAnalysisInput, ContentAnalysisOutput, AnalysisResult } from '@power-seo/core';
import type { AnalysisConfig, CheckId } from './types.js';
import { checkTitle } from './checks/title.js';
import { checkMetaDescription } from './checks/meta-description.js';
import { checkKeyphraseUsage } from './checks/keyphrase-usage.js';
import { checkHeadings } from './checks/headings.js';
import { checkWordCount } from './checks/word-count.js';
import { checkImages } from './checks/images.js';
import { checkLinks } from './checks/links.js';

/**
 * Run all SEO content analysis checks and return aggregated results.
 *
 * @example
 * ```ts
 * const output = analyzeContent({
 *   title: 'My Blog Post',
 *   metaDescription: 'A description of my blog post about SEO.',
 *   content: '<h1>My Blog Post</h1><p>Content goes here...</p>',
 *   focusKeyphrase: 'blog post',
 * });
 * console.log(output.score, output.maxScore, output.recommendations);
 * ```
 */
export function analyzeContent(
  input: ContentAnalysisInput,
  config?: AnalysisConfig,
): ContentAnalysisOutput {
  const disabled = new Set<CheckId>(config?.disabledChecks ?? []);

  const allResults: AnalysisResult[] = [];

  // Run each check group and collect results
  const titleResults = checkTitle(input);
  const metaResults = checkMetaDescription(input);
  const keyphraseResults = checkKeyphraseUsage(input);
  const headingResults = checkHeadings(input);
  const wordCountResult = checkWordCount(input);
  const imageResults = checkImages(input);
  const linkResults = checkLinks(input);

  // Flatten all results
  const candidateResults = [
    ...titleResults,
    ...metaResults,
    ...keyphraseResults,
    ...headingResults,
    wordCountResult,
    ...imageResults,
    ...linkResults,
  ];

  // Filter out disabled checks
  for (const result of candidateResults) {
    if (!disabled.has(result.id as CheckId)) {
      allResults.push(result);
    }
  }

  // Sum scores
  const score = allResults.reduce((sum, r) => sum + r.score, 0);
  const maxScore = allResults.reduce((sum, r) => sum + r.maxScore, 0);

  // Generate recommendations from poor/ok results
  const recommendations = allResults
    .filter((r) => r.status === 'poor' || r.status === 'ok')
    .map((r) => r.description);

  return {
    score,
    maxScore,
    results: allResults,
    recommendations,
  };
}
