# @power-seo/search-console

![Google Search Console API client for TypeScript — OAuth2 auth, search analytics, and URL inspection](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/search-console/banner.svg)

Typed Google Search Console API client — OAuth2 and service account auth, auto-paginated search analytics, URL inspection, and sitemap management with zero third-party runtime dependencies.

[![npm version](https://img.shields.io/npm/v/@power-seo/search-console)](https://www.npmjs.com/package/@power-seo/search-console)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/search-console)](https://www.npmjs.com/package/@power-seo/search-console)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/search-console)](https://socket.dev/npm/package/@power-seo/search-console)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/search-console)

`@power-seo/search-console` is a production-ready Google Search Console (GSC) API client for TypeScript. You give it OAuth2 credentials or a service account signer; it returns fully typed search analytics rows, URL inspection verdicts, and sitemap operations. A built-in token manager caches and refreshes access tokens, a token-bucket rate limiter throttles requests, and failed calls retry automatically. It runs server-side in Next.js API routes, Remix loaders, Node.js scripts, and CI/CD pipelines.

![Search analytics, URL inspection, and sitemap operations flowing from the Google Search Console API into typed TypeScript results](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/search-console/header.svg)

---

## Why @power-seo/search-console?

Talking to the GSC REST API by hand means writing OAuth2 refresh loops, JWT signing for service accounts, `rowOffset` pagination, rate-limit handling, and retry logic — then hand-typing every response. This package does all of that behind small, tree-shakeable functions with real TypeScript types, and pulls in no third-party HTTP or auth SDK (`googleapis` not required).

|                      | Without                                   | With                                                            |
| -------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| OAuth2 token refresh | Hand-rolled refresh loop per project      | `createTokenManager()` caches and refreshes automatically       |
| Service account auth | Manual JWT assembly and signing wiring    | `getServiceAccountToken()` builds the claim set for your signer |
| GSC data pagination  | Manual `startRow` loops and array merging | `querySearchAnalyticsAll()` — one call, all rows                |
| Rate limiting        | You track request budgets yourself        | Token-bucket limiter, default 1200 req/min                      |
| Retries              | Custom backoff on 429/5xx                 | Built in via `@power-seo/core`, default 3 retries               |
| URL inspection       | GSC UI checks only                        | Programmatic `inspectUrl()` in CI pipelines                     |
| Type safety          | Raw responses typed as `any`              | Fully typed request and response shapes                         |

![Workflow comparison showing a manual Google Search Console reporting process versus an automated pipeline built with @power-seo/search-console](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/search-console/roi.svg)

---

## Features

- **OAuth2 authentication** — `exchangeRefreshToken()` swaps a refresh token for an access token
- **Service account authentication** — `getServiceAccountToken()` builds the JWT claim set and delegates signing to your `signJwt` function
- **Automatic token manager** — `createTokenManager()` caches tokens and refreshes 60 seconds before expiry, deduplicating concurrent refreshes
- **Typed GSC client** — `createGSCClient(config)` returns a `GSCClient` scoped to one verified site, with rate limiting and retries built in
- **Search analytics** — `querySearchAnalytics()` supports all six dimensions and dimension filter groups
- **Auto-paginated full fetch** — `querySearchAnalyticsAll()` walks the 25,000-row page limit and merges every page into one `SearchAnalyticsRow[]`
- **URL inspection** — `inspectUrl()` returns index status, mobile usability, and rich results verdicts
- **Sitemap management** — `listSitemaps()`, `submitSitemap()`, and `deleteSitemap()`
- **Typed errors** — `GSCApiError` carries `status`, `code`, and a `retryable` flag
- **Zero third-party runtime dependencies** — native `fetch`; depends only on `@power-seo/core`

![Search Console client feature overview — auth, analytics, inspection, and sitemap modules](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/search-console/dashboard-ui.svg)

---

## Comparison

![Feature comparison matrix of @power-seo/search-console versus google-auth-library, googleapis, and custom fetch code for Google Search Console access](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/search-console/comparison.svg)

| Feature                            | google-auth-library | googleapis | custom fetch | @power-seo/search-console |
| ---------------------------------- | :-----------------: | :--------: | :----------: | :-----------------------: |
| OAuth2 token refresh helper        |         ✅          |     ✅     |      ❌      |            ✅             |
| Service account JWT claim builder  |         ✅          |     ✅     |      ❌      |            ✅             |
| Auto-paginated analytics fetch     |         ❌          |     ❌     |      ❌      |            ✅             |
| Typed GSC-specific response shapes |         ❌          |     ⚠️     |      ❌      |            ✅             |
| URL inspection helper              |         ❌          |     ⚠️     |      ❌      |            ✅             |
| Sitemap management helpers         |         ❌          |     ⚠️     |      ❌      |            ✅             |
| Zero third-party runtime deps      |         ❌          |     ❌     |      ✅      |            ✅             |
| TypeScript-first                   |         ❌          |     ⚠️     |      ❌      |            ✅             |

![Auto-pagination accuracy — querySearchAnalyticsAll merging every 25000-row page into one complete result set](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/search-console/pagination-accuracy.svg)

---

## Installation

```bash
npm install @power-seo/search-console
```

```bash
yarn add @power-seo/search-console
```

```bash
pnpm add @power-seo/search-console
```

Requires Node.js 18 or newer (uses the built-in `fetch`).

---

## Usage

### How do I connect to Google Search Console with OAuth2?

Wrap `exchangeRefreshToken()` in `createTokenManager()`. The manager calls your fetch function on first use, caches the access token, and refreshes it 60 seconds before expiry — concurrent calls share one in-flight refresh. Pass the manager as `auth` to `createGSCClient()`, then run queries against the scoped client.

```ts
import {
  createTokenManager,
  createGSCClient,
  exchangeRefreshToken,
  querySearchAnalyticsAll,
} from '@power-seo/search-console';

const auth = createTokenManager(() =>
  exchangeRefreshToken({
    clientId: process.env.GSC_CLIENT_ID!,
    clientSecret: process.env.GSC_CLIENT_SECRET!,
    refreshToken: process.env.GSC_REFRESH_TOKEN!,
  }),
);

const client = createGSCClient({ siteUrl: 'https://example.com', auth });

const rows = await querySearchAnalyticsAll(client, {
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  dimensions: ['query', 'page'],
});

for (const { keys, clicks, impressions, ctr, position } of rows) {
  console.log(`"${keys[0]}" → ${keys[1]}`);
  console.log(`  ${clicks} clicks · ${impressions} impressions · pos ${position.toFixed(1)}`);
}
```

![OAuth2 and service account authentication flow feeding cached access tokens into the Search Console client](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/search-console/auth-benefit.svg)

### How do I authenticate with a service account?

`getServiceAccountToken()` builds the signed JWT claim set (`iss`, `scope`, `aud`, `exp`, `iat`) and hands the payload to a `signJwt` function you provide, so you control the crypto. Supply `clientEmail`, `privateKeyId`, and the signer — no user consent flow is needed for server-to-server access.

```ts
import { createTokenManager, getServiceAccountToken } from '@power-seo/search-console';
import type { JwtPayload } from '@power-seo/search-console';

const serviceAccount = JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON!);

// Sign the RS256 JWT with your preferred library, e.g. jose or node:crypto.
async function signJwt(payload: JwtPayload): Promise<string> {
  // return signed assertion string
}

const auth = createTokenManager(() =>
  getServiceAccountToken({
    clientEmail: serviceAccount.client_email,
    privateKeyId: serviceAccount.private_key_id,
    signJwt,
  }),
);
```

### How do I query Search Console analytics?

Call `querySearchAnalytics(client, request)` with a date range and dimensions. It returns a `SearchAnalyticsResponse` whose `rows` are `SearchAnalyticsRow` objects (`keys`, `clicks`, `impressions`, `ctr`, `position`). `rowLimit` defaults to `1000` and is capped at `25000`; use `startRow` to page manually, or `querySearchAnalyticsAll()` to fetch everything at once.

```ts
import { querySearchAnalytics } from '@power-seo/search-console';

const response = await querySearchAnalytics(client, {
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  dimensions: ['query', 'country'],
  searchType: 'web',
  rowLimit: 5000,
  dimensionFilterGroups: [
    { filters: [{ dimension: 'country', operator: 'equals', expression: 'usa' }] },
  ],
});

console.log(response.rows.length, 'rows');
```

### How do I fetch all rows past the 25,000-row limit?

`querySearchAnalyticsAll(client, request)` loops internally, requesting the maximum 25,000 rows per page and advancing `startRow` until a short page signals the end, then merges everything into one `SearchAnalyticsRow[]`. Omit `rowLimit` and `startRow` — they are managed for you.

```ts
import { querySearchAnalyticsAll } from '@power-seo/search-console';

const allRows = await querySearchAnalyticsAll(client, {
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  dimensions: ['query'],
});

console.log(`Total rows: ${allRows.length}`);
```

### How do I inspect a URL's index status?

Call `inspectUrl(client, request)` with an `InspectionRequest` (`inspectionUrl`, optional `languageCode`). It returns an `InspectionResult` containing `indexStatusResult`, optional `mobileUsabilityResult` and `richResultsResult`, and an `inspectionResultLink` back to the GSC report.

```ts
import { inspectUrl } from '@power-seo/search-console';

const result = await inspectUrl(client, {
  inspectionUrl: 'https://example.com/blog/my-post',
});

console.log(result.indexStatusResult.verdict); // 'PASS' | 'PARTIAL' | 'FAIL' | ...
console.log(result.indexStatusResult.coverageState); // 'INDEXED' | 'CRAWLED_NOT_INDEXED' | ...
console.log(result.indexStatusResult.lastCrawlTime); // ISO timestamp (optional)
console.log(result.mobileUsabilityResult?.verdict); // 'PASS' | 'FAIL' | ...
```

### How do I manage sitemaps programmatically?

`listSitemaps(client)` returns a `SitemapEntry[]` with per-sitemap status, warnings, and error counts. `submitSitemap(client, feedpath)` and `deleteSitemap(client, feedpath)` add or remove a sitemap by its full URL and resolve to `void`.

```ts
import { listSitemaps, submitSitemap, deleteSitemap } from '@power-seo/search-console';

const sitemaps = await listSitemaps(client);
sitemaps.forEach((s) => console.log(s.path, s.errors, 'errors'));

await submitSitemap(client, 'https://example.com/sitemap.xml');
await deleteSitemap(client, 'https://example.com/old-sitemap.xml');
```

### How do I fail a CI pipeline when rankings drop?

Fetch every query/page pair for a recent window and assert against a position threshold. Because `querySearchAnalyticsAll()` returns typed rows, you can filter, log, and `process.exit(1)` to break the build when important pages slip.

```ts
import { querySearchAnalyticsAll } from '@power-seo/search-console';

const rows = await querySearchAnalyticsAll(client, {
  startDate: '2026-01-24',
  endDate: '2026-01-31',
  dimensions: ['query', 'page'],
});

const dropped = rows.filter((r) => r.position > 20 && r.impressions > 100);
if (dropped.length > 0) {
  for (const r of dropped) {
    console.error(' -', r.keys[1], `pos ${r.position.toFixed(1)}`);
  }
  process.exit(1);
}
```

---

## API Reference

### `exchangeRefreshToken(credentials)`

| Parameter      | Type     | Description              |
| -------------- | -------- | ------------------------ |
| `clientId`     | `string` | OAuth2 client ID         |
| `clientSecret` | `string` | OAuth2 client secret     |
| `refreshToken` | `string` | Long-lived refresh token |

Returns `Promise<TokenResult>` (`{ accessToken, expiresAt }`). Requests the `webmasters.readonly` scope.

### `getServiceAccountToken(credentials)`

| Parameter      | Type                                       | Description                         |
| -------------- | ------------------------------------------ | ----------------------------------- |
| `clientEmail`  | `string`                                   | Service account email (`iss` claim) |
| `privateKeyId` | `string`                                   | Key ID of the signing key           |
| `signJwt`      | `(payload: JwtPayload) => Promise<string>` | Your RS256 signer for the assertion |

Returns `Promise<TokenResult>`. The package builds the claim set with a 3600-second expiry; you own the signing.

### `createTokenManager(fetchToken)`

| Parameter    | Type                         | Description                      |
| ------------ | ---------------------------- | -------------------------------- |
| `fetchToken` | `() => Promise<TokenResult>` | Function returning a fresh token |

Returns `TokenManager` (`{ getToken(): Promise<string>; invalidate(): void }`). Caches the token and refreshes it 60 seconds before `expiresAt`; concurrent `getToken()` calls share one refresh.

### `createGSCClient(config)`

| Parameter            | Type           | Default                       | Description                                                   |
| -------------------- | -------------- | ----------------------------- | ------------------------------------------------------------- |
| `siteUrl`            | `string`       | required                      | Verified property (`sc-domain:` prefix for domain properties) |
| `auth`               | `TokenManager` | required                      | Token manager from `createTokenManager()`                     |
| `rateLimitPerMinute` | `number`       | `1200`                        | Token-bucket request budget per minute                        |
| `maxRetries`         | `number`       | `3`                           | Retry attempts on 429 / 5xx responses                         |
| `baseUrl`            | `string`       | Google Webmasters v3 endpoint | Override API base URL                                         |

Returns `GSCClient` (`{ request, siteUrl }`).

### `querySearchAnalytics(client, request)`

| Field                   | Type                     | Default               | Notes                                                                        |
| ----------------------- | ------------------------ | --------------------- | ---------------------------------------------------------------------------- |
| `startDate`             | `string`                 | required              | `YYYY-MM-DD`                                                                 |
| `endDate`               | `string`                 | required              | `YYYY-MM-DD`                                                                 |
| `dimensions`            | `Dimension[]`            | —                     | `'query'`, `'page'`, `'country'`, `'device'`, `'date'`, `'searchAppearance'` |
| `searchType`            | `SearchType`             | `'web'` (API default) | `'web'`, `'image'`, `'video'`, `'news'`, `'discover'`, `'googleNews'`        |
| `rowLimit`              | `number`                 | `1000`                | Capped at `25000`                                                            |
| `startRow`              | `number`                 | `0`                   | Row offset for manual pagination                                             |
| `dimensionFilterGroups` | `DimensionFilterGroup[]` | —                     | Narrow results by dimension filters                                          |
| `aggregationType`       | `AggregationType`        | API default           | `'auto'`, `'byPage'`, `'byProperty'`                                         |
| `dataState`             | `DataState`              | API default           | `'all'`, `'final'`                                                           |

Returns `Promise<SearchAnalyticsResponse>`.

### `querySearchAnalyticsAll(client, request)`

Same request shape as `querySearchAnalytics()` but `rowLimit` and `startRow` are omitted (managed internally). Returns `Promise<SearchAnalyticsRow[]>` with every page merged.

### `inspectUrl(client, request)`

Takes an `InspectionRequest` (`{ inspectionUrl: string; languageCode?: string }`, default language `'en'`). Returns `Promise<InspectionResult>`.

### `inspectUrlDirect(getToken, siteUrl, inspectionUrl, languageCode?)`

Standalone inspection against the URL Inspection API (which uses a different base URL). Takes a token getter, the property `siteUrl`, the URL to inspect, and an optional language code. Returns `Promise<InspectionResult>`.

### `listSitemaps(client)` · `submitSitemap(client, feedpath)` · `deleteSitemap(client, feedpath)`

`listSitemaps()` returns `Promise<SitemapEntry[]>`. `submitSitemap()` and `deleteSitemap()` take the full sitemap URL and return `Promise<void>`.

---

## Types

| Type                        | Description                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `OAuthCredentials`          | `{ clientId, clientSecret, refreshToken }`                                                |
| `ServiceAccountCredentials` | `{ clientEmail, privateKeyId, signJwt }`                                                  |
| `JwtPayload`                | `{ iss, scope, aud, exp, iat }` passed to your signer                                     |
| `TokenResult`               | `{ accessToken: string; expiresAt: number }`                                              |
| `TokenManager`              | `{ getToken(): Promise<string>; invalidate(): void }`                                     |
| `GSCClientConfig`           | `{ auth, siteUrl, rateLimitPerMinute?, maxRetries?, baseUrl? }`                           |
| `GSCClient`                 | `{ request, siteUrl }` — scoped API client                                                |
| `SearchType`                | `'web' \| 'image' \| 'video' \| 'news' \| 'discover' \| 'googleNews'`                     |
| `Dimension`                 | `'query' \| 'page' \| 'country' \| 'device' \| 'date' \| 'searchAppearance'`              |
| `AggregationType`           | `'auto' \| 'byPage' \| 'byProperty'`                                                      |
| `DataState`                 | `'all' \| 'final'`                                                                        |
| `DimensionFilter`           | `{ dimension, operator, expression }`                                                     |
| `DimensionFilterGroup`      | `{ groupType?: 'and'; filters: DimensionFilter[] }`                                       |
| `SearchAnalyticsRequest`    | Request shape for `querySearchAnalytics()`                                                |
| `SearchAnalyticsRow`        | `{ keys: string[]; clicks; impressions; ctr; position }`                                  |
| `SearchAnalyticsResponse`   | `{ rows: SearchAnalyticsRow[]; responseAggregationType }`                                 |
| `InspectionRequest`         | `{ inspectionUrl: string; languageCode? }`                                                |
| `InspectionResult`          | `{ inspectionResultLink; indexStatusResult; mobileUsabilityResult?; richResultsResult? }` |
| `IndexStatusResult`         | `{ verdict; coverageState; robotsTxtState; indexingState; lastCrawlTime?; ... }`          |
| `SitemapEntry`              | `{ path; type; isPending; isSitemapsIndex; warnings; errors; ... }`                       |
| `SitemapListResponse`       | `{ sitemap: SitemapEntry[] }`                                                             |
| `GSCApiError`               | Error with `status`, `code`, and `retryable`                                              |

---

## Use Cases

- **Automated keyword ranking reports** — fetch all queries weekly and diff against the previous window
- **Indexing health monitoring** — run `inspectUrl()` after deployments to confirm new pages are indexed
- **Content gap analysis** — pipe GSC rows into `@power-seo/analytics` to surface high-impression, low-click pages
- **Sitemap automation** — submit fresh sitemaps programmatically after content migrations
- **CI/CD SEO gates** — fail pipelines when key pages drop below a position threshold
- **Multi-site SaaS dashboards** — one `GSCClient` per verified property, aggregated across clients
- **Segment analysis** — break clicks down by `country`, `device`, or `searchType` for regional and vertical insight

---

## Architecture Overview

- **Server-side only** — GSC endpoints require access tokens; never ship service account keys to the browser
- **Native `fetch`** — no `googleapis` SDK, no compiled binary, no native modules
- **Token caching** — access tokens are cached and reused until 60 seconds before `expiresAt`, with concurrent refreshes deduplicated
- **Rate limiting** — a token bucket (default 1200 req/min) paces requests before they leave the process
- **Automatic retries** — 429 and 5xx responses retry up to `maxRetries` (default 3) via `@power-seo/core`
- **Auto-pagination** — `querySearchAnalyticsAll()` walks `startRow` in 25,000-row pages and merges results
- **Typed errors** — `GSCApiError` carries HTTP `status`, a `code`, and a `retryable` flag
- **Dual ESM + CJS** — ships both formats via tsup for any bundler or `require()`

---

## Supply Chain Security

- Published to npm with **provenance attestation** — every release is built and signed by the verified `github.com/CyberCraftBD/power-seo` GitHub Actions workflow, so you can trace each tarball back to its exact source commit
- **Zero third-party runtime dependencies** — packages depend only on other `@power-seo` packages, nothing else gets pulled in
- **Network access only when you call it** — HTTP requests go exclusively to the APIs you configure (Google Search Console); no telemetry, no phoning home
- No install scripts (`postinstall`, `preinstall`)
- No `eval` or dynamic code execution
- Safe for SSR, Edge, and server environments

---

## The [@power-seo](https://www.npmjs.com/org/power-seo) Ecosystem

All 17 packages are independently installable — use only what you need.

| Package                                                                                    | Install                             | Description                                                                        |
| ------------------------------------------------------------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------- |
| [`@power-seo/ai`](https://www.npmjs.com/package/@power-seo/ai)                             | `npm i @power-seo/ai`               | LLM-agnostic prompt templates and response parsers for AI-assisted SEO             |
| [`@power-seo/analytics`](https://www.npmjs.com/package/@power-seo/analytics)               | `npm i @power-seo/analytics`        | Merge Search Console data with audit results — trends and ranking insights         |
| [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit)                       | `npm i @power-seo/audit`            | SEO site health auditing with meta, content, structure, and performance rules      |
| [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis) | `npm i @power-seo/content-analysis` | Yoast-style SEO content analysis engine with scoring, checks, and React components |
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core)                         | `npm i @power-seo/core`             | Framework-agnostic SEO analysis engines, types, validators, and utilities          |
| [`@power-seo/images`](https://www.npmjs.com/package/@power-seo/images)                     | `npm i @power-seo/images`           | Image SEO analysis — alt text quality, lazy loading, formats, image sitemaps       |
| [`@power-seo/integrations`](https://www.npmjs.com/package/@power-seo/integrations)         | `npm i @power-seo/integrations`     | Semrush and Ahrefs API clients with a shared rate-limited HTTP client              |
| [`@power-seo/links`](https://www.npmjs.com/package/@power-seo/links)                       | `npm i @power-seo/links`            | Internal link graph analysis — orphan detection, suggestions, equity scoring       |
| [`@power-seo/meta`](https://www.npmjs.com/package/@power-seo/meta)                         | `npm i @power-seo/meta`             | SSR meta tag helpers for Next.js App Router, Remix v2, and generic SSR             |
| [`@power-seo/preview`](https://www.npmjs.com/package/@power-seo/preview)                   | `npm i @power-seo/preview`          | SERP, Open Graph, and Twitter Card preview generators with React components        |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react)                       | `npm i @power-seo/react`            | React SEO components — meta tags, Open Graph, Twitter Card, breadcrumbs            |
| [`@power-seo/readability`](https://www.npmjs.com/package/@power-seo/readability)           | `npm i @power-seo/readability`      | Readability scoring — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI               |
| [`@power-seo/redirects`](https://www.npmjs.com/package/@power-seo/redirects)               | `npm i @power-seo/redirects`        | Redirect rule engine with Next.js, Remix, and Express adapters                     |
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema)                     | `npm i @power-seo/schema`           | Type-safe JSON-LD structured data — 23 schema.org builders plus React components   |
| [`@power-seo/search-console`](https://www.npmjs.com/package/@power-seo/search-console)     | `npm i @power-seo/search-console`   | Google Search Console API client — OAuth2, service accounts, rate limiting, retry  |
| [`@power-seo/sitemap`](https://www.npmjs.com/package/@power-seo/sitemap)                   | `npm i @power-seo/sitemap`          | XML sitemap generation, streaming, and validation with image, video, news support  |
| [`@power-seo/tracking`](https://www.npmjs.com/package/@power-seo/tracking)                 | `npm i @power-seo/tracking`         | Analytics script builders with consent management and React components             |

---

## Keywords

google search console, gsc api, search analytics, url inspection, sitemap submission, oauth2, service account, keyword tracking, click-through rate, impressions, position tracking, auto-pagination, rate limiting, seo automation, ci-cd, ranking data, search performance, nextjs, typescript, api client

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
