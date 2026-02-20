// ============================================================================
// @power-seo/tracking — Types
// ============================================================================

// --- Script Config ---

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';

export interface ScriptConfig {
  id: string;
  src?: string;
  innerHTML?: string;
  async?: boolean;
  defer?: boolean;
  consentCategory: ConsentCategory;
  attributes?: Record<string, string>;
  shouldLoad: (consent: ConsentState) => boolean;
}

// --- Consent ---

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface ConsentManager {
  getState: () => ConsentState;
  grant: (category: ConsentCategory) => void;
  revoke: (category: ConsentCategory) => void;
  grantAll: () => void;
  revokeAll: () => void;
  isGranted: (category: ConsentCategory) => boolean;
  onChange: (callback: ConsentChangeCallback) => () => void;
}

export type ConsentChangeCallback = (state: ConsentState) => void;

// --- GA4 Types ---

export interface GA4Config {
  measurementId: string;
  consentModeV2?: boolean;
  anonymizeIp?: boolean;
  sendPageView?: boolean;
}

export interface GA4ReportRequest {
  startDate: string;
  endDate: string;
  metrics: string[];
  dimensions?: string[];
  limit?: number;
}

export interface GA4ReportRow {
  dimensions: string[];
  metrics: number[];
}

export interface GA4ReportResponse {
  rows: GA4ReportRow[];
  rowCount: number;
  metadata?: { metricHeaders: Array<{ name: string; type: string }> };
}

export interface GA4Client {
  queryReport: (propertyId: string, request: GA4ReportRequest) => Promise<GA4ReportResponse>;
  getRealtimeReport: (propertyId: string, metrics: string[]) => Promise<GA4ReportResponse>;
  getMetadata: (propertyId: string) => Promise<GA4Metadata>;
}

export interface GA4Metadata {
  dimensions: Array<{ apiName: string; uiName: string; description: string }>;
  metrics: Array<{ apiName: string; uiName: string; description: string; type: string }>;
}

// --- Clarity Types ---

export interface ClarityConfig {
  projectId: string;
}

export interface ClarityProject {
  id: string;
  name: string;
  url: string;
}

export interface ClarityInsight {
  type: string;
  value: number;
  label: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ClarityHeatmapData {
  url: string;
  clicks: Array<{ x: number; y: number; count: number }>;
  scrollDepth: number[];
}

export interface ClarityClient {
  getProjects: () => Promise<ClarityProject[]>;
  getInsights: (projectId: string) => Promise<ClarityInsight[]>;
  getHeatmapData: (projectId: string, url: string) => Promise<ClarityHeatmapData>;
}

// --- PostHog Types ---

export interface PostHogConfig {
  apiKey: string;
  host?: string;
}

export interface PostHogEvent {
  event: string;
  timestamp: string;
  properties: Record<string, unknown>;
}

export interface PostHogTrendResult {
  label: string;
  data: number[];
  days: string[];
}

export interface PostHogFunnelStep {
  name: string;
  count: number;
  conversionRate: number;
}

export interface PostHogClient {
  queryEvents: (projectId: string, event: string, limit?: number) => Promise<PostHogEvent[]>;
  getTrends: (projectId: string, events: string[], days?: number) => Promise<PostHogTrendResult[]>;
  getFunnels: (projectId: string, steps: string[]) => Promise<PostHogFunnelStep[]>;
}

// --- Plausible Types ---

export interface PlausibleConfig {
  domain: string;
  selfHostedUrl?: string;
}

export interface PlausibleTimeseriesPoint {
  date: string;
  visitors: number;
  pageviews: number;
  bounceRate: number;
  visitDuration: number;
}

export interface PlausibleBreakdownEntry {
  property: string;
  visitors: number;
  pageviews: number;
  bounceRate: number;
}

export interface PlausibleAggregateResult {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  visitDuration: number;
  events: number;
}

export interface PlausibleClient {
  getTimeseries: (siteId: string, period?: string) => Promise<PlausibleTimeseriesPoint[]>;
  getBreakdown: (siteId: string, property: string, period?: string) => Promise<PlausibleBreakdownEntry[]>;
  getAggregate: (siteId: string, period?: string) => Promise<PlausibleAggregateResult>;
}

// --- Fathom Types ---

export interface FathomConfig {
  siteId: string;
}

export interface FathomSite {
  id: string;
  name: string;
  sharing: string;
}

export interface FathomPageview {
  pathname: string;
  pageviews: number;
  visitors: number;
  avgDuration: number;
  bounceRate: number;
}

export interface FathomReferrer {
  source: string;
  visitors: number;
  pageviews: number;
}

export interface FathomClient {
  getSites: () => Promise<FathomSite[]>;
  getPageviews: (siteId: string, period?: string) => Promise<FathomPageview[]>;
  getReferrers: (siteId: string, period?: string) => Promise<FathomReferrer[]>;
}
