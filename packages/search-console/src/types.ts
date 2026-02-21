// ============================================================================
// @power-seo/search-console — Types
// ============================================================================

// --- Auth Types ---

export interface OAuthCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

export interface ServiceAccountCredentials {
  clientEmail: string;
  privateKeyId: string;
  signJwt: (payload: JwtPayload) => Promise<string>;
}

export interface JwtPayload {
  iss: string;
  scope: string;
  aud: string;
  exp: number;
  iat: number;
}

export interface TokenResult {
  accessToken: string;
  expiresAt: number;
}

export interface TokenManager {
  getToken: () => Promise<string>;
  invalidate: () => void;
}

// --- Client Types ---

export interface GSCClientConfig {
  auth: TokenManager;
  siteUrl: string;
  rateLimitPerMinute?: number;
  maxRetries?: number;
  baseUrl?: string;
}

export interface GSCClient {
  request: <T>(path: string, options?: RequestOptions) => Promise<T>;
  siteUrl: string;
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  signal?: globalThis.AbortSignal;
}

// --- Error ---

export class GSCApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly retryable: boolean;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'GSCApiError';
    this.status = status;
    this.code = code;
    this.retryable = status === 429 || status >= 500;
  }
}

// --- Analytics Types ---

export type SearchType = 'web' | 'image' | 'video' | 'news' | 'discover' | 'googleNews';
export type Dimension = 'query' | 'page' | 'country' | 'device' | 'date' | 'searchAppearance';
export type AggregationType = 'auto' | 'byPage' | 'byProperty';
export type DataState = 'all' | 'final';

export interface DimensionFilter {
  dimension: Dimension;
  operator:
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'includingRegex'
    | 'excludingRegex';
  expression: string;
}

export interface DimensionFilterGroup {
  groupType?: 'and';
  filters: DimensionFilter[];
}

export interface SearchAnalyticsRequest {
  startDate: string;
  endDate: string;
  dimensions?: Dimension[];
  searchType?: SearchType;
  dimensionFilterGroups?: DimensionFilterGroup[];
  aggregationType?: AggregationType;
  rowLimit?: number;
  startRow?: number;
  dataState?: DataState;
}

export interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchAnalyticsResponse {
  rows: SearchAnalyticsRow[];
  responseAggregationType: string;
}

// --- Inspection Types ---

export interface InspectionRequest {
  inspectionUrl: string;
  languageCode?: string;
}

export type VerdictState = 'PASS' | 'PARTIAL' | 'FAIL' | 'VERDICT_UNSPECIFIED' | 'NEUTRAL';
export type CrawlState =
  | 'SUCCESSFUL'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'ROBOTS_BLOCKED'
  | 'REDIRECT_ERROR'
  | 'ACCESS_DENIED'
  | 'ACCESS_FORBIDDEN';
export type IndexState =
  | 'INDEXED'
  | 'NOT_INDEXED'
  | 'SUBMITTED_AND_INDEXED'
  | 'CRAWLED_NOT_INDEXED'
  | 'DISCOVERED_NOT_INDEXED'
  | 'PAGE_WITH_REDIRECT';
export type RobotsTxtState = 'ALLOWED' | 'DISALLOWED';

export interface IndexStatusResult {
  verdict: VerdictState;
  coverageState: IndexState;
  robotsTxtState: RobotsTxtState;
  indexingState: string;
  lastCrawlTime?: string;
  pageFetchState?: CrawlState;
  referringUrls?: string[];
  sitemap?: string[];
}

export interface MobileUsabilityResult {
  verdict: VerdictState;
  issues?: Array<{ issueType: string; severity: string; message: string }>;
}

export interface RichResultsResult {
  verdict: VerdictState;
  detectedItems?: Array<{
    richResultType: string;
    items: Array<{ name: string; issues?: Array<{ issueMessage: string; severity: string }> }>;
  }>;
}

export interface InspectionResult {
  inspectionResultLink: string;
  indexStatusResult: IndexStatusResult;
  mobileUsabilityResult?: MobileUsabilityResult;
  richResultsResult?: RichResultsResult;
}

// --- Sitemap Types ---

export type SitemapType = 'sitemap' | 'atomFeed' | 'rssFeed' | 'notSitemap';

export interface SitemapEntry {
  path: string;
  lastSubmitted?: string;
  isPending: boolean;
  isSitemapsIndex: boolean;
  type: SitemapType;
  lastDownloaded?: string;
  warnings: number;
  errors: number;
  contents?: Array<{ type: string; submitted: number; indexed: number }>;
}

export interface SitemapListResponse {
  sitemap: SitemapEntry[];
}
