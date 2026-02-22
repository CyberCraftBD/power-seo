# @power-seo/meta — SSR Meta Tag Helpers for Next.js App Router, Remix v2 & Generic SSR

[![npm version](https://img.shields.io/npm/v/@power-seo/meta)](https://www.npmjs.com/package/@power-seo/meta)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/meta)](https://www.npmjs.com/package/@power-seo/meta)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/meta)

---

## Overview

**@power-seo/meta** is a **server-side meta tag generation library** for **Next.js App Router, Remix v2, and generic SSR frameworks** that helps you **generate perfectly structured meta tags from one unified config object — with no framework-specific boilerplate**.

**What it does**

- ✅ **Generates native Next.js `Metadata` objects** compatible with `generateMetadata()` and `export const metadata`
- ✅ **Generates native Remix v2 `MetaDescriptor[]` arrays** compatible with `export const meta`
- ✅ **Generates raw HTML `<meta>` / `<link>` strings** for Astro, SvelteKit, Express, and Fastify
- ✅ **Generates structured tag objects** for custom renderers and testing

**What it is not**

- ❌ **Not a React component library** — use `@power-seo/react` for client-side / Pages Router meta tags
- ❌ **Not a schema / JSON-LD generator** — use `@power-seo/schema` for structured data

**Recommended for**

- **Next.js App Router projects, Remix v2 apps, and any SSR framework** that needs consistently structured meta tags without writing framework-specific boilerplate on every page

---

## Why @power-seo/meta Matters

**The problem**

- **Meta tag boilerplate differs across every SSR framework** — Next.js App Router, Remix v2, Astro, and Express all have different APIs for the same outcome
- **Robots directives are complex** — translating `maxSnippet`, `maxImagePreview`, and `unavailableAfter` into the correct format for each framework is error-prone
- **Inconsistency accumulates** — without a shared config schema, different pages end up with different meta tag structures

**Why developers care**

- **SEO:** Correct meta tags are the baseline requirement for indexing, rich results, and social sharing
- **DX:** One config object that works across frameworks eliminates per-page boilerplate
- **Correctness:** Return types are fully typed for each framework — no `any`, no casting

> **Zero runtime dependencies** — safe to use in edge runtimes, Cloudflare Workers, and serverless functions.

---

## Key Features

- **`createMetadata()`** — returns a native Next.js App Router `Metadata` object, compatible with `generateMetadata()` and `metadata` exports
- **`createMetaDescriptors()`** — returns a native Remix v2 `MetaDescriptor[]` array, compatible with `export const meta`
- **`createHeadTags()`** — returns an HTML string of `<meta>` and `<link>` tags for generic SSR frameworks
- **`createHeadTagObjects()`** — returns structured tag objects for programmatic use, custom renderers, or testing
- **Full robots directive support** — `index`, `follow`, `noarchive`, `nosnippet`, `noimageindex`, `notranslate`, `maxSnippet`, `maxImagePreview`, `maxVideoPreview`, `unavailableAfter`
- **Open Graph image array support** — multiple images with `width`, `height`, `alt`, and `type`
- **Twitter Card support** — all card types and properties
- **Canonical URL support** — output as `<link rel="canonical">` or framework-specific field
- **Hreflang support** — `languageAlternates` for multi-language sites
- **Type-safe API** — TypeScript-first with full typed return types per framework
- **Zero runtime dependencies** — edge runtime compatible

---

## Benefits of Using @power-seo/meta

- **Consistent meta tags**: One `SeoConfig` object generates the correct output for every framework
- **No framework lock-in**: Switch from Remix to Next.js App Router without rewriting meta tag logic
- **Correct robots directives**: Complex directives like `maxSnippet` and `maxImagePreview` are translated correctly per framework
- **Faster page setup**: New pages need one import and one function call, not 10–20 lines of boilerplate

---

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

export const meta = () =>
  createMetaDescriptors({
    title: 'My Page',
    description: 'A page about something great.',
    canonical: 'https://example.com/my-page',
  });
```

**What you should see**

- A correctly-typed `Metadata` object (Next.js) or `MetaDescriptor[]` (Remix) from a single shared config
- Robots directives automatically translated to each framework's native format

---

## Installation

```bash
npm i @power-seo/meta
# or
yarn add @power-seo/meta
# or
pnpm add @power-seo/meta
# or
bun add @power-seo/meta
```

---

## Framework Compatibility

**Supported**

- ✅ **Next.js App Router** — `createMetadata()` returns native `Metadata`; works with `export const metadata` and `generateMetadata()`
- ✅ **Remix v2** — `createMetaDescriptors()` returns native `MetaDescriptor[]`; works with `export const meta`
- ✅ **Astro, SvelteKit, Fastify, Express** — `createHeadTags()` returns an HTML string for injection into `<head>`
- ✅ **Any custom renderer** — `createHeadTagObjects()` returns structured objects

**Environment notes**

- **SSR/SSG:** Fully supported — all functions are pure, synchronous, and have zero runtime dependencies
- **Edge runtime:** Supported — no Node.js globals used
- **Browser-only usage:** Possible but not the intended use case; use `@power-seo/react` for client-side meta management

---

## Use Cases

- **Next.js App Router** — generate `Metadata` for static and dynamic pages with `generateMetadata()`
- **Remix v2 routes** — generate `MetaDescriptor[]` for route-level meta with loader data
- **Programmatic SEO sites** — generate meta for thousands of auto-generated pages at build time
- **SaaS marketing sites** — enforce consistent meta patterns across all pages
- **Multi-language sites** — include `languageAlternates` for hreflang support
- **E-commerce product pages** — generate Open Graph images and Twitter Cards per product
- **CMS-driven content** — map CMS fields to `SeoConfig` and generate framework-specific output
- **ERP portals** — control indexing with robots directives per module

---

## Example Output (Before / After)

```text
Before (manual boilerplate — Next.js App Router):
export const metadata = {
  title: 'My Page',
  description: 'A page about something great.',
  robots: { index: true, follow: true, googleBot: { 'max-snippet': 150 } },
  openGraph: { type: 'website', images: [{ url: '...' }] },
  ...  // 15+ lines, framework-specific, error-prone
};

After (@power-seo/meta):
export const metadata = createMetadata({
  title: 'My Page',
  description: 'A page about something great.',
  canonical: 'https://example.com/my-page',
  robots: { index: true, follow: true, maxSnippet: 150 },
  openGraph: { type: 'website', images: [{ url: '...' }] },
}); // 1 import, 1 call, correct output guaranteed
```

---

## Implementation Best Practices

- **Always set `canonical`** — prevents duplicate content issues from URL parameter variations
- **Set `robots.maxSnippet: 150`** on blog and article pages to control Google's snippet length
- **Use `robots.index: false`** on admin, staging, and draft pages to prevent accidental indexing
- **Set `openGraph.images`** with `width: 1200, height: 630` for consistent social card rendering
- **Use `titleTemplate`** via `DefaultSEO` in `@power-seo/react` or handle at the config level for consistent `Site Name | Page Title` formatting
- **Keep `SeoConfig` in a shared `seo.config.ts`** to enforce consistency across pages

---

## Architecture Overview

**Where it runs**

- **Build-time:** Generate `metadata` exports for all static Next.js / Astro pages at build
- **Runtime:** Use `generateMetadata()` in Next.js or loaders in Remix to generate meta from fetched data
- **CI/CD:** Can be unit-tested — all functions are pure and synchronous

**Data flow**

1. **Input:** `SeoConfig` object (title, description, canonical, robots, openGraph, twitter, etc.)
2. **Transform:** Internal mappers translate shared config to framework-native format
3. **Output:** `Metadata` (Next.js), `MetaDescriptor[]` (Remix), `string` (HTML), or `HeadTagObject[]`
4. **Action:** Framework renders the output into `<head>` at the correct time

---

## Features Comparison with Popular Packages

| Capability                           | `next-seo` | `remix-seo` | `react-helmet` | @power-seo/meta |
| ------------------------------------ | :--------: | :---------: | :------------: | :-------------: |
| Next.js App Router native `Metadata` |     ❌     |     ❌      |       ❌       |       ✅        |
| Remix v2 native `MetaDescriptor[]`   |     ❌     |     ✅      |       ❌       |       ✅        |
| Generic SSR HTML string output       |     ❌     |     ❌      |       ❌       |       ✅        |
| Full robots directive support        |     ✅     |     ✅      |       ✅       |       ✅        |
| One config → multiple frameworks     |     ❌     |     ❌      |       ❌       |       ✅        |
| Zero runtime dependencies            |     ❌     |     ✅      |       ❌       |       ✅        |
| TypeScript-first with typed returns  |     ✅     |     ✅      |       ❌       |       ✅        |

---

## [@power-seo](https://www.npmjs.com/org/power-seo) Ecosystem

All 17 packages are independently installable — use only what you need.

### Ecosystem packages

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

### Ecosystem vs alternatives

| Need                            | Common approach                | @power-seo approach                                |
| ------------------------------- | ------------------------------ | -------------------------------------------------- |
| SSR meta tags                   | Framework-specific boilerplate | `@power-seo/meta` — one config, any framework      |
| Client-side meta (Pages Router) | `next-seo`, `react-helmet`     | `@power-seo/react` — declarative components        |
| JSON-LD structured data         | `next-seo` schemas             | `@power-seo/schema` — 20 typed builders            |
| SERP preview                    | Manual UI                      | `@power-seo/preview` — pixel-accurate preview data |

---

## Enterprise Integration

**Multi-tenant SaaS**

- **Per-tenant canonical config**: Generate tenant-specific canonical URLs and OG images from shared config
- **Robots per environment**: Inject `robots.index: false` globally for staging environments
- **Audit pipelines**: Validate meta output in CI using `createHeadTagObjects()` for assertion

**ERP / internal portals**

- **Control indexing per module**: Public modules get `index: true`, admin modules get `index: false`
- **Consistent branding**: Shared `SeoConfig` base ensures consistent `siteName` and default OG image

**Recommended integration pattern**

- Define a shared `baseSeoConfig` in a `seo.config.ts` file
- Merge per-page overrides at the page level using spread or config merging
- Unit test `createHeadTagObjects()` output in CI to catch regressions

---

## Scope and Limitations

**This package does**

- ✅ Generate framework-native meta tag output from a shared `SeoConfig` object
- ✅ Translate robots directives correctly for each framework
- ✅ Support Open Graph, Twitter Card, canonical, hreflang, and custom tags

**This package does not**

- ❌ Manage meta tags as React components (use `@power-seo/react`)
- ❌ Generate JSON-LD structured data (use `@power-seo/schema`)
- ❌ Validate meta content or score SEO quality (use `@power-seo/audit`)

---

## API Reference

### Functions

| Function                | Signature                                 | Description                                       |
| ----------------------- | ----------------------------------------- | ------------------------------------------------- |
| `createMetadata`        | `(config: SeoConfig) => Metadata`         | Returns Next.js App Router `Metadata` object      |
| `createMetaDescriptors` | `(config: SeoConfig) => MetaDescriptor[]` | Returns Remix v2 `MetaDescriptor[]` array         |
| `createHeadTags`        | `(config: SeoConfig) => string`           | Returns HTML string of `<meta>` and `<link>` tags |
| `createHeadTagObjects`  | `(config: SeoConfig) => HeadTagObject[]`  | Returns structured tag objects                    |

### SeoConfig

| Prop                 | Type              | Description                             |
| -------------------- | ----------------- | --------------------------------------- |
| `title`              | `string`          | Page title                              |
| `titleTemplate`      | `string`          | Title template e.g. `'%s \| Site Name'` |
| `description`        | `string`          | Meta description                        |
| `canonical`          | `string`          | Canonical URL                           |
| `robots`             | `RobotsDirective` | Robots directive configuration          |
| `openGraph`          | `OpenGraphConfig` | Open Graph properties                   |
| `twitter`            | `TwitterConfig`   | Twitter Card properties                 |
| `languageAlternates` | `HreflangEntry[]` | Hreflang entries for i18n               |
| `additionalMetaTags` | `MetaTag[]`       | Extra custom meta tags                  |
| `additionalLinkTags` | `LinkTag[]`       | Extra custom link tags                  |

### RobotsDirective

| Prop               | Type                              | Description                             |
| ------------------ | --------------------------------- | --------------------------------------- |
| `index`            | `boolean`                         | `true` → `index`, `false` → `noindex`   |
| `follow`           | `boolean`                         | `true` → `follow`, `false` → `nofollow` |
| `noarchive`        | `boolean`                         | Prevent cached version                  |
| `nosnippet`        | `boolean`                         | Prevent snippet in results              |
| `noimageindex`     | `boolean`                         | Prevent image indexing                  |
| `notranslate`      | `boolean`                         | Prevent translation offer               |
| `maxSnippet`       | `number`                          | Max snippet length                      |
| `maxImagePreview`  | `'none' \| 'standard' \| 'large'` | Max image preview size                  |
| `maxVideoPreview`  | `number`                          | Max video preview seconds               |
| `unavailableAfter` | `string`                          | ISO 8601 expiry date                    |

### OpenGraphConfig

| Prop          | Type                                            | Description                                  |
| ------------- | ----------------------------------------------- | -------------------------------------------- |
| `type`        | `'website' \| 'article' \| 'book' \| 'profile'` | OG object type                               |
| `title`       | `string`                                        | og:title (falls back to `title`)             |
| `description` | `string`                                        | og:description (falls back to `description`) |
| `url`         | `string`                                        | og:url (falls back to `canonical`)           |
| `siteName`    | `string`                                        | og:site_name                                 |
| `images`      | `OGImage[]`                                     | Array of image objects                       |
| `locale`      | `string`                                        | og:locale (default: `'en_US'`)               |
| `article`     | `OGArticle`                                     | Article-specific OG properties               |

---

## Usage

### Next.js App Router

```ts
// app/page.tsx — static metadata
import { createMetadata } from '@power-seo/meta';

export const metadata = createMetadata({
  title: 'Home',
  description: 'Welcome to Example Site.',
  canonical: 'https://example.com/',
  openGraph: {
    type: 'website',
    siteName: 'Example Site',
    images: [
      { url: 'https://example.com/og-home.jpg', width: 1200, height: 630, alt: 'Example Site' },
    ],
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
    robots: { index: !post.isDraft, follow: true, maxSnippet: 160, maxImagePreview: 'large' },
  });
}
```

### Remix v2

```ts
// app/routes/blog.$slug.tsx
import { createMetaDescriptors } from '@power-seo/meta';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) return [{ title: 'Post Not Found' }];
  return createMetaDescriptors({
    title: data.post.title,
    description: data.post.excerpt,
    canonical: `https://example.com/blog/${data.post.slug}`,
    openGraph: { type: 'article', images: [{ url: data.post.coverImage }] },
  });
};
```

### Generic SSR — HTML String

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

### Generic SSR — Tag Objects

```ts
import { createHeadTagObjects } from '@power-seo/meta';

