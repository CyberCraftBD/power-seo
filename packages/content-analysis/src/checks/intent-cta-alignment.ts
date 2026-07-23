// @power-seo/content-analysis — CTA-Intent Alignment Check
// ----------------------------------------------------------------------------
// Checks whether calls-to-action (CTAs) in the content match the detected
// search intent of the focus keyphrase.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// CTA patterns per intent category
// ---------------------------------------------------------------------------

interface CtaCategory {
  key: string;
  label: string;
  phrases: readonly string[];
}

const CTA_CATEGORIES: CtaCategory[] = [
  {
    key: 'informational',
    label: 'Informational',
    phrases: [
      'read more',
      'learn more',
      'discover',
      'find out',
      'explore',
      'see also',
      'related',
      'continue reading',
      'download guide',
      'subscribe for updates',
    ],
  },
  {
    key: 'transactional',
    label: 'Transactional',
    phrases: [
      'buy now',
      'add to cart',
      'order now',
      'shop now',
      'get started',
      'start free trial',
      'sign up',
      'book now',
      'reserve',
      'claim offer',
    ],
  },
  {
    key: 'commercial-investigation',
    label: 'Commercial',
    phrases: [
      'compare plans',
      'see pricing',
      'read review',
      'view comparison',
      'check availability',
      'get quote',
    ],
  },
  {
    key: 'navigational',
    label: 'Navigational',
    phrases: [
      'visit site',
      'go to',
      'access',
      'log in',
      'open',
      'launch',
    ],
  },
];

/**
 * Extract the visible text of clickable elements (<a> and <button>).
 * CTA phrases are only meaningful in clickable elements — matching them against
 * body prose flags proper nouns like "Open Graph" as navigational CTAs.
 */
function extractCtaText(html: string): string {
  const texts: string[] = [];
  const re = /<(a|button)\b[^>]*>([\s\S]{0,300}?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const inner = stripHtml(m[2]!).trim();
    if (inner.length > 0) texts.push(inner);
  }
  return texts.join('\n').toLowerCase();
}

/**
 * Find all CTA phrases from a category that appear in the text.
 */
function findCtaMatches(text: string, phrases: readonly string[]): string[] {
  const found: string[] = [];
  for (const phrase of phrases) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'i');
    if (re.test(text)) {
      found.push(phrase);
    }
  }
  return found;
}

/**
 * Check whether the CTAs found in the content align with the detected intent
 * of the focus keyphrase.
 *
 * - good (5): CTAs align with intent, no conflicting CTAs
 * - ok   (3): some CTAs align, some don't, or no CTAs found
 * - poor (1): CTAs contradict intent (e.g., "buy now" in informational content)
 */
export function checkIntentCtaAlignment(
  input: ContentAnalysisInput,
): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-cta-alignment',
      title: 'CTA-intent alignment',
      description:
        'No focus keyphrase set. Set one to analyze CTA-intent alignment.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase.trim());
  const keyphraseIntent = detected.primary;

  const ctaText = extractCtaText(content);

  // Find CTAs per category
  const ctaResults: Array<{
    key: string;
    label: string;
    matches: string[];
  }> = [];

  for (const category of CTA_CATEGORIES) {
    const matches = findCtaMatches(ctaText, category.phrases);
    ctaResults.push({
      key: category.key,
      label: category.label,
      matches,
    });
  }

  // Separate aligned vs conflicting CTAs
  const alignedCategory = ctaResults.find((c) => c.key === keyphraseIntent);
  const alignedCtas = alignedCategory?.matches ?? [];

  const conflictingCategories = ctaResults.filter(
    (c) => c.key !== keyphraseIntent && c.matches.length > 0,
  );

  const allConflictingCtas = conflictingCategories.flatMap((c) => c.matches);
  const totalCtasFound = alignedCtas.length + allConflictingCtas.length;

  // Get the keyphrase intent label
  const intentLabel =
    CTA_CATEGORIES.find((c) => c.key === keyphraseIntent)?.label ??
    keyphraseIntent;

  // No CTAs found at all
  if (totalCtasFound === 0) {
    return {
      id: 'intent-cta-alignment',
      title: 'CTA-intent alignment',
      description:
        `No CTA phrases found in link or button text. For ${intentLabel.toLowerCase()} intent, ` +
        `consider adding relevant CTAs such as: ${alignedCategory?.matches.length === 0 ? CTA_CATEGORIES.find((c) => c.key === keyphraseIntent)?.phrases.slice(0, 3).join(', ') ?? 'appropriate calls to action' : alignedCtas.join(', ')}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // Only conflicting CTAs, no aligned ones
  if (alignedCtas.length === 0 && allConflictingCtas.length > 0) {
    const conflictDetail = conflictingCategories
      .filter((c) => c.matches.length > 0)
      .map((c) => `${c.label}: "${c.matches.join('", "')}"`)
      .join('; ');

    return {
      id: 'intent-cta-alignment',
      title: 'CTA-intent alignment',
      description:
        `CTAs contradict the ${intentLabel.toLowerCase()} intent of the keyphrase. ` +
        `Found conflicting CTAs — ${conflictDetail}. ` +
        `Replace with ${intentLabel.toLowerCase()}-appropriate CTAs.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  // Both aligned and conflicting CTAs present
  if (alignedCtas.length > 0 && allConflictingCtas.length > 0) {
    const conflictDetail = conflictingCategories
      .filter((c) => c.matches.length > 0)
      .map((c) => `${c.label}: "${c.matches.join('", "')}"`)
      .join('; ');

    return {
      id: 'intent-cta-alignment',
      title: 'CTA-intent alignment',
      description:
        `Some CTAs align with ${intentLabel.toLowerCase()} intent ("${alignedCtas.join('", "')}"), ` +
        `but conflicting CTAs were also found — ${conflictDetail}. ` +
        'Consider removing CTAs that contradict the primary intent.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // All CTAs align with intent
  return {
    id: 'intent-cta-alignment',
    title: 'CTA-intent alignment',
    description:
      `CTAs align well with ${intentLabel.toLowerCase()} intent. ` +
      `Found matching CTAs: "${alignedCtas.join('", "')}". ` +
      'No conflicting CTAs detected.',
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
