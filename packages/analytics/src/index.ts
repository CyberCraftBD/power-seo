// @power-seo/analytics — Public API
// ----------------------------------------------------------------------------

export { mergeGscWithAudit, correlateScoreAndTraffic } from './merge.js';
export { analyzeTrend, buildTrendLines, detectAnomalies } from './trends.js';
export { analyzeQueryRankings, trackPositionChanges } from './rankings.js';
export { buildDashboardData } from './dashboard.js';

export type {
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
  AuditCategory,
  CategoryResult,
  PageAuditResult,
} from './types.js';
