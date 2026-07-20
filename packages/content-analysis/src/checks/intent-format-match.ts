// @power-seo/content-analysis — Content Format-Intent Match Check
// ----------------------------------------------------------------------------
// Checks whether the content's structural format matches the expectations for
// the detected intent sub-type (e.g., tutorials should have steps, comparisons
// should have tables, navigational pages should be concise with direct links).

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

interface FormatSignal {
  name: string;
  present: boolean;
}

/**
 * Check format elements for informational/tutorial content.
 * Expects ordered lists, step patterns, or numbered headings.
 */
function checkTutorialFormat(content: string, plainText: string): FormatSignal[] {
  const contentLower = content.toLowerCase();
  const signals: FormatSignal[] = [];

  const hasOrderedList = contentLower.includes('<ol');
  signals.push({ name: 'Ordered list (<ol>)', present: hasOrderedList });

  const hasStepPatterns = /\bstep\s+\d/i.test(plainText);
  signals.push({ name: 'Step patterns ("Step 1", "Step 2")', present: hasStepPatterns });

  const hasNumberedHeadings = /\b\d+\.\s+\w/i.test(plainText);
  signals.push({ name: 'Numbered headings', present: hasNumberedHeadings });

  return signals;
}

/**
 * Check format elements for informational/definitional content.
 * Expects a concise definition early in the content (first 200 words).
 */
function checkDefinitionalFormat(words: string[]): FormatSignal[] {
  const signals: FormatSignal[] = [];

  const first200 = words.slice(0, 200).join(' ').toLowerCase();
  const hasEarlyDefinition = /\b(?:is a|refers to)\b/.test(first200);
  signals.push({ name: 'Early definition (first 200 words)', present: hasEarlyDefinition });

  return signals;
}

/**
 * Check format elements for informational/listicle content.
 * Expects list items (>= 5) or numbered headings.
 */
function checkListicleFormat(content: string, plainText: string): FormatSignal[] {
  const contentLower = content.toLowerCase();
  const signals: FormatSignal[] = [];

  const liCount = contentLower.split('<li').length - 1;
  signals.push({ name: 'List items (5+ <li>)', present: liCount >= 5 });

  const hasNumberedHeadings = /\b\d+\.\s+\w/.test(plainText);
  signals.push({ name: 'Numbered headings', present: hasNumberedHeadings });

  return signals;
}

/**
 * Check format elements for commercial/comparison content.
 * Expects tables or structured comparison sections.
 */
function checkComparisonFormat(content: string, plainText: string): FormatSignal[] {
  const contentLower = content.toLowerCase();
  const signals: FormatSignal[] = [];

  const hasTable = contentLower.includes('<table');
  signals.push({ name: 'Comparison table', present: hasTable });

  const hasComparisonPhrases = /\b(?:compared to|side by side|head to head|vs\.?)\b/i.test(
    plainText,
  );
  signals.push({ name: 'Comparison phrases', present: hasComparisonPhrases });

  return signals;
}

/**
 * Check format elements for commercial/review content.
 * Expects rating patterns and pros/cons sections.
 */
function checkReviewFormat(plainText: string): FormatSignal[] {
  const signals: FormatSignal[] = [];

  const hasRating =
    /\b(?:rating|score|stars)\b/i.test(plainText) ||
    /\/5\b/.test(plainText) ||
    /\/10\b/.test(plainText) ||
    /\bout of 10\b/i.test(plainText);
  signals.push({ name: 'Rating patterns', present: hasRating });

  const hasProsCons = /\b(?:pros|cons|advantages|disadvantages|benefits|drawbacks)\b/i.test(
    plainText,
  );
  signals.push({ name: 'Pros/cons sections', present: hasProsCons });

  return signals;
}

/**
 * Check format elements for transactional content.
 * Expects product-like structure: specs + price + CTA.
 */
function checkTransactionalFormat(plainText: string): FormatSignal[] {
  const signals: FormatSignal[] = [];

  const hasSpecs = /\b(?:specifications|features|dimensions|weight|material)\b/i.test(plainText);
  signals.push({ name: 'Product specifications', present: hasSpecs });

  const hasPrice = /\$\d/.test(plainText) || /\b(?:price|cost|pricing)\b/i.test(plainText);
  signals.push({ name: 'Price information', present: hasPrice });

  const hasCTA = /\b(?:buy now|add to cart|order|get started|try free|start trial)\b/i.test(
    plainText,
  );
  signals.push({ name: 'Call-to-action', present: hasCTA });

  return signals;
}

/**
 * Check format elements for navigational content.
 * Expects minimal structure with direct links.
 */
function checkNavigationalFormat(content: string, wordCount: number): FormatSignal[] {
  const signals: FormatSignal[] = [];

  signals.push({ name: 'Concise (800 words or fewer)', present: wordCount <= 800 });

  const linkMatches = content.match(/<a\s[^>]*href\s*=/gi);
  const linkCount = linkMatches ? linkMatches.length : 0;
  signals.push({ name: 'Direct links present', present: linkCount >= 1 });

  return signals;
}

