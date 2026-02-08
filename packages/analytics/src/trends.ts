// ============================================================================
// @ccbd-seo/analytics — Trend Analysis
// ============================================================================

import type { TrendPoint, TrendDirection, TrendAnalysis, AuditSnapshot } from './types.js';

export function analyzeTrend(points: TrendPoint[], metric = 'value'): TrendAnalysis {
  if (points.length === 0) {
    return { metric, trend: 'stable', change: 0, points: [] };
  }

  if (points.length === 1) {
    return { metric, trend: 'stable', change: 0, points };
  }

  // Linear regression for slope
  const n = points.length;
  const xs = points.map((_, i) => i);
  const ys = points.map((p) => p.value);

  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    const xi = xs[i] ?? 0;
    const yi = ys[i] ?? 0;
    numerator += (xi - meanX) * (yi - meanY);
    denominator += (xi - meanX) * (xi - meanX);
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;

  // Percentage change first→last
  const first = points[0]!.value;
  const last = points[points.length - 1]!.value;
  const change = first === 0 ? 0 : Math.round(((last - first) / Math.abs(first)) * 10000) / 100;

  // Classify trend based on slope relative to mean
  const threshold = Math.abs(meanY) * 0.02; // 2% of mean
  let trend: TrendDirection;
  if (slope > threshold) {
    trend = 'improving';
  } else if (slope < -threshold) {
    trend = 'declining';
  } else {
    trend = 'stable';
  }

  return { metric, trend, change, points };
}

export function buildTrendLines(
  snapshots: AuditSnapshot[],
): Record<string, TrendAnalysis> {
  if (snapshots.length === 0) {
    return {};
  }

  // Sort by date
  const sorted = [...snapshots].sort((a, b) => a.date.localeCompare(b.date));

  // Overall score trend
  const overallPoints: TrendPoint[] = sorted.map((s) => ({ date: s.date, value: s.score }));
  const result: Record<string, TrendAnalysis> = {
    overall: analyzeTrend(overallPoints, 'overall'),
  };

  // Per-category trends
  const categories = Object.keys(sorted[0]!.categories) as Array<keyof typeof sorted[0]['categories']>;
  for (const category of categories) {
    const categoryPoints: TrendPoint[] = sorted.map((s) => ({
      date: s.date,
      value: s.categories[category],
    }));
    result[category] = analyzeTrend(categoryPoints, category);
  }

  return result;
}

export function detectAnomalies(points: TrendPoint[], threshold = 2): TrendPoint[] {
  if (points.length < 3) {
    return [];
  }

  const values = points.map((p) => p.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) {
    return [];
  }

  return points.filter((p) => Math.abs(p.value - mean) > threshold * stdDev);
}
