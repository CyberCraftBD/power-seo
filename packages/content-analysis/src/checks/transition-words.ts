// @power-seo/content-analysis — Transition Words Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, splitSentences, READABILITY } from '@power-seo/core';

const TRANSITION_WORDS = [
  // Addition
  'additionally',
  'also',
  'besides',
  'furthermore',
  'in addition',
  'moreover',
  'likewise',
  // Contrast
  'although',
  'however',
  'in contrast',
  'nevertheless',
  'nonetheless',
  'on the other hand',
  'whereas',
  'while',
  'yet',
  'but',
  'despite',
  'even though',
  'in spite of',
  'still',
  // Cause & effect
  'accordingly',
  'as a result',
  'because',
  'consequently',
  'due to',
  'for this reason',
  'hence',
  'since',
  'so',
  'therefore',
  'thus',
  // Sequence
  'finally',
  'first',
  'firstly',
  'in the first place',
  'next',
  'previously',
  'second',
  'secondly',
  'subsequently',
  'then',
  'third',
  'thirdly',
  // Example
  'for example',
  'for instance',
  'in other words',
  'in particular',
  'namely',
  'specifically',
  'such as',
  'to illustrate',
  // Conclusion
  'all in all',
  'altogether',
  'in conclusion',
  'in short',
  'in summary',
  'to conclude',
  'to sum up',
  'to summarize',
  'ultimately',
  'overall',
  // Emphasis
  'above all',
  'certainly',
  'especially',
  'importantly',
  'in fact',
  'indeed',
  'most importantly',
  'of course',
  'particularly',
  'undoubtedly',
  // Similarity
  'equally',
  'in the same way',
  'similarly',
];

// Same tiers as @power-seo/readability so both engines agree on the verdict
const GOOD_TRANSITION_PERCENTAGE = READABILITY.MIN_TRANSITION_WORD_PERCENT;
const MIN_TRANSITION_PERCENTAGE = READABILITY.MIN_TRANSITION_WORD_PERCENT / 2;

export function checkTransitionWords(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content).trim();

  if (!plainText || plainText.length === 0) {
    return {
      id: 'transition-words',
      title: 'Transition words',
      description: 'No content to analyze. Add content to get transition word analysis.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const sentences = splitSentences(plainText);

  if (sentences.length < 3) {
    return {
      id: 'transition-words',
      title: 'Transition words',
      description: 'Not enough sentences to analyze transition word usage.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const sentencesWithTransition = sentences.filter((sentence) => {
    const lower = sentence.toLowerCase();
    return TRANSITION_WORDS.some((tw) => {
      // Check if transition word/phrase appears at the start or as a standalone part of the sentence
      const idx = lower.indexOf(tw);
      if (idx === -1) return false;
      // Ensure it's a word boundary
      const before = idx === 0 || /[\s,;:()]/.test(lower[idx - 1]!);
      const after = idx + tw.length >= lower.length || /[\s,;:()]/.test(lower[idx + tw.length]!);
      return before && after;
    });
  });

  const percentage = Math.round((sentencesWithTransition.length / sentences.length) * 100);

  if (percentage >= GOOD_TRANSITION_PERCENTAGE) {
    return {
      id: 'transition-words',
      title: 'Transition words',
      description: `${percentage}% of sentences contain transition words. Your text flows well.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (percentage >= MIN_TRANSITION_PERCENTAGE) {
    return {
      id: 'transition-words',
      title: 'Transition words',
      description: `${percentage}% of sentences contain transition words. Consider adding a few more for smoother flow.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'transition-words',
    title: 'Transition words',
    description: `Only ${percentage}% of sentences contain transition words. Use words like "however", "therefore", "for example" to improve text flow.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
