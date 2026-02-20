# @power-seo/schema — Type-Safe JSON-LD Structured Data for React, Next.js & Remix

> Build Google-compliant JSON-LD structured data with full TypeScript types. Supports 20 schema.org types with builder functions and 18 pre-built React components. Boost rich results in Google Search with Articles, FAQs, Products, Breadcrumbs, Local Business, and more.

[![npm version](https://img.shields.io/npm/v/@power-seo/schema)](https://www.npmjs.com/package/@power-seo/schema)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/schema)](https://www.npmjs.com/package/@power-seo/schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/schema)

`@power-seo/schema` provides typed builder functions for every major schema.org type supported by Google rich results, plus ready-to-use React components that render the JSON-LD script tag for you. Combine multiple schemas with `schemaGraph()`, validate required fields before rendering, and serialize with `toJsonLdString()`.

## Features

- **20 schema.org type builder functions** — Article, BlogPosting, Product, FAQPage, BreadcrumbList, LocalBusiness, Organization, Person, Event, Recipe, HowTo, VideoObject, Course, JobPosting, SoftwareApplication, WebSite, ItemList, Review, Service, NewsArticle
- **18 pre-built React components** — `<ArticleJsonLd>`, `<FAQJsonLd>`, `<ProductJsonLd>`, `<BreadcrumbJsonLd>`, `<LocalBusinessJsonLd>`, `<EventJsonLd>`, `<RecipeJsonLd>`, `<HowToJsonLd>`, `<VideoJsonLd>`, `<CourseJsonLd>`, `<JobPostingJsonLd>`, `<SoftwareAppJsonLd>`, `<WebSiteJsonLd>`, `<OrganizationJsonLd>`, `<PersonJsonLd>`, `<ItemListJsonLd>`, `<ReviewJsonLd>`, `<NewsArticleJsonLd>`
- **Generic `<JsonLd>` component** — renders any custom schema object as a JSON-LD script tag
- **`schemaGraph()`** — combine multiple schemas into a single `@graph` document for optimal Google parsing
- **`toJsonLdString()`** — serialize any schema object to a safe JSON-LD string for `dangerouslySetInnerHTML`
- **`validateSchema()`** — validate required fields before rendering; returns `{ valid, errors }` without throwing
- **Full TypeScript types** — every schema type has full typed input interfaces including nested objects
- **React optional** — builder functions work without React; components available via `/react` subpath export
- **Tree-shakeable** — import only the schema types you use

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Builder Functions](#builder-functions)
  - [Schema Graph](#schema-graph)
  - [Validation](#validation)
  - [React Components](#react-components)
- [API Reference](#api-reference)
  - [Builder Functions Reference](#builder-functions-reference)
  - [React Components Reference](#react-components-reference)
  - [Utilities](#utilities)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
npm install @power-seo/schema
```

```bash
yarn add @power-seo/schema
```

```bash
pnpm add @power-seo/schema
```

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
/>
// Renders: <script type="application/ld+json">{"@context":"https://schema.org",...}</script>
```

## Usage

### Builder Functions

Each builder function accepts a typed config object and returns a schema.org JSON-LD object ready for serialization.

```ts
import { article, faqPage, product, localBusiness, breadcrumbList, event, recipe, howTo, course, jobPosting, softwareApplication, webSite } from '@power-seo/schema';

// Article
const articleSchema = article({
  headline: 'Breaking News: SEO Changes in 2026',
  datePublished: '2026-01-15T09:00:00Z',
  dateModified: '2026-01-16T10:00:00Z',
  author: { name: 'Jane Doe', url: 'https://example.com/authors/jane' },
  publisher: { name: 'Example Media', logo: 'https://example.com/logo.png' },
  image: { url: 'https://example.com/article.jpg', width: 1200, height: 630 },
  description: 'Major SEO algorithm changes announced for 2026.',
});

// FAQ Page
const faqSchema = faqPage({
  questions: [
    { question: 'What is JSON-LD?', answer: 'JSON-LD is a structured data format used by search engines.' },
    { question: 'Why use schema.org?', answer: 'Schema.org markup enables rich results, increasing click-through rates.' },
  ],
});

// Product
const productSchema = product({
  name: 'Premium Running Shoes',
  description: 'Lightweight, breathable running shoes for all terrain.',
  image: 'https://example.com/shoes.jpg',
  brand: { name: 'RunFast' },
  sku: 'RF-SHOES-001',
  offers: { price: '129.99', priceCurrency: 'USD', availability: 'InStock' },
  aggregateRating: { ratingValue: 4.8, reviewCount: 312 },
});

// Local Business
const businessSchema = localBusiness({
  name: 'Acme Coffee',
  type: 'CafeOrCoffeeShop',
  url: 'https://acmecoffee.com',
  telephone: '+1-555-123-4567',
  address: {
    streetAddress: '123 Main Street',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10001',
    addressCountry: 'US',
  },
  openingHours: ['Mo-Fr 07:00-19:00', 'Sa-Su 08:00-18:00'],
  geo: { latitude: 40.7128, longitude: -74.0060 },
});

// Event
const eventSchema = event({
  name: 'SEO Conference 2026',
  startDate: '2026-06-15T09:00:00Z',
  endDate: '2026-06-16T18:00:00Z',
  location: { name: 'New York Marriott', address: '123 Broadway, New York, NY 10001' },
  eventStatus: 'EventScheduled',
  eventAttendanceMode: 'OfflineEventAttendanceMode',
  offers: { price: '499', priceCurrency: 'USD', availability: 'InStock' },
});

// Recipe
const recipeSchema = recipe({
  name: 'Classic Chocolate Chip Cookies',
  image: 'https://example.com/cookies.jpg',
  author: { name: 'Chef Maria' },
  prepTime: 'PT15M',
  cookTime: 'PT12M',
  totalTime: 'PT27M',
  recipeYield: '24 cookies',
  recipeIngredient: ['2 cups flour', '1 cup butter', '2 cups chocolate chips'],
  recipeInstructions: [
    { name: 'Mix dry ingredients', text: 'Combine flour, baking soda, and salt.' },
    { name: 'Mix wet ingredients', text: 'Beat butter and sugars until fluffy.' },
  ],
  aggregateRating: { ratingValue: 4.9, reviewCount: 2100 },
});

// How-To
const howToSchema = howTo({
  name: 'How to Optimize a Blog Post for SEO',
  description: 'Step-by-step guide to ranking your blog posts higher.',
  totalTime: 'PT30M',
  steps: [
    { name: 'Research keywords', text: 'Find low-competition search terms.', image: 'https://example.com/step1.jpg' },
    { name: 'Optimize title and meta description', text: 'Include your primary keyword in both.' },
    { name: 'Add internal links', text: 'Link to at least 2-3 related pages.' },
  ],
});

// Job Posting
const jobSchema = jobPosting({
  title: 'Senior SEO Engineer',
  description: 'We are looking for an experienced SEO engineer.',
  hiringOrganization: { name: 'Acme Inc', url: 'https://acme.com' },
  jobLocation: { addressLocality: 'New York', addressRegion: 'NY', addressCountry: 'US' },
  datePosted: '2026-01-10',
  validThrough: '2026-03-01',
  employmentType: 'FULL_TIME',
  baseSalary: { currency: 'USD', minValue: 120000, maxValue: 160000, unitText: 'YEAR' },
});

// Website (with SearchAction for sitelinks searchbox)
const websiteSchema = webSite({
  name: 'Example Site',
  url: 'https://example.com',
  potentialAction: {
    target: 'https://example.com/search?q={search_term_string}',
    queryInput: 'required name=search_term_string',
  },
});
```

### Schema Graph

Combine multiple schemas into a single `@graph` document — recommended for pages with multiple schemas.

```ts
import { article, breadcrumbList, organization, schemaGraph, toJsonLdString } from '@power-seo/schema';

const graph = schemaGraph([
  article({ headline: 'My Blog Post', datePublished: '2026-01-15', author: { name: 'Jane Doe' } }),
  breadcrumbList({ items: [{ name: 'Home', url: 'https://example.com' }, { name: 'Blog', url: 'https://example.com/blog' }] }),
  organization({ name: 'Example Inc', url: 'https://example.com' }),
]);

const script = toJsonLdString(graph);
// → '{"@context":"https://schema.org","@graph":[{...article},{...breadcrumb},{...org}]}'
```

In Next.js App Router:

```tsx
export default function BlogPost() {
  const graph = schemaGraph([
    article({ headline: 'My Post', datePublished: '2026-01-15', author: { name: 'Jane' } }),
    breadcrumbList({ items: [{ name: 'Home', url: 'https://example.com' }, { name: 'Blog' }] }),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdString(graph) }} />
      <article>...</article>
    </>
  );
}
```

### Validation

`validateSchema()` checks required fields without throwing. Returns `{ valid, errors }`.

```ts
import { article, validateSchema } from '@power-seo/schema';

const schema = article({ headline: 'My Post' }); // missing datePublished, author
const result = validateSchema(schema);

console.log(result.valid);  // false
console.log(result.errors); // ['Article: datePublished is required', 'Article: author is required']

if (!result.valid) {
  console.warn('Schema validation failed:', result.errors);
}
```

### React Components

All 18 React components render a `<script type="application/ld+json">` tag.

```tsx
import { ArticleJsonLd, FAQJsonLd, ProductJsonLd, BreadcrumbJsonLd, EventJsonLd, JsonLd } from '@power-seo/schema/react';

<ArticleJsonLd
  headline="My Blog Post"
  datePublished="2026-01-15"
  dateModified="2026-01-20"
  author={{ name: 'Jane Doe', url: 'https://example.com/authors/jane' }}
  image={{ url: 'https://example.com/cover.jpg', width: 1200, height: 630 }}
  publisher={{ name: 'Example Media', logo: 'https://example.com/logo.png' }}
/>

<FAQJsonLd
  questions={[
    { question: 'What is SEO?', answer: 'Search engine optimization.' },
    { question: 'Why is SEO important?', answer: 'It drives organic traffic.' },
  ]}
/>

<BreadcrumbJsonLd
  items={[
    { name: 'Home', url: 'https://example.com' },
    { name: 'Blog', url: 'https://example.com/blog' },
    { name: 'My Post', url: 'https://example.com/blog/my-post' },
  ]}
/>

<ProductJsonLd
  name="Running Shoes"
  image="https://example.com/shoes.jpg"
  brand={{ name: 'RunFast' }}
  offers={{ price: '129.99', priceCurrency: 'USD', availability: 'InStock' }}
  aggregateRating={{ ratingValue: 4.8, reviewCount: 312 }}
/>

// Generic component for any custom schema type
<JsonLd schema={{ '@context': 'https://schema.org', '@type': 'MedicalCondition', name: 'Flu' }} />
```

## API Reference

### Builder Functions Reference

| Function | Schema `@type` | Rich Result Eligible |
|----------|----------------|---------------------|
| `article(config)` | `Article` | Yes — Article rich results |
| `blogPosting(config)` | `BlogPosting` | Yes — Article rich results |
| `newsArticle(config)` | `NewsArticle` | Yes — Top Stories |
| `faqPage(config)` | `FAQPage` | Yes — FAQ rich results |
| `product(config)` | `Product` | Yes — Product rich results |
| `breadcrumbList(config)` | `BreadcrumbList` | Yes — Breadcrumbs in SERP |
| `localBusiness(config)` | `LocalBusiness` | Yes — Local Business panel |
| `organization(config)` | `Organization` | Yes — Knowledge Panel |
| `person(config)` | `Person` | Yes — Knowledge Panel |
| `event(config)` | `Event` | Yes — Event rich results |
| `recipe(config)` | `Recipe` | Yes — Recipe rich results |
| `howTo(config)` | `HowTo` | Yes — How-to rich results |
| `videoObject(config)` | `VideoObject` | Yes — Video rich results |
| `course(config)` | `Course` | Yes — Course rich results |
| `jobPosting(config)` | `JobPosting` | Yes — Job Posting results |
| `softwareApplication(config)` | `SoftwareApplication` | Yes — App rich results |
| `webSite(config)` | `WebSite` | Yes — Sitelinks Searchbox |
| `itemList(config)` | `ItemList` | Yes — Carousel results |
| `review(config)` | `Review` | Yes — Review snippet |
| `service(config)` | `Service` | Partial |

### React Components Reference

| Component | Prop Type | Description |
|-----------|-----------|-------------|
| `<ArticleJsonLd>` | `ArticleConfig` | Article / BlogPosting schema |
| `<NewsArticleJsonLd>` | `NewsArticleConfig` | NewsArticle schema for Top Stories |
| `<FAQJsonLd>` | `{ questions: FAQItem[] }` | FAQPage schema |
| `<ProductJsonLd>` | `ProductConfig` | Product with offers and ratings |
| `<BreadcrumbJsonLd>` | `{ items: BreadcrumbItem[] }` | BreadcrumbList schema |
| `<LocalBusinessJsonLd>` | `LocalBusinessConfig` | LocalBusiness schema |
| `<OrganizationJsonLd>` | `OrganizationConfig` | Organization schema |
| `<PersonJsonLd>` | `PersonConfig` | Person schema |
| `<EventJsonLd>` | `EventConfig` | Event schema |
| `<RecipeJsonLd>` | `RecipeConfig` | Recipe schema |
| `<HowToJsonLd>` | `HowToConfig` | HowTo schema |
| `<VideoJsonLd>` | `VideoObjectConfig` | VideoObject schema |
| `<CourseJsonLd>` | `CourseConfig` | Course schema |
| `<JobPostingJsonLd>` | `JobPostingConfig` | JobPosting schema |
| `<SoftwareAppJsonLd>` | `SoftwareApplicationConfig` | SoftwareApplication schema |
| `<WebSiteJsonLd>` | `WebSiteConfig` | WebSite with SearchAction |
| `<ItemListJsonLd>` | `ItemListConfig` | ItemList schema |
| `<ReviewJsonLd>` | `ReviewConfig` | Review schema |
| `<JsonLd>` | `{ schema: object }` | Generic — any schema object |

### Utilities

| Function | Signature | Description |
|----------|-----------|-------------|
| `toJsonLdString` | `(schema: object) => string` | Serialize schema to safe JSON-LD string |
| `schemaGraph` | `(schemas: object[]) => object` | Combine schemas into `@graph` document |
| `validateSchema` | `(schema: object) => { valid: boolean; errors: string[] }` | Validate required fields |

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
