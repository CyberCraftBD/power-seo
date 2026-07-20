# @power-seo/links

![Internal link graph analysis for SEO — orphan page detection, link suggestions, and PageRank-style equity scoring](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/banner.svg)

Build a directed link graph from your site's pages, detect orphan pages with zero inbound links, generate keyword-overlap link suggestions, and score link equity with a PageRank-style algorithm.

[![npm version](https://img.shields.io/npm/v/@power-seo/links)](https://www.npmjs.com/package/@power-seo/links)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/links)](https://www.npmjs.com/package/@power-seo/links)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/links)](https://socket.dev/npm/package/@power-seo/links)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/links)

`@power-seo/links` is a TypeScript internal-linking analysis library for developers who need programmatic control over site link structure. It builds a directed link graph from an array of pages, then finds orphan pages, computes PageRank-style link equity scores, and suggests new internal links based on keyword overlap. It runs anywhere JavaScript runs — Node.js, serverless, Edge — with no third-party runtime dependencies.

![How @power-seo/links works — pages in, directed link graph out, with orphan detection, suggestions, and equity scoring](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/header.svg)

Internal link structure determines how search engines discover your content and how link equity flows through your site. Four functions cover the whole workflow: `buildLinkGraph` constructs the graph, `findOrphanPages` flags unreachable pages, `analyzeLinkEquity` ranks pages by accumulated authority, and `suggestLinks` proposes contextual links between topically related pages. Pair it with [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit) for site-wide audits or [`@power-seo/analytics`](https://www.npmjs.com/package/@power-seo/analytics) to correlate equity with traffic.

---

## Why @power-seo/links?

|                      | Without               | With                                               |
| -------------------- | --------------------- | -------------------------------------------------- |
| Orphan detection     | ❌ Manual crawl       | ✅ `findOrphanPages()` on an in-memory graph       |
| Link suggestions     | ❌ Guesswork          | ✅ Keyword-overlap contextual suggestions          |
| Link equity          | ❌ Third-party tools  | ✅ PageRank-style scoring built in                 |
| Graph construction   | ❌ Build from scratch | ✅ `buildLinkGraph()` — directed graph in one call |
| Audit integration    | ❌ Separate toolchain | ✅ Composes with `@power-seo/audit`                |
| TypeScript support   | ❌ Untyped            | ✅ Full type coverage for every graph structure    |
| Runtime dependencies | ❌ External libs      | ✅ Only `@power-seo/core` — nothing third-party    |

![Internal link workflow before and after adopting @power-seo/links — manual spreadsheet auditing replaced by an automated graph pipeline](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/roi.svg)

---

## Features

- **Directed link graph construction** — `buildLinkGraph(pages)` normalizes URLs, resolves relative links against the page URL, de-duplicates edges, ignores self-links, and computes inbound and outbound link sets for every node
- **Orphan page detection** — `findOrphanPages(graph, entryPoints?)` returns every page with zero inbound internal links, sorted by outbound count descending; pass entry points (homepage, landing pages) to exclude them
- **Keyword-overlap link suggestions** — `suggestLinks(pages, options?)` extracts keywords from page content, title, and URL slug, then proposes links between related pages that do not already link to each other, with anchor text taken from the target's title or slug
- **PageRank-style link equity scoring** — `analyzeLinkEquity(graph, options?)` runs damping-factor power iteration (default damping `0.85`, `20` iterations) and returns scores normalized to 0–1, sorted descending
- **Inbound and outbound inspection** — every `LinkNode` exposes `inbound` and `outbound` URL arrays plus `inboundCount` and `outboundCount`
- **Normalized URL handling** — trailing slashes, default ports, and doubled path slashes are normalized before graph construction, so `/blog` and `/blog/` become one node
- **No third-party runtime dependencies** — depends only on `@power-seo/core`; pure TypeScript computation

![Internal linking dashboard built with @power-seo/links — orphan list, equity distribution, and suggestion queue](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/dashboard-ui.svg)

---

## Comparison

![Feature comparison matrix of @power-seo/links versus Screaming Frog, Ahrefs and custom scripts for internal link analysis](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/comparison.svg)

| Feature                   | @power-seo/links | Screaming Frog | Ahrefs | Custom scripts |
| ------------------------- | :--------------: | :------------: | :----: | :------------: |
| Programmatic link graph   |        ✅        |       ❌       |   ❌   |     Manual     |
| Orphan page detection     |        ✅        |       ✅       |   ✅   |     Manual     |
| Keyword-based suggestions |        ✅        |       ❌       |   ❌   |     Manual     |
| PageRank-style equity     |        ✅        |       ❌       |   ✅   |     Manual     |
| Audit integration         |        ✅        |       ❌       |   ❌   |       —        |
| Runs in CI / Edge         |        ✅        |       ❌       |   ❌   |       —        |
| TypeScript-first          |        ✅        |       ❌       |   ❌   |       —        |
| Tree-shakeable            |        ✅        |       ❌       |   ❌   |       —        |

![Link equity scoring accuracy — iterative PageRank computation converging on stable normalized scores](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/equity-accuracy.svg)

---

## Installation

```bash
npm install @power-seo/links
```

```bash
yarn add @power-seo/links
```

```bash
pnpm add @power-seo/links
```

Requires Node.js >= 18.

---

## Usage

### How do I analyze my site's internal links in TypeScript?

Collect each page's URL and outbound links (from your CMS, router manifest, or a crawl), pass the array to `buildLinkGraph`, then run the analysis functions on the result. The graph is built entirely in memory — no network access, no crawling done for you — so the same code works in a build step, a CI job, or an API route.

```ts
import { buildLinkGraph, findOrphanPages, analyzeLinkEquity } from '@power-seo/links';

// 1. Build the graph from your site's pages
const graph = buildLinkGraph([
  { url: 'https://example.com/', links: ['https://example.com/about', 'https://example.com/blog'] },
  { url: 'https://example.com/about', links: ['https://example.com/'] },
  { url: 'https://example.com/blog', links: ['https://example.com/'] },
  { url: 'https://example.com/orphan', links: [] },
]);

// 2. Find pages no other page links to
const orphans = findOrphanPages(graph);
// [{ url: 'https://example.com/orphan', outboundCount: 0 }]

// 3. Score link equity (normalized 0-1, sorted descending)
const equityScores = analyzeLinkEquity(graph);
// [{ url: 'https://example.com/', score: 1, inboundCount: 2 }, ...]
```

![Orphan page detection benefit — surfacing pages invisible to crawlers that follow links from the homepage](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/orphan-benefit.svg)

### How do I build an internal link graph?

`buildLinkGraph` accepts an array of `PageData` objects (`url` and `links` are used; `title` and `content` are optional) and returns a `LinkGraph` with a `Map<string, LinkNode>` keyed by normalized URL. Relative links are resolved against the page URL, duplicate links from the same page count once, and self-links are ignored. Nodes are created for link targets even when no `PageData` entry exists for them.

```ts
import { buildLinkGraph } from '@power-seo/links';
import type { PageData, LinkGraph } from '@power-seo/links';

const pages: PageData[] = [
  { url: 'https://example.com/', links: ['/blog', '/about', '/contact'] },
  { url: 'https://example.com/blog', links: ['/', '/blog/post-1', '/blog/post-2'] },
  { url: 'https://example.com/blog/post-1', links: ['/blog'] },
  { url: 'https://example.com/blog/post-2', links: ['/blog', '/blog/post-1'] },
  { url: 'https://example.com/about', links: ['/'] },
  { url: 'https://example.com/contact', links: [] },
];

const graph: LinkGraph = buildLinkGraph(pages);

console.log(graph.totalPages); // 6
console.log(graph.totalLinks); // 10

// Inspect a node
const blogNode = graph.nodes.get('https://example.com/blog');
console.log(blogNode?.inboundCount); // 3 — linked from /, /blog/post-1, /blog/post-2
console.log(blogNode?.outboundCount); // 3 — links to /, /blog/post-1, /blog/post-2
```

### How do I find orphan pages on my site?

`findOrphanPages` returns every node whose `inboundCount` is zero — pages that cannot be reached by following links from any other page, which makes them effectively invisible to crawlers unless they appear in your sitemap. Pass known entry points (homepage, campaign landing pages) as the second argument to exclude them. Results are sorted by outbound count descending, so pages that link out but receive nothing come first — those are your highest-priority fixes.

```ts
import { buildLinkGraph, findOrphanPages } from '@power-seo/links';
import type { OrphanPage } from '@power-seo/links';

const graph = buildLinkGraph(pages);
const orphans: OrphanPage[] = findOrphanPages(graph, ['https://example.com/']);

orphans.forEach(({ url, outboundCount }) => {
  console.log(`Orphan page: ${url} (${outboundCount} outbound links)`);
});
// Orphan page: https://example.com/contact (0 outbound links)
```

**Tip:** Cross-reference orphans with your [`@power-seo/sitemap`](https://www.npmjs.com/package/@power-seo/sitemap) URLs. Pages in the sitemap with no inbound links are priority candidates for internal linking.

### How do I generate internal link suggestions?

`suggestLinks` extracts keywords (words of 4+ characters) from each page's content, title, and URL slug, then proposes links between pages whose keyword sets overlap — skipping pairs that already link to each other. Each suggestion carries a `relevanceScore` between 0 and 1 (overlap relative to the target page's keyword set) and anchor text taken from the target's title, falling back to its slug. Suggestions are sorted by relevance and capped by `maxSuggestions` in total.

```ts
import { suggestLinks } from '@power-seo/links';
import type { LinkSuggestion, LinkSuggestionOptions } from '@power-seo/links';

const pages = [
  {
    url: 'https://example.com/guide/react-seo',
    title: 'React SEO Guide',
    content:
      'Learn how to optimize React applications for search engines using meta tags, structured data, and server-side rendering.',
    links: [],
  },
  {
    url: 'https://example.com/guide/meta-tags',
    title: 'HTML Meta Tags Explained',
    content:
      'Meta tags control how search engines index your pages. The title tag and meta description are the most important.',
    links: [],
  },
  {
    url: 'https://example.com/guide/nextjs-setup',
    title: 'Next.js Project Setup',
    content:
      'Set up a Next.js application with TypeScript, ESLint, and Prettier for a production-ready project.',
    links: [],
  },
];

const options: LinkSuggestionOptions = {
  maxSuggestions: 5, // total cap across all pages (default: 20)
  minRelevance: 0.15, // minimum overlap score 0-1 (default: 0.1)
};

const suggestions: LinkSuggestion[] = suggestLinks(pages, options);

suggestions.forEach(({ from, to, anchorText, relevanceScore }) => {
  console.log(`${from} -> ${to}: "${anchorText}" (score: ${relevanceScore})`);
});
```

### How do I calculate PageRank-style link equity scores?

`analyzeLinkEquity` initializes every page at `1/N`, then iterates `score = (1 - d)/N + d * sum(inboundScore / inboundOutboundCount)` for the configured number of iterations (default 20, damping 0.85). Scores are normalized so the top page is `1` (rounded to 3 decimals) and results come back sorted descending. Pages with many inbound links from well-linked pages score highest — use this to spot pages that deserve more internal links.

```ts
import { buildLinkGraph, analyzeLinkEquity } from '@power-seo/links';
import type { LinkEquityScore, LinkEquityOptions } from '@power-seo/links';

const graph = buildLinkGraph(pages);

const options: LinkEquityOptions = {
  damping: 0.85, // PageRank damping factor (default: 0.85)
  iterations: 20, // power-iteration steps (default: 20)
};

const equityScores: LinkEquityScore[] = analyzeLinkEquity(graph, options);

equityScores.forEach(({ url, score, inboundCount }) => {
  console.log(`${url}: equity=${score}, inbound=${inboundCount}`);
});
```

### How do I combine link analysis with a full site audit?

Run the link analysis alongside [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit) and merge the results by URL. `auditSite` returns a `SiteAuditResult` whose `pageResults` array carries one entry per page, so you can enrich each with its equity score and orphan status.

```ts
import { buildLinkGraph, findOrphanPages, analyzeLinkEquity } from '@power-seo/links';
import { auditSite } from '@power-seo/audit';

const graph = buildLinkGraph(pages);
const orphans = findOrphanPages(graph, ['https://example.com/']);
const equity = new Map(analyzeLinkEquity(graph).map((e) => [e.url, e.score]));

const report = auditSite({
  pages: pages.map((p) => ({
    url: p.url,
    title: p.title,
    content: p.content,
    internalLinks: p.links,
  })),
});

const enriched = report.pageResults.map((result) => ({
  ...result,
  linkEquity: equity.get(result.url) ?? 0,
  isOrphan: orphans.some((o) => o.url === result.url),
}));
```

---

## API Reference

### `buildLinkGraph(pages)`

| Parameter | Type         | Default  | Description                                            |
| --------- | ------------ | -------- | ------------------------------------------------------ |
| `pages`   | `PageData[]` | required | Array of pages with their URL and outbound link arrays |

Returns `LinkGraph` — `{ nodes: Map<string, LinkNode>; totalPages: number; totalLinks: number }`. URLs are normalized; relative links are resolved against the page URL; self-links and duplicate edges are skipped.

### `findOrphanPages(graph, entryPoints?)`

| Parameter     | Type        | Default  | Description                                            |
| ------------- | ----------- | -------- | ------------------------------------------------------ |
| `graph`       | `LinkGraph` | required | A directed link graph built by `buildLinkGraph`        |
| `entryPoints` | `string[]`  | `[]`     | URLs to exclude from orphan detection (e.g., homepage) |

Returns `OrphanPage[]` — `{ url, title?, outboundCount }` objects sorted by `outboundCount` descending.

### `suggestLinks(pages, options?)`

| Parameter                | Type         | Default  | Description                                                 |
| ------------------------ | ------------ | -------- | ----------------------------------------------------------- |
| `pages`                  | `PageData[]` | required | Pages with `url`, `links`, and optional `title`/`content`   |
| `options.maxSuggestions` | `number`     | `20`     | Total number of suggestions returned (top N by relevance)   |
| `options.minRelevance`   | `number`     | `0.1`    | Minimum keyword-overlap score (0–1) to include a suggestion |

Returns `LinkSuggestion[]` — `{ from, to, anchorText, relevanceScore }` objects sorted by relevance descending. Returns `[]` when fewer than 2 pages are provided.

### `analyzeLinkEquity(graph, options?)`

| Parameter            | Type        | Default  | Description                                                                    |
| -------------------- | ----------- | -------- | ------------------------------------------------------------------------------ |
| `graph`              | `LinkGraph` | required | A directed link graph built by `buildLinkGraph`                                |
| `options.damping`    | `number`    | `0.85`   | PageRank damping factor — probability of following a link vs. jumping randomly |
| `options.iterations` | `number`    | `20`     | Number of power-iteration steps                                                |

Returns `LinkEquityScore[]` — scores normalized to 0–1 (top page = 1, rounded to 3 decimals), sorted descending.

---

## Types

```ts
import type {
  PageData, // { url: string; links: string[]; title?: string; content?: string }
  LinkNode, // { url: string; inbound: string[]; outbound: string[]; inboundCount: number; outboundCount: number }
  LinkGraph, // { nodes: Map<string, LinkNode>; totalPages: number; totalLinks: number }
  OrphanPage, // { url: string; title?: string; outboundCount: number }
  LinkSuggestion, // { from: string; to: string; anchorText: string; relevanceScore: number }
  LinkSuggestionOptions, // { maxSuggestions?: number; minRelevance?: number }
  LinkEquityScore, // { url: string; score: number; inboundCount: number }
  LinkEquityOptions, // { damping?: number; iterations?: number }
} from '@power-seo/links';
```

---

## Use Cases

- **Content audit tools** — detect orphan pages and prioritize internal linking improvements across your site
- **Headless CMS workflows** — run link analysis after every publish to keep the site graph healthy
- **SEO dashboards** — visualize link equity distribution and identify pages that need more inbound links
- **CI/CD pipelines** — fail builds when orphan pages exceed a threshold you set
- **Content strategy** — use link suggestions to build topical clusters programmatically

---

## Architecture Overview

- **Pure TypeScript** — no compiled binary, no native modules
- **No third-party runtime dependencies** — depends only on `@power-seo/core` for URL and text utilities
- **Framework-agnostic** — works in Next.js, Remix, Vite, Node.js, Edge, or any JS runtime
- **SSR compatible** — no browser-specific APIs; safe for server-side or CLI usage
- **Edge runtime safe** — no Node.js-specific APIs; runs in Cloudflare Workers, Vercel Edge, Deno
- **Tree-shakeable** — `"sideEffects": false` with named exports per function
- **Dual ESM + CJS** — ships both formats via tsup for any bundler or `require()` usage
- **ReDoS-free parsing** — HTML stripping and URL handling in `@power-seo/core` use index-based scanning, not backtracking regexes

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

internal linking, link graph, orphan pages, orphan page detection, link equity, pagerank, internal link suggestions, link analysis, link audit, link structure, seo links, internal links, link building, anchor text, site architecture, crawl depth, typescript seo, nextjs seo, headless cms seo, programmatic seo

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
