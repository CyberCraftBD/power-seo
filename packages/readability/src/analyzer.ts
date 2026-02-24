// @power-seo/readability — Combined Readability Analyzer
// ----------------------------------------------------------------------------

import type { ReadabilityInput, ReadabilityOutput, AnalysisResult } from '@power-seo/core';
import {
  getTextStatistics,
  getSentences,
  getParagraphs,
  stripHtml,
  READABILITY,
} from '@power-seo/core';
import { fleschReadingEase, fleschKincaidGrade } from './algorithms/flesch-kincaid.js';

// --- Passive Voice Detection ---

const PASSIVE_AUXILIARIES = ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];
const PASSIVE_REGEX = new RegExp(
  `\\b(${PASSIVE_AUXILIARIES.join('|')})\\s+\\w+(?:ed|en|t)\\b`,
  'gi',
);

function countPassiveVoice(text: string): number {
  const matches = text.match(PASSIVE_REGEX);
  return matches?.length ?? 0;
}

// --- Transition Word Detection ---

const TRANSITION_WORDS = [
  'accordingly',
  'additionally',
  'also',
  'although',
  'as a result',
  'because',
  'besides',
  'but',
  'certainly',
  'consequently',
  'conversely',
  'equally',
  'eventually',
  'finally',
  'first',
  'for example',
  'for instance',
  'furthermore',
  'hence',
  'however',
  'in addition',
  'in conclusion',
  'in contrast',
  'in fact',
  'in other words',
  'in particular',
  'in summary',
  'indeed',
  'instead',
  'likewise',
  'meanwhile',
  'moreover',
  'namely',
  'nevertheless',
  'next',
  'nonetheless',
  'notably',
  'on the other hand',
  'otherwise',
  'overall',
  'particularly',
  'rather',
  'second',
  'similarly',
  'since',
  'specifically',
  'still',
  'subsequently',
  'such as',
  'then',
  'therefore',
  'third',
  'thus',
  'to illustrate',
  'ultimately',
  'whereas',
  'yet',
];

function countTransitionSentences(sentences: string[]): number {
  let count = 0;
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    if (TRANSITION_WORDS.some((tw) => lower.includes(tw))) {
      count++;
    }
  }
  return count;
}

/**
 * Analyze the readability of content using multiple algorithms.
 *
 * Returns a combined `ReadabilityOutput` with individual algorithm scores,
 * traffic-light results, and actionable recommendations.
 *
 * @example
 * ```ts
 * const result = analyzeReadability({
 *   content: '<p>Your article content here...</p>',
 * });
 * console.log(result.fleschReadingEase, result.recommendations);
 * ```
 */
