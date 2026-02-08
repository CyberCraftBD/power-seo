import { describe, it, expect } from 'vitest';
import { runMetaRules } from '../rules/meta.js';
import { runContentRules } from '../rules/content.js';
import { runStructureRules } from '../rules/structure.js';
import { runPerformanceRules } from '../rules/performance.js';
import type { PageAuditInput } from '../types.js';

describe('runMetaRules', () => {
  it('reports error for missing title', () => {
    const input: PageAuditInput = { url: 'https://example.com' };
    const rules = runMetaRules(input);
    const titleRule = rules.find((r) => r.id === 'meta-title-present');
    expect(titleRule).toBeDefined();
    expect(titleRule!.severity).toBe('error');
  });

  it('reports pass for valid title', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      title: 'A good page title for SEO testing purposes',
    };
    const rules = runMetaRules(input);
    const titleRule = rules.find((r) => r.id === 'meta-title-length');
    expect(titleRule).toBeDefined();
    expect(titleRule!.severity).toBe('pass');
  });

  it('reports error for missing meta description', () => {
    const input: PageAuditInput = { url: 'https://example.com' };
    const rules = runMetaRules(input);
    const descRule = rules.find((r) => r.id === 'meta-description-present');
    expect(descRule).toBeDefined();
    expect(descRule!.severity).toBe('error');
  });

  it('reports pass for valid meta description', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      metaDescription: 'This is a good meta description that provides useful information about the page content for search engines.',
    };
    const rules = runMetaRules(input);
    const descRule = rules.find((r) => r.id === 'meta-description-length');
    expect(descRule).toBeDefined();
    expect(descRule!.severity).toBe('pass');
  });

  it('validates OG tags', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      openGraph: { title: 'OG Title', description: 'OG Desc', image: 'https://example.com/img.png' },
    };
    const rules = runMetaRules(input);
    const ogTitle = rules.find((r) => r.id === 'meta-og-title');
    expect(ogTitle!.severity).toBe('pass');
  });

  it('warns for missing OG image', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      openGraph: { title: 'OG Title' },
    };
    const rules = runMetaRules(input);
    const ogImage = rules.find((r) => r.id === 'meta-og-image');
    expect(ogImage!.severity).toBe('warning');
  });

  it('detects noindex directive', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      robots: 'noindex, nofollow',
    };
    const rules = runMetaRules(input);
    const noindex = rules.find((r) => r.id === 'meta-robots-noindex');
    expect(noindex).toBeDefined();
    expect(noindex!.severity).toBe('info');
  });

  it('warns for missing canonical', () => {
    const input: PageAuditInput = { url: 'https://example.com' };
    const rules = runMetaRules(input);
    const canonical = rules.find((r) => r.id === 'meta-canonical');
    expect(canonical!.severity).toBe('warning');
  });
});

describe('runContentRules', () => {
  it('warns when no content provided', () => {
    const input: PageAuditInput = { url: 'https://example.com' };
    const rules = runContentRules(input);
    const missing = rules.find((r) => r.id === 'content-missing');
    expect(missing).toBeDefined();
    expect(missing!.severity).toBe('warning');
  });

  it('maps content-analysis results to audit rules', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      title: 'Test Page',
      content: '<h1>Test Page</h1><p>This is enough content to test the content analysis engine. We need more than a few sentences to make the analysis meaningful. The content should be fairly long to avoid triggering word count warnings. Let us add some more text here to make it substantial.</p>',
      focusKeyphrase: 'test page',
    };
    const rules = runContentRules(input);
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.every((r) => r.category === 'content')).toBe(true);
  });

  it('includes readability results in audit rules', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      content: '<p>This is a simple sentence. Another simple sentence. Easy to read content here. More sentences follow naturally.</p>',
    };
    const rules = runContentRules(input);
    const readabilityRule = rules.find((r) => r.id.startsWith('readability-'));
    expect(readabilityRule).toBeDefined();
  });
});

