// ============================================================================
// @power-seo/ai — SERP Feature Prediction Prompt Builder & Parser
// ============================================================================

import { stripHtml, getWords } from '@power-seo/core';
import type { PromptTemplate, SerpFeatureInput, SerpFeaturePrediction } from '../types.js';

export function buildSerpPredictionPrompt(input: SerpFeatureInput): PromptTemplate {
  const plainText = stripHtml(input.content);
  const contentExcerpt = plainText.length > 800 ? plainText.slice(0, 800) + '...' : plainText;

  let userPrompt = `Predict which SERP features this content might be eligible for.\n\n`;
  userPrompt += `Title: ${input.title}\n`;
  userPrompt += `Content excerpt: ${contentExcerpt}\n`;
  if (input.schema && input.schema.length > 0) {
    userPrompt += `Schema types present: ${input.schema.join(', ')}\n`;
  }
  if (input.contentType) {
    userPrompt += `Content type: ${input.contentType}\n`;
  }
  userPrompt += `\nReturn a JSON array of predictions:\n`;
  userPrompt += `[{ "feature": "featured-snippet"|"faq-rich-result"|"how-to"|"product"|"review"|"video"|"image-pack"|"local-pack"|"sitelinks", "likelihood": 0-1, "requirements": ["..."], "met": ["..."] }]\n`;
  userPrompt += `Return ONLY the JSON array.`;

  return {
    system:
      'You are a SERP feature analyst. Predict which Google SERP features a page might qualify for based on its content, schema markup, and structure. Be realistic about likelihood scores.',
    user: userPrompt,
    maxTokens: 1000,
  };
}

export function parseSerpPredictionResponse(response: string): SerpFeaturePrediction[] {
  try {
    let cleaned = response.trim();

    if (cleaned.startsWith('```')) {
      const firstNewline = cleaned.indexOf('\n');
      cleaned = cleaned.slice(firstNewline + 1);
      const lastFence = cleaned.lastIndexOf('```');
      if (lastFence !== -1) {
        cleaned = cleaned.slice(0, lastFence);
      }
    }

    cleaned = cleaned.trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item: Record<string, unknown>) =>
        item &&
        typeof item.feature === 'string' &&
        typeof item.likelihood === 'number' &&
        Array.isArray(item.requirements) &&
        Array.isArray(item.met),
    ) as SerpFeaturePrediction[];
  } catch {
    return [];
  }
}

const FAQ_PATTERNS = [
  /\bwhat\s+is\b/i,
  /\bhow\s+to\b/i,
  /\bwhy\s+(do|does|is|are)\b/i,
  /\bcan\s+(i|you|we)\b/i,
];
const HOWTO_PATTERNS = [
  /\bstep\s+\d+/i,
  /\bstep\s+one\b/i,
  /\bfirst[,:]?\s/i,
  /\bnext[,:]?\s/i,
  /\bfinally[,:]?\s/i,
];

export function analyzeSerpEligibility(input: SerpFeatureInput): SerpFeaturePrediction[] {
  const predictions: SerpFeaturePrediction[] = [];
  const plainText = stripHtml(input.content);
  const words = getWords(plainText);
  const schemaTypes = input.schema ?? [];

  // FAQ detection
  {
    const requirements = ['Question-answer content structure', 'FAQPage schema markup'];
    const met: string[] = [];
    let likelihood = 0.1;

    if (schemaTypes.some((s) => s.toLowerCase().includes('faqpage'))) {
      met.push('FAQPage schema markup');
      likelihood += 0.4;
    }

    const faqMatches = FAQ_PATTERNS.filter((p) => p.test(plainText));
    if (faqMatches.length >= 2) {
      met.push('Question-answer content structure');
      likelihood += 0.3;
    }

    predictions.push({
      feature: 'faq-rich-result',
      likelihood: Math.min(likelihood, 1),
      requirements,
      met,
    });
  }

  // HowTo detection
  {
    const requirements = ['Step-by-step content', 'HowTo schema markup'];
    const met: string[] = [];
    let likelihood = 0.1;

    if (schemaTypes.some((s) => s.toLowerCase().includes('howto'))) {
      met.push('HowTo schema markup');
      likelihood += 0.4;
    }

    const stepMatches = HOWTO_PATTERNS.filter((p) => p.test(plainText));
    if (stepMatches.length >= 2) {
      met.push('Step-by-step content');
      likelihood += 0.3;
    }

    predictions.push({ feature: 'how-to', likelihood: Math.min(likelihood, 1), requirements, met });
  }

  // Product detection
  {
    const requirements = ['Product schema markup', 'Price and availability data'];
    const met: string[] = [];
    let likelihood = 0.1;

    if (schemaTypes.some((s) => s.toLowerCase().includes('product'))) {
      met.push('Product schema markup');
      likelihood += 0.5;
    }

    predictions.push({
      feature: 'product',
      likelihood: Math.min(likelihood, 1),
      requirements,
      met,
    });
  }

  // Review detection
  {
    const requirements = ['Review or AggregateRating schema', 'Star rating data'];
    const met: string[] = [];
    let likelihood = 0.1;

    if (
      schemaTypes.some(
        (s) => s.toLowerCase().includes('review') || s.toLowerCase().includes('aggregaterating'),
      )
    ) {
      met.push('Review or AggregateRating schema');
      likelihood += 0.5;
    }

    predictions.push({ feature: 'review', likelihood: Math.min(likelihood, 1), requirements, met });
  }

  // Video detection
  {
    const requirements = ['VideoObject schema markup', 'Embedded video content'];
    const met: string[] = [];
    let likelihood = 0.1;

    if (schemaTypes.some((s) => s.toLowerCase().includes('videoobject'))) {
      met.push('VideoObject schema markup');
      likelihood += 0.5;
    }

    predictions.push({ feature: 'video', likelihood: Math.min(likelihood, 1), requirements, met });
  }

  // Featured snippet (content-based)
  {
    const requirements = [
      'Concise answer to query',
      'Well-structured content (headings, lists)',
      'Sufficient word count',
    ];
    const met: string[] = [];
    let likelihood = 0.1;

    if (words.length >= 300) {
      met.push('Sufficient word count');
      likelihood += 0.1;
    }

    const hasHeadingStructure = /<h[2-4]/i.test(input.content);
    if (hasHeadingStructure) {
      met.push('Well-structured content (headings, lists)');
      likelihood += 0.1;
    }

    predictions.push({
      feature: 'featured-snippet',
      likelihood: Math.min(likelihood, 1),
      requirements,
      met,
    });
  }

  return predictions;
}
