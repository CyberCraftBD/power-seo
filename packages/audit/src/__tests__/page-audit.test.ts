import { describe, it, expect } from 'vitest';
import { auditPage } from '../page-audit.js';
import type { PageAuditInput } from '../types.js';

describe('auditPage', () => {
  it('audits a complete page with all fields', () => {
    const input: PageAuditInput = {
      url: 'https://example.com/test',
      title: 'Complete Page Title for Testing',
      metaDescription:
        'A detailed meta description that provides useful context about this test page content.',
      content:
        '<h1>Complete Page</h1><p>This is comprehensive content for testing the page audit functionality. We need enough text to avoid word count warnings and ensure the content analysis runs properly. The content discusses various topics including SEO optimization and best practices for web development.</p>',
      focusKeyphrase: 'page audit',
      canonical: 'https://example.com/test',
      openGraph: {
        title: 'OG Title',
        description: 'OG Description',
        image: 'https://example.com/img.png',
      },
      headings: ['h1: Complete Page', 'h2: Section One'],
      images: [{ src: 'img.png', alt: 'Test image' }],
      statusCode: 200,
      responseTime: 300,
      contentLength: 5000,
    };
    const result = auditPage(input);
    expect(result.url).toBe('https://example.com/test');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.categories.meta).toBeDefined();
    expect(result.categories.content).toBeDefined();
    expect(result.categories.structure).toBeDefined();
    expect(result.categories.performance).toBeDefined();
  });

  it('audits a minimal page (just URL)', () => {
    const input: PageAuditInput = { url: 'https://example.com' };
    const result = auditPage(input);
    expect(result.url).toBe('https://example.com');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.rules.length).toBeGreaterThan(0);
  });

  it('calculates score between 0 and 100', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      title: 'Test Title',
      metaDescription: 'A good meta description for testing.',
    };
    const result = auditPage(input);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('provides category breakdowns', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      title: 'Test',
      statusCode: 200,
      responseTime: 100,
    };
    const result = auditPage(input);
    for (const cat of ['meta', 'content', 'structure', 'performance'] as const) {
      expect(result.categories[cat].score).toBeGreaterThanOrEqual(0);
      expect(result.categories[cat].score).toBeLessThanOrEqual(100);
    }
  });

  it('generates recommendations from warnings and errors', () => {
    const input: PageAuditInput = {
      url: 'http://example.com', // HTTP — should trigger error
    };
    const result = auditPage(input);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('gives higher score to well-optimized pages', () => {
    const optimized: PageAuditInput = {
      url: 'https://example.com',
      title: 'Well Optimized Page Title for SEO',
      metaDescription:
        'A well-crafted meta description that provides useful information about this page and its content.',
      canonical: 'https://example.com',
      headings: ['h1: Main Heading', 'h2: Sub Heading'],
      statusCode: 200,
      responseTime: 100,
    };
    const minimal: PageAuditInput = { url: 'http://example.com' };

    const optimizedResult = auditPage(optimized);
    const minimalResult = auditPage(minimal);

    expect(optimizedResult.score).toBeGreaterThan(minimalResult.score);
  });

  it('returns all rules from all categories', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      title: 'Test',
      content: '<p>Some content for testing.</p>',
      statusCode: 200,
    };
    const result = auditPage(input);
    const categories = new Set(result.rules.map((r) => r.category));
    expect(categories.has('meta')).toBe(true);
    expect(categories.has('content')).toBe(true);
    expect(categories.has('structure')).toBe(true);
  });

  it('handles page with errors in multiple categories', () => {
    const input: PageAuditInput = {
      url: 'http://example.com',
      statusCode: 500,
      responseTime: 5000,
    };
    const result = auditPage(input);
    expect(result.score).toBeLessThan(50);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('includes info rules without affecting score', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      robots: 'noindex',
    };
    const result = auditPage(input);
    const infoRules = result.rules.filter((r) => r.severity === 'info');
    expect(infoRules.length).toBeGreaterThan(0);
  });

  it('category scores are between 0 and 100', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      title: 'Test',
      content: '<p>Content</p>',
      headings: ['h1: Title'],
      statusCode: 200,
      responseTime: 100,
      images: [{ src: 'img.png', alt: 'test' }],
    };
    const result = auditPage(input);
    for (const cat of ['meta', 'content', 'structure', 'performance'] as const) {
      expect(result.categories[cat].score).toBeGreaterThanOrEqual(0);
      expect(result.categories[cat].score).toBeLessThanOrEqual(100);
    }
  });
});
