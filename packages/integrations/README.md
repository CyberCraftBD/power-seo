# @power-seo/integrations

![Semrush and Ahrefs API integration banner for the @power-seo/integrations TypeScript package](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/integrations/banner.svg)

Typed Semrush and Ahrefs API clients for keyword research, domain overviews, backlinks, and keyword difficulty — built on a shared rate-limited HTTP client with automatic retry.

[![npm version](https://img.shields.io/npm/v/@power-seo/integrations)](https://www.npmjs.com/package/@power-seo/integrations)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/integrations)](https://www.npmjs.com/package/@power-seo/integrations)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/integrations)](https://socket.dev/npm/package/@power-seo/integrations)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/integrations)

`@power-seo/integrations` is a TypeScript client library for the Semrush and Ahrefs SEO data APIs, aimed at developers building keyword research pipelines, backlink monitors, and SEO reporting tools in Node.js. Both clients share one HTTP layer — `createHttpClient()` — that enforces a token-bucket rate limit, retries retryable failures with exponential backoff, and normalizes every non-2xx response into a single `IntegrationApiError` with `status`, `provider`, and `retryable` fields. Every request parameter and response field is fully typed, so keyword volume, CPC, Domain Rating, and backlink data arrive as structured objects instead of hand-parsed payloads.

![Unified TypeScript interface over Semrush and Ahrefs SEO data APIs](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/integrations/header.svg)

> **Network access note** — this package's documented purpose is calling external APIs. HTTPS requests go exclusively to the endpoints you configure (`api.semrush.com`, `api.ahrefs.com`, or your own `baseUrl`), authenticated with your credentials. Nothing else is contacted.

---

## Why @power-seo/integrations?

|                  | Without                                       | With                                                          |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------- |
| Semrush API      | ❌ Hand-write requests, parse column codes    | ✅ Typed client — `Or`/`Nq`/`Kd` mapped to named fields       |
| Ahrefs API       | ❌ Manual bearer auth and query building      | ✅ Typed client with token auth handled for you               |
| Rate limiting    | ❌ Manual throttle or 429 storms              | ✅ Built-in token bucket (default 600 requests/minute)        |
| Retry logic      | ❌ Ad-hoc try/catch loops                     | ✅ Exponential backoff on 429/5xx, up to 3 retries by default |
| Pagination       | ❌ Untyped offset bookkeeping                 | ✅ `PaginatedResponse<T>` with `offset`, `limit`, `hasMore`   |
| Error handling   | ❌ Raw HTTP errors, secrets leaking into logs | ✅ `IntegrationApiError` with sanitized, token-redacted body  |
| TypeScript types | ❌ `any` everywhere                           | ✅ Full type coverage for every endpoint and response         |
| Bundle size      | ❌ Full vendor SDK in your bundle             | ✅ Tree-shakeable — import only the client you use            |

![Workflow comparison showing manual Semrush and Ahrefs API integration steps versus the automated workflow with @power-seo/integrations](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/integrations/roi.svg)

---

## Features

- **Semrush API client** — domain overview (organic/paid traffic, keywords, backlinks, Authority Score), organic keywords with positions, backlink profile, keyword difficulty, and related keyword suggestions
- **Ahrefs API client** — site overview (Domain Rating, URL Rating, traffic value), organic keywords, backlinks with anchor text, keyword difficulty, and referring domains
- **Shared HTTP client** — `createHttpClient()` works against any JSON REST API with query-param or bearer auth, a configurable per-minute rate limit, request timeout, and retry
- **Token-bucket rate limiting** — requests wait for a token instead of failing; the limit is configurable per client via `rateLimitPerMinute`
- **Retry with exponential backoff** — 429 and 5xx responses are retried up to `maxRetries` times with delays of 1s, 2s, 4s… capped at 30s
- **Typed pagination** — list endpoints return `PaginatedResponse<T>` with `data`, `total`, `offset`, `limit`, and `hasMore` for clean cursor loops
- **Sanitized errors** — response bodies embedded in error messages are truncated and have bearer tokens and API keys redacted before they can reach your logs
- **Tree-shakeable, dual ESM + CJS** — `createSemrushClient`, `createAhrefsClient`, and `createHttpClient` are independent named exports

![SEO research dashboard powered by typed Semrush and Ahrefs keyword and backlink data](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/integrations/seo-research-ui.svg)

---

## Comparison

| Feature                          | @power-seo/integrations  | Hand-rolled `fetch` wrapper | Calling vendor endpoints directly |
| -------------------------------- | :----------------------: | :-------------------------: | :-------------------------------: |
| Typed Semrush responses          |            ✅            |           Manual            |         ❌ (column codes)         |
| Typed Ahrefs responses           |            ✅            |           Manual            |           ❌ (raw JSON)           |
| Rate limiting                    |     ✅ token bucket      |           Manual            |                ❌                 |
| Retry with backoff               |     ✅ 429/5xx aware     |           Manual            |                ❌                 |
| Consistent errors across vendors | ✅ `IntegrationApiError` |           Manual            |                ❌                 |
| Secret redaction in errors       |            ✅            |           Rarely            |                ❌                 |
| One HTTP layer for both APIs     |            ✅            |             ❌              |                ❌                 |
| Tree-shakeable TypeScript        |            ✅            |              —              |                 —                 |

![Feature comparison matrix of @power-seo/integrations against semrush-sdk, ahrefs-client, and a custom fetch implementation](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/integrations/comparison.svg)

![Token-bucket rate limiter keeping request throughput under the configured per-minute API limit](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/integrations/rate-limit-accuracy.svg)

---

## Installation

```bash
npm install @power-seo/integrations
```

```bash
yarn add @power-seo/integrations
```

```bash
pnpm add @power-seo/integrations
```

Requires Node.js 18+ (native `fetch`). Also runs in Deno, Bun, and edge runtimes that provide `fetch`, `URL`, and `AbortController`.

---

## Usage

### How do I query Semrush domain and keyword data in TypeScript?

Create a client with `createSemrushClient(apiKey, config?)` — the first argument is your Semrush API key as a plain string (sent as the `key` query parameter), and the optional second argument tunes `rateLimitPerMinute`, `maxRetries`, and `timeoutMs`. The client exposes five typed methods covering domain overview, organic keywords, backlinks, keyword difficulty, and related keywords. Regional database defaults to `'us'` and list endpoints default to 100 rows per page.

```ts
import { createSemrushClient } from '@power-seo/integrations';
import type { SemrushDomainOverview } from '@power-seo/integrations';

const semrush = createSemrushClient(process.env.SEMRUSH_API_KEY!, {
  rateLimitPerMinute: 60, // optional — default 600
});

// Domain overview — traffic, keywords, backlinks, Authority Score
const overview: SemrushDomainOverview = await semrush.getDomainOverview('example.com', 'us');
// { domain, organicKeywords, organicTraffic, organicCost, paidKeywords,
//   paidTraffic, paidCost, backlinks, authorityScore }

// Organic keywords (paginated)
const keywords = await semrush.getOrganicKeywords('example.com', { limit: 100, offset: 0 });
// { data: SemrushKeywordData[], total, offset, limit, hasMore }

// Backlinks (paginated)
const backlinks = await semrush.getBacklinks('example.com', { limit: 100, offset: 0 });

// Keyword difficulty for a batch of keywords
const difficulty = await semrush.getKeywordDifficulty(['react seo', 'next.js seo'], 'us');
// [{ keyword, difficulty, searchVolume, cpc, competition, results }]

// Related keyword suggestions
const related = await semrush.getRelatedKeywords('react seo', 'us');
// [{ keyword, searchVolume, cpc, competition, results, relatedTo }]
```

### How do I pull Ahrefs backlinks and Domain Rating?

Create a client with `createAhrefsClient(apiToken, config?)` — the first argument is your Ahrefs API token as a plain string, sent as an `Authorization: Bearer` header to `api.ahrefs.com/v3`. The client covers site overview, organic keywords, backlinks, keyword difficulty, and referring domains. List endpoints accept `{ limit, offset }` and default to 100 rows per page.

```ts
import { createAhrefsClient } from '@power-seo/integrations';
import type { AhrefsSiteOverview } from '@power-seo/integrations';

const ahrefs = createAhrefsClient(process.env.AHREFS_API_TOKEN!);

// Site overview — DR, UR, traffic, traffic value
const site: AhrefsSiteOverview = await ahrefs.getSiteOverview('example.com');
// { domain, domainRating, urlRating, backlinks, referringDomains,
//   organicKeywords, organicTraffic, trafficValue }

// Organic keywords with positions (paginated)
const keywords = await ahrefs.getOrganicKeywords('example.com', { limit: 200, offset: 0 });

// Backlinks with anchor text and dofollow status (paginated)
const backlinks = await ahrefs.getBacklinks('example.com', { limit: 100 });
// data[i]: { sourceUrl, targetUrl, anchorText, domainRating, urlRating,
//            isDoFollow, firstSeen, lastSeen }

// Keyword difficulty for a batch of keywords
const kd = await ahrefs.getKeywordDifficulty(['react seo']);
// [{ keyword, difficulty, searchVolume, cpc, clicks, globalVolume }]

// Referring domains (paginated)
const domains = await ahrefs.getReferringDomains('example.com', { limit: 50 });
```

### How do I paginate through all results?

Every list endpoint returns a `PaginatedResponse<T>` carrying the page you asked for plus the cursor state: `data` (the rows), `total` (as reported by the API), and `offset`, `limit`, `hasMore`. `hasMore` is `true` while a page comes back full, so a simple loop that advances `offset` by `limit` walks the entire result set.

```ts
import type { SemrushKeywordData } from '@power-seo/integrations';

const all: SemrushKeywordData[] = [];
let offset = 0;
let hasMore = true;

while (hasMore) {
  const page = await semrush.getOrganicKeywords('example.com', { limit: 100, offset });
  all.push(...page.data);
  offset += page.limit;
  hasMore = page.hasMore;
}
```

### How do I call another REST API with the shared rate-limited client?

`createHttpClient(config)` is exported directly, so the same rate limiting, timeout, retry, and error normalization work against any JSON REST API. Pass a `baseUrl`, an `auth` strategy (`bearer` header or `query` parameter), and optional limits. `get()` appends query params; `post()` JSON-encodes the body. Both return the parsed JSON typed as your generic parameter.

```ts
import { createHttpClient } from '@power-seo/integrations';

const http = createHttpClient({
  baseUrl: 'https://api.example.com',
  auth: { type: 'bearer', token: process.env.API_TOKEN! },
  rateLimitPerMinute: 60, // default 600
  maxRetries: 3, // default 3
  timeoutMs: 30_000, // default 30_000
});

const result = await http.get<{ items: string[] }>('/endpoint', { q: 'seo' });
const created = await http.post<{ id: string }>('/endpoint', { name: 'report' });
```

### How do I handle API errors and retries?

Every non-2xx response becomes an `IntegrationApiError` with `status` (HTTP status code), `provider` (`'semrush'`, `'ahrefs'`, or `'unknown'`), and `retryable` (`true` for 429 and 5xx). Retryable errors are retried automatically with exponential backoff (1s, 2s, 4s… capped at 30s) up to `maxRetries` times before being thrown; non-retryable errors (4xx other than 429) throw immediately. Error messages embed a sanitized response snippet — bearer tokens and API keys are redacted and the snippet is truncated to 200 characters.

```ts
import { createSemrushClient, IntegrationApiError } from '@power-seo/integrations';

const semrush = createSemrushClient(process.env.SEMRUSH_API_KEY!);

try {
  const data = await semrush.getDomainOverview('example.com');
} catch (err) {
  if (err instanceof IntegrationApiError) {
    console.error(`${err.provider} API error ${err.status}: ${err.message}`);
    console.error('Retryable:', err.retryable); // true for 429 / 5xx
  } else {
    throw err; // network failure or abort — propagated without retry
  }
}
```

![One shared HTTP client unifying auth, rate limiting, retry, and errors for both SEO API vendors](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/integrations/unification-benefit.svg)

---

## API Reference

### `createSemrushClient(apiKey, config?)`

```ts
function createSemrushClient(
  apiKey: string,
  config?: Partial<Omit<HttpClientConfig, 'baseUrl' | 'auth'>>,
): SemrushClient;
```

Targets `https://api.semrush.com` with query-parameter auth (`key`).

| Method                 | Parameters                | Returns                                           | Notes                             |
| ---------------------- | ------------------------- | ------------------------------------------------- | --------------------------------- |
| `getDomainOverview`    | `(domain, database?)`     | `Promise<SemrushDomainOverview>`                  | `database` defaults to `'us'`     |
| `getOrganicKeywords`   | `(domain, options?)`      | `Promise<PaginatedResponse<SemrushKeywordData>>`  | `limit` defaults to 100           |
| `getBacklinks`         | `(domain, options?)`      | `Promise<PaginatedResponse<SemrushBacklinkData>>` | Root-domain backlink profile      |
| `getKeywordDifficulty` | `(keywords[], database?)` | `Promise<SemrushKeywordDifficulty[]>`             | Batch lookup, one row per keyword |
| `getRelatedKeywords`   | `(keyword, database?)`    | `Promise<SemrushRelatedKeyword[]>`                | Related keyword suggestions       |

### `createAhrefsClient(apiToken, config?)`

```ts
function createAhrefsClient(
  apiToken: string,
  config?: Partial<Omit<HttpClientConfig, 'baseUrl' | 'auth'>>,
): AhrefsClient;
```

Targets `https://api.ahrefs.com/v3` with `Authorization: Bearer` auth.

| Method                 | Parameters           | Returns                                             | Notes                          |
| ---------------------- | -------------------- | --------------------------------------------------- | ------------------------------ |
| `getSiteOverview`      | `(domain)`           | `Promise<AhrefsSiteOverview>`                       | DR, UR, traffic, traffic value |
| `getOrganicKeywords`   | `(domain, options?)` | `Promise<PaginatedResponse<AhrefsOrganicKeyword>>`  | `limit` defaults to 100        |
| `getBacklinks`         | `(domain, options?)` | `Promise<PaginatedResponse<AhrefsBacklink>>`        | Anchor text + dofollow status  |
| `getKeywordDifficulty` | `(keywords[])`       | `Promise<AhrefsKeywordDifficulty[]>`                | Batch lookup                   |
| `getReferringDomains`  | `(domain, options?)` | `Promise<PaginatedResponse<AhrefsReferringDomain>>` | Referring domains with DR      |

### `createHttpClient(config)`

```ts
function createHttpClient(config: HttpClientConfig): HttpClient;
```

`HttpClient` has two methods: `get<T>(path, params?)` and `post<T>(path, body?)`.

#### `HttpClientConfig`

| Prop                 | Type           | Default  | Description                                        |
| -------------------- | -------------- | -------- | -------------------------------------------------- |
| `baseUrl`            | `string`       | required | Base URL prepended to every request path           |
| `auth`               | `AuthStrategy` | required | `bearer` header or `query` parameter credential    |
| `rateLimitPerMinute` | `number`       | `600`    | Token-bucket capacity; requests wait for a token   |
| `maxRetries`         | `number`       | `3`      | Retries after the first attempt (429/5xx only)     |
| `timeoutMs`          | `number`       | `30000`  | Per-request timeout enforced via `AbortController` |

`AuthStrategy` is one of:

- `{ type: 'bearer', token: string }` — sent as an `Authorization: Bearer` header
- `{ type: 'query', paramName: string, value: string }` — appended as a query parameter

### `IntegrationApiError`

| Property    | Type      | Description                                        |
| ----------- | --------- | -------------------------------------------------- |
| `message`   | `string`  | Provider, status, and a sanitized response snippet |
| `status`    | `number`  | HTTP status code of the failed response            |
| `provider`  | `string`  | `'semrush'`, `'ahrefs'`, or `'unknown'`            |
| `retryable` | `boolean` | `true` when `status === 429` or `status >= 500`    |

---

## Types

All exported types, importable with `import type`:

```ts
import type {
  // HTTP layer
  AuthStrategy,
  HttpClientConfig,
  HttpClient,
  PaginatedResponse,
  // Semrush
  SemrushClient,
  SemrushPaginationOptions, // { limit?, offset?, database? }
  SemrushDomainOverview,
  SemrushKeywordData,
  SemrushBacklinkData,
  SemrushKeywordDifficulty,
  SemrushRelatedKeyword,
  // Ahrefs
  AhrefsClient,
  AhrefsPaginationOptions, // { limit?, offset? }
  AhrefsSiteOverview,
  AhrefsOrganicKeyword,
  AhrefsBacklink,
  AhrefsKeywordDifficulty,
  AhrefsReferringDomain,
} from '@power-seo/integrations';
```

`PaginatedResponse<T>` is `{ data: T[]; total: number; offset: number; limit: number; hasMore: boolean }`. The `IntegrationApiError` class is a value export: `import { IntegrationApiError } from '@power-seo/integrations'`.

---

## Use Cases

- **Keyword research pipelines** — pull volume, CPC, and difficulty from Semrush or Ahrefs to prioritize content topics programmatically
- **Backlink monitoring** — schedule periodic backlink and referring-domain snapshots for link-building tracking
- **Competitor analysis** — compare domain overview metrics (traffic, keywords, Authority Score, Domain Rating) across competitor domains
- **Content brief generation** — feed related-keyword and difficulty data into briefs alongside [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis) scoring
- **SEO reporting dashboards** — combine live vendor data with Search Console trends from [`@power-seo/analytics`](https://www.npmjs.com/package/@power-seo/analytics) and [`@power-seo/search-console`](https://www.npmjs.com/package/@power-seo/search-console)
- **Any rate-limited REST integration** — reuse `createHttpClient()` for internal or third-party JSON APIs that need throttling and retry

---

## Architecture Overview

- **Pure TypeScript** — no native modules, no compiled binaries
- **Runtime dependency: `@power-seo/core` only** — the token bucket (`createTokenBucket`), backoff (`calculateBackoff`), and retry loop (`fetchJsonWithRetry`) come from the core package; nothing third-party
- **Native `fetch` transport** — works in Node.js 18+, Deno, Bun, Cloudflare Workers, and Vercel Edge; timeouts use `AbortController`
- **Thin vendor adapters** — each client maps raw vendor responses (Semrush column codes like `Or`, `Nq`, `Kd`; Ahrefs snake_case fields) to stable camelCase types; the HTTP concerns live in one place
- **Secret-safe errors** — response snippets in error messages pass through redaction that strips bearer tokens and API-key-shaped JSON fields before truncating to 200 characters
- **Tree-shakeable, dual ESM + CJS** — `sideEffects: false`, separate named exports, built with tsup

---

## Supply Chain Security

- Published to npm with **provenance attestation** — every release is built and signed by the verified `github.com/CyberCraftBD/power-seo` GitHub Actions workflow, so you can trace each tarball back to its exact source commit
- **Zero third-party runtime dependencies** — packages depend only on other `@power-seo` packages, nothing else gets pulled in
- **Network access only when you call it** — HTTP requests go exclusively to the APIs you configure (Google Search Console / Semrush / Ahrefs); no telemetry, no phoning home
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

semrush api, ahrefs api, seo api client, keyword research api, backlink api, domain overview, keyword difficulty, keyword volume, rate limiting, token bucket, api pagination, typescript seo, seo data fetching, third-party seo integrations, referring domains, organic keywords, api retry backoff, seo reporting

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
