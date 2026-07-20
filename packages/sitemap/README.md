# @power-seo/sitemap

![XML sitemap generator for TypeScript producing spec-compliant urlset and sitemapindex XML with image, video, and news extensions](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/sitemap/banner.svg)

Generate spec-compliant XML sitemaps in TypeScript — streaming output, automatic index splitting, image/video/news extensions, and URL validation for Next.js, Remix, Express, and edge runtimes.

[![npm version](https://img.shields.io/npm/v/@power-seo/sitemap)](https://www.npmjs.com/package/@power-seo/sitemap)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/sitemap)](https://www.npmjs.com/package/@power-seo/sitemap)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/sitemap)](https://socket.dev/npm/package/@power-seo/sitemap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/sitemap)

`@power-seo/sitemap` is a zero-dependency XML sitemap generator for TypeScript. It turns typed `SitemapURL[]` arrays into standards-compliant `<urlset>` and `<sitemapindex>` documents — for developers who need Google-ready sitemaps in a Next.js route, a Remix loader, or a build script without pulling in a heavy XML library. Pass a hostname and a URL list, get back a valid XML string ready to serve as `application/xml`.

![Sitemap generation pipeline turning typed URL arrays into spec-compliant XML with image, video, and news extensions](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/sitemap/header.svg)

---

## Why @power-seo/sitemap?

Hand-built sitemap XML breaks in quiet ways: wrong namespace declarations, files that exceed the 50,000-URL spec limit, priority values out of range, and relative paths Google can't resolve. This package encodes the sitemap protocol so those mistakes never reach the crawler — every function is independently importable and tree-shakeable, and the whole package ships with zero third-party runtime dependencies.

|                   | Without                                | With                                             |
| ----------------- | -------------------------------------- | ------------------------------------------------ |
| Spec compliance   | Hand-built XML, wrong namespaces       | Correct `<urlset>` + namespace declarations      |
| Large sites       | Single file breaks past 50,000 URLs    | Auto-split + sitemap index generation            |
| Memory usage      | String concat spikes on large catalogs | Synchronous generator yields chunks              |
| Image indexing    | Product images undiscoverable          | `<image:image>` extension per URL                |
| Video SEO         | No structured video metadata           | `<video:video>` extension with title, duration   |
| News sitemaps     | Missing publication + date tags        | `<news:news>` extension for Google News          |
| Hostname handling | Hardcode absolute URLs everywhere      | Pass `hostname` once; use relative `loc` paths   |
| Validation        | Silent bad data reaches Google         | `validateSitemapUrl()` returns errors + warnings |

![Workflow comparison showing manual hand-built sitemap maintenance versus the automated pipeline provided by the power-seo sitemap package](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/sitemap/roi.svg)

---

## Features

- **Full sitemap spec support** — emits `<loc>`, `<lastmod>`, `<changefreq>`, and `<priority>` (priority is only written when set, and formatted to one decimal via `toFixed(1)`)
- **Hostname + relative paths** — pass `hostname` once; a relative `loc` like `/about` is normalized against it, while an absolute `loc` (starting with `http`) is used as-is
- **Image sitemap extension** — `<image:image>` tags with `loc`, `caption`, `geoLocation`, `title`, and `license`
- **Video sitemap extension** — `<video:video>` tags with `thumbnailLoc`, `title`, `description`, plus optional `contentLoc`, `playerLoc`, `duration`, `rating`, and more
- **News sitemap extension** — `<news:news>` tags with publication name, language, publication date, and title for Google News
- **Streaming generation** — `streamSitemap()` is a synchronous generator that yields XML chunks one `<url>` at a time; no full-document buffer in memory
- **Automatic index splitting** — `splitSitemap()` chunks at `MAX_URLS_PER_SITEMAP` (50,000) and returns every split sitemap plus the index XML
- **Manual sitemap index** — `generateSitemapIndex()` builds a `<sitemapindex>` pointing to child sitemaps you maintain separately
- **Smart namespace detection** — `generateSitemap()` declares the image/video/news namespaces only when those extensions are actually used
- **URL validation** — `validateSitemapUrl()` returns `{ valid, errors, warnings }` and never throws
- **Next.js App Router adapter** — `toNextSitemap()` converts `SitemapURL[]` into the `MetadataRoute.Sitemap` shape for `app/sitemap.ts`
- **Constants exported** — `MAX_URLS_PER_SITEMAP` (50,000) and `MAX_SITEMAP_SIZE_BYTES` (52,428,800)
- **Framework-agnostic** — works in Next.js API routes, Remix loaders, Express, Fastify, and edge runtimes
- **Zero runtime dependencies** — pure TypeScript; only `@power-seo/core` in the tree, no external XML libraries

![Google Search Console interface showing a submitted sitemap with indexed URL counts and discovery status](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/sitemap/gsc-ui.svg)

---

## Comparison

![Feature comparison matrix of @power-seo/sitemap versus next-sitemap, the sitemap npm package, and xmlbuilder2 across extensions, streaming, index splitting, and validation](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/sitemap/comparison.svg)

| Feature                          | @power-seo/sitemap | next-sitemap | sitemap (npm) | xmlbuilder2 |
| -------------------------------- | :----------------: | :----------: | :-----------: | :---------: |
| Image sitemap extension          |         ✅         |      ✅      |      ✅       |     ❌      |
| Video sitemap extension          |         ✅         |      ❌      |      ✅       |     ❌      |
| News sitemap extension           |         ✅         |      ❌      |      ✅       |     ❌      |
| Streaming generation             |         ✅         |      ❌      |      ✅       |     ❌      |
| Auto index splitting             |         ✅         |      ✅      |      ❌       |     ❌      |
| URL validation                   |         ✅         |      ❌      |      ❌       |     ❌      |
| Hostname + relative loc paths    |         ✅         |      ❌      |      ❌       |     ❌      |
| Zero runtime dependencies        |         ✅         |      ❌      |      ❌       |     ❌      |
| Edge runtime compatible          |         ✅         |      ❌      |      ❌       |     ❌      |
| TypeScript-first                 |         ✅         |   Partial    |      ❌       |     ❌      |
| Tree-shakeable                   |         ✅         |      ❌      |      ❌       |     ❌      |
| Next.js `app/sitemap.ts` adapter |         ✅         |      ✅      |      ❌       |     ❌      |

![Accuracy of image, video, and news sitemap extension XML output compared across sitemap generation libraries](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/sitemap/extensions-accuracy.svg)

---

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

---

## Usage

### How do I generate an XML sitemap?

Call `generateSitemap(config)` with a `hostname` and an array of `urls`. It returns a complete, spec-compliant XML string — including the `<?xml?>` declaration and the `<urlset>` namespace. The `hostname` is prepended to any relative `loc`, so you can keep your route data as paths like `/about`. Serve the result with `Content-Type: application/xml`.

```ts
import { generateSitemap } from '@power-seo/sitemap';

const xml = generateSitemap({
  hostname: 'https://example.com',
  urls: [
    { loc: '/', lastmod: '2026-01-01', changefreq: 'daily', priority: 1.0 },
    { loc: '/products', changefreq: 'weekly', priority: 0.9 },
    { loc: '/blog', changefreq: 'daily', priority: 0.8 },
  ],
});

// <?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   <url><loc>https://example.com/</loc>...

res.setHeader('Content-Type', 'application/xml');
res.send(xml);
```

An absolute `loc` (starting with `http`) is emitted unchanged; a relative `loc` is normalized against `hostname`. When `priority` is omitted, no `<priority>` tag is written for that URL.

### How do I stream a very large sitemap?

Use `streamSitemap(hostname, urls)`. It is a synchronous generator (`function*`) that yields the XML declaration and opening tags first, then one chunk per `<url>` block, then the closing tag — so you never hold the full document in memory. Pass any `Iterable<SitemapURL>`: an array, a generator, or a database cursor.

```ts
import { streamSitemap } from '@power-seo/sitemap';

const urls = fetchAllProductUrls(); // Iterable<SitemapURL>

for (const chunk of streamSitemap('https://example.com', urls)) {
  response.write(chunk);
}
response.end();
```

Note: `streamSitemap()` always declares the image, video, and news namespaces on the opening `<urlset>` tag, whereas `generateSitemap()` only declares the ones it detects.

### How do I split a site with more than 50,000 URLs?

Call `splitSitemap(config, pattern?)`. It chunks `urls` at `MAX_URLS_PER_SITEMAP` (50,000, or your `maxUrlsPerSitemap` override) and returns `{ index, sitemaps }` — the sitemap index XML plus one entry per split file, each with its `filename` and `xml`. The `pattern` controls filenames using `{index}` as the placeholder.

```ts
import { splitSitemap } from '@power-seo/sitemap';
import fs from 'node:fs';

const { index, sitemaps } = splitSitemap({
  hostname: 'https://example.com',
  urls: largeUrlArray, // more than 50,000 entries
});

// Write each split sitemap (default filenames: /sitemap-0.xml, /sitemap-1.xml, ...)
for (const { filename, xml } of sitemaps) {
  fs.writeFileSync(`./public${filename}`, xml);
}

// Write the index that references them
fs.writeFileSync('./public/sitemap.xml', index);
```

Custom filename pattern:

```ts
const { index, sitemaps } = splitSitemap(
  { hostname: 'https://example.com', urls: largeUrlArray },
  '/sitemaps/part-{index}.xml', // default: '/sitemap-{index}.xml'
);
```

### How do I build a sitemap index manually?

When you maintain separate sitemaps per section or locale, use `generateSitemapIndex(config)` to combine them under one index file. Pass a `sitemaps` array of `{ loc, lastmod? }` entries — `loc` should be the absolute URL of each child sitemap.

```ts
import { generateSitemapIndex } from '@power-seo/sitemap';

const indexXml = generateSitemapIndex({
  sitemaps: [
    { loc: 'https://example.com/sitemap-pages.xml', lastmod: '2026-01-01' },
    { loc: 'https://example.com/sitemap-products.xml', lastmod: '2026-01-15' },
    { loc: 'https://example.com/sitemap-blog.xml', lastmod: '2026-01-20' },
  ],
});
```

### How do I add images to a sitemap?

Attach an `images` array to any `SitemapURL`. Each entry emits an `<image:image>` block, and `generateSitemap()` automatically adds the image namespace to `<urlset>` when at least one URL has images. Google indexes up to 1,000 images per page; `validateSitemapUrl()` warns above that.

```ts
import { generateSitemap } from '@power-seo/sitemap';

const xml = generateSitemap({
  hostname: 'https://example.com',
  urls: [
    {
      loc: '/products/blue-sneaker',
      lastmod: '2026-01-10',
      images: [
        {
          loc: 'https://cdn.example.com/sneaker-blue.jpg',
          caption: 'Blue sneaker — side view',
          title: 'Blue Running Sneaker',
        },
        {
          loc: 'https://cdn.example.com/sneaker-blue-top.jpg',
          caption: 'Blue sneaker — top view',
        },
      ],
    },
  ],
});
```

### How do I validate URL entries before serving?

`validateSitemapUrl(url)` checks a single `SitemapURL` against the sitemap protocol and returns `{ valid, errors, warnings }` without throwing. Note that `loc` **must be an absolute URL** to pass validation, so validate the same absolute URLs you plan to submit. Out-of-range `priority`, invalid `changefreq`, and malformed `lastmod` become errors; long URLs (over 75 characters) become warnings.

```ts
import { validateSitemapUrl } from '@power-seo/sitemap';

const result = validateSitemapUrl({
  loc: 'https://example.com/about',
  priority: 1.5, // out of range
  changefreq: 'daily',
});

// result.valid    → false
// result.errors   → ['"priority" value 1.5 is out of range. Must be between 0.0 and 1.0.']
// result.warnings → []
```

### How do I generate a sitemap in Next.js App Router?

Next.js App Router has a built-in `app/sitemap.ts` convention that returns an array of URL objects — not XML. Use `toNextSitemap()` to convert `SitemapURL[]` into that shape. It filters out entries that fail `validateSitemapUrl()` (so use absolute `loc` values) and maps `changefreq` to Next's `changeFrequency` key.

```ts
// app/sitemap.ts
import { toNextSitemap } from '@power-seo/sitemap';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await fetchUrlsFromCms(); // SitemapURL[] with absolute loc values
  return toNextSitemap(urls) as MetadataRoute.Sitemap;
}
```

For full control over the XML — including image, video, or news extensions — use a route handler instead:

```ts
// app/sitemap.xml/route.ts
import { generateSitemap } from '@power-seo/sitemap';

export async function GET() {
  const urls = await fetchUrlsFromCms();

  const xml = generateSitemap({ hostname: 'https://example.com', urls });

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### How do I generate a sitemap in a Remix resource route?

Return the XML from a resource route loader with an `application/xml` content type.

```ts
// app/routes/sitemap[.xml].ts
import { generateSitemap } from '@power-seo/sitemap';

export async function loader() {
  const urls = await fetchUrlsFromDb();

  const xml = generateSitemap({ hostname: 'https://example.com', urls });

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

![Constant memory footprint of streaming sitemap generation versus buffering the full XML document for large catalogs](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/sitemap/streaming-benefit.svg)

---

## API Reference

### `generateSitemap(config)`

```ts
function generateSitemap(config: SitemapConfig): string;
```

| Prop                | Type           | Required | Description                                                               |
| ------------------- | -------------- | :------: | ------------------------------------------------------------------------- |
| `hostname`          | `string`       |    ✅    | Base URL prepended to relative `loc` paths (e.g. `'https://example.com'`) |
| `urls`              | `SitemapURL[]` |    ✅    | Array of URL entries                                                      |
| `maxUrlsPerSitemap` | `number`       |    —     | Chunk size used by `splitSitemap()`; defaults to `MAX_URLS_PER_SITEMAP`   |
| `outputDir`         | `string`       |    —     | Informational only — this package never writes files                      |

### `streamSitemap(hostname, urls)`

```ts
function streamSitemap(
  hostname: string,
  urls: Iterable<SitemapURL>,
): Generator<string, void, undefined>;
```

Synchronous generator. Yields the XML declaration and opening `<urlset>` (with all three extension namespaces), one chunk per `<url>` block, then the closing tag. Never buffers the whole document.

| Param      | Type                   | Description                                            |
| ---------- | ---------------------- | ------------------------------------------------------ |
| `hostname` | `string`               | Base URL prepended to relative `loc` paths             |
| `urls`     | `Iterable<SitemapURL>` | Any iterable — arrays, generators, or database cursors |

### `splitSitemap(config, sitemapUrlPattern?)`

```ts
function splitSitemap(
  config: SitemapConfig,
  sitemapUrlPattern?: string,
): { index: string; sitemaps: Array<{ filename: string; xml: string }> };
```

| Param               | Type            | Default                  | Description                                    |
| ------------------- | --------------- | ------------------------ | ---------------------------------------------- |
| `config`            | `SitemapConfig` | —                        | Same config as `generateSitemap()`             |
| `sitemapUrlPattern` | `string`        | `'/sitemap-{index}.xml'` | Filename pattern; `{index}` is the chunk index |

Returns `{ index, sitemaps }` where `index` is the `<sitemapindex>` XML and each `sitemaps[]` item is `{ filename, xml }`.

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

Returns `{ valid, errors, warnings }`; never throws. Enforces: `loc` required and absolute, `loc` ≤ 2048 chars (error) with a warning over 75 chars, `priority` in `0.0–1.0`, valid `changefreq`, W3C-datetime `lastmod`, per-image absolute `loc`, required video `title`/`description`/`thumbnailLoc` and a `contentLoc` or `playerLoc`, video `rating` in `0.0–5.0`, and required news `publication.name`, `publication.language`, `publicationDate`, and `title`.

### `toNextSitemap(urls)`

```ts
function toNextSitemap(urls: SitemapURL[]): NextSitemapEntry[];
```

Converts `SitemapURL[]` to Next.js `MetadataRoute.Sitemap` shape. Entries failing `validateSitemapUrl()` are dropped, so pass absolute `loc` values. `changefreq` maps to `changeFrequency`.

| Field             | Type                       | Description                     |
| ----------------- | -------------------------- | ------------------------------- |
| `url`             | `string`                   | Absolute URL from `loc`         |
| `lastModified`    | `string \| Date`           | From `lastmod` (passed through) |
| `changeFrequency` | `SitemapURL['changefreq']` | From `changefreq`               |
| `priority`        | `number`                   | From `priority`                 |

---

## Types

| Type                      | Description                                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SitemapConfig`           | `{ hostname: string; urls: SitemapURL[]; maxUrlsPerSitemap?: number; outputDir?: string }`                                                                                    |
| `SitemapURL`              | Single URL entry — see field table below                                                                                                                                      |
| `SitemapImage`            | `{ loc: string; caption?: string; geoLocation?: string; title?: string; license?: string }`                                                                                   |
| `SitemapVideo`            | `{ thumbnailLoc, title, description }` + optional `contentLoc`, `playerLoc`, `duration`, `rating`, `viewCount`, `publicationDate`, `expirationDate`, `familyFriendly`, `live` |
| `SitemapNews`             | `{ publication: { name: string; language: string }; publicationDate: string; title: string }`                                                                                 |
| `SitemapIndexConfig`      | `{ sitemaps: SitemapIndexEntry[] }`                                                                                                                                           |
| `SitemapIndexEntry`       | `{ loc: string; lastmod?: string }`                                                                                                                                           |
| `SitemapValidationResult` | `{ valid: boolean; errors: string[]; warnings: string[] }`                                                                                                                    |
| `NextSitemapEntry`        | `{ url: string; lastModified?: string \| Date; changeFrequency?: ...; priority?: number }`                                                                                    |

### `SitemapURL` Fields

| Prop         | Type                                                                              | Default          | Description                                                                                          |
| ------------ | --------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| `loc`        | `string`                                                                          | —                | **Required.** Relative path (e.g. `/about`) or absolute URL; hostname is prepended to relative paths |
| `lastmod`    | `string`                                                                          | —                | Last-modified date — `YYYY-MM-DD` or ISO 8601                                                        |
| `changefreq` | `'always' \| 'hourly' \| 'daily' \| 'weekly' \| 'monthly' \| 'yearly' \| 'never'` | —                | Suggested crawl frequency                                                                            |
| `priority`   | `number`                                                                          | (no tag emitted) | Priority `0.0–1.0`; formatted to one decimal. Omitted → no `<priority>` tag                          |
| `images`     | `SitemapImage[]`                                                                  | —                | Emits `<image:image>` blocks                                                                         |
| `videos`     | `SitemapVideo[]`                                                                  | —                | Emits `<video:video>` blocks                                                                         |
| `news`       | `SitemapNews`                                                                     | —                | Emits a `<news:news>` block                                                                          |

### Constants

| Constant                 | Value        | Description                                        |
| ------------------------ | ------------ | -------------------------------------------------- |
| `MAX_URLS_PER_SITEMAP`   | `50_000`     | Maximum URLs allowed per sitemap file (spec limit) |
| `MAX_SITEMAP_SIZE_BYTES` | `52_428_800` | Maximum sitemap file size in bytes (50 MB)         |

---

## Use Cases

- **Next.js App Router** — generate sitemaps in `app/sitemap.ts` or `app/sitemap.xml/route.ts` at build or request time
- **E-commerce catalogs** — product image sitemaps with `<image:image>` for every listing to keep Google Images current
- **News publishers** — `<news:news>` extension for Google News sitemap submission
- **Multi-locale sites** — separate sitemaps per locale unified under one `generateSitemapIndex()` file
- **Programmatic SEO** — stream sitemaps for thousands of auto-generated pages with constant memory
- **Large sites** — automatic splitting at 50,000 URLs per file with a generated index
- **Video platforms** — `<video:video>` extension with title, description, and thumbnail for video SEO
- **CI/CD pipelines** — validate URL entries with `validateSitemapUrl()` as a pull-request check

---

## Architecture Overview

- **Pure TypeScript** — no compiled binary, no native modules
- **Zero runtime dependencies** — only `@power-seo/core` in the tree, no external XML libraries
- **Framework-agnostic** — runs in any JavaScript environment supporting ES2020+
- **SSR compatible** — safe in Next.js Server Components, Remix loaders, and Express handlers
- **Edge runtime safe** — no `fs`, no `path`, no Node-specific APIs; runs on Cloudflare Workers, Vercel Edge, and Deno
- **Synchronous generator streaming** — `streamSitemap()` uses `function*`, so no async overhead or backpressure handling
- **Smart namespace detection** — `generateSitemap()` declares image/video/news namespaces only when used; `streamSitemap()` always declares all three
- **Tree-shakeable** — `"sideEffects": false` with one named export per function
- **Dual ESM + CJS** — ships both formats via tsup for any bundler or `require()`

---

## Supply Chain Security

- Published to npm with **provenance attestation** — every release is built and signed by the verified `github.com/CyberCraftBD/power-seo` GitHub Actions workflow, so you can trace each tarball back to its exact source commit
- **Zero third-party runtime dependencies** — packages depend only on other `@power-seo` packages, nothing else gets pulled in
- **No network access at runtime** — pure computation on the inputs you pass; nothing is fetched, phoned home, or telemetered
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

xml sitemap, sitemap generator, sitemap index, nextjs sitemap, streaming sitemap, image sitemap, video sitemap, news sitemap, split sitemap, sitemap validation, edge runtime, remix, crawl budget, google sitemap, url priority, typescript, zero-dependency, seo

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
