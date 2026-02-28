# @power-seo/meta

![meta banner](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/banner.svg)

Generate perfectly structured SSR meta tags from one unified config — native `Metadata` for Next.js App Router, native `MetaDescriptor[]` for Remix v2, and HTML strings for any other SSR framework.

[![npm version](https://img.shields.io/npm/v/@power-seo/meta)](https://www.npmjs.com/package/@power-seo/meta)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/meta)](https://www.npmjs.com/package/@power-seo/meta)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/meta)](https://socket.dev/npm/package/@power-seo/meta)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/meta)

`@power-seo/meta` is a server-side meta tag generation library that accepts one shared `SeoConfig` object and outputs the correct format for every major SSR framework. `createMetadata()` returns a native Next.js App Router `Metadata` object compatible with `generateMetadata()` and `export const metadata`. `createMetaDescriptors()` returns a native Remix v2 `MetaDescriptor[]` array. `createHeadTags()` returns an HTML string for Astro, SvelteKit, Express, and Fastify. All robots directives — including `maxSnippet`, `maxImagePreview`, and `unavailableAfter` — are translated correctly per framework with no manual mapping required.

> **Zero runtime dependencies** — safe to use in edge runtimes, Cloudflare Workers, and serverless functions.

---

## Why @power-seo/meta?

| | Without | With |
|---|---|---|
| Cross-framework meta | ❌ Different boilerplate for Next.js, Remix, Astro | ✅ One `SeoConfig` → correct output for every framework |
| Robots directives | ❌ `maxSnippet`, `maxImagePreview` require framework-specific mapping | ✅ Translated automatically per framework |
| Open Graph images | ❌ Manual array construction, inconsistent fields | ✅ Typed `OGImage[]` with `width`, `height`, `alt`, `type` |
| Twitter Cards | ❌ Hand-coded string fields, easy typos | ✅ Typed `TwitterCardConfig` with all card types |
| Canonical URLs | ❌ Omitted or duplicated across pages | ✅ Always in `SeoConfig`; output to the right field |
| Hreflang | ❌ Manual `<link>` tag per locale | ✅ `languageAlternates` renders all alternates |
| TypeScript | ❌ Return type is `any`, no autocomplete | ✅ Fully typed return per framework — no casting |

![Meta Comparison](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/comparison.svg)


<p align="left">
  <a href="https://www.buymeacoffee.com/ccbd.dev" target="_blank">
    <img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=ccbd.dev&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" />
  </a>
</p>

---

## Features

- **`createMetadata()`** — returns a native Next.js App Router `Metadata` object, compatible with `generateMetadata()` and `metadata` exports; advanced robots directives placed in `metadata.other['robots']` via `buildRobotsContent()`
- **`createMetaDescriptors()`** — returns a native Remix v2 `MetaDescriptor[]` array compatible with `export const meta`
- **`createHeadTags()`** — returns an HTML string of `<meta>` and `<link>` tags for Astro, SvelteKit, Express, Fastify, and any generic SSR framework
- **`createHeadTagObjects()`** — returns structured `HeadTagObject[]` for programmatic use, custom renderers, or CI assertions
- **Full robots directive support** — `index`, `follow`, `noarchive`, `nosnippet`, `noimageindex`, `notranslate`, `maxSnippet`, `maxImagePreview`, `maxVideoPreview`, `unavailableAfter`
- **Open Graph image array support** — multiple images with `width`, `height`, `alt`, and `type`
- **Twitter Card support** — all card types and properties via `TwitterCardConfig`
- **Canonical URL support** — output as `<link rel="canonical">` or framework-specific field
- **Hreflang support** — `languageAlternates` for multi-language sites
- **Custom meta and link tags** — `additionalMetaTags` and `additionalLinkTags` for any extra head elements
- **Type-safe API** — TypeScript-first with full typed return types per framework
- **Zero runtime dependencies** — edge runtime compatible

![Meta UI Output](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/ui-output.svg)

---

## Comparison

| Feature | @power-seo/meta | next-seo | remix-seo | react-helmet |
| --- | :---: | :---: | :---: | :---: |
| Next.js App Router native `Metadata` | ✅ | ❌ | ❌ | ❌ |
| Remix v2 native `MetaDescriptor[]` | ✅ | ❌ | ✅ | ❌ |
| Generic SSR HTML string output | ✅ | ❌ | ❌ | ❌ |
| Full robots directive support | ✅ | ✅ | ✅ | ✅ |
| One config → multiple frameworks | ✅ | ❌ | ❌ | ❌ |
| Structured tag object output | ✅ | ❌ | ❌ | ❌ |
| Zero runtime dependencies | ✅ | ❌ | ✅ | ❌ |
| TypeScript-first with typed returns | ✅ | ✅ | ✅ | ❌ |
| Tree-shakeable | ✅ | ❌ | Partial | ❌ |

![Robots Precision](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/robots-precision.svg)

---

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

![Meta Benefits](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/benefits.svg)

---

## Usage

### Next.js App Router — Static Metadata

```ts
// app/page.tsx
import { createMetadata } from '@power-seo/meta';

export const metadata = createMetadata({
  title: 'Home',
  description: 'Welcome to Example Site.',
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

### Next.js App Router — Dynamic Metadata

```ts
// app/blog/[slug]/page.tsx
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

Use `createHeadTagObjects()` for programmatic rendering or CI assertions:

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

## API Reference

### Functions

| Function | Signature | Description |
| --- | --- | --- |
| `createMetadata` | `(config: SeoConfig) => Metadata` | Returns Next.js App Router `Metadata` object |
| `createMetaDescriptors` | `(config: SeoConfig) => MetaDescriptor[]` | Returns Remix v2 `MetaDescriptor[]` array |
| `createHeadTags` | `(config: SeoConfig) => string` | Returns HTML string of `<meta>` and `<link>` tags |
| `createHeadTagObjects` | `(config: SeoConfig) => HeadTagObject[]` | Returns structured tag objects |

### `SeoConfig`

| Prop | Type | Description |
| --- | --- | --- |
| `title` | `string` | Page title |
| `titleTemplate` | `string` | Title template e.g. `'%s \| Site Name'` |
| `description` | `string` | Meta description |
| `canonical` | `string` | Canonical URL |
| `robots` | `RobotsDirective` | Robots directive configuration |
| `openGraph` | `OpenGraphConfig` | Open Graph properties |
| `twitter` | `TwitterCardConfig` | Twitter Card properties |
| `languageAlternates` | `HreflangEntry[]` | Hreflang entries for i18n |
| `additionalMetaTags` | `MetaTag[]` | Extra custom meta tags |
| `additionalLinkTags` | `LinkTag[]` | Extra custom link tags |

### `RobotsDirective`

| Prop | Type | Description |
| --- | --- | --- |
| `index` | `boolean` | `true` → `index`, `false` → `noindex` |
| `follow` | `boolean` | `true` → `follow`, `false` → `nofollow` |
| `noarchive` | `boolean` | Prevent cached version |
| `nosnippet` | `boolean` | Prevent snippet in results |
| `noimageindex` | `boolean` | Prevent image indexing |
| `notranslate` | `boolean` | Prevent translation offer |
| `maxSnippet` | `number` | Max snippet length |
| `maxImagePreview` | `'none' \| 'standard' \| 'large'` | Max image preview size |
| `maxVideoPreview` | `number` | Max video preview seconds |
| `unavailableAfter` | `string` | ISO 8601 expiry date |

### `OpenGraphConfig`

| Prop | Type | Description |
| --- | --- | --- |
| `type` | `'website' \| 'article' \| 'book' \| 'profile' \| 'music.song' \| 'music.album' \| 'music.playlist' \| 'video.movie' \| 'video.episode' \| 'video.tv_show' \| 'video.other' \| 'product'` | OG object type |
| `title` | `string` | og:title (falls back to `title`) |
| `description` | `string` | og:description (falls back to `description`) |
| `url` | `string` | og:url (falls back to `canonical`) |
| `siteName` | `string` | og:site_name |
| `images` | `OGImage[]` | Array of image objects |
| `locale` | `string` | og:locale (default: `'en_US'`) |
| `article` | `OGArticle` | Article-specific OG properties |

### Types

| Type | Description |
| --- | --- |
| `SeoConfig` | Unified input configuration |
| `RobotsDirective` | Robots directive configuration |
| `OpenGraphConfig` | Open Graph properties |
| `TwitterCardConfig` | Twitter Card configuration |
| `OGImage` | `{ url: string; width?: number; height?: number; alt?: string; type?: string }` |
| `HreflangEntry` | `{ hrefLang: string; href: string }` |
| `HeadTagObject` | `{ tag: string; attrs?: Record<string, string>; children?: string }` |
| `MetaTag` | Custom meta tag with `name` or `property` attributes |
| `LinkTag` | Custom link tag attributes |

---

## Use Cases

- **Next.js App Router** — generate `Metadata` for static and dynamic pages with `generateMetadata()`
- **Remix v2 routes** — generate `MetaDescriptor[]` for route-level meta with loader data
- **Programmatic SEO sites** — generate meta for thousands of auto-generated pages at build time
- **SaaS marketing sites** — enforce consistent meta patterns across all pages
- **Multi-language sites** — include `languageAlternates` for hreflang support
- **E-commerce product pages** — generate Open Graph images and Twitter Cards per product
- **CMS-driven content** — map CMS fields to `SeoConfig` and generate framework-specific output
- **CI assertions** — use `createHeadTagObjects()` to assert meta output correctness in unit tests

---

## Architecture Overview

- **Pure TypeScript** — no compiled binary, no native modules
- **Zero runtime dependencies** — only `@power-seo/core` as a peer dependency
- **Framework-agnostic core** — `SeoConfig` input is framework-neutral; output mappers are separate functions
- **SSR compatible** — all functions are pure and synchronous; safe in Next.js Server Components, Remix loaders, or Express handlers
- **Edge runtime safe** — no Node.js globals used; runs in Cloudflare Workers, Vercel Edge, Deno
- **Advanced robots directives** — `maxSnippet`, `maxImagePreview`, etc. placed in `metadata.other['robots']` via `buildRobotsContent()` since Next.js `Metadata` type does not natively support them
- **Tree-shakeable** — `"sideEffects": false` with named exports per function
- **Dual ESM + CJS** — ships both formats via tsup for any bundler or `require()` usage

---

## Supply Chain Security

- No install scripts (`postinstall`, `preinstall`)
- No runtime network access
- No `eval` or dynamic code execution
- CI-signed builds — all releases published via verified `github.com/CyberCraftBD/power-seo` workflow
- Safe for SSR, Edge, and server environments

---

## The [@power-seo](https://www.npmjs.com/org/power-seo) Ecosystem

All 17 packages are independently installable — use only what you need.

| Package                                                                                    | Install                             | Description                                                             |
| ------------------------------------------------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------- |
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core)                         | `npm i @power-seo/core`             | Framework-agnostic utilities, types, validators, and constants          |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react)                       | `npm i @power-seo/react`            | React SEO components — meta, Open Graph, Twitter Card, breadcrumbs      |
| [`@power-seo/meta`](https://www.npmjs.com/package/@power-seo/meta)                         | `npm i @power-seo/meta`             | SSR meta helpers for Next.js App Router, Remix v2, and generic SSR      |
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema)                     | `npm i @power-seo/schema`           | Type-safe JSON-LD structured data — 23 builders + 21 React components   |
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

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
