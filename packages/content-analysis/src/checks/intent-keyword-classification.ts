// @power-seo/content-analysis -- Keyword Intent Classification Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

/** Map intent types to human-friendly strategy explanations. */
const INTENT_EXPLANATIONS: Record<string, string> = {
  informational:
    'Users want to learn or understand something. Create comprehensive, educational content with clear explanations.',
  navigational:
    'Users are looking for a specific website or page. Ensure strong brand signals and clear site structure.',
  transactional:
    'Users are ready to take action (buy, download, sign up). Optimize for conversions with clear CTAs and trust signals.',
  'commercial-investigation':
    'Users are researching before a purchase decision. Provide comparisons, reviews, and evidence-based recommendations.',
  unknown:
    'Intent could not be clearly determined. Consider adding intent-signaling modifiers to sharpen your keyphrase.',
};

export function checkIntentKeywordClassification(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-keyword-classification',
      title: 'Keyword intent classification',
      description: 'No focus keyphrase set. Set one to analyze keyword intent.',
      status: 'na',
      score: 0,
      maxScore: 10,
    };
  }

  const result = detectIntent(focusKeyphrase);
  const explanation: string =
    INTENT_EXPLANATIONS[result.primary] ?? INTENT_EXPLANATIONS['unknown'] ?? '';
  const pct = Math.round(result.confidence * 100);

  if (result.confidence >= 0.7) {
    return {
      id: 'intent-keyword-classification',
      title: 'Keyword intent classification',
      description: `Clear ${result.primary} intent detected (${pct}% confidence). ${explanation}`,
      status: 'good',
      score: 5,
      maxScore: 10,
    };
  }

  if (result.confidence >= 0.4) {
    return {
      id: 'intent-keyword-classification',
      title: 'Keyword intent classification',
      description:
        `Likely ${result.primary} intent, but confidence is moderate (${pct}%). ${explanation}` +
        ' Consider adding clearer intent modifiers to strengthen the signal.',
      status: 'ok',
      score: 3,
      maxScore: 10,
    };
  }

  return {
    id: 'intent-keyword-classification',
    title: 'Keyword intent classification',
    description:
      `Weak intent signal (${pct}% confidence for ${result.primary}). ${explanation}` +
      ' Add modifier words like "how to", "best", "buy", or "review" to clarify intent.',
    status: 'poor',
    score: 1,
    maxScore: 10,
  };
}
