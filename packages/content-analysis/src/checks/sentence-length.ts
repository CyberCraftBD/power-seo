// @power-seo/content-analysis — Sentence Length Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, splitSentences } from '@power-seo/core';

const MAX_RECOMMENDED_SENTENCE_LENGTH = 20;
const LONG_SENTENCE_THRESHOLD = 0.25; // 25% of sentences being long is problematic

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

export function checkSentenceLength(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content).trim();

  if (!plainText || plainText.length === 0) {
    return {
      id: 'sentence-length',
      title: 'Sentence length',
      description: 'No content to analyze. Add content to get sentence length analysis.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const sentences = splitSentences(plainText);

  if (sentences.length === 0) {
    return {
      id: 'sentence-length',
      title: 'Sentence length',
      description: 'Not enough sentences to analyze. Add more content.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const longSentences = sentences.filter((s) => countWords(s) > MAX_RECOMMENDED_SENTENCE_LENGTH);
  const longPercentage = longSentences.length / sentences.length;

  if (longPercentage > LONG_SENTENCE_THRESHOLD) {
    const pct = Math.round(longPercentage * 100);
    return {
      id: 'sentence-length',
      title: 'Sentence length',
      description: `${pct}% of sentences are over ${MAX_RECOMMENDED_SENTENCE_LENGTH} words. Try to shorten some sentences for easier reading.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  if (longSentences.length > 0) {
    return {
      id: 'sentence-length',
      title: 'Sentence length',
      description: `${longSentences.length} sentence${longSentences.length === 1 ? ' is' : 's are'} over ${MAX_RECOMMENDED_SENTENCE_LENGTH} words, but overall sentence length is acceptable.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'sentence-length',
    title: 'Sentence length',
    description: 'Sentence lengths are good. Your content is easy to read.',
    status: 'good',
    score: 5,
    maxScore: 5,
  };
}
