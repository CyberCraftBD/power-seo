// @power-seo/readability — Combined Readability Analyzer
// ----------------------------------------------------------------------------

import type { ReadabilityInput, ReadabilityOutput, AnalysisResult } from '@power-seo/core';
import { getTextStatistics, getSentences, getParagraphs, READABILITY } from '@power-seo/core';
import { fleschReadingEase, fleschKincaidGrade } from './algorithms/flesch-kincaid.js';

// --- Code Block Removal ---

/**
 * Remove <pre> blocks and inline <code> content from HTML (issue #151):
 * code samples are not prose and skew every readability statistic.
 * Plain string search — no regex, no ReDoS.
 */
function removeTagWithContent(html: string, tag: string): string {
  const open = `<${tag}`;
  const close = `</${tag}>`;
  let result = html;
  let start = result.toLowerCase().indexOf(open);
  while (start !== -1) {
    const end = result.toLowerCase().indexOf(close, start);
    if (end === -1) {
      // Unclosed tag — remove only the opening tag itself, keep the prose.
      const tagEnd = result.indexOf('>', start);
      result =
        tagEnd === -1
          ? result.slice(0, start) + result.slice(start + open.length)
          : result.slice(0, start) + result.slice(tagEnd + 1);
    } else {
      result = result.slice(0, start) + ' ' + result.slice(end + close.length);
    }
    start = result.toLowerCase().indexOf(open, start);
  }
  return result;
}

// --- Passive Voice Detection ---

const PASSIVE_AUXILIARIES = ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being'];

// Irregular past participles that don't end in -ed (issue #156).
const IRREGULAR_PARTICIPLES = new Set([
  'been',
  'born',
  'borne',
  'bought',
  'broken',
  'brought',
  'built',
  'caught',
  'chosen',
  'done',
  'drawn',
  'driven',
  'eaten',
  'fallen',
  'felt',
  'found',
  'given',
  'gone',
  'grown',
  'held',
  'hidden',
  'kept',
  'known',
  'laid',
  'led',
  'left',
  'lost',
  'made',
  'meant',
  'met',
  'paid',
  'put',
  'read',
  'said',
  'seen',
  'sent',
  'set',
  'shown',
  'shut',
  'sold',
  'spent',
  'spoken',
  'stolen',
  'taken',
  'taught',
  'thought',
  'thrown',
  'told',
  'understood',
  'won',
  'worn',
  'written',
]);

// Words ending in -ed that are never passive participles.
const PARTICIPLE_STOPWORDS = new Set(['need', 'indeed', 'hundred', 'sacred', 'naked', 'wicked']);

// Auxiliary + optional adverb + candidate word. The candidate is validated by
// isParticiple() — the old pattern `\w+(?:ed|en|t)` flagged any word ending in
// t/en/ed, so "is not", "is it" and "was right" all counted as passive (#156).
const PASSIVE_REGEX = new RegExp(
  `\\b(?:${PASSIVE_AUXILIARIES.join('|')})\\s+(?:\\w+ly\\s+)?(\\w+)\\b`,
  'gi',
);

function isParticiple(word: string): boolean {
  const w = word.toLowerCase();
  if (IRREGULAR_PARTICIPLES.has(w)) return true;
  // Regular participle: minimum 3-char stem before "ed" avoids "need", "bed"…
  return /^\w{3,}ed$/.test(w) && !PARTICIPLE_STOPWORDS.has(w);
}

function hasPassiveVoice(sentence: string): boolean {
  PASSIVE_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = PASSIVE_REGEX.exec(sentence)) !== null) {
    if (isParticiple(match[1] ?? '')) return true;
  }
  return false;
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

