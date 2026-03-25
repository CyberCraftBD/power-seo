// @power-seo/content-analysis — Mixed Intent Warning Check
// ----------------------------------------------------------------------------
// Detects when content contains conflicting intent signals that may confuse
// search engines about the page's purpose.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Intent signal patterns for all 4 categories
// ---------------------------------------------------------------------------

interface IntentCategory {
  key: string;
  label: string;
  pattern: RegExp;
}

const INTENT_CATEGORIES: IntentCategory[] = [
  {
    key: 'informational',
    label: 'Informational',
    pattern:
      /\b(how to|what is|guide|learn|understand|explained|definition|steps|tutorial|tips|example|for example|such as|in this article|we'll cover|you'll learn|let's explore|introduction|overview|basics|beginners|faq)\b/gi,
  },
  {
    key: 'transactional',
    label: 'Transactional',
    pattern:
      /\b(buy|purchase|order|add to cart|shop|deal|discount|price|pricing|free shipping|checkout|subscribe|sign up|get started|try free|limited time|in stock|available now|book now|reserve)\b/gi,
  },
  {
    key: 'commercial-investigation',
    label: 'Commercial',
    pattern:
      /\b(best|top|review|compared|comparison|vs|versus|pros and cons|advantages|disadvantages|rating|rated|recommend|our pick|editor's choice|winner|runner-up|alternative|benchmark)\b/gi,
  },
  {
    key: 'navigational',
    label: 'Navigational',
    pattern:
      /\b(official|login|sign in|dashboard|my account|support|contact us|help center|visit|go to|homepage)\b/gi,
  },
];

/** Conflict threshold: secondary intent > 30% of primary intent signals. */
const CONFLICT_THRESHOLD = 0.3;

/**
 * Count all matches for a given regex pattern within text.
 */
function countMatches(text: string, pattern: RegExp): number {
  const re = new RegExp(pattern.source, pattern.flags);
  const matches = text.match(re);
  return matches ? matches.length : 0;
}

/**
 * Check whether the content mixes signals from conflicting intent categories.
 *
 * Scans content for signals from all 4 intent types, determines the dominant
 * content intent, and checks whether it aligns with the keyphrase intent.
 *
 * - good (5): no conflicting signals, content matches keyphrase intent
 * - ok   (3): minor mixing (secondary signals present but < 30% of primary)
 * - poor (1): heavy mixing or dominant content intent contradicts keyphrase intent
 */
export function checkIntentMixedWarning(
  input: ContentAnalysisInput,
): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-mixed-warning',
      title: 'Mixed intent warning',
      description:
        'No focus keyphrase set. Set one to check for mixed intent signals.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase.trim());
  const keyphraseIntent = detected.primary;

  const plainText = stripHtml(content).toLowerCase();

  // Count signals per category
  const categoryCounts: Array<{ key: string; label: string; count: number }> = [];
  for (const category of INTENT_CATEGORIES) {
    const count = countMatches(plainText, category.pattern);
    categoryCounts.push({ key: category.key, label: category.label, count });
  }

  // Sort by count descending to find dominant content intent
  const sorted = [...categoryCounts].sort((a, b) => b.count - a.count);
  const dominant = sorted[0];

  // Guard for strict indexed access
  if (!dominant) {
    return {
      id: 'intent-mixed-warning',
      title: 'Mixed intent warning',
      description: 'Unable to analyze intent signals in the content.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // No signals at all
  if (dominant.count === 0) {
    return {
      id: 'intent-mixed-warning',
      title: 'Mixed intent warning',
      description:
        'No intent signals found in the content. Add intent-appropriate language to strengthen your content focus.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // Identify secondary categories with signals
  const secondaryCategories = sorted.filter(
    (c) => c.key !== keyphraseIntent && c.count > 0,
  );

  // Find the keyphrase intent's signal count in content
  const keyphraseIntentCount =
    categoryCounts.find((c) => c.key === keyphraseIntent)?.count ?? 0;

  // Check for conflicts: secondary intent signals > 30% of primary keyphrase intent signals
  const conflicting = secondaryCategories.filter((c) => {
    if (keyphraseIntentCount === 0) return c.count > 0;
    return c.count / keyphraseIntentCount > CONFLICT_THRESHOLD;
  });

  // Check if dominant content intent contradicts keyphrase intent
  const dominantContradictsKeyphrase =
    dominant.key !== keyphraseIntent && dominant.count > keyphraseIntentCount;

  // Build description parts
  const keyphraseLabel =
    INTENT_CATEGORIES.find((c) => c.key === keyphraseIntent)?.label ?? keyphraseIntent;
  const signalSummary = categoryCounts
    .filter((c) => c.count > 0)
    .map((c) => `${c.label}: ${c.count}`)
    .join(', ');

  if (dominantContradictsKeyphrase) {
    return {
      id: 'intent-mixed-warning',
      title: 'Mixed intent warning',
      description:
        `Content's dominant intent is ${dominant.label} (${dominant.count} signals), ` +
        `but the keyphrase targets ${keyphraseLabel} intent (${keyphraseIntentCount} signals). ` +
        `Signal breakdown: ${signalSummary}. ` +
        'Realign content to match the keyphrase intent or choose a different keyphrase.',
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  if (conflicting.length > 0) {
    const conflictNames = conflicting
      .map((c) => `${c.label} (${c.count} signals)`)
      .join(', ');

    // Heavy mixing: any secondary > 30% but dominant still matches
    const hasHeavyMixing = conflicting.some((c) => {
      if (keyphraseIntentCount === 0) return true;
      return c.count / keyphraseIntentCount > 0.5;
    });

    if (hasHeavyMixing) {
      return {
        id: 'intent-mixed-warning',
        title: 'Mixed intent warning',
        description:
          `Heavy intent mixing detected. Keyphrase targets ${keyphraseLabel} intent ` +
          `(${keyphraseIntentCount} signals), but conflicting signals found: ${conflictNames}. ` +
          `Signal breakdown: ${signalSummary}. ` +
          'Reduce conflicting intent language to strengthen content focus.',
        status: 'poor',
        score: 1,
        maxScore: 5,
      };
    }

    return {
      id: 'intent-mixed-warning',
      title: 'Mixed intent warning',
      description:
        `Minor intent mixing detected. Keyphrase targets ${keyphraseLabel} intent ` +
        `(${keyphraseIntentCount} signals) with some secondary signals: ${conflictNames}. ` +
        `Signal breakdown: ${signalSummary}. ` +
        'Consider reducing secondary intent language for clearer focus.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // Check for minor presence of secondary signals (under threshold)
  const minorSecondary = secondaryCategories.filter((c) => c.count > 0);
  if (minorSecondary.length > 0) {
    return {
      id: 'intent-mixed-warning',
      title: 'Mixed intent warning',
      description:
        `Content aligns well with ${keyphraseLabel} intent (${keyphraseIntentCount} signals). ` +
        `Minor secondary signals present but within acceptable range. Signal breakdown: ${signalSummary}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'intent-mixed-warning',
    title: 'Mixed intent warning',
    description:
      `Content cleanly targets ${keyphraseLabel} intent with ${keyphraseIntentCount} signals ` +
      `and no conflicting intent language. Signal breakdown: ${signalSummary}.`,
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
