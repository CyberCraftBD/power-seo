// @power-seo/content-analysis — Engagement Signal Optimization Check
// ----------------------------------------------------------------------------
// Checks for elements that reduce pogo-sticking (user bouncing back to search
// results) by evaluating 7 engagement signals in the content.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Signal checkers
// ---------------------------------------------------------------------------

interface EngagementSignal {
  name: string;
  present: boolean;
}

function checkTableOfContents(content: string): boolean {
  const contentLower = content.toLowerCase();

  // Check for explicit TOC text
  const hasTocText = /\b(?:table of contents|in this article|jump to)\b/i.test(
    contentLower,
  );
  if (hasTocText) return true;

  // Check for "contents" as a heading
  if (/<h[1-6][^>]*>\s*contents\s*<\/h[1-6]>/i.test(content)) return true;

  // Check for an early list of anchor links (#section style)
  // Look for 3+ anchor links with # hrefs in the first 20% of content
  const contentLength = content.length;
  const earlySection = content.slice(0, Math.floor(contentLength * 0.2));
  const anchorLinkMatches = earlySection.match(/href\s*=\s*["']#[^"']+["']/gi);
  if (anchorLinkMatches && anchorLinkMatches.length >= 3) return true;

  return false;
}

function checkSubheadings(content: string): boolean {
  const contentLower = content.toLowerCase();
  const h2Count = contentLower.split('<h2').length - 1;
  const h3Count = contentLower.split('<h3').length - 1;
  return h2Count + h3Count >= 3;
}

function checkShortParagraphs(content: string): boolean {
  // Split by </p> tags or double newlines to get paragraphs
  let paragraphs: string[];

  if (content.includes('</p>')) {
    paragraphs = content
      .split(/<\/p>/i)
      .map((p) => stripHtml(p).trim())
      .filter((p) => p.length > 0);
  } else {
    paragraphs = content
      .split(/\n\s*\n/)
      .map((p) => stripHtml(p).trim())
      .filter((p) => p.length > 0);
  }

  if (paragraphs.length === 0) return true;

  let totalWords = 0;
  for (const para of paragraphs) {
    const words = getWords(para);
    totalWords += words.length;
  }

  const avgLength = totalWords / paragraphs.length;
  return avgLength <= 150;
}

function checkLists(content: string): boolean {
  const contentLower = content.toLowerCase();
  return contentLower.includes('<ul') || contentLower.includes('<ol');
}

function checkBoldEmphasis(content: string): boolean {
  const contentLower = content.toLowerCase();
  return (
    contentLower.includes('<strong') ||
    contentLower.includes('<b>') ||
    contentLower.includes('<b ') ||
    contentLower.includes('<em')
  );
}

function checkMedia(content: string): boolean {
  const contentLower = content.toLowerCase();
  return (
    contentLower.includes('<img') ||
    contentLower.includes('<video') ||
    contentLower.includes('<iframe')
  );
}

function checkAnswerImmediacy(
  content: string,
  focusKeyphrase: string,
  isInformational: boolean,
): boolean {
  if (!isInformational) return false;

  const plainText = stripHtml(content);
  const words = getWords(plainText);
  const first100 = words.slice(0, 100).join(' ').toLowerCase();

  // Check if any keyphrase words appear in the first 100 words
  const keyphraseWords = getWords(focusKeyphrase.toLowerCase());
  if (keyphraseWords.length === 0) return false;

  let foundCount = 0;
  for (const kw of keyphraseWords) {
    if (first100.includes(kw)) {
      foundCount++;
    }
  }

  // At least half the keyphrase words should appear early
  return foundCount >= Math.ceil(keyphraseWords.length / 2);
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentEngagementSignals(
  input: ContentAnalysisInput,
): AnalysisResult {
  const id = 'intent-engagement-signals';
  const title = 'Engagement signal optimization';

  if (!input.focusKeyphrase || input.focusKeyphrase.trim().length === 0) {
    return {
      id,
      title,
      description:
        'No focus keyphrase set. Set one to evaluate engagement signals.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const detected = detectIntent(input.focusKeyphrase);
  const isInformational = detected.primary === 'informational';

  const signals: EngagementSignal[] = [
    {
      name: 'Table of contents',
      present: checkTableOfContents(input.content),
    },
    {
      name: 'Scannable subheadings (3+)',
      present: checkSubheadings(input.content),
    },
    {
      name: 'Short paragraphs (avg <= 150 words)',
      present: checkShortParagraphs(input.content),
    },
    {
      name: 'Lists (ul/ol)',
      present: checkLists(input.content),
    },
    {
      name: 'Bold/emphasis highlights',
      present: checkBoldEmphasis(input.content),
    },
    {
      name: 'Media (images/video)',
      present: checkMedia(input.content),
    },
    {
      name: 'Answer immediacy',
      present: checkAnswerImmediacy(
        input.content,
        input.focusKeyphrase,
        isInformational,
      ),
    },
  ];

  const presentSignals = signals.filter((s) => s.present);
  const missingSignals = signals.filter((s) => !s.present);
  const presentCount = presentSignals.length;

  const presentList = presentSignals.map((s) => s.name).join(', ');
  const missingList = missingSignals.map((s) => s.name).join(', ');

  // good (5): 5+ elements
  if (presentCount >= 5) {
    return {
      id,
      title,
      description:
        `Excellent engagement optimization (${presentCount}/7 signals). ` +
        `Present: ${presentList}.` +
        (missingSignals.length > 0
          ? ` Consider also adding: ${missingList}.`
          : ''),
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): 3-4 elements
  if (presentCount >= 3) {
    return {
      id,
      title,
      description:
        `Acceptable engagement optimization (${presentCount}/7 signals). ` +
        `Present: ${presentList}. Missing: ${missingList}. ` +
        `Add more engagement elements to reduce pogo-sticking.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (1): 1-2 elements
  if (presentCount >= 1) {
    return {
      id,
      title,
      description:
        `Low engagement optimization (${presentCount}/7 signals). ` +
        `Present: ${presentList}. Missing: ${missingList}. ` +
        `Users are likely to bounce back to search results.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  // poor (0): 0 elements — high pogo-stick risk
  return {
    id,
    title,
    description:
      `No engagement signals found (0/7). Missing: ${missingList}. ` +
      `High pogo-stick risk — users will likely return to search results immediately.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
