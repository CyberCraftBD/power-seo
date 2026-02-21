# @power-seo/sitemap — XML Sitemap Generator for TypeScript — Streaming, Index Splitting & Image/Video/News Extensions

[![npm version](https://img.shields.io/npm/v/@power-seo/sitemap)](https://www.npmjs.com/package/@power-seo/sitemap)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/sitemap)](https://www.npmjs.com/package/@power-seo/sitemap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/sitemap)

---

## Overview

**@power-seo/sitemap** is a zero-dependency XML sitemap generator for TypeScript that helps you generate standards-compliant sitemaps with image, video, and news extensions — including streaming generation and automatic index splitting for large sites.

**What it does**

- ✅ **Generate XML sitemaps** — `generateSitemap()` produces spec-compliant `<urlset>` XML strings
- ✅ **Stream large sitemaps** — `streamSitemap()` yields XML chunks with constant memory usage
- ✅ **Split into multiple files** — `splitSitemap()` auto-chunks at the 50,000-URL limit
- ✅ **Generate sitemap indexes** — `generateSitemapIndex()` creates `<sitemapindex>` files pointing to child sitemaps
- ✅ **Validate URL entries** — `validateSitemapUrl()` checks against Google's sitemap spec requirements

**What it is not**

- ❌ **Not a sitemap crawler** — does not discover URLs by crawling your site
- ❌ **Not a submission client** — use `@power-seo/search-console` to submit sitemaps to GSC

**Recommended for**

- **Next.js App Router sites**, **Remix apps**, **Express servers**, **static site generators**, and any Node.js/edge environment that generates sitemaps programmatically

---

## Why @power-seo/sitemap Matters

**The problem**

- **Sites with 50,000+ URLs** cannot fit in a single sitemap file — the spec mandates splitting
- **Image and video sitemaps** require `<image:image>` and `<video:video>` namespace extensions that most generators don't support
- **Memory spikes** during XML string concatenation cause crashes or timeouts on large e-commerce catalogs

**Why developers care**

- **SEO:** Well-structured sitemaps improve crawl coverage and ensure all pages are discovered
- **Performance:** Streaming generation keeps memory usage constant for million-URL datasets
- **Indexing:** Image sitemaps help Google discover and index product images for Google Images

---

## Key Features

- **Full sitemap spec support** — `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`, and all optional elements
- **Image sitemap extension** — `<image:image>` tags with `loc`, `caption`, `title`, `license`
- **Video sitemap extension** — `<video:video>` tags with title, description, thumbnail, duration
- **News sitemap extension** — `<news:news>` tags with publication name, language, date
- **Streaming generation** — `streamSitemap()` returns `AsyncIterable<string>` — no memory spike on large lists
- **Automatic index splitting** — `splitSitemap()` chunks at `MAX_URLS_PER_SITEMAP` (50,000)
- **Sitemap index generation** — `generateSitemapIndex()` creates a `<sitemapindex>` pointing to child sitemaps
- **URL validation** — `validateSitemapUrl()` returns `{ valid, errors, warnings }` without throwing
- **Constants exported** — `MAX_URLS_PER_SITEMAP` (50,000) and `MAX_SITEMAP_SIZE_BYTES` (50MB)
- **Framework-agnostic** — works in Next.js API routes, Remix loaders, Express, Fastify, and edge runtimes
- **Full TypeScript support** — typed `SitemapURL`, `SitemapImage`, `SitemapVideo`, `SitemapNews`, `SitemapConfig`
- **Zero runtime dependencies** — pure TypeScript, no external XML libraries

---

## Benefits of Using @power-seo/sitemap

- **Improved crawl coverage**: Well-structured sitemaps with `lastmod` help Googlebot prioritize fresh pages
- **Better image indexing**: `<image:image>` extensions surface product images in Google Images
- **Safer implementation**: `validateSitemapUrl()` catches out-of-range `priority` values and invalid dates before serving
- **Faster delivery**: Zero-dependency streaming generation works in any runtime without configuration

---

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

**What you should see**

- A standards-compliant XML sitemap string ready to serve as `Content-Type: application/xml`
- `<urlset>` containing `<url>` entries with the fields you provided

---

## Installation

```bash
npm i @power-seo/sitemap
# or
yarn add @power-seo/sitemap
# or
pnpm add @power-seo/sitemap
# or
bun add @power-seo/sitemap
```

---

## Framework Compatibility

**Supported**

- ✅ Next.js App Router — use in `app/sitemap.xml/route.ts` API route
- ✅ Next.js Pages Router — use in `pages/api/sitemap.xml.ts`
- ✅ Remix — use in resource routes
- ✅ Node.js 18+ — pure TypeScript, no native bindings
- ✅ Edge runtimes — no `fs`, no `path`, no Node.js-specific APIs (except `streamSitemap` which uses `AsyncIterable`)
- ✅ Fastify / Express — serve the XML string as response body

**Environment notes**

- **SSR/SSG:** Fully supported — generate at request time or at build time
- **Edge runtime:** `generateSitemap()` and `generateSitemapIndex()` are edge-compatible; `streamSitemap()` requires Node.js streams if writing to disk
- **Browser-only usage:** Not applicable — sitemap generation is a server-side concern

---

## Use Cases

- **Next.js SSG sites** — generate a full sitemap from your CMS at build time
- **E-commerce catalogs** — product image sitemaps with `<image:image>` for every listing
- **News publishers** — `<news:news>` extension for Google News sitemap submission
- **Multi-locale sites** — separate sitemaps per locale with a unified sitemap index
- **Programmatic SEO** — generate sitemaps for thousands of auto-generated pages
- **Large sites** — automatic splitting at 50,000 URLs per file with index generation
- **Video platforms** — `<video:video>` extension for YouTube-style video SEO

---

## Example (Before / After)

```text
Before:
- Hand-built XML strings: missing namespace declarations, wrong date formats
- Single 80,000-URL sitemap: invalid per spec (max 50,000), Google truncates
- No image sitemap: product images not discovered by Googlebot Images

After (@power-seo/sitemap):
- generateSitemap({ urls }) → spec-compliant XML with correct namespace
- splitSitemap(allUrls) + generateSitemapIndex() → auto-split + index file
- urls[i].images = [{ loc, caption }] → <image:image> tags for each product
```

---

## Implementation Best Practices

- **Always include `lastmod`** — Googlebot uses it to prioritize re-crawling updated pages
- **Keep `priority` values realistic** — setting everything to 1.0 signals ignored priority; reserve 1.0 for the homepage
- **Use `changefreq: 'never'` for permanent content** — signals Googlebot to skip re-crawling
- **Set `sitemap.xml` URL in `robots.txt`** — `Sitemap: https://example.com/sitemap.xml` is required for discovery
- **Submit to Google Search Console** after generating — use `@power-seo/search-console` `submitSitemap()`

---

## Architecture Overview

**Where it runs**

- **Build-time**: Generate static `sitemap.xml` files during `next build` or Remix production builds
- **Runtime**: Serve dynamically from an API route; regenerate on demand or on ISR revalidation
- **CI/CD**: Validate sitemap URL entries as part of pull request checks

**Data flow**

1. **Input**: Array of `SitemapURL` objects with `loc`, `lastmod`, optional images/videos/news
2. **Analysis**: Spec validation, namespace detection, XML serialization
3. **Output**: Valid XML string or `AsyncIterable<string>` stream
4. **Action**: Serve as `application/xml`, write to disk, or submit to GSC via `@power-seo/search-console`

---

## Features Comparison with Popular Packages

| Capability                | next-sitemap | sitemap (npm) | xmlbuilder2 | @power-seo/sitemap |
| ------------------------- | -----------: | ------------: | ----------: | -----------------: |
| Image sitemap extension   |           ✅ |            ✅ |          ❌ |                 ✅ |
| Video sitemap extension   |           ❌ |            ✅ |          ❌ |                 ✅ |
| News sitemap extension    |           ❌ |            ✅ |          ❌ |                 ✅ |
| Streaming generation      |           ❌ |            ❌ |          ❌ |                 ✅ |
| Auto index splitting      |           ✅ |            ❌ |          ❌ |                 ✅ |
| URL validation            |           ❌ |            ❌ |          ❌ |                 ✅ |
| Zero runtime dependencies |           ❌ |            ❌ |          ❌ |                 ✅ |
| Edge runtime compatible   |           ❌ |            ❌ |          ❌ |                 ✅ |

---

## @power-seo Ecosystem

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

| Need               | Common approach        | @power-seo approach                                  |
| ------------------ | ---------------------- | ---------------------------------------------------- |
| Sitemap generation | `next-sitemap`         | `@power-seo/sitemap` — streaming, image, video, news |
| Sitemap submission | Manual GSC UI          | `@power-seo/search-console` — `submitSitemap()`      |
| Image SEO          | Manual `<image:image>` | `@power-seo/sitemap` + `@power-seo/images`           |
| Structured data    | Manual JSON-LD         | `@power-seo/schema` — typed builders                 |

---

## Enterprise Integration

**Multi-tenant SaaS**

- **Per-tenant sitemaps**: Generate separate sitemaps per client domain; serve from tenant-aware API routes
- **Sitemap index**: Use `generateSitemapIndex()` to aggregate tenant sitemaps into a root index
- **Scheduled regeneration**: Rebuild sitemaps nightly as new content is published

**ERP / internal portals**

- Generate sitemaps only for public-facing modules (knowledge base, product catalog)
- Use `validateSitemapUrl()` to enforce URL format standards across generated entries
- Pipe large catalogs through `streamSitemap()` to avoid memory limits in serverless environments

**Recommended integration pattern**

- Generate sitemaps in **CI** at build time for static content
- Serve dynamically from **API routes** for frequently updated content
- Submit new sitemaps to GSC via `@power-seo/search-console` after deployment
- Monitor crawl coverage in Google Search Console

---

## Scope and Limitations

**This package does**

- ✅ Generate spec-compliant XML sitemaps from URL arrays
- ✅ Support image, video, and news sitemap extensions
- ✅ Stream large sitemaps to avoid memory spikes
- ✅ Split sitemaps and generate sitemap index files

**This package does not**

- ❌ Crawl your site to discover URLs — you provide the URL list
- ❌ Submit sitemaps to Google — use `@power-seo/search-console` for submission
- ❌ Monitor sitemap status — use Google Search Console for crawl coverage reports

---

## API Reference

### `generateSitemap(config)`

```ts
function generateSitemap(config: SitemapConfig): string;
```

| Prop   | Type           | Description          |
| ------ | -------------- | -------------------- |
| `urls` | `SitemapURL[]` | Array of URL entries |

#### `SitemapURL`

| Prop         | Type                                                                              | Default | Description                              |
| ------------ | --------------------------------------------------------------------------------- | ------- | ---------------------------------------- |
| `loc`        | `string`                                                                          | —       | **Required.** Absolute URL               |
| `lastmod`    | `string`                                                                          | —       | Last modified (ISO 8601 or `YYYY-MM-DD`) |
| `changefreq` | `'always' \| 'hourly' \| 'daily' \| 'weekly' \| 'monthly' \| 'yearly' \| 'never'` | —       | Change frequency                         |
| `priority`   | `number`                                                                          | `0.5`   | Priority 0.0–1.0                         |
| `images`     | `SitemapImage[]`                                                                  | —       | Image extension entries                  |
| `videos`     | `SitemapVideo[]`                                                                  | —       | Video extension entries                  |
| `news`       | `SitemapNews`                                                                     | —       | News extension entry                     |

### `streamSitemap(config)`

```ts
function streamSitemap(config: SitemapConfig): AsyncIterable<string>;
```

Returns an async iterable that yields XML chunks. Suitable for piping to a Node.js `Writable`.

### `splitSitemap(urls, maxPerFile?)`

```ts
function splitSitemap(urls: SitemapURL[], maxPerFile?: number): SitemapURL[][];
```

Splits `urls` into chunks of at most `maxPerFile` (default: `MAX_URLS_PER_SITEMAP` = 50,000).

### `generateSitemapIndex(config)`

```ts
function generateSitemapIndex(config: SitemapIndexConfig): string;
```

| Prop       | Type                  | Description                                  |
| ---------- | --------------------- | -------------------------------------------- |
| `sitemaps` | `SitemapIndexEntry[]` | Array of `{ loc: string; lastmod?: string }` |

### `validateSitemapUrl(url)`

```ts
function validateSitemapUrl(url: SitemapURL): SitemapValidationResult;
```

Returns `{ valid: boolean; errors: string[]; warnings: string[] }`.

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

## About CyberCraft Bangladesh

**CyberCraft Bangladesh** is a Bangladesh-based enterprise-grade software engineering company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

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
seo, sitemap, xml-sitemap, sitemap-generator, image-sitemap, video-sitemap, news-sitemap, sitemap-index, typescript, nextjs, remix, streaming, crawl-budget, google-indexing
```
