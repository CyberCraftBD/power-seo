// ============================================================================
// @ccbd-seo/analytics — Dashboard Data Builder
// ============================================================================

import type { DashboardInput, DashboardData, DashboardOverview } from './types.js';
import { buildTrendLines } from './trends.js';

export function buildDashboardData(input: DashboardInput): DashboardData {
  const { gscPages = [], gscQueries = [], auditResults = [], auditHistory = [] } = input;

  // Overview metrics
  const totalClicks = gscPages.reduce((sum, p) => sum + p.clicks, 0);
  const totalImpressions = gscPages.reduce((sum, p) => sum + p.impressions, 0);
  const averageCtr = gscPages.length > 0
    ? Math.round((gscPages.reduce((sum, p) => sum + p.ctr, 0) / gscPages.length) * 10000) / 10000
    : 0;
  const averagePosition = gscPages.length > 0
    ? Math.round((gscPages.reduce((sum, p) => sum + p.position, 0) / gscPages.length) * 10) / 10
    : 0;
  const averageAuditScore = auditResults.length > 0
    ? Math.round(auditResults.reduce((sum, r) => sum + r.score, 0) / auditResults.length)
    : 0;
  const totalPages = Math.max(gscPages.length, auditResults.length);

  const overview: DashboardOverview = {
    totalClicks,
    totalImpressions,
    averageCtr,
    averagePosition,
    averageAuditScore,
    totalPages,
  };

  // Top pages by clicks
  const topPages = [...gscPages].sort((a, b) => b.clicks - a.clicks).slice(0, 10);

  // Top queries by clicks
  const topQueries = [...gscQueries].sort((a, b) => b.clicks - a.clicks).slice(0, 10);

  // Trend lines from audit history
  const trendLines = buildTrendLines(auditHistory);

  // Collect issues from audit results
  const issues: string[] = [];
  for (const result of auditResults) {
    issues.push(...result.recommendations);
  }
  // Deduplicate and limit
  const uniqueIssues = [...new Set(issues)].slice(0, 20);

  return {
    overview,
    topPages,
    topQueries,
    trendLines,
    issues: uniqueIssues,
  };
}
