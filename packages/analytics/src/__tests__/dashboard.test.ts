import { describe, it, expect } from 'vitest';
import { buildDashboardData } from '../dashboard.js';
import type { DashboardInput, AuditCategory, CategoryResult } from '../types.js';

const mockCategories: Record<AuditCategory, CategoryResult> = {
  meta: { score: 80, passed: 4, warnings: 1, errors: 0 },
  content: { score: 70, passed: 3, warnings: 2, errors: 0 },
  structure: { score: 90, passed: 5, warnings: 0, errors: 0 },
  performance: { score: 60, passed: 2, warnings: 1, errors: 1 },
};

describe('buildDashboardData', () => {
  it('should aggregate overview metrics correctly', () => {
    const input: DashboardInput = {
      gscPages: [
        { url: 'https://a.com', clicks: 100, impressions: 1000, ctr: 0.1, position: 5 },
        { url: 'https://b.com', clicks: 200, impressions: 2000, ctr: 0.1, position: 3 },
      ],
      auditResults: [
        { url: 'https://a.com', score: 80, categories: mockCategories, recommendations: [] },
        { url: 'https://b.com', score: 90, categories: mockCategories, recommendations: [] },
      ],
    };
    const data = buildDashboardData(input);
    expect(data.overview.totalClicks).toBe(300);
    expect(data.overview.totalImpressions).toBe(3000);
    expect(data.overview.averageCtr).toBe(0.1);
    expect(data.overview.averagePosition).toBe(4);
    expect(data.overview.averageAuditScore).toBe(85);
    expect(data.overview.totalPages).toBe(2);
  });

  it('should sort top pages by clicks descending', () => {
    const input: DashboardInput = {
      gscPages: [
        { url: 'https://low.com', clicks: 10, impressions: 100, ctr: 0.1, position: 20 },
        { url: 'https://high.com', clicks: 500, impressions: 5000, ctr: 0.1, position: 2 },
      ],
    };
    const data = buildDashboardData(input);
    expect(data.topPages[0].url).toBe('https://high.com');
  });

  it('should sort top queries by clicks descending', () => {
    const input: DashboardInput = {
      gscQueries: [
        { query: 'low', clicks: 5, impressions: 50, ctr: 0.1, position: 15 },
        { query: 'high', clicks: 200, impressions: 2000, ctr: 0.1, position: 3 },
      ],
    };
    const data = buildDashboardData(input);
    expect(data.topQueries[0].query).toBe('high');
  });

  it('should build trend lines from audit history', () => {
    const input: DashboardInput = {
      auditHistory: [
        { date: '2025-01-01', url: 'https://a.com', score: 70, categories: { meta: 80, content: 70, structure: 90, performance: 60 } },
        { date: '2025-02-01', url: 'https://a.com', score: 80, categories: { meta: 85, content: 75, structure: 92, performance: 65 } },
      ],
    };
    const data = buildDashboardData(input);
    expect(data.trendLines.overall).toBeDefined();
  });

  it('should handle missing GSC data', () => {
    const input: DashboardInput = {
      auditResults: [
        { url: 'https://a.com', score: 75, categories: mockCategories, recommendations: ['Fix title'] },
      ],
    };
    const data = buildDashboardData(input);
    expect(data.overview.totalClicks).toBe(0);
    expect(data.overview.averageAuditScore).toBe(75);
    expect(data.issues).toContain('Fix title');
  });

  it('should handle missing audit data', () => {
    const input: DashboardInput = {
      gscPages: [
        { url: 'https://a.com', clicks: 100, impressions: 1000, ctr: 0.1, position: 5 },
      ],
    };
    const data = buildDashboardData(input);
    expect(data.overview.totalClicks).toBe(100);
    expect(data.overview.averageAuditScore).toBe(0);
  });

  it('should handle completely empty input', () => {
    const data = buildDashboardData({});
    expect(data.overview.totalClicks).toBe(0);
    expect(data.overview.totalImpressions).toBe(0);
    expect(data.overview.averageCtr).toBe(0);
    expect(data.overview.averagePosition).toBe(0);
    expect(data.overview.averageAuditScore).toBe(0);
    expect(data.overview.totalPages).toBe(0);
    expect(data.topPages).toHaveLength(0);
    expect(data.topQueries).toHaveLength(0);
    expect(data.issues).toHaveLength(0);
  });
});
