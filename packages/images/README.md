# @power-seo/images

![Image SEO toolkit banner — alt text audit, lazy loading checks, WebP/AVIF recommendations, image sitemaps](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/images/banner.svg)

Alt text auditing, CWV-aware lazy loading checks, WebP/AVIF format recommendations, and image sitemap XML generation with the `<image:image>` extension.

[![npm version](https://img.shields.io/npm/v/@power-seo/images)](https://www.npmjs.com/package/@power-seo/images)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/images)](https://www.npmjs.com/package/@power-seo/images)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/images)](https://socket.dev/npm/package/@power-seo/images)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/images)

`@power-seo/images` is a TypeScript image SEO analysis library for developers who need programmatic answers to "are my images hurting rankings and Core Web Vitals?" It audits alt text quality (missing, too short, too long, filename-as-alt, duplicates, redundant prefixes, keyphrase presence), flags lazy-loading mistakes that damage LCP and CLS, recommends WebP/AVIF upgrades for legacy formats, and generates Google-compliant image sitemap XML. Pure computation on the `ImageInfo[]` you pass in — it runs in Node.js, Edge runtimes, CI pipelines, and the browser alike.

![Image SEO analysis pipeline — ImageInfo input flowing through alt text, lazy loading, format, and sitemap analyzers](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/images/header.svg)

---

## Why @power-seo/images?

|                    | Without               | With                                                                            |
| ------------------ | --------------------- | ------------------------------------------------------------------------------- |
| Alt text quality   | ❌ Spot-check by hand | ✅ 8 issue checks: missing, short, long, filename, duplicate, prefix, keyphrase |
| CWV-aware loading  | ❌ Generic advice     | ✅ Above/below-fold-aware `loading="lazy"` audit                                |
| Layout stability   | ❌ Unknown CLS risk   | ✅ Flags images missing explicit `width`/`height`                               |
| Format detection   | ❌ Manual             | ✅ JPEG/PNG/GIF/BMP/TIFF/ICO → WebP/AVIF/SVG recommendations                    |
| Image sitemap      | ❌ Write XML manually | ✅ Standards-compliant `image:` namespace XML, entity-escaped                   |
| Scoring            | ❌ None               | ✅ Per-image alt text scores (10 points each) with page totals                  |
| LCP protection     | ❌ Unknown            | ✅ Flags hero images incorrectly marked `loading="lazy"`                        |
| TypeScript support | ❌ Untyped            | ✅ Full type coverage for all inputs and results                                |

![Workflow comparison: manual image review steps versus a single automated pass with power-seo images functions](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/images/roi.svg)

---

## Features

- **Alt text audit** — `analyzeAltText(images, focusKeyphrase?)` detects missing alt attributes, alt text under 5 characters, alt text over 125 characters, redundant prefixes ("image of", "photo of", …), filename patterns used as alt text (`IMG_1234`, `Screenshot 2024…`), duplicate alt text across images, and whether the focus keyphrase appears in at least one alt attribute
- **Decorative image awareness** — `alt=""` is treated as valid decorative markup (`pass` severity), not an error
- **CWV-aware lazy loading audit** — `auditLazyLoading(images)` flags above-the-fold images with `loading="lazy"` (delays LCP), below-the-fold images missing `loading="lazy"`, missing `decoding` attributes, missing `width`/`height` (CLS risk), images wider than 600px without `srcset`, and `srcset` without a `sizes` attribute
- **Format detection** — `detectFormat(src)` identifies jpeg, png, gif, webp, avif, svg, bmp, ico, and tiff from the URL extension, ignoring query strings and hashes
- **Format recommendation engine** — `getFormatRecommendation(format)` returns a concrete upgrade suggestion per legacy format (JPEG/PNG → WebP or AVIF, animated GIF → WebP or MP4, SVG favicons over ICO)
- **Batch format analysis** — `analyzeImageFormats(images)` counts modern (webp, avif, svg) versus legacy formats and returns per-image `FormatAnalysisResult` entries
- **Sitemap entry extraction** — `extractImageEntries(pageUrl, images)` resolves relative image URLs against the page URL and maps alt text to sitemap `caption`/`title`
- **Image sitemap generation** — `generateImageSitemap(pages)` produces valid XML using Google's `image:` namespace with `<image:loc>`, `<image:caption>`, and `<image:title>`, with all values XML-entity-escaped
- **Severity-leveled issues** — every issue carries `'error' | 'warning' | 'info' | 'pass'` for triage and filtering
- **Type-safe throughout** — complete TypeScript types for all inputs, outputs, formats, and issue structures

![Image audit dashboard UI showing alt text issues, lazy loading warnings, and format recommendations](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/images/audit-ui.svg)

---

## Comparison

![Feature comparison of @power-seo/images with sharp, Lighthouse, next/image, and imagemin for image SEO auditing](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/images/comparison.svg)

| Feature                      | @power-seo/images |  sharp  | Lighthouse | next/image | imagemin |
| ---------------------------- | :---------------: | :-----: | :--------: | :--------: | :------: |
| Alt text quality audit       |        ✅         |   ❌    |  Partial   |     ❌     |    ❌    |
| CWV-aware lazy loading audit |        ✅         |   ❌    |  Partial   |     ❌     |    ❌    |
| Format recommendations       |        ✅         |   ❌    |  Partial   |     ✅     | Partial  |
| Image sitemap generation     |        ✅         |   ❌    |     ❌     |     ❌     |    ❌    |
| Severity-leveled issues      |        ✅         |   ❌    |     ✅     |     ❌     |    ❌    |
| Programmatic API             |        ✅         |   ✅    |  Partial   |     ✅     |    ✅    |
| No third-party dependencies  |        ✅         |   ❌    |     ❌     |     ❌     |    ❌    |
| TypeScript-first             |        ✅         | Partial |     ❌     |     ✅     |    ❌    |

`@power-seo/images` analyzes and reports — it does not transcode pixels. Pair it with `sharp` or your CDN's image pipeline to act on the format recommendations it produces.

![Image format detection accuracy across jpeg, png, gif, webp, avif, svg, bmp, ico, and tiff extensions](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/images/format-accuracy.svg)

---

## Installation

```bash
npm install @power-seo/images
```

```bash
yarn add @power-seo/images
```

```bash
pnpm add @power-seo/images
```

Requires Node.js >= 18. Ships dual ESM + CJS builds; the only runtime dependency is [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core).

---

## Usage

### How do I audit image alt text for SEO?

Call `analyzeAltText(images, focusKeyphrase?)` with an array of `ImageInfo` objects. Each image is scored out of 10 (errors subtract 5, warnings subtract 2), and the page total is the sum, with `maxScore` equal to 10 × the image count. A missing `alt` property is an `error`; `alt=""` is treated as a valid decorative image and passes. If you pass a focus keyphrase and no image contains it in its alt text, an `info` issue is added.

```ts
import { analyzeAltText } from '@power-seo/images';
import type { ImageAuditResult, ImageIssue } from '@power-seo/images';

const result: ImageAuditResult = analyzeAltText(
  [
    { src: '/hero.jpg' }, // alt-missing (error)
    { src: '/icon.png', alt: 'i' }, // alt-too-short (warning)
    { src: '/IMG_9821.jpg', alt: 'IMG_9821' }, // alt-filename (warning)
    { src: '/photo.jpg', alt: 'Photo of our office' }, // alt-redundant-prefix (warning)
    { src: '/product.webp', alt: 'Blue widget on white background' }, // alt-good (pass), has keyphrase
    { src: '/bg.jpg', alt: '' }, // alt-decorative (pass)
  ],
  'blue widget',
);

result.issues.forEach((issue: ImageIssue) => {
  console.log(`[${issue.severity}] ${issue.id}: ${issue.description}`);
});

console.log(`Score: ${result.score}/${result.maxScore}`); // 49/60
console.log(result.recommendations);
// ['Fix 1 critical alt text issue(s): missing alt attributes.',
//  'Address 3 alt text warning(s) to improve accessibility and SEO.']
```

All detected alt text issue IDs:

| Issue ID               | Severity  | Trigger                                                              |
| ---------------------- | --------- | -------------------------------------------------------------------- |
| `alt-missing`          | `error`   | No `alt` property at all                                             |
| `alt-decorative`       | `pass`    | `alt=""` — valid for purely decorative images                        |
| `alt-too-short`        | `warning` | Alt text shorter than 5 characters                                   |
| `alt-too-long`         | `warning` | Alt text longer than 125 characters                                  |
| `alt-redundant-prefix` | `warning` | Starts with "image of", "photo of", "picture of", etc.               |
| `alt-filename`         | `warning` | Matches a camera/screenshot filename pattern (`IMG_1234`, `DSC0001`) |
| `alt-duplicate`        | `warning` | Identical alt text used on more than one image                       |
| `alt-no-keyphrase`     | `info`    | Focus keyphrase given but found in no image's alt text               |
| `alt-good`             | `pass`    | No problems found for this image                                     |

### How do I find lazy-loading mistakes that hurt LCP and CLS?

Call `auditLazyLoading(images)` with `loading`, `isAboveFold`, `width`, `height`, `srcset`, and `sizes` populated where known. Above-the-fold images with `loading="lazy"` are flagged as errors because they delay Largest Contentful Paint; below-the-fold images without it are warnings. Missing explicit dimensions is a warning (Cumulative Layout Shift risk), and responsive-image gaps (`srcset` without `sizes`, wide images without `srcset`) are also reported.

```ts
import { auditLazyLoading } from '@power-seo/images';
import type { LazyLoadingAuditResult } from '@power-seo/images';

const result: LazyLoadingAuditResult = auditLazyLoading([
  // Above fold — must NOT be lazy-loaded (LCP risk)
  { src: '/hero.jpg', loading: 'lazy', isAboveFold: true, width: 1200, height: 630 },
  // Below fold — SHOULD be lazy-loaded (bandwidth saving)
  { src: '/section2.jpg', isAboveFold: false, width: 800, height: 500 },
  // Good: above fold, eagerly loaded, async decode
  {
    src: '/logo.png',
    loading: 'eager',
    decoding: 'async',
    isAboveFold: true,
    width: 200,
    height: 60,
  },
  // Missing dimensions — causes CLS
  { src: '/promo.jpg', loading: 'lazy', isAboveFold: false },
]);

result.issues.forEach((issue) => {
  console.log(`[${issue.severity}] ${issue.title}: ${issue.description}`);
});
console.log(result.recommendations);
// ['Remove loading="lazy" from 1 above-fold image(s) to improve LCP.', ...]
```

All lazy loading issue IDs:

| Issue ID                  | Severity  | Trigger                                                |
| ------------------------- | --------- | ------------------------------------------------------ |
| `lazy-above-fold`         | `error`   | `isAboveFold: true` with `loading="lazy"` — delays LCP |
| `lazy-missing-below-fold` | `warning` | `isAboveFold: false` without `loading="lazy"`          |
| `dimensions-missing`      | `warning` | Missing `width` or `height` — CLS risk                 |
| `sizes-missing`           | `warning` | Has `srcset` but no `sizes` attribute                  |
| `decoding-missing`        | `info`    | No `decoding` attribute — suggest `decoding="async"`   |
| `srcset-missing`          | `info`    | Wider than 600px with no `srcset` responsive variants  |

![Core Web Vitals benefit of correct image loading — improved LCP and eliminated CLS from explicit dimensions](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/images/cwv-benefit.svg)

### How do I detect image formats and get WebP/AVIF recommendations?

Use `detectFormat(src)` for a single URL — it strips query strings and hashes, then maps the file extension to an `ImageFormat` (`jpg`/`jpeg` → `'jpeg'`, `tif`/`tiff` → `'tiff'`, unrecognized → `'unknown'`). `getFormatRecommendation(format)` returns an upgrade suggestion for legacy formats and `undefined` for modern ones (webp, avif, svg).

```ts
import { detectFormat, getFormatRecommendation } from '@power-seo/images';
import type { ImageFormat } from '@power-seo/images';

const format: ImageFormat = detectFormat('/images/hero.jpg?v=2');
// 'jpeg' — query string ignored

detectFormat('https://example.com/icon.png'); // 'png'
detectFormat('/animation.gif'); // 'gif'
detectFormat('/photo.webp'); // 'webp'
detectFormat('/image.avif'); // 'avif'
detectFormat('/logo.svg'); // 'svg'
detectFormat('/no-extension'); // 'unknown'

getFormatRecommendation('jpeg');
// 'Convert to WebP or AVIF for 25-50% smaller file sizes with equivalent quality.'
getFormatRecommendation('gif');
// 'Convert animated GIFs to WebP or MP4 video for dramatically smaller file sizes.'
getFormatRecommendation('webp');
// undefined — already modern
```

### How do I audit all image formats on a page at once?

`analyzeImageFormats(images)` runs format detection over the whole array (using each image's explicit `format` property when present, falling back to `detectFormat(src)`), counts modern versus legacy formats, and returns a per-image breakdown plus a summary recommendation when any legacy formats remain.

```ts
import { analyzeImageFormats } from '@power-seo/images';
import type { FormatAuditResult } from '@power-seo/images';

const result: FormatAuditResult = analyzeImageFormats([
  { src: '/hero.jpg' },
  { src: '/thumbnail.png' },
  { src: '/animation.gif' },
  { src: '/logo.svg' },
  { src: '/banner.webp' },
]);

console.log(`Modern: ${result.modernFormatCount}, legacy: ${result.legacyFormatCount}`);
// Modern: 2, legacy: 3

result.results.forEach((item) => {
  if (!item.isModern && item.recommendation) {
    console.log(`${item.src} (${item.currentFormat}): ${item.recommendation}`);
  }
});

console.log(result.recommendations);
// ['3 of 5 images use legacy formats. Convert to WebP or AVIF for better performance.']
```

### How do I generate a Google image sitemap in XML?

Pass an array of `ImageSitemapPage` objects — each with a `pageUrl` and its `ImageInfo[]` — to `generateImageSitemap(pages)`. Relative image `src` values are resolved against the page URL, alt text is emitted as both `<image:caption>` and `<image:title>`, all values are XML-entity-escaped, and pages with no valid images are skipped. The output uses Google's `http://www.google.com/schemas/sitemap-image/1.1` namespace.

```ts
import { generateImageSitemap } from '@power-seo/images';
import type { ImageSitemapPage } from '@power-seo/images';

const pages: ImageSitemapPage[] = [
  {
    pageUrl: 'https://example.com/products/widget',
    images: [
      { src: '/products/widget.jpg', alt: 'Blue widget' },
      { src: '/products/widget-detail.webp', alt: 'Widget detail view' },
    ],
  },
  {
    pageUrl: 'https://example.com/products/gadget',
    images: [{ src: '/products/gadget.jpg', alt: 'Premium gadget' }],
  },
];

const sitemapXml = generateImageSitemap(pages);
// Write to public/image-sitemap.xml and reference it from robots.txt
```

To build entries without serializing XML — for example to feed [`@power-seo/sitemap`](https://www.npmjs.com/package/@power-seo/sitemap) — use `extractImageEntries`:

```ts
import { extractImageEntries } from '@power-seo/images';

const entries = extractImageEntries('https://example.com/products/widget', [
  { src: '/products/widget.jpg', alt: 'Blue widget' },
]);
// [{ loc: 'https://example.com/products/widget.jpg', caption: 'Blue widget', title: 'Blue widget' }]
```

### How do I run a full image audit on a page?

Combine the three analyzers over the same `ImageInfo[]` for a complete image health report.

```ts
import { analyzeAltText, auditLazyLoading, analyzeImageFormats } from '@power-seo/images';
import type { ImageInfo } from '@power-seo/images';

const images: ImageInfo[] = [
  {
    src: '/blog/hero.jpg',
    alt: 'Article hero image',
    loading: 'eager',
    isAboveFold: true,
    width: 1200,
    height: 630,
  },
  { src: '/blog/section1.webp', loading: 'lazy', isAboveFold: false, width: 800, height: 400 },
  {
    src: '/blog/my-post-topic.jpg',
    alt: 'My post topic illustration',
    loading: 'lazy',
    isAboveFold: false,
    width: 600,
    height: 400,
  },
];

const altResult = analyzeAltText(images, 'my post topic');
const lazyResult = auditLazyLoading(images);
const formatResult = analyzeImageFormats(images);

console.log(`Alt text score: ${altResult.score}/${altResult.maxScore}`);
console.log(`Lazy loading issues: ${lazyResult.issues.length}`);
console.log(`Legacy formats: ${formatResult.legacyFormatCount}/${formatResult.totalImages}`);
```

---

## API Reference

### `analyzeAltText(images, focusKeyphrase?)`

```ts
function analyzeAltText(images: ImageInfo[], focusKeyphrase?: string): ImageAuditResult;
```

| Parameter        | Type          | Default  | Description                                                     |
| ---------------- | ------------- | -------- | --------------------------------------------------------------- |
| `images`         | `ImageInfo[]` | required | Images to audit; at minimum each needs `src`                    |
| `focusKeyphrase` | `string`      | —        | If set, checks that it appears in at least one image's alt text |

Returns `ImageAuditResult`:

| Property          | Type                    | Description                                                   |
| ----------------- | ----------------------- | ------------------------------------------------------------- |
| `totalImages`     | `number`                | Number of images analyzed                                     |
| `score`           | `number`                | Sum of per-image scores (each 0–10); `100` for an empty input |
| `maxScore`        | `number`                | `10 ×` image count (`100` for an empty input)                 |
| `issues`          | `ImageIssue[]`          | All issues, including `pass` entries                          |
| `perImage`        | `ImageAnalysisResult[]` | `{ src, issues, score, maxScore }` per image                  |
| `recommendations` | `string[]`              | Aggregated fix suggestions for errors and warnings            |

Per-image scoring: `score = max(0, 10 − 5 × errors − 2 × warnings)`.

### `auditLazyLoading(images)`

```ts
function auditLazyLoading(images: ImageInfo[]): LazyLoadingAuditResult;
```

| Parameter | Type          | Default  | Description                                                                            |
| --------- | ------------- | -------- | -------------------------------------------------------------------------------------- |
| `images`  | `ImageInfo[]` | required | Images with `loading`, `decoding`, `isAboveFold`, `width`, `height`, `srcset`, `sizes` |

Returns `LazyLoadingAuditResult` — `{ totalImages, issues, recommendations }`. Fold checks only fire when `isAboveFold` is explicitly `true` (for `lazy-above-fold`) or `false` (for `lazy-missing-below-fold`); images with `isAboveFold` undefined skip both.

### `detectFormat(src)`

```ts
function detectFormat(src: string): ImageFormat;
```

| Parameter | Type     | Default  | Description                                          |
| --------- | -------- | -------- | ---------------------------------------------------- |
| `src`     | `string` | required | Image URL or path; query string and hash are ignored |

Returns `ImageFormat`. Recognized extensions: `jpg`, `jpeg`, `png`, `gif`, `webp`, `avif`, `svg`, `bmp`, `ico`, `tiff`, `tif`; anything else returns `'unknown'`.

### `getFormatRecommendation(format)`

```ts
function getFormatRecommendation(format: ImageFormat): string | undefined;
```

| Parameter | Type          | Default  | Description          |
| --------- | ------------- | -------- | -------------------- |
| `format`  | `ImageFormat` | required | Current image format |

Returns a recommendation string for `jpeg`, `png`, `gif`, `bmp`, `tiff`, and `ico`; returns `undefined` for `webp`, `avif`, `svg`, and `unknown`.

### `analyzeImageFormats(images)`

```ts
function analyzeImageFormats(images: ImageInfo[]): FormatAuditResult;
```

| Parameter | Type          | Default  | Description                                                                |
| --------- | ------------- | -------- | -------------------------------------------------------------------------- |
| `images`  | `ImageInfo[]` | required | Uses each image's `format` property when set, else `detectFormat(img.src)` |

Returns `FormatAuditResult` — `{ totalImages, modernFormatCount, legacyFormatCount, results, recommendations }`. Modern formats are `webp`, `avif`, and `svg`; everything else (including `unknown`) counts as legacy.

### `extractImageEntries(pageUrl, images)`

```ts
function extractImageEntries(pageUrl: string, images: ImageInfo[]): SitemapImage[];
```

| Parameter | Type          | Default  | Description                                                  |
| --------- | ------------- | -------- | ------------------------------------------------------------ |
| `pageUrl` | `string`      | required | Page URL used to resolve relative image `src` values         |
| `images`  | `ImageInfo[]` | required | Images to convert; entries with empty `src` are filtered out |

Returns `SitemapImage[]` — `{ loc, caption?, title? }`, where `caption` and `title` are both populated from the image's `alt` when present.

### `generateImageSitemap(pages)`

```ts
function generateImageSitemap(pages: ImageSitemapPage[]): string;
```

| Parameter | Type                 | Default  | Description                                        |
| --------- | -------------------- | -------- | -------------------------------------------------- |
| `pages`   | `ImageSitemapPage[]` | required | `{ pageUrl: string; images: ImageInfo[] }` objects |

Returns a well-formed XML string using the `http://www.google.com/schemas/sitemap-image/1.1` namespace. Page URLs are normalized, all values are XML-entity-escaped, and pages whose images all have empty `src` are omitted.

---

## Types

```ts
import type {
  ImageFormat, // 'jpeg' | 'png' | 'gif' | 'webp' | 'avif' | 'svg' | 'bmp' | 'ico' | 'tiff' | 'unknown'
  ImageInfo, // { src, alt?, width?, height?, fileSize?, format?, loading?, decoding?, srcset?, sizes?, isAboveFold? }
  ImageIssueSeverity, // 'error' | 'warning' | 'info' | 'pass'
  ImageIssue, // { id, title, description, severity, image? }
  ImageAnalysisResult, // { src, issues, score, maxScore } — one per image
  ImageAuditResult, // { totalImages, score, maxScore, issues, perImage, recommendations }
  ImageSitemapPage, // { pageUrl: string; images: ImageInfo[] }
  FormatAnalysisResult, // { src, currentFormat, isModern, recommendation? }
  FormatAuditResult, // { totalImages, modernFormatCount, legacyFormatCount, results, recommendations }
  LazyLoadingAuditResult, // { totalImages, issues, recommendations }
  SitemapImage, // { loc, title?, caption?, license? } — re-exported from @power-seo/core
} from '@power-seo/images';
```

---

## Use Cases

- **E-commerce platforms** — audit product image alt text and format optimization at scale before publishing
- **CMS integrations** — validate image SEO health before content goes live; surface severity-leveled issues to authors
- **CI pipelines** — fail a build when above-fold images are lazy-loaded or alt attributes are missing
- **Image sitemap automation** — regenerate the Google image sitemap on every content change
- **Core Web Vitals optimization** — find LCP-damaging lazy hero images and CLS-causing missing dimensions across all pages
- **Site audits** — feed results into [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit) reports alongside meta and content rules

---

## Architecture Overview

- **Analysis, not transformation** — inspects `ImageInfo` metadata you collect (from your CMS, crawler, or DOM); it never fetches or decodes image bytes
- **Framework-agnostic** — works in Next.js, Remix, Vite, and plain Node.js
- **SSR and Edge safe** — no browser-specific or Node-specific APIs; runs in Cloudflare Workers, Vercel Edge, and Deno
- **Tree-shakeable** — `"sideEffects": false` with one named export per analyzer
- **Dual ESM + CJS** — ships both formats via tsup for any bundler or `require()` usage
- **Only in-house dependencies** — the single runtime dependency is [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core) (URL utilities and the shared `SitemapImage` type)

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

image SEO, alt text checker, alt text audit, lazy loading audit, image sitemap generator, WebP conversion, AVIF, image format optimization, Core Web Vitals, LCP optimization, CLS prevention, image accessibility, Google image search, image optimization TypeScript, Next.js image SEO, srcset audit, decorative images, image audit library

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
