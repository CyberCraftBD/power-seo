# @power-seo/integrations — Semrush & Ahrefs API Clients for TypeScript — Rate Limiting, Pagination & Full Type Safety

Query keyword data, domain overviews, backlinks, and keyword difficulty from Semrush and Ahrefs APIs with a shared HTTP client that handles rate limiting and pagination automatically.

[![npm version](https://img.shields.io/npm/v/@power-seo/integrations)](https://www.npmjs.com/package/@power-seo/integrations)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/integrations)](https://www.npmjs.com/package/@power-seo/integrations)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/integrations)

`@power-seo/integrations` wraps the Semrush and Ahrefs REST APIs with a consistent TypeScript interface. Both clients are built on a shared `createHttpClient()` base that enforces configurable rate limits (requests per window), handles pagination automatically, and normalizes errors into `IntegrationApiError` with status codes and messages. Import only the client you need — tree-shaking ensures unused API code never ends up in your bundle.

> **Zero runtime dependencies beyond `fetch`** — runs in Node.js 18+, Deno, Bun, and modern edge runtimes.

## Features

- **Semrush API client** — domain overview (traffic, organic/paid keywords, backlinks), keyword data (volume, CPC, competition), backlink profile, keyword difficulty, and related keyword suggestions
- **Ahrefs API client** — site overview (Domain Rating, organic traffic), organic keywords with positions, backlink data with anchor text, keyword difficulty, and referring domain list
- **Shared HTTP client** — `createHttpClient()` provides configurable rate limiting (max requests per time window), automatic retry on 429, and JSON response parsing
- **Auto-pagination** — both clients handle multi-page results automatically; callers receive a flat array without manual offset tracking
- **Full TypeScript types** — every request parameter and response field is typed; no `any` in your code
- **Consistent error handling** — `IntegrationApiError` with `statusCode`, `message`, and raw `response` payload from both APIs
- **Tree-shakeable** — `createSemrushClient` and `createAhrefsClient` are separate exports; import only what you use

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Semrush Client](#semrush-client)
  - [Ahrefs Client](#ahrefs-client)
  - [Shared HTTP Client](#shared-http-client)
  - [Error Handling](#error-handling)
- [API Reference](#api-reference)
  - [Semrush](#semrush)
  - [Ahrefs](#ahrefs)
  - [Shared](#shared)
  - [Types](#types)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

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

## Quick Start

```ts
import { createSemrushClient, createAhrefsClient } from '@power-seo/integrations';

// Semrush
const semrush = createSemrushClient({ apiKey: process.env.SEMRUSH_API_KEY! });
const overview = await semrush.getDomainOverview({ domain: 'example.com' });
console.log(overview.organicTraffic); // 12_400
console.log(overview.organicKeywords); // 834

// Ahrefs
const ahrefs = createAhrefsClient({ apiKey: process.env.AHREFS_API_KEY! });
const site = await ahrefs.getSiteOverview({ target: 'example.com' });
console.log(site.domainRating); // 47
console.log(site.organicTraffic); // 9_800
```

## Usage

### Semrush Client

```ts
import { createSemrushClient } from '@power-seo/integrations';
import type { SemrushDomainOverview, SemrushKeywordData } from '@power-seo/integrations';

const semrush = createSemrushClient({
  apiKey:      process.env.SEMRUSH_API_KEY!,
  database:    'us',   // default: 'us'
  rateLimiting: { maxRequests: 10, windowMs: 60_000 }, // optional
});

// Domain overview — traffic, keywords, backlinks
const overview: SemrushDomainOverview = await semrush.getDomainOverview({
  domain: 'example.com',
});
// { organicTraffic, paidTraffic, organicKeywords, paidKeywords, backlinks, referringDomains }

// Keyword data — volume, CPC, competition, SERP features
const keyword: SemrushKeywordData = await semrush.getKeywordData({
  keyword:  'react seo',
  database: 'us',
});
// { keyword, volume, cpc, competition, results, trend, serpFeatures }

// Backlinks
const backlinks = await semrush.getBacklinks({
  domain:  'example.com',
  limit:   100,
});
// [{ sourcePage, targetPage, type, anchorText, firstSeen, lastSeen }]

// Keyword difficulty
const difficulty = await semrush.getKeywordDifficulty({ keyword: 'react seo' });
// { keyword, difficulty }   // difficulty 0–100

// Related keywords
const related = await semrush.getRelatedKeywords({ keyword: 'react seo', limit: 20 });
// [{ keyword, volume, cpc, competition, relatedRelevance }]
```

### Ahrefs Client

```ts
import { createAhrefsClient } from '@power-seo/integrations';
import type { AhrefsSiteOverview, AhrefsOrganicKeyword } from '@power-seo/integrations';

const ahrefs = createAhrefsClient({
  apiKey:       process.env.AHREFS_API_KEY!,
  rateLimiting: { maxRequests: 5, windowMs: 60_000 }, // optional
});

// Site overview — DR, organic traffic, backlinks
const overview: AhrefsSiteOverview = await ahrefs.getSiteOverview({
  target: 'example.com',
  mode:   'domain', // 'domain' | 'subdomains' | 'exact'
});
// { domainRating, urlRating, organicTraffic, organicKeywords, backlinks, referringDomains }

// Organic keywords with positions
const keywords: AhrefsOrganicKeyword[] = await ahrefs.getOrganicKeywords({
  target:  'example.com',
  limit:   200,
  orderBy: 'traffic:desc',
});
// [{ keyword, position, volume, traffic, url, cpc }]

// Backlinks with anchor text
const backlinks = await ahrefs.getBacklinks({
  target: 'example.com',
  limit:  100,
  mode:   'domain',
});
// [{ anchorText, domainRating, urlFrom, urlTo, firstSeen, linkType }]

// Keyword difficulty
const kd = await ahrefs.getKeywordDifficulty({ keyword: 'react seo' });
// { keyword, difficulty }   // difficulty 0–100

// Referring domains
const domains = await ahrefs.getReferringDomains({
  target:  'example.com',
  limit:   50,
  orderBy: 'domain_rating:desc',
});
// [{ domain, domainRating, backlinks, linkedDomains }]
```

### Shared HTTP Client

Use the underlying HTTP client directly to call any REST API with rate limiting and pagination:

```ts
import { createHttpClient } from '@power-seo/integrations';

const http = createHttpClient({
  baseUrl:     'https://api.example.com',
  headers:     { Authorization: `Bearer ${token}` },
  rateLimiting: {
    maxRequests: 10,   // max requests allowed
    windowMs:    60_000, // per this window in ms
  },
});

const data = await http.get<MyResponseType>('/endpoint', { query: 'param' });
const list = await http.getPaginated<MyItem>('/items', { page: 1, limit: 100 });
```

### Error Handling

Both clients throw `IntegrationApiError` for non-2xx responses:

```ts
import { createSemrushClient, IntegrationApiError } from '@power-seo/integrations';

const semrush = createSemrushClient({ apiKey: 'your-key' });

try {
  const data = await semrush.getDomainOverview({ domain: 'example.com' });
} catch (err) {
  if (err instanceof IntegrationApiError) {
    console.error(`API error ${err.statusCode}: ${err.message}`);
    console.error('Raw response:', err.response);
  } else {
    throw err;
  }
}
```

## API Reference

### Semrush

```ts
function createSemrushClient(config: SemrushConfig): SemrushClient
```

#### `SemrushClient` methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getDomainOverview` | `{ domain }` | `SemrushDomainOverview` | Traffic, keywords, backlinks summary |
| `getKeywordData` | `{ keyword, database? }` | `SemrushKeywordData` | Volume, CPC, competition, trend |
| `getBacklinks` | `{ domain, limit? }` | `SemrushBacklinkData[]` | Backlink list with follow/nofollow |
| `getKeywordDifficulty` | `{ keyword }` | `{ keyword, difficulty }` | KD score 0–100 |
| `getRelatedKeywords` | `{ keyword, limit? }` | `SemrushRelatedKeyword[]` | Related keyword suggestions |

### Ahrefs

```ts
function createAhrefsClient(config: AhrefsConfig): AhrefsClient
```

#### `AhrefsClient` methods

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getSiteOverview` | `{ target, mode? }` | `AhrefsSiteOverview` | DR, organic traffic, backlinks |
| `getOrganicKeywords` | `{ target, limit?, orderBy? }` | `AhrefsOrganicKeyword[]` | Ranking keywords with positions |
| `getBacklinks` | `{ target, limit?, mode? }` | `AhrefsBacklink[]` | Backlinks with anchor text |
| `getKeywordDifficulty` | `{ keyword }` | `{ keyword, difficulty }` | KD score 0–100 |
| `getReferringDomains` | `{ target, limit?, orderBy? }` | `AhrefsReferringDomain[]` | Referring domains by DR |

### Shared

```ts
function createHttpClient(config: HttpClientConfig): HttpClient
```

#### `HttpClientConfig`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `baseUrl` | `string` | — | Base URL for all requests |
| `headers` | `Record<string, string>` | `{}` | Default request headers |
| `rateLimiting` | `{ maxRequests, windowMs }` | — | Optional rate limiting config |

### Types

```ts
import type {
  HttpClientConfig,
  HttpClient,
  PaginatedResponse,
  SemrushConfig,
  SemrushDomainOverview,
  SemrushKeywordData,
  SemrushBacklinkData,
  SemrushRelatedKeyword,
  SemrushClient,
  AhrefsConfig,
  AhrefsSiteOverview,
  AhrefsOrganicKeyword,
  AhrefsBacklink,
  AhrefsReferringDomain,
  AhrefsClient,
} from '@power-seo/integrations';
```

## The @power-seo Ecosystem

All 17 packages are independently installable — use only what you need.

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
