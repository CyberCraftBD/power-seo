// @power-seo/content-analysis — E-E-A-T: Privacy & Safety Signals
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, countDistinctMatches } from '@power-seo/core';

// Privacy/safety mentions in content
const PRIVACY_PATTERNS: RegExp[] = [
  /\bprivacy\s+policy\b/gi,
  /\bterms\s+(?:of\s+(?:service|use)|and\s+conditions)\b/gi,
  /\bcookie\s+(?:policy|consent|notice)\b/gi,
  /\bdata\s+(?:protection|privacy|handling|processing)\b/gi,
  /\bGDPR\b/g,
  /\bCCPA\b/g,
  /\bSOC\s+2\b/gi,
  /\bISO\s+27001\b/gi,
  /\bcompliance\b/gi,
  /\bencrypt(?:ed|ion)\b/gi,
  /\bsecure(?:ly|d)?\b/gi,
  /\bSSL\b/g,
  /\bTLS\b/g,
  /\btwo[\s-]?factor\s+auth/gi,
  /\b2FA\b/g,
  /\bMFA\b/g,
];

export function checkPrivacySafety(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content);

  let score = 0;
  const signals: string[] = [];
  const gaps: string[] = [];

  // Check HTTPS in canonical URL
  if (input.canonicalUrl) {
    if (input.canonicalUrl.startsWith('https://')) {
      score += 2;
      signals.push('HTTPS canonical URL');
    } else if (input.canonicalUrl.startsWith('http://')) {
      gaps.push('canonical URL uses HTTP instead of HTTPS');
    }
  } else if (input.siteUrl) {
    if (input.siteUrl.startsWith('https://')) {
      score += 2;
      signals.push('HTTPS site URL');
    } else {
      gaps.push('site URL uses HTTP instead of HTTPS');
    }
  } else {
    gaps.push('no canonical URL to verify HTTPS');
  }

  // Check privacy policy URL from input
  if (input.privacyPolicyUrl) {
    score += 1;
    signals.push('privacy policy URL provided');
  } else {
    gaps.push('no privacy policy URL');
  }

  // Check for privacy/safety mentions in content (overlapping hits count once)
  const privacyMentionCount = countDistinctMatches(plainText, PRIVACY_PATTERNS);

  if (privacyMentionCount > 0) {
    score += 1;
    signals.push(
      `${privacyMentionCount} privacy/security reference${privacyMentionCount > 1 ? 's' : ''} in content`,
    );
  }

  // Check for privacy-related links in HTML
  const privacyLinkPatterns = [
    /href\s*=\s*["'][^"']*privac[^"']*["']/gi,
    /href\s*=\s*["'][^"']*terms[^"']*["']/gi,
    /href\s*=\s*["'][^"']*cookie[^"']*["']/gi,
    /href\s*=\s*["'][^"']*gdpr[^"']*["']/gi,
    /href\s*=\s*["'][^"']*legal[^"']*["']/gi,
  ];

  // A single href can match several patterns — count each link once
  const privacyLinks = countDistinctMatches(content, privacyLinkPatterns);

  if (privacyLinks > 0) {
    score += 1;
    signals.push(`${privacyLinks} privacy/legal link${privacyLinks > 1 ? 's' : ''} found`);
  }

  if (score >= 3) {
    return {
      id: 'eeat-privacy-safety',
      title: 'Privacy & safety',
      description: `Good trust signals: ${signals.join('; ')}. HTTPS, privacy policies, and security references build user trust.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (score >= 1) {
    return {
      id: 'eeat-privacy-safety',
      title: 'Privacy & safety',
      description: `Partial trust signals (${signals.join('; ')}). Gaps: ${gaps.join('; ')}. Ensure HTTPS, link to privacy policy, and reference data handling practices.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-privacy-safety',
    title: 'Privacy & safety',
    description: `No privacy/safety signals found. ${gaps.join('; ')}. Use HTTPS, link to privacy policy and terms of service, and reference data protection when handling user data.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
