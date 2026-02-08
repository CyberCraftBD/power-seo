import { describe, it, expect } from 'vitest';
import { mergeGscWithAudit, correlateScoreAndTraffic } from '../merge.js';
import type { GscPageData, AuditCategory, CategoryResult } from '../types.js';

const mockCategories: Record<AuditCategory, CategoryResult> = {
  meta: { score: 80, passed: 4, warnings: 1, errors: 0 },
  content: { score: 70, passed: 3, warnings: 2, errors: 0 },
  structure: { score: 90, passed: 5, warnings: 0, errors: 0 },
  performance: { score: 60, passed: 2, warnings: 1, errors: 1 },
};

describe('mergeGscWithAudit', () => {
  it('should match pages by normalized URL', () => {
    const gsc: GscPageData[] = [
      { url: 'https://example.com/page/', clicks: 100, impressions: 1000, ctr: 0.1, position: 5 },
    ];
    const audit = [
      { url: 'https://example.com/page', score: 85, categories: mockCategories, recommendations: [] },
    ];
    const result = mergeGscWithAudit(gsc, audit);
    expect(result).toHaveLength(1);
    expect(result[0].gscMetrics).toBeDefined();
    expect(result[0].auditScore).toBe(85);
  });

  it('should create GSC-only insight when no audit exists', () => {
    const gsc: GscPageData[] = [
      { url: 'https://example.com/page', clicks: 50, impressions: 500, ctr: 0.1, position: 8 },
    ];
    const result = mergeGscWithAudit(gsc, []);
    expect(result).toHaveLength(1);
    expect(result[0].gscMetrics).toBeDefined();
    expect(result[0].auditScore).toBeUndefined();
    expect(result[0].opportunities.length).toBeGreaterThan(0);
  });

  it('should create audit-only insight when no GSC data exists', () => {
    const audit = [
      { url: 'https://example.com/orphan', score: 30, categories: mockCategories, recommendations: ['Fix title'] },
    ];
    const result = mergeGscWithAudit([], audit);
    expect(result).toHaveLength(1);
    expect(result[0].gscMetrics).toBeUndefined();
    expect(result[0].auditScore).toBe(30);
  });

  it('should generate opportunities for high-traffic low-score pages', () => {
    const gsc: GscPageData[] = [
      { url: 'https://example.com/page', clicks: 200, impressions: 2000, ctr: 0.1, position: 5 },
    ];
    const audit = [
      { url: 'https://example.com/page', score: 45, categories: mockCategories, recommendations: ['Fix meta'] },
    ];
    const result = mergeGscWithAudit(gsc, audit);
    expect(result[0].opportunities.length).toBeGreaterThan(0);
    expect(result[0].opportunities.some((o) => o.includes('High-traffic'))).toBe(true);
  });

  it('should handle empty arrays', () => {
    const result = mergeGscWithAudit([], []);
    expect(result).toHaveLength(0);
  });
});

describe('correlateScoreAndTraffic', () => {
  it('should compute Pearson correlation', () => {
    const insights = [
      { url: 'https://a.com', gscMetrics: { clicks: 100, impressions: 1000, ctr: 0.1, position: 5 }, auditScore: 90, opportunities: [] },
      { url: 'https://b.com', gscMetrics: { clicks: 50, impressions: 500, ctr: 0.1, position: 10 }, auditScore: 70, opportunities: [] },
      { url: 'https://c.com', gscMetrics: { clicks: 10, impressions: 100, ctr: 0.1, position: 20 }, auditScore: 40, opportunities: [] },
    ];
    const { correlation } = correlateScoreAndTraffic(insights);
    expect(correlation).toBeGreaterThan(0); // Positive correlation between score and traffic
    expect(correlation).toBeLessThanOrEqual(1);
  });

  it('should return top opportunities sorted by click/score ratio', () => {
    const insights = [
      { url: 'https://a.com', gscMetrics: { clicks: 200, impressions: 2000, ctr: 0.1, position: 5 }, auditScore: 30, opportunities: [] },
      { url: 'https://b.com', gscMetrics: { clicks: 100, impressions: 1000, ctr: 0.1, position: 8 }, auditScore: 90, opportunities: [] },
    ];
    const { topOpportunities } = correlateScoreAndTraffic(insights);
    expect(topOpportunities[0].url).toBe('https://a.com'); // Higher clicks/lower score = bigger opportunity
  });

  it('should return zero correlation with insufficient data', () => {
    const { correlation } = correlateScoreAndTraffic([]);
    expect(correlation).toBe(0);
  });
});
