# @power-seo/audit — Full SEO Audit Engine for Pages and Sites

Comprehensive SEO auditing with 0–100 scoring across four rule categories: meta tags, content quality, structural correctness, and performance optimization.

[![npm version](https://img.shields.io/npm/v/@power-seo/audit?style=flat-square)](https://www.npmjs.com/package/@power-seo/audit)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/audit?style=flat-square)](https://www.npmjs.com/package/@power-seo/audit)
[![MIT License](https://img.shields.io/npm/l/@power-seo/audit?style=flat-square)](../../LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen?style=flat-square)](#)

`@power-seo/audit` is a production-grade SEO audit engine that evaluates pages against a structured rule set and returns scored, actionable reports. A single call to `auditPage` produces a 0–100 overall score plus per-category breakdowns across meta tags, content quality, document structure, and performance — along with an issue list where every item carries a severity level (`error`, `warning`, `info`) and a human-readable message.

For site-wide audits, `auditSite` accepts an array of page inputs and returns an aggregated report with an average score, top-recurring issues across all pages, and individual page results. This makes it straightforward to build an SEO dashboard, a CI gate, or an automated reporting pipeline.

The four rule sets can also be called independently — `runMetaRules`, `runContentRules`, `runStructureRules`, and `runPerformanceRules` — so you can selectively run only the rules relevant to your use case without paying for the full audit overhead.

## Features

- **Single-page audit** — `auditPage(input)` returns an overall 0–100 score and a `categories` object with individual scores for meta, content, structure, and performance
- **Site-wide audit** — `auditSite(input)` audits multiple pages and returns aggregated average score, top issues by frequency, and per-page results
- **Meta rules** — title presence and length (50–60 chars), meta description presence and length (120–158 chars), canonical tag validation, robots meta directives, Open Graph completeness (og:title, og:description, og:image, og:url)
- **Content rules** — word count thresholds (thin content detection), focus keyphrase presence in title/description/first paragraph/headings, keyphrase density analysis, readability score integration
- **Structure rules** — single H1 validation, heading hierarchy (no skipped levels), image alt text completeness, internal link count, external link presence, JSON-LD schema validation
- **Performance rules** — image format optimization recommendations (JPEG vs WebP/AVIF), missing width/height attributes on images, absence of resource hints (`preconnect`, `preload`), unoptimized third-party script patterns
- **Three severity levels** — `error` (critical issues that directly hurt rankings), `warning` (sub-optimal practices), `info` (improvement opportunities)
- **Category-level scores** — each of the four categories produces its own 0–100 score so you can prioritize by weakest category
- **Composable rule sets** — call individual rule runners (`runMetaRules`, `runContentRules`, `runStructureRules`, `runPerformanceRules`) for selective auditing
- **Type-safe throughout** — complete TypeScript types for inputs, results, issues, categories, and severities
- **Zero network calls** — entirely local, synchronous computation; no external API required

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Page Audit](#page-audit)
  - [Site Audit](#site-audit)
  - [Individual Rule Sets](#individual-rule-sets)
  - [Processing Audit Issues](#processing-audit-issues)
  - [Using with CI/CD](#using-with-cicd)
- [API Reference](#api-reference)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
# npm
npm install @power-seo/audit

# yarn
yarn add @power-seo/audit

# pnpm
pnpm add @power-seo/audit
```

## Quick Start

```ts
import { auditPage } from '@power-seo/audit';

const result = auditPage({
  url: 'https://example.com/blog/react-seo-guide',
  title: 'React SEO Guide — Best Practices for 2026',
  metaDescription: 'Learn how to optimize React applications for search engines with meta tags, structured data, and Core Web Vitals improvements.',
  canonical: 'https://example.com/blog/react-seo-guide',
  robots: 'index, follow',
  content: '<h1>React SEO Guide</h1><p>Search engine optimization for React apps...</p>',
  headings: [
    { level: 1, text: 'React SEO Guide' },
    { level: 2, text: 'Why SEO Matters for React' },
    { level: 2, text: 'Meta Tags in React' },
  ],
  images: [
    { src: '/hero.webp', alt: 'React SEO guide illustration', width: 1200, height: 630 },
  ],
  links: {
    internal: ['/blog', '/docs/meta-tags'],
    external: ['https://developers.google.com/search'],
  },
  keyphrase: 'react seo',
  wordCount: 1850,
});

console.log(result.score);       // e.g. 84
console.log(result.categories);  // { meta: 90, content: 82, structure: 88, performance: 75 }
console.log(result.issues);
// [
//   { rule: 'meta-description-length', severity: 'info', message: 'Meta description is 162 chars — aim for 120–158' },
//   { rule: 'image-format', severity: 'warning', message: 'Consider using AVIF for /hero.webp' },
// ]
```

## Usage

### Page Audit

`auditPage` is the primary entry point for single-page evaluation. It runs all four rule sets and computes a weighted overall score.

```ts
import { auditPage } from '@power-seo/audit';
import type { PageAuditInput, PageAuditResult } from '@power-seo/audit';

const input: PageAuditInput = {
  url: 'https://example.com/products/widget',
  title: 'Premium Widget — Buy Online | Example',
  metaDescription: 'Buy our premium widget online. Free shipping on orders over $50. Trusted by 10,000+ customers.',
  canonical: 'https://example.com/products/widget',
  robots: 'index, follow',
  og: {
    title: 'Premium Widget',
    description: 'Buy our premium widget with free shipping.',
    image: 'https://example.com/images/widget-og.jpg',
    url: 'https://example.com/products/widget',
  },
  content: '<h1>Premium Widget</h1><p>Our best-selling product...</p>',
  headings: [
    { level: 1, text: 'Premium Widget' },
    { level: 2, text: 'Features' },
    { level: 2, text: 'Customer Reviews' },
  ],
  images: [
    { src: '/images/widget.jpg', alt: 'Premium widget product photo', width: 800, height: 600 },
    { src: '/images/widget-detail.jpg', alt: '', width: 400, height: 300 },
  ],
  links: {
    internal: ['/products', '/cart', '/about'],
    external: [],
  },
  schema: { '@type': 'Product', name: 'Premium Widget' },
  keyphrase: 'premium widget',
  wordCount: 620,
};

const result: PageAuditResult = auditPage(input);

// Filter by severity
const errors = result.issues.filter((i) => i.severity === 'error');
const warnings = result.issues.filter((i) => i.severity === 'warning');

console.log(`Score: ${result.score}/100`);
console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}`);
```

### Site Audit

`auditSite` runs page audits across an entire array of pages and returns aggregated statistics.

```ts
import { auditSite } from '@power-seo/audit';
import type { SiteAuditInput, SiteAuditResult } from '@power-seo/audit';

const siteInput: SiteAuditInput = {
  pages: [page1Input, page2Input, page3Input],
};

const report: SiteAuditResult = auditSite(siteInput);

console.log(`Average score: ${report.averageScore}/100`);
console.log(`Pages audited: ${report.pageCount}`);
console.log('Top issues across site:');
report.topIssues.forEach(({ rule, occurrences, severity }) => {
  console.log(`  ${rule}: ${occurrences} pages affected [${severity}]`);
});

// Access individual page results
report.pages.forEach(({ url, score, issues }) => {
  console.log(`${url}: ${score}/100 (${issues.length} issues)`);
});
```

### Individual Rule Sets

Run only the rules you need without executing the full audit pipeline.

```ts
import { runMetaRules, runContentRules, runStructureRules, runPerformanceRules } from '@power-seo/audit';
import type { PageAuditInput, CategoryResult } from '@power-seo/audit';

const input: PageAuditInput = { /* ... */ };

// Run only meta checks — title, description, canonical, robots, OG
const metaResult: CategoryResult = runMetaRules(input);
console.log(`Meta score: ${metaResult.score}/100`);
metaResult.issues.forEach((issue) => console.log(`  [${issue.severity}] ${issue.message}`));

// Run only content checks — word count, keyphrase, readability
const contentResult: CategoryResult = runContentRules(input);

// Run only structure checks — headings, images, links, schema
const structureResult: CategoryResult = runStructureRules(input);

// Run only performance checks — image formats, resource hints
const perfResult: CategoryResult = runPerformanceRules(input);
```

### Processing Audit Issues

Issues can be filtered, grouped, and sorted for display in dashboards or reports.

```ts
import { auditPage } from '@power-seo/audit';
import type { AuditSeverity } from '@power-seo/audit';

const result = auditPage(input);

// Group issues by category
const byCategory = result.issues.reduce((acc, issue) => {
  const cat = issue.category ?? 'general';
  acc[cat] = acc[cat] ?? [];
  acc[cat].push(issue);
  return acc;
}, {} as Record<string, typeof result.issues>);

// Priority order: errors first, then warnings, then info
const prioritized = [...result.issues].sort((a, b) => {
  const order: Record<AuditSeverity, number> = { error: 0, warning: 1, info: 2 };
  return order[a.severity] - order[b.severity];
});

// Check if page passes a minimum score threshold
const MINIMUM_SCORE = 70;
if (result.score < MINIMUM_SCORE) {
  throw new Error(`SEO audit failed: score ${result.score} is below minimum ${MINIMUM_SCORE}`);
}
```

### Using with CI/CD

Use `auditPage` or `auditSite` in a Node.js CI script to block deployments when scores fall below a threshold.

```ts
// scripts/seo-audit.ts
import { auditSite } from '@power-seo/audit';
import { pages } from './test-pages.js';

const report = auditSite({ pages });

const SCORE_THRESHOLD = 75;
const ALLOWED_ERRORS = 0;

const totalErrors = report.pages.flatMap((p) =>
  p.issues.filter((i) => i.severity === 'error')
).length;

if (report.averageScore < SCORE_THRESHOLD || totalErrors > ALLOWED_ERRORS) {
  console.error(`SEO audit FAILED`);
  console.error(`  Average score: ${report.averageScore} (min: ${SCORE_THRESHOLD})`);
  console.error(`  Critical errors: ${totalErrors} (max: ${ALLOWED_ERRORS})`);
  process.exit(1);
}

console.log(`SEO audit PASSED — average score: ${report.averageScore}/100`);
```

## API Reference

### `auditPage(input)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `input.url` | `string` | required | Canonical URL of the page being audited |
| `input.title` | `string` | required | Page `<title>` tag content |
| `input.metaDescription` | `string` | `''` | Content of the `meta[name="description"]` tag |
| `input.canonical` | `string` | `''` | Canonical URL from `link[rel="canonical"]` |
| `input.robots` | `string` | `''` | Content of `meta[name="robots"]` tag |
| `input.og` | `object` | `{}` | Open Graph tags: `title`, `description`, `image`, `url` |
| `input.content` | `string` | required | Full HTML content of the page body |
| `input.headings` | `Array<{ level: number; text: string }>` | `[]` | All headings extracted from the page |
| `input.images` | `Array<ImageInfo>` | `[]` | Image metadata: `src`, `alt`, `width`, `height`, `loading` |
| `input.links` | `{ internal: string[]; external: string[] }` | required | Categorized page links |
| `input.schema` | `object` | `undefined` | JSON-LD schema object present on the page |
| `input.keyphrase` | `string` | `''` | Focus keyphrase for content analysis |
| `input.wordCount` | `number` | `0` | Total word count of the page body text |

Returns `PageAuditResult`:

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | The audited page URL |
| `score` | `number` | Overall weighted score 0–100 |
| `categories` | `Record<AuditCategory, CategoryResult>` | Per-category scores and issues |
| `issues` | `AuditIssue[]` | Flat array of all issues across all categories |

---

### `auditSite(input)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `input.pages` | `PageAuditInput[]` | required | Array of page audit inputs to evaluate |

Returns `SiteAuditResult`:

| Property | Type | Description |
|----------|------|-------------|
| `averageScore` | `number` | Mean score across all pages (0–100) |
| `pageCount` | `number` | Total number of pages audited |
| `pages` | `PageAuditResult[]` | Individual page audit results |
| `topIssues` | `Array<{ rule, occurrences, severity }>` | Most common issues across all pages |

---

### `runMetaRules(input)` / `runContentRules(input)` / `runStructureRules(input)` / `runPerformanceRules(input)`

Each rule runner accepts a `PageAuditInput` and returns a `CategoryResult`:

| Property | Type | Description |
|----------|------|-------------|
| `score` | `number` | Category score 0–100 |
| `issues` | `AuditIssue[]` | Issues found in this category |

---

### Types

```ts
import type {
  AuditCategory,      // 'meta' | 'content' | 'structure' | 'performance'
  AuditSeverity,      // 'error' | 'warning' | 'info'
  AuditRule,          // { id: string; category: AuditCategory; severity: AuditSeverity; check(input): AuditIssue[] }
  PageAuditInput,     // Full page input object (see auditPage parameters above)
  PageAuditResult,    // { url, score, categories, issues }
  CategoryResult,     // { score: number; issues: AuditIssue[] }
  SiteAuditInput,     // { pages: PageAuditInput[] }
  SiteAuditResult,    // { averageScore, pageCount, pages, topIssues }
} from '@power-seo/audit';
```

## The @power-seo Ecosystem

`@power-seo/audit` is part of the **@power-seo** monorepo — a complete, modular SEO toolkit for modern JavaScript applications.

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
