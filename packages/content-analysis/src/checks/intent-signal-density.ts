// @power-seo/content-analysis — Intent Signal Density Check
// ----------------------------------------------------------------------------
// Measures how frequently intent-matching signal phrases appear in the content
// body relative to the total word count.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Intent-specific signal patterns
// ---------------------------------------------------------------------------

const SIGNAL_PATTERNS: Record<string, RegExp> = {
  informational:
    /\b(how to|what is|guide|learn|understand|explained|definition|steps|tutorial|tips|example|for example|such as|in this article|we'll cover|you'll learn|let's explore|introduction|overview|basics|beginners|faq)\b/gi,
  transactional:
    /\b(buy|purchase|order|add to cart|shop|deal|discount|price|pricing|free shipping|checkout|subscribe|sign up|get started|try free|limited time|in stock|available now|book now|reserve)\b/gi,
  'commercial-investigation':
    /\b(best|top|review|compared|comparison|vs|versus|pros and cons|advantages|disadvantages|rating|rated|recommend|our pick|editor's choice|winner|runner-up|alternative|benchmark)\b/gi,
  navigational:
    /\b(official|login|sign in|dashboard|my account|support|contact us|help center|visit|go to|homepage)\b/gi,
};

/**
 * Count all matches for a given regex pattern within text.
 * Resets the regex lastIndex to ensure consistent results.
 */
function countMatches(text: string, pattern: RegExp): number {
  pattern.lastIndex = 0;
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

/**
 * Check the density of intent-matching signal phrases in the content body.
 *
 * Density is calculated as (matchCount / wordCount) * 500 — signals per 500 words.
 * - good (5): density >= 4
 * - ok   (3): density >= 2
 * - poor (1): density < 2
 * - poor (0): density === 0 (no signals at all)
 */
export function checkIntentSignalDensity(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-signal-density',
      title: 'Intent signal density',
      description: 'No focus keyphrase set. Set one to analyze intent signal density.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase.trim());
  const intentKey = detected.primary;
  const pattern = SIGNAL_PATTERNS[intentKey];

  // Safety: should always resolve, but guard for strict indexed access
  if (!pattern) {
    return {
      id: 'intent-signal-density',
      title: 'Intent signal density',
      description: `Unable to determine signal pattern for intent "${intentKey}".`,
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const plainText = stripHtml(content).toLowerCase();
  const words = getWords(content);
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      id: 'intent-signal-density',
      title: 'Intent signal density',
      description: 'Content has no words. Add content to analyze intent signal density.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  const matchCount = countMatches(plainText, pattern);
  const density = (matchCount / wordCount) * 500;
  const densityRounded = Math.round(density * 100) / 100;

  if (matchCount === 0) {
    return {
      id: 'intent-signal-density',
      title: 'Intent signal density',
      description:
        `No ${intentKey} intent signals found in ${wordCount} words. ` +
        `Add phrases that reinforce ${intentKey} intent (density: 0 per 500 words).`,
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  if (density < 2) {
    return {
      id: 'intent-signal-density',
      title: 'Intent signal density',
      description:
        `Found ${matchCount} ${intentKey} intent signal(s) in ${wordCount} words ` +
        `(${densityRounded} per 500 words). Aim for at least 4 per 500 words.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  if (density < 4) {
    return {
      id: 'intent-signal-density',
      title: 'Intent signal density',
      description:
        `Found ${matchCount} ${intentKey} intent signal(s) in ${wordCount} words ` +
        `(${densityRounded} per 500 words). Good start — aim for 4+ per 500 words for optimal density.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'intent-signal-density',
    title: 'Intent signal density',
    description:
      `Found ${matchCount} ${intentKey} intent signal(s) in ${wordCount} words ` +
      `(${densityRounded} per 500 words). Intent signals are well-represented throughout the content.`,
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
