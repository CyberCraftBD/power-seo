// @power-seo/content-analysis — Search Satisfaction Score Check
// ----------------------------------------------------------------------------
// Composite check estimating if content fully resolves the searcher's query
// by evaluating 6 satisfaction signals specific to the detected intent type.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Signal checkers per intent type
// ---------------------------------------------------------------------------

interface SignalResult {
  name: string;
  present: boolean;
}

function checkInformationalSignals(
  plainText: string,
  contentLower: string,
): SignalResult[] {
  const textLower = plainText.toLowerCase();
  const words = getWords(plainText);
  const wordCount = words.length;

  // Count H2/H3 subheadings
  const h2Count = contentLower.split('<h2').length - 1;
  const h3Count = contentLower.split('<h3').length - 1;
  const headingCount = h2Count + h3Count;

  return [
    {
      name: 'Answer clarity',
      present: /\b(?:is a|means|refers to)\b/i.test(plainText),
    },
    {
      name: 'Examples',
      present: /\b(?:for example|for instance|such as|e\.g\.)\b/i.test(plainText),
    },
    {
      name: 'Summary/takeaway',
      present: /\b(?:in summary|key takeaway|conclusion|to summarize|bottom line)\b/i.test(plainText),
    },
    {
      name: 'Depth (800+ words)',
      present: wordCount >= 800,
    },
    {
      name: 'Structure (3+ subheadings)',
      present: headingCount >= 3,
    },
    {
      name: 'Next steps',
      present: /\b(?:next step|learn more|read also|related|see also)\b/i.test(textLower),
    },
  ];
}

function checkTransactionalSignals(
  plainText: string,
  _contentLower: string,
): SignalResult[] {
  const textLower = plainText.toLowerCase();

  return [
    {
      name: 'Product info',
      present: /\b(?:spec|specs|specifications?|features?|details?)\b/i.test(textLower),
    },
    {
      name: 'Pricing',
      present: /\b(?:price|cost|pricing)\b/i.test(textLower) || textLower.includes('$'),
    },
    {
      name: 'CTA',
      present: /\b(?:buy|order|get started)\b/i.test(textLower),
    },
    {
      name: 'Trust signals',
      present: /\b(?:guarantee|warranty|secure|money.back)\b/i.test(textLower),
    },
    {
      name: 'Logistics',
      present: /\b(?:shipping|delivery|availability|in stock)\b/i.test(textLower),
    },
    {
      name: 'Social proof',
      present: /\b(?:reviews?|testimonials?|ratings?|customers? say)\b/i.test(textLower),
    },
  ];
}

function checkCommercialSignals(
  plainText: string,
  contentLower: string,
): SignalResult[] {
  const textLower = plainText.toLowerCase();

  // Check for multiple product/service mentions (simple heuristic: 2+ capitalized
  // multi-word proper nouns or brand-like words near "vs" / list context)
  const productMentions = plainText.match(/\b[A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*\b/g);
  const uniqueProducts = productMentions ? new Set(productMentions).size : 0;

  return [
    {
      name: 'Multiple options',
      present: uniqueProducts >= 2,
    },
    {
      name: 'Comparison',
      present: /\b(?:vs|versus|compared|comparison)\b/i.test(textLower)
        || contentLower.includes('<table'),
    },
    {
      name: 'Verdict',
      present: /\b(?:recommendation|winner|our pick|best overall|top pick|verdict)\b/i.test(textLower),
    },
    {
      name: 'Criteria',
      present: /\b(?:criteria|factors?|what to look for|how to choose|we evaluated|we tested)\b/i.test(textLower),
    },
    {
      name: 'Pricing comparison',
      present: /\b(?:price|cost|pricing|starts at|per month|free plan)\b/i.test(textLower),
    },
    {
      name: 'Pros/cons',
      present: /\b(?:pros|cons|advantages?|disadvantages?|strengths?|weaknesses?)\b/i.test(textLower),
    },
  ];
}

function checkNavigationalSignals(
  plainText: string,
  contentLower: string,
): SignalResult[] {
  const textLower = plainText.toLowerCase();
  const words = getWords(plainText);
  const wordCount = words.length;

  // Check for external links
  const hasExternalLink = /<a\s[^>]*href\s*=\s*["']https?:\/\//i.test(contentLower);

  return [
    {
      name: 'Target found',
      present: /\b(?:official|homepage|website|portal)\b/i.test(textLower),
    },
    {
      name: 'Direct link',
      present: hasExternalLink,
    },
    {
      name: 'Concise',
      present: wordCount <= 500,
    },
    {
      name: 'Contact info',
      present: /\b(?:contact|email|phone|address|call us|reach us)\b/i.test(textLower),
    },
    {
      name: 'Clear path',
      present: /\b(?:click here|go to|visit|navigate|find it at|head to)\b/i.test(textLower),
    },
    {
      name: 'Freshness',
      present: /\b(?:updated|as of|current|latest|new|20\d{2})\b/i.test(textLower),
    },
  ];
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentSatisfactionScore(
  input: ContentAnalysisInput,
): AnalysisResult {
  const id = 'intent-satisfaction-score';
  const title = 'Search satisfaction score';

  if (!input.focusKeyphrase || input.focusKeyphrase.trim().length === 0) {
    return {
      id,
      title,
      description: 'No focus keyphrase set. Set one to evaluate search satisfaction.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(input.focusKeyphrase);
  const intentLabel =
    detected.primary === 'commercial-investigation'
      ? 'commercial'
      : detected.primary;

  const plainText = stripHtml(input.content);
  const contentLower = input.content.toLowerCase();

  let signals: SignalResult[];
  switch (detected.primary) {
    case 'informational':
      signals = checkInformationalSignals(plainText, contentLower);
      break;
    case 'transactional':
      signals = checkTransactionalSignals(plainText, contentLower);
      break;
    case 'commercial-investigation':
      signals = checkCommercialSignals(plainText, contentLower);
      break;
    case 'navigational':
      signals = checkNavigationalSignals(plainText, contentLower);
      break;
    default:
      signals = checkInformationalSignals(plainText, contentLower);
  }

  const presentSignals = signals.filter((s) => s.present);
  const missingSignals = signals.filter((s) => !s.present);
  const presentCount = presentSignals.length;

  const presentList = presentSignals.map((s) => s.name).join(', ');
  const missingList = missingSignals.map((s) => s.name).join(', ');

  // good (5): 5-6 signals
  if (presentCount >= 5) {
    return {
      id,
      title,
      description:
        `Excellent search satisfaction for ${intentLabel} intent (${presentCount}/6 signals). ` +
        `Present: ${presentList}.` +
        (missingSignals.length > 0 ? ` Consider adding: ${missingList}.` : ''),
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): 3-4 signals
  if (presentCount >= 3) {
    return {
      id,
      title,
      description:
        `Acceptable search satisfaction for ${intentLabel} intent (${presentCount}/6 signals). ` +
        `Present: ${presentList}. Missing: ${missingList}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (1): 1-2 signals
  if (presentCount >= 1) {
    return {
      id,
      title,
      description:
        `Low search satisfaction for ${intentLabel} intent (${presentCount}/6 signals). ` +
        `Present: ${presentList}. Missing: ${missingList}. ` +
        `Content may not fully resolve the searcher's query.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  // poor (0): 0 signals
  return {
    id,
    title,
    description:
      `No satisfaction signals found for ${intentLabel} intent (0/6 signals). ` +
      `Missing: ${missingList}. Content is unlikely to resolve the searcher's query.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
