// @power-seo/content-analysis — E-E-A-T: Correction & Update Policy
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, countDistinctMatches } from '@power-seo/core';

// Update/correction indicators in content
const UPDATE_PATTERNS: RegExp[] = [
  /\b(?:last\s+)?updated?\s*(?:on|:)\s*(?:\w+\s+\d{1,2},?\s+\d{4}|\d{4}[-/]\d{2}[-/]\d{2})/gi,
  /\b(?:originally\s+)?published\s*(?:on|:)\s*(?:\w+\s+\d{1,2},?\s+\d{4}|\d{4}[-/]\d{2}[-/]\d{2})/gi,
  /\beditor['’]?s?\s+note\b/gi,
  /\bupdate\s*(?:\d{4}[-/]\d{2}|\w+\s+\d{4})\s*:/gi,
  /\bcorrection\s*:/gi,
  /\berrata\b/gi,
  /\b\[updated?\]/gi,
  /\bthis\s+(?:article|post|guide|content)\s+(?:was\s+)?(?:last\s+)?updated/gi,
  /\bchangelog\b/gi,
  /\bversion\s+history\b/gi,
  /\brevision\s+history\b/gi,
  /\bupdate\s+history\b/gi,
  /\bcorrections?\s+policy\b/gi,
  /\beditorial\s+(?:policy|standards|guidelines)\b/gi,
];

export function checkCorrectionPolicy(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content);

  let score = 0;
  const signals: string[] = [];
  const gaps: string[] = [];

  // Check for publish and modified dates from input
  if (input.publishDate) {
    score += 1;
    const pubDate =
      input.publishDate instanceof Date
        ? input.publishDate.toISOString().split('T')[0]
        : String(input.publishDate);
    signals.push(`publish date: ${pubDate}`);
  } else {
    gaps.push('no publish date provided');
  }

  if (input.modifiedDate) {
    score += 2;
    const modDate =
      input.modifiedDate instanceof Date
        ? input.modifiedDate.toISOString().split('T')[0]
        : String(input.modifiedDate);
    signals.push(`last modified: ${modDate}`);

    // Check if modified date is after publish date
    if (input.publishDate) {
      const pub = new Date(input.publishDate);
      const mod = new Date(input.modifiedDate);
      if (mod > pub) {
        signals.push('content has been updated since publication');
      }
    }
  } else {
    gaps.push('no modified date provided');
  }

  // Check for correction policy URL
  if (input.correctionPolicyUrl) {
    score += 1;
    signals.push('correction policy URL provided');
  }

  // Check for update/correction patterns in content
  // (overlapping hits across patterns count once)
  const updatePatternCount = countDistinctMatches(plainText, UPDATE_PATTERNS);

  if (updatePatternCount > 0) {
    score += Math.min(2, updatePatternCount);
    signals.push(
      `${updatePatternCount} update/correction indicator${updatePatternCount > 1 ? 's' : ''} in content`,
    );
  } else {
    gaps.push('no update notices or correction markers in content');
  }

  // Check HTML for structured date metadata
  const dateMetaPatterns = [
    /datetime\s*=\s*["']\d{4}/gi,
    /dateModified/gi,
    /datePublished/gi,
    /class\s*=\s*["'][^"']*(?:updated|modified|published)[\s-]?date[^"']*["']/gi,
  ];

  for (const pattern of dateMetaPatterns) {
    if (pattern.test(content)) {
      score += 1;
      signals.push('structured date metadata found');
      break;
    }
  }

  if (score >= 4) {
    return {
      id: 'eeat-correction-policy',
      title: 'Correction & update policy',
      description: `Strong transparency: ${signals.join('; ')}. Date tracking and correction policies signal content maintenance commitment.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (score >= 2) {
    return {
      id: 'eeat-correction-policy',
      title: 'Correction & update policy',
      description: `Partial transparency (${signals.join('; ')}). Add: ${gaps.join('; ')}. Showing content is actively maintained builds trust.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-correction-policy',
    title: 'Correction & update policy',
    description:
      'No correction/update policy signals found. Add: publish date, last updated date, "[Updated March 2026]" notices, editor\'s notes for corrections, and link to editorial/correction policy.',
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
