// @power-seo/content-analysis — Rich Result Schema Readiness Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, extractTagContents } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Schema type detectors
// ---------------------------------------------------------------------------

interface SchemaCandidate {
  type: string;
  applicable: boolean;
  reason: string;
  implementation: string;
}

/**
 * FAQPage: 2+ headings that are questions, each followed by answer paragraphs.
 */
function checkFAQPage(html: string): SchemaCandidate {
  const questionWords = /\b(?:who|what|when|where|why|how|can|does|is)\b/i;

  let questionHeadingCount = 0;

  // Use regex to find headings followed by paragraph content
  const headingRegex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html)) !== null) {
    const headingContent = match[1];
    if (headingContent === undefined) continue;

    const headingText = stripHtml(headingContent);
    if (!questionWords.test(headingText) && !headingText.includes('?')) continue;

    // Check that a paragraph follows
    const afterHeading = html.slice(match.index + match[0].length);
    const nextParagraphs = extractTagContents(afterHeading, 'p');
    const firstPara = nextParagraphs[0];

    if (firstPara !== undefined) {
      const paraText = stripHtml(firstPara);
      if (getWords(paraText).length >= 5) {
        questionHeadingCount++;
      }
    }
  }

  return {
    type: 'FAQPage',
    applicable: questionHeadingCount >= 2,
    reason: questionHeadingCount >= 2
      ? `${questionHeadingCount} question-answer pairs detected in headings`
      : 'Needs 2+ headings phrased as questions with answer paragraphs',
    implementation: 'Add FAQPage schema with @type Question/Answer for each pair',
  };
}

/**
 * HowTo: Step-by-step structure — ordered list or "Step N:" patterns, 3+ steps.
 */
function checkHowTo(html: string): SchemaCandidate {
  let stepCount = 0;

  // Check for <ol> with 3+ <li>
  const olBlocks = extractTagContents(html, 'ol');
  for (const ol of olBlocks) {
    const items = extractTagContents(ol, 'li');
    if (items.length >= 3) {
      stepCount = Math.max(stepCount, items.length);
    }
  }

  // Check for step-pattern headings
  const h2s = extractTagContents(html, 'h2');
  const h3s = extractTagContents(html, 'h3');
  const allHeadings = [...h2s, ...h3s];

  let stepHeadingCount = 0;
  for (const heading of allHeadings) {
    const headingText = stripHtml(heading);
    if (/step\s+\d+/i.test(headingText)) {
      stepHeadingCount++;
    }
  }
  stepCount = Math.max(stepCount, stepHeadingCount);

  return {
    type: 'HowTo',
    applicable: stepCount >= 3,
    reason: stepCount >= 3
      ? `${stepCount}-step structure detected`
      : 'Needs ordered list or "Step N:" headings with 3+ steps',
    implementation: 'Add HowTo schema with @type HowToStep for each step',
  };
}

/**
 * Product: Transactional content with price mentions, product name in title,
 * specs/features sections.
 */
function checkProduct(html: string, input: ContentAnalysisInput): SchemaCandidate {
  const plainText = stripHtml(html);
  const lower = plainText.toLowerCase();
  const detected = input.focusKeyphrase
    ? detectIntent(input.focusKeyphrase)
    : null;

  let signals = 0;
  const details: string[] = [];

  // Price mentions: $X.XX or "price:"
  if (/\$\d+(?:\.\d{2})?/.test(plainText) || /\bprice\s*:/i.test(plainText)) {
    signals++;
    details.push('price info');
  }

  // Transactional intent
  if (detected && (detected.primary === 'transactional' || detected.primary === 'commercial-investigation')) {
    signals++;
    details.push('transactional/commercial intent');
  }

  // Product name in title
  if (input.title && input.focusKeyphrase) {
    const titleLower = input.title.toLowerCase();
    const keyphraseLower = input.focusKeyphrase.toLowerCase();
    if (titleLower.includes(keyphraseLower)) {
      signals++;
      details.push('keyphrase in title');
    }
  }

  // Specs/features sections
  if (
    /\b(?:specifications|specs|features|dimensions|weight|compatibility)\b/i.test(lower)
  ) {
    signals++;
    details.push('specs/features section');
  }

  const applicable = signals >= 2;
  return {
    type: 'Product',
    applicable,
    reason: applicable
      ? `Product signals: ${details.join(', ')}`
      : 'Needs price info, product name in title, and specs/features sections',
    implementation: 'Add Product schema with name, description, offers, and brand',
  };
}

/**
 * Review/AggregateRating: Rating patterns, pros/cons, verdict sections.
 */
