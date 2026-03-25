// @power-seo/content-analysis — User Journey Funnel Position Check
// ----------------------------------------------------------------------------
// Maps detected intent to a buyer journey stage and checks whether internal
// links guide users to the NEXT funnel stage.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Funnel stage mapping
// ---------------------------------------------------------------------------

interface FunnelStage {
  name: string;
  label: string;
  nextStage: string;
  nextStageAnchors: readonly string[];
}

const FUNNEL_STAGES: Record<string, FunnelStage> = {
  informational: {
    name: 'Awareness',
    label: 'awareness',
    nextStage: 'Consideration',
    nextStageAnchors: ['compare', 'review', 'best', 'see options', 'which one'],
  },
  'commercial-investigation': {
    name: 'Consideration',
    label: 'consideration',
    nextStage: 'Decision',
    nextStageAnchors: ['buy', 'pricing', 'get started', 'order', 'try'],
  },
  transactional: {
    name: 'Decision',
    label: 'decision',
    nextStage: 'Retention',
    nextStageAnchors: ['support', 'help', 'guide', 'getting started', 'dashboard'],
  },
  navigational: {
    name: 'Retention/Loyalty',
    label: 'retention/loyalty',
    nextStage: 'none',
    nextStageAnchors: [],
  },
};

// ---------------------------------------------------------------------------
// Internal link extraction
// ---------------------------------------------------------------------------

interface ExtractedLink {
  href: string;
  anchorText: string;
}

function extractInternalLinks(
  content: string,
  siteUrl: string | undefined,
): ExtractedLink[] {
  const links: ExtractedLink[] = [];
  // Match <a> tags with href and capture anchor text
  const linkRegex = /<a\s[^>]*href\s*=\s*["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    const anchorRaw = match[2];
    if (href === undefined || anchorRaw === undefined) continue;

    const isExternal = /^https?:\/\//i.test(href);
    const matchesSiteUrl =
      siteUrl !== undefined &&
      siteUrl.length > 0 &&
      href.toLowerCase().startsWith(siteUrl.toLowerCase());

    // Internal link: either relative (no http) or matches siteUrl
    if (!isExternal || matchesSiteUrl) {
      // Strip HTML from anchor text
      const anchorText = anchorRaw.replace(/<[^>]*>/g, '').trim();
      links.push({ href, anchorText });
    }
  }

  return links;
}

// ---------------------------------------------------------------------------
// Check for next-stage anchor text
// ---------------------------------------------------------------------------

function hasNextStageLinks(
  internalLinks: ExtractedLink[],
  nextStageAnchors: readonly string[],
): boolean {
  if (nextStageAnchors.length === 0) return false;

  for (const link of internalLinks) {
    const anchorLower = link.anchorText.toLowerCase();
    for (const anchor of nextStageAnchors) {
      if (anchorLower.includes(anchor)) {
        return true;
      }
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentFunnelPosition(
  input: ContentAnalysisInput,
): AnalysisResult {
  const id = 'intent-funnel-position';
  const title = 'User journey funnel position';

  if (!input.focusKeyphrase || input.focusKeyphrase.trim().length === 0) {
    return {
      id,
      title,
      description: 'No focus keyphrase set. Set one to evaluate funnel position.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(input.focusKeyphrase);
  const stage = FUNNEL_STAGES[detected.primary];

  // Cannot determine funnel position
  if (!stage) {
    return {
      id,
      title,
      description:
        `Cannot determine funnel position for intent "${detected.primary}". ` +
        `Ensure the keyphrase clearly signals a search intent type.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  const internalLinks = extractInternalLinks(input.content, input.siteUrl);

  // Navigational (retention) is the final stage — no "next stage" to link to
  if (detected.primary === 'navigational') {
    return {
      id,
      title,
      description:
        `Content maps to the ${stage.name} stage (final funnel stage). ` +
        `This is the end of the buyer journey — focus on user satisfaction and re-engagement.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  const foundNextStageLinks = hasNextStageLinks(
    internalLinks,
    stage.nextStageAnchors,
  );

  // good (5): funnel position identified AND next-stage links present
  if (foundNextStageLinks) {
    return {
      id,
      title,
      description:
        `Content maps to the ${stage.name} stage and includes links guiding users to the ${stage.nextStage} stage. ` +
        `This supports a smooth buyer journey progression.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): funnel position identified but no next-stage links (dead-end content)
  return {
    id,
    title,
    description:
      `Content maps to the ${stage.name} stage but lacks internal links to ${stage.nextStage} content. ` +
      `This creates a dead-end in the buyer journey. Add links with anchor text like ` +
      `"${stage.nextStageAnchors.join('", "')}" to guide users to the next stage.`,
    status: 'ok',
    score: 3,
    maxScore: 5,
  };
}
