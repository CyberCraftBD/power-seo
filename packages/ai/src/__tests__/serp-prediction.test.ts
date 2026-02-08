import { describe, it, expect } from 'vitest';
import {
  buildSerpPredictionPrompt,
  parseSerpPredictionResponse,
  analyzeSerpEligibility,
} from '../prompts/serp-prediction.js';

describe('buildSerpPredictionPrompt', () => {
  it('should return a valid PromptTemplate', () => {
    const result = buildSerpPredictionPrompt({
      title: 'How to Bake a Cake',
      content: 'Step by step guide to baking.',
    });
    expect(result.system).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.maxTokens).toBe(1000);
  });

  it('should include schema types in prompt', () => {
    const result = buildSerpPredictionPrompt({
      title: 'Test',
      content: 'Test content',
      schema: ['FAQPage', 'HowTo'],
    });
    expect(result.user).toContain('FAQPage');
    expect(result.user).toContain('HowTo');
  });
});

describe('parseSerpPredictionResponse', () => {
  it('should parse valid JSON predictions', () => {
    const json = JSON.stringify([
      { feature: 'faq-rich-result', likelihood: 0.8, requirements: ['FAQ schema'], met: ['FAQ schema'] },
    ]);
    const result = parseSerpPredictionResponse(json);
    expect(result).toHaveLength(1);
    expect(result[0].feature).toBe('faq-rich-result');
    expect(result[0].likelihood).toBe(0.8);
  });

  it('should return empty array on invalid JSON', () => {
    const result = parseSerpPredictionResponse('Not valid JSON');
    expect(result).toEqual([]);
  });

  it('should handle code-fenced responses', () => {
    const fenced = '```json\n[{"feature":"how-to","likelihood":0.6,"requirements":["Steps"],"met":[]}]\n```';
    const result = parseSerpPredictionResponse(fenced);
    expect(result).toHaveLength(1);
  });
});

describe('analyzeSerpEligibility', () => {
  it('should detect FAQ eligibility with FAQPage schema', () => {
    const result = analyzeSerpEligibility({
      title: 'FAQ Page',
      content: '<p>What is SEO? How to improve rankings? Why does SEO matter?</p>',
      schema: ['FAQPage'],
    });
    const faq = result.find((r) => r.feature === 'faq-rich-result');
    expect(faq).toBeDefined();
    expect(faq!.likelihood).toBeGreaterThan(0.5);
    expect(faq!.met).toContain('FAQPage schema markup');
  });

  it('should detect HowTo eligibility with step-by-step content', () => {
    const result = analyzeSerpEligibility({
      title: 'How to Build a Website',
      content: '<p>Step 1: Choose a domain. Step 2: Set up hosting. Finally, deploy your site.</p>',
      schema: ['HowTo'],
    });
    const howTo = result.find((r) => r.feature === 'how-to');
    expect(howTo).toBeDefined();
    expect(howTo!.likelihood).toBeGreaterThan(0.5);
  });

  it('should detect Product eligibility with Product schema', () => {
    const result = analyzeSerpEligibility({
      title: 'Widget Pro',
      content: '<p>Buy Widget Pro for the best experience.</p>',
      schema: ['Product'],
    });
    const product = result.find((r) => r.feature === 'product');
    expect(product).toBeDefined();
    expect(product!.likelihood).toBeGreaterThan(0.5);
    expect(product!.met).toContain('Product schema markup');
  });

  it('should detect Review eligibility', () => {
    const result = analyzeSerpEligibility({
      title: 'Review',
      content: '<p>Our review of the product.</p>',
      schema: ['AggregateRating'],
    });
    const review = result.find((r) => r.feature === 'review');
    expect(review).toBeDefined();
    expect(review!.likelihood).toBeGreaterThan(0.5);
  });

  it('should detect VideoObject eligibility', () => {
    const result = analyzeSerpEligibility({
      title: 'Video Tutorial',
      content: '<p>Watch our tutorial.</p>',
      schema: ['VideoObject'],
    });
    const video = result.find((r) => r.feature === 'video');
    expect(video).toBeDefined();
    expect(video!.likelihood).toBeGreaterThan(0.5);
  });

  it('should return low likelihood with no signals', () => {
    const result = analyzeSerpEligibility({
      title: 'Simple Page',
      content: '<p>Just some content.</p>',
    });
    for (const prediction of result) {
      expect(prediction.likelihood).toBeLessThanOrEqual(0.3);
    }
  });

  it('should detect FAQ from content patterns without schema', () => {
    const result = analyzeSerpEligibility({
      title: 'FAQ',
      content: '<p>What is SEO? How to improve it? Why does it matter? Can I do it myself?</p>',
    });
    const faq = result.find((r) => r.feature === 'faq-rich-result');
    expect(faq).toBeDefined();
    expect(faq!.met).toContain('Question-answer content structure');
  });

  it('should include featured-snippet prediction', () => {
    const longContent = 'word '.repeat(400);
    const result = analyzeSerpEligibility({
      title: 'Guide',
      content: `<h2>Section</h2><p>${longContent}</p>`,
    });
    const snippet = result.find((r) => r.feature === 'featured-snippet');
    expect(snippet).toBeDefined();
    expect(snippet!.met.length).toBeGreaterThan(0);
  });
});
