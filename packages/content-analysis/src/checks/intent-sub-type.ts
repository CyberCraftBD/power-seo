// @power-seo/content-analysis -- Intent Sub-Type Detection Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

/** Maps sub-types to the content format they require. */
const SUB_TYPE_FORMATS: Record<string, string> = {
  definitional:
    'Use a concise definition in the first paragraph, followed by expanded explanation. Target featured snippets with a clear "X is..." sentence.',
  tutorial:
    'Structure content as numbered steps with clear instructions. Include code samples, screenshots, or diagrams where appropriate.',
  troubleshooting:
    'Lead with the problem statement, then provide solutions in order of likelihood. Include error messages verbatim for search matching.',
  comparison:
    'Use a side-by-side format with a comparison table. Cover pricing, features, pros/cons, and a clear recommendation.',
  'review-seeking':
    'Include hands-on experience, ratings, pros/cons lists, and a verdict. Add schema markup for reviews.',
  purchase:
    'Optimize for conversions: prominent CTAs, pricing, availability, trust badges, and shipping information.',
  download:
    'Provide a clear download button/link, system requirements, file size, and version information.',
  local:
    'Include address, hours, map embed, and local schema markup. Mention the specific location in title and headings.',
  reference:
    'Create a well-organized list or resource page with brief descriptions. Use anchor links for easy navigation.',
  news:
    'Use an inverted pyramid structure (most important info first). Include dates, sources, and NewsArticle schema.',
  unknown:
    'Sub-type could not be determined. The primary intent was detected but the specific content format needed is unclear.',
};

export function checkIntentSubType(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-sub-type',
      title: 'Intent sub-type detection',
      description: 'No focus keyphrase set. Set one to detect intent sub-type.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const result = detectIntent(focusKeyphrase);
  const formatAdvice: string =
    SUB_TYPE_FORMATS[result.subType] ?? SUB_TYPE_FORMATS['unknown'] ?? '';

  if (result.subType !== 'unknown') {
    return {
      id: 'intent-sub-type',
      title: 'Intent sub-type detection',
      description: `Sub-type detected: ${result.subType}. ${formatAdvice}`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // subType is unknown but we may still have a primary intent
  if (result.primary !== 'unknown') {
    return {
      id: 'intent-sub-type',
      title: 'Intent sub-type detection',
      description:
        `Primary intent is ${result.primary}, but the specific sub-type is unclear. ${formatAdvice}` +
        ' Try adding a more specific modifier (e.g., "how to", "vs", "review", "buy") to clarify the expected content format.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'intent-sub-type',
    title: 'Intent sub-type detection',
    description:
      `Cannot determine intent sub-type for "${focusKeyphrase}". ${formatAdvice}` +
      ' Refine the keyphrase with descriptive modifiers so the required content format is clear.',
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
