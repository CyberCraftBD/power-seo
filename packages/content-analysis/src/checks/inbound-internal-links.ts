// @power-seo/content-analysis — Inbound Internal Links Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkInboundInternalLinks(input: ContentAnalysisInput): AnalysisResult {
  const { inboundInternalLinkCount, isPillarContent } = input;

  if (inboundInternalLinkCount === undefined || inboundInternalLinkCount === null) {
    return {
      id: 'inbound-internal-links',
      title: 'Inbound internal links',
      description:
        'Inbound internal link count is not available. Provide this data to evaluate internal linking health.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const count = inboundInternalLinkCount;
  const pillar = isPillarContent === true;

  // --- Pillar Content Thresholds ---
  if (pillar) {
    if (count >= 5) {
      return {
        id: 'inbound-internal-links',
        title: 'Inbound internal links',
        description: `This pillar content has ${count} inbound internal link${count === 1 ? '' : 's'}. Pillar pages should be well-linked, and this meets the recommended minimum of 5.`,
        status: 'good',
        score: 5,
        maxScore: 5,
      };
    }

    if (count >= 3) {
      return {
        id: 'inbound-internal-links',
        title: 'Inbound internal links',
        description: `This pillar content has ${count} inbound internal link${count === 1 ? '' : 's'}. Pillar pages need strong internal linking — aim for at least 5 inbound links from related cluster content.`,
        status: 'ok',
        score: 3,
        maxScore: 5,
      };
    }

    if (count === 0) {
      return {
        id: 'inbound-internal-links',
        title: 'Inbound internal links',
        description:
          'This pillar content is orphaned — no other pages link to it. Pillar pages are critical hub pages and must have at least 5 inbound internal links from supporting cluster articles.',
        status: 'poor',
        score: 0,
        maxScore: 5,
      };
    }

    return {
      id: 'inbound-internal-links',
      title: 'Inbound internal links',
      description: `This pillar content only has ${count} inbound internal link${count === 1 ? '' : 's'}. Pillar pages need at least 5 — add links from related cluster content to strengthen the topic hub.`,
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  // --- Normal Content Thresholds ---
  if (count >= 3) {
    return {
      id: 'inbound-internal-links',
      title: 'Inbound internal links',
      description: `This page has ${count} inbound internal link${count === 1 ? '' : 's'}. Good internal linking helps search engines discover and rank your content.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (count >= 1) {
    return {
      id: 'inbound-internal-links',
      title: 'Inbound internal links',
      description: `This page has ${count} inbound internal link${count === 1 ? '' : 's'}. Add links from at least ${3 - count} more related page${3 - count === 1 ? '' : 's'} to improve discoverability and distribute link equity.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // count === 0
  return {
    id: 'inbound-internal-links',
    title: 'Inbound internal links',
    description:
      'This is orphaned content — no other pages on your site link to it. Search engines may struggle to discover and rank it. Add internal links from at least 3 related pages.',
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
