// @power-seo/content-analysis — Content Analyzer Orchestrator
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, ContentAnalysisOutput, AnalysisResult } from '@power-seo/core';
import type { AnalysisConfig, CheckId } from './types.js';
import { checkTitle } from './checks/title.js';
import { checkMetaDescription } from './checks/meta-description.js';
import { checkKeyphraseUsage } from './checks/keyphrase-usage.js';
import { checkHeadings } from './checks/headings.js';
import { checkWordCount } from './checks/word-count.js';
import { checkImages } from './checks/images.js';
import { checkLinks } from './checks/links.js';
import { checkParagraphLength } from './checks/paragraph-length.js';
import { checkSentenceLength } from './checks/sentence-length.js';
import { checkSubheadingDistribution } from './checks/subheading-distribution.js';
import { checkTransitionWords } from './checks/transition-words.js';
import { checkCanonicalUrl } from './checks/canonical-url.js';

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
  const paragraphResult = checkParagraphLength(input);
  const sentenceResult = checkSentenceLength(input);
  const subheadingResult = checkSubheadingDistribution(input);
  const transitionResult = checkTransitionWords(input);
  const canonicalResult = checkCanonicalUrl(input);

  // Flatten all results
  const candidateResults = [
    ...titleResults,
    ...metaResults,
    ...keyphraseResults,
    ...headingResults,
    wordCountResult,
    ...imageResults,
    ...linkResults,
    paragraphResult,
    sentenceResult,
    subheadingResult,
    transitionResult,
    canonicalResult,
  ];

  // Filter out disabled checks
  for (const result of candidateResults) {
    if (!disabled.has(result.id as CheckId)) {
      allResults.push(result);
    }
  }

  // Sum scores — exclude 'na' (not applicable) checks from both score and maxScore
  const applicableResults = allResults.filter((r) => r.status !== 'na');
  const score = applicableResults.reduce((sum, r) => sum + r.score, 0);
  const maxScore = applicableResults.reduce((sum, r) => sum + r.maxScore, 0);

  // Generate recommendations from poor/ok results (exclude 'na')
  const recommendations = applicableResults
    .filter((r) => r.status === 'poor' || r.status === 'ok')
    .map((r) => r.description);

  return {
    score,
    maxScore,
    results: allResults,
    recommendations,
  };
}
