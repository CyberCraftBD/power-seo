// @power-seo/integrations — Main Entry Point
// ----------------------------------------------------------------------------

// Types
export type {
  AuthStrategy,
  HttpClientConfig,
  HttpClient,
  PaginatedResponse,
  SemrushDomainOverview,
  SemrushKeywordData,
  SemrushBacklinkData,
  SemrushKeywordDifficulty,
  SemrushRelatedKeyword,
  SemrushClient,
  SemrushPaginationOptions,
  AhrefsSiteOverview,
  AhrefsOrganicKeyword,
  AhrefsBacklink,
  AhrefsKeywordDifficulty,
  AhrefsReferringDomain,
  AhrefsClient,
  AhrefsPaginationOptions,
} from './types.js';

// Error class
export { IntegrationApiError } from './types.js';

// HTTP Client
export { createHttpClient } from './http.js';

// Semrush
export { createSemrushClient } from './semrush/client.js';

// Ahrefs
export { createAhrefsClient } from './ahrefs/client.js';
