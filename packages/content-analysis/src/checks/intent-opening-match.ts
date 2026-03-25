// @power-seo/content-analysis — Opening Paragraph Intent Signal Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Intent-specific opening signal patterns
// ---------------------------------------------------------------------------

/** Informational: poses a question OR defines the topic OR states what reader will learn */
const INFORMATIONAL_STRONG: readonly RegExp[] = [
  // Question patterns
  /\b(?:what is|what are|how to|how do|how does|how can|why do|why does|why is)\b/i,
  // Definition patterns
  /\b(?:is defined as|refers to|is a type of|means that|is known as)\b/i,
  // Learning promise patterns
  /\b(?:you(?:'ll| will) learn|we(?:'ll| will) (?:cover|explore|explain)|in this (?:article|guide|tutorial|post))\b/i,
  /\b(?:this guide|this tutorial|this article) (?:will|covers|explains|shows)\b/i,
];

const INFORMATIONAL_WEAK: readonly RegExp[] = [
  /\b(?:learn|understand|discover|find out|explore)\b/i,
  /\b(?:tips|steps|guide|tutorial|introduction|overview)\b/i,
  /\?/,
];

/** Transactional: mentions product/service/price OR presents an offer */
const TRANSACTIONAL_STRONG: readonly RegExp[] = [
  /\b(?:buy|purchase|order|shop|subscribe|sign up|get started)\b/i,
  /\$\d+|\d+%\s*off|\bfree shipping\b|\blimited time\b/i,
  /\b(?:add to cart|checkout|in stock|available now|try free)\b/i,
  /\b(?:deal|discount|offer|sale|promo|coupon)\b/i,
];

const TRANSACTIONAL_WEAK: readonly RegExp[] = [
  /\b(?:price|pricing|cost|affordable|cheap|value)\b/i,
  /\b(?:product|service|solution|tool|platform)\b/i,
  /\b(?:features|plans?|packages?|subscription)\b/i,
];

/** Commercial: frames a comparison OR mentions evaluating options */
const COMMERCIAL_STRONG: readonly RegExp[] = [
  /\b(?:best|top \d+|compare|comparison|vs|versus)\b/i,
  /\b(?:pros and cons|advantages and disadvantages)\b/i,
  /\b(?:we (?:reviewed|tested|compared|evaluated))\b/i,
  /\b(?:which (?:is|are) (?:best|better|right))\b/i,
];

const COMMERCIAL_WEAK: readonly RegExp[] = [
  /\b(?:review|alternative|option|choice|pick|rated|rating)\b/i,
  /\b(?:looking for|searching for|trying to find|choosing|evaluating)\b/i,
  /\b(?:recommend|recommendation|suggest)\b/i,
];

/** Navigational: directs to the resource */
const NAVIGATIONAL_STRONG: readonly RegExp[] = [
  /\b(?:official|log ?in|sign ?in|go to|visit)\b/i,
  /\b(?:access your|your (?:account|dashboard))\b/i,
  /\b(?:welcome to|you(?:'ve| have) reached)\b/i,
];

const NAVIGATIONAL_WEAK: readonly RegExp[] = [
  /\b(?:support|help|contact|homepage|portal|dashboard)\b/i,
  /\b(?:click here|navigate to|find us at)\b/i,
];

// ---------------------------------------------------------------------------
// Pattern matching helper
// ---------------------------------------------------------------------------

function matchesAny(text: string, patterns: readonly RegExp[]): boolean {
  for (const pattern of patterns) {
    if (pattern.test(text)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentOpeningMatch(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-opening-match',
      title: 'Opening paragraph intent signal',
      description: 'No focus keyphrase set. Set one to evaluate opening paragraph intent alignment.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase);
  const intentLabel = detected.primary === 'commercial-investigation' ? 'commercial' : detected.primary;

  const plainText = stripHtml(content);
  const allWords = getWords(plainText);

  // Extract first 150 words
  const openingWords = allWords.slice(0, 150);

  if (openingWords.length === 0) {
    return {
      id: 'intent-opening-match',
      title: 'Opening paragraph intent signal',
      description: 'Content is empty. Add content to evaluate opening paragraph intent.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  const openingText = openingWords.join(' ');

  let strongPatterns: readonly RegExp[];
  let weakPatterns: readonly RegExp[];

  switch (detected.primary) {
    case 'informational':
      strongPatterns = INFORMATIONAL_STRONG;
      weakPatterns = INFORMATIONAL_WEAK;
      break;
    case 'transactional':
      strongPatterns = TRANSACTIONAL_STRONG;
      weakPatterns = TRANSACTIONAL_WEAK;
      break;
    case 'commercial-investigation':
      strongPatterns = COMMERCIAL_STRONG;
      weakPatterns = COMMERCIAL_WEAK;
      break;
    case 'navigational':
      strongPatterns = NAVIGATIONAL_STRONG;
      weakPatterns = NAVIGATIONAL_WEAK;
      break;
    default:
      strongPatterns = INFORMATIONAL_STRONG;
      weakPatterns = INFORMATIONAL_WEAK;
  }

  const hasStrongSignal = matchesAny(openingText, strongPatterns);
  const hasWeakSignal = matchesAny(openingText, weakPatterns);

  // good (5): clear intent signal in first 150 words
  if (hasStrongSignal) {
    return {
      id: 'intent-opening-match',
      title: 'Opening paragraph intent signal',
      description: `The opening clearly establishes ${intentLabel} intent. This helps readers and search engines understand the page purpose immediately.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): weak/partial signal
  if (hasWeakSignal) {
    return {
      id: 'intent-opening-match',
      title: 'Opening paragraph intent signal',
      description: `The opening has a weak ${intentLabel} intent signal. Strengthen the first 150 words by clearly establishing the ${intentLabel} purpose of the content.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (0): no intent signal or contradicting signal
  return {
    id: 'intent-opening-match',
    title: 'Opening paragraph intent signal',
    description: `The opening paragraph does not signal ${intentLabel} intent. Rewrite the first 150 words to clearly establish the ${intentLabel} purpose so readers and search engines can identify the page intent.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
