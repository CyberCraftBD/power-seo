# @ccbd-seo/analytics

> Merge Google Search Console data with audit results, analyze trends, track rankings, and build dashboard-ready data.

## Installation

```bash
npm install @ccbd-seo/analytics @ccbd-seo/core @ccbd-seo/audit
```

## Usage

### Merge GSC + Audit Data

```ts
import { mergeGscWithAudit, correlateScoreAndTraffic } from '@ccbd-seo/analytics';

const insights = mergeGscWithAudit({
  gscPages: [{ url: '/blog/post', clicks: 150, impressions: 5000, ctr: 0.03, position: 8.2 }],
  auditResults: [{ url: '/blog/post', score: 72, issues: [...] }],
});

const correlation = correlateScoreAndTraffic(insights);
// Pearson correlation between audit scores and traffic
```

### Trend Analysis

```ts
import { analyzeTrend, buildTrendLines, detectAnomalies } from '@ccbd-seo/analytics';

const trend = analyzeTrend(dataPoints);
// { direction: 'up' | 'down' | 'stable', rate, confidence }

const trendLines = buildTrendLines(dataPoints);
// Time-series data for charting

const anomalies = detectAnomalies(dataPoints);
// Flags statistically significant spikes and drops
```

### Ranking Analysis

```ts
import { analyzeQueryRankings, trackPositionChanges } from '@ccbd-seo/analytics';

const rankings = analyzeQueryRankings(queryData);
// Groups queries into buckets: 1-3, 4-10, 11-20, 21-50, 50+

const changes = trackPositionChanges(snapshot1, snapshot2);
// Tracks position improvements and declines
```

### Dashboard

```ts
import { buildDashboardData } from '@ccbd-seo/analytics';

const dashboard = buildDashboardData({
  gscPages: [...],
  gscQueries: [...],
  auditResults: [...],
});
// { overview, topPages, topQueries, trendLines, issues }
```

## API Reference

### Merge

- `mergeGscWithAudit(input)` — Join GSC data with audit scores by normalized URL
- `correlateScoreAndTraffic(insights)` — Pearson correlation coefficient

### Trends

- `analyzeTrend(points)` — Detect trend direction and rate of change
- `buildTrendLines(points)` — Generate time-series data for charting
- `detectAnomalies(points)` — Flag statistically significant spikes and drops

### Rankings

- `analyzeQueryRankings(queries)` — Group queries by ranking buckets
- `trackPositionChanges(before, after)` — Compare ranking snapshots

### Dashboard

- `buildDashboardData(input)` — Aggregate overview, top pages, queries, trends, and issues

### Types

```ts
import type {
  GscPageData,
  GscQueryData,
  AuditSnapshot,
  TrendPoint,
  TrendDirection,
  TrendAnalysis,
  PageInsight,
  RankingBucket,
  RankingAnalysis,
  PositionChange,
  DashboardInput,
  DashboardOverview,
  DashboardData,
} from '@ccbd-seo/analytics';
```

## License

[MIT](../../LICENSE)
