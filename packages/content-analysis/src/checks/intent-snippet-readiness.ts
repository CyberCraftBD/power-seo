// @power-seo/content-analysis — Featured Snippet Readiness Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, extractTagContents } from '@power-seo/core';

// ---------------------------------------------------------------------------
// Snippet pattern detectors
// ---------------------------------------------------------------------------

interface SnippetPattern {
  name: string;
  found: boolean;
}

/**
 * Check for a definition paragraph within the first 300 words.
 * Google favours concise 40-60 word answers for position zero.
 */
function hasDefinitionParagraph(html: string): boolean {
  const paragraphs = extractTagContents(html, 'p');
  const plainText = stripHtml(html);
  const allWords = getWords(plainText);

  // We only care about paragraphs whose text falls within the first 300 words.
  let cumulativeWords = 0;

  for (const para of paragraphs) {
    const paraPlain = stripHtml(para);
    const paraWords = getWords(paraPlain);

    if (cumulativeWords >= 300) break;
    cumulativeWords += paraWords.length;

    // Check length: 40-60 words is Google's sweet spot
    if (paraWords.length < 40 || paraWords.length > 60) continue;

    // Check for definitional phrases
    const lower = paraPlain.toLowerCase();
    if (
      /\bis\s+a\b/.test(lower) ||
      /\brefers\s+to\b/.test(lower) ||
      /\bis\s+defined\s+as\b/.test(lower) ||
      /\bmeans\b/.test(lower)
    ) {
      return true;
    }
  }

  // Also handle content that doesn't use <p> tags but still has early definition text
  if (paragraphs.length === 0 && allWords.length >= 40) {
    const first300 = allWords.slice(0, 300).join(' ').toLowerCase();
    // Try to find a 40-60 word segment with a definitional phrase
    if (
      /\bis\s+a\b/.test(first300) ||
      /\brefers\s+to\b/.test(first300) ||
      /\bis\s+defined\s+as\b/.test(first300) ||
      /\bmeans\b/.test(first300)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Check for numbered/ordered list: <ol> with 3+ <li>, or step-pattern headings.
 */
function hasOrderedList(html: string): boolean {
  // Check for <ol> with 3+ items
  const olBlocks = extractTagContents(html, 'ol');
  for (const ol of olBlocks) {
    const items = extractTagContents(ol, 'li');
    if (items.length >= 3) return true;
  }

  // Check for step-pattern headings ("Step 1", "Step 2", etc.)
  const h2s = extractTagContents(html, 'h2');
  const h3s = extractTagContents(html, 'h3');
  const allHeadings = [...h2s, ...h3s];

  let stepCount = 0;
  for (const heading of allHeadings) {
    const headingText = stripHtml(heading).toLowerCase();
    if (/step\s+\d+/i.test(headingText)) {
      stepCount++;
    }
  }

  return stepCount >= 3;
}

/**
 * Check for bullet/unordered list: <ul> with 3+ <li> items.
 */
function hasBulletList(html: string): boolean {
  const ulBlocks = extractTagContents(html, 'ul');
  for (const ul of ulBlocks) {
    const items = extractTagContents(ul, 'li');
    if (items.length >= 3) return true;
  }
  return false;
}

/**
 * Check for a table with at least 2 rows.
 */
function hasTable(html: string): boolean {
  const tables = extractTagContents(html, 'table');
  for (const table of tables) {
    const rows = extractTagContents(table, 'tr');
    if (rows.length >= 2) return true;
  }
  return false;
}

/**
 * Check for question-answer pattern: an H2/H3 that contains a question word,
 * followed by a paragraph of 30-80 words.
 */
function hasQuestionAnswerPattern(html: string): boolean {
  const questionWords = /\b(?:what|how|why|when|where|who|can|does|is)\b/i;

  // We need to find headings followed by paragraphs in the HTML structure.
  // Strategy: look for h2/h3 openings, check if they contain a question word,
  // then look for the next <p> and check its word count.
  // Find all h2 and h3 positions with their content
  const headingRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html)) !== null) {
    const headingContent = match[1];
    if (headingContent === undefined) continue;

    const headingText = stripHtml(headingContent);

    if (!questionWords.test(headingText)) continue;

    // Look for the next <p> tag after this heading
    const afterHeading = html.slice(match.index + match[0].length);
    const nextParagraphs = extractTagContents(afterHeading, 'p');
    const firstParagraph = nextParagraphs[0];

    if (firstParagraph !== undefined) {
      const paraText = stripHtml(firstParagraph);
      const paraWordCount = getWords(paraText).length;
      if (paraWordCount >= 30 && paraWordCount <= 80) {
        return true;
      }
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentSnippetReadiness(input: ContentAnalysisInput): AnalysisResult {
  const { content, focusKeyphrase } = input;

  const patterns: SnippetPattern[] = [
    { name: 'definition paragraph (40-60 words)', found: hasDefinitionParagraph(content) },
    { name: 'numbered/ordered list (3+ items)', found: hasOrderedList(content) },
    { name: 'bullet list (3+ items)', found: hasBulletList(content) },
    { name: 'data table (2+ rows)', found: hasTable(content) },
    { name: 'question-answer pattern', found: hasQuestionAnswerPattern(content) },
  ];

  const found = patterns.filter((p) => p.found);
  const missing = patterns.filter((p) => !p.found);
  const count = found.length;

  const keyphraseNote =
    !focusKeyphrase || focusKeyphrase.trim().length === 0
      ? ' No focus keyphrase set — snippet patterns still matter but targeting improves with one.'
      : '';

  // good (5): 3+ snippet patterns
  if (count >= 3) {
    const foundNames = found.map((p) => p.name).join(', ');
    return {
      id: 'intent-snippet-readiness',
      title: 'Featured snippet readiness',
      description: `Content has ${count} snippet-ready patterns: ${foundNames}. Well-structured for position zero.${keyphraseNote}`,
      status: 'good',
      score: 6,
      maxScore: 6,
    };
  }

  // ok (3): 1-2 snippet patterns
  if (count >= 1) {
    const foundNames = found.map((p) => p.name).join(', ');
    const missingNames = missing.map((p) => p.name).join(', ');
    return {
      id: 'intent-snippet-readiness',
      title: 'Featured snippet readiness',
      description: `Found ${count} snippet pattern${count === 1 ? '' : 's'}: ${foundNames}. Consider adding: ${missingNames}.${keyphraseNote}`,
      status: 'ok',
      score: 4,
      maxScore: 6,
    };
  }

  // poor (0): no snippet patterns
  const missingNames = missing.map((p) => p.name).join(', ');
  return {
    id: 'intent-snippet-readiness',
    title: 'Featured snippet readiness',
    description: `No snippet-ready patterns found. Add at least one of: ${missingNames}. These structures help win Google's featured snippet (position zero).${keyphraseNote}`,
    status: 'poor',
    score: 0,
    maxScore: 6,
  };
}