// Word-boundary regexes — plain substring matching flagged "distillery"
// (still), "tribute" (but) and "yeti" (yet) as transitions (issue #163).
const TRANSITION_REGEXES = TRANSITION_WORDS.map(
  (tw) => new RegExp(`\\b${tw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
);

function countTransitionSentences(sentences: string[]): number {
  let count = 0;
  for (const sentence of sentences) {
    if (TRANSITION_REGEXES.some((regex) => regex.test(sentence))) {
      count++;
    }
  }
  return count;
}

// --- Consecutive Sentence Detection ---

function getFirstWord(sentence: string): string {
  const words = sentence.trim().split(/\s+/);
  return (words[0] ?? '').toLowerCase();
}

function checkConsecutiveSentences(sentences: string[]): number {
  let groups = 0;
  let i = 0;
  while (i < sentences.length) {
    const firstWord = getFirstWord(sentences[i] ?? '');
    if (!firstWord) {
      i++;
      continue;
    }
    let streak = 1;
    while (
      i + streak < sentences.length &&
      getFirstWord(sentences[i + streak] ?? '') === firstWord
    ) {
      streak++;
    }
    if (streak >= 3) {
      groups++;
    }
    i += streak;
  }
  return groups;
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
  // Code samples are not prose — exclude them from all statistics (#151).
  const content = removeTagWithContent(removeTagWithContent(input.content, 'pre'), 'code');
  const stats = getTextStatistics(content);
  const sentences = getSentences(content);
  const paragraphs = getParagraphs(content);
  // Algorithm scores
  const fre = fleschReadingEase(stats);
  const fkg = fleschKincaidGrade(stats);

  // Passive voice analysis: percentage of sentences containing at least one
  // passive construction (#156 — raw match counts could exceed 100%).
  const passiveSentenceCount = sentences.filter((s) => hasPassiveVoice(s)).length;
  const passiveVoicePercentage =
    sentences.length > 0
      ? Math.min(100, Math.round((passiveSentenceCount / sentences.length) * 1000) / 10)
      : 0;

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

  // Consecutive sentence analysis
  const consecutiveSentenceGroups = checkConsecutiveSentences(sentences);

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
      score: 4,
      maxScore: 4,
    });
  } else if (fre >= READABILITY.FLESCH_EASE_FAIR) {
    results.push({
      id: 'flesch-reading-ease',
      title: 'Flesch Reading Ease',
      description: `Score: ${fre}. The text is fairly difficult to read. Try shorter sentences and simpler words.`,
      status: 'ok',
      score: 3,
      maxScore: 4,
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
      maxScore: 4,
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
      score: 8,
      maxScore: 8,
    });
  } else if (longSentencePercentage <= 40) {
    results.push({
      id: 'sentence-length',
      title: 'Sentence length',
      description: `${longSentencePercentage}% of sentences are longer than ${READABILITY.MAX_SENTENCE_LENGTH} words. Try to shorten some.`,
      status: 'ok',
      score: 5,
      maxScore: 8,
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
      maxScore: 8,
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
      score: 6,
      maxScore: 6,
    });
  } else if (passiveVoicePercentage <= READABILITY.MAX_PASSIVE_VOICE_PERCENT * 2) {
    results.push({
      id: 'passive-voice',
      title: 'Passive voice',
      description: `${passiveVoicePercentage}% of sentences use passive voice. Try to use more active voice.`,
      status: 'ok',
      score: 4,
      maxScore: 6,
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
      maxScore: 6,
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
      score: 3,
      maxScore: 3,
    });
  } else if (transitionWordPercentage >= READABILITY.MIN_TRANSITION_WORD_PERCENT / 2) {
    results.push({
      id: 'transition-words',
      title: 'Transition words',
      description: `${transitionWordPercentage}% of sentences contain transition words. Use more to improve flow.`,
      status: 'ok',
      score: 2,
      maxScore: 3,
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
      maxScore: 3,
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
      score: 8,
      maxScore: 8,
    });
  } else {
    results.push({
      id: 'paragraph-length',
      title: 'Paragraph length',
      description: `${longParagraphCount} paragraph${longParagraphCount === 1 ? '' : 's'} exceed${longParagraphCount === 1 ? 's' : ''} ${READABILITY.MAX_PARAGRAPH_WORDS} words. Break them up for better readability.`,
      status: longParagraphCount <= 2 ? 'ok' : 'poor',
      score: longParagraphCount <= 2 ? 5 : 1,
      maxScore: 8,
    });
    recommendations.push(
      `${longParagraphCount} paragraph${longParagraphCount === 1 ? ' is' : 's are'} too long. Keep paragraphs under ${READABILITY.MAX_PARAGRAPH_WORDS} words.`,
    );
  }

  // Consecutive sentences result
  if (consecutiveSentenceGroups === 0) {
    results.push({
      id: 'consecutive-sentences',
      title: 'Consecutive sentences',
      description: 'No consecutive sentences start with the same word. Good variety!',
      status: 'good',
      score: 3,
      maxScore: 3,
    });
  } else if (consecutiveSentenceGroups === 1) {
    results.push({
      id: 'consecutive-sentences',
      title: 'Consecutive sentences',
      description:
        '1 group of consecutive sentences starts with the same word. Try varying your sentence beginnings.',
      status: 'ok',
      score: 2,
      maxScore: 3,
    });
    recommendations.push(
      '1 group of consecutive sentences starts with the same word. Vary your sentence beginnings to improve readability.',
    );
  } else {
    results.push({
      id: 'consecutive-sentences',
      title: 'Consecutive sentences',
      description: `${consecutiveSentenceGroups} groups of consecutive sentences start with the same word. Vary your sentence beginnings to improve readability.`,
      status: 'poor',
      score: 1,
      maxScore: 3,
    });
    recommendations.push(
      `${consecutiveSentenceGroups} groups of consecutive sentences start with the same word. Vary your sentence beginnings to improve readability.`,
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
    consecutiveSentenceGroups,
    results,
    recommendations,
  };
}
