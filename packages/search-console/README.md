# @power-seo/search-console — Google Search Console API Client for TypeScript — OAuth2, Service Account, URL Inspection & Auto-Paginated Analytics

[![npm version](https://img.shields.io/npm/v/@power-seo/search-console?style=flat-square)](https://www.npmjs.com/package/@power-seo/search-console)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/search-console?style=flat-square)](https://www.npmjs.com/package/@power-seo/search-console)
[![MIT License](https://img.shields.io/npm/l/@power-seo/search-console?style=flat-square)](../../LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen?style=flat-square)](#)

---

## Overview

**@power-seo/search-console** is a production-ready Google Search Console API client for TypeScript that helps you query search analytics, inspect URLs, and manage sitemaps — without writing OAuth2 token refresh boilerplate or pagination loops.

**What it does**

- ✅ **OAuth2 and service account auth** — `createTokenManager()` handles token refresh cycles and JWT signing automatically
- ✅ **Search analytics queries** — clicks, impressions, CTR, and position by query, page, country, device, date
- ✅ **Auto-paginated full fetch** — `querySearchAnalyticsAll()` transparently pages through the 25,000-row GSC API limit
- ✅ **URL inspection** — indexing verdict, last crawl time, canonical URL, mobile usability, rich result status
- ✅ **Sitemap management** — list, submit, and delete sitemaps from verified GSC properties

**What it is not**

- ❌ **Not a reporting dashboard** — returns raw data; use `@power-seo/analytics` to merge and visualize
- ❌ **Not a site verification tool** — requires a property already verified in Google Search Console

**Recommended for**

- **SEO automation pipelines**, **CI/CD keyword tracking**, **SaaS analytics dashboards**, and **reporting scripts** using GSC data

---

## Why @power-seo/search-console Matters

**The problem**

- **OAuth2 token refresh is complex** — access tokens expire every hour; service account JWT signing requires crypto operations
- **GSC returns only 25,000 rows per request** — sites with many queries need pagination loops that every team reimplements
- **URL inspection data is inaccessible without auth** — no simple way to check indexing status programmatically

**Why developers care**

- **SEO:** Programmatic access to real click/impression data enables data-driven content decisions
- **Performance:** Auto-paginated `querySearchAnalyticsAll` eliminates boilerplate that slows down analytics pipelines
- **UX:** URL inspection in CI enables instant indexing health checks after deployments

---

## Key Features

- **OAuth2 authentication** — `createTokenManager({ type: 'oauth' })` handles token refresh automatically
- **Service account JWT authentication** — `createTokenManager({ type: 'service-account' })` signs JWTs for server-to-server access
- **Low-level auth primitives** — `exchangeRefreshToken()` and `getServiceAccountToken()` for custom auth flows
- **Typed GSC client** — `createGSCClient(config)` returns a `GSCClient` scoped to a specific site URL
- **Search analytics** — `querySearchAnalytics()` supports all 6 dimensions: `query`, `page`, `country`, `device`, `date`, `searchAppearance`
- **All search types** — `web`, `image`, `video`, and `news` search types
- **Auto-paginated full fetch** — `querySearchAnalyticsAll()` merges all pages into a single `SearchAnalyticsRow[]` array
- **URL inspection** — `inspectUrl()` returns verdict, indexing state, last crawl time, mobile usability, and rich result status
- **Direct URL inspection** — `inspectUrlDirect()` for the direct URL inspection endpoint
- **Sitemap listing** — `listSitemaps()` with status, last download time, and error counts
- **Sitemap submission and deletion** — `submitSitemap()` and `deleteSitemap()`
- **Typed error handling** — `GSCApiError` class with `status`, `code`, and `message`
- **Type-safe throughout** — full TypeScript types for all request and response shapes

---

## Benefits of Using @power-seo/search-console

- **Faster analytics pipelines**: No token refresh boilerplate; token manager handles expiry transparently
- **Complete datasets**: `querySearchAnalyticsAll` fetches all rows regardless of API page limit
- **Safer integration**: `GSCApiError` structured error class enables reliable error handling in production
- **Faster delivery**: Connect to GSC in minutes; no OAuth2 library research required

---

## Quick Start

```ts
import {
  createTokenManager,
  createGSCClient,
  querySearchAnalyticsAll,
} from '@power-seo/search-console';

// 1. Create a token manager (OAuth2)
const tokenManager = createTokenManager({
  type: 'oauth',
  clientId: process.env.GSC_CLIENT_ID!,
  clientSecret: process.env.GSC_CLIENT_SECRET!,
  refreshToken: process.env.GSC_REFRESH_TOKEN!,
});

// 2. Create a client scoped to your site
const client = createGSCClient({
  siteUrl: 'https://example.com',
  tokenManager,
});

// 3. Fetch all search analytics data (auto-paginated)
const rows = await querySearchAnalyticsAll(client, {
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  dimensions: ['query', 'page'],
});

rows.forEach(({ keys, clicks, impressions, ctr, position }) => {
  console.log(`Query: "${keys[0]}", Page: ${keys[1]}`);
  console.log(`  ${clicks} clicks, ${impressions} impressions, pos ${position.toFixed(1)}`);
});
```

**What you should see**

- A merged `SearchAnalyticsRow[]` array with all query-page combinations for the date range
- `clicks`, `impressions`, `ctr`, and `position` for each row

---

## Installation

```bash
npm i @power-seo/search-console
# or
yarn add @power-seo/search-console
# or
pnpm add @power-seo/search-console
# or
bun add @power-seo/search-console
```

---

## Framework Compatibility

**Supported**

- ✅ Next.js (App Router / Pages Router) — use in API routes or server actions
- ✅ Remix — use in loader functions and server-side actions
- ✅ Node.js 18+ — pure TypeScript client with `fetch` API
- ✅ CI/CD pipelines — run as standalone Node scripts in GitHub Actions or similar

**Environment notes**

- **SSR/SSG:** Fully supported — all operations are server-side
- **Edge runtime:** Not supported (requires crypto for JWT signing)
- **Browser-only usage:** Not supported — exposes credentials; server-side only

---

## Use Cases

- **Automated keyword ranking reports** — fetch all queries weekly and diff against previous week
- **Indexing health monitoring** — `inspectUrl` after deployments to verify new pages are indexed
- **Content gap analysis** — merge GSC data with `@power-seo/analytics` to find high-impression, low-click pages
- **Sitemap automation** — submit new sitemaps programmatically after content migrations
- **CI/CD SEO checks** — fail pipelines when key pages drop below position threshold
- **Multi-site SaaS dashboards** — aggregate GSC data across multiple client properties
- **Image and news search analytics** — query `image` and `news` search types separately
- **Country and device breakdowns** — segment click data by country or device for regional SEO

---

## Example (Before / After)

```text
Before:
- Manual OAuth2 token refresh: 50+ lines of token exchange code per project
- Pagination loop: separate rowOffset counter, multiple fetch calls, manual array merging
- URL inspection: no programmatic access → check Google Search Console UI manually

After (@power-seo/search-console):
- createTokenManager({ type: 'oauth', ... }) → tokens auto-refresh before every request
- querySearchAnalyticsAll(client, { dimensions: ['query'] }) → one call, complete dataset
- inspectUrl(client, url) → { verdict: 'PASS', lastCrawlTime: '...', mobileUsabilityResult: {...} }
```

---

## Implementation Best Practices

- **Use service accounts for CI/CD** — service accounts don't expire and don't require user interaction
- **Cache `querySearchAnalyticsAll` results** — GSC data is delayed by ~2 days; daily fetches are sufficient
- **Use `sc-domain:` prefix for domain properties** — e.g. `sc-domain:example.com` for domain-level verification
- **Add service account email as GSC user** — Settings → Users and permissions → Add user
- **Handle `GSCApiError` status 429** — implement exponential backoff for rate-limited requests

---

## Architecture Overview

**Where it runs**

- **Build-time**: Fetch GSC data for static site revalidation or build-time content ranking
- **Runtime**: Query analytics in serverless functions for real-time dashboard data
- **CI/CD**: Check indexing status and keyword positions in automated pipelines

**Data flow**

1. **Input**: OAuth2 credentials or service account key + site URL + query parameters
2. **Analysis**: Token manager handles auth; client sends typed requests to GSC API
3. **Output**: Typed `SearchAnalyticsRow[]`, `InspectionResult`, `SitemapListResponse`
4. **Action**: Feed into `@power-seo/analytics` for dashboards, or export as CSV/JSON reports

---

## Features Comparison with Popular Packages

| Capability                         | google-auth-library | googleapis | custom fetch | @power-seo/search-console |
| ---------------------------------- | ------------------: | ---------: | -----------: | ------------------------: |
| OAuth2 token auto-refresh          |                  ✅ |         ✅ |           ❌ |                        ✅ |
| Service account JWT signing        |                  ✅ |         ✅ |           ❌ |                        ✅ |
| Auto-paginated analytics fetch     |                  ❌ |         ❌ |           ❌ |                        ✅ |
| Typed GSC-specific response shapes |                  ❌ |         ⚠️ |           ❌ |                        ✅ |
| URL inspection support             |                  ❌ |         ⚠️ |           ❌ |                        ✅ |
| Sitemap management                 |                  ❌ |         ⚠️ |           ❌ |                        ✅ |

---

## [@power-seo](https://www.npmjs.com/org/power-seo) Ecosystem

All 17 packages are independently installable — use only what you need.

| Package                                                                                    | Install                             | Description                                                             |
| ------------------------------------------------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------- |
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core)                         | `npm i @power-seo/core`             | Framework-agnostic utilities, types, validators, and constants          |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react)                       | `npm i @power-seo/react`            | React SEO components — meta, Open Graph, Twitter Card, breadcrumbs      |
| [`@power-seo/meta`](https://www.npmjs.com/package/@power-seo/meta)                         | `npm i @power-seo/meta`             | SSR meta helpers for Next.js App Router, Remix v2, and generic SSR      |
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema)                     | `npm i @power-seo/schema`           | Type-safe JSON-LD structured data — 20 builders + 18 React components   |
| [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis) | `npm i @power-seo/content-analysis` | Yoast-style SEO content scoring engine with React components            |
| [`@power-seo/readability`](https://www.npmjs.com/package/@power-seo/readability)           | `npm i @power-seo/readability`      | Readability scoring — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI    |
| [`@power-seo/preview`](https://www.npmjs.com/package/@power-seo/preview)                   | `npm i @power-seo/preview`          | SERP, Open Graph, and Twitter/X Card preview generators                 |
| [`@power-seo/sitemap`](https://www.npmjs.com/package/@power-seo/sitemap)                   | `npm i @power-seo/sitemap`          | XML sitemap generation, streaming, index splitting, and validation      |
| [`@power-seo/redirects`](https://www.npmjs.com/package/@power-seo/redirects)               | `npm i @power-seo/redirects`        | Redirect engine with Next.js, Remix, and Express adapters               |
| [`@power-seo/links`](https://www.npmjs.com/package/@power-seo/links)                       | `npm i @power-seo/links`            | Link graph analysis — orphan detection, suggestions, equity scoring     |
| [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit)                       | `npm i @power-seo/audit`            | Full SEO audit engine — meta, content, structure, performance rules     |
| [`@power-seo/images`](https://www.npmjs.com/package/@power-seo/images)                     | `npm i @power-seo/images`           | Image SEO — alt text, lazy loading, format analysis, image sitemaps     |
| [`@power-seo/ai`](https://www.npmjs.com/package/@power-seo/ai)                             | `npm i @power-seo/ai`               | LLM-agnostic AI prompt templates and parsers for SEO tasks              |
| [`@power-seo/analytics`](https://www.npmjs.com/package/@power-seo/analytics)               | `npm i @power-seo/analytics`        | Merge GSC + audit data, trend analysis, ranking insights, dashboard     |
| [`@power-seo/search-console`](https://www.npmjs.com/package/@power-seo/search-console)     | `npm i @power-seo/search-console`   | Google Search Console API — OAuth2, service account, URL inspection     |
| [`@power-seo/integrations`](https://www.npmjs.com/package/@power-seo/integrations)         | `npm i @power-seo/integrations`     | Semrush and Ahrefs API clients with rate limiting and pagination        |
| [`@power-seo/tracking`](https://www.npmjs.com/package/@power-seo/tracking)                 | `npm i @power-seo/tracking`         | GA4, Clarity, PostHog, Plausible, Fathom — scripts + consent management |

### Ecosystem vs alternatives

| Need                 | Common approach        | @power-seo approach                                 |
| -------------------- | ---------------------- | --------------------------------------------------- |
| GSC search analytics | `googleapis` (verbose) | `@power-seo/search-console` — typed, auto-paginated |
| Analytics dashboards | Google Looker Studio   | `@power-seo/analytics` — merge GSC + audit data     |
| Sitemap submission   | Manual GSC UI          | `@power-seo/search-console` — `submitSitemap()`     |
| SEO auditing         | Third-party tools      | `@power-seo/audit` — in-code, CI-friendly           |

---

## Enterprise Integration

**Multi-tenant SaaS**

- **Per-client GSC properties**: Instantiate one `GSCClient` per client site; use service accounts for automation
- **Aggregated dashboards**: Loop over multiple `siteUrl` values and merge analytics into a multi-site report
- **Scheduled data sync**: Run `querySearchAnalyticsAll` on a daily cron for all client properties

**ERP / internal portals**

- Use URL inspection to verify that portal public pages are correctly indexed
- Track keyword positions for internal knowledge base articles
- Automate sitemap submission after content management system publishes

**Recommended integration pattern**

- Use **service accounts** in CI/CD — no user interaction, no token expiry
- Run `querySearchAnalyticsAll` in **weekly scheduled jobs**
- Feed data into `@power-seo/analytics` for **trend analysis** and **ranking insights**
- Export results as **JSON** to Jira/Notion/Slack for content team review

---

## Scope and Limitations

**This package does**

- ✅ Authenticate with GSC API via OAuth2 and service account
- ✅ Fetch search analytics data with auto-pagination
- ✅ Inspect URL indexing status, mobile usability, and rich result status
- ✅ Submit, list, and delete sitemaps from verified GSC properties

**This package does not**

- ❌ Verify properties in GSC — property must already be verified
- ❌ Provide reporting UI — use `@power-seo/analytics` for dashboards
- ❌ Access Google Analytics data — use `@power-seo/tracking` for GA4 API access

---

## API Reference

### `createTokenManager(config)`

| Parameter             | Type                           | Description                                            |
| --------------------- | ------------------------------ | ------------------------------------------------------ |
| `config.type`         | `'oauth' \| 'service-account'` | Authentication method                                  |
| `config.clientId`     | `string`                       | Google OAuth2 client ID (OAuth2 only)                  |
| `config.clientSecret` | `string`                       | Google OAuth2 client secret (OAuth2 only)              |
| `config.refreshToken` | `string`                       | OAuth2 refresh token (OAuth2 only)                     |
| `config.clientEmail`  | `string`                       | Service account email (service account only)           |
| `config.privateKey`   | `string`                       | Service account private key PEM (service account only) |
| `config.scopes`       | `string[]`                     | OAuth2 scopes to request (service account only)        |

Returns `TokenManager`: `{ getAccessToken(): Promise<TokenResult> }`.

### `createGSCClient(config)`

| Parameter             | Type           | Description                                                           |
| --------------------- | -------------- | --------------------------------------------------------------------- |
| `config.siteUrl`      | `string`       | Verified GSC property URL (`sc-domain:` prefix for domain properties) |
| `config.tokenManager` | `TokenManager` | Token manager from `createTokenManager`                               |

Returns `GSCClient`.

### `querySearchAnalytics(client, request)`

| Parameter                       | Type          | Default  | Description                                                                  |
| ------------------------------- | ------------- | -------- | ---------------------------------------------------------------------------- |
| `request.startDate`             | `string`      | required | `YYYY-MM-DD`                                                                 |
| `request.endDate`               | `string`      | required | `YYYY-MM-DD`                                                                 |
| `request.dimensions`            | `Dimension[]` | `[]`     | `'query'`, `'page'`, `'country'`, `'device'`, `'date'`, `'searchAppearance'` |
| `request.searchType`            | `SearchType`  | `'web'`  | `'web'`, `'image'`, `'video'`, `'news'`                                      |
| `request.rowLimit`              | `number`      | `1000`   | Rows per request (max 25,000)                                                |
| `request.dimensionFilterGroups` | `object[]`    | `[]`     | Filter groups to narrow results                                              |

### `querySearchAnalyticsAll(client, request)`

Same as `querySearchAnalytics` but `rowLimit` and `startRow` are managed automatically. Returns `Promise<SearchAnalyticsRow[]>`.

### `inspectUrl(client, url)` / `inspectUrlDirect(client, url)`

Returns `Promise<InspectionResult>`: `{ verdict, indexingState, lastCrawlTime, mobileUsabilityResult, richResultsResult, ... }`.

### `listSitemaps(client)` / `submitSitemap(client, url)` / `deleteSitemap(client, url)`

`listSitemaps` returns `Promise<SitemapListResponse>`. `submitSitemap` and `deleteSitemap` return `Promise<void>`.

### Types

```ts
import type {
  OAuthCredentials,
  ServiceAccountCredentials,
  TokenResult,
  TokenManager,
  GSCClientConfig,
  GSCClient,
  SearchType,
  Dimension,
  SearchAnalyticsRequest,
  SearchAnalyticsRow,
  SearchAnalyticsResponse,
  InspectionResult,
  SitemapEntry,
  SitemapListResponse,
} from '@power-seo/search-console';
```

---

## Contributing

- Issues: [github.com/cybercraftbd/power-seo/issues](https://github.com/cybercraftbd/power-seo/issues)
- PRs: [github.com/cybercraftbd/power-seo/pulls](https://github.com/cybercraftbd/power-seo/pulls)
- Development setup:
  1. `pnpm i`
  2. `pnpm build`
  3. `pnpm test`

**Release workflow**

- `npm version patch|minor|major`
- `npm publish --access public`

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software engineering company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

|                      |                                                                |
| -------------------- | -------------------------------------------------------------- |
| **Website**          | [ccbd.dev](https://ccbd.dev)                                   |
| **GitHub**           | [github.com/cybercraftbd](https://github.com/cybercraftbd)     |
| **npm Organization** | [npmjs.com/org/power-seo](https://www.npmjs.com/org/power-seo) |
| **Email**            | [info@ccbd.dev](mailto:info@ccbd.dev)                          |

---

## License

**MIT**

---

## Keywords

```text
seo, google-search-console, gsc, search-analytics, url-inspection, sitemap, oauth2, service-account, typescript, nextjs, analytics, keyword-tracking, click-through-rate, impressions
```
