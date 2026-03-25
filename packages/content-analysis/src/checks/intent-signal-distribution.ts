// @power-seo/content-analysis — Intent Signal Distribution Check
// ----------------------------------------------------------------------------
// Verifies that intent signals are spread across all sections of the content,
// not clustered in one area.

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

const MIN_WORDS_FOR_DISTRIBUTION = 200;
const QUARTILE_COUNT = 4;
const QUARTILE_LABELS = ['Q1 (0-25%)', 'Q2 (25-50%)', 'Q3 (50-75%)', 'Q4 (75-100%)'];

/**
 * Check whether a text segment contains at least one match for the pattern.
 */
function hasSignals(text: string, pattern: RegExp): boolean {
  // Clone the pattern to reset lastIndex
  const re = new RegExp(pattern.source, pattern.flags);
  return re.test(text);
}

/**
 * Divide an array of words into N roughly equal quartiles and return joined strings.
 */
function divideIntoQuartiles(words: string[], count: number): string[] {
  const quartiles: string[] = [];
  const size = Math.max(1, Math.ceil(words.length / count));

  for (let i = 0; i < count; i++) {
    const start = i * size;
    const end = Math.min(start + size, words.length);
    if (start < words.length) {
      quartiles.push(words.slice(start, end).join(' '));
    } else {
      quartiles.push('');
    }
  }

  return quartiles;
}

/**
 * Check whether intent signals are evenly distributed across content quartiles.
 *
 * Divides the plaintext content into 4 equal quartiles by word count and checks
 * each for the presence of intent-matching signal phrases.
 *
 * - good (5): 4/4 quartiles have signals
 * - ok   (3): 2-3/4 quartiles have signals
 * - poor (1): 1/4 quartile (signals clustered)
 * - poor (0): 0/4 quartiles have signals
 *
 * Returns 'na' if total word count < 200 (too short to assess distribution).
 */
export function checkIntentSignalDistribution(
  input: ContentAnalysisInput,
): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-signal-distribution',
      title: 'Intent signal distribution',
      description:
        'No focus keyphrase set. Set one to analyze intent signal distribution.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase.trim());
  const intentKey = detected.primary;
  const pattern = SIGNAL_PATTERNS[intentKey];

  if (!pattern) {
    return {
      id: 'intent-signal-distribution',
      title: 'Intent signal distribution',
      description: `Unable to determine signal pattern for intent "${intentKey}".`,
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const plainText = stripHtml(content).toLowerCase();
  const words = getWords(content);
  const wordCount = words.length;

  if (wordCount < MIN_WORDS_FOR_DISTRIBUTION) {
    return {
      id: 'intent-signal-distribution',
      title: 'Intent signal distribution',
      description:
        `Content is only ${wordCount} words. At least ${MIN_WORDS_FOR_DISTRIBUTION} words are needed ` +
        'to meaningfully assess intent signal distribution.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Split plaintext words into quartiles
  const plainWords = plainText.split(/\s+/).filter((w) => w.length > 0);
  const quartiles = divideIntoQuartiles(plainWords, QUARTILE_COUNT);

  const quartilesWithSignals: string[] = [];
  const intentDeserts: string[] = [];

  for (let i = 0; i < QUARTILE_COUNT; i++) {
    const quartileText = quartiles[i];
    const label = QUARTILE_LABELS[i];

    // Guard for strict indexed access
    if (quartileText === undefined || label === undefined) {
      continue;
    }

    if (hasSignals(quartileText, pattern)) {
      quartilesWithSignals.push(label);
    } else {
      intentDeserts.push(label);
    }
  }

  const signalCount = quartilesWithSignals.length;

  if (signalCount === 0) {
    return {
      id: 'intent-signal-distribution',
      title: 'Intent signal distribution',
      description:
        `No ${intentKey} intent signals found in any of the 4 content quartiles. ` +
        `All sections are intent deserts: ${intentDeserts.join(', ')}.`,
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  if (signalCount === 1) {
    return {
      id: 'intent-signal-distribution',
      title: 'Intent signal distribution',
      description:
        `${intentKey[0]?.toUpperCase()}${intentKey.slice(1)} intent signals found in only 1 of 4 quartiles ` +
        `(${quartilesWithSignals.join(', ')}). ` +
        `Signals are clustered. Intent deserts: ${intentDeserts.join(', ')}. ` +
        'Spread intent signals throughout the content.',
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  if (signalCount <= 3) {
    return {
      id: 'intent-signal-distribution',
      title: 'Intent signal distribution',
      description:
        `${intentKey[0]?.toUpperCase()}${intentKey.slice(1)} intent signals found in ${signalCount} of 4 quartiles ` +
        `(${quartilesWithSignals.join(', ')}). ` +
        (intentDeserts.length > 0
          ? `Intent deserts: ${intentDeserts.join(', ')}. Add signals to these sections.`
          : ''),
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'intent-signal-distribution',
    title: 'Intent signal distribution',
    description:
      `${intentKey[0]?.toUpperCase()}${intentKey.slice(1)} intent signals are present in all 4 content quartiles ` +
      `(${quartilesWithSignals.join(', ')}). Intent is consistently reinforced throughout.`,
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
