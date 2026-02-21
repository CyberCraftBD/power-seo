# @power-seo/preview — SERP, Open Graph & Twitter/X Card Preview Generators for TypeScript — Pixel-Accurate, Zero Dependencies

[![npm version](https://img.shields.io/npm/v/@power-seo/preview)](https://www.npmjs.com/package/@power-seo/preview)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/preview)](https://www.npmjs.com/package/@power-seo/preview)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/preview)

---

## Overview

**@power-seo/preview** is a pixel-accurate preview generator for TypeScript developers and CMS platforms that helps you compute exactly how a page will appear in Google SERP, Open Graph social cards, and Twitter/X Cards — without a headless browser or canvas.

**What it does**
- ✅ **Generate Google SERP previews** — pixel-width-aware title and description truncation (600px / 920px)
- ✅ **Generate Open Graph card previews** — image dimension validation, display title and domain
- ✅ **Generate Twitter/X Card previews** — `summary` and `summary_large_image` card types with image validation
- ✅ **Truncate at pixel width** — `truncateAtPixelWidth()` uses character width tables, not character counts
- ✅ **Validate image constraints** — warns when OG images are too small, too large, or wrong aspect ratio

**What it is not**
- ❌ **Not a visual renderer** — returns structured data, not HTML or screenshots
- ❌ **Not a headless browser** — no Puppeteer, no canvas, no DOM required

**Recommended for**
- **CMS preview panels**, **SEO auditing tools**, **Next.js / Remix content editors**, and **programmatic SEO pipelines**

---

## Why @power-seo/preview Matters

**The problem**
- **SERP truncation is pixel-based**, not character-based — a title with wide characters (W, M) can overflow at fewer chars than one with narrow characters (i, l)
- **OG images are rejected silently** — Facebook and LinkedIn drop cards for under-sized images with no visible warning
- **Twitter Card specs differ from OG** — card type, image ratio requirements, and display text limits vary

**Why developers care**
- **Performance:** Correct SERP snippets increase click-through rates
- **SEO:** OG cards with valid image dimensions drive social traffic
- **UX:** Preview-as-you-type in CMS reduces publish-and-regret cycles

---

## Key Features

- **Pixel-accurate SERP truncation** — `generateSerpPreview()` truncates title at 600px, description at 920px using character width lookup tables
- **Open Graph card validation** — `generateOgPreview()` validates 1200×630 recommended dimensions and reports warnings
- **Twitter/X Card support** — `generateTwitterPreview()` handles both `summary` and `summary_large_image` card types
- **Low-level truncation primitive** — `truncateAtPixelWidth()` for truncating arbitrary strings at any pixel budget
- **Structured output** — returns typed data objects ready for your own UI, not HTML strings
- **Type-safe API** — TypeScript-first with full `.d.ts` declarations for all inputs, outputs, and validation results
- **Tree-shakeable** — import only the preview generators you use
- **Zero runtime dependencies** — pure computation, no canvas, no browser, no external libraries

---

## Benefits of Using @power-seo/preview

- **Improved CTR**: Correctly sized SERP titles eliminate mid-word truncation that confuses searchers
- **Better social sharing**: OG image validation catches under-sized images before they silently drop social cards
- **Safer content editing**: CMS authors see pixel-accurate previews before publishing, not after
- **Faster delivery**: No browser spin-up; preview computation is synchronous and instant

---

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

**What you should see**
- `serp.title.isTruncated` — `false` if title fits within 600px pixel budget
- `og.image.validation.warnings` — empty array if dimensions meet OG recommendations

---

## Installation

```bash
npm i @power-seo/preview
# or
yarn add @power-seo/preview
# or
pnpm add @power-seo/preview
# or
bun add @power-seo/preview
```

---

## Framework Compatibility

**Supported**
- ✅ Next.js (App Router / Pages Router) — use in server components, API routes, or `generateMetadata`
- ✅ Remix — use in loaders or action functions
- ✅ Node.js 18+ — pure module, no native bindings
- ✅ Edge runtimes — no Node.js-specific APIs
- ✅ React (optional peer dep) — `/react` subpath export for React components

**Environment notes**
- **SSR/SSG:** Fully supported — computation is synchronous
- **Edge runtime:** Supported — no `fs`, no `canvas`, no browser APIs
- **Browser-only usage:** Supported — works in any browser JS environment

---

## Use Cases

- **CMS live preview panels** — show authors how their title/description will appear in Google before publishing
- **SEO auditing pipelines** — detect truncated titles and missing OG images at build time
- **Programmatic SEO sites** — validate auto-generated titles for thousands of pages at once
- **Social media schedulers** — validate OG image dimensions before queuing posts
- **SaaS marketing dashboards** — show SERP/social preview for every page
- **Blog platforms** — live preview as editors type the meta description
- **E-commerce product pages** — ensure product image dimensions meet OG card requirements
- **Landing page builders** — embed SERP and social card preview in the editor UI

---

## Example (Before / After)

```text
Before (unchecked):
- Title: "Buy Premium Running Shoes Online — Free Shipping Worldwide — RunFast Store"
- Pixel width: ~720px → SERP shows "Buy Premium Running Shoes Online — Free Ship..."
- OG image: 800×400 → too small, card dropped by Facebook

After (@power-seo/preview):
- title.isTruncated: true → author shortens to "Premium Running Shoes — Free Shipping | RunFast"
- og.image.validation.warnings: ['Image width 800px is below recommended 1200px'] → author uploads 1200×630 image
- Social card renders correctly on Facebook, LinkedIn, Twitter
```

---

## Implementation Best Practices

- **Keep SERP titles under 550px** — gives a safety margin for varying render environments
- **Target SERP descriptions at 800–900px** — Google may show more or less, but staying under 920px is safe
- **Always use 1200×630 for OG images** — this is the safe standard for Facebook, LinkedIn, and WhatsApp
- **Use `summary_large_image` for blog/article pages** — much higher engagement than `summary`
- **Run `generateSerpPreview` in CI** — catch truncation regressions in auto-generated title templates

---

## Architecture Overview

**Where it runs**
- **Build-time**: Audit title/description pixel widths across all pages during static generation
- **Runtime**: Power CMS live preview panels with real-time truncation feedback
- **CI/CD**: Validate OG image dimensions and SERP titles in pull request checks

**Data flow**
1. **Input**: Page title, meta description, URL, OG image metadata
2. **Analysis**: Character-width table lookup → pixel budget comparison → image dimension validation
3. **Output**: Structured `SerpPreviewData`, `OgPreviewData`, `TwitterPreviewData` objects with `isTruncated`, `warnings`
4. **Action**: CMS shows preview, CI fails on truncation, author updates content

---

## Features Comparison with Popular Packages

| Capability | next-seo | react-helmet | yoast (WP) | @power-seo/preview |
|---|---:|---:|---:|---:|
| Pixel-accurate SERP truncation | ❌ | ❌ | ✅ (browser only) | ✅ |
| OG image dimension validation | ❌ | ❌ | ❌ | ✅ |
| Twitter/X Card preview generation | ❌ | ❌ | ❌ | ✅ |
| Zero runtime dependencies | ✅ | ✅ | ❌ | ✅ |
| Works in edge runtimes | ✅ | ✅ | ❌ | ✅ |
| Structured data output (not HTML) | ❌ | ❌ | ❌ | ✅ |

---

## @power-seo Ecosystem

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

### Ecosystem vs alternatives

| Need | Common approach | @power-seo approach |
|---|---|---|
| SERP preview | Browser-based tools (Moz, SEMrush UI) | `@power-seo/preview` — programmatic, zero dep |
| OG preview | Manual checking on social debuggers | `@power-seo/preview` — validate before publish |
| Meta tags | `next-seo` / `react-helmet` | `@power-seo/meta` + `@power-seo/react` |
| Structured data | Manual JSON-LD | `@power-seo/schema` — typed builders |

---

## Enterprise Integration

**Multi-tenant SaaS**
- **Tenant-aware validation**: Run `generateSerpPreview` per tenant's locale — pixel widths vary by character set
- **Per-page audit pipelines**: Validate all auto-generated titles across thousands of product pages
- **CMS integration**: Expose preview data via API endpoint; embed in editor sidebar

**ERP / internal portals**
- Validate public-facing module titles for SERP appearance
- Audit OG images for partner portal landing pages
- Run preview checks as part of the content approval workflow

**Recommended integration pattern**
- Run `generateSerpPreview` in **CI** on title template changes
- Fail build when `isTruncated === true` on critical pages
- Export validation results as **JSON artifacts** for content team review

---

## Scope and Limitations

**This package does**
- ✅ Compute pixel-width-aware SERP title and description truncation
- ✅ Validate OG image dimensions against recommended constraints
- ✅ Generate Twitter/X Card preview data for both card types
- ✅ Return structured data objects for rendering in any UI

**This package does not**
- ❌ Render visual HTML previews or screenshots
- ❌ Fetch live pages from the internet
- ❌ Submit content to search engines or social platforms
- ❌ Guarantee Google's actual rendering behavior (which varies by search context)

---

## API Reference

### `generateSerpPreview(input)`

```ts
function generateSerpPreview(input: SerpPreviewInput): SerpPreviewData
```

| Input Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title |
| `description` | `string` | Meta description |
| `url` | `string` | Canonical page URL |

| Output Field | Type | Description |
|-------|------|-------------|
| `title` | `TruncateResult` | Display title with truncation metadata |
| `description` | `TruncateResult` | Display description with truncation metadata |
| `breadcrumb` | `string` | Breadcrumb path (e.g. `example.com › blog`) |
| `url` | `string` | Canonical URL |

---

### `generateOgPreview(input)`

```ts
function generateOgPreview(input: OgPreviewInput): OgPreviewData
```

| Input Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | OG title |
| `description` | `string` | OG description |
| `url` | `string` | Canonical URL |
| `siteName` | `string` | Site name |
| `image` | `{ url, width?, height? }` | OG image (recommended 1200×630) |

---

### `generateTwitterPreview(input)`

```ts
function generateTwitterPreview(input: TwitterPreviewInput): TwitterPreviewData
```

| Input Prop | Type | Description |
|------|------|-------------|
| `cardType` | `'summary' \| 'summary_large_image'` | Twitter Card type |
| `title` | `string` | Card title (max 70 chars displayed) |
| `description` | `string` | Card description (max 200 chars displayed) |
| `site` | `string` | Twitter @username of site |
| `image` | `{ url, width?, height? }` | Card image |

---

### `truncateAtPixelWidth(text, maxPixels)`

```ts
function truncateAtPixelWidth(text: string, maxPixels: number): TruncateResult
```

| Output Field | Type | Description |
|-------|------|-------------|
| `text` | `string` | Resulting (possibly truncated) string |
| `pixelWidth` | `number` | Pixel width of the result |
| `isTruncated` | `boolean` | Whether truncation occurred |

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

| | |
|---|---|
| **Website** | [ccbd.dev](https://ccbd.dev) |
| **GitHub** | [github.com/cybercraftbd](https://github.com/cybercraftbd) |
| **npm Organization** | [npmjs.com/org/power-seo](https://www.npmjs.com/org/power-seo) |
| **Email** | [info@ccbd.dev](mailto:info@ccbd.dev) |

---

## License

**MIT**

---

## Keywords

```text
seo, serp, preview, serp-preview, open-graph, twitter-card, og-preview, pixel-truncation, meta-description, typescript, nextjs, remix, cms-preview, social-preview
```
