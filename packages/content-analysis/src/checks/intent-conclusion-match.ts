// @power-seo/content-analysis — Conclusion-Intent Alignment Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Intent-specific conclusion resolution patterns
// ---------------------------------------------------------------------------

/** Informational: summary patterns */
const INFORMATIONAL_STRONG: readonly RegExp[] = [
  /\b(?:in conclusion|to summarize|key takeaway|final thoughts|in summary)\b/i,
  /\b(?:to wrap up|to sum up|the bottom line|in short)\b/i,
  /\b(?:now you (?:know|understand)|we(?:'ve| have) covered)\b/i,
  /\b(?:as (?:we(?:'ve| have)|you(?:'ve| have)) (?:seen|learned))\b/i,
];

const INFORMATIONAL_WEAK: readonly RegExp[] = [
  /\b(?:overall|ultimately|lastly|finally|remember)\b/i,
  /\b(?:keep in mind|don't forget|the (?:main|key) (?:point|thing))\b/i,
  /\b(?:takeaway|recap|summary)\b/i,
];

/** Transactional: CTA patterns */
const TRANSACTIONAL_STRONG: readonly RegExp[] = [
  /\b(?:buy now|order today|get started|sign up|don't miss)\b/i,
  /\b(?:shop now|subscribe today|claim your|grab your)\b/i,
  /\b(?:start your free|try (?:it )?(?:now|today|free))\b/i,
  /\b(?:act now|limited time|order (?:now|yours))\b/i,
];

const TRANSACTIONAL_WEAK: readonly RegExp[] = [
  /\b(?:ready to|what are you waiting for|take the next step)\b/i,
  /\b(?:don't wait|available (?:now|today)|get yours)\b/i,
  /\b(?:purchase|checkout|add to cart|place your order)\b/i,
];

/** Commercial: recommendation patterns */
const COMMERCIAL_STRONG: readonly RegExp[] = [
  /\b(?:we recommend|our (?:top )?pick|the winner|best overall|verdict)\b/i,
  /\b(?:our recommendation|editor's choice|top choice)\b/i,
  /\b(?:the clear winner|our favorite|best (?:option|choice|value))\b/i,
];

const COMMERCIAL_WEAK: readonly RegExp[] = [
  /\b(?:if you(?:'re| are) looking for|the best (?:for|in))\b/i,
  /\b(?:choose|go with|opt for|consider|runner-up)\b/i,
  /\b(?:depending on your (?:needs|budget)|it depends)\b/i,
  /\b(?:all things considered|when it comes to)\b/i,
];

/** Navigational: direct link reference */
const NAVIGATIONAL_STRONG: readonly RegExp[] = [
  /\b(?:visit|go to|access|log ?in|sign ?in)\b/i,
  /\b(?:click (?:here|the link|below)|head (?:to|over))\b/i,
  /https?:\/\//i,
];

const NAVIGATIONAL_WEAK: readonly RegExp[] = [
  /\b(?:for more (?:information|help|details)|contact us)\b/i,
  /\b(?:support|help center|official)\b/i,
  /\b(?:reach out|get in touch)\b/i,
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

export function checkIntentConclusionMatch(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-conclusion-match',
      title: 'Conclusion-intent alignment',
      description: 'No focus keyphrase set. Set one to evaluate conclusion-intent alignment.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase);
  const intentLabel = detected.primary === 'commercial-investigation' ? 'commercial' : detected.primary;

  const plainText = stripHtml(content);
  const allWords = getWords(plainText);

  // Extract last 150 words
  const startIndex = Math.max(0, allWords.length - 150);
  const conclusionWords = allWords.slice(startIndex);

  if (conclusionWords.length === 0) {
    return {
      id: 'intent-conclusion-match',
      title: 'Conclusion-intent alignment',
      description: 'Content is empty. Add content to evaluate conclusion-intent alignment.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  const conclusionText = conclusionWords.join(' ');

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

  const hasStrongSignal = matchesAny(conclusionText, strongPatterns);
  const hasWeakSignal = matchesAny(conclusionText, weakPatterns);

  // good (5): conclusion properly resolves intent
  if (hasStrongSignal) {
    return {
      id: 'intent-conclusion-match',
      title: 'Conclusion-intent alignment',
      description: `The conclusion properly resolves the ${intentLabel} intent. This reinforces the page purpose and satisfies user expectations.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): partial resolution
  if (hasWeakSignal) {
    return {
      id: 'intent-conclusion-match',
      title: 'Conclusion-intent alignment',
      description: `The conclusion partially resolves ${intentLabel} intent. Strengthen the final 150 words with a clearer ${intentLabel} resolution.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (0): no resolution or drops intent
  return {
    id: 'intent-conclusion-match',
    title: 'Conclusion-intent alignment',
    description: `The conclusion does not resolve the ${intentLabel} intent. End the content with a clear ${intentLabel} resolution so readers leave with their intent fulfilled.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
