// @power-seo/content-analysis — AEO: Direct Answer Opening Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, extractTagContents } from '@power-seo/core';

/**
 * Check whether the article opens with a direct, answer-first paragraph.
 * AI engines (ChatGPT, Perplexity, Google AIO) prefer definition-first openings.
 * Research: definition-first openings generate 34 daily AI citations vs <5 for narrative openings.
 */
function findDirectAnswerOpening(
  html: string,
  keyphrase: string,
): {
  hasDirectAnswer: boolean;
  hasKeyphrase: boolean;
  hasDefinitionPattern: boolean;
} {
  const paragraphs = extractTagContents(html, 'p');
  const plainText = stripHtml(html);
  const allWords = getWords(plainText);

  const kp = keyphrase.toLowerCase().trim();

  // Check first 3 paragraphs only (within ~150 words)
  let cumulativeWords = 0;
  for (let i = 0; i < Math.min(paragraphs.length, 3); i++) {
    const para = paragraphs[i];
    if (para === undefined) continue;
    const paraPlain = stripHtml(para);
    const paraWords = getWords(paraPlain);
    if (cumulativeWords >= 150) break;
    cumulativeWords += paraWords.length;

    // Must be meaningful length: 30-120 words
    if (paraWords.length < 30 || paraWords.length > 120) continue;

    const lower = paraPlain.toLowerCase();
    const hasDefinitionPattern =
      /\bis\s+a\b/.test(lower) ||
      /\brefers\s+to\b/.test(lower) ||
      /\bis\s+defined\s+as\b/.test(lower) ||
      /\bmeans\b/.test(lower) ||
      /\bis\s+the\s+process\b/.test(lower) ||
      /\binvolves\b/.test(lower);

    const hasKeyphrase = kp.length > 0 && lower.includes(kp);

    if (hasDefinitionPattern) {
      return { hasDirectAnswer: true, hasKeyphrase, hasDefinitionPattern: true };
    }
  }

  // Fallback: check first 150 words of raw text for definition patterns
  if (allWords.length >= 30) {
    const first150 = allWords.slice(0, 150).join(' ').toLowerCase();
    const hasDefinitionPattern =
      /\bis\s+a\b/.test(first150) ||
      /\brefers\s+to\b/.test(first150) ||
      /\bis\s+defined\s+as\b/.test(first150) ||
      /\bmeans\b/.test(first150);
    const hasKeyphrase = kp.length > 0 && first150.includes(kp);

    if (hasDefinitionPattern) {
      return { hasDirectAnswer: true, hasKeyphrase, hasDefinitionPattern: true };
    }

    // Partial: short paragraph exists but no definition pattern
    const firstPara = paragraphs[0];
    if (firstPara !== undefined) {
      const firstParaWords = getWords(stripHtml(firstPara));
      if (firstParaWords.length >= 30 && firstParaWords.length <= 120) {
        return { hasDirectAnswer: false, hasKeyphrase, hasDefinitionPattern: false };
      }
    }
  }

  return { hasDirectAnswer: false, hasKeyphrase: false, hasDefinitionPattern: false };
}

export function checkAeoDirectAnswer(input: ContentAnalysisInput): AnalysisResult {
  const { content, focusKeyphrase } = input;
  const plain = stripHtml(content);
  const wordCount = getWords(plain).length;

  if (wordCount < 50) {
    return {
      id: 'aeo-direct-answer',
      title: 'Direct answer opening (AEO)',
      description: 'Add more content to evaluate the direct answer opening.',
      status: 'na',
      score: 0,
      maxScore: 10,
    };
  }

  const kp = (focusKeyphrase ?? '').trim();
  const { hasDirectAnswer, hasKeyphrase, hasDefinitionPattern } = findDirectAnswerOpening(
    content,
    kp,
  );

  if (hasDefinitionPattern && (hasKeyphrase || kp.length === 0)) {
    return {
      id: 'aeo-direct-answer',
      title: 'Direct answer opening (AEO)',
      description:
        'Great — the article opens with a definition-style direct answer. AI engines (ChatGPT, Perplexity, Google AI Overviews) strongly favour this pattern, generating up to 34× more AI citations.',
      status: 'good',
      score: 10,
      maxScore: 10,
    };
  }

  if (hasDefinitionPattern || hasDirectAnswer) {
    const kpNote =
      kp.length > 0 && !hasKeyphrase
        ? ` Include the focus keyphrase "${kp}" in the opening paragraph for full AEO benefit.`
        : '';
    return {
      id: 'aeo-direct-answer',
      title: 'Direct answer opening (AEO)',
      description: `The opening has some direct-answer structure, but could be clearer.${kpNote} Start with "[Topic] is/refers to/means…" for maximum AI engine citability.`,
      status: 'ok',
      score: 5,
      maxScore: 10,
    };
  }

  const kpNote =
    kp.length > 0
      ? ` Open with a sentence like "${kp} is…" or "${kp} refers to…" to maximise AI citation probability.`
      : ' Open with a definition-style sentence (e.g. "[Topic] is…") to maximise AI citation probability.';

  return {
    id: 'aeo-direct-answer',
    title: 'Direct answer opening (AEO)',
    description: `No direct-answer opening detected. AI engines favour content that answers the query in the first 40–60 words.${kpNote}`,
    status: 'poor',
    score: 0,
    maxScore: 10,
  };
}
