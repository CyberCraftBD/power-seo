# @power-seo/images — Image SEO Auditing, Format Analysis, and Image Sitemap Generation

Alt text auditing, CWV-aware lazy loading checks, WebP/AVIF format recommendations, and image sitemap XML generation with the `<image:image>` extension.

[![npm version](https://img.shields.io/npm/v/@power-seo/images?style=flat-square)](https://www.npmjs.com/package/@power-seo/images)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/images?style=flat-square)](https://www.npmjs.com/package/@power-seo/images)
[![MIT License](https://img.shields.io/npm/l/@power-seo/images?style=flat-square)](../../LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen?style=flat-square)](#)

`@power-seo/images` is a focused toolkit for every image-related SEO concern. Images are consistently among the top contributors to poor Core Web Vitals scores and lost organic visibility — yet they are also the easiest wins once you have the right analysis in place. This package gives you precise, programmatic insight into your image SEO health.

The alt text auditor catches not just empty alt attributes but the subtler issues: filenames used as alt text, alt text that is too short to be meaningful, duplicate alt text across multiple images, and whether your focus keyphrase appears in at least one image's alt text. The lazy loading auditor is CWV-aware — it will flag above-the-fold images that have `loading="lazy"` applied (which delays LCP) and below-the-fold images that are missing it (which wastes bandwidth). The format analyzer detects each image's current format by URL extension and recommends modern alternatives (WebP, AVIF) for formats that lack compression efficiency. Finally, `generateImageSitemap` produces standards-compliant XML using Google's `image:` namespace extension so your images appear in image search results.

## Documentation

- **Package docs:** [`apps/docs/src/content/docs/packages/images.mdx`](../../apps/docs/src/content/docs/packages/images.mdx)
- **Ecosystem overview:** [`README.md`](../../README.md)
- **Contributing guide:** [`CONTRIBUTING.md`](../../CONTRIBUTING.md)

## Features

- **Alt text audit** — detects missing alt attributes, empty alt text on non-decorative images, alt text that is too short (under 5 characters), filename patterns used as alt text (e.g., `IMG_1234`), duplicate alt text across multiple images, and keyphrase presence in at least one image's alt text
- **CWV-aware lazy loading audit** — flags above-the-fold images with `loading="lazy"` (LCP regression risk), missing `loading="lazy"` on below-the-fold images (unnecessary bandwidth), and images without explicit `width`/`height` dimensions (layout shift / CLS regression)
- **Format detection** — `detectFormat(src)` identifies JPEG, PNG, WebP, AVIF, GIF, and SVG from URL path or filename extension
- **Format recommendation engine** — `getFormatRecommendation(format)` returns specific upgrade recommendations: JPEG/PNG → WebP or AVIF, GIF → WebP animated or video, with rationale for each
- **Batch format analysis** — `analyzeImageFormats(input)` audits all images on a page and returns a `FormatAuditResult` with per-image recommendations and an overall optimization score
- **HTML image extraction** — `extractImageEntries(html, baseUrl)` parses an HTML string and extracts all `<img>` elements with their `src`, `alt`, and dimension attributes, resolving relative URLs against the provided base
- **Image sitemap generation** — `generateImageSitemap(pages)` produces valid XML conforming to Google's image sitemap specification with `<image:loc>`, `<image:title>`, and `<image:caption>` elements
- **Severity-leveled issues** — every image issue carries a severity of `error`, `warning`, or `info` so you can triage and filter
- **Type-safe throughout** — complete TypeScript types covering all inputs, outputs, formats, and issue structures
- **Zero dependencies** — pure TypeScript, no external runtime libraries

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Alt Text Analysis](#alt-text-analysis)
  - [Lazy Loading Audit](#lazy-loading-audit)
  - [Format Detection and Recommendations](#format-detection-and-recommendations)
  - [Batch Format Analysis](#batch-format-analysis)
  - [Image Sitemap Generation](#image-sitemap-generation)
  - [Full Page Image Audit](#full-page-image-audit)
- [API Reference](#api-reference)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
# npm
npm install @power-seo/images

# yarn
yarn add @power-seo/images

# pnpm
pnpm add @power-seo/images
```

## Quick Start

```ts
import { analyzeAltText, auditLazyLoading, analyzeImageFormats } from '@power-seo/images';

const images = [
  { src: '/hero.jpg', alt: '', loading: 'lazy', isAboveFold: true, width: 1200, height: 630 },
  {
    src: '/IMG_1234.png',
    alt: 'IMG_1234',
    loading: undefined,
    isAboveFold: false,
    width: 800,
    height: 600,
  },
  {
    src: '/product.webp',
    alt: 'Blue widget',
    loading: 'lazy',
    isAboveFold: false,
    width: 400,
    height: 400,
  },
];

// Alt text issues
const altResult = analyzeAltText({ images, keyphrase: 'blue widget' });
console.log(altResult.issues);
// [{ src: '/hero.jpg', type: 'missing-alt', severity: 'error', message: '...' },
//  { src: '/IMG_1234.png', type: 'filename-as-alt', severity: 'warning', message: '...' }]

// Lazy loading issues
const lazyResult = auditLazyLoading({ images });
console.log(lazyResult.issues);
// [{ src: '/hero.jpg', type: 'lazy-above-fold', severity: 'error', message: '...' },
//  { src: '/IMG_1234.png', type: 'missing-lazy', severity: 'warning', message: '...' }]

// Format recommendations
const formatResult = analyzeImageFormats({ images });
console.log(formatResult.recommendations);
// [{ src: '/hero.jpg', current: 'jpeg', recommended: 'webp', reason: '...' }, ...]
```

## Usage

### Alt Text Analysis

`analyzeAltText` performs a comprehensive quality check on every image's alt attribute.

```ts
import { analyzeAltText } from '@power-seo/images';
import type { ImageAnalysisResult, ImageIssue } from '@power-seo/images';

const result: ImageAnalysisResult = analyzeAltText({
  images: [
    { src: '/hero.jpg', alt: '' }, // missing alt
    { src: '/icon.png', alt: 'i' }, // too short
    { src: '/IMG_9821.jpg', alt: 'IMG_9821' }, // filename as alt
    { src: '/team-photo.jpg', alt: 'Team photo' }, // ok
    { src: '/product.webp', alt: 'Blue widget on white background' }, // good, has keyphrase
    { src: '/bg.jpg', alt: '' }, // decorative — ok if marked
  ],
  keyphrase: 'blue widget',
});

result.issues.forEach((issue: ImageIssue) => {
  console.log(`[${issue.severity}] ${issue.src}: ${issue.message}`);
});

console.log(`Keyphrase found in alt text: ${result.keyphraseInAlt}`);
console.log(`Images with issues: ${result.issueCount}/${result.totalImages}`);
```

The following issue types are detected:

| Type                | Severity  | Description                                                                                |
| ------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `missing-alt`       | `error`   | The `alt` attribute is absent entirely                                                     |
| `empty-alt`         | `warning` | The `alt` attribute exists but is an empty string (appropriate only for decorative images) |
| `alt-too-short`     | `warning` | The alt text is present but fewer than 5 characters                                        |
| `filename-as-alt`   | `warning` | The alt text appears to be a filename (e.g., `IMG_1234`, `photo.jpg`)                      |
| `duplicate-alt`     | `info`    | The same alt text is used on multiple images                                               |
| `keyphrase-missing` | `info`    | No image on the page has the focus keyphrase in its alt text                               |

### Lazy Loading Audit

`auditLazyLoading` evaluates `loading` attributes with Core Web Vitals awareness.

```ts
import { auditLazyLoading } from '@power-seo/images';
import type { LazyLoadingAuditResult } from '@power-seo/images';

const result: LazyLoadingAuditResult = auditLazyLoading({
  images: [
    // Above fold — should NOT be lazy-loaded (LCP risk)
    { src: '/hero.jpg', loading: 'lazy', isAboveFold: true, width: 1200, height: 630 },
    // Below fold — SHOULD be lazy-loaded (bandwidth saving)
    { src: '/section2.jpg', loading: undefined, isAboveFold: false, width: 800, height: 500 },
    // Good: above fold, eagerly loaded
    { src: '/logo.png', loading: 'eager', isAboveFold: true, width: 200, height: 60 },
    // Good: below fold, lazy-loaded
    { src: '/footer.jpg', loading: 'lazy', isAboveFold: false, width: 600, height: 400 },
    // Missing dimensions — causes CLS
    { src: '/promo.jpg', loading: 'lazy', isAboveFold: false },
  ],
});

console.log(`Score: ${result.score}/100`);
result.issues.forEach((issue) => {
  console.log(`[${issue.severity}] ${issue.src}: ${issue.message}`);
});
```

| Issue type           | Severity  | Description                                                             |
| -------------------- | --------- | ----------------------------------------------------------------------- |
| `lazy-above-fold`    | `error`   | Above-fold image with `loading="lazy"` — delays LCP                     |
| `missing-lazy`       | `warning` | Below-fold image without `loading="lazy"` — wastes bandwidth            |
| `missing-dimensions` | `warning` | Image without explicit `width` and `height` — causes layout shift (CLS) |

### Format Detection and Recommendations

```ts
import { detectFormat, getFormatRecommendation } from '@power-seo/images';
import type { ImageFormat } from '@power-seo/images';

// Detect format from a URL or filename
const format: ImageFormat = detectFormat('/images/hero.jpg');
// 'jpeg'

detectFormat('https://example.com/icon.png'); // 'png'
detectFormat('/animation.gif'); // 'gif'
detectFormat('/photo.webp'); // 'webp'
detectFormat('/image.avif'); // 'avif'
detectFormat('/logo.svg'); // 'svg'

// Get a recommendation for the detected format
const recommendation = getFormatRecommendation('jpeg');
// {
//   format: 'jpeg',
//   recommended: ['webp', 'avif'],
//   reason: 'WebP provides 25-35% smaller files than JPEG at equivalent quality. AVIF provides 50% reduction.',
//   priority: 'high',
// }

const gifRec = getFormatRecommendation('gif');
// {
//   format: 'gif',
//   recommended: ['webp'],
//   reason: 'Animated GIF files are very large. Use animated WebP or consider a video element instead.',
//   priority: 'high',
// }

const webpRec = getFormatRecommendation('webp');
// { format: 'webp', recommended: ['avif'], reason: 'AVIF provides additional compression gains over WebP.', priority: 'low' }
```

### Batch Format Analysis

`analyzeImageFormats` evaluates all images on a page and produces a structured audit result.

```ts
import { analyzeImageFormats } from '@power-seo/images';
import type { FormatAuditResult } from '@power-seo/images';

const result: FormatAuditResult = analyzeImageFormats({
  images: [
    { src: '/hero.jpg' },
    { src: '/thumbnail.png' },
    { src: '/animation.gif' },
    { src: '/logo.svg' },
    { src: '/banner.webp' },
  ],
});

console.log(`Format optimization score: ${result.score}/100`);
console.log(`Images needing modernization: ${result.recommendations.length}`);

result.recommendations.forEach((rec) => {
  console.log(`${rec.src} (${rec.current}) → convert to ${rec.recommended.join(' or ')}`);
});
```

### Image Sitemap Generation

Generate a Google-compliant image sitemap with the `image:` XML namespace extension.

```ts
import { extractImageEntries, generateImageSitemap } from '@power-seo/images';
import type { ImageSitemapPage, SitemapImage } from '@power-seo/images';

// Extract from HTML
const htmlContent = `
  <img src="/products/widget.jpg" alt="Blue widget" title="Premium blue widget" />
  <img src="/products/widget-detail.webp" alt="Widget detail view" />
`;
const images: SitemapImage[] = extractImageEntries(htmlContent, 'https://example.com');
// [
//   { loc: 'https://example.com/products/widget.jpg', title: 'Premium blue widget', caption: 'Blue widget' },
//   { loc: 'https://example.com/products/widget-detail.webp', caption: 'Widget detail view' },
// ]

// Generate image sitemap XML
const sitemapXml = generateImageSitemap([
  {
    pageUrl: 'https://example.com/products/widget',
    images: [
      {
        loc: 'https://example.com/products/widget.jpg',
        title: 'Premium Blue Widget',
        caption: 'Front view of our blue widget',
      },
      {
        loc: 'https://example.com/products/widget-detail.webp',
        title: 'Widget Detail',
        caption: 'Close-up detail view',
      },
    ],
  },
  {
    pageUrl: 'https://example.com/about',
    images: [
      {
        loc: 'https://example.com/team/team-photo.jpg',
        title: 'Our Team',
        caption: 'The CyberCraft Bangladesh team',
      },
    ],
  },
]);

// Save to public/image-sitemap.xml
console.log(sitemapXml);
// <?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
//         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
//   <url>
//     <loc>https://example.com/products/widget</loc>
//     <image:image>
//       <image:loc>https://example.com/products/widget.jpg</image:loc>
//       <image:title>Premium Blue Widget</image:title>
//       <image:caption>Front view of our blue widget</image:caption>
//     </image:image>
//     ...
//   </url>
// </urlset>
```

### Full Page Image Audit

Combine all analyzers for a complete image health report on a single page.

```ts
import { analyzeAltText, auditLazyLoading, analyzeImageFormats } from '@power-seo/images';

const images = await extractImagesFromPage('https://example.com/blog/my-post');

const [altResult, lazyResult, formatResult] = await Promise.all([
  analyzeAltText({ images, keyphrase: 'my post topic' }),
  auditLazyLoading({ images }),
  analyzeImageFormats({ images }),
]);

const overallImageScore = Math.round((altResult.score + lazyResult.score + formatResult.score) / 3);

console.log(`Image SEO score: ${overallImageScore}/100`);
console.log(`Alt text issues: ${altResult.issueCount}`);
console.log(`Lazy loading issues: ${lazyResult.issues.length}`);
console.log(`Format optimizations needed: ${formatResult.recommendations.length}`);
```

## API Reference

### `analyzeAltText(input)`

| Parameter            | Type          | Default  | Description                                                                         |
| -------------------- | ------------- | -------- | ----------------------------------------------------------------------------------- |
| `input.images`       | `ImageInfo[]` | required | Array of image objects with `src`, `alt`, and optional `loading`, `width`, `height` |
| `input.keyphrase`    | `string`      | `''`     | Focus keyphrase to check for in alt text                                            |
| `input.minAltLength` | `number`      | `5`      | Minimum character length for meaningful alt text                                    |

Returns `ImageAnalysisResult`:

| Property         | Type           | Description                                             |
| ---------------- | -------------- | ------------------------------------------------------- |
| `score`          | `number`       | Alt text quality score 0–100                            |
| `issues`         | `ImageIssue[]` | Array of detected alt text issues                       |
| `totalImages`    | `number`       | Total number of images analyzed                         |
| `issueCount`     | `number`       | Number of images with at least one issue                |
| `keyphraseInAlt` | `boolean`      | Whether the keyphrase was found in any image's alt text |

---

### `auditLazyLoading(input)`

| Parameter      | Type          | Default  | Description                                                                    |
| -------------- | ------------- | -------- | ------------------------------------------------------------------------------ |
| `input.images` | `ImageInfo[]` | required | Array of image objects with `src`, `loading`, `isAboveFold`, `width`, `height` |

Returns `LazyLoadingAuditResult`:

| Property | Type           | Description                             |
| -------- | -------------- | --------------------------------------- |
| `score`  | `number`       | Lazy loading implementation score 0–100 |
| `issues` | `ImageIssue[]` | Array of detected lazy loading issues   |

---

### `detectFormat(src)`

| Parameter | Type     | Default  | Description                |
| --------- | -------- | -------- | -------------------------- |
| `src`     | `string` | required | Image URL or filename path |

Returns `ImageFormat` (`'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'svg' | 'unknown'`).

---

### `getFormatRecommendation(format)`

| Parameter | Type          | Default  | Description                     |
| --------- | ------------- | -------- | ------------------------------- |
| `format`  | `ImageFormat` | required | The current format of the image |

Returns `FormatAnalysisResult`: `{ format, recommended: ImageFormat[], reason: string, priority: 'high' | 'medium' | 'low' | 'none' }`.

---

### `analyzeImageFormats(input)`

| Parameter      | Type          | Default  | Description                                      |
| -------------- | ------------- | -------- | ------------------------------------------------ |
| `input.images` | `ImageInfo[]` | required | Array of images with at minimum a `src` property |

Returns `FormatAuditResult`:

| Property          | Type                                           | Description                              |
| ----------------- | ---------------------------------------------- | ---------------------------------------- |
| `score`           | `number`                                       | Format optimization score 0–100          |
| `recommendations` | `Array<{ src, current, recommended, reason }>` | Per-image format upgrade recommendations |

---

### `extractImageEntries(html, baseUrl)`

| Parameter | Type     | Default  | Description                                 |
| --------- | -------- | -------- | ------------------------------------------- |
| `html`    | `string` | required | HTML string to parse for `<img>` elements   |
| `baseUrl` | `string` | required | Base URL for resolving relative `src` paths |

Returns `SitemapImage[]`.

---

### `generateImageSitemap(pages)`

| Parameter | Type                 | Default  | Description                                                    |
| --------- | -------------------- | -------- | -------------------------------------------------------------- |
| `pages`   | `ImageSitemapPage[]` | required | Array of `{ pageUrl: string; images: SitemapImage[] }` objects |

Returns `string` — well-formed XML image sitemap with Google's `image:` namespace.

---

### Types

```ts
import type {
  ImageFormat, // 'jpeg' | 'png' | 'webp' | 'avif' | 'gif' | 'svg' | 'unknown'
  ImageInfo, // { src, alt?, loading?, isAboveFold?, width?, height? }
  ImageIssueSeverity, // 'error' | 'warning' | 'info'
  ImageIssue, // { src, type, severity, message }
  ImageAnalysisResult, // { score, issues, totalImages, issueCount, keyphraseInAlt }
  ImageAuditResult, // Combined result from multiple analyzers
  ImageSitemapPage, // { pageUrl: string; images: SitemapImage[] }
  FormatAnalysisResult, // { format, recommended, reason, priority }
  FormatAuditResult, // { score, recommendations }
  LazyLoadingAuditResult, // { score, issues }
  SitemapImage, // { loc, title?, caption? }
} from '@power-seo/images';
```

## The @power-seo Ecosystem

`@power-seo/images` is part of the **@power-seo** monorepo — a complete, modular SEO toolkit for modern JavaScript applications.

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

---

## About CyberCraft Bangladesh

**CyberCraft Bangladesh** is a Bangladesh-based enterprise-grade software engineering company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

|                      |                                                                |
| -------------------- | -------------------------------------------------------------- |
| **Website**          | [ccbd.dev](https://ccbd.dev)                                   |
| **GitHub**           | [github.com/cybercraftbd](https://github.com/cybercraftbd)     |
| **npm Organization** | [npmjs.com/org/power-seo](https://www.npmjs.com/org/power-seo) |
| **Email**            | [info@ccbd.dev](mailto:info@ccbd.dev)                          |

© 2026 CyberCraft Bangladesh · Released under the [MIT License](../../LICENSE)
