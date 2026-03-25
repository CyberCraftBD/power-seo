// @power-seo/content-analysis — E-E-A-T: Editorial Review Indicators
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

// Editorial review patterns in content text
const EDITORIAL_PATTERNS: RegExp[] = [
  /\b(?:reviewed|fact[\s-]?checked|verified|edited|proofread)\s+by\b/gi,
  /\bmedically\s+reviewed\s+by\b/gi,
  /\bscientifically\s+reviewed\b/gi,
  /\blegally\s+reviewed\b/gi,
  /\bfinancially\s+reviewed\b/gi,
  /\btechnically\s+reviewed\b/gi,
  /\bpeer[\s-]?reviewed\b/gi,
  /\beditor(?:ial)?\s*:\s*[A-Z]/g,
  /\breviewer\s*:\s*[A-Z]/g,
  /\bfact[\s-]?checker\s*:\s*[A-Z]/g,
  /\beditorial\s+(?:team|board|review|oversight|standards?|guidelines?|policy|process)\b/gi,
  /\bcontent\s+review\s+(?:process|policy|team)\b/gi,
  /\bquality\s+(?:assurance|review|control)\b/gi,
  /\blast\s+(?:reviewed|updated|verified|checked)\s+(?:on\s+)?(?:\w+\s+\d{1,2},?\s+\d{4}|\d{4}[\-\/]\d{2}[\-\/]\d{2})\b/gi,
  /\breview\s+date\b/gi,
];

export function checkEditorialReview(input: ContentAnalysisInput): AnalysisResult {
  const { editorialReviewer, content } = input;
  const plainText = stripHtml(content || '');

  let score = 0;
  const signals: string[] = [];
  const gaps: string[] = [];

  // Check structured editorial reviewer data
  if (editorialReviewer) {
    if (editorialReviewer.name) {
      score += 2;
      signals.push(`reviewed by ${editorialReviewer.name}`);
    }
    if (editorialReviewer.credentials) {
      score += 2;
      signals.push(`reviewer credentials: ${editorialReviewer.credentials}`);
    }
    if (editorialReviewer.url) {
      score += 1;
      signals.push('reviewer profile linked');
    }
  } else {
    gaps.push('no editorial reviewer specified');
  }

  // Check for editorial patterns in content
  let patternMatches = 0;
  for (const pattern of EDITORIAL_PATTERNS) {
    const matches = plainText.match(pattern);
    if (matches) {
      patternMatches += matches.length;
    }
  }

  // Also check HTML for review metadata
  const reviewMetaPatterns = [
    /class\s*=\s*["'][^"']*(?:reviewed|fact-check|editor|reviewer)[^"']*["']/gi,
    /data-reviewed/gi,
    /itemtype\s*=\s*["'][^"']*ClaimReview/gi,
  ];

  for (const pattern of reviewMetaPatterns) {
    const matches = (content || '').match(pattern);
    if (matches) patternMatches += matches.length;
  }

  if (patternMatches > 0) {
    score += Math.min(3, patternMatches);
    signals.push(`${patternMatches} editorial indicator${patternMatches > 1 ? 's' : ''} in content`);
  }

  if (score >= 4) {
    return {
      id: 'eeat-editorial-review',
      title: 'Editorial review',
      description: `Strong editorial oversight: ${signals.join('; ')}. Third-party review is a key trustworthiness signal, especially for YMYL content.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (score >= 2) {
    if (!editorialReviewer) gaps.push('add structured editorialReviewer data (name, credentials, URL)');
    if (patternMatches === 0) gaps.push('add "Reviewed by" or "Fact-checked by" disclosure in content');
    return {
      id: 'eeat-editorial-review',
      title: 'Editorial review',
      description: `Partial editorial signals (${signals.join('; ')}). ${gaps.join('; ')}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-editorial-review',
    title: 'Editorial review',
    description: 'No editorial review indicators found. Add: reviewer name & credentials (editorialReviewer), "Reviewed by [Name]" in content, review date, and editorial policy link. This is critical for YMYL topics.',
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
