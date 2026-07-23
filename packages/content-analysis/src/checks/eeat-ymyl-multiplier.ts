// @power-seo/content-analysis — E-E-A-T: YMYL Multiplier
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';
import { DISCLAIMER_PATTERNS, detectYmylCategories, ymylCategoryKey } from './shared-ymyl.js';

/** A date only earns freshness credit if it is valid and not in the future. */
function isCreditableDate(value: string | Date | undefined): boolean {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now();
}

export function checkYmylMultiplier(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content).toLowerCase();

  // Detect YMYL categories
  const ymylCategories = detectYmylCategories(plainText, input.contentCategory);

  if (ymylCategories.length === 0) {
    return {
      id: 'eeat-ymyl-multiplier',
      title: 'YMYL trust requirements',
      description:
        'Content is not YMYL (Your Money or Your Life). Standard E-E-A-T requirements apply; the stricter YMYL trust bar does not apply.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const ymylTypes = ymylCategories.join(', ');

  // Assess E-E-A-T signal strength under YMYL scrutiny
  let eeatScore = 0;
  const signals: string[] = [];
  const gaps: string[] = [];

  // 1. Author credentials (critical for YMYL)
  if (input.author?.credentials && input.author.credentials.length > 0) {
    eeatScore += 2;
    const credNames = input.author.credentials.map((c) => c.name);
    signals.push(`author credentials: ${credNames.slice(0, 3).join(', ')}`);
  } else {
    gaps.push('YMYL content requires author with verifiable credentials');
  }

  // 2. Editorial reviewer (fact-checking)
  if (input.editorialReviewer) {
    eeatScore += 2;
    const reviewerInfo = input.editorialReviewer.name || 'unnamed';
    signals.push(`editorial reviewer: ${reviewerInfo}`);
    if (input.editorialReviewer.credentials) {
      eeatScore += 1;
      signals.push(`reviewer credentials: ${input.editorialReviewer.credentials}`);
    }
  } else {
    gaps.push('add editorial/fact-check reviewer for YMYL content');
  }

  // 3. Category-appropriate disclaimers
  let hasDisclaimer = false;
  for (const category of ymylCategories) {
    const catKey = ymylCategoryKey(category);
    if (catKey && DISCLAIMER_PATTERNS[catKey]) {
      for (const pattern of DISCLAIMER_PATTERNS[catKey]) {
        if (pattern.test(plainText)) {
          hasDisclaimer = true;
          break;
        }
      }
    }
    if (hasDisclaimer) break;
  }

  if (hasDisclaimer) {
    eeatScore += 1;
    signals.push('appropriate disclaimers present');
  } else {
    gaps.push(
      'add category-appropriate disclaimers (e.g., "consult a professional", "for informational purposes only")',
    );
  }

  // 4. HTTPS (baseline trust for YMYL)
  const url = input.canonicalUrl || input.siteUrl || '';
  if (url.startsWith('https://')) {
    eeatScore += 1;
    signals.push('HTTPS verified');
  } else {
    gaps.push('YMYL content must be served over HTTPS');
  }

  // 5. Publish/modified dates (transparency) — future dates earn no credit
  if (isCreditableDate(input.publishDate)) {
    eeatScore += 1;
    signals.push('publish date provided');
  } else {
    gaps.push('add publish date for content freshness transparency');
  }

  // 6. Author bio and expertise areas
  if (
    input.author?.bio &&
    input.author.bio.trim().length >= 20 &&
    input.author.knowsAbout &&
    input.author.knowsAbout.length > 0
  ) {
    eeatScore += 1;
    signals.push('author bio with expertise areas');
  }

  // 7. Correction policy (accountability for YMYL)
  if (input.correctionPolicyUrl) {
    eeatScore += 1;
    signals.push('correction policy linked');
  }

  if (eeatScore >= 6) {
    return {
      id: 'eeat-ymyl-multiplier',
      title: 'YMYL trust requirements',
      description: `YMYL content detected (${ymylTypes}) with strong E-E-A-T compliance. ${signals.join('; ')}. Content meets the higher trust bar Google applies to YMYL topics.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (eeatScore >= 3) {
    return {
      id: 'eeat-ymyl-multiplier',
      title: 'YMYL trust requirements',
      description: `YMYL content detected (${ymylTypes}) with moderate E-E-A-T signals. Present: ${signals.join('; ')}. Gaps: ${gaps.join('; ')}. YMYL topics face stricter quality evaluation.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-ymyl-multiplier',
    title: 'YMYL multiplier',
    description: `YMYL content detected (${ymylTypes}) with insufficient E-E-A-T signals. Gaps: ${gaps.join('; ')}. YMYL content without strong author credentials, editorial review, disclaimers, and trust signals faces significant ranking penalties.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
