# @power-seo/links

![links banner](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/banner.svg)

Build a directed link graph from your site's pages, detect orphan pages with zero inbound links, generate keyword-overlap-based link suggestions, and score link equity with a PageRank-style algorithm.

[![npm version](https://img.shields.io/npm/v/@power-seo/links)](https://www.npmjs.com/package/@power-seo/links)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/links)](https://www.npmjs.com/package/@power-seo/links)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/links)](https://socket.dev/npm/package/@power-seo/links)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/links)

`@power-seo/links` gives you a complete internal linking intelligence layer for your SEO tooling. Internal link structure is one of the most actionable on-page SEO signals — it determines how search engines discover and understand your content, and how link equity flows through your site. Yet most SEO tools treat it as a secondary concern. This package makes it a first-class concern.

Given a list of pages and their outbound links, `buildLinkGraph` constructs a full directed graph in memory. From that graph you can immediately find orphan pages (pages that no other page links to — invisible to crawlers that start from the homepage), compute PageRank-style equity scores to understand which pages accumulate the most link authority, and generate contextual internal link suggestions based on keyword and topic overlap between pages.

The package is designed to integrate directly with `@power-seo/audit` for site-wide SEO audits, and with `@power-seo/analytics` for correlating link equity with traffic data. It is dependency-free, fully typed, and tree-shakeable.

> **Zero dependencies** — no runtime dependencies; pure TypeScript computation.

---

## Why @power-seo/links?

| | Without | With |
|---|---|---|
| Orphan detection | ❌ Manual crawl | ✅ `findOrphanPages()` in-memory graph |
| Link suggestions | ❌ Guesswork | ✅ Keyword-overlap-based contextual suggestions |
| Link equity | ❌ Third-party tools | ✅ PageRank-style scoring built-in |
| Graph construction | ❌ Build from scratch | ✅ `buildLinkGraph()` — directed graph in one call |
| Audit integration | ❌ Separate toolchain | ✅ Designed to integrate with `@power-seo/audit` |
| TypeScript support | ❌ Untyped | ✅ Full type coverage for all graph structures |
| Zero dependencies | ❌ External libs | ✅ Pure TypeScript, no runtime dependencies |

![Links Comparison](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/comparison.svg)


<p align="left">
  <a href="https://www.buymeacoffee.com/ccbd.dev" target="_blank">
    <img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=ccbd.dev&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" />
  </a>
</p>

---

## Features

- **Directed link graph construction** — `buildLinkGraph(pages)` builds an in-memory directed graph from page URL arrays, computing both outbound and inbound link sets for each node
- **Orphan page detection** — `findOrphanPages(graph)` returns all pages that have zero inbound internal links, making them invisible to crawlers following links from the homepage
- **Keyword-overlap link suggestions** — `suggestLinks(pages, options?)` compares page titles and content to find thematically related pages that should be linking to each other but are not
- **PageRank-style link equity scoring** — `analyzeLinkEquity(graph, options?)` runs a damping-factor iterative algorithm to assign a relative equity score to every node in the graph
- **Configurable suggestion options** — control minimum similarity threshold, maximum suggestions per page, and whether to include bidirectional suggestions
- **Configurable equity options** — set the damping factor (default 0.85), number of iterations, and convergence threshold for the PageRank algorithm
- **Inbound and outbound link counts** — every `LinkNode` in the graph exposes both `inbound` and `outbound` arrays plus `inboundCount` and `outboundCount` for direct inspection
- **Normalized URL handling** — URLs are normalized before graph construction to prevent duplicate nodes from trailing slashes or case differences
- **Zero dependencies** — no runtime dependencies; pure TypeScript computation

![Link Dashboard UI](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/dashboard-ui.svg)

---

## Comparison

| Feature | @power-seo/links | Screaming Frog | Ahrefs | Custom scripts |
| --- | :---: | :---: | :---: | :---: |
| Programmatic link graph | ✅ | ❌ | ❌ | Manual |
| Orphan page detection | ✅ | ✅ | ✅ | Manual |
| Keyword-based suggestions | ✅ | ❌ | ❌ | Manual |
| PageRank-style equity | ✅ | ❌ | ✅ | Manual |
| Audit integration | ✅ | ❌ | ❌ | — |
| Zero dependencies | ✅ | ❌ | ❌ | — |
| TypeScript-first | ✅ | ❌ | ❌ | — |
| Tree-shakeable | ✅ | ❌ | ❌ | — |

![Link Equity Accuracy](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/equity-accuracy.svg)

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

---

## Quick Start

```ts
import { buildLinkGraph, findOrphanPages, suggestLinks, analyzeLinkEquity } from '@power-seo/links';

// 1. Build the graph from your site's pages
const graph = buildLinkGraph([
  { url: 'https://example.com/', links: ['https://example.com/about', 'https://example.com/blog'] },
  { url: 'https://example.com/about', links: ['https://example.com/'] },
  { url: 'https://example.com/blog', links: ['https://example.com/'] },
  { url: 'https://example.com/orphan', links: [] },
]);

// 2. Find pages no other page links to
const orphans = findOrphanPages(graph);
// [{ url: 'https://example.com/orphan', title: undefined, outboundCount: 0 }]

// 3. Get link equity scores
const equityScores = analyzeLinkEquity(graph);
// [{ url: 'https://example.com/', score: 0.48, inboundCount: 2 }, { url: 'https://example.com/about', score: 0.18, inboundCount: 1 }, ...]
```

![Orphan Detection Benefit](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/links/orphan-benefit.svg)

---

## Usage

### Build a Link Graph

`buildLinkGraph` accepts an array of `PageData` objects and returns a `LinkGraph` — a `Map<string, LinkNode>` keyed by normalized URL. Each `LinkNode` contains the page's URL, its set of outbound links, and the set of pages that link to it (inbound links).

```ts
import { buildLinkGraph } from '@power-seo/links';
import type { PageData, LinkGraph } from '@power-seo/links';

const pages: PageData[] = [
  {
    url: 'https://example.com/',
    links: ['https://example.com/blog', 'https://example.com/about', 'https://example.com/contact'],
  },
  {
    url: 'https://example.com/blog',
    links: [
      'https://example.com/',
      'https://example.com/blog/post-1',
      'https://example.com/blog/post-2',
    ],
  },
  {
    url: 'https://example.com/blog/post-1',
    links: ['https://example.com/blog'],
  },
  {
    url: 'https://example.com/blog/post-2',
    links: ['https://example.com/blog', 'https://example.com/blog/post-1'],
  },
  {
    url: 'https://example.com/about',
    links: ['https://example.com/'],
  },
  {
    url: 'https://example.com/contact',
    links: [],
  },
];

const graph: LinkGraph = buildLinkGraph(pages);

// Inspect a node
const blogNode = graph.nodes.get('https://example.com/blog');
console.log(blogNode?.inbound); // ['https://example.com/']
console.log(blogNode?.inboundCount); // 1
console.log(blogNode?.outbound); // ['https://example.com/', ...]
console.log(blogNode?.outboundCount); // ...
```

### Find Orphan Pages

`findOrphanPages` iterates the graph and returns all nodes whose `inboundCount` is zero. These pages cannot be reached by following links from any other page — making them effectively invisible to Googlebot unless they appear in your sitemap.

```ts
import { buildLinkGraph, findOrphanPages } from '@power-seo/links';
import type { OrphanPage } from '@power-seo/links';

const graph = buildLinkGraph(pages);
const orphans: OrphanPage[] = findOrphanPages(graph);

orphans.forEach(({ url, outboundCount }) => {
  console.log(`Orphan page: ${url} (${outboundCount} outbound links)`);
});

// Example output:
// Orphan page: https://example.com/contact (0 outbound links)
```

**Tip:** Cross-reference orphan pages with your sitemap. Pages that appear in the sitemap but have no inbound links are priority candidates for internal linking improvements.

### Generate Link Suggestions

`suggestLinks` analyzes page titles and content to find pairs of pages that share significant topical overlap but do not currently link to each other. It uses a term-frequency-based similarity algorithm that does not require an external NLP library.

```ts
import { suggestLinks } from '@power-seo/links';
import type { LinkSuggestion, LinkSuggestionOptions } from '@power-seo/links';

const pages = [
  {
    url: '/guide/react-seo',
    title: 'React SEO Guide',
    content:
      'Learn how to optimize React applications for search engines using meta tags, structured data, and server-side rendering.',
  },
  {
    url: '/guide/meta-tags',
    title: 'HTML Meta Tags Explained',
    content:
      'Meta tags control how search engines index your pages. The title tag and meta description are the most important.',
  },
  {
    url: '/guide/nextjs-setup',
    title: 'Next.js Project Setup',
    content:
      'Set up a Next.js application with TypeScript, ESLint, and Prettier for a production-ready project.',
  },
];

const options: LinkSuggestionOptions = {
  maxSuggestions: 3, // optional — cap suggestions per page (default: 20)
  minRelevance: 0.15, // optional — minimum overlap score 0-1 (default: 0.1)
};

const suggestions: LinkSuggestion[] = suggestLinks(pages, options);

suggestions.forEach(({ from, to, anchorText, relevanceScore }) => {
  console.log(`Link from ${from} to ${to}`);
  console.log(`  Suggested anchor: "${anchorText}" (score: ${relevanceScore.toFixed(2)})`);
});
```

### Analyze Link Equity

`analyzeLinkEquity` runs a PageRank-style iterative algorithm over the graph and returns a `LinkEquityScore[]` array assigning each page a normalized equity score, sorted by score in descending order. Pages with many high-quality inbound links receive higher scores.

```ts
import { buildLinkGraph, analyzeLinkEquity } from '@power-seo/links';
import type { LinkEquityScore, LinkEquityOptions } from '@power-seo/links';

const graph = buildLinkGraph(pages);

const options: LinkEquityOptions = {
  damping: 0.85, // optional — PageRank damping factor (default: 0.85)
  iterations: 20, // optional — max iterations (default: 20)
};

const equityScores = analyzeLinkEquity(graph, options);

// Sort pages by equity score (highest first)
const ranked = equityScores.sort((a, b) => b.score - a.score);

ranked.forEach(({ url, score, inboundCount }) => {
  console.log(`${url}: equity=${score.toFixed(4)}, inbound=${inboundCount}`);
});
```

### Integration with Audit

Combine `@power-seo/links` with `@power-seo/audit` to surface link issues as part of a full site audit.

```ts
import { buildLinkGraph, findOrphanPages, analyzeLinkEquity } from '@power-seo/links';
import { auditSite } from '@power-seo/audit';

const graph = buildLinkGraph(sitePages);
const orphans = findOrphanPages(graph);
const equityScores = analyzeLinkEquity(graph);
const equityMap = new Map(equityScores.map((eq) => [eq.url, eq]));

const auditReport = auditSite({ pages: sitePages });

// Enrich audit results with link equity data
const enrichedPages = auditReport.pages.map((page) => ({
  ...page,
  linkEquity: equityMap.get(page.url)?.score ?? 0,
  isOrphan: orphans.some((o) => o.url === page.url),
}));
```

---

## API Reference

### `buildLinkGraph(pages)`

| Parameter | Type         | Default  | Description                                            |
| --------- | ------------ | -------- | ------------------------------------------------------ |
| `pages`   | `PageData[]` | required | Array of pages with their URL and outbound link arrays |

Returns `LinkGraph` — object with `nodes: Map<string, LinkNode>`, `totalPages: number`, `totalLinks: number`.

---

### `findOrphanPages(graph, entryPoints?)`

| Parameter    | Type          | Default | Description                                                    |
| ------------ | ------------- | ------- | -------------------------------------------------------------- |
| `graph`      | `LinkGraph`   | required | A directed link graph built by `buildLinkGraph`                |
| `entryPoints` | `string[]`   | `[]`    | URLs to exclude from orphan detection (e.g., homepage)         |

Returns `OrphanPage[]` — array of `{ url: string; title?: string; outboundCount: number }` objects.

---

### `suggestLinks(pages, options?)`

| Parameter              | Type         | Default | Description                                                    |
| ---------------------- | ------------ | ------- | -------------------------------------------------------------- |
| `pages`                | `PageData[]` | required | Pages with `url`, `title`, and `content` for analysis          |
| `options.minRelevance` | `number`     | `0.1`   | Minimum keyword overlap score (0–1) to include a suggestion    |
| `options.maxSuggestions` | `number`   | `20`    | Maximum number of suggestions returned per source page         |

Returns `LinkSuggestion[]` — array of `{ from, to, anchorText, relevanceScore }` objects.

---

### `analyzeLinkEquity(graph, options?)`

| Parameter             | Type        | Default | Description                                                                    |
| --------------------- | ----------- | ------- | ------------------------------------------------------------------------------ |
| `graph`               | `LinkGraph` | required | A directed link graph built by `buildLinkGraph`                                |
| `options.damping`     | `number`    | `0.85`  | PageRank damping factor — probability of following a link vs. jumping randomly |
| `options.iterations`  | `number`    | `20`    | Maximum number of power-iteration steps                                        |

Returns `LinkEquityScore[]` — array sorted by score descending.

---

### Types

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
- **Headless CMS** — run link analysis after every publish to keep the site graph healthy
- **SEO dashboards** — visualize link equity distribution and identify pages that need more inbound links
- **CI/CD pipelines** — fail builds when orphan pages exceed a configurable threshold
- **Content strategy** — use link suggestions to build topical clusters automatically

---

## Architecture Overview

- **Pure TypeScript** — no compiled binary, no native modules
- **Zero dependencies** — no runtime dependencies; pure TypeScript computation
- **Framework-agnostic** — works in Next.js, Remix, Vite, Node.js, Edge, or any JS runtime
- **SSR compatible** — no browser-specific APIs; safe for server-side or CLI usage
- **Edge runtime safe** — no Node.js-specific APIs; runs in Cloudflare Workers, Vercel Edge, Deno
- **Tree-shakeable** — `"sideEffects": false` with named exports per function
- **Dual ESM + CJS** — ships both formats via tsup for any bundler or `require()` usage

---

## Supply Chain Security

- No install scripts (`postinstall`, `preinstall`)
- No runtime network access
- No `eval` or dynamic code execution
- CI-signed builds — all releases published via verified `github.com/CyberCraftBD/power-seo` workflow
- Safe for SSR, Edge, and server environments

---

## The [@power-seo](https://www.npmjs.com/org/power-seo) Ecosystem

All 17 packages are independently installable — use only what you need.

| Package                                                                                    | Install                             | Description                                                             |
| ------------------------------------------------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------- |
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core)                         | `npm i @power-seo/core`             | Framework-agnostic utilities, types, validators, and constants          |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react)                       | `npm i @power-seo/react`            | React SEO components — meta, Open Graph, Twitter Card, breadcrumbs      |
| [`@power-seo/meta`](https://www.npmjs.com/package/@power-seo/meta)                         | `npm i @power-seo/meta`             | SSR meta helpers for Next.js App Router, Remix v2, and generic SSR      |
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema)                     | `npm i @power-seo/schema`           | Type-safe JSON-LD structured data — 23 builders + 22 React components   |
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

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
