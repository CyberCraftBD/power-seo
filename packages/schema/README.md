# @power-seo/schema — Type-Safe JSON-LD Structured Data for React, Next.js & Remix — 20 Builders, 18 Components, Schema Graph

[![npm version](https://img.shields.io/npm/v/@power-seo/schema)](https://www.npmjs.com/package/@power-seo/schema)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/schema)](https://www.npmjs.com/package/@power-seo/schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/schema)

---

## Overview

**@power-seo/schema** is a type-safe JSON-LD structured data library for TypeScript developers and React teams that helps you build Google-compliant schema.org markup — with 20 builder functions, 18 pre-built React components, schema graph support, and field validation.

**What it does**

- ✅ **20 schema.org type builders** — Article, FAQPage, Product, LocalBusiness, Event, Recipe, HowTo, VideoObject, Course, JobPosting, and more
- ✅ **18 ready-to-use React components** — `<ArticleJsonLd>`, `<FAQJsonLd>`, `<ProductJsonLd>`, `<BreadcrumbJsonLd>`, and more
- ✅ **Schema graph** — combine multiple schemas into a single `@graph` document with `schemaGraph()`
- ✅ **Field validation** — `validateSchema()` checks required fields and returns `{ valid, errors }` without throwing
- ✅ **Safe serialization** — `toJsonLdString()` for `dangerouslySetInnerHTML`

**What it is not**

- ❌ **Not a Google Search Console validator** — validates field presence, not full Google Rich Results spec compliance
- ❌ **Not a scraper** — does not fetch structured data from external pages

**Recommended for**

- **Next.js App Router pages**, **Remix routes**, **React SSR apps**, and **programmatic SEO sites** targeting Google rich results

---

## Why @power-seo/schema Matters

**The problem**

- **Hand-written JSON-LD has no type checking** — missing required fields like `datePublished` or `author` silently fail Google Rich Results
- **Multiple schemas per page need `@graph`** — without it, Google may only process the first schema it finds
- **Schema types differ** — Article, FAQPage, Product, LocalBusiness each have different required fields and data shapes

**Why developers care**

- **SEO:** Rich results (FAQ dropdowns, star ratings, breadcrumb trails) increase SERP real estate and click-through rates
- **UX:** Rich results improve brand visibility and trust signals in search
- **Performance:** Server-side serialized JSON-LD adds zero client-side JavaScript overhead

---

## Key Features

- **20 schema.org type builder functions** — Article, BlogPosting, NewsArticle, Product, FAQPage, BreadcrumbList, LocalBusiness, Organization, Person, Event, Recipe, HowTo, VideoObject, Course, JobPosting, SoftwareApplication, WebSite, ItemList, Review, Service
- **18 pre-built React components** — `<ArticleJsonLd>`, `<FAQJsonLd>`, `<ProductJsonLd>`, `<BreadcrumbJsonLd>`, `<LocalBusinessJsonLd>`, `<EventJsonLd>`, `<RecipeJsonLd>`, `<HowToJsonLd>`, `<VideoJsonLd>`, `<CourseJsonLd>`, `<JobPostingJsonLd>`, `<SoftwareAppJsonLd>`, `<WebSiteJsonLd>`, `<OrganizationJsonLd>`, `<PersonJsonLd>`, `<ItemListJsonLd>`, `<ReviewJsonLd>`, `<NewsArticleJsonLd>`
- **Generic `<JsonLd>` component** — renders any custom schema object as a JSON-LD script tag
- **`schemaGraph()`** — combine multiple schemas into a single `@graph` document for optimal Google parsing
- **`toJsonLdString()`** — serialize any schema object to a safe JSON-LD string
- **`validateSchema()`** — validate required fields without throwing; returns `{ valid, errors }`
- **React optional** — builder functions work without React; components available via `/react` subpath export
- **Type-safe API** — TypeScript-first with full typed interfaces for every schema type including nested objects
- **Tree-shakeable** — import only the schema types you use

---

## Benefits of Using @power-seo/schema

- **Improved rich result eligibility**: Typed builder functions surface missing required fields at compile time
- **Better SERP visibility**: FAQ dropdowns, product ratings, breadcrumb trails, and job listings in search results
- **Safer implementation**: `validateSchema()` catches missing fields in CI before pages are published
- **Faster delivery**: React components render JSON-LD in one line; no hand-coding script tags

---

## Quick Start

```ts
// Builder function approach (works without React)
import { article, toJsonLdString } from '@power-seo/schema';

const jsonLd = article({
  headline: 'My Blog Post',
  description: 'An informative article about SEO.',
  datePublished: '2026-01-15',
  dateModified: '2026-01-20',
  author: { name: 'Jane Doe', url: 'https://example.com/authors/jane-doe' },
  image: { url: 'https://example.com/article-cover.jpg', width: 1200, height: 630 },
});

const script = toJsonLdString(jsonLd);
// → '{"@context":"https://schema.org","@type":"Article","headline":"My Blog Post",...}'
```

```tsx
// React component approach
import { ArticleJsonLd } from '@power-seo/schema/react';

<ArticleJsonLd
  headline="My Blog Post"
  description="An informative article about SEO."
  datePublished="2026-01-15"
  author={{ name: 'Jane Doe', url: 'https://example.com/authors/jane-doe' }}
  image={{ url: 'https://example.com/cover.jpg', width: 1200, height: 630 }}
/>;
// Renders: <script type="application/ld+json">{"@context":"https://schema.org",...}</script>
```

**What you should see**

- A `<script type="application/ld+json">` tag in the page `<head>` with valid schema.org JSON
- `validateSchema(schema).valid === true` for fully populated schemas

---

## Installation

```bash
npm i @power-seo/schema
# or
yarn add @power-seo/schema
# or
pnpm add @power-seo/schema
# or
bun add @power-seo/schema
```

---

## Framework Compatibility

**Supported**

- ✅ Next.js App Router — use builder functions in `page.tsx`, pass `toJsonLdString()` to `dangerouslySetInnerHTML`
- ✅ Next.js Pages Router — use React components or builder functions in `getServerSideProps`
- ✅ Remix — use builder functions in loaders; render in route components
- ✅ Node.js 18+ — pure TypeScript, no DOM required for builder functions
- ✅ Static site generators — generate JSON-LD at build time

**Environment notes**

- **SSR/SSG:** Fully supported — JSON-LD is serialized server-side
- **Edge runtime:** Builder functions and utilities supported; React components require React runtime
- **Browser-only usage:** Supported for React components; not recommended for builder functions alone

---

## Use Cases

- **Blog posts and articles** — Article/BlogPosting schema for Google Discover and Top Stories eligibility
- **FAQ pages** — FAQPage schema for FAQ dropdown rich results
- **Product pages** — Product schema with offers and aggregate ratings for product rich results
- **Local business sites** — LocalBusiness schema for Google Business Panel and Local Pack
- **Recipe sites** — Recipe schema for rich cards with images, ratings, and cooking time
- **Job boards** — JobPosting schema for Google for Jobs integration
- **Event pages** — Event schema for Google Events rich results
- **Course platforms** — Course schema for education carousels in Google Search
- **Software landing pages** — SoftwareApplication schema for app details in results

---

## Example (Before / After)

```text
Before:
- Hand-written JSON-LD: missing "datePublished" → Article not eligible for rich results
- Multiple schemas in separate <script> tags → Google may only parse the first one
- No TypeScript types → runtime errors when API data shape changes

After (@power-seo/schema):
- article({ headline, datePublished, author }) → TypeScript flags missing required fields
- schemaGraph([article, breadcrumb, org]) → single @graph document, all schemas parsed
- validateSchema(schema).errors → ['Article: datePublished is required'] caught in CI
```

---

## Implementation Best Practices

- **Always use `schemaGraph()`** when rendering multiple schemas on the same page
- **Validate in CI** with `validateSchema()` — catch missing required fields before deploying
- **Use `toJsonLdString()` for `dangerouslySetInnerHTML`** — avoids double-encoding issues
- **Include `publisher` on Article schemas** — required for Google News eligibility
- **Set `aggregateRating.reviewCount`** on Product schemas — minimum threshold for star display

---

## Architecture Overview

**Where it runs**

- **Build-time**: Generate and validate JSON-LD for all static pages; fail CI on validation errors
- **Runtime**: Builder functions in SSR routes produce JSON-LD for each request
- **CI/CD**: Run `validateSchema()` across all schema outputs in pull request checks

**Data flow**

1. **Input**: Typed config objects (article config, FAQ questions, product offers, etc.)
2. **Analysis**: Builder function assembles `@context`, `@type`, and typed properties
3. **Output**: JSON-LD object or serialized string embedded in `<script type="application/ld+json">`
4. **Action**: Google parses schema, evaluates eligibility for rich results in SERP

---

## Features Comparison with Popular Packages

| Capability                    |     next-seo | schema-dts | json-ld | @power-seo/schema |
| ----------------------------- | -----------: | ---------: | ------: | ----------------: |
| Typed builder functions       |           ✅ |         ❌ |      ❌ |                ✅ |
| Ready-to-use React components |           ✅ |         ❌ |      ❌ |                ✅ |
| `@graph` support              |           ❌ |         ❌ |      ❌ |                ✅ |
| Built-in field validation     |           ❌ |         ❌ |      ❌ |                ✅ |
| Works without React           |           ❌ |         ✅ |      ✅ |                ✅ |
| 20+ schema types              | ❌ (partial) |         ✅ |      ✅ |                ✅ |

---

## @power-seo Ecosystem

All 17 packages are independently installable — use only what you need.

| Package                                                                                    | Install                             | Description                                                                |
| ------------------------------------------------------------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------- |
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core)                         | `npm i @power-seo/core`             | Framework-agnostic utilities, types, validators, and constants             |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react)                       | `npm i @power-seo/react`            | React SEO components — meta, Open Graph, Twitter Card, robots, breadcrumbs |
| [`@power-seo/meta`](https://www.npmjs.com/package/@power-seo/meta)                         | `npm i @power-seo/meta`             | SSR meta helpers for Next.js App Router, Remix v2, and generic SSR         |
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema)                     | `npm i @power-seo/schema`           | Type-safe JSON-LD structured data — 20 builders + 18 React components      |
| [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis) | `npm i @power-seo/content-analysis` | Yoast-style SEO content scoring engine with React components               |
| [`@power-seo/readability`](https://www.npmjs.com/package/@power-seo/readability)           | `npm i @power-seo/readability`      | Readability scoring — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI       |
| [`@power-seo/preview`](https://www.npmjs.com/package/@power-seo/preview)                   | `npm i @power-seo/preview`          | SERP, Open Graph, and Twitter/X Card preview generators                    |
| [`@power-seo/sitemap`](https://www.npmjs.com/package/@power-seo/sitemap)                   | `npm i @power-seo/sitemap`          | XML sitemap generation, streaming, index splitting, and validation         |
| [`@power-seo/redirects`](https://www.npmjs.com/package/@power-seo/redirects)               | `npm i @power-seo/redirects`        | Redirect engine with Next.js, Remix, and Express adapters                  |
| [`@power-seo/links`](https://www.npmjs.com/package/@power-seo/links)                       | `npm i @power-seo/links`            | Link graph analysis — orphan detection, suggestions, equity scoring        |
| [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit)                       | `npm i @power-seo/audit`            | Full SEO audit engine — meta, content, structure, performance rules        |
| [`@power-seo/images`](https://www.npmjs.com/package/@power-seo/images)                     | `npm i @power-seo/images`           | Image SEO — alt text, lazy loading, format analysis, image sitemaps        |
| [`@power-seo/ai`](https://www.npmjs.com/package/@power-seo/ai)                             | `npm i @power-seo/ai`               | LLM-agnostic AI prompt templates and parsers for SEO tasks                 |
| [`@power-seo/analytics`](https://www.npmjs.com/package/@power-seo/analytics)               | `npm i @power-seo/analytics`        | Merge GSC + audit data, trend analysis, ranking insights, dashboard        |
| [`@power-seo/search-console`](https://www.npmjs.com/package/@power-seo/search-console)     | `npm i @power-seo/search-console`   | Google Search Console API — OAuth2, service account, URL inspection        |
| [`@power-seo/integrations`](https://www.npmjs.com/package/@power-seo/integrations)         | `npm i @power-seo/integrations`     | Semrush and Ahrefs API clients with rate limiting and pagination           |
| [`@power-seo/tracking`](https://www.npmjs.com/package/@power-seo/tracking)                 | `npm i @power-seo/tracking`         | GA4, Clarity, PostHog, Plausible, Fathom — scripts + consent management    |

### Ecosystem vs alternatives

| Need                    | Common approach            | @power-seo approach                       |
| ----------------------- | -------------------------- | ----------------------------------------- |
| JSON-LD structured data | `next-seo` (limited types) | `@power-seo/schema` — 20 types + graph    |
| React components        | Manual `<script>` tags     | `@power-seo/schema/react` — 18 components |
| Meta tags               | `react-helmet`             | `@power-seo/react` + `@power-seo/meta`    |
| Sitemap                 | `next-sitemap`             | `@power-seo/sitemap` — streaming + index  |

---

## Enterprise Integration

**Multi-tenant SaaS**

- **Tenant-aware schemas**: Inject tenant `organization` into every page's `@graph` dynamically
- **Per-page schema pipelines**: Generate and validate schemas in CI for all content types
- **Compliance**: `validateSchema()` ensures no rich result opportunities are silently missed

**ERP / internal portals**

- Add `Organization` schema to public-facing portals for Knowledge Panel eligibility
- Use `BreadcrumbList` schema on all navigable public pages
- Validate schemas as part of the release pipeline

**Recommended integration pattern**

- Run `validateSchema()` in **CI** for all schema objects
- Fail build on `valid === false` for Article, Product, and FAQ schemas
- Track rich result status in **Google Search Console** after deployment

---

## Scope and Limitations

**This package does**

- ✅ Build typed JSON-LD objects for 20 schema.org types
- ✅ Render JSON-LD `<script>` tags via 18 React components
- ✅ Validate required fields and return structured errors
- ✅ Combine multiple schemas into a single `@graph` document

**This package does not**

- ❌ Guarantee Google Rich Results eligibility (Google's spec changes independently)
- ❌ Fetch schema data from live pages
- ❌ Submit schemas to Google directly — use Google Search Console for testing

---

## API Reference

### Builder Functions

| Function                      | Schema `@type`        | Rich Result Eligible       |
| ----------------------------- | --------------------- | -------------------------- |
| `article(config)`             | `Article`             | Yes — Article rich results |
| `blogPosting(config)`         | `BlogPosting`         | Yes — Article rich results |
| `newsArticle(config)`         | `NewsArticle`         | Yes — Top Stories          |
| `faqPage(config)`             | `FAQPage`             | Yes — FAQ rich results     |
| `product(config)`             | `Product`             | Yes — Product rich results |
| `breadcrumbList(config)`      | `BreadcrumbList`      | Yes — Breadcrumbs in SERP  |
| `localBusiness(config)`       | `LocalBusiness`       | Yes — Local Business panel |
| `organization(config)`        | `Organization`        | Yes — Knowledge Panel      |
| `person(config)`              | `Person`              | Yes — Knowledge Panel      |
| `event(config)`               | `Event`               | Yes — Event rich results   |
| `recipe(config)`              | `Recipe`              | Yes — Recipe rich results  |
| `howTo(config)`               | `HowTo`               | Yes — How-to rich results  |
| `videoObject(config)`         | `VideoObject`         | Yes — Video rich results   |
| `course(config)`              | `Course`              | Yes — Course rich results  |
| `jobPosting(config)`          | `JobPosting`          | Yes — Job Posting results  |
| `softwareApplication(config)` | `SoftwareApplication` | Yes — App rich results     |
| `webSite(config)`             | `WebSite`             | Yes — Sitelinks Searchbox  |
| `itemList(config)`            | `ItemList`            | Yes — Carousel results     |
| `review(config)`              | `Review`              | Yes — Review snippet       |
| `service(config)`             | `Service`             | Partial                    |

### React Components

| Component               | Prop Type                     | Description                        |
| ----------------------- | ----------------------------- | ---------------------------------- |
| `<ArticleJsonLd>`       | `ArticleConfig`               | Article / BlogPosting schema       |
| `<NewsArticleJsonLd>`   | `NewsArticleConfig`           | NewsArticle schema for Top Stories |
| `<FAQJsonLd>`           | `{ questions: FAQItem[] }`    | FAQPage schema                     |
| `<ProductJsonLd>`       | `ProductConfig`               | Product with offers and ratings    |
| `<BreadcrumbJsonLd>`    | `{ items: BreadcrumbItem[] }` | BreadcrumbList schema              |
| `<LocalBusinessJsonLd>` | `LocalBusinessConfig`         | LocalBusiness schema               |
| `<OrganizationJsonLd>`  | `OrganizationConfig`          | Organization schema                |
| `<PersonJsonLd>`        | `PersonConfig`                | Person schema                      |
| `<EventJsonLd>`         | `EventConfig`                 | Event schema                       |
| `<RecipeJsonLd>`        | `RecipeConfig`                | Recipe schema                      |
| `<HowToJsonLd>`         | `HowToConfig`                 | HowTo schema                       |
| `<VideoJsonLd>`         | `VideoObjectConfig`           | VideoObject schema                 |
| `<CourseJsonLd>`        | `CourseConfig`                | Course schema                      |
| `<JobPostingJsonLd>`    | `JobPostingConfig`            | JobPosting schema                  |
| `<SoftwareAppJsonLd>`   | `SoftwareApplicationConfig`   | SoftwareApplication schema         |
| `<WebSiteJsonLd>`       | `WebSiteConfig`               | WebSite with SearchAction          |
| `<ItemListJsonLd>`      | `ItemListConfig`              | ItemList schema                    |
| `<ReviewJsonLd>`        | `ReviewConfig`                | Review schema                      |
| `<JsonLd>`              | `{ schema: object }`          | Generic — any schema object        |

### Utilities

| Function         | Signature                                                  | Description                             |
| ---------------- | ---------------------------------------------------------- | --------------------------------------- |
| `toJsonLdString` | `(schema: object) => string`                               | Serialize schema to safe JSON-LD string |
| `schemaGraph`    | `(schemas: object[]) => object`                            | Combine schemas into `@graph` document  |
| `validateSchema` | `(schema: object) => { valid: boolean; errors: string[] }` | Validate required fields                |

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

|                      |                                                                |
| -------------------- | -------------------------------------------------------------- |
| **Website**          | [ccbd.dev](https://ccbd.dev)                                   |
| **GitHub**           | [github.com/cybercraftbd](https://github.com/cybercraftbd)     |
| **npm Organization** | [npmjs.com/org/power-seo](https://www.npmjs.com/org/power-seo) |
| **Email**            | [info@ccbd.dev](mailto:info@ccbd.dev)                          |

---

## License

**MIT**

---

## Keywords

```text
seo, json-ld, structured-data, schema-org, rich-results, typescript, react, nextjs, remix, faq-schema, product-schema, article-schema, local-business, breadcrumb
```
