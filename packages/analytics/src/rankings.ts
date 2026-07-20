// @power-seo/analytics — Query Ranking Analysis
// ----------------------------------------------------------------------------

import type { GscQueryData, RankingAnalysis, RankingBucket, PositionChange } from './types.js';

// Half-open contiguous upper bounds so fractional GSC positions (e.g. 3.5, 10.4,
// 20.7) always land in exactly one bucket. The final bucket is open-ended
// (max: Infinity) so positions >100 are not dropped, and there is no lower gap
// so positions <1 fall into the first bucket. Every query is counted exactly once.
const BUCKET_RANGES = [
  { range: '1-3', min: -Infinity, max: 3.5 },
  { range: '4-10', min: 3.5, max: 10.5 },
  { range: '11-20', min: 10.5, max: 20.5 },
  { range: '21-100', min: 20.5, max: Infinity },
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
    // Half-open [min, max): every position lands in exactly one bucket, including
    // fractional averages and out-of-range values (<1 or >100).
    const matching = queries.filter((q) => q.position >= range.min && q.position < range.max);
    return {
      range: range.range,
      count: matching.length,
      queries: matching,
    };
  });

  // Striking distance: position 4-20, sorted by impressions descending.
  // Uses the same half-open boundaries as the buckets so fractional positions
  // (e.g. 3.5 excluded, 20.4 included) are handled consistently.
  const strikingDistance = queries
    .filter((q) => q.position >= 3.5 && q.position < 20.5)
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
