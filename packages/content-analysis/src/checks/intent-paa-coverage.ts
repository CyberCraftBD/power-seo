// @power-seo/content-analysis — People Also Ask Coverage Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, extractTagContents } from '@power-seo/core';

// ---------------------------------------------------------------------------
// Question detection
// ---------------------------------------------------------------------------

const QUESTION_STARTERS = /^(?:what|how|why|when|where|who|which)\b/i;

/**
 * Determine whether a heading text is a question pattern.
 * A heading is a question ONLY if it ends with a question mark or starts
 * with a PAA-style interrogative word. Bare auxiliaries (is/are/can/does/etc.)
 * anywhere in the heading do NOT qualify.
 */
function isQuestionHeading(headingText: string): boolean {
  const trimmed = headingText.trim();
  if (trimmed.length === 0) return false;

  // Explicit question mark at the end
  if (trimmed.endsWith('?')) return true;

  // Starts with an interrogative word
  if (QUESTION_STARTERS.test(trimmed)) return true;

  return false;
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentPaaCoverage(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;

  // Extract all H2 and H3 headings
  const h2s = extractTagContents(content, 'h2');
  const h3s = extractTagContents(content, 'h3');
  const allHeadingHtmls = [...h2s, ...h3s];

  // Convert to plain text
  const allHeadings: string[] = [];
  for (const h of allHeadingHtmls) {
    const text = stripHtml(h).trim();
    if (text.length > 0) {
      allHeadings.push(text);
    }
  }

  // No headings at all
  if (allHeadings.length === 0) {
    return {
      id: 'intent-paa-coverage',
      title: 'People Also Ask coverage',
      description:
        'No H2 or H3 headings found in the content. Add headings — especially question-phrased headings — to target "People Also Ask" boxes in Google.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Find question headings
  const questionHeadings: string[] = [];
  for (const heading of allHeadings) {
    if (isQuestionHeading(heading)) {
      questionHeadings.push(heading);
    }
  }

  const count = questionHeadings.length;

  // Build example list (up to 3 examples)
  const exampleLimit = Math.min(count, 3);
  const examples: string[] = [];
  for (let i = 0; i < exampleLimit; i++) {
    const example = questionHeadings[i];
    if (example !== undefined) {
      examples.push(`"${example}"`);
    }
  }
  const exampleText = examples.length > 0 ? ` Examples: ${examples.join(', ')}.` : '';

  // good (5): >= 4 question headings
  if (count >= 4) {
    return {
      id: 'intent-paa-coverage',
      title: 'People Also Ask coverage',
      description: `${count} question-phrased headings found out of ${allHeadings.length} total H2/H3 headings.${exampleText} Well-optimized for PAA visibility.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): 2-3 question headings
  if (count >= 2) {
    const needed = 4 - count;
    return {
      id: 'intent-paa-coverage',
      title: 'People Also Ask coverage',
      description: `${count} question-phrased heading${count === 1 ? '' : 's'} found out of ${allHeadings.length} total.${exampleText} Add ${needed} more question headings (What, How, Why, etc.) to improve PAA coverage.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (1): 1 question heading
  if (count === 1) {
    return {
      id: 'intent-paa-coverage',
      title: 'People Also Ask coverage',
      description: `Only 1 question-phrased heading found out of ${allHeadings.length} total.${exampleText} Add at least 3 more question headings starting with What, How, Why, When, Where, Who, or Which, or ending with a question mark.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  // poor (0): no question headings
  return {
    id: 'intent-paa-coverage',
    title: 'People Also Ask coverage',
    description: `None of the ${allHeadings.length} H2/H3 headings use question phrasing. Rephrase headings as questions (e.g. "What is X?", "How does Y work?") to target Google's "People Also Ask" feature.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
