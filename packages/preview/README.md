# @power-seo/preview — SERP, Open Graph & Twitter Card Preview Generators for TypeScript

Generate pixel-accurate previews of how your pages appear in Google search results, social media link cards, and Twitter/X — without a headless browser.

[![npm version](https://img.shields.io/npm/v/@power-seo/preview)](https://www.npmjs.com/package/@power-seo/preview)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/preview)](https://www.npmjs.com/package/@power-seo/preview)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/preview)

`@power-seo/preview` computes exactly how a search result snippet, Open Graph card, or Twitter Card will render — including pixel-width-aware truncation using real character width tables. Feed it your title, description, URL, and images; get back structured preview data with truncated display strings, validation warnings, and image constraint results. Drop the output into your own UI components, or pipe it into a CMS preview panel.

> **Zero runtime dependencies** — pure computation, no canvas, no browser.

## Features

- **Google SERP preview** — truncates title to 600px and description to 920px using character pixel-width tables
- **Open Graph card preview** — validates image dimensions (1200×630 recommended), generates display strings for title, description, domain
- **Twitter/X Card preview** — supports `summary` and `summary_large_image` card types with image validation
- **Pixel-accurate truncation** — `truncateAtPixelWidth()` uses proportional character widths, not character counts
- **Image constraint validation** — warns when OG images are too small, too large, or wrong aspect ratio
- **Structured output** — returns ready-to-render data objects, not HTML strings
- **Framework-agnostic** — works in React, Vue, Svelte, server-side Node.js, and edge runtimes
- **Full TypeScript types** — complete type definitions for all inputs, outputs, and validation results
- **Tree-shakeable** — import only the preview generators you use

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [SERP Preview](#serp-preview)
  - [Open Graph Preview](#open-graph-preview)
  - [Twitter Card Preview](#twitter-card-preview)
  - [Pixel-Width Truncation](#pixel-width-truncation)
- [API Reference](#api-reference)
  - [`generateSerpPreview()`](#generateserppreview)
  - [`generateOgPreview()`](#generateogpreview)
  - [`generateTwitterPreview()`](#generatetwitterpreview)
  - [`truncateAtPixelWidth()`](#truncateatpixelwidth)
  - [Types](#types)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
npm install @power-seo/preview
```

```bash
yarn add @power-seo/preview
```

```bash
pnpm add @power-seo/preview
```

## Quick Start

```ts
import { generateSerpPreview, generateOgPreview } from '@power-seo/preview';

// Google SERP snippet
const serp = generateSerpPreview({
  title: 'How to Add SEO to React Apps — Complete Guide',
  description: 'Learn how to add meta tags, Open Graph, Twitter Cards, and JSON-LD structured data to any React application.',
  url: 'https://example.com/blog/react-seo',
});

console.log(serp.title.display);       // truncated title (≤600px)
console.log(serp.description.display); // truncated description (≤920px)
console.log(serp.breadcrumb);          // 'example.com › blog › react-seo'

// Open Graph card
const og = generateOgPreview({
  title: 'React SEO Guide',
  description: 'Complete SEO for React',
  url: 'https://example.com/blog/react-seo',
  image: { url: 'https://example.com/og.jpg', width: 1200, height: 630 },
});

console.log(og.image.validation.valid); // true
```

## Usage

### SERP Preview

```ts
import { generateSerpPreview } from '@power-seo/preview';

const preview = generateSerpPreview({
  title: 'Your Page Title Here',
  description: 'Your meta description — aim for 120–158 characters.',
  url: 'https://example.com/your-page',
});

// preview.title.display      → truncated at 600px
// preview.title.isTruncated  → boolean
// preview.description.display
// preview.description.isTruncated
// preview.breadcrumb         → 'example.com › your-page'
// preview.url                → canonical form
```

### Open Graph Preview

```ts
import { generateOgPreview } from '@power-seo/preview';

const og = generateOgPreview({
  title: 'Article Title',
  description: 'Article description for social sharing.',
  url: 'https://example.com/article',
  siteName: 'My Site',
  image: {
    url: 'https://example.com/og-image.jpg',
    width: 1200,
    height: 630,
  },
});

// og.title          → display title (trimmed)
// og.description    → display description
// og.domain         → 'example.com'
// og.image.url      → image URL
// og.image.validation → { valid, warnings[] }
```

### Twitter Card Preview

```ts
import { generateTwitterPreview } from '@power-seo/preview';

const card = generateTwitterPreview({
  cardType: 'summary_large_image',
  title: 'Article Title',
  description: 'Description for Twitter.',
  site: '@mysite',
  image: { url: 'https://example.com/twitter.jpg', width: 1200, height: 628 },
});

// card.cardType     → 'summary_large_image'
// card.title        → truncated to Twitter limits
// card.description  → truncated to Twitter limits
// card.image.validation → { valid, warnings[] }
```

### Pixel-Width Truncation

Use the lower-level `truncateAtPixelWidth()` when you need to truncate arbitrary strings at a given pixel budget:

```ts
import { truncateAtPixelWidth } from '@power-seo/preview';

const result = truncateAtPixelWidth('My very long title that might overflow...', 600);
// result.text        → truncated string (with '...' if needed)
// result.pixelWidth  → actual pixel width of result.text
// result.isTruncated → boolean
```

## API Reference

### `generateSerpPreview()`

```ts
function generateSerpPreview(input: SerpPreviewInput): SerpPreviewData
```

#### `SerpPreviewInput`

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title |
| `description` | `string` | Meta description |
| `url` | `string` | Canonical page URL |

#### `SerpPreviewData`

| Field | Type | Description |
|-------|------|-------------|
| `title` | `TruncateResult` | Display title with truncation metadata |
| `description` | `TruncateResult` | Display description with truncation metadata |
| `breadcrumb` | `string` | Breadcrumb path (e.g. `example.com › blog`) |
| `url` | `string` | Canonical URL |

### `generateOgPreview()`

```ts
function generateOgPreview(input: OgPreviewInput): OgPreviewData
```

#### `OgPreviewInput`

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | OG title |
| `description` | `string` | OG description |
| `url` | `string` | Canonical URL |
| `siteName` | `string` | Site name |
| `image` | `{url, width?, height?}` | OG image (recommended 1200×630) |

### `generateTwitterPreview()`

```ts
function generateTwitterPreview(input: TwitterPreviewInput): TwitterPreviewData
```

#### `TwitterPreviewInput`

| Prop | Type | Description |
|------|------|-------------|
| `cardType` | `'summary' \| 'summary_large_image'` | Twitter Card type |
| `title` | `string` | Card title (max 70 chars displayed) |
| `description` | `string` | Card description (max 200 chars displayed) |
| `site` | `string` | Twitter @username of site |
| `image` | `{url, width?, height?}` | Card image |

### `truncateAtPixelWidth()`

```ts
function truncateAtPixelWidth(text: string, maxPixels: number): TruncateResult
```

#### `TruncateResult`

| Field | Type | Description |
|-------|------|-------------|
| `text` | `string` | Resulting (possibly truncated) string |
| `pixelWidth` | `number` | Pixel width of the result |
| `isTruncated` | `boolean` | Whether truncation occurred |

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
