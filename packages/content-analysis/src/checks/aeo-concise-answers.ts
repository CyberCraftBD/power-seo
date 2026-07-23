// @power-seo/content-analysis — AEO: Concise Answers Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, extractTagContents } from '@power-seo/core';

/**
 * A heading is a question ONLY if it ends with "?" or starts with an
 * interrogative word. Bare auxiliaries (is/are/can/does/etc.) anywhere in the
 * heading do NOT qualify.
 */
function isQuestionHeading(headingText: string): boolean {
  const trimmed = headingText.trim();
  if (trimmed.length === 0) return false;
  return trimmed.endsWith('?') || /^(?:what|how|why|when|where|who|which)\b/i.test(trimmed);
}

/**
 * Slice the HTML section belonging to a heading: from the end of the heading
 * up to the next heading of the same or higher level (h2 stops at the next
 * h2; h3 stops at the next h2 or h3).
 */
function sliceSection(html: string, headingEnd: number, level: number): string {
  const rest = html.slice(headingEnd);
  const nextHeadingRegex = /<h([1-6])[^>]*>/gi;
  let next: RegExpExecArray | null;
  while ((next = nextHeadingRegex.exec(rest)) !== null) {
    const nextLevel = Number(next[1]);
    if (nextLevel <= level) {
      return rest.slice(0, next.index);
    }
  }
  return rest;
}

/**
 * Checks whether question-phrased headings are followed by concise 40–120 word
 * answer paragraphs. Perplexity AI study (2025): 40–60 word answer paragraphs
 * following question headings generate 220% more citations than longer answers.
 */
function countConciseAnswers(html: string): { concise: number; total: number } {
  const headingRegex = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi;

  let concise = 0;
  let total = 0;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html)) !== null) {
    const headingText = stripHtml(match[2] ?? '');
    if (!isQuestionHeading(headingText)) continue;
    total++;

    // Look for the answer only within this heading's own section, skipping
    // non-<p> blocks (figure/ul/pre) when finding the first paragraph.
    const level = Number(match[1]);
    const section = sliceSection(html, match.index + match[0].length, level);
    const firstPara = extractTagContents(section, 'p')[0];

    if (firstPara !== undefined) {
      const wordCount = getWords(stripHtml(firstPara)).length;
      if (wordCount >= 40 && wordCount <= 120) {
        concise++;
      }
    }
  }

  return { concise, total };
}

export function checkAeoConciseAnswers(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;
  const plain = stripHtml(content);
  const wordCount = getWords(plain).length;

  if (wordCount < 200) {
    return {
      id: 'aeo-concise-answers',
      title: 'Concise answer paragraphs (AEO)',
      description: 'Add more content to evaluate answer conciseness.',
      status: 'na',
      score: 0,
      maxScore: 7,
    };
  }

  const { concise, total } = countConciseAnswers(content);

  if (total === 0) {
    return {
      id: 'aeo-concise-answers',
      title: 'Concise answer paragraphs (AEO)',
      description: 'No question-style headings (H2/H3) found. Add questions as headings and answer each with a 40–120 word paragraph. Perplexity AI study: 40–60 word answer paragraphs generate 220% more AI citations.',
      status: 'na',
      score: 0,
      maxScore: 7,
    };
  }

  const ratio = concise / total;

  if (ratio >= 0.7) {
    return {
      id: 'aeo-concise-answers',
      title: 'Concise answer paragraphs (AEO)',
      description: `${concise} of ${total} question headings have concise 40–120 word answers. Excellent — this pattern generates 220% more Perplexity and ChatGPT citations than long-form answers.`,
      status: 'good',
      score: 7,
      maxScore: 7,
    };
  }

  if (ratio >= 0.4 || concise >= 1) {
    return {
      id: 'aeo-concise-answers',
      title: 'Concise answer paragraphs (AEO)',
      description: `${concise} of ${total} question headings have concise answers (40–120 words). Aim for all question headings to be followed by a tight 40–60 word direct answer. Longer answers reduce AI citation probability by 60%.`,
      status: 'ok',
      score: 4,
      maxScore: 7,
    };
  }

  return {
    id: 'aeo-concise-answers',
    title: 'Concise answer paragraphs (AEO)',
    description: `${concise} of ${total} question headings have concise answers. Most answers are too long or absent. Keep the first answer paragraph to 40–120 words — then add detail in subsequent paragraphs. AI engines extract the first paragraph under each heading as the cited answer.`,
    status: 'poor',
    score: 1,
    maxScore: 7,
  };
}
