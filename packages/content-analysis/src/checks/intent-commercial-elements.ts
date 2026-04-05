// @power-seo/content-analysis — Commercial Investigation Elements Check
// ----------------------------------------------------------------------------
// Checks whether commercial-investigation content includes the elements
// comparison shoppers expect: comparison structure, pros/cons, ratings,
// multiple options, recommendations, price comparison, and feature comparison.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

interface CommercialElement {
  name: string;
  present: boolean;
}

export function checkIntentCommercialElements(input: ContentAnalysisInput): AnalysisResult {
  const id = 'intent-commercial-elements';
  const title = 'Commercial investigation elements';

  // No keyphrase — cannot determine intent
  if (!input.focusKeyphrase || input.focusKeyphrase.trim().length === 0) {
    return {
      id,
      title,
      description: 'No focus keyphrase set.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Only applies to commercial-investigation intent
  const intent = detectIntent(input.focusKeyphrase);
  if (intent.primary !== 'commercial-investigation') {
    return {
      id,
      title,
      description: `Detected intent is "${intent.primary}" — this check only applies to commercial investigation content.`,
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const content = input.content;
  const contentLower = content.toLowerCase();
  const plainText = stripHtml(content);

  const elements: CommercialElement[] = [];

  // 1. Comparison structure: <table> present OR comparison phrases
  const hasTable = contentLower.includes('<table');
  const hasComparisonPhrase = /\b(?:compared to|side by side|head to head)\b/i.test(plainText);
  elements.push({ name: 'Comparison structure', present: hasTable || hasComparisonPhrase });

  // 2. Pros and cons
  const hasProsCons = /\b(?:pros|cons|advantages|disadvantages|benefits|drawbacks)\b/i.test(
    plainText,
  );
  elements.push({ name: 'Pros and cons', present: hasProsCons });

  // 3. Rating / scoring
  const hasRating =
    /\b(?:rating|score|stars)\b/i.test(plainText) ||
    /\/5\b/.test(plainText) ||
    /\/10\b/.test(plainText) ||
    /\bout of 10\b/i.test(plainText) ||
    /\bgrade\b/i.test(plainText);
  elements.push({ name: 'Rating/scoring', present: hasRating });

  // 4. Multiple options: 3+ capitalized multi-word phrases (brand-like patterns)
  //    Heuristic: sequences of 2+ capitalized words that look like product/brand names
  const brandPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
  const brandMatches = plainText.match(brandPattern);
  const uniqueBrands = brandMatches ? new Set(brandMatches.map((b) => b.toLowerCase())).size : 0;
  elements.push({ name: 'Multiple options (3+ products/brands)', present: uniqueBrands >= 3 });

  // 5. Recommendations
  const hasRecommendations =
    /\b(?:we recommend|our pick|best for|editor'?s choice|top choice|best overall|winner)\b/i.test(
      plainText,
    );
  elements.push({ name: 'Recommendations', present: hasRecommendations });

  // 6. Price comparison: "starting at", "from $", or price patterns appearing 2+ times
  const hasStartingAt = /\b(?:starting at|from \$)\b/i.test(plainText);
  const pricePatternMatches = plainText.match(/\$\d[\d,.]*\b/g);
  const priceCount = pricePatternMatches ? pricePatternMatches.length : 0;
  elements.push({ name: 'Price comparison', present: hasStartingAt || priceCount >= 2 });

  // 7. Feature comparison
  const hasFeatureComparison = /\b(?:features|includes|offers|supports|lacks|missing)\b/i.test(
    plainText,
  );
  elements.push({ name: 'Feature comparison', present: hasFeatureComparison });

  // Tally present elements
  const presentElements = elements.filter((e) => e.present);
  const presentCount = presentElements.length;
  const missingElements = elements.filter((e) => !e.present);

  // Scoring
  let score: number;
  let status: 'good' | 'ok' | 'poor';

  if (presentCount >= 5) {
    score = 5;
    status = 'good';
  } else if (presentCount >= 3) {
    score = 3;
    status = 'ok';
  } else {
    score = 1;
    status = 'poor';
  }

  // Build description
  const presentList = presentElements.map((e) => e.name).join(', ');
  const missingList = missingElements.map((e) => e.name).join(', ');

  let description: string;
  if (presentCount >= 5) {
    description = `Strong commercial investigation content (${presentCount}/7 elements). Present: ${presentList}.`;
    if (missingElements.length > 0) {
      description += ` Consider also adding: ${missingList}.`;
    }
  } else if (presentCount >= 3) {
    description = `Acceptable commercial investigation content (${presentCount}/7 elements). Present: ${presentList}. Missing: ${missingList}.`;
  } else {
    description = `Commercial investigation content lacks key elements (${presentCount}/7).${presentCount > 0 ? ` Present: ${presentList}.` : ''} Missing: ${missingList}.`;
  }

  return { id, title, description, status, score, maxScore: 5 };
}
