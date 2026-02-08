// ============================================================================
// @ccbd-seo/search-console — Main Entry Point
// ============================================================================

// Types
export type {
  OAuthCredentials,
  ServiceAccountCredentials,
  JwtPayload,
  TokenResult,
  TokenManager,
  GSCClientConfig,
  GSCClient,
  RequestOptions,
  SearchType,
  Dimension,
  AggregationType,
  DataState,
  DimensionFilter,
  DimensionFilterGroup,
  SearchAnalyticsRequest,
  SearchAnalyticsRow,
  SearchAnalyticsResponse,
  InspectionRequest,
  VerdictState,
  CrawlState,
  IndexState,
  RobotsTxtState,
  IndexStatusResult,
  MobileUsabilityResult,
  RichResultsResult,
  InspectionResult,
  SitemapType,
  SitemapEntry,
  SitemapListResponse,
} from './types.js';

// Error class
export { GSCApiError } from './types.js';

// Auth
export { exchangeRefreshToken, getServiceAccountToken, createTokenManager } from './auth.js';

// Client
export { createGSCClient } from './client.js';

// Analytics
export { querySearchAnalytics, querySearchAnalyticsAll } from './analytics.js';

// URL Inspection
export { inspectUrl, inspectUrlDirect } from './inspection.js';

// Sitemaps
export { listSitemaps, submitSitemap, deleteSitemap } from './sitemaps.js';
