// @power-seo/content-analysis — Meta Description-Intent Match Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Intent-specific meta signal patterns
// ---------------------------------------------------------------------------

const META_SIGNALS: Record<string, readonly string[]> = {
  informational: [
    'how to', 'what is', 'learn', 'guide', 'discover', 'understand',
    'explained', 'tutorial', 'tips', 'steps', 'find out', 'introduction',
    'overview', 'basics', 'everything you need to know',
  ],
  transactional: [
    'buy', 'purchase', 'order', 'shop', 'deal', 'discount', 'price',
    'pricing', 'free shipping', 'subscribe', 'sign up', 'get started',
    'try free', 'limited time', 'in stock', 'available now', 'save',
    'offer', '$',
  ],
  'commercial-investigation': [
    'best', 'top', 'review', 'compared', 'comparison', 'vs', 'versus',
    'pros and cons', 'advantages', 'disadvantages', 'rating', 'rated',
    'recommend', 'our pick', 'alternative', 'winner',
  ],
  navigational: [
    'official', 'login', 'sign in', 'dashboard', 'my account', 'support',
    'contact us', 'help center', 'visit', 'go to', 'homepage', 'access',
  ],
};

// Intent-appropriate CTAs
const CTA_SIGNALS: Record<string, readonly string[]> = {
  informational: [
    'learn', 'discover', 'find out', 'explore', 'read more', 'see how',
    'get the guide', 'start learning',
  ],
  transactional: [
    'shop now', 'order today', 'get', 'buy now', 'subscribe today',
    'sign up now', 'start your free', 'claim your', 'grab your',
    'don\'t miss',
  ],
  'commercial-investigation': [
    'compare', 'see our picks', 'read our review', 'find the best',
    'see the results', 'view comparison', 'check out our',
  ],
  navigational: [
    'visit', 'access', 'go to', 'log in to', 'sign in to', 'get to',
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countSignalMatches(text: string, signals: readonly string[]): number {
  let count = 0;
  for (const signal of signals) {
    if (signal === '$') {
      if (text.includes('$')) count++;
    } else {
      const escaped = signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?:^|\\b)${escaped}(?:\\b|$)`, 'i');
      if (re.test(text)) count++;
    }
  }
  return count;
}

function hasAnyCta(text: string, ctas: readonly string[]): boolean {
  for (const cta of ctas) {
    const escaped = cta.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|\\b)${escaped}(?:\\b|$)`, 'i');
    if (re.test(text)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentMetaMatch(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, metaDescription } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-meta-match',
      title: 'Meta description-intent match',
      description: 'No focus keyphrase set. Set one to evaluate meta description-intent alignment.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  if (!metaDescription || metaDescription.trim().length === 0) {
    return {
      id: 'intent-meta-match',
      title: 'Meta description-intent match',
      description: 'No meta description provided. Add one to evaluate intent alignment.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase);
  const intentLabel = detected.primary === 'commercial-investigation' ? 'commercial' : detected.primary;

  const signals = META_SIGNALS[detected.primary] ?? META_SIGNALS['informational']!;
  const ctas = CTA_SIGNALS[detected.primary] ?? CTA_SIGNALS['informational']!;

  const metaLower = metaDescription.toLowerCase();
  const signalCount = countSignalMatches(metaLower, signals);
  const hasCta = hasAnyCta(metaLower, ctas);

  // good (5): meta description aligns with intent + has CTA
  if (signalCount >= 1 && hasCta) {
    return {
      id: 'intent-meta-match',
      title: 'Meta description-intent match',
      description: `Meta description aligns with ${intentLabel} intent and includes an appropriate call to action. Found ${signalCount} intent signal${signalCount === 1 ? '' : 's'} and a CTA.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): partial alignment (signals but no CTA, or CTA but weak signals)
  if (signalCount >= 1 || hasCta) {
    const missing = signalCount >= 1
      ? 'Add an intent-appropriate CTA to improve click-through rate'
      : `Add ${intentLabel} intent language to the meta description`;

    return {
      id: 'intent-meta-match',
      title: 'Meta description-intent match',
      description: `Meta description partially aligns with ${intentLabel} intent. ${missing}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (0): no alignment
  return {
    id: 'intent-meta-match',
    title: 'Meta description-intent match',
    description: `Meta description does not align with ${intentLabel} intent. Rewrite it to include ${intentLabel} language and an appropriate call to action.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
