// @power-seo/content-analysis — E-E-A-T: Conflict of Interest & Disclosure
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, countDistinctMatches } from '@power-seo/core';

// Disclosure patterns in content
const DISCLOSURE_PATTERNS: RegExp[] = [
  /\baffiliate\s+(?:link|disclosure|commission)\b/gi,
  /\bthis\s+(?:post|article|page|content)\s+(?:contains?|includes?|may\s+contain)\s+affiliate/gi,
  /\bwe?\s+(?:may\s+)?(?:earn|receive)\s+(?:a\s+)?commission/gi,
  /\bcompensated\s+(?:for|by)\b/gi,
  /\bsponsored\s+(?:by|post|content|article)\b/gi,
  /\bpaid\s+(?:partnership|promotion|collaboration)\b/gi,
  /\bin\s+(?:partnership|collaboration)\s+with\b/gi,
  /\bdisclosure\s*:/gi,
  /\btransparency\s+(?:notice|disclosure|statement)\b/gi,
  /\bfull\s+disclosure\b/gi,
  /\bmaterial\s+connection\b/gi,
  /\bFTC\s+(?:disclosure|guidelines?|compliance)\b/gi,
  /\bad\b|\badvertisement\b|\b#ad\b|\b#sponsored\b/gi,
  /\bgifted\s+(?:product|item)\b/gi,
  /\bprovided\s+(?:for\s+review|by\s+the\s+(?:company|brand))\b/gi,
  /\bno\s+(?:financial|monetary)\s+(?:compensation|incentive)\b/gi,
  /\ball\s+opinions?\s+(?:are\s+)?(?:my|our)\s+own\b/gi,
];

// Affiliate link patterns
const AFFILIATE_LINK_PATTERNS: RegExp[] = [
  /[?&](?:ref|tag|affiliate|aff|partner|tracking|utm_source|click_id|subid|hop)=/gi,
  /(?:amzn\.to|bit\.ly|awin1\.com|shareasale|clickbank|jvzoo|commission\s*junction|impact\.com|partnerstack|referralcandy)/gi,
  /\/ref=/gi,
  /affiliate/gi,
];

export function checkConflictDisclosure(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content);

  // Detect affiliate links
  const linkPattern = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
  const allLinks: string[] = [];
  let affiliateLinkCount = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(content)) !== null) {
    const href = match[1] || '';
    allLinks.push(href);
    if (AFFILIATE_LINK_PATTERNS.some((p) => p.test(href))) {
      affiliateLinkCount++;
    }
  }

  const totalLinks = allLinks.length;
  const affiliateRatio = totalLinks > 0 ? affiliateLinkCount / totalLinks : 0;

  // Check for disclosure text (overlapping hits across patterns count once)
  const disclosureCount = countDistinctMatches(plainText, DISCLOSURE_PATTERNS);

  // Check explicit flags from input
  const isSponsored = input.isSponsored === true;
  const hasAffiliateLinks = input.hasAffiliateLinks === true || affiliateLinkCount > 0;

  // If no commercial interests detected
  if (!isSponsored && !hasAffiliateLinks && affiliateLinkCount === 0) {
    if (disclosureCount > 0) {
      return {
        id: 'eeat-conflict-disclosure',
        title: 'Conflict disclosure',
        description:
          'Disclosure present even without commercial interests. Proactive transparency builds reader trust.',
        status: 'good',
        score: 5,
        maxScore: 5,
      };
    }
    return {
      id: 'eeat-conflict-disclosure',
      title: 'Conflict disclosure',
      description:
        'No commercial interests detected (no affiliate links, not sponsored). No disclosure needed.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Commercial interests exist — check compliance
  const issues: string[] = [];
  const positives: string[] = [];

  if (disclosureCount > 0) {
    positives.push('disclosure statement present');
  } else {
    issues.push('no disclosure/transparency statement found');
  }

  if (affiliateLinkCount > 0) {
    if (affiliateRatio > 0.5) {
      issues.push(`${Math.round(affiliateRatio * 100)}% of links are affiliate — excessive`);
    } else {
      positives.push(
        `${affiliateLinkCount} affiliate link${affiliateLinkCount > 1 ? 's' : ''} (${Math.round(affiliateRatio * 100)}% of total)`,
      );
    }
  }

  if (isSponsored) {
    if (disclosureCount > 0) {
      positives.push('sponsored content is disclosed');
    } else {
      issues.push('sponsored content not disclosed — FTC violation risk');
    }
  }

  if (disclosureCount > 0 && issues.length === 0) {
    return {
      id: 'eeat-conflict-disclosure',
      title: 'Conflict disclosure',
      description: `Good transparency: ${positives.join('; ')}. Proper disclosure builds reader trust and ensures regulatory compliance.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (disclosureCount > 0 && issues.length <= 1) {
    return {
      id: 'eeat-conflict-disclosure',
      title: 'Conflict disclosure',
      description: `Partial disclosure (${positives.join('; ')}). Issues: ${issues.join('; ')}. Ensure all material connections are transparently disclosed.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-conflict-disclosure',
    title: 'Conflict disclosure',
    description: `Commercial interests detected but not properly disclosed. Issues: ${issues.join('; ')}. Add a clear disclosure statement ("This post contains affiliate links", "Sponsored by...") near the top of the content. FTC requires transparent disclosure of material connections.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