describe('runStructureRules', () => {
  it('validates canonical as absolute URL', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      canonical: '/relative-path',
    };
    const rules = runStructureRules(input);
    const canonical = rules.find((r) => r.id === 'structure-canonical-valid');
    expect(canonical!.severity).toBe('error');
  });

  it('passes valid canonical', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      canonical: 'https://example.com',
    };
    const rules = runStructureRules(input);
    const canonical = rules.find((r) => r.id === 'structure-canonical-valid');
    expect(canonical!.severity).toBe('pass');
  });

  it('warns when canonical does not match page URL', () => {
    const input: PageAuditInput = {
      url: 'https://example.com/page',
      canonical: 'https://example.com/other',
    };
    const rules = runStructureRules(input);
    const selfCanonical = rules.find((r) => r.id === 'structure-canonical-self');
    expect(selfCanonical!.severity).toBe('warning');
  });

  it('warns when no schema present', () => {
    const input: PageAuditInput = { url: 'https://example.com' };
    const rules = runStructureRules(input);
    const schema = rules.find((r) => r.id === 'structure-schema-present');
    expect(schema!.severity).toBe('warning');
  });

  it('validates schema objects', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      schema: [{ '@type': 'Article', 'headline': 'Test', 'author': 'Author', 'datePublished': '2024-01-01' }],
    };
    const rules = runStructureRules(input);
    const schemaPresent = rules.find((r) => r.id === 'structure-schema-present');
    expect(schemaPresent!.severity).toBe('pass');
  });

  it('reports missing H1', () => {
    const input: PageAuditInput = { url: 'https://example.com' };
    const rules = runStructureRules(input);
    const h1 = rules.find((r) => r.id === 'structure-heading-h1');
    expect(h1!.severity).toBe('error');
  });

  it('checks heading hierarchy', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      headings: ['h1: Title', 'h3: Skipped H2'],
    };
    const rules = runStructureRules(input);
    const hierarchy = rules.find((r) => r.id === 'structure-heading-hierarchy');
    expect(hierarchy!.severity).toBe('warning');
  });

  it('reports HTTP pages', () => {
    const input: PageAuditInput = { url: 'http://example.com' };
    const rules = runStructureRules(input);
    const https = rules.find((r) => r.id === 'structure-https');
    expect(https!.severity).toBe('error');
  });
});

describe('runPerformanceRules', () => {
  it('reports error for very slow response time', () => {
    const input: PageAuditInput = { url: 'https://example.com', responseTime: 5000 };
    const rules = runPerformanceRules(input);
    const rt = rules.find((r) => r.id === 'perf-response-time');
    expect(rt!.severity).toBe('error');
  });

  it('reports warning for slow response time', () => {
    const input: PageAuditInput = { url: 'https://example.com', responseTime: 1500 };
    const rules = runPerformanceRules(input);
    const rt = rules.find((r) => r.id === 'perf-response-time');
    expect(rt!.severity).toBe('warning');
  });

  it('reports pass for fast response time', () => {
    const input: PageAuditInput = { url: 'https://example.com', responseTime: 200 };
    const rules = runPerformanceRules(input);
    const rt = rules.find((r) => r.id === 'perf-response-time');
    expect(rt!.severity).toBe('pass');
  });

  it('reports error status codes', () => {
    const input: PageAuditInput = { url: 'https://example.com', statusCode: 404 };
    const rules = runPerformanceRules(input);
    const status = rules.find((r) => r.id === 'perf-status-code');
    expect(status!.severity).toBe('error');
  });

  it('reports pass for 200 status code', () => {
    const input: PageAuditInput = { url: 'https://example.com', statusCode: 200 };
    const rules = runPerformanceRules(input);
    const status = rules.find((r) => r.id === 'perf-status-code');
    expect(status!.severity).toBe('pass');
  });

  it('warns for missing image alt text', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      images: [
        { src: 'img1.png', alt: 'Description' },
        { src: 'img2.png' },
      ],
    };
    const rules = runPerformanceRules(input);
    const alt = rules.find((r) => r.id === 'perf-image-alt');
    expect(alt!.severity).toBe('warning');
  });

  it('passes when all images have alt text', () => {
    const input: PageAuditInput = {
      url: 'https://example.com',
      images: [
        { src: 'img1.png', alt: 'Description 1' },
        { src: 'img2.png', alt: 'Description 2' },
      ],
    };
    const rules = runPerformanceRules(input);
    const alt = rules.find((r) => r.id === 'perf-image-alt');
    expect(alt!.severity).toBe('pass');
  });
});
