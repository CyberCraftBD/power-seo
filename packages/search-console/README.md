# @power-seo/search-console — Google Search Console API Client with OAuth2 and Service Account Auth

Full-featured Google Search Console API client covering search analytics queries, auto-paginated data fetching, URL inspection, and sitemap management — with OAuth2 and service account authentication.

[![npm version](https://img.shields.io/npm/v/@power-seo/search-console?style=flat-square)](https://www.npmjs.com/package/@power-seo/search-console)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/search-console?style=flat-square)](https://www.npmjs.com/package/@power-seo/search-console)
[![MIT License](https://img.shields.io/npm/l/@power-seo/search-console?style=flat-square)](../../LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen?style=flat-square)](#)

`@power-seo/search-console` is a typed, production-ready client for the Google Search Console API. It handles the authentication complexity that makes the GSC API painful to work with — OAuth2 token refresh cycles, service account JWT signing, and token expiry management — so you can focus on the data rather than the plumbing.

The client covers the three main GSC API surfaces: search analytics (click, impression, CTR, and position data sliced by query, page, country, device, or date), URL inspection (indexing verdict, last crawl time, canonical URL, mobile usability, rich result status), and sitemap management (list, submit, delete). The `querySearchAnalyticsAll` function handles the GSC API's 25,000-row-per-request limit by automatically paginating through all results and returning a single merged dataset, eliminating the boilerplate that every GSC integration otherwise has to write.

The package integrates directly with `@power-seo/analytics` — pass the data from `querySearchAnalyticsAll` straight into `mergeGscWithAudit` to correlate your audit scores with real traffic data.

## Features

- **OAuth2 authentication** — `createTokenManager` with `type: 'oauth'` handles token refresh automatically; access tokens are cached and refreshed before expiry
- **Service account JWT authentication** — `createTokenManager` with `type: 'service-account'` signs JWTs using your service account credentials and exchanges them for Google access tokens
- **`exchangeRefreshToken`** — low-level function to exchange an OAuth2 refresh token for an access token manually
- **`getServiceAccountToken`** — low-level function to generate and exchange a service account JWT
- **Typed GSC client** — `createGSCClient(config)` returns a `GSCClient` instance scoped to a specific site URL
- **Search analytics queries** — `querySearchAnalytics(client, request)` fetches clicks, impressions, CTR, and position data; supports all GSC dimensions: `query`, `page`, `country`, `device`, `date`, `searchAppearance`
- **All search types** — `web`, `image`, `video`, and `news` search types supported
- **Auto-paginated full fetch** — `querySearchAnalyticsAll(client, request)` automatically pages through all results, merging them into a single `SearchAnalyticsRow[]` array — handles the 25,000-row API limit transparently
- **URL inspection** — `inspectUrl(client, url)` returns the full indexing status: verdict, indexing state, last crawl time, crawl allowed status, page fetch status, canonical URL (Google-selected and user-declared), mobile usability issues, and rich result status
- **Direct URL inspection** — `inspectUrlDirect(client, url)` for the direct URL inspection endpoint
- **Sitemap listing** — `listSitemaps(client)` returns all sitemaps submitted to the verified property with their status, last download time, and error counts
- **Sitemap submission** — `submitSitemap(client, url)` submits a sitemap URL for indexing
- **Sitemap deletion** — `deleteSitemap(client, url)` removes a previously submitted sitemap
- **Typed error handling** — `GSCApiError` class with `status`, `code`, and `message` for structured error handling
- **Type-safe throughout** — comprehensive TypeScript types for all request and response shapes

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [OAuth2 Authentication](#oauth2-authentication)
  - [Service Account Authentication](#service-account-authentication)
  - [Search Analytics](#search-analytics)
  - [Auto-Paginated Fetch](#auto-paginated-fetch)
  - [URL Inspection](#url-inspection)
  - [Sitemap Management](#sitemap-management)
  - [Error Handling](#error-handling)
- [API Reference](#api-reference)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
# npm
npm install @power-seo/search-console

# yarn
yarn add @power-seo/search-console

# pnpm
pnpm add @power-seo/search-console
```

## Quick Start

```ts
import { createTokenManager, createGSCClient, querySearchAnalyticsAll } from '@power-seo/search-console';

// 1. Create a token manager (OAuth2)
const tokenManager = createTokenManager({
  type:         'oauth',
  clientId:     process.env.GSC_CLIENT_ID!,
  clientSecret: process.env.GSC_CLIENT_SECRET!,
  refreshToken: process.env.GSC_REFRESH_TOKEN!,
});

// 2. Create a client scoped to your site
const client = createGSCClient({
  siteUrl:      'https://example.com',
  tokenManager,
});

// 3. Fetch all search analytics data (auto-paginated)
const rows = await querySearchAnalyticsAll(client, {
  startDate:  '2026-01-01',
  endDate:    '2026-01-31',
  dimensions: ['query', 'page'],
});

rows.forEach(({ keys, clicks, impressions, ctr, position }) => {
  console.log(`Query: "${keys[0]}", Page: ${keys[1]}`);
  console.log(`  ${clicks} clicks, ${impressions} impressions, pos ${position.toFixed(1)}`);
});
```

## Usage

### OAuth2 Authentication

For user-delegated access (e.g., for a web app where users connect their own GSC account).

```ts
import { createTokenManager, exchangeRefreshToken } from '@power-seo/search-console';
import type { OAuthCredentials, TokenResult } from '@power-seo/search-console';

// Using createTokenManager — tokens auto-refresh before expiry
const tokenManager = createTokenManager({
  type:         'oauth',
  clientId:     process.env.GSC_CLIENT_ID!,
  clientSecret: process.env.GSC_CLIENT_SECRET!,
  refreshToken: process.env.GSC_REFRESH_TOKEN!,
});

// Low-level: exchange refresh token manually
const credentials: OAuthCredentials = {
  clientId:     process.env.GSC_CLIENT_ID!,
  clientSecret: process.env.GSC_CLIENT_SECRET!,
  refreshToken: process.env.GSC_REFRESH_TOKEN!,
};

const result: TokenResult = await exchangeRefreshToken(credentials);
// { accessToken: string; expiresAt: Date }
```

### Service Account Authentication

For server-to-server access (CI pipelines, background jobs, reporting automation).

```ts
import { createTokenManager, getServiceAccountToken, createGSCClient } from '@power-seo/search-console';
import type { ServiceAccountCredentials } from '@power-seo/search-console';

const credentials: ServiceAccountCredentials = {
  clientEmail: process.env.GSC_SERVICE_ACCOUNT_EMAIL!,
  privateKey:  process.env.GSC_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
};

const tokenManager = createTokenManager({
  type: 'service-account',
  ...credentials,
});

// Use sc-domain: prefix for domain properties
const client = createGSCClient({
  siteUrl: 'sc-domain:example.com',
  tokenManager,
});

// Note: add the service account email as a verified user in GSC
// Settings → Users and permissions → Add user
```

### Search Analytics

Fetch click, impression, CTR, and position data filtered and grouped by any combination of dimensions.

```ts
import { querySearchAnalytics } from '@power-seo/search-console';
import type { SearchAnalyticsRequest, SearchAnalyticsResponse } from '@power-seo/search-console';

// Top keywords (group by query)
const byQuery: SearchAnalyticsResponse = await querySearchAnalytics(client, {
  startDate:  '2026-01-01',
  endDate:    '2026-01-31',
  dimensions: ['query'],
  rowLimit:   100,
  searchType: 'web',
});

byQuery.rows?.forEach(({ keys, clicks, impressions, ctr, position }) => {
  console.log(`"${keys[0]}": ${clicks} clicks @ pos ${position.toFixed(1)}`);
});

// Page performance (group by page and date)
const byPageDate = await querySearchAnalytics(client, {
  startDate:  '2026-01-01',
  endDate:    '2026-01-31',
  dimensions: ['page', 'date'],
  rowLimit:   500,
});

// Filter to specific country
const bangladeshData = await querySearchAnalytics(client, {
  startDate:  '2026-01-01',
  endDate:    '2026-01-31',
  dimensions: ['query', 'country'],
  dimensionFilterGroups: [{
    filters: [{
      dimension:  'country',
      operator:   'equals',
      expression: 'bgd',
    }],
  }],
});
```

### Auto-Paginated Fetch

The GSC API returns at most 25,000 rows per request. `querySearchAnalyticsAll` handles pagination transparently.

```ts
import { querySearchAnalyticsAll } from '@power-seo/search-console';
import type { SearchAnalyticsRow } from '@power-seo/search-console';

// Fetches ALL queries — regardless of how many pages it takes
const allRows: SearchAnalyticsRow[] = await querySearchAnalyticsAll(client, {
  startDate:  '2026-01-01',
  endDate:    '2026-01-31',
  dimensions: ['query'],
});

console.log(`Total queries fetched: ${allRows.length}`);

// Feed directly into @power-seo/analytics
import { mergeGscWithAudit } from '@power-seo/analytics';

const gscPages = allRows.map(({ keys, clicks, impressions, ctr, position }) => ({
  url: keys[0],
  clicks,
  impressions,
  ctr,
  position,
}));
```

### URL Inspection

Check whether a URL is indexed by Google and retrieve detailed crawl and rich result information.

```ts
import { inspectUrl, inspectUrlDirect } from '@power-seo/search-console';
import type { InspectionResult } from '@power-seo/search-console';

const result: InspectionResult = await inspectUrl(client, 'https://example.com/blog/react-seo');

console.log(`Verdict: ${result.verdict}`);
// 'PASS' | 'FAIL' | 'NEUTRAL'

console.log(`Indexing state: ${result.indexingState}`);
// 'INDEXING_ALLOWED' | 'BLOCKED_BY_ROBOTS_TXT' | 'BLOCKED_BY_META_TAG' | ...

console.log(`Last crawl: ${result.lastCrawlTime}`);
console.log(`Mobile usability: ${result.mobileUsabilityResult?.verdict}`);
console.log(`Rich result status: ${result.richResultsResult?.verdict}`);

if (result.richResultsResult?.detectedItems) {
  result.richResultsResult.detectedItems.forEach(({ richResultType, items }) => {
    console.log(`  ${richResultType}: ${items.length} items detected`);
  });
}

// Direct URL inspection (different endpoint, same data shape)
const directResult: InspectionResult = await inspectUrlDirect(client, 'https://example.com/about');
```

### Sitemap Management

```ts
import { listSitemaps, submitSitemap, deleteSitemap } from '@power-seo/search-console';
import type { SitemapEntry, SitemapListResponse } from '@power-seo/search-console';

// List all submitted sitemaps
const response: SitemapListResponse = await listSitemaps(client);
response.sitemap?.forEach((sitemap: SitemapEntry) => {
  console.log(`${sitemap.path}`);
  console.log(`  Last downloaded: ${sitemap.lastDownloaded}`);
  console.log(`  Errors: ${sitemap.errors}, Warnings: ${sitemap.warnings}`);
});

// Submit new sitemaps
await submitSitemap(client, 'https://example.com/sitemap.xml');
await submitSitemap(client, 'https://example.com/sitemap-image.xml');

// Remove an old sitemap
await deleteSitemap(client, 'https://example.com/old-sitemap.xml');
```

### Error Handling

```ts
import { querySearchAnalytics, GSCApiError } from '@power-seo/search-console';

try {
  const data = await querySearchAnalytics(client, {
    startDate:  '2026-01-01',
    endDate:    '2026-01-31',
    dimensions: ['query'],
  });
} catch (error) {
  if (error instanceof GSCApiError) {
    console.error(`GSC API error [${error.status}]: ${error.message}`);

    if (error.status === 403) {
      console.error('Check that your credentials have access to this Search Console property');
    } else if (error.status === 429) {
      console.error('Rate limit exceeded — implement exponential backoff');
    }
  } else {
    throw error;
  }
}
```

## API Reference

### `createTokenManager(config)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `config.type` | `'oauth' \| 'service-account'` | required | Authentication method |
| `config.clientId` | `string` | OAuth2 only | Google OAuth2 client ID |
| `config.clientSecret` | `string` | OAuth2 only | Google OAuth2 client secret |
| `config.refreshToken` | `string` | OAuth2 only | OAuth2 refresh token |
| `config.clientEmail` | `string` | Service account only | Service account email address |
| `config.privateKey` | `string` | Service account only | Service account private key (PEM format) |
| `config.scopes` | `string[]` | Service account only | OAuth2 scopes to request |

Returns `TokenManager`: `{ getAccessToken(): Promise<TokenResult> }`.

---

### `exchangeRefreshToken(credentials)` / `getServiceAccountToken(credentials)`

Both return `Promise<TokenResult>`: `{ accessToken: string; expiresAt: Date }`.

---

### `createGSCClient(config)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `config.siteUrl` | `string` | required | Verified GSC property URL (use `sc-domain:` prefix for domain properties) |
| `config.tokenManager` | `TokenManager` | required | Token manager from `createTokenManager` |

Returns `GSCClient`.

---

### `querySearchAnalytics(client, request)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `request.startDate` | `string` | required | Start date in `YYYY-MM-DD` format |
| `request.endDate` | `string` | required | End date in `YYYY-MM-DD` format |
| `request.dimensions` | `Dimension[]` | `[]` | Grouping dimensions: `'query'`, `'page'`, `'country'`, `'device'`, `'date'`, `'searchAppearance'` |
| `request.searchType` | `SearchType` | `'web'` | `'web'`, `'image'`, `'video'`, or `'news'` |
| `request.rowLimit` | `number` | `1000` | Rows per request (max 25,000) |
| `request.startRow` | `number` | `0` | Row offset for manual pagination |
| `request.dimensionFilterGroups` | `object[]` | `[]` | Filter groups to narrow results |

Returns `Promise<SearchAnalyticsResponse>`.

---

### `querySearchAnalyticsAll(client, request)`

Same parameters as `querySearchAnalytics` except `rowLimit` and `startRow` are managed automatically.

Returns `Promise<SearchAnalyticsRow[]>` — the complete merged dataset across all pages.

---

### `inspectUrl(client, url)` / `inspectUrlDirect(client, url)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `client` | `GSCClient` | required | Authenticated GSC client |
| `url` | `string` | required | Fully qualified URL to inspect |

Returns `Promise<InspectionResult>`.

---

### `listSitemaps(client)` / `submitSitemap(client, url)` / `deleteSitemap(client, url)`

`listSitemaps` returns `Promise<SitemapListResponse>`. `submitSitemap` and `deleteSitemap` return `Promise<void>`.

---

### Types

```ts
import type {
  OAuthCredentials,            // { clientId, clientSecret, refreshToken }
  ServiceAccountCredentials,   // { clientEmail, privateKey, scopes }
  JwtPayload,                  // JWT payload structure for service account auth
  TokenResult,                 // { accessToken: string; expiresAt: Date }
  TokenManager,                // { getAccessToken(): Promise<TokenResult> }
  GSCClientConfig,             // { siteUrl, tokenManager }
  GSCClient,                   // Authenticated client instance
  SearchType,                  // 'web' | 'image' | 'video' | 'news'
  Dimension,                   // 'query' | 'page' | 'country' | 'device' | 'date' | 'searchAppearance'
  SearchAnalyticsRequest,      // Full query request shape
  SearchAnalyticsRow,          // { keys: string[]; clicks, impressions, ctr, position }
  SearchAnalyticsResponse,     // { rows: SearchAnalyticsRow[]; responseAggregationType }
  InspectionResult,            // { verdict, indexingState, lastCrawlTime, ... }
  SitemapEntry,                // { path, lastSubmitted, lastDownloaded, errors, warnings, contents }
  SitemapListResponse,         // { sitemap: SitemapEntry[] }
} from '@power-seo/search-console';
```

## The @power-seo Ecosystem

`@power-seo/search-console` is part of the **@power-seo** monorepo — a complete, modular SEO toolkit for modern JavaScript applications.

| Package | Install | Description |
|---------|---------|-------------|
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core) | `npm i @power-seo/core` | Framework-agnostic utilities, types, validators, and constants |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react) | `npm i @power-seo/react` | React SEO components — meta, Open Graph, Twitter Card, breadcrumbs |
| [`@power-seo/meta`](https://www.npmjs.com/package/@power-seo/meta) | `npm i @power-seo/meta` | SSR meta helpers for Next.js App Router, Remix v2, and generic SSR |
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema) | `npm i @power-seo/schema` | Type-safe JSON-LD structured data — 20 builders + 18 React components |
| [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis) | `npm i @power-seo/content-analysis` | Yoast-style SEO content scoring engine with React components |
| [`@power-seo/readability`](https://www.npmjs.com/package/@power-seo/readability) | `npm i @power-seo/readability` | Readability scoring — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI |
| [`@power-seo/preview`](https://www.npmjs.com/package/@power-seo/preview) | `npm i @power-seo/preview` | SERP, Open Graph, and Twitter/X Card preview generators |
| [`@power-seo/sitemap`](https://www.npmjs.com/package/@power-seo/sitemap) | `npm i @power-seo/sitemap` | XML sitemap generation, streaming, index splitting, and validation |
| [`@power-seo/redirects`](https://www.npmjs.com/package/@power-seo/redirects) | `npm i @power-seo/redirects` | Redirect engine with Next.js, Remix, and Express adapters |
| [`@power-seo/links`](https://www.npmjs.com/package/@power-seo/links) | `npm i @power-seo/links` | Link graph analysis — orphan detection, suggestions, equity scoring |
| [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit) | `npm i @power-seo/audit` | Full SEO audit engine — meta, content, structure, performance rules |
| [`@power-seo/images`](https://www.npmjs.com/package/@power-seo/images) | `npm i @power-seo/images` | Image SEO — alt text, lazy loading, format analysis, image sitemaps |
| [`@power-seo/ai`](https://www.npmjs.com/package/@power-seo/ai) | `npm i @power-seo/ai` | LLM-agnostic AI prompt templates and parsers for SEO tasks |
| [`@power-seo/analytics`](https://www.npmjs.com/package/@power-seo/analytics) | `npm i @power-seo/analytics` | Merge GSC + audit data, trend analysis, ranking insights, dashboard |
| [`@power-seo/search-console`](https://www.npmjs.com/package/@power-seo/search-console) | `npm i @power-seo/search-console` | Google Search Console API — OAuth2, service account, URL inspection |
| [`@power-seo/integrations`](https://www.npmjs.com/package/@power-seo/integrations) | `npm i @power-seo/integrations` | Semrush and Ahrefs API clients with rate limiting and pagination |
| [`@power-seo/tracking`](https://www.npmjs.com/package/@power-seo/tracking) | `npm i @power-seo/tracking` | GA4, Clarity, PostHog, Plausible, Fathom — scripts + consent management |

---

## About CyberCraft Bangladesh

**CyberCraft Bangladesh** is a Bangladesh-based enterprise-grade software engineering company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

| | |
|---|---|
| **Website** | [ccbd.dev](https://ccbd.dev) |
| **GitHub** | [github.com/cybercraftbd](https://github.com/cybercraftbd) |
| **npm Organization** | [npmjs.com/org/power-seo](https://www.npmjs.com/org/power-seo) |
| **Email** | [info@ccbd.dev](mailto:info@ccbd.dev) |

© 2026 CyberCraft Bangladesh · Released under the [MIT License](../../LICENSE)
