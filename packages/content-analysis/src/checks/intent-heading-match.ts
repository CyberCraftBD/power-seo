// @power-seo/content-analysis — Heading Structure-Intent Match Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Intent-specific heading language patterns
// ---------------------------------------------------------------------------

const HEADING_SIGNALS: Record<string, readonly string[]> = {
  informational: [
    'what',
    'how',
    'why',
    'when',
    'step',
    'tip',
    'example',
    'guide',
    'overview',
    'introduction',
    'basics',
    'definition',
    'explained',
    'understanding',
    'learn',
    'tutorial',
    'walkthrough',
    'faq',
  ],
  transactional: [
    'price',
    'pricing',
    'features',
    'specs',
    'specifications',
    'order',
    'buy',
    'shipping',
    'delivery',
    'payment',
    'checkout',
    'subscribe',
    'plan',
    'plans',
    'package',
    'packages',
    'cost',
    'deal',
    'offer',
  ],
  'commercial-investigation': [
    'best',
    'top',
    'pros',
    'cons',
    'review',
    'comparison',
    'alternative',
    'vs',
    'versus',
    'compared',
    'advantages',
    'disadvantages',
    'rating',
    'verdict',
    'winner',
    'runner-up',
    'recommendation',
    'pick',
  ],
  navigational: [
    'contact',
    'support',
    'about',
    'login',
    'sign in',
    'account',
    'dashboard',
    'help',
    'getting started',
    'resources',
    'documentation',
  ],
};

// ---------------------------------------------------------------------------
// Heading extraction
// ---------------------------------------------------------------------------

function extractHeadings(html: string): string[] {
  const headings: string[] = [];
  const regex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const rawContent = match[1];
    if (rawContent !== undefined) {
      const cleaned = stripHtml(rawContent).trim();
      if (cleaned.length > 0) {
        headings.push(cleaned);
      }
    }
  }

  return headings;
}

// ---------------------------------------------------------------------------
// Check if a heading contains intent-aligned language
// ---------------------------------------------------------------------------

function isHeadingAligned(heading: string, signals: readonly string[]): boolean {
  const lower = heading.toLowerCase();
  for (const signal of signals) {
    const escaped = signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|\\b)${escaped}(?:\\b|$)`, 'i');
    if (re.test(lower)) {
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentHeadingMatch(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-heading-match',
      title: 'Heading structure-intent match',
      description: 'No focus keyphrase set. Set one to evaluate heading-intent alignment.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(focusKeyphrase);
  const intentLabel =
    detected.primary === 'commercial-investigation' ? 'commercial' : detected.primary;
  const signals = HEADING_SIGNALS[detected.primary] ?? HEADING_SIGNALS['informational']!;

  const headings = extractHeadings(content);

  if (headings.length === 0) {
    return {
      id: 'intent-heading-match',
      title: 'Heading structure-intent match',
      description: `No H2 or H3 headings found. Add headings with ${intentLabel} intent language to improve content structure and alignment.`,
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  let alignedCount = 0;
  for (const heading of headings) {
    if (isHeadingAligned(heading, signals)) {
      alignedCount++;
    }
  }

  const alignedPct = (alignedCount / headings.length) * 100;

  // good (5): >= 30% of headings aligned
  if (alignedPct >= 30) {
    return {
      id: 'intent-heading-match',
      title: 'Heading structure-intent match',
      description: `${alignedCount} of ${headings.length} headings (${Math.round(alignedPct)}%) contain ${intentLabel} intent language. Heading structure aligns well with the detected intent.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): 15-29% aligned
  if (alignedPct >= 15) {
    return {
      id: 'intent-heading-match',
      title: 'Heading structure-intent match',
      description: `${alignedCount} of ${headings.length} headings (${Math.round(alignedPct)}%) contain ${intentLabel} intent language. Add more ${intentLabel}-aligned language to your H2/H3 headings.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (0): < 15% aligned
  return {
    id: 'intent-heading-match',
    title: 'Heading structure-intent match',
    description: `Only ${alignedCount} of ${headings.length} heading${headings.length === 1 ? '' : 's'} (${Math.round(alignedPct)}%) contain ${intentLabel} intent language. Restructure headings to reflect the ${intentLabel} intent of the keyphrase.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
