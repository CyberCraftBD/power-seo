// ============================================================================
// @power-seo/analytics — Types
// ============================================================================

import type { AuditCategory, CategoryResult } from '@power-seo/audit';

export type { AuditCategory, CategoryResult };
export type { PageAuditResult } from '@power-seo/audit';

export interface GscPageData {
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date?: string;
}

export interface GscQueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date?: string;
}

export interface AuditSnapshot {
  date: string;
  url: string;
  score: number;
  categories: Record<AuditCategory, number>;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export type TrendDirection = 'improving' | 'declining' | 'stable';

export interface TrendAnalysis {
  metric: string;
  trend: TrendDirection;
  change: number;
  points: TrendPoint[];
}

export interface PageInsight {
  url: string;
  gscMetrics?: { clicks: number; impressions: number; ctr: number; position: number };
  auditScore?: number;
  auditCategories?: Record<AuditCategory, CategoryResult>;
  opportunities: string[];
}

export interface RankingBucket {
  range: string;
  count: number;
  queries: GscQueryData[];
}

export interface RankingAnalysis {
  totalQueries: number;
  buckets: RankingBucket[];
  strikingDistance: GscQueryData[];
}

export interface PositionChange {
  query: string;
  previousPosition: number;
  currentPosition: number;
  change: number;
  impressionChange: number;
}

export interface DashboardInput {
  gscPages?: GscPageData[];
  gscQueries?: GscQueryData[];
  auditResults?: Array<{
    url: string;
    score: number;
    categories: Record<AuditCategory, CategoryResult>;
    recommendations: string[];
  }>;
  auditHistory?: AuditSnapshot[];
}

export interface DashboardOverview {
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  averageAuditScore: number;
  totalPages: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  topPages: GscPageData[];
  topQueries: GscQueryData[];
  trendLines: Record<string, TrendAnalysis>;
  issues: string[];
}
