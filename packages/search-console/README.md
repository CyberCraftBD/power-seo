# @ccbd-seo/search-console

> Google Search Console API client with OAuth2 and service account authentication.

Covers search analytics queries, URL inspection, and sitemap management with built-in rate limiting.

## Installation

```bash
npm install @ccbd-seo/search-console @ccbd-seo/core
```

## Usage

### Create a Client

```ts
import { createGSCClient, createTokenManager } from '@ccbd-seo/search-console';

// OAuth2
const tokenManager = createTokenManager({
  type: 'oauth',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  refreshToken: 'your-refresh-token',
});

const client = createGSCClient({
  siteUrl: 'https://example.com',
  tokenManager,
});
```

### Search Analytics

```ts
import { querySearchAnalytics, querySearchAnalyticsAll } from '@ccbd-seo/search-console';

const data = await querySearchAnalytics(client, {
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  dimensions: ['query', 'page'],
  rowLimit: 100,
});
// { rows: [{ keys, clicks, impressions, ctr, position }] }

// Auto-paginated (fetches all results)
const allData = await querySearchAnalyticsAll(client, {
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  dimensions: ['query'],
});
```

### URL Inspection

```ts
import { inspectUrl, inspectUrlDirect } from '@ccbd-seo/search-console';

const result = await inspectUrl(client, 'https://example.com/blog/my-post');
// { verdict, indexingState, lastCrawlTime, ... }

const directResult = await inspectUrlDirect(client, 'https://example.com/page');
```

### Sitemap Management

```ts
import { listSitemaps, submitSitemap, deleteSitemap } from '@ccbd-seo/search-console';

const sitemaps = await listSitemaps(client);
await submitSitemap(client, 'https://example.com/sitemap.xml');
await deleteSitemap(client, 'https://example.com/old-sitemap.xml');
```

## API Reference

### Auth

- `createTokenManager(config)` — Create OAuth2 or service account token manager with auto-refresh
- `exchangeRefreshToken(credentials)` — Exchange refresh token for access token
- `getServiceAccountToken(credentials)` — Get token from service account JWT

### Client

- `createGSCClient(config)` — Create authenticated GSC API client

### Analytics

- `querySearchAnalytics(client, request)` — Search performance data (clicks, impressions, CTR, position)
- `querySearchAnalyticsAll(client, request)` — Auto-paginated full results

### URL Inspection

- `inspectUrl(client, url)` — Check URL indexing status via client
- `inspectUrlDirect(client, url)` — Direct URL inspection

### Sitemaps

- `listSitemaps(client)` — List submitted sitemaps
- `submitSitemap(client, url)` — Submit a sitemap
- `deleteSitemap(client, url)` — Remove a sitemap

### Error Handling

- `GSCApiError` — Error class for GSC API errors

### Types

```ts
import type {
  OAuthCredentials,
  ServiceAccountCredentials,
  TokenResult,
  TokenManager,
  GSCClientConfig,
  GSCClient,
  SearchAnalyticsRequest,
  SearchAnalyticsRow,
  SearchAnalyticsResponse,
  InspectionResult,
  SitemapEntry,
  SitemapListResponse,
} from '@ccbd-seo/search-console';
```

## License

[MIT](../../LICENSE)
