// @power-seo/content-analysis — Keyphrase Markup Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

/**
 * Emphasis tags to scan for keyphrase emphasis.
 */
const EMPHASIS_TAGS = ['strong', 'b', 'em', 'i', 'mark'] as const;

/**
 * Extract the inner text content of all instances of the given tags in HTML.
 * Returns an array of plain-text strings found inside those tags.
 */
function extractEmphasizedTexts(html: string): string[] {
  const texts: string[] = [];

  // One combined pass with a backreference to the opening tag. Scanning left to
  // right, an outer emphasis element consumes its inner tags, so nested emphasis
  // (e.g. <strong><em>seo tips</em></strong>) is counted ONCE — the previous
  // per-tag loop counted it once per wrapping tag, inflating the emphasis count
  // and triggering false "over-emphasized / keyword stuffing" reports.
  const regex = new RegExp(`<(${EMPHASIS_TAGS.join('|')})[^>]*>([\\s\\S]*?)<\\/\\1>`, 'gi');
  let match;
  while ((match = regex.exec(html)) !== null) {
    const inner = match[2]!
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    if (inner.length > 0) {
      texts.push(inner);
    }
  }

  return texts;
}

/**
 * Count total occurrences of a keyphrase in plain text (case-insensitive).
 */
function countOccurrences(text: string, keyphrase: string): number {
  const kpLower = keyphrase.toLowerCase().trim();
  const textLower = text.toLowerCase();
  if (!kpLower) return 0;

  let count = 0;
  let pos = 0;
  while ((pos = textLower.indexOf(kpLower, pos)) !== -1) {
    count++;
    pos += kpLower.length;
  }

  return count;
}

export function checkKeyphraseMarkup(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'keyphrase-markup',
      title: 'Keyphrase in emphasis',
      description: 'No focus keyphrase set. Set one to check keyphrase emphasis markup.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const kpLower = focusKeyphrase.toLowerCase().trim();

  // Count total keyphrase occurrences in the full content (plain text extraction)
  const plainText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  const totalOccurrences = countOccurrences(plainText, kpLower);

  if (totalOccurrences === 0) {
    return {
      id: 'keyphrase-markup',
      title: 'Keyphrase in emphasis',
      description:
        'The focus keyphrase does not appear in the content, so emphasis cannot be evaluated. Add the keyphrase to your content first.',
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  // Count how many times the keyphrase appears inside emphasis tags
  const emphasizedTexts = extractEmphasizedTexts(content);
  let emphasizedCount = 0;
  for (const text of emphasizedTexts) {
    emphasizedCount += countOccurrences(text, kpLower);
  }

  const emphasisRatio = totalOccurrences > 0 ? emphasizedCount / totalOccurrences : 0;

  // Optimal: 1-2 emphasized instances
  if (emphasizedCount >= 1 && emphasizedCount <= 2) {
    return {
      id: 'keyphrase-markup',
      title: 'Keyphrase in emphasis',
      description: `The focus keyphrase is emphasized ${emphasizedCount} time${emphasizedCount === 1 ? '' : 's'} out of ${totalOccurrences} occurrence${totalOccurrences === 1 ? '' : 's'}. This is optimal for signaling importance to search engines.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // Not emphasized at all
  if (emphasizedCount === 0) {
    return {
      id: 'keyphrase-markup',
      title: 'Keyphrase in emphasis',
      description: `The focus keyphrase appears ${totalOccurrences} time${totalOccurrences === 1 ? '' : 's'} but is never emphasized with <strong>, <b>, <em>, <i>, or <mark>. Consider bolding or italicizing the keyphrase once to signal its importance.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // Over-emphasized: >50% of instances are in emphasis tags
  if (emphasisRatio > 0.5) {
    return {
      id: 'keyphrase-markup',
      title: 'Keyphrase in emphasis',
      description: `The focus keyphrase is emphasized ${emphasizedCount} out of ${totalOccurrences} time${totalOccurrences === 1 ? '' : 's'} (${Math.round(emphasisRatio * 100)}%). This is over-emphasized and may appear as keyword stuffing. Reduce emphasis to 1-2 instances.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  // More than 2 emphasized but ratio is <=50% — still somewhat excessive
  return {
    id: 'keyphrase-markup',
    title: 'Keyphrase in emphasis',
    description: `The focus keyphrase is emphasized ${emphasizedCount} out of ${totalOccurrences} time${totalOccurrences === 1 ? '' : 's'}. While the ratio is acceptable, consider reducing emphasis to 1-2 instances for optimal signaling.`,
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
