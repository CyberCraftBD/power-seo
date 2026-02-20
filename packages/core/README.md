# @power-seo/core — Framework-Agnostic SEO Utilities for TypeScript & React

> Zero-dependency foundation for the @power-seo toolkit. Provides shared types, meta tag builders, URL utilities, text statistics, keyword density analysis, robots directive builder, validators, and constants.

[![npm version](https://img.shields.io/npm/v/@power-seo/core)](https://www.npmjs.com/package/@power-seo/core)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/core)](https://www.npmjs.com/package/@power-seo/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/core)

The foundation package used by all other `@power-seo` packages. Useful on its own for headless SEO tooling, custom framework integrations, or any Node.js application that needs SEO utilities without a React dependency.

## Features

- **Meta tag builders** — generate typed `MetaTag[]` and `LinkTag[]` objects for title, description, Open Graph, Twitter Card, hreflang
- **Robots directive builder** — build and parse robots meta content strings with full directive support (noindex, nofollow, max-snippet, max-image-preview, max-video-preview, unavailable_after, noarchive, nosnippet, noimageindex, notranslate)
- **Title template engine** — `%s | Site Name` style templates with `applyTitleTemplate()`
- **Meta validators** — validate title and description length in both characters and pixel width
- **URL utilities** — normalize, slug-ify, strip tracking params, resolve canonical, check absolute/relative
- **Text statistics** — word count, sentence count, syllable count, paragraph count from HTML content
- **Keyword density analysis** — calculate density, count occurrences, analyze keyphrase distribution
- **Shared constants** — `TITLE_MAX_LENGTH`, `META_DESCRIPTION_MAX_LENGTH`, `OG_IMAGE`, `KEYWORD_DENSITY` thresholds
- **Zero runtime dependencies** — safe to use in any environment including edge runtimes
- **Dual ESM + CJS** — works with any bundler or Node.js require
- **TypeScript-first** — all types exported, full `.d.ts` declarations

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Meta Tag Builders](#meta-tag-builders)
  - [Robots Directive Builder](#robots-directive-builder)
  - [Title Template Engine](#title-template-engine)
  - [Meta Validators](#meta-validators)
  - [URL Utilities](#url-utilities)
  - [Text Statistics](#text-statistics)
  - [Keyword Density](#keyword-density)
  - [Constants](#constants)
- [API Reference](#api-reference)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
npm install @power-seo/core
```

```bash
yarn add @power-seo/core
```

```bash
pnpm add @power-seo/core
```

## Quick Start

```ts
import { buildMetaTags, buildRobotsContent, validateTitle, toSlug } from '@power-seo/core';

const tags = buildMetaTags({ title: 'My Page', description: 'Page description', robots: { index: true, follow: true } });
const robots = buildRobotsContent({ index: false, maxSnippet: 150 }); // → "noindex, max-snippet:150"
const valid = validateTitle('My Page Title');                          // { valid: true, length: 14, pixelWidth: 95 }
const slug = toSlug('My Blog Post!');                                  // → "my-blog-post"
```

## Usage

### Meta Tag Builders

```ts
import { buildMetaTags, buildLinkTags, buildOpenGraphTags, buildTwitterTags, buildHreflangTags } from '@power-seo/core';

const meta = buildMetaTags({
  title: 'My Page',
  description: 'Page description',
  robots: { index: true, follow: true },
});

const links = buildLinkTags({ canonical: 'https://example.com/page' });

const og = buildOpenGraphTags({
  title: 'My Page',
  description: 'Page description',
  type: 'website',
  url: 'https://example.com',
  images: [{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }],
});

const twitter = buildTwitterTags({
  card: 'summary_large_image',
  site: '@mysite',
  title: 'My Page',
  description: 'Page description',
  image: 'https://example.com/twitter.jpg',
});

const hreflang = buildHreflangTags([
  { hrefLang: 'en', href: 'https://example.com/page' },
  { hrefLang: 'fr', href: 'https://fr.example.com/page' },
  { hrefLang: 'x-default', href: 'https://example.com/page' },
]);
```

### Robots Directive Builder

```ts
import { buildRobotsContent, parseRobotsContent } from '@power-seo/core';

// Build robots meta content string
buildRobotsContent({ index: true, follow: true });
// → "index, follow"

buildRobotsContent({ index: false, follow: false, noarchive: true });
// → "noindex, nofollow, noarchive"

buildRobotsContent({ index: true, maxSnippet: 150, maxImagePreview: 'large' });
// → "index, max-snippet:150, max-image-preview:large"

// Parse existing robots string back to config
parseRobotsContent('noindex, follow, max-image-preview:large');
// → { index: false, follow: true, maxImagePreview: 'large' }
```

**All supported directives:**

| Directive | Type | Description |
|-----------|------|-------------|
| `index` | `boolean` | `true` → `index`, `false` → `noindex` |
| `follow` | `boolean` | `true` → `follow`, `false` → `nofollow` |
| `noarchive` | `boolean` | Prevent cached version in search results |
| `nosnippet` | `boolean` | Prevent text/video snippet in results |
| `noimageindex` | `boolean` | Prevent page images from being indexed |
| `notranslate` | `boolean` | Prevent Google Translate offer |
| `maxSnippet` | `number` | Max text snippet length (e.g. `150`) |
| `maxImagePreview` | `'none' \| 'standard' \| 'large'` | Max image preview size |
| `maxVideoPreview` | `number` | Max video preview duration in seconds |
| `unavailableAfter` | `string` | Date after which to remove page from results |

### Title Template Engine

```ts
import { applyTitleTemplate, createTitleTemplate } from '@power-seo/core';

applyTitleTemplate('Blog Post', '%s | My Site');
// → "Blog Post | My Site"

const template = createTitleTemplate({ separator: '|', suffix: 'My Site' });
template.apply('Blog Post'); // → "Blog Post | My Site"
```

### Meta Validators

```ts
import { validateTitle, validateMetaDescription, calculatePixelWidth } from '@power-seo/core';

validateTitle('My Page Title');
// { valid: true, length: 14, pixelWidth: 95, warnings: [] }

validateMetaDescription('A description of the page content for search engines.');
// { valid: true, length: 53, pixelWidth: 340, warnings: [] }

calculatePixelWidth('My Title'); // → 56
```

### URL Utilities

```ts
import {
  normalizeUrl,
  toSlug,
  stripTrackingParams,
  ensureTrailingSlash,
  removeTrailingSlash,
  isAbsoluteUrl,
  resolveCanonical,
} from '@power-seo/core';

normalizeUrl('https://example.com/PATH?utm_source=x'); // → "https://example.com/path"
toSlug('My Blog Post!');                               // → "my-blog-post"
stripTrackingParams('https://example.com?utm_source=google&page=1'); // → "https://example.com?page=1"
ensureTrailingSlash('https://example.com/blog');       // → "https://example.com/blog/"
removeTrailingSlash('https://example.com/blog/');      // → "https://example.com/blog"
isAbsoluteUrl('https://example.com');                  // → true
isAbsoluteUrl('/relative/path');                       // → false
```

### Text Statistics

```ts
import { getTextStatistics, stripHtml, getWords, getSentences, countSyllables } from '@power-seo/core';

const stats = getTextStatistics('<h1>Hello</h1><p>This is a sample paragraph with several words.</p>');
// { wordCount: 9, sentenceCount: 1, paragraphCount: 1, syllableCount: 14, avgWordsPerSentence: 9 }

stripHtml('<p>Hello <strong>world</strong></p>'); // → "Hello world"
getWords('Hello world');                           // → ["Hello", "world"]
countSyllables('beautiful');                       // → 3
```

### Keyword Density

```ts
import { calculateKeywordDensity, countKeywordOccurrences, analyzeKeyphraseOccurrences } from '@power-seo/core';

calculateKeywordDensity('react seo is great for react apps', 'react'); // → 0.1667 (16.67%)
countKeywordOccurrences('react seo is great for react apps', 'react'); // → 2

const analysis = analyzeKeyphraseOccurrences(
  'Best coffee shops in NYC. The coffee shops on Fifth Avenue are particularly good.',
  'coffee shops'
);
// { count: 2, density: 0.1538, positions: [1, 7], distribution: 'good' }
```

### Constants

```ts
import { TITLE_MAX_LENGTH, META_DESCRIPTION_MAX_LENGTH, OG_IMAGE, KEYWORD_DENSITY, READABILITY } from '@power-seo/core';

TITLE_MAX_LENGTH;              // 60
META_DESCRIPTION_MAX_LENGTH;   // 158
OG_IMAGE.MIN_WIDTH;            // 1200
OG_IMAGE.MIN_HEIGHT;           // 630
KEYWORD_DENSITY.MIN;           // 0.005 (0.5%)
KEYWORD_DENSITY.MAX;           // 0.03  (3%)
```

## API Reference

### Meta Builders

| Function | Signature | Description |
|----------|-----------|-------------|
| `buildMetaTags` | `(config: MetaConfig) => MetaTag[]` | Generate meta tag objects from SEO config |
| `buildLinkTags` | `(config: LinkConfig) => LinkTag[]` | Generate link tag objects (canonical, alternate) |
| `buildOpenGraphTags` | `(config: OpenGraphConfig) => MetaTag[]` | Generate Open Graph `og:*` meta tags |
| `buildTwitterTags` | `(config: TwitterConfig) => MetaTag[]` | Generate Twitter Card `twitter:*` meta tags |
| `buildHreflangTags` | `(entries: HreflangEntry[]) => LinkTag[]` | Generate hreflang `<link rel="alternate">` tags |
| `resolveTitle` | `(title: string, template?: string) => string` | Resolve title with optional template |

### Robots

| Function | Signature | Description |
|----------|-----------|-------------|
| `buildRobotsContent` | `(directive: RobotsDirective) => string` | Build robots meta content string |
| `parseRobotsContent` | `(content: string) => RobotsDirective` | Parse robots string into `RobotsDirective` |

### Title

| Function | Signature | Description |
|----------|-----------|-------------|
| `applyTitleTemplate` | `(title: string, template: string) => string` | Apply `%s` template to title |
| `createTitleTemplate` | `(options: TitleTemplateOptions) => TitleTemplate` | Create reusable title template |

### Validators

| Function | Signature | Description |
|----------|-----------|-------------|
| `validateTitle` | `(title: string) => ValidationResult` | Validate title length and pixel width |
| `validateMetaDescription` | `(description: string) => ValidationResult` | Validate description length and pixel width |
| `calculatePixelWidth` | `(text: string) => number` | Calculate pixel width using Google's character width table |

### URL Utilities

| Function | Signature | Description |
|----------|-----------|-------------|
| `resolveCanonical` | `(url: string, base: string) => string` | Resolve canonical URL against base |
| `normalizeUrl` | `(url: string) => string` | Normalize URL (lowercase, remove trailing slash) |
| `ensureTrailingSlash` | `(url: string) => string` | Add trailing slash if missing |
| `removeTrailingSlash` | `(url: string) => string` | Remove trailing slash if present |
| `stripQueryParams` | `(url: string) => string` | Remove all query parameters |
| `stripTrackingParams` | `(url: string) => string` | Remove UTM and tracking parameters only |
| `isAbsoluteUrl` | `(url: string) => boolean` | Check if URL is absolute |
| `toSlug` | `(text: string) => string` | Convert text to URL-safe slug |

### Text Statistics

| Function | Signature | Description |
|----------|-----------|-------------|
| `getTextStatistics` | `(html: string) => TextStatistics` | Comprehensive text statistics from HTML |
| `stripHtml` | `(html: string) => string` | Remove HTML tags |
| `getWords` | `(text: string) => string[]` | Split into words array |
| `getSentences` | `(text: string) => string[]` | Split into sentences array |
| `getParagraphs` | `(text: string) => string[]` | Split into paragraphs array |
| `countSyllables` | `(word: string) => number` | Count syllables in a single word |

### Keyword Analysis

| Function | Signature | Description |
|----------|-----------|-------------|
| `calculateKeywordDensity` | `(text: string, keyword: string) => number` | Keyword density as decimal (0.05 = 5%) |
| `countKeywordOccurrences` | `(text: string, keyword: string) => number` | Raw occurrence count |
| `analyzeKeyphraseOccurrences` | `(text: string, keyphrase: string) => KeyphraseAnalysis` | Detailed keyphrase analysis |

### Core Types

| Type | Description |
|------|-------------|
| `MetaTag` | `{ name?: string; property?: string; content: string; httpEquiv?: string }` |
| `LinkTag` | `{ rel: string; href: string; hrefLang?: string; type?: string }` |
| `RobotsDirective` | Full robots directive configuration object |
| `MetaConfig` | Input config for `buildMetaTags()` |
| `OpenGraphConfig` | Input config for `buildOpenGraphTags()` |
| `TwitterConfig` | Input config for `buildTwitterTags()` |
| `ValidationResult` | `{ valid: boolean; length: number; pixelWidth: number; warnings: string[] }` |
| `TextStatistics` | `{ wordCount: number; sentenceCount: number; paragraphCount: number; syllableCount: number; avgWordsPerSentence: number }` |

---

## The @power-seo Ecosystem

All 17 packages are independently installable — use only what you need.

| Package | Install | Description |
|---------|---------|-------------|
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core) | `npm i @power-seo/core` | Framework-agnostic utilities, types, validators, and constants |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react) | `npm i @power-seo/react` | React SEO components — meta, Open Graph, Twitter Card, robots, breadcrumbs |
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
