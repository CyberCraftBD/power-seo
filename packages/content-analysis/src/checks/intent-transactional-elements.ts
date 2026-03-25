// @power-seo/content-analysis — Transactional Content Elements Check
// ----------------------------------------------------------------------------
// Checks whether transactional content includes the elements buyers expect:
// pricing, specs, availability, CTAs, trust signals, shipping, payments,
// and reviews/ratings.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

interface TransactionalElement {
  name: string;
  present: boolean;
}

export function checkIntentTransactionalElements(
  input: ContentAnalysisInput,
): AnalysisResult {
  const id = 'intent-transactional-elements';
  const title = 'Transactional content elements';

  // No keyphrase — cannot determine intent
  if (!input.focusKeyphrase || input.focusKeyphrase.trim().length === 0) {
    return { id, title, description: 'No focus keyphrase set.', status: 'na', score: 0, maxScore: 5 };
  }

  // Only applies to transactional intent
  const intent = detectIntent(input.focusKeyphrase);
  if (intent.primary !== 'transactional') {
    return {
      id,
      title,
      description: `Detected intent is "${intent.primary}" — this check only applies to transactional content.`,
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const plainText = stripHtml(input.content);
  const plainTextLower = plainText.toLowerCase();

  const elements: TransactionalElement[] = [];

  // 1. Price / cost mentions
  const hasPricing = /\$\d/.test(plainText)
    || /\b(?:price|cost|pricing)\b/i.test(plainText)
    || /(?:USD|EUR|GBP|CAD|AUD)\s*\d/i.test(plainText)
    || /\d+\.\d{2}\b/.test(plainText);
  elements.push({ name: 'Price/cost mentions', present: hasPricing });

  // 2. Product specs
  const hasSpecs = /\b(?:specifications|features|dimensions|weight|material|compatibility)\b/i.test(plainText);
  elements.push({ name: 'Product specifications', present: hasSpecs });

  // 3. Availability
  const hasAvailability = /\b(?:in stock|available|ships|delivery|ready to ship)\b/i.test(plainText);
  elements.push({ name: 'Availability info', present: hasAvailability });

  // 4. Purchase CTAs
  const hasCTAs = /\b(?:buy now|add to cart|order|get started|try free|start trial)\b/i.test(plainText);
  elements.push({ name: 'Purchase CTAs', present: hasCTAs });

  // 5. Trust signals
  const hasTrust = /\b(?:guarantee|warranty|money-back|secure|verified|certified|free returns)\b/i.test(plainText);
  elements.push({ name: 'Trust signals', present: hasTrust });

  // 6. Shipping info
  const hasShipping = /\b(?:free shipping|delivery|ships within|express|standard shipping)\b/i.test(plainText);
  elements.push({ name: 'Shipping information', present: hasShipping });

  // 7. Payment options
  const hasPayment = /\b(?:pay with|credit card|paypal|payment plan|installment|financing)\b/i.test(plainText);
  elements.push({ name: 'Payment options', present: hasPayment });

  // 8. Reviews / ratings
  const hasReviews = /\b(?:review|rating|stars|customer|testimonial)\b/i.test(plainTextLower);
  elements.push({ name: 'Reviews/ratings', present: hasReviews });

  // Tally present elements
  const presentElements = elements.filter((e) => e.present);
  const presentCount = presentElements.length;
  const missingElements = elements.filter((e) => !e.present);

  // Scoring
  let score: number;
  let status: 'good' | 'ok' | 'poor';

  if (presentCount >= 5) {
    score = 5;
    status = 'good';
  } else if (presentCount >= 3) {
    score = 3;
    status = 'ok';
  } else {
    score = 1;
    status = 'poor';
  }

  // Build description
  const presentList = presentElements.map((e) => e.name).join(', ');
  const missingList = missingElements.map((e) => e.name).join(', ');

  let description: string;
  if (presentCount >= 5) {
    description = `Strong transactional content (${presentCount}/8 elements). Present: ${presentList}.`;
    if (missingElements.length > 0) {
      description += ` Consider also adding: ${missingList}.`;
    }
  } else if (presentCount >= 3) {
    description = `Acceptable transactional content (${presentCount}/8 elements). Present: ${presentList}. Missing: ${missingList}.`;
  } else {
    description = `Transactional content lacks key elements (${presentCount}/8).${presentCount > 0 ? ` Present: ${presentList}.` : ''} Missing: ${missingList}.`;
  }

  return { id, title, description, status, score, maxScore: 5 };
}