function checkReview(html: string): SchemaCandidate {
  const plainText = stripHtml(html);
  const lower = plainText.toLowerCase();

  let signals = 0;
  const details: string[] = [];

  // Rating patterns: "/5", "/10", "stars", "score:"
  if (/\/\s*5\b/.test(plainText) || /\/\s*10\b/.test(plainText)) {
    signals++;
    details.push('rating scale');
  }
  if (/\bstars?\b/i.test(plainText)) {
    signals++;
    details.push('star rating');
  }
  if (/\bscore\s*:/i.test(plainText)) {
    signals++;
    details.push('score mention');
  }

  // Pros/cons sections
  if (/\b(?:pros|advantages)\b/i.test(lower) && /\b(?:cons|disadvantages)\b/i.test(lower)) {
    signals++;
    details.push('pros/cons');
  }

  // Verdict/conclusion
  if (/\b(?:verdict|final\s+(?:thoughts|verdict)|conclusion|bottom\s+line)\b/i.test(lower)) {
    signals++;
    details.push('verdict/conclusion');
  }

  const applicable = signals >= 2;
  return {
    type: 'Review',
    applicable,
    reason: applicable
      ? `Review signals: ${details.join(', ')}`
      : 'Needs rating patterns (/5, stars), pros/cons, and verdict sections',
    implementation: 'Add Review schema with reviewRating, author, and itemReviewed',
  };
}

/**
 * Article: Has author info, publish date, and content > 300 words.
 */
function checkArticle(input: ContentAnalysisInput): SchemaCandidate {
  const plainText = stripHtml(input.content);
  const wordCount = getWords(plainText).length;

  let signals = 0;
  const details: string[] = [];

  if (input.author?.name) {
    signals++;
    details.push('author name');
  }

  if (input.publishDate) {
    signals++;
    details.push('publish date');
  }

  if (wordCount > 300) {
    signals++;
    details.push(`${wordCount} words`);
  }

  const applicable = signals >= 2;
  return {
    type: 'Article',
    applicable,
    reason: applicable
      ? `Article signals: ${details.join(', ')}`
      : 'Needs author name, publish date, and 300+ words',
    implementation: 'Add Article schema with headline, author, datePublished, and publisher',
  };
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentSchemaReadiness(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;
  const plainText = stripHtml(content);
  const wordCount = getWords(plainText).length;

  // Too short — can't meaningfully assess schema readiness
  if (wordCount < 100) {
    return {
      id: 'intent-schema-readiness',
      title: 'Rich result schema readiness',
      description: `Content is only ${wordCount} words. At least 100 words are needed to assess rich result schema opportunities.`,
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const candidates: SchemaCandidate[] = [
    checkFAQPage(content),
    checkHowTo(content),
    checkProduct(content, input),
    checkReview(content),
    checkArticle(input),
  ];

  const applicable = candidates.filter((c) => c.applicable);
  const notApplicable = candidates.filter((c) => !c.applicable);
  const count = applicable.length;

  // good (5): 2+ applicable schemas
  if (count >= 2) {
    const schemaList = applicable
      .map((c) => `${c.type} (${c.reason})`)
      .join('; ');
    const implList = applicable
      .map((c) => `${c.type}: ${c.implementation}`)
      .join('. ');
    return {
      id: 'intent-schema-readiness',
      title: 'Rich result schema readiness',
      description: `${count} rich result schemas applicable: ${schemaList}. Implementation: ${implList}.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): 1 schema applicable
  if (count === 1) {
    const schema = applicable[0];
    if (schema === undefined) {
      // Safety guard — should never happen since count === 1
      return {
        id: 'intent-schema-readiness',
        title: 'Rich result schema readiness',
        description: 'Unable to determine applicable schemas.',
        status: 'poor',
        score: 1,
        maxScore: 5,
      };
    }

    const closestMiss = notApplicable[0];
    const suggestion = closestMiss !== undefined
      ? ` Consider restructuring for ${closestMiss.type}: ${closestMiss.reason}.`
      : '';

    return {
      id: 'intent-schema-readiness',
      title: 'Rich result schema readiness',
      description: `1 rich result schema applicable: ${schema.type} (${schema.reason}). ${schema.implementation}.${suggestion}`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (1): no schemas applicable
  const suggestions = notApplicable
    .slice(0, 3)
    .map((c) => `${c.type}: ${c.reason}`)
    .join('; ');
  return {
    id: 'intent-schema-readiness',
    title: 'Rich result schema readiness',
    description: `Content structure does not support any rich result schemas. To qualify, address: ${suggestions}.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
