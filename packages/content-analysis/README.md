# @power-seo/content-analysis — Yoast-Style SEO Content Scoring Engine for React & Node.js

Keyword-focused content analysis with real-time scoring, readability checks, and actionable feedback — like Yoast SEO, but as a standalone TypeScript library that works anywhere.

[![npm version](https://img.shields.io/npm/v/@power-seo/content-analysis)](https://www.npmjs.com/package/@power-seo/content-analysis)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/content-analysis)](https://www.npmjs.com/package/@power-seo/content-analysis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/content-analysis)

`@power-seo/content-analysis` gives you a complete Yoast-style SEO scoring pipeline for any text content. Feed it a page's title, meta description, body HTML, focus keyphrase, images, and links — get back structured `good` / `improvement` / `error` results for every SEO factor. Run it server-side in a CMS, client-side in a React editor, or inside a CI content quality gate. All checks are individually configurable and tree-shakeable.

> **Zero runtime dependencies** — only `@power-seo/core` as a peer.

## Features

- **Keyphrase density check** — scores optimal 0.5–3% keyword frequency in body copy
- **Keyphrase distribution** — verifies the focus keyword appears in the first 10% of content
- **Title checks** — detects missing titles and keyphrase absence in the `<title>` tag
- **Meta description checks** — validates presence, length (120–158 chars), and keyphrase inclusion
- **Heading structure** — ensures H1 exists and that the keyphrase appears in at least one heading
- **Word count** — flags pages under the 300-word minimum threshold
- **Image alt text** — scans all images for missing alt attributes
- **Image keyphrase** — checks whether at least one image alt contains the focus keyphrase
- **Internal and external link analysis** — verifies outbound and inbound link presence
- **Configurable check suite** — disable any individual check via `disabledChecks` config
- **Framework-agnostic** — works in Next.js, Remix, Gatsby, Vite, vanilla Node.js
- **Full TypeScript support** — complete type definitions for all inputs, outputs, and check IDs
- **Tree-shakeable** — import only the checks you use; zero dead code in your bundle

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Running All Checks at Once](#running-all-checks-at-once)
  - [Running Individual Checks](#running-individual-checks)
  - [Disabling Specific Checks](#disabling-specific-checks)
  - [Using in a React Editor](#using-in-a-react-editor)
- [API Reference](#api-reference)
  - [`analyzeContent()`](#analyzecontent)
  - [Individual Check Functions](#individual-check-functions)
  - [Types](#types)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

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

## Quick Start

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const result = await analyzeContent({
  keyphrase: 'react seo',
  title: 'How to Add SEO to React Apps',
  metaDescription: 'A complete guide to adding SEO meta tags, Open Graph, and structured data in React.',
  bodyHtml: '<h1>React SEO Guide</h1><p>Search engine optimization for React...</p>',
  images: [{ src: '/hero.jpg', alt: 'React SEO diagram' }],
  links: {
    internal: ['https://example.com/blog'],
    external: ['https://developers.google.com/search'],
  },
});

console.log(result.score);   // e.g. 82
console.log(result.results); // array of { id, status, message }
```

## Usage

### Running All Checks at Once

`analyzeContent()` runs all 13 built-in checks and returns an aggregated score (0–100) along with per-check results.

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const output = await analyzeContent({
  keyphrase: 'next.js seo',
  title: 'Next.js SEO Best Practices',
  metaDescription: 'Learn how to optimize your Next.js app for search engines with meta tags and structured data.',
  bodyHtml: htmlString,
  wordCount: 1250,
  images: imageList,
  links: { internal: internalLinks, external: externalLinks },
});

// output.score     → number 0–100
// output.results   → AnalysisResult[]
// output.status    → 'good' | 'improvement' | 'error'
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

const titleResult = checkTitle({ keyphrase: 'react seo', title: 'React SEO Guide' });
// { id: 'title-keyphrase', status: 'good', message: 'Focus keyphrase found in title.' }

const wc = checkWordCount({ wordCount: 250 });
// { id: 'word-count', status: 'improvement', message: 'Word count is below 300 words.' }
```

### Disabling Specific Checks

Pass `config.disabledChecks` to skip checks that don't apply to your content type (e.g. skip image checks on text-only pages):

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const output = await analyzeContent(input, {
  disabledChecks: ['image-alt', 'image-keyphrase', 'external-links'],
});
```

### Using in a React Editor

Integrate live scoring into a content editor — re-run analysis on every keystroke or debounced change:

```tsx
import { useState, useEffect } from 'react';
import { analyzeContent } from '@power-seo/content-analysis';
import type { ContentAnalysisOutput } from '@power-seo/content-analysis';

function SeoScorePanel({ content }: { content: EditorContent }) {
  const [analysis, setAnalysis] = useState<ContentAnalysisOutput | null>(null);

  useEffect(() => {
    analyzeContent({
      keyphrase: content.keyphrase,
      title: content.title,
      metaDescription: content.description,
      bodyHtml: content.html,
    }).then(setAnalysis);
  }, [content]);

  if (!analysis) return null;

  return (
    <div>
      <p>SEO Score: {analysis.score}/100</p>
      {analysis.results.map((r) => (
        <div key={r.id} className={`check-${r.status}`}>
          {r.message}
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### `analyzeContent()`

```ts
function analyzeContent(
  input: ContentAnalysisInput,
  config?: AnalysisConfig
): Promise<ContentAnalysisOutput>
```

#### `ContentAnalysisInput`

| Prop | Type | Description |
|------|------|-------------|
| `keyphrase` | `string` | Focus keyphrase to analyze against |
| `title` | `string` | Page `<title>` content |
| `metaDescription` | `string` | Meta description content |
| `bodyHtml` | `string` | Full body HTML string |
| `wordCount` | `number` | Pre-computed word count (optional; auto-detected from `bodyHtml` if omitted) |
| `images` | `Array<{src: string; alt?: string}>` | Images found on the page |
| `links` | `{internal: string[]; external: string[]}` | Internal and external link URLs |

#### `ContentAnalysisOutput`

| Field | Type | Description |
|-------|------|-------------|
| `score` | `number` | Aggregate score 0–100 |
| `status` | `AnalysisStatus` | `'good'` (≥70) \| `'improvement'` (≥40) \| `'error'` (<40) |
| `results` | `AnalysisResult[]` | Per-check results |

#### `AnalysisResult`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `CheckId` | Unique check identifier |
| `status` | `AnalysisStatus` | `'good'` \| `'improvement'` \| `'error'` |
| `message` | `string` | Human-readable feedback |

### Individual Check Functions

| Function | Checks For |
|----------|-----------|
| `checkTitle(input)` | Title presence and keyphrase inclusion |
| `checkMetaDescription(input)` | Description presence, length, keyphrase |
| `checkKeyphraseUsage(input)` | Density (0.5–3%) and distribution |
| `checkHeadings(input)` | H1 existence and keyphrase in headings |
| `checkWordCount(input)` | Minimum 300-word threshold |
| `checkImages(input)` | Alt text presence and keyphrase in alt |
| `checkLinks(input)` | Internal and external link presence |

### Types

| Type | Description |
|------|-------------|
| `CheckId` | Union of all 13 built-in check IDs |
| `AnalysisConfig` | `{ disabledChecks?: CheckId[] }` |
| `AnalysisStatus` | `'good' \| 'improvement' \| 'error'` |
| `ContentAnalysisInput` | Input shape for `analyzeContent()` |
| `ContentAnalysisOutput` | Output shape from `analyzeContent()` |

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
