// @power-seo/content-analysis — Informational Content Completeness Check
// ----------------------------------------------------------------------------
// Checks whether informational content covers the elements readers expect:
// definitions, examples, subtopics, takeaways, citations, visuals, and depth.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

interface CompletenessElement {
  name: string;
  present: boolean;
}

export function checkIntentInformationalCompleteness(
  input: ContentAnalysisInput,
): AnalysisResult {
  const id = 'intent-informational-completeness';
  const title = 'Informational content completeness';

  // No keyphrase — cannot determine intent
  if (!input.focusKeyphrase || input.focusKeyphrase.trim().length === 0) {
    return { id, title, description: 'No focus keyphrase set.', status: 'na', score: 0, maxScore: 5 };
  }

  // Only applies to informational intent
  const intent = detectIntent(input.focusKeyphrase);
  if (intent.primary !== 'informational') {
    return {
      id,
      title,
      description: `Detected intent is "${intent.primary}" — this check only applies to informational content.`,
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const content = input.content;
  const contentLower = content.toLowerCase();
  const plainText = stripHtml(content);
  const plainTextLower = plainText.toLowerCase();
  const words = getWords(content);
  const wordCount = words.length;

  const elements: CompletenessElement[] = [];

  // 1. Definitions / explanations
  const hasDefinitions = /\b(?:is a|refers to|means|defined as|in other words|simply put)\b/i.test(plainText);
  elements.push({ name: 'Definitions/explanations', present: hasDefinitions });

  // 2. Examples
  const hasExamples = /\b(?:for example|for instance|such as|e\.g\.|consider)\b/i.test(plainText)
    || /\blike\b/i.test(plainTextLower);
  elements.push({ name: 'Examples', present: hasExamples });

  // 3. Subtopics coverage (>= 3 H2/H3 headings)
  const h2Matches = contentLower.split('<h2').length - 1;
  const h3Matches = contentLower.split('<h3').length - 1;
  const headingCount = h2Matches + h3Matches;
  elements.push({ name: 'Subtopics (3+ headings)', present: headingCount >= 3 });

  // 4. Actionable takeaways
  const hasTakeaways = /\b(?:key takeaway|in summary|bottom line|action step|next step|to summarize|remember)\b/i.test(plainText);
  elements.push({ name: 'Actionable takeaways', present: hasTakeaways });

  // 5. Source citations (external links >= 2)
  const externalLinkRegex = /<a\s[^>]*href\s*=\s*["']https?:\/\//gi;
  const externalLinkMatches = content.match(externalLinkRegex);
  const externalLinkCount = externalLinkMatches ? externalLinkMatches.length : 0;
  elements.push({ name: 'Source citations (2+ external links)', present: externalLinkCount >= 2 });

  // 6. Visual aids (images >= 1)
  const imgCount = contentLower.split('<img').length - 1;
  elements.push({ name: 'Visual aids (images)', present: imgCount >= 1 });

  // 7. Depth (word count >= 1000)
  elements.push({ name: 'Depth (1000+ words)', present: wordCount >= 1000 });

  // Tally present elements
  const presentElements = elements.filter((e) => e.present);
  const presentCount = presentElements.length;
  const missingElements = elements.filter((e) => !e.present);

  // Score: 1 point per element, capped at 5
  const score = Math.min(presentCount, 5);

  // Build description
  const presentList = presentElements.map((e) => e.name).join(', ');
  const missingList = missingElements.map((e) => e.name).join(', ');

  let description: string;
  if (presentCount >= 5) {
    description = `Excellent informational completeness (${presentCount}/7 elements). Present: ${presentList}.`;
    if (missingElements.length > 0) {
      description += ` Consider also adding: ${missingList}.`;
    }
  } else if (presentCount >= 3) {
    description = `Acceptable informational completeness (${presentCount}/7 elements). Present: ${presentList}. Missing: ${missingList}.`;
  } else {
    description = `Informational content lacks completeness (${presentCount}/7 elements).${presentCount > 0 ? ` Present: ${presentList}.` : ''} Missing: ${missingList}.`;
  }

  let status: 'good' | 'ok' | 'poor';
  if (presentCount >= 5) {
    status = 'good';
  } else if (presentCount >= 3) {
    status = 'ok';
  } else {
    status = 'poor';
  }

  return { id, title, description, status, score, maxScore: 5 };
}