const tags = createHeadTagObjects({
  title: 'My Page',
  description: 'A page about something great.',
  canonical: 'https://example.com/my-page',
  robots: { index: true, follow: true },
});
// [
//   { tag: 'title', children: 'My Page' },
//   { tag: 'meta', attrs: { name: 'description', content: 'A page about something great.' } },
//   { tag: 'link', attrs: { rel: 'canonical', href: 'https://example.com/my-page' } },
//   { tag: 'meta', attrs: { name: 'robots', content: 'index, follow' } },
// ]
```

---

## Contributing

- Issues: [github.com/cybercraftbd/power-seo/issues](https://github.com/cybercraftbd/power-seo/issues)
- PRs: [github.com/cybercraftbd/power-seo/pulls](https://github.com/cybercraftbd/power-seo/pulls)
- Development setup:
  1. `pnpm i`
  2. `pnpm build`
  3. `pnpm test`

**Release workflow**

```bash
npm version patch|minor|major
npm run build
npm publish --access public
```

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software engineering company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

|                      |                                                                |
| -------------------- | -------------------------------------------------------------- |
| **Website**          | [ccbd.dev](https://ccbd.dev)                                   |
| **GitHub**           | [github.com/cybercraftbd](https://github.com/cybercraftbd)     |
| **npm Organization** | [npmjs.com/org/power-seo](https://www.npmjs.com/org/power-seo) |
| **Email**            | [info@ccbd.dev](mailto:info@ccbd.dev)                          |

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)

---

## License

MIT

---

## Keywords

```text
seo, meta-tags, next-js, app-router, remix, ssr, open-graph, twitter-card, canonical,
robots, hreflang, typescript, server-side-rendering, metadata
```