export function checkIntentFormatMatch(input: ContentAnalysisInput): AnalysisResult {
  const id = 'intent-format-match';
  const title = 'Content format-intent match';

  // No keyphrase — cannot determine intent
  if (!input.focusKeyphrase || input.focusKeyphrase.trim().length === 0) {
    return {
      id,
      title,
      description: 'No focus keyphrase set.',
      status: 'na',
      score: 0,
      maxScore: 8,
    };
  }

  const intent = detectIntent(input.focusKeyphrase);
  const content = input.content;
  const plainText = stripHtml(content);
  const words = getWords(content);
  const wordCount = words.length;

  let signals: FormatSignal[] = [];
  let expectedFormat: string;

  // Route to the appropriate format check based on intent primary + sub-type
  const primary = intent.primary;
  const subType = intent.subType;

  if (primary === 'informational') {
    if (subType === 'tutorial' || subType === 'troubleshooting') {
      expectedFormat = 'tutorial/how-to';
      signals = checkTutorialFormat(content, plainText);
    } else if (subType === 'definitional') {
      expectedFormat = 'definitional';
      signals = checkDefinitionalFormat(words);
    } else if (subType === 'reference') {
      expectedFormat = 'listicle';
      signals = checkListicleFormat(content, plainText);
    } else {
      // General informational — check for a mix of tutorial + listicle
      expectedFormat = 'informational';
      const tutorialSignals = checkTutorialFormat(content, plainText);
      const listicleSignals = checkListicleFormat(content, plainText);
      const defSignals = checkDefinitionalFormat(words);
      signals = [...tutorialSignals, ...listicleSignals, ...defSignals];
    }
  } else if (primary === 'commercial-investigation') {
    if (subType === 'comparison') {
      expectedFormat = 'comparison';
      signals = checkComparisonFormat(content, plainText);
    } else if (subType === 'review-seeking') {
      expectedFormat = 'review';
      signals = checkReviewFormat(plainText);
    } else {
      // General commercial — check for both comparison + review signals
      expectedFormat = 'commercial investigation';
      const compSignals = checkComparisonFormat(content, plainText);
      const reviewSignals = checkReviewFormat(plainText);
      signals = [...compSignals, ...reviewSignals];
    }
  } else if (primary === 'transactional') {
    expectedFormat = 'transactional/product';
    signals = checkTransactionalFormat(plainText);
  } else if (primary === 'navigational') {
    expectedFormat = 'navigational';
    signals = checkNavigationalFormat(content, wordCount);
  } else {
    // Fallback — should not happen, but handle gracefully
    return {
      id,
      title,
      description: 'Unable to determine expected format for this intent type.',
      status: 'na',
      score: 0,
      maxScore: 8,
    };
  }

  // Evaluate: how many format signals are present?
  const totalSignals = signals.length;
  const presentSignals = signals.filter((s) => s.present);
  const presentCount = presentSignals.length;
  const missingSignals = signals.filter((s) => !s.present);

  // Determine match level
  let score: number;
  let status: 'good' | 'ok' | 'poor';

  if (totalSignals === 0) {
    // No signals to check — consider it a pass
    return {
      id,
      title,
      description: `No specific format requirements identified for ${expectedFormat} content.`,
      status: 'na',
      score: 0,
      maxScore: 8,
    };
  }

  const matchRatio = presentCount / totalSignals;

  if (matchRatio >= 0.5) {
    // At least half the signals match — good
    score = 8;
    status = 'good';
  } else if (presentCount >= 1) {
    // At least one signal matches — partial
    score = 5;
    status = 'ok';
  } else {
    // No signals match — mismatch
    score = 0;
    status = 'poor';
  }

  // Build description
  const subTypeLabel = subType ? ` (${subType})` : '';
  const presentList = presentSignals.map((s) => s.name).join(', ');
  const missingList = missingSignals.map((s) => s.name).join(', ');

  let description: string;
  if (status === 'good') {
    description = `Content format matches ${expectedFormat}${subTypeLabel} expectations (${presentCount}/${totalSignals} signals). Found: ${presentList}.`;
    if (missingSignals.length > 0) {
      description += ` Could also add: ${missingList}.`;
    }
  } else if (status === 'ok') {
    description = `Content partially matches ${expectedFormat}${subTypeLabel} format (${presentCount}/${totalSignals} signals). Found: ${presentList}. Missing: ${missingList}.`;
  } else {
    description = `Content format does not match ${expectedFormat}${subTypeLabel} expectations (0/${totalSignals} signals). Missing: ${missingList}. Restructure content to match the expected format.`;
  }

  return { id, title, description, status, score, maxScore: 8 };
}
