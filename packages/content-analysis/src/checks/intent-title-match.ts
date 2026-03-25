// @power-seo/content-analysis — Title-Intent Match Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Intent-specific title signal detectors
// ---------------------------------------------------------------------------

function hasInformationalTitleSignals(title: string): { strong: boolean; weak: boolean } {
  const lower = title.toLowerCase();

  // Strong: question words, "How to", "Guide", "Tutorial", "Tips"
  const questionPattern = /^(?:how|what|why|when|where|who|which)\b/i;
  const strongPattern = /\b(?:how to|guide|tutorial|tips|explained|walkthrough)\b/i;
  const numberListPattern = /\b\d+\s+(?:ways|steps|tips|tricks|methods|reasons|things|examples|ideas)\b/i;

  const hasStrong = questionPattern.test(lower) || strongPattern.test(lower) || numberListPattern.test(lower);

  // Weak: "learn", "understand", "introduction", "basics", "overview"
  const weakPattern = /\b(?:learn|understand|introduction|basics|overview|101|beginners?|faq)\b/i;
  const hasWeak = weakPattern.test(lower);

  return { strong: hasStrong, weak: hasWeak };
}

function hasTransactionalTitleSignals(title: string): { strong: boolean; weak: boolean } {
  const lower = title.toLowerCase();

  // Strong: action words, price/currency, "Free", "Deal"
  const strongPattern = /\b(?:buy|order|get|shop|purchase|deal|free|discount|sale|subscribe)\b/i;
  const pricePattern = /\$\d|€\d|\d+%\s*off/i;

  const hasStrong = strongPattern.test(lower) || pricePattern.test(lower);

  // Weak: "affordable", "cheap", "cost", "pricing"
  const weakPattern = /\b(?:affordable|cheap|cheapest|cost|pricing|price|coupon|promo|offer)\b/i;
  const hasWeak = weakPattern.test(lower);

  return { strong: hasStrong, weak: hasWeak };
}

function hasCommercialTitleSignals(title: string): { strong: boolean; weak: boolean } {
  const lower = title.toLowerCase();

  // Strong: "Best", "Top", "Review", "vs", "Compared", year
  const strongPattern = /\b(?:best|top|review|reviews|vs|versus|compared|comparison)\b/i;
  const yearPattern = /\b20(?:2[4-9]|[3-9]\d)\b/;

  const hasStrong = strongPattern.test(lower) || yearPattern.test(lower);

  // Weak: "pros and cons", "alternatives", "rated", "rating"
  const weakPattern = /\b(?:pros and cons|alternatives?|rated|rating|recommend|pick|choice|winner)\b/i;
  const hasWeak = weakPattern.test(lower);

  return { strong: hasStrong, weak: hasWeak };
}

function hasNavigationalTitleSignals(title: string, keyphrase: string): { strong: boolean; weak: boolean } {
  const lower = title.toLowerCase();

  // Strong: "Official", "Login", brand name (from keyphrase)
  const strongPattern = /\b(?:official|login|log in|sign in)\b/i;
  const keyphraseWords = getWords(stripHtml(keyphrase.toLowerCase()));
  // Brand presence: check if keyphrase words appear in the title
  const brandPresent = keyphraseWords.length > 0 &&
    keyphraseWords.every((w) => lower.includes(w));

  const hasStrong = strongPattern.test(lower) || brandPresent;

  // Weak: "dashboard", "account", "support", "homepage"
  const weakPattern = /\b(?:dashboard|account|support|contact|homepage|portal|help)\b/i;
  const hasWeak = weakPattern.test(lower);

  return { strong: hasStrong, weak: hasWeak };
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentTitleMatch(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, title } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-title-match',
      title: 'Title-intent match',
      description: 'No focus keyphrase set. Set one to evaluate title-intent alignment.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  if (!title || title.trim().length === 0) {
    return {
      id: 'intent-title-match',
      title: 'Title-intent match',
      description: 'No title provided. Add a title to evaluate intent alignment.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase);
  const intentLabel = detected.primary === 'commercial-investigation' ? 'commercial' : detected.primary;

  let signals: { strong: boolean; weak: boolean };

  switch (detected.primary) {
    case 'informational':
      signals = hasInformationalTitleSignals(title);
      break;
    case 'transactional':
      signals = hasTransactionalTitleSignals(title);
      break;
    case 'commercial-investigation':
      signals = hasCommercialTitleSignals(title);
      break;
    case 'navigational':
      signals = hasNavigationalTitleSignals(title, focusKeyphrase);
      break;
    default:
      signals = hasInformationalTitleSignals(title);
  }

  // good (5): title clearly signals intent
  if (signals.strong) {
    return {
      id: 'intent-title-match',
      title: 'Title-intent match',
      description: `Title clearly signals ${intentLabel} intent. This helps search engines and users understand the page purpose.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): partial/weak intent signal
  if (signals.weak) {
    return {
      id: 'intent-title-match',
      title: 'Title-intent match',
      description: `Title has a weak ${intentLabel} intent signal. Strengthen it by using clearer ${intentLabel} language in the title.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (0): no intent signal
  return {
    id: 'intent-title-match',
    title: 'Title-intent match',
    description: `Title does not signal ${intentLabel} intent. Rewrite it to include ${intentLabel}-appropriate language so users and search engines can identify the page purpose.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
