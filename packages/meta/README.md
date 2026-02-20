# @power-seo/meta — SSR Meta Tag Helpers for Next.js App Router, Remix v2 & Generic SSR

> Generate perfectly structured meta tags for server-side rendering. Native Next.js App Router `Metadata` object, Remix v2 `MetaDescriptor` array, and generic HTML string output — all from one unified config object.

[![npm version](https://img.shields.io/npm/v/@power-seo/meta)](https://www.npmjs.com/package/@power-seo/meta)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/meta)](https://www.npmjs.com/package/@power-seo/meta)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/meta)

`@power-seo/meta` eliminates the need to write framework-specific meta tag boilerplate. One config object generates the correct output format for any SSR framework. The return types are fully compatible with Next.js `Metadata`, Remix `MetaDescriptor[]`, and raw HTML strings — no casting or manual adaptation required.

## Features

- **`createMetadata()`** — returns a native Next.js App Router `Metadata` object, compatible with `generateMetadata()` and `metadata` exports
- **`createMetaDescriptors()`** — returns a native Remix v2 `MetaDescriptor[]` array, compatible with the `export const meta` function
- **`createHeadTags()`** — returns an HTML string of `<meta>` and `<link>` tags for generic SSR frameworks (Astro, SvelteKit, Fastify, Express)
- **`createHeadTagObjects()`** — returns structured tag objects for programmatic use, custom renderers, or testing
- **Robots config support** — full robots directive object (`index`, `follow`, `noarchive`, `maxSnippet`, etc.) translated correctly into each framework's format
- **Open Graph image array support** — multiple images with width, height, alt, and type
- **Twitter Card support** — all card types and properties
- **Canonical URL support** — output as `<link rel="canonical">` or framework-specific canonical field
- **Full TypeScript types** — return types are properly typed for each framework, no `any` or casting needed
- **Zero runtime dependencies** — safe to use in edge runtimes, Cloudflare Workers, and serverless functions

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Next.js App Router](#nextjs-app-router)
  - [Remix v2](#remix-v2)
  - [Generic SSR — HTML String](#generic-ssr--html-string)
  - [Generic SSR — Tag Objects](#generic-ssr--tag-objects)
- [API Reference](#api-reference)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
npm install @power-seo/meta
```

```bash
yarn add @power-seo/meta
```

```bash
pnpm add @power-seo/meta
```

## Quick Start

```ts
// Next.js App Router
import { createMetadata } from '@power-seo/meta';

export const metadata = createMetadata({
  title: 'My Page',
  description: 'A page about something great.',
  canonical: 'https://example.com/my-page',
  robots: { index: true, follow: true, maxSnippet: 150 },
  openGraph: { type: 'website', images: [{ url: 'https://example.com/og.jpg' }] },
});
```

```ts
// Remix v2
import { createMetaDescriptors } from '@power-seo/meta';

export const meta = () => createMetaDescriptors({
  title: 'My Page',
  description: 'A page about something great.',
  canonical: 'https://example.com/my-page',
});
```

## Usage

### Next.js App Router

`createMetadata()` returns a `Metadata` object from `'next'` — fully compatible with both `export const metadata` (static) and `export async function generateMetadata()` (dynamic).

```ts
// app/page.tsx — static metadata
import { createMetadata } from '@power-seo/meta';

export const metadata = createMetadata({
  title: 'Home',
  description: 'Welcome to Example Site — the best place for learning.',
  canonical: 'https://example.com/',
  openGraph: {
    type: 'website',
    siteName: 'Example Site',
    images: [{ url: 'https://example.com/og-home.jpg', width: 1200, height: 630, alt: 'Example Site' }],
  },
  twitter: { card: 'summary_large_image', site: '@examplesite' },
  robots: { index: true, follow: true },
});
```

```ts
// app/blog/[slug]/page.tsx — dynamic metadata
import { createMetadata } from '@power-seo/meta';
import { getPost } from '@/lib/posts';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  return createMetadata({
    title: post.title,
    description: post.excerpt,
    canonical: `https://example.com/blog/${params.slug}`,
    openGraph: {
      type: 'article',
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
      article: {
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: [post.author.url],
        tags: post.tags,
      },
    },
    twitter: { card: 'summary_large_image', creator: post.author.twitter },
    robots: {
      index: !post.isDraft,
      follow: true,
      maxSnippet: 160,
      maxImagePreview: 'large',
    },
  });
}
```

**Robots in Next.js output:**

The robots config object is automatically translated into Next.js `robots` field format:

```ts
createMetadata({
  robots: { index: true, follow: true, maxSnippet: 150, maxImagePreview: 'large' }
});
// Returns Next.js Metadata:
// {
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: { 'max-snippet': 150, 'max-image-preview': 'large' }
//   }
// }
```

### Remix v2

`createMetaDescriptors()` returns `MetaDescriptor[]` — the array format used by Remix's `export const meta` function.

```ts
// app/routes/_index.tsx
import { createMetaDescriptors } from '@power-seo/meta';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => createMetaDescriptors({
  title: 'Home',
  description: 'Welcome to Example Site.',
  canonical: 'https://example.com/',
  openGraph: {
    type: 'website',
    images: [{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', site: '@examplesite' },
  robots: { index: true, follow: true },
});
```

```ts
// app/routes/blog.$slug.tsx — with loader data
import { createMetaDescriptors } from '@power-seo/meta';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) return [{ title: 'Post Not Found' }];
  return createMetaDescriptors({
    title: data.post.title,
    description: data.post.excerpt,
    canonical: `https://example.com/blog/${data.post.slug}`,
    openGraph: {
      type: 'article',
      images: [{ url: data.post.coverImage }],
    },
  });
};
```

### Generic SSR — HTML String

`createHeadTags()` returns a raw HTML string containing all the `<meta>` and `<link>` tags. Inject it into your template's `<head>`.

```ts
import { createHeadTags } from '@power-seo/meta';

const headHtml = createHeadTags({
  title: 'My Page',
  description: 'A page about something great.',
  canonical: 'https://example.com/my-page',
  openGraph: { type: 'website', images: [{ url: 'https://example.com/og.jpg' }] },
  robots: { index: true, follow: true },
});

// Express / Fastify
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head>${headHtml}</head><body>...</body></html>`);
});
```

Output example:

```html
<title>My Page</title>
<meta name="description" content="A page about something great.">
<link rel="canonical" href="https://example.com/my-page">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:image" content="https://example.com/og.jpg">
```

### Generic SSR — Tag Objects

`createHeadTagObjects()` returns structured objects for programmatic use — useful for custom renderers, testing, or framework-specific injection.

```ts
import { createHeadTagObjects } from '@power-seo/meta';

const tags = createHeadTagObjects({
  title: 'My Page',
  description: 'A page about something great.',
  canonical: 'https://example.com/my-page',
  robots: { index: true, follow: true },
});

console.log(tags);
// [
//   { tag: 'title', children: 'My Page' },
//   { tag: 'meta', attrs: { name: 'description', content: 'A page about something great.' } },
//   { tag: 'link', attrs: { rel: 'canonical', href: 'https://example.com/my-page' } },
//   { tag: 'meta', attrs: { name: 'robots', content: 'index, follow' } },
// ]
```

## API Reference

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `createMetadata` | `(config: SeoConfig) => Metadata` | Returns Next.js App Router `Metadata` object |
| `createMetaDescriptors` | `(config: SeoConfig) => MetaDescriptor[]` | Returns Remix v2 `MetaDescriptor[]` array |
| `createHeadTags` | `(config: SeoConfig) => string` | Returns HTML string of head tags |
| `createHeadTagObjects` | `(config: SeoConfig) => HeadTagObject[]` | Returns structured tag objects |

### SeoConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Page title |
| `titleTemplate` | `string` | — | Title template e.g. `'%s \| Site Name'` |
| `description` | `string` | — | Meta description |
| `canonical` | `string` | — | Canonical URL |
| `robots` | `RobotsDirective` | — | Robots directive configuration |
| `openGraph` | `OpenGraphConfig` | — | Open Graph properties |
| `twitter` | `TwitterConfig` | — | Twitter Card properties |
| `languageAlternates` | `HreflangEntry[]` | — | Hreflang entries |
| `additionalMetaTags` | `MetaTag[]` | — | Extra custom meta tags |
| `additionalLinkTags` | `LinkTag[]` | — | Extra custom link tags |

### RobotsDirective (within SeoConfig)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `boolean` | `true` | `true` → `index`, `false` → `noindex` |
| `follow` | `boolean` | `true` | `true` → `follow`, `false` → `nofollow` |
| `noarchive` | `boolean` | `false` | Prevent cached version |
| `nosnippet` | `boolean` | `false` | Prevent snippet in results |
| `noimageindex` | `boolean` | `false` | Prevent image indexing |
| `notranslate` | `boolean` | `false` | Prevent translation offer |
| `maxSnippet` | `number` | — | Max snippet length |
| `maxImagePreview` | `'none' \| 'standard' \| 'large'` | — | Max image preview size |
| `maxVideoPreview` | `number` | — | Max video preview seconds |
| `unavailableAfter` | `string` | — | Expiry date for search results |

### OpenGraphConfig

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'website' \| 'article' \| 'book' \| 'profile'` | `'website'` | OG object type |
| `title` | `string` | — | og:title (falls back to `title`) |
| `description` | `string` | — | og:description (falls back to `description`) |
| `url` | `string` | — | og:url (falls back to `canonical`) |
| `siteName` | `string` | — | og:site_name |
| `images` | `OGImage[]` | — | Array of image objects |
| `locale` | `string` | `'en_US'` | og:locale |
| `article` | `OGArticle` | — | Article-specific OG properties |

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
