// @power-seo/content-analysis — AEO: Structured Data Hints Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

/**
 * Detects structured content patterns: tables, numbered processes, feature lists,
 * how-to steps, and comparison structures. AI engines extract these 3.8× more
 * often than unstructured prose (SurferSEO AI content analysis, Q4 2025).
 */
function detectStructuredPatterns(html: string, plain: string): {
  hasTables: boolean;
  hasNumberedProcess: boolean;
  hasComparisonList: boolean;
  hasHowTo: boolean;
  patternCount: number;
} {
  const hasTables = /<table[\s>]/i.test(html);

  // Numbered step patterns: "Step 1:", "1. Do this", "First, ... Second, ..."
  const numberedProcessPatterns = [
    /\bstep\s+\d+\b/gi,
    /\b(?:first|second|third|fourth|fifth),\s/gi,
    /^\s*\d+\.\s+[A-Z]/m,
  ];
  const hasNumberedProcess = numberedProcessPatterns.some((p) => p.test(plain));

  // Comparison / feature list: "vs", "versus", "pros and cons", "advantages", "compared to"
  const comparisonPattern = /\b(?:vs\.?|versus|pros?\s+and\s+cons?|advantages?\s+and\s+disadvantages?|compared\s+to|comparison)\b/i;
  const hasComparisonList = comparisonPattern.test(plain);

  // How-to patterns: "how to", "instructions", numbered lists in HTML
  const hasHowTo = /\bhow\s+to\b/i.test(plain) && (/<ol[\s>]/i.test(html) || /<li[\s>]/i.test(html));

  const patternCount = [hasTables, hasNumberedProcess, hasComparisonList, hasHowTo].filter(Boolean).length;

  return { hasTables, hasNumberedProcess, hasComparisonList, hasHowTo, patternCount };
}

export function checkAeoStructuredDataHints(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;
  const plain = stripHtml(content);
  const wordCount = getWords(plain).length;

  if (wordCount < 150) {
    return {
      id: 'aeo-structured-data-hints',
      title: 'Structured content patterns (AEO)',
      description: 'Add more content to evaluate structured formatting.',
      status: 'na',
      score: 0,
      maxScore: 7,
    };
  }

  const { hasTables, hasNumberedProcess, hasComparisonList, hasHowTo, patternCount } = detectStructuredPatterns(content, plain);

  if (patternCount >= 2) {
    const patterns = [
      hasTables && 'table',
      hasNumberedProcess && 'numbered steps',
      hasComparisonList && 'comparison',
      hasHowTo && 'how-to list',
    ].filter(Boolean).join(', ');

    return {
      id: 'aeo-structured-data-hints',
      title: 'Structured content patterns (AEO)',
      description: `Structured patterns detected: ${patterns}. Great — AI engines extract structured content 3.8× more often than unstructured prose. Add HowTo or Table schema (JSON-LD) to maximise eligibility.`,
      status: 'good',
      score: 7,
      maxScore: 7,
    };
  }

  if (patternCount === 1) {
    return {
      id: 'aeo-structured-data-hints',
      title: 'Structured content patterns (AEO)',
      description: 'One structured pattern found. Add more: numbered step-by-step processes, comparison tables, feature lists, or how-to ordered lists. Each additional structure type increases AI engine extraction probability.',
      status: 'ok',
      score: 4,
      maxScore: 7,
    };
  }

  return {
    id: 'aeo-structured-data-hints',
    title: 'Structured content patterns (AEO)',
    description: 'No structured content patterns detected. Add tables, numbered step-by-step processes, comparison sections ("X vs Y"), or how-to ordered lists. AI engines extract structured content 3.8× more often — and these patterns unlock Rich Results (HowTo, Table schema) in Google.',
    status: 'poor',
    score: 0,
    maxScore: 7,
  };
}
