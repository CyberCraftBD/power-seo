// ============================================================================
// @power-seo/integrations — Types
// ============================================================================

// --- HTTP Client Types ---

export type AuthStrategy =
  | { type: 'query'; paramName: string; value: string }
  | { type: 'bearer'; token: string };

export interface HttpClientConfig {
  baseUrl: string;
  auth: AuthStrategy;
  rateLimitPerMinute?: number;
  maxRetries?: number;
  timeoutMs?: number;
}

export interface HttpClient {
  get: <T>(path: string, params?: Record<string, string>) => Promise<T>;
  post: <T>(path: string, body?: unknown) => Promise<T>;
}

// --- Error ---

export class IntegrationApiError extends Error {
  readonly status: number;
  readonly provider: string;
  readonly retryable: boolean;

  constructor(message: string, status: number, provider: string) {
    super(message);
    this.name = 'IntegrationApiError';
    this.status = status;
    this.provider = provider;
    this.retryable = status === 429 || status >= 500;
  }
}

// --- Pagination ---

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

// --- Semrush Types ---

export interface SemrushDomainOverview {
  domain: string;
  organicKeywords: number;
  organicTraffic: number;
  organicCost: number;
  paidKeywords: number;
  paidTraffic: number;
  paidCost: number;
  backlinks: number;
  authorityScore: number;
}

export interface SemrushKeywordData {
  keyword: string;
  position: number;
  previousPosition: number;
  searchVolume: number;
  cpc: number;
  url: string;
  traffic: number;
  trafficPercent: number;
  trafficCost: number;
  competition: number;
}

export interface SemrushBacklinkData {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  isNoFollow: boolean;
  firstSeen: string;
  lastSeen: string;
  sourceAuthorityScore: number;
}

export interface SemrushKeywordDifficulty {
  keyword: string;
  difficulty: number;
  searchVolume: number;
  cpc: number;
  competition: number;
  results: number;
}

export interface SemrushRelatedKeyword {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  results: number;
  relatedTo: string;
}

export interface SemrushClient {
  getDomainOverview: (domain: string, database?: string) => Promise<SemrushDomainOverview>;
  getOrganicKeywords: (
    domain: string,
    options?: SemrushPaginationOptions,
  ) => Promise<PaginatedResponse<SemrushKeywordData>>;
  getBacklinks: (
    domain: string,
    options?: SemrushPaginationOptions,
  ) => Promise<PaginatedResponse<SemrushBacklinkData>>;
  getKeywordDifficulty: (
    keywords: string[],
    database?: string,
  ) => Promise<SemrushKeywordDifficulty[]>;
  getRelatedKeywords: (keyword: string, database?: string) => Promise<SemrushRelatedKeyword[]>;
}

export interface SemrushPaginationOptions {
  limit?: number;
  offset?: number;
  database?: string;
}

// --- Ahrefs Types ---

export interface AhrefsSiteOverview {
  domain: string;
  domainRating: number;
  urlRating: number;
  backlinks: number;
  referringDomains: number;
  organicKeywords: number;
  organicTraffic: number;
  trafficValue: number;
}

export interface AhrefsOrganicKeyword {
  keyword: string;
  position: number;
  searchVolume: number;
  cpc: number;
  url: string;
  traffic: number;
  trafficPercent: number;
  difficulty: number;
}

export interface AhrefsBacklink {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  domainRating: number;
  urlRating: number;
  isDoFollow: boolean;
  firstSeen: string;
  lastSeen: string;
}

export interface AhrefsKeywordDifficulty {
  keyword: string;
  difficulty: number;
  searchVolume: number;
  cpc: number;
  clicks: number;
  globalVolume: number;
}

export interface AhrefsReferringDomain {
  domain: string;
  domainRating: number;
  backlinks: number;
  firstSeen: string;
  lastSeen: string;
  isDoFollow: boolean;
}

export interface AhrefsClient {
  getSiteOverview: (domain: string) => Promise<AhrefsSiteOverview>;
  getOrganicKeywords: (
    domain: string,
    options?: AhrefsPaginationOptions,
  ) => Promise<PaginatedResponse<AhrefsOrganicKeyword>>;
  getBacklinks: (
    domain: string,
    options?: AhrefsPaginationOptions,
  ) => Promise<PaginatedResponse<AhrefsBacklink>>;
  getKeywordDifficulty: (keywords: string[]) => Promise<AhrefsKeywordDifficulty[]>;
  getReferringDomains: (
    domain: string,
    options?: AhrefsPaginationOptions,
  ) => Promise<PaginatedResponse<AhrefsReferringDomain>>;
}

export interface AhrefsPaginationOptions {
  limit?: number;
  offset?: number;
}
