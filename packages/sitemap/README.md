# @power-seo/sitemap — XML Sitemap Generator for TypeScript — Streaming, Index Splitting & Validation

Generate standards-compliant XML sitemaps with image, video, and news extensions — including streaming generation and automatic index splitting for large sites.

[![npm version](https://img.shields.io/npm/v/@power-seo/sitemap)](https://www.npmjs.com/package/@power-seo/sitemap)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/sitemap)](https://www.npmjs.com/package/@power-seo/sitemap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/sitemap)

`@power-seo/sitemap` generates fully spec-compliant XML sitemaps as strings or streams. Support for `<image:image>`, `<video:video>`, and `<news:news>` extensions is built in. For large sites with more than 50,000 URLs, `splitSitemap()` automatically chunks your URL list into separate sitemap files and `generateSitemapIndex()` ties them together with a sitemap index. The streaming API keeps memory usage constant even for million-URL datasets.

> **Zero runtime dependencies** — pure TypeScript, no external XML libraries.

## Features

- **Full sitemap spec support** — `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`, and all optional extensions
- **Image sitemap extension** — `<image:image>` tags with `loc`, `caption`, `title`, `license`
- **Video sitemap extension** — `<video:video>` tags with title, description, thumbnail, duration
- **News sitemap extension** — `<news:news>` tags with publication name, language, date
- **Streaming generation** — `streamSitemap()` yields XML chunks; no memory spike on large lists
- **Automatic index splitting** — `splitSitemap()` chunks at the 50,000-URL limit
- **Sitemap index generation** — `generateSitemapIndex()` creates a `<sitemapindex>` pointing to child sitemaps
- **URL validation** — `validateSitemapUrl()` checks against Google's sitemap spec requirements
- **Constants exported** — `MAX_URLS_PER_SITEMAP` (50,000) and `MAX_SITEMAP_SIZE_BYTES` (50MB)
- **Framework-agnostic** — works in Next.js API routes, Remix loaders, Express, Fastify, and edge runtimes
- **Full TypeScript support** — typed `SitemapURL`, `SitemapImage`, `SitemapVideo`, `SitemapNews`, `SitemapConfig`

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Basic Sitemap](#basic-sitemap)
  - [Sitemap with Images](#sitemap-with-images)
  - [Streaming Large Sitemaps](#streaming-large-sitemaps)
  - [Splitting into Multiple Files](#splitting-into-multiple-files)
  - [Sitemap Index](#sitemap-index)
  - [URL Validation](#url-validation)
  - [Next.js API Route](#nextjs-api-route)
- [API Reference](#api-reference)
  - [`generateSitemap()`](#generatesitemap)
  - [`streamSitemap()`](#streamsitemap)
  - [`splitSitemap()`](#splitsitemap)
  - [`generateSitemapIndex()`](#generatesitemapindex)
  - [`validateSitemapUrl()`](#validatesitemapurl)
  - [Types](#types)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
npm install @power-seo/sitemap
```

```bash
yarn add @power-seo/sitemap
```

```bash
pnpm add @power-seo/sitemap
```

## Quick Start

```ts
import { generateSitemap } from '@power-seo/sitemap';

const xml = generateSitemap({
  urls: [
    { loc: 'https://example.com/', lastmod: '2026-01-01', changefreq: 'daily', priority: 1.0 },
    { loc: 'https://example.com/about', changefreq: 'monthly', priority: 0.8 },
    { loc: 'https://example.com/blog/post-1', lastmod: '2026-01-15', priority: 0.6 },
  ],
});

// Returns valid XML string:
// <?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">...
```

## Usage

### Basic Sitemap

```ts
import { generateSitemap } from '@power-seo/sitemap';

const xml = generateSitemap({
  urls: pages.map((page) => ({
    loc: `https://example.com${page.slug}`,
    lastmod: page.updatedAt,
    changefreq: 'weekly',
    priority: page.isHomepage ? 1.0 : 0.7,
  })),
});
```

### Sitemap with Images

```ts
import { generateSitemap } from '@power-seo/sitemap';

const xml = generateSitemap({
  urls: [
    {
      loc: 'https://example.com/products/widget',
      images: [
        { loc: 'https://example.com/images/widget.jpg', caption: 'Widget Pro' },
        { loc: 'https://example.com/images/widget-2.jpg', caption: 'Widget Pro angle view' },
      ],
    },
  ],
});
```

### Streaming Large Sitemaps

Use `streamSitemap()` to avoid loading all URLs into memory at once. Returns an `AsyncIterable<string>`:

```ts
import { streamSitemap } from '@power-seo/sitemap';
import { createWriteStream } from 'fs';

const stream = createWriteStream('./public/sitemap.xml');
for await (const chunk of streamSitemap({ urls: millionUrls })) {
  stream.write(chunk);
}
stream.end();
```

### Splitting into Multiple Files

Sites with more than 50,000 URLs must split their sitemap. `splitSitemap()` returns an array of URL batches:

```ts
import { splitSitemap, generateSitemap, MAX_URLS_PER_SITEMAP } from '@power-seo/sitemap';

const batches = splitSitemap(allUrls); // auto-chunks at 50,000

const xmlFiles = batches.map((batch, i) => ({
  filename: `sitemap-${i + 1}.xml`,
  content: generateSitemap({ urls: batch }),
}));
```

### Sitemap Index

Once you have multiple sitemap files, generate an index:

```ts
import { generateSitemapIndex } from '@power-seo/sitemap';

const indexXml = generateSitemapIndex({
  sitemaps: [
    { loc: 'https://example.com/sitemap-1.xml', lastmod: '2026-01-01' },
    { loc: 'https://example.com/sitemap-2.xml', lastmod: '2026-01-01' },
  ],
});
```

### URL Validation

```ts
import { validateSitemapUrl } from '@power-seo/sitemap';

const result = validateSitemapUrl({ loc: 'https://example.com/page', priority: 1.5 });
// result.valid    → false
// result.errors   → ['priority must be between 0.0 and 1.0']
// result.warnings → []
```

### Next.js API Route

```ts
// app/sitemap.xml/route.ts
import { generateSitemap } from '@power-seo/sitemap';

export async function GET() {
  const pages = await fetchAllPages();
  const xml = generateSitemap({
    urls: pages.map((p) => ({ loc: p.url, lastmod: p.updatedAt })),
  });
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

## API Reference

### `generateSitemap()`

```ts
function generateSitemap(config: SitemapConfig): string
```

#### `SitemapConfig`

| Prop | Type | Description |
|------|------|-------------|
| `urls` | `SitemapURL[]` | Array of URL entries |

#### `SitemapURL`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loc` | `string` | — | **Required.** Absolute URL of the page |
| `lastmod` | `string` | — | Last modified date (ISO 8601 or `YYYY-MM-DD`) |
| `changefreq` | `'always' \| 'hourly' \| 'daily' \| 'weekly' \| 'monthly' \| 'yearly' \| 'never'` | — | How frequently the page changes |
| `priority` | `number` | `0.5` | Priority 0.0–1.0 relative to other URLs |
| `images` | `SitemapImage[]` | — | Image extension entries |
| `videos` | `SitemapVideo[]` | — | Video extension entries |
| `news` | `SitemapNews` | — | News extension entry |

### `streamSitemap()`

```ts
function streamSitemap(config: SitemapConfig): AsyncIterable<string>
```

Returns an async iterable that yields XML string chunks. Suitable for piping to a Node.js `Writable` stream.

### `splitSitemap()`

```ts
function splitSitemap(urls: SitemapURL[], maxPerFile?: number): SitemapURL[][]
```

Splits `urls` into chunks of at most `maxPerFile` (default: `MAX_URLS_PER_SITEMAP` = 50,000).

### `generateSitemapIndex()`

```ts
function generateSitemapIndex(config: SitemapIndexConfig): string
```

#### `SitemapIndexConfig`

| Prop | Type | Description |
|------|------|-------------|
| `sitemaps` | `SitemapIndexEntry[]` | Array of child sitemap entries |

### `validateSitemapUrl()`

```ts
function validateSitemapUrl(url: SitemapURL): SitemapValidationResult
```

#### `SitemapValidationResult`

| Field | Type | Description |
|-------|------|-------------|
| `valid` | `boolean` | Whether the URL entry is valid |
| `errors` | `string[]` | Fatal validation errors |
| `warnings` | `string[]` | Non-fatal warnings |

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
