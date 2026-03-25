// @power-seo/content-analysis — Keyphrase Even Distribution Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

const MIN_WORDS_FOR_ANALYSIS = 100;
const MIN_PARAGRAPHS_FOR_ANALYSIS = 4;

/**
 * Split HTML content into paragraphs using block-level boundaries.
 */
function splitParagraphs(html: string): string[] {
  const blocks = html
    .split(/<\/p>|<\/div>|<\/li>|<\/blockquote>|<br\s*\/?>\s*<br\s*\/?>/gi)
    .map((block) => stripHtml(block).trim())
    .filter((block) => block.length > 0);

  if (blocks.length === 0) {
    return stripHtml(html)
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  return blocks;
}

/**
 * Check whether a text segment contains the keyphrase (case-insensitive).
 */
function containsKeyphrase(text: string, keyphrase: string): boolean {
  return text.toLowerCase().includes(keyphrase.toLowerCase());
}

/**
 * Divide an array into N roughly equal segments.
 */
function divideIntoSegments<T>(arr: T[], segmentCount: number): T[][] {
  const segments: T[][] = [];
  const segmentSize = Math.max(1, Math.ceil(arr.length / segmentCount));
  for (let i = 0; i < segmentCount; i++) {
    const start = i * segmentSize;
    const end = Math.min(start + segmentSize, arr.length);
    if (start < arr.length) {
      segments.push(arr.slice(start, end));
    }
  }
  return segments;
}

/**
 * Check that the focus keyphrase is evenly distributed throughout the content.
 *
 * Splits the content into 4 quarters by paragraph count and checks whether
 * the keyphrase appears in each quarter. Also verifies the keyphrase appears
 * in the first 10% (hook/introduction) and last 10% (conclusion) of the text.
 */
export function checkKeyphraseEvenDistribution(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'keyphrase-even-distribution',
      title: 'Keyphrase distribution across content',
      description: 'No focus keyphrase set. Set one to analyze keyphrase distribution.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const words = getWords(content);
  if (words.length < MIN_WORDS_FOR_ANALYSIS) {
    return {
      id: 'keyphrase-even-distribution',
      title: 'Keyphrase distribution across content',
      description:
        `Content is only ${words.length} words. At least ${MIN_WORDS_FOR_ANALYSIS} words are needed ` +
        'to meaningfully analyze keyphrase distribution.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const paragraphs = splitParagraphs(content);
  if (paragraphs.length < MIN_PARAGRAPHS_FOR_ANALYSIS) {
    return {
      id: 'keyphrase-even-distribution',
      title: 'Keyphrase distribution across content',
      description:
        `Only ${paragraphs.length} paragraph(s) found. At least ${MIN_PARAGRAPHS_FOR_ANALYSIS} paragraphs ` +
        'are needed to analyze distribution across content quarters.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const kp = focusKeyphrase.trim();

  // Divide paragraphs into 4 quarters
  const quarters = divideIntoSegments(paragraphs, 4);
  const quarterLabels = ['first quarter', 'second quarter', 'third quarter', 'fourth quarter'];
  const missingQuarters: string[] = [];

  for (let i = 0; i < quarters.length; i++) {
    const quarterText = quarters[i]!.join(' ');
    if (!containsKeyphrase(quarterText, kp)) {
      missingQuarters.push(quarterLabels[i]!);
    }
  }

  // Check first 10% (hook/introduction) and last 10% (conclusion)
  const plainText = stripHtml(content);
  const tenPercentLength = Math.max(1, Math.floor(plainText.length * 0.1));
  const introText = plainText.slice(0, tenPercentLength);
  const conclusionText = plainText.slice(-tenPercentLength);

  const missingZones: string[] = [];
  if (!containsKeyphrase(introText, kp)) {
    missingZones.push('introduction (first 10%)');
  }
  if (!containsKeyphrase(conclusionText, kp)) {
    missingZones.push('conclusion (last 10%)');
  }

  const quartersPresent = quarters.length - missingQuarters.length;
  const allZonesPresent = missingZones.length === 0;

  // Score: all 4 quarters + intro/conclusion = good; 2-3 quarters = ok; 0-1 = poor
  if (quartersPresent >= 4 && allZonesPresent) {
    return {
      id: 'keyphrase-even-distribution',
      title: 'Keyphrase distribution across content',
      description:
        'The focus keyphrase is well-distributed across all content sections, including the introduction and conclusion.',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (quartersPresent >= 2) {
    const missing = [...missingQuarters, ...missingZones];
    return {
      id: 'keyphrase-even-distribution',
      title: 'Keyphrase distribution across content',
      description:
        `The keyphrase is present in ${quartersPresent} of 4 content quarters. ` +
        `It is missing from: ${missing.join(', ')}. ` +
        'Distribute the keyphrase more evenly for better SEO.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  const missing = [...missingQuarters, ...missingZones];
  return {
    id: 'keyphrase-even-distribution',
    title: 'Keyphrase distribution across content',
    description:
      `The keyphrase only appears in ${quartersPresent} of 4 content quarters. ` +
      `Missing from: ${missing.join(', ')}. ` +
      'The keyphrase should be spread throughout the content for optimal SEO.',
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
