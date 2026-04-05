// @power-seo/content-analysis — E-E-A-T: Specificity & Detail Depth
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

// Vague filler phrases that indicate low specificity
const VAGUE_PHRASES: RegExp[] = [
  /\bvery\s+(good|nice|great|important|useful|helpful|interesting|fast|slow|big|small|easy|hard)\b/gi,
  /\breally\s+(good|nice|great|important|useful|helpful|amazing|fast|awesome)\b/gi,
  /\bamazing\s+(product|tool|service|solution|thing)\b/gi,
  /\bincredibly\s+(useful|helpful|important|powerful)\b/gi,
  /\ba\s+lot\s+of\s+(people|users|companies)\b/gi,
  /\bmany\s+(people|users|experts)\s+(say|think|believe|agree)\b/gi,
  /\beveryone\s+(knows|agrees|says)\b/gi,
  /\bit['']?s?\s+well.known\s+that\b/gi,
  /\bobviously\b/gi,
  /\bclearly\b/gi,
  /\bbasically\b/gi,
  /\bsomehow\b/gi,
  /\bsort\s+of\b/gi,
  /\bkind\s+of\b/gi,
  /\bstuff\s+like\s+that\b/gi,
  /\band\s+so\s+on\b/gi,
  /\betc\.?\s/gi,
  /\bthings\s+like\s+that\b/gi,
  /\bmore\s+or\s+less\b/gi,
];

// Specific detail patterns that indicate high specificity
const SPECIFIC_PATTERNS: RegExp[] = [
  // Exact numbers with context
  /\b\d+(\.\d+)?\s*(ms|milliseconds?|seconds?|minutes?|hours?|days?|weeks?|months?|years?|GB|MB|KB|TB|px|em|rem|%|mph|km|miles?|kg|lbs?|dollars?|USD|EUR|GBP)\b/gi,
  // Version numbers
  /\bv?\d+\.\d+(\.\d+)?\b/g,
  // Dates
  /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
  /\b\d{4}-\d{2}-\d{2}\b/g,
  // Proper nouns / product names (capitalized multi-word)
  /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g,
  // Specific measurements
  /\b\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\b/gi,
  // Code references
  /`[^`]+`/g,
  // Exact percentages with decimals
  /\b\d+\.\d+\s*%/g,
  // Price points
  /\$\d+(\.\d{2})?/g,
  // URLs/paths mentioned
  /\bhttps?:\/\/[^\s<>"]+/gi,
  // Named tools/technologies
  /\b(using|with|via|through)\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\b/g,
];

export function checkSpecificityDepth(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content || '');
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 50) {
    return {
      id: 'eeat-specificity-depth',
      title: 'Content specificity',
      description: 'Content is too short to analyze specificity.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  let vagueCount = 0;
  for (const pattern of VAGUE_PHRASES) {
    const matches = plainText.match(pattern);
    if (matches) vagueCount += matches.length;
  }

  let specificCount = 0;
  for (const pattern of SPECIFIC_PATTERNS) {
    const matches = (input.content || '').match(pattern);
    if (matches) specificCount += matches.length;
  }

  const specificDensity = (specificCount / wordCount) * 500;
  const specificityRatio =
    specificCount > 0 && vagueCount > 0
      ? specificCount / (specificCount + vagueCount)
      : specificCount > 0
        ? 1
        : 0;

  if (specificDensity >= 5 && specificityRatio >= 0.7) {
    return {
      id: 'eeat-specificity-depth',
      title: 'Content specificity',
      description: `Excellent detail depth with ${specificCount} specific data points (numbers, dates, versions, measurements). Content demonstrates thorough knowledge.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (specificDensity >= 2 && specificityRatio >= 0.4) {
    const suggestions: string[] = [];
    if (vagueCount > 3) suggestions.push(`replace ${vagueCount} vague phrases with specific data`);
    if (specificDensity < 5) suggestions.push('add more exact numbers, dates, and measurements');
    return {
      id: 'eeat-specificity-depth',
      title: 'Content specificity',
      description: `Moderate specificity (${specificCount} specific details, ${vagueCount} vague phrases). ${suggestions.join('; ')}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-specificity-depth',
    title: 'Content specificity',
    description: `Low content specificity (${vagueCount} vague phrases, only ${specificCount} specific details). Replace generic language ("very good", "really helpful") with exact numbers, dates, version numbers, measurements, and named tools/products.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
