// @power-seo/content-analysis — E-E-A-T: YMYL Content Detection & Compliance
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';
import { DISCLAIMER_PATTERNS, detectYmylCategories, ymylCategoryKey } from './shared-ymyl.js';

export function checkYmylCompliance(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content).toLowerCase();

  // Detect YMYL categories (requires 2+ distinct terms or an explicit
  // YMYL content category; exact-token matched)
  const categories = detectYmylCategories(plainText, input.contentCategory);

  if (categories.length === 0) {
    return {
      id: 'eeat-ymyl-compliance',
      title: 'YMYL compliance',
      description: 'Content does not appear to be YMYL (Your Money or Your Life). Standard E-E-A-T requirements apply.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Check for required disclaimers
  const disclaimersFound: string[] = [];
  const disclaimersMissing: string[] = [];

  for (const category of categories) {
    const catKey = ymylCategoryKey(category);
    if (catKey && DISCLAIMER_PATTERNS[catKey]) {
      let found = false;
      for (const pattern of DISCLAIMER_PATTERNS[catKey]) {
        if (pattern.test(plainText)) {
          found = true;
          disclaimersFound.push(category);
          break;
        }
      }
      if (!found) {
        disclaimersMissing.push(category);
      }
    }
  }

  // Check for author credentials (critical for YMYL)
  const hasAuthorCredentials = !!(input.author?.credentials && input.author.credentials.length > 0);
  const hasEditorialReview = !!input.editorialReviewer;

  let score = 0;
  const signals: string[] = [];
  const gaps: string[] = [];

  if (disclaimersFound.length > 0) {
    score += 2;
    signals.push(`disclaimers present for ${disclaimersFound.join(', ')}`);
  }
  if (disclaimersMissing.length > 0) {
    gaps.push(`missing disclaimers for ${disclaimersMissing.join(', ')}`);
  }

  if (hasAuthorCredentials) {
    score += 2;
    signals.push('author has verifiable credentials');
  } else {
    gaps.push('YMYL content requires author with verifiable credentials');
  }

  if (hasEditorialReview) {
    score += 1;
    signals.push('editorial review present');
  } else {
    gaps.push('add editorial/fact-check review');
  }

  const ymylTypes = categories.join(', ');

  if (score >= 4) {
    return {
      id: 'eeat-ymyl-compliance',
      title: 'YMYL compliance',
      description: `YMYL content detected (${ymylTypes}). Good compliance: ${signals.join('; ')}. YMYL content is held to higher E-E-A-T standards by Google.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (score >= 2) {
    return {
      id: 'eeat-ymyl-compliance',
      title: 'YMYL compliance',
      description: `YMYL content detected (${ymylTypes}). Partial compliance: ${signals.join('; ')}. Gaps: ${gaps.join('; ')}. YMYL content requires strong E-E-A-T signals.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-ymyl-compliance',
    title: 'YMYL compliance',
    description: `YMYL content detected (${ymylTypes}) but lacks required trust signals. ${gaps.join('; ')}. YMYL content without proper disclaimers, credentials, and editorial review may be penalized in search rankings.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
