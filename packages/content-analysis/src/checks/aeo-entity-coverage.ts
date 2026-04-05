// @power-seo/content-analysis — AEO: Entity Coverage Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

/**
 * Estimates named entity density — proper nouns, brand names, technologies,
 * places, people, and numbers used as entity identifiers.
 * Kalicube AEO study (2025): 15+ entities per 1,000 words = 4.8× higher AI
 * selection rate vs content with <5 entities per 1,000 words.
 * Target: 15–25 named entities per 1,000 words.
 */
function estimateEntityDensity(plain: string, wordCount: number): {
  entityCount: number;
  entitiesPerThousand: number;
} {
  // Named entities heuristics (capitalised sequences not at sentence start)
  // 1. Title-cased multi-word phrases: "Google Analytics", "Next.js", "United States"
  const titleCaseEntities = plain.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g);
  const titleCount = titleCaseEntities?.length ?? 0;

  // 2. Single proper nouns (not at sentence start — simplistic but effective)
  const singlePropers = plain.match(/(?:^|\s)([A-Z][a-z]{2,})\b/g);
  // Filter out common sentence-starting words
  const commonSentenceStarters = new Set([
    'The', 'This', 'That', 'These', 'Those', 'It', 'He', 'She', 'They', 'We',
    'In', 'On', 'At', 'By', 'For', 'With', 'And', 'But', 'Or', 'If', 'As',
    'An', 'A', 'Is', 'Are', 'Was', 'Were', 'Have', 'Has', 'Had', 'Will',
    'When', 'Where', 'What', 'How', 'Why', 'Who', 'Which',
  ]);
  const filteredSingles = (singlePropers ?? []).filter((w) => {
    const word = w.trim();
    return !commonSentenceStarters.has(word);
  });
  const singleCount = Math.min(filteredSingles.length, titleCount * 2); // cap to avoid false positives

  // 3. Technology / product names with mixed case or dots: JavaScript, Next.js, ChatGPT
  const techNames = plain.match(/\b(?:[A-Z][a-zA-Z]*[A-Z][a-zA-Z]*|[A-Za-z]+\.[a-z]{2,4}(?:\s|$))\b/g);
  const techCount = techNames?.length ?? 0;

  // 4. Version numbers used as entity signals: v1.0, 2024, GPT-4
  const versionNumbers = plain.match(/\b(?:v\d+(?:\.\d+)*|GPT-\d|gpt-\d|\d{4})\b/g);
  const versionCount = versionNumbers?.length ?? 0;

  // Sum with weighting to avoid over-counting
  const rawCount = titleCount + Math.floor(singleCount * 0.3) + Math.floor(techCount * 0.5) + Math.floor(versionCount * 0.5);
  const entityCount = Math.max(rawCount, 0);
  const entitiesPerThousand = wordCount > 0 ? (entityCount / wordCount) * 1000 : 0;

  return { entityCount, entitiesPerThousand };
}

export function checkAeoEntityCoverage(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;
  const plain = stripHtml(content);
  const words = getWords(plain);
  const wordCount = words.length;

  if (wordCount < 200) {
    return {
      id: 'aeo-entity-coverage',
      title: 'Named entity coverage (AEO)',
      description: 'Add more content to evaluate entity density.',
      status: 'na',
      score: 0,
      maxScore: 9,
    };
  }

  const { entityCount, entitiesPerThousand } = estimateEntityDensity(plain, wordCount);

  if (entitiesPerThousand >= 15) {
    return {
      id: 'aeo-entity-coverage',
      title: 'Named entity coverage (AEO)',
      description: `Estimated ${entityCount} named entities across ${wordCount} words (${entitiesPerThousand.toFixed(1)}/1,000 words). Strong entity coverage — Kalicube AEO study: 15+ entities per 1,000 words yields 4.8× higher AI engine selection rate.`,
      status: 'good',
      score: 9,
      maxScore: 9,
    };
  }

  if (entitiesPerThousand >= 7) {
    return {
      id: 'aeo-entity-coverage',
      title: 'Named entity coverage (AEO)',
      description: `Estimated ${entityCount} named entities (${entitiesPerThousand.toFixed(1)}/1,000 words). Target 15–25 entities per 1,000 words. Mention specific tools, brands, people, organisations, standards, and technologies by name to build entity richness and improve AI engine citability.`,
      status: 'ok',
      score: 5,
      maxScore: 9,
    };
  }

  return {
    id: 'aeo-entity-coverage',
    title: 'Named entity coverage (AEO)',
    description: `Low entity coverage: ~${entityCount} named entities in ${wordCount} words (${entitiesPerThousand.toFixed(1)}/1,000 words). Kalicube AEO study: content with <5 entities per 1,000 words is 4.8× less likely to be cited by AI engines. Name specific tools, people, organisations, technologies, and standards throughout your content.`,
    status: 'poor',
    score: 1,
    maxScore: 9,
  };
}
