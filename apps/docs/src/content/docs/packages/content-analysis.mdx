# @power-seo/content-analysis

![content-analysis banner](../../image/content-analysis/banner.svg)

Keyword-focused content analysis with real-time scoring, readability checks, and actionable feedback — like Yoast SEO, but as a standalone TypeScript library that works anywhere.

[![npm version](https://img.shields.io/npm/v/@power-seo/content-analysis)](https://www.npmjs.com/package/@power-seo/content-analysis)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/content-analysis)](https://www.npmjs.com/package/@power-seo/content-analysis)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/content-analysis)](https://socket.dev/npm/package/@power-seo/content-analysis)
[![npm provenance](https://img.shields.io/badge/npm-provenance-enabled-blue)](https://github.com/CyberCraftBD/power-seo/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/content-analysis)

`@power-seo/content-analysis` delivers a comprehensive, WordPress SEO plugin–style scoring pipeline for evaluating text content, comparable to Yoast SEO, All in One SEO (AIOSEO), Rank Math, SEOPress, and The SEO Framework. Provide a page title, meta description, body content, focus keyphrase, images, and links — get back structured `good` / `ok` / `poor` results across all critical SEO factors. Run it server-side in a CMS, client-side in a React editor, or inside a CI content quality gate. All 13 analysis checks are fully configurable and tree-shakeable.

> **Zero external runtime dependencies** — `@power-seo/core` is a direct dependency bundled with this package; no extra install needed.

---

## Why @power-seo/content-analysis?

| | Without | With |
|---|---|---|
| Keyphrase check | ❌ Manual grep | ✅ Density + distribution scoring |
| Title validation | ❌ Eye-check only | ✅ Presence, length, keyphrase match |
| Meta description | ❌ Unchecked | ✅ Length (120–160 chars) + keyphrase |
| Heading structure | ❌ Missed H1s | ✅ H1 hierarchy + keyphrase in subheadings |
| Image alt text | ❌ Skipped | ✅ Alt presence + keyphrase in alt |
| Link analysis | ❌ Unknown | ✅ Internal + external link presence |
| SEO score | ❌ Guesswork | ✅ Aggregate score with per-check breakdown |
| Framework support | ❌ WordPress-only | ✅ Next.js, Remix, Vite, Node.js, Edge |

![SEO Score Dashboard](../../image/content-analysis/comparison.svg)

---

## Features

- **Keyphrase density check** — scores optimal 0.5–2.5% keyword frequency in body copy
- **Keyphrase distribution** — verifies the focus keyword appears in intro, headings, slug, and image alt
- **Title checks** — detects missing titles and keyphrase absence in the `<title>` tag
- **Meta description checks** — validates presence, length (120–160 chars), and keyphrase inclusion
- **Heading structure** — validates H1 existence, hierarchy, and keyphrase in subheadings
- **Word count** — flags pages under 300 words (good at 1,000+)
- **Image alt text** — scans all images for missing alt attributes
- **Image keyphrase** — checks whether at least one image alt contains the focus keyphrase
- **Internal and external link analysis** — verifies inbound and outbound link presence
- **Per-check disable config** — skip irrelevant checks via `disabledChecks` config
- **React components** — pre-built `ScorePanel`, `CheckList`, and `ContentAnalyzer` UI components
- **Framework-agnostic** — works in Next.js, Remix, Gatsby, Vite, vanilla Node.js, Edge
- **Full TypeScript support** — complete type definitions for all inputs, outputs, and check IDs
- **Tree-shakeable** — import only the checks you use; zero dead code in your bundle

![Content Analyzer Editor UI](../../image/content-analysis/editor-ui.svg)

---

## Comparison

| Feature                        | @power-seo/content-analysis | Yoast SEO | next-seo | seo-analyzer | react-helmet |
| ------------------------------ | :-------------------------: | :-------: | :------: | :----------: | :----------: |
| Keyphrase density check        | ✅                          | ✅        | ❌       | Partial      | ❌           |
| Keyphrase distribution         | ✅                          | ✅        | ❌       | ❌           | ❌           |
| Title + meta validation        | ✅                          | ✅        | ❌       | Partial      | ❌           |
| Heading structure check        | ✅                          | ✅        | ❌       | ❌           | ❌           |
| Image alt + keyphrase check    | ✅                          | ✅        | ❌       | ❌           | ❌           |
| Internal / external link check | ✅                          | ✅        | ❌       | ❌           | ❌           |
| Aggregate SEO score            | ✅                          | ✅        | ❌       | Partial      | ❌           |
| Per-check disable config       | ✅                          | ❌        | ❌       | ❌           | ❌           |
| Works outside WordPress        | ✅                          | ❌        | ✅       | ✅           | ✅           |
| TypeScript-first               | ✅                          | ❌        | Partial  | ❌           | ❌           |
| Tree-shakeable                 | ✅                          | ❌        | Partial  | ❌           | ❌           |
| React UI components            | ✅                          | ✅        | ❌       | ❌           | ❌           |
| CI / Node.js usage             | ✅                          | ❌        | ❌       | ✅           | ❌           |
| Zero runtime dependencies      | ✅                          | ❌        | ❌       | ❌           | ❌           |

![Checks Accuracy](../../image/content-analysis/checks-accuracy.svg)

---

## Installation

```bash
npm install @power-seo/content-analysis
```

```bash
yarn add @power-seo/content-analysis
```

```bash
pnpm add @power-seo/content-analysis
```

---

## Quick Start

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const result = analyzeContent({
  title: 'Best Running Shoes for Beginners',
  metaDescription: 'Discover the best running shoes for beginners with our expert guide.',
  focusKeyphrase: 'running shoes for beginners',
  content: '<h1>Best Running Shoes</h1><p>Finding the right running shoes...</p>',
});

console.log(result.score);      // e.g. 38
console.log(result.maxScore);   // e.g. 55
console.log(result.results);
// [{ id: 'title-presence', status: 'good', description: '...', score: 5, maxScore: 5 }, ...]
```

![Yoast Replacement Benefit](../../image/content-analysis/yoast-replacement-benefit.svg)

**Status thresholds (per check):**
- `good` — check fully passes
- `ok` — check partially passes
- `poor` — check fails

---

## Usage

### Running All Checks at Once

`analyzeContent()` runs all 13 built-in checks and returns an aggregated status along with per-check results.

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const output = analyzeContent({
  title: 'Next.js SEO Best Practices',
  metaDescription: 'Learn how to optimize your Next.js app for search engines with meta tags and structured data.',
  focusKeyphrase: 'next.js seo',
  content: htmlString,
  images: imageList,
  internalLinks: internalLinks,
  externalLinks: externalLinks,
});

// output.score      → number (sum of all check scores)
// output.maxScore   → number (maximum possible score)
// output.results    → AnalysisResult[]
```

### Running Individual Checks

Each check is exported as a standalone function — useful when you want to run only a subset of the analysis.

```ts
import {
  checkTitle,
  checkMetaDescription,
  checkKeyphraseUsage,
  checkHeadings,
  checkWordCount,
  checkImages,
  checkLinks,
} from '@power-seo/content-analysis';

const titleResults = checkTitle({
  content: '',
  title: 'React SEO Guide',
  focusKeyphrase: 'react seo',
});
// [
//   { id: 'title-presence', title: 'SEO title', description: '...', status: 'good', score: 5, maxScore: 5 },
//   { id: 'title-keyphrase', title: 'Keyphrase in title', description: '...', status: 'good', score: 5, maxScore: 5 }
// ]

const wcResult = checkWordCount({ content: shortHtml });
// { id: 'word-count', title: 'Word count', description: 'The content is 180 words...', status: 'poor', score: 1, maxScore: 5 }
```

### Disabling Specific Checks

Pass `config.disabledChecks` to exclude specific checks from the output. Checks are still executed internally but their results are filtered from `output.results` and excluded from `score`/`maxScore` totals. Invalid check IDs are silently ignored.

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const output = analyzeContent(input, {
  disabledChecks: ['image-alt', 'image-keyphrase', 'external-links'],
});
```

### React Components

Import from the `/react` entry point for pre-built analysis UI components:

```tsx
import { ContentAnalyzer, ScorePanel, CheckList } from '@power-seo/content-analysis/react';
import { analyzeContent } from '@power-seo/content-analysis';
import type { ContentAnalysisInput } from '@power-seo/content-analysis';

// All-in-one component
function Editor({ input }: { input: ContentAnalysisInput }) {
  return <ContentAnalyzer input={input} />;
}

// Or compose individually
function SeoPanel({ input }: { input: ContentAnalysisInput }) {
  const result = analyzeContent(input);
  return (
    <>
      <ScorePanel score={result.score} maxScore={result.maxScore} />
      <CheckList results={result.results} />
    </>
  );
}
```

### Inside a CI Content Quality Gate

Block deploys when SEO checks fail:

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const output = analyzeContent({ title, metaDescription, focusKeyphrase, content });

const failures = output.results.filter((r) => r.status === 'poor');

if (failures.length > 0) {
  console.error('SEO checks failed:');
  failures.forEach((r) => console.error(' ✗', r.description));
  process.exit(1);
}
```

---

## API Reference

### Entry Points

| Import | Description |
| --- | --- |
| `@power-seo/content-analysis` | Core analyzer and individual check functions |
| `@power-seo/content-analysis/react` | React components for analysis UI |

### `analyzeContent()`

```ts
function analyzeContent(
  input: ContentAnalysisInput,
  config?: AnalysisConfig,
): ContentAnalysisOutput;
```

#### `ContentAnalysisInput`

| Prop              | Type                                   | Required | Description                                    |
| ----------------- | -------------------------------------- | -------- | ---------------------------------------------- |
| `content`         | `string`                               | ✅       | Body HTML string                               |
| `title`           | `string`                               | —        | Page `<title>` content                         |
| `metaDescription` | `string`                               | —        | Meta description content                       |
| `focusKeyphrase`  | `string`                               | —        | Focus keyphrase to analyze against             |
| `slug`            | `string`                               | —        | URL slug (used for keyphrase-in-slug check)    |
| `images`          | `Array<{ src: string; alt?: string }>` | —        | Images found on the page                       |
| `internalLinks`   | `string[]`                             | —        | Internal link URLs                             |
| `externalLinks`   | `string[]`                             | —        | External link URLs                             |

#### `ContentAnalysisOutput`

| Field             | Type               | Description                                           |
| ----------------- | ------------------ | ----------------------------------------------------- |
| `score`           | `number`           | Sum of all individual check scores                    |
| `maxScore`        | `number`           | Maximum possible score (varies by enabled checks)     |
| `results`         | `AnalysisResult[]` | Per-check results                                     |
| `recommendations` | `string[]`         | Descriptions from all failed or partial checks        |

#### `AnalysisResult`

| Field         | Type             | Description                                               |
| ------------- | ---------------- | --------------------------------------------------------- |
| `id`          | `string`         | Unique check identifier (one of the `CheckId` values)     |
| `title`       | `string`         | Short display label for the check (e.g. `"SEO title"`)    |
| `description` | `string`         | Human-readable actionable feedback                        |
| `status`      | `AnalysisStatus` | `'good'` \| `'ok'` \| `'poor'`                            |
| `score`       | `number`         | Points earned for this check                              |
| `maxScore`    | `number`         | Maximum points for this check                             |

#### `AnalysisConfig`

| Field            | Type        | Description                               |
| ---------------- | ----------- | ----------------------------------------- |
| `disabledChecks` | `CheckId[]` | List of check IDs to skip during analysis |

### Individual Check Functions

| Function                      | Check ID(s)                                                    | Checks For                                                                                  |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `checkTitle(input)`           | `title-presence`, `title-keyphrase`                            | Title presence **and** length (50–60 chars, validated inside `title-presence`), keyphrase    |
| `checkMetaDescription(input)` | `meta-description-presence`, `meta-description-keyphrase`      | Description presence, length (120–160 chars), keyphrase                                     |
| `checkKeyphraseUsage(input)`  | `keyphrase-density`, `keyphrase-distribution`                  | Density (0.5–2.5%) and occurrence in key areas                                              |
| `checkHeadings(input)`        | `heading-structure`, `heading-keyphrase`                       | H1 presence, hierarchy, keyphrase in subheadings                                            |
| `checkWordCount(input)`       | `word-count`                                                   | Min 300 words (good at 1,000+)                                                              |
| `checkImages(input)`          | `image-alt`, `image-keyphrase`                                 | Alt text presence and keyphrase in alt                                                      |
| `checkLinks(input)`           | `internal-links`, `external-links`                             | Internal and external link presence                                                         |

> **Note:** There is no separate `title-length` check ID. Title length validation (50–60 chars) is evaluated inside the `title-presence` check — a title that exists but is outside the recommended range returns `status: 'ok'` rather than `'good'`.

### Types

| Type                    | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `CheckId`               | Union of all 13 built-in check IDs                        |
| `AnalysisConfig`        | `{ disabledChecks?: CheckId[] }`                          |
| `AnalysisStatus`        | `'good' \| 'ok' \| 'poor'`                               |
| `ContentAnalysisInput`  | Input shape for `analyzeContent()`                        |
| `ContentAnalysisOutput` | Output shape from `analyzeContent()`                      |
| `AnalysisResult`        | Single check result with id, title, description, status, score, maxScore |

---

## Use Cases

- **Headless CMS** — score content as editors write, before publishing
- **Next.js / Remix apps** — run analysis server-side per route and expose scores in admin dashboards
- **SaaS landing pages** — enforce SEO quality programmatically across all marketing pages
- **eCommerce product pages** — validate product titles, descriptions, and image alt text at scale
- **Blog platforms** — provide real-time Yoast-style feedback in the post editor
- **CI/CD content gates** — block deploys when SEO checks fail

---

## Architecture Overview

- **Pure TypeScript** — no compiled binary, no native modules
- **Zero external runtime dependencies** — `@power-seo/core` ships as a direct dependency, no separate install
- **Framework-agnostic** — works in any JavaScript environment
- **SSR compatible** — safe to run in Next.js Server Components, Remix loaders, or Express handlers
- **Edge runtime safe** — no Node.js-specific APIs; runs in Cloudflare Workers, Vercel Edge, Deno
- **Tree-shakeable** — `"sideEffects": false` with named exports per check function
- **Dual ESM + CJS** — ships both formats via tsup for any bundler or `require()` usage

---

## Supply Chain Security

- No install scripts (`postinstall`, `preinstall`)
- No runtime network access
- No `eval` or dynamic code execution
- npm provenance enabled — every release is signed via Sigstore through GitHub Actions
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
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema)                     | `npm i @power-seo/schema`           | Type-safe JSON-LD structured data — 23 builders + 21 React components   |
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