export function analyzeReadability(input: ReadabilityInput): ReadabilityOutput {
  const { content } = input;
  const stats = getTextStatistics(content);
  const text = stripHtml(content);
  const sentences = getSentences(content);
  const paragraphs = getParagraphs(content);
  // Algorithm scores
  const fre = fleschReadingEase(stats);
  const fkg = fleschKincaidGrade(stats);

  // Passive voice analysis
  const passiveCount = countPassiveVoice(text);
  const passiveVoicePercentage =
    sentences.length > 0 ? Math.round((passiveCount / sentences.length) * 1000) / 10 : 0;

  // Long sentence analysis
  const longSentences = sentences.filter((s) => {
    const wordCount = s.split(/\s+/).filter((w) => w.length > 0).length;
    return wordCount > READABILITY.MAX_SENTENCE_LENGTH;
  });
  const longSentencePercentage =
    sentences.length > 0 ? Math.round((longSentences.length / sentences.length) * 1000) / 10 : 0;

  // Long paragraph analysis
  const longParagraphCount = paragraphs.filter((p) => {
    const wordCount = p.split(/\s+/).filter((w) => w.length > 0).length;
    return wordCount > READABILITY.MAX_PARAGRAPH_WORDS;
  }).length;

  // Transition word analysis
  const transitionCount = countTransitionSentences(sentences);
  const transitionWordPercentage =
    sentences.length > 0 ? Math.round((transitionCount / sentences.length) * 1000) / 10 : 0;

  // Normalized overall score: 0-100 based on Flesch Reading Ease
  const score = Math.round(fre);

  // Build results
  const results: AnalysisResult[] = [];
  const recommendations: string[] = [];

  // Flesch Reading Ease result
  if (fre >= READABILITY.FLESCH_EASE_GOOD) {
    results.push({
      id: 'flesch-reading-ease',
      title: 'Flesch Reading Ease',
      description: `Score: ${fre}. The text is easy to read.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else if (fre >= READABILITY.FLESCH_EASE_FAIR) {
    results.push({
      id: 'flesch-reading-ease',
      title: 'Flesch Reading Ease',
      description: `Score: ${fre}. The text is fairly difficult to read. Try shorter sentences and simpler words.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
    recommendations.push(
      'Simplify your writing — use shorter sentences and common words to improve readability.',
    );
  } else {
    results.push({
      id: 'flesch-reading-ease',
      title: 'Flesch Reading Ease',
      description: `Score: ${fre}. The text is very difficult to read. Significantly simplify your writing.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    });
    recommendations.push(
      'Your content is very hard to read. Break up long sentences and replace complex words with simpler alternatives.',
    );
  }

  // Sentence length result
  if (longSentencePercentage <= 25) {
    results.push({
      id: 'sentence-length',
      title: 'Sentence length',
      description: `${longSentencePercentage}% of sentences are longer than ${READABILITY.MAX_SENTENCE_LENGTH} words. Good variety.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else if (longSentencePercentage <= 40) {
    results.push({
      id: 'sentence-length',
      title: 'Sentence length',
      description: `${longSentencePercentage}% of sentences are longer than ${READABILITY.MAX_SENTENCE_LENGTH} words. Try to shorten some.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
    recommendations.push(
      `${longSentencePercentage}% of your sentences are long. Try to keep most sentences under ${READABILITY.MAX_SENTENCE_LENGTH} words.`,
    );
  } else {
    results.push({
      id: 'sentence-length',
      title: 'Sentence length',
      description: `${longSentencePercentage}% of sentences are longer than ${READABILITY.MAX_SENTENCE_LENGTH} words. Many sentences need to be shortened.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    });
    recommendations.push(
      `${longSentencePercentage}% of your sentences exceed ${READABILITY.MAX_SENTENCE_LENGTH} words. Break them into shorter, more digestible sentences.`,
    );
  }

  // Passive voice result
  if (passiveVoicePercentage <= READABILITY.MAX_PASSIVE_VOICE_PERCENT) {
    results.push({
      id: 'passive-voice',
      title: 'Passive voice',
      description: `${passiveVoicePercentage}% of sentences use passive voice. This is within the recommended limit.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else if (passiveVoicePercentage <= READABILITY.MAX_PASSIVE_VOICE_PERCENT * 2) {
    results.push({
      id: 'passive-voice',
      title: 'Passive voice',
      description: `${passiveVoicePercentage}% of sentences use passive voice. Try to use more active voice.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
    recommendations.push(
      `Reduce passive voice usage (${passiveVoicePercentage}%). Active voice makes your writing more direct and engaging.`,
    );
  } else {
    results.push({
      id: 'passive-voice',
      title: 'Passive voice',
      description: `${passiveVoicePercentage}% of sentences use passive voice. Rewrite using active voice.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    });
    recommendations.push(
      `${passiveVoicePercentage}% of your sentences use passive voice. Rewrite them in active voice for clearer, more engaging content.`,
    );
  }

  // Transition words result
  if (transitionWordPercentage >= READABILITY.MIN_TRANSITION_WORD_PERCENT) {
    results.push({
      id: 'transition-words',
      title: 'Transition words',
      description: `${transitionWordPercentage}% of sentences contain transition words. Good flow.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else if (transitionWordPercentage >= READABILITY.MIN_TRANSITION_WORD_PERCENT / 2) {
    results.push({
      id: 'transition-words',
      title: 'Transition words',
      description: `${transitionWordPercentage}% of sentences contain transition words. Use more to improve flow.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
    recommendations.push(
      `Use more transition words (currently ${transitionWordPercentage}%). Words like "however", "therefore", and "for example" improve readability.`,
    );
  } else {
    results.push({
      id: 'transition-words',
      title: 'Transition words',
      description: `${transitionWordPercentage}% of sentences contain transition words. Add more to connect your ideas.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    });
    recommendations.push(
      `Only ${transitionWordPercentage}% of sentences use transition words. Add connectors like "however", "in addition", and "therefore" to guide readers.`,
    );
  }

  // Paragraph length result
  if (longParagraphCount === 0) {
    results.push({
      id: 'paragraph-length',
      title: 'Paragraph length',
      description: 'All paragraphs are a reasonable length.',
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'paragraph-length',
      title: 'Paragraph length',
      description: `${longParagraphCount} paragraph${longParagraphCount === 1 ? '' : 's'} exceed${longParagraphCount === 1 ? 's' : ''} ${READABILITY.MAX_PARAGRAPH_WORDS} words. Break them up for better readability.`,
      status: longParagraphCount <= 2 ? 'ok' : 'poor',
      score: longParagraphCount <= 2 ? 3 : 1,
      maxScore: 5,
    });
    recommendations.push(
      `${longParagraphCount} paragraph${longParagraphCount === 1 ? ' is' : 's are'} too long. Keep paragraphs under ${READABILITY.MAX_PARAGRAPH_WORDS} words.`,
    );
  }

  return {
    score,
    fleschReadingEase: fre,
    fleschKincaidGrade: fkg,
    avgSentenceLength: stats.avgWordsPerSentence,
    avgSyllablesPerWord: stats.avgSyllablesPerWord,
    passiveVoicePercentage,
    longSentencePercentage,
    longParagraphCount,
    transitionWordPercentage,
    results,
    recommendations,
  };
}
