// @power-seo/content-analysis — Word Complexity Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, getSentences, countSyllables, countTotalSyllables } from '@power-seo/core';

/**
 * Dictionary of unnecessarily complex words with simpler alternatives.
 * Keys are lowercase complex words, values are recommended replacements.
 */
const COMPLEX_SYNONYMS: Record<string, string> = {
  utilize: 'use',
  approximately: 'about',
  subsequently: 'then',
  commence: 'start',
  facilitate: 'help',
  demonstrate: 'show',
  leverage: 'use',
  modification: 'change',
  necessitate: 'need',
  procure: 'get',
  diminish: 'reduce',
  ascertain: 'find out',
  endeavor: 'try',
  endeavour: 'try',
  elucidate: 'explain',
  expedite: 'speed up',
  formulate: 'create',
  implement: 'do',
  inaugurate: 'begin',
  methodology: 'method',
  notwithstanding: 'despite',
  perpetuate: 'continue',
  prioritize: 'rank',
  promulgate: 'announce',
  substantiate: 'prove',
  terminate: 'end',
  remuneration: 'pay',
  ameliorate: 'improve',
  disseminate: 'spread',
  proliferate: 'spread',
  aforementioned: 'previous',
  henceforth: 'from now on',
  hereinafter: 'below',
  inasmuch: 'because',
  juxtapose: 'compare',
  paradigm: 'model',
  synergy: 'teamwork',
  ubiquitous: 'common',
  cognizant: 'aware',
  enumerate: 'list',
  exacerbate: 'worsen',
  amelioration: 'improvement',
  commencement: 'start',
  discontinue: 'stop',
  effectuate: 'carry out',
  supplementary: 'extra',
  transformative: 'major',
  components: 'parts',
  consequently: 'so',
  functionality: 'features',
  infrastructure: 'system',
  nevertheless: 'still',
  numerous: 'many',
  objectives: 'goals',
  parameters: 'limits',
  specifications: 'specs',
  sufficient: 'enough',
  additional: 'more',
  acquisition: 'purchase',
};

interface ComplexWordMatch {
  word: string;
  suggestion: string;
}

/**
 * Check content readability via Flesch-Kincaid Grade Level and detect
 * unnecessarily complex words that have simpler alternatives.
 *
 * Flesch-Kincaid Grade Level formula:
 *   0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59
 */
export function checkWordComplexity(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content).trim();

  if (!plainText || plainText.length === 0) {
    return {
      id: 'word-complexity',
      title: 'Word complexity',
      description: 'No content to analyze. Add content to get a complexity assessment.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const words = getWords(input.content);
  const sentences = getSentences(input.content);

  if (words.length === 0 || sentences.length === 0) {
    return {
      id: 'word-complexity',
      title: 'Word complexity',
      description: 'Not enough content to calculate readability grade. Add more text.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const totalWords = words.length;
  const totalSentences = sentences.length;
  const totalSyllables = countTotalSyllables(input.content);

  // Flesch-Kincaid Grade Level
  const gradeLevel =
    0.39 * (totalWords / totalSentences) +
    11.8 * (totalSyllables / totalWords) -
    15.59;
  const roundedGrade = Math.round(gradeLevel * 10) / 10;

  // Count complex words (3+ syllables)
  const complexWords: string[] = [];
  for (const word of words) {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleaned.length > 0 && countSyllables(cleaned) >= 3) {
      complexWords.push(cleaned);
    }
  }
  const complexPercentage = Math.round((complexWords.length / totalWords) * 100);

  // Deduplicate and get top 10 most frequent complex words
  const complexFrequency = new Map<string, number>();
  for (const w of complexWords) {
    complexFrequency.set(w, (complexFrequency.get(w) || 0) + 1);
  }
  const top10Complex = [...complexFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  // Detect unnecessarily complex synonyms
  const foundSynonyms: ComplexWordMatch[] = [];
  const seenSynonyms = new Set<string>();
  for (const word of words) {
    const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleaned && COMPLEX_SYNONYMS[cleaned] && !seenSynonyms.has(cleaned)) {
      seenSynonyms.add(cleaned);
      foundSynonyms.push({
        word: cleaned,
        suggestion: COMPLEX_SYNONYMS[cleaned]!,
      });
    }
  }

  // Build description
  const parts: string[] = [];
  parts.push(`Flesch-Kincaid Grade Level: ${roundedGrade}.`);
  parts.push(`${complexPercentage}% of words (${complexWords.length}/${totalWords}) have 3+ syllables.`);

  if (top10Complex.length > 0) {
    parts.push(`Most frequent complex words: ${top10Complex.join(', ')}.`);
  }

  if (foundSynonyms.length > 0) {
    const suggestions = foundSynonyms
      .slice(0, 5)
      .map((s) => `"${s.word}" -> "${s.suggestion}"`)
      .join(', ');
    parts.push(
      `Consider simpler alternatives: ${suggestions}${foundSynonyms.length > 5 ? ` (+${foundSynonyms.length - 5} more)` : ''}.`
    );
  }

  // Score based on grade level
  if (roundedGrade <= 8) {
    return {
      id: 'word-complexity',
      title: 'Word complexity',
      description: parts.join(' ') + ' The content reads at an accessible grade level.',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (roundedGrade <= 12) {
    return {
      id: 'word-complexity',
      title: 'Word complexity',
      description:
        parts.join(' ') +
        ' The reading level is moderately advanced. Consider simplifying for a broader audience.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'word-complexity',
    title: 'Word complexity',
    description:
      parts.join(' ') +
      ' The reading level is very advanced. Simplify language and shorten sentences for better readability.',
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
