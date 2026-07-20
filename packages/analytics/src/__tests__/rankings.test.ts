import { describe, it, expect } from 'vitest';
import { analyzeQueryRankings, trackPositionChanges } from '../rankings.js';
import type { GscQueryData } from '../types.js';

describe('analyzeQueryRankings', () => {
  it('should bucket queries into correct ranges', () => {
    const queries: GscQueryData[] = [
      { query: 'seo tools', clicks: 100, impressions: 1000, ctr: 0.1, position: 2 },
      { query: 'best seo', clicks: 80, impressions: 800, ctr: 0.1, position: 7 },
      { query: 'seo guide', clicks: 30, impressions: 500, ctr: 0.06, position: 15 },
      { query: 'seo tips', clicks: 5, impressions: 100, ctr: 0.05, position: 45 },
    ];
    const result = analyzeQueryRankings(queries);
    expect(result.totalQueries).toBe(4);
    expect(result.buckets[0].count).toBe(1); // 1-3
    expect(result.buckets[1].count).toBe(1); // 4-10
    expect(result.buckets[2].count).toBe(1); // 11-20
    expect(result.buckets[3].count).toBe(1); // 21-100
  });

  it('should identify striking distance queries (position 4-20)', () => {
    const queries: GscQueryData[] = [
      { query: 'seo tools', clicks: 100, impressions: 1000, ctr: 0.1, position: 2 },
      { query: 'best seo', clicks: 80, impressions: 800, ctr: 0.1, position: 7 },
      { query: 'seo guide', clicks: 30, impressions: 500, ctr: 0.06, position: 15 },
    ];
    const result = analyzeQueryRankings(queries);
    expect(result.strikingDistance).toHaveLength(2); // positions 7 and 15
  });

  it('should sort striking distance by impressions descending', () => {
    const queries: GscQueryData[] = [
      { query: 'low imp', clicks: 10, impressions: 100, ctr: 0.1, position: 8 },
      { query: 'high imp', clicks: 50, impressions: 900, ctr: 0.056, position: 12 },
    ];
    const result = analyzeQueryRankings(queries);
    expect(result.strikingDistance[0].query).toBe('high imp');
  });

  it('should handle empty arrays', () => {
    const result = analyzeQueryRankings([]);
    expect(result.totalQueries).toBe(0);
    expect(result.buckets).toHaveLength(4);
    expect(result.strikingDistance).toHaveLength(0);
  });

  // Issue #145: fractional GSC positions (and <1 / >100) must land in exactly one
  // bucket. Previously 3.5, 10.4, 20.7 fell through the inclusive integer edges and
  // <1 / >100 were dropped, so the bucket counts did not sum to totalQueries.
  it('should bucket fractional and out-of-range positions with no gaps', () => {
    const queries: GscQueryData[] = [
      { query: 'sub-one', clicks: 10, impressions: 100, ctr: 0.1, position: 0.4 },
      { query: 'edge 3.5', clicks: 10, impressions: 100, ctr: 0.1, position: 3.5 },
      { query: 'edge 15.6', clicks: 10, impressions: 100, ctr: 0.1, position: 15.6 },
      { query: 'edge 20.7', clicks: 10, impressions: 100, ctr: 0.1, position: 20.7 },
      { query: 'beyond 100', clicks: 10, impressions: 100, ctr: 0.1, position: 150 },
    ];
    const result = analyzeQueryRankings(queries);
    expect(result.totalQueries).toBe(5);
    // Every query must appear in exactly one bucket: counts sum to totalQueries.
    const bucketed = result.buckets.reduce((sum, b) => sum + b.count, 0);
    expect(bucketed).toBe(result.totalQueries);

    // 0.4 -> "1-3", 3.5 -> "4-10", 15.6 -> "11-20", 20.7 & 150 -> "21-100" (open-ended top)
    expect(result.buckets[0].count).toBe(1); // 1-3   (0.4)
    expect(result.buckets[1].count).toBe(1); // 4-10  (3.5)
    expect(result.buckets[2].count).toBe(1); // 11-20 (15.6)
    expect(result.buckets[3].count).toBe(2); // 21-100 (20.7, 150)
  });
});

describe('trackPositionChanges', () => {
  it('should compute position changes correctly', () => {
    const current: GscQueryData[] = [
      { query: 'seo tools', clicks: 120, impressions: 1200, ctr: 0.1, position: 3 },
    ];
    const previous: GscQueryData[] = [
      { query: 'seo tools', clicks: 100, impressions: 1000, ctr: 0.1, position: 7 },
    ];
    const changes = trackPositionChanges(current, previous);
    expect(changes).toHaveLength(1);
    expect(changes[0].change).toBe(4); // improved by 4 positions
    expect(changes[0].impressionChange).toBe(200);
  });

  it('should only track queries present in both periods', () => {
    const current: GscQueryData[] = [
      { query: 'new query', clicks: 10, impressions: 100, ctr: 0.1, position: 15 },
    ];
    const previous: GscQueryData[] = [
      { query: 'old query', clicks: 5, impressions: 50, ctr: 0.1, position: 20 },
    ];
    const changes = trackPositionChanges(current, previous);
    expect(changes).toHaveLength(0);
  });

  it('should handle empty arrays', () => {
    const changes = trackPositionChanges([], []);
    expect(changes).toHaveLength(0);
  });
});
