import { describe, it, expect } from 'vitest';
import { analyzeTrend, buildTrendLines, detectAnomalies } from '../trends.js';
import type { TrendPoint, AuditSnapshot, AuditCategory } from '../types.js';

describe('analyzeTrend', () => {
  it('should detect improving trend', () => {
    const points: TrendPoint[] = [
      { date: '2025-01-01', value: 50 },
      { date: '2025-02-01', value: 60 },
      { date: '2025-03-01', value: 70 },
      { date: '2025-04-01', value: 80 },
    ];
    const result = analyzeTrend(points);
    expect(result.trend).toBe('improving');
    expect(result.change).toBeGreaterThan(0);
  });

  it('should detect declining trend', () => {
    const points: TrendPoint[] = [
      { date: '2025-01-01', value: 80 },
      { date: '2025-02-01', value: 70 },
      { date: '2025-03-01', value: 60 },
      { date: '2025-04-01', value: 50 },
    ];
    const result = analyzeTrend(points);
    expect(result.trend).toBe('declining');
    expect(result.change).toBeLessThan(0);
  });

  it('should detect stable trend', () => {
    const points: TrendPoint[] = [
      { date: '2025-01-01', value: 75 },
      { date: '2025-02-01', value: 75 },
      { date: '2025-03-01', value: 75 },
      { date: '2025-04-01', value: 75 },
    ];
    const result = analyzeTrend(points);
    expect(result.trend).toBe('stable');
    expect(result.change).toBe(0);
  });

  it('should calculate percentage change', () => {
    const points: TrendPoint[] = [
      { date: '2025-01-01', value: 50 },
      { date: '2025-02-01', value: 75 },
    ];
    const result = analyzeTrend(points);
    expect(result.change).toBe(50); // 50% increase
  });

  it('should handle single data point as stable', () => {
    const points: TrendPoint[] = [{ date: '2025-01-01', value: 80 }];
    const result = analyzeTrend(points);
    expect(result.trend).toBe('stable');
    expect(result.change).toBe(0);
  });

  it('should handle empty points', () => {
    const result = analyzeTrend([]);
    expect(result.trend).toBe('stable');
    expect(result.points).toHaveLength(0);
  });
});

describe('buildTrendLines', () => {
  it('should build per-category and overall trend lines', () => {
    const categories: Record<AuditCategory, number> = {
      meta: 80,
      content: 70,
      structure: 90,
      performance: 60,
    };
    const snapshots: AuditSnapshot[] = [
      { date: '2025-01-01', url: 'https://example.com', score: 70, categories },
      { date: '2025-02-01', url: 'https://example.com', score: 75, categories: { ...categories, meta: 85 } },
    ];
    const result = buildTrendLines(snapshots);
    expect(result.overall).toBeDefined();
    expect(result.meta).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.structure).toBeDefined();
    expect(result.performance).toBeDefined();
  });

  it('should return empty object for no snapshots', () => {
    const result = buildTrendLines([]);
    expect(Object.keys(result)).toHaveLength(0);
  });
});

describe('detectAnomalies', () => {
  it('should detect outliers beyond threshold', () => {
    const points: TrendPoint[] = [
      { date: '2025-01-01', value: 50 },
      { date: '2025-02-01', value: 51 },
      { date: '2025-03-01', value: 49 },
      { date: '2025-04-01', value: 50 },
      { date: '2025-05-01', value: 52 },
      { date: '2025-06-01', value: 48 },
      { date: '2025-07-01', value: 51 },
      { date: '2025-08-01', value: 200 }, // anomaly
    ];
    const anomalies = detectAnomalies(points);
    expect(anomalies).toHaveLength(1);
    expect(anomalies[0]!.value).toBe(200);
  });

  it('should return empty for consistent data', () => {
    const points: TrendPoint[] = [
      { date: '2025-01-01', value: 50 },
      { date: '2025-02-01', value: 51 },
      { date: '2025-03-01', value: 49 },
      { date: '2025-04-01', value: 50 },
    ];
    const anomalies = detectAnomalies(points);
    expect(anomalies).toHaveLength(0);
  });

  it('should return empty for less than 3 points', () => {
    const points: TrendPoint[] = [
      { date: '2025-01-01', value: 50 },
    ];
    const anomalies = detectAnomalies(points);
    expect(anomalies).toHaveLength(0);
  });
});
