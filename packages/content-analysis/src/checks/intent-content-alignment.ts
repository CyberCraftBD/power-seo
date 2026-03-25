// @power-seo/content-analysis — Content-Intent Alignment Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Intent Signal Phrases
// ---------------------------------------------------------------------------

const INFORMATIONAL_SIGNALS: readonly string[] = [
  'how to', 'what is', 'guide', 'learn', 'understand', 'explained',
  'definition', 'steps', 'tutorial', 'tips', 'example', 'for example',
  'such as', 'in this article', "we'll cover", "you'll learn",
  "let's explore", 'introduction',
] as const;

const TRANSACTIONAL_SIGNALS: readonly string[] = [
  'buy', 'purchase', 'order', 'add to cart', 'shop', 'deal', 'discount',
  'price', 'pricing', '$', 'free shipping', 'checkout', 'subscribe',
  'sign up', 'get started', 'try free', 'limited time', 'in stock',
  'available now',
] as const;

const COMMERCIAL_SIGNALS: readonly string[] = [
  'best', 'top', 'review', 'compared', 'comparison', 'vs', 'versus',
  'pros and cons', 'advantages', 'disadvantages', 'rating', 'rated',
  'recommend', 'our pick', "editor's choice", 'winner', 'runner-up',
  'alternative',
] as const;

const NAVIGATIONAL_SIGNALS: readonly string[] = [
  'official', 'login', 'sign in', 'dashboard', 'my account', 'support',
  'contact us', 'help center', 'visit', 'go to', 'homepage',
] as const;

// ---------------------------------------------------------------------------
// Signal list lookup
// ---------------------------------------------------------------------------

type IntentCategory = 'informational' | 'navigational' | 'transactional' | 'commercial-investigation' | 'unknown';

function getSignalsForIntent(intent: IntentCategory): readonly string[] {
  switch (intent) {
    case 'informational':
      return INFORMATIONAL_SIGNALS;
    case 'transactional':
      return TRANSACTIONAL_SIGNALS;
    case 'commercial-investigation':
      return COMMERCIAL_SIGNALS;
    case 'navigational':
      return NAVIGATIONAL_SIGNALS;
    default:
      return INFORMATIONAL_SIGNALS;
  }
}

// ---------------------------------------------------------------------------
// Count signal matches in a text segment
// ---------------------------------------------------------------------------

function countSignals(text: string, signals: readonly string[]): number {
  let count = 0;
  for (const signal of signals) {
    if (signal === '$') {
      // Special case: dollar sign is not a word, just check presence
      if (text.includes('$')) {
        count++;
      }
    } else {
      const escaped = signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?:^|\\b)${escaped}(?:\\b|$)`, 'i');
      if (re.test(text)) {
        count++;
      }
    }
  }
  return count;
}

// ---------------------------------------------------------------------------
// Section analysis
// ---------------------------------------------------------------------------

interface SectionResult {
  introSignals: number;
  bodySignals: number;
  conclusionSignals: number;
  totalSignals: number;
  sectionsWithSignals: number;
}

function analyzeBySection(words: string[], signals: readonly string[]): SectionResult {
  const totalWords = words.length;
  if (totalWords === 0) {
    return { introSignals: 0, bodySignals: 0, conclusionSignals: 0, totalSignals: 0, sectionsWithSignals: 0 };
  }

  // Split into 3 sections: first 20%, middle 50%, last 30%
  const introEnd = Math.max(1, Math.floor(totalWords * 0.2));
  const bodyEnd = Math.max(introEnd + 1, Math.floor(totalWords * 0.7));

  const introText = words.slice(0, introEnd).join(' ');
  const bodyText = words.slice(introEnd, bodyEnd).join(' ');
  const conclusionText = words.slice(bodyEnd).join(' ');

  const introSignals = countSignals(introText, signals);
  const bodySignals = countSignals(bodyText, signals);
  const conclusionSignals = countSignals(conclusionText, signals);
  const totalSignals = introSignals + bodySignals + conclusionSignals;

  let sectionsWithSignals = 0;
  if (introSignals > 0) sectionsWithSignals++;
  if (bodySignals > 0) sectionsWithSignals++;
  if (conclusionSignals > 0) sectionsWithSignals++;

  return { introSignals, bodySignals, conclusionSignals, totalSignals, sectionsWithSignals };
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentContentAlignment(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-content-alignment',
      title: 'Content-intent alignment',
      description: 'No focus keyphrase set. Set one to evaluate content-intent alignment.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase);
  const signals = getSignalsForIntent(detected.primary);
  const plainText = stripHtml(content);
  const words = getWords(plainText);
  const result = analyzeBySection(words, signals);

  const intentLabel = detected.primary === 'commercial-investigation' ? 'commercial' : detected.primary;

  // good (5): 5+ signals spread across sections (2+ sections)
  if (result.totalSignals >= 5 && result.sectionsWithSignals >= 2) {
    return {
      id: 'intent-content-alignment',
      title: 'Content-intent alignment',
      description: `Content aligns well with ${intentLabel} intent. Found ${result.totalSignals} intent signals spread across ${result.sectionsWithSignals} section${result.sectionsWithSignals === 1 ? '' : 's'} (intro: ${result.introSignals}, body: ${result.bodySignals}, conclusion: ${result.conclusionSignals}).`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): 2-4 signals OR 5+ concentrated in one section
  if (result.totalSignals >= 2) {
    const concentrated = result.sectionsWithSignals <= 1 && result.totalSignals >= 5;
    const detail = concentrated
      ? `Signals are concentrated in one section — distribute them across intro, body, and conclusion`
      : `Add more ${intentLabel} intent signals throughout the content`;

    return {
      id: 'intent-content-alignment',
      title: 'Content-intent alignment',
      description: `Partial ${intentLabel} intent alignment. Found ${result.totalSignals} intent signal${result.totalSignals === 1 ? '' : 's'} in ${result.sectionsWithSignals} section${result.sectionsWithSignals === 1 ? '' : 's'}. ${detail}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (0): 0-1 signals
  return {
    id: 'intent-content-alignment',
    title: 'Content-intent alignment',
    description: `Content does not match ${intentLabel} intent. Found only ${result.totalSignals} intent signal${result.totalSignals === 1 ? '' : 's'}. Add ${intentLabel} language throughout the content to align with the keyphrase intent.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
