// @power-seo/analytics — Query Ranking Analysis
// ----------------------------------------------------------------------------

import type { GscQueryData, RankingAnalysis, RankingBucket, PositionChange } from './types.js';

const BUCKET_RANGES = [
  { range: '1-3', min: 1, max: 3 },
  { range: '4-10', min: 4, max: 10 },
  { range: '11-20', min: 11, max: 20 },
  { range: '21-100', min: 21, max: 100 },
];

export function analyzeQueryRankings(queries: GscQueryData[]): RankingAnalysis {
  if (queries.length === 0) {
    return {
      totalQueries: 0,
      buckets: BUCKET_RANGES.map((r) => ({ range: r.range, count: 0, queries: [] })),
      strikingDistance: [],
    };
  }

  const buckets: RankingBucket[] = BUCKET_RANGES.map((range) => {
    const matching = queries.filter((q) => q.position >= range.min && q.position <= range.max);
    return {
      range: range.range,
      count: matching.length,
      queries: matching,
    };
  });

  // Striking distance: position 4-20, sorted by impressions descending
  const strikingDistance = queries
    .filter((q) => q.position >= 4 && q.position <= 20)
    .sort((a, b) => b.impressions - a.impressions);

  return {
    totalQueries: queries.length,
    buckets,
    strikingDistance,
  };
}

export function trackPositionChanges(
  current: GscQueryData[],
  previous: GscQueryData[],
): PositionChange[] {
  if (current.length === 0 && previous.length === 0) {
    return [];
  }

  const prevMap = new Map<string, GscQueryData>();
  for (const q of previous) {
    prevMap.set(q.query, q);
  }

  const changes: PositionChange[] = [];

  for (const curr of current) {
    const prev = prevMap.get(curr.query);
    if (prev) {
      changes.push({
        query: curr.query,
        previousPosition: prev.position,
        currentPosition: curr.position,
        change: prev.position - curr.position, // positive = improvement
        impressionChange: curr.impressions - prev.impressions,
      });
    }
  }

  return changes;
}
