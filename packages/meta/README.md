# @power-seo/meta

![Cross-framework SSR meta tag generator for Next.js App Router, Remix v2, and generic SSR](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/banner.svg)

[![npm version](https://img.shields.io/npm/v/@power-seo/meta)](https://www.npmjs.com/package/@power-seo/meta)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/meta)](https://www.npmjs.com/package/@power-seo/meta)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/meta)](https://socket.dev/npm/package/@power-seo/meta)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/meta)

One SEO config in, framework-native head tags out — for Next.js App Router, Remix v2, and any generic SSR runtime.

`@power-seo/meta` is a server-side meta tag generation library that takes one shared `SEOConfig` object and emits the correct output for every major SSR framework. It is for developers who maintain SEO across more than one framework — or who want a single, typed source of truth for titles, canonicals, Open Graph, Twitter Cards, robots directives, and hreflang. It exists because each framework wants a different shape (Next.js wants a `Metadata` object, Remix wants a `MetaDescriptor[]`, plain SSR wants an HTML string), and hand-mapping that per page is where head-tag bugs hide.

![SSR meta tag helpers mapping one SEOConfig to Next.js, Remix, and generic SSR outputs](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/header.svg)

---

## Why @power-seo/meta?

Meta tags are the highest-leverage, most-copy-pasted lines of SEO code in any codebase. When the same title, canonical, and Open Graph values have to be re-expressed in three framework dialects, they drift — a stale canonical here, a missing `og:image` there. This package makes the `SEOConfig` the single source of truth and generates the framework-native output for you, so the values stay in sync and stay typed.

![Workflow comparison: maintaining hand-written meta boilerplate for each framework versus generating all meta output from one SeoConfig with @power-seo/meta](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/roi.svg)

|                      | Without                                                         | With                                                           |
| -------------------- | --------------------------------------------------------------- | -------------------------------------------------------------- |
| Cross-framework meta | Different boilerplate for Next.js, Remix, and generic SSR       | One `SEOConfig` → correct output per framework                 |
| Robots directives    | `maxSnippet`, `maxImagePreview` need framework-specific mapping | Serialized correctly per target automatically                  |
| Open Graph images    | Manual array construction, inconsistent fields                  | Typed `OpenGraphImage[]` with `width`, `height`, `alt`, `type` |
| Twitter Cards        | Hand-coded string fields, easy typos                            | Typed `TwitterCardConfig` for every card type                  |
| Canonical URLs       | Omitted or duplicated across pages                              | Always in `SEOConfig`; routed to the right output field        |
| Hreflang             | Manual `<link rel="alternate">` per locale                      | `languageAlternates` renders every alternate                   |
| TypeScript           | Loosely typed head objects, no autocomplete                     | Fully typed return per framework — no casting                  |

![Comparison of hand-written framework meta boilerplate versus a single typed SEOConfig](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/comparison.svg)

---

## Features

![Six key benefits of @power-seo/meta: one unified SeoConfig, native Next.js Metadata, native Remix v2 output, full robots directives, zero runtime dependencies, and typed Open Graph and Twitter configuration](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/benefits.svg)

- **`createMetadata()`** — returns a Next.js App Router `Metadata`-shaped object, compatible with `generateMetadata()` and `export const metadata`. Advanced robots directives (`maxSnippet`, `maxImagePreview`, `maxVideoPreview`) are serialized into `metadata.other['robots']` via `buildRobotsContent()`, since the Next.js `Metadata` type does not model them natively.
- **`createMetaDescriptors()`** — returns a Remix v2 `MetaDescriptor[]` array for `export const meta`, with no `@remix-run/react` import required.
- **`createHeadTags()`** — returns an HTML string of `<title>`, `<meta>`, and `<link>` tags for Astro, SvelteKit, Express, Fastify, and any generic SSR framework.
- **`createHeadTagObjects()`** — returns structured `HeadTag[]` objects for custom renderers, template engines, and CI assertions.
- **Robots directive support** — `index`, `follow`, `noarchive`, `nosnippet`, `noimageindex`, `notranslate`, `maxSnippet`, `maxImagePreview`, `maxVideoPreview`, `unavailableAfter`, plus top-level `noindex`/`nofollow` shortcuts.
- **Open Graph image arrays** — multiple images with `width`, `height`, `alt`, and `type`; `og:title`, `og:description`, and `og:url` fall back to top-level `title`/`description`/`canonical` when not set.
- **Twitter Card support** — all four card types and their properties via `TwitterCardConfig`.
- **Canonical + hreflang** — canonical routed to the framework-native field; `languageAlternates` expanded to per-locale alternates.
- **XSS-safe HTML output** — `createHeadTags()` escapes `&`, `"`, `<`, and `>` in every attribute value.
- **Zero third-party runtime dependencies** — depends only on `@power-seo/core`; edge-runtime compatible.

![Rendered head tag output showing title, canonical, Open Graph, Twitter, and robots meta](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/ui-output.svg)

---

## Comparison

| Feature                              | @power-seo/meta | next-seo | remix-seo | react-helmet |
| ------------------------------------ | :-------------: | :------: | :-------: | :----------: |
| Next.js App Router native `Metadata` |       Yes       |    No    |    No     |      No      |
| Remix v2 native `MetaDescriptor[]`   |       Yes       |    No    |    Yes    |      No      |
| Generic SSR HTML string output       |       Yes       |    No    |    No     |      No      |
| Robots directive coverage            |       Yes       |   Yes    |    Yes    |   Partial    |
| One config → multiple frameworks     |       Yes       |    No    |    No     |      No      |
| Structured tag-object output         |       Yes       |    No    |    No     |      No      |
| Zero third-party runtime deps        |       Yes       |    No    |    Yes    |      No      |
| Typed return per framework           |       Yes       |   Yes    |    Yes    |      No      |
| Tree-shakeable                       |       Yes       |    No    |  Partial  |      No      |

![Precise robots directive serialization including maxSnippet and maxImagePreview](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/meta/robots-precision.svg)

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

Requires Node.js `>=18`. Ships dual ESM + CJS builds and TypeScript declarations.

---

## Usage

Every function accepts the same `SEOConfig` object. Only the output shape differs per framework.

### How do I generate metadata for a Next.js App Router page?

Import `createMetadata` and export its result as `metadata`, or return it from `generateMetadata()`. It produces a Next.js `Metadata`-shaped object: `title`, `description`, `robots`, `openGraph`, `twitter`, and `alternates.canonical` map to native fields, while advanced robots directives land in `metadata.other['robots']`. `og:title`, `og:description`, and `og:url` fall back to the top-level `title`, `description`, and `canonical` when omitted.

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
    images: [
      { url: 'https://example.com/og-home.jpg', width: 1200, height: 630, alt: 'Example Site' },
    ],
  },
  twitter: { cardType: 'summary_large_image', site: '@examplesite' },
  robots: { index: true, follow: true },
});
```

### How do I generate dynamic metadata per route in Next.js?

Return `createMetadata()` from an async `generateMetadata()` function. Fetch your data first, then map it onto the `SEOConfig`. Advanced robots directives such as `maxSnippet` and `maxImagePreview` are serialized into `metadata.other['robots']`, so Google receives them even though Next.js does not expose them on the typed `Metadata` object.

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
    noindex: post.isDraft,
    robots: { index: true, follow: true, maxSnippet: 160, maxImagePreview: 'large' },
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
  });
}
```

### How do I generate Remix v2 route meta?

Return `createMetaDescriptors()` from your route's `meta` export. It returns a `MetaDescriptor[]` union array — `{ title }`, `{ name, content }`, `{ property, content }`, and `{ tagName: 'link', rel, href }` entries — matching Remix's shape with no framework import.

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

### How do I render meta tags in Astro, Express, or Fastify?

Call `createHeadTags()` to get an HTML string of `<title>`, `<meta>`, and `<link>` tags, then inject it into your `<head>`. Every attribute value is HTML-escaped, so untrusted title or description input is safe to serialize.

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

### How do I assert meta output in tests?

Use `createHeadTagObjects()` to get structured `HeadTag[]` objects — each `{ tag, attributes, content? }` — which you can inspect programmatically in unit tests or feed to a custom renderer.

```ts
import { createHeadTagObjects } from '@power-seo/meta';

const tags = createHeadTagObjects({
  title: 'My Page',
  description: 'A page about something great.',
  canonical: 'https://example.com/my-page',
  robots: { index: true, follow: true },
});
// [
//   { tag: 'title', attributes: {}, content: 'My Page' },
//   { tag: 'meta', attributes: { name: 'description', content: 'A page about something great.' } },
//   { tag: 'meta', attributes: { name: 'robots', content: 'index, follow' } },
//   { tag: 'link', attributes: { rel: 'canonical', href: 'https://example.com/my-page' } },
// ]
```

---

## API Reference

All four functions take a single `SEOConfig` argument and are pure and synchronous.

| Function                | Signature                                      | Returns                                           |
| ----------------------- | ---------------------------------------------- | ------------------------------------------------- |
| `createMetadata`        | `(config: SEOConfig) => NextMetadata`          | Next.js App Router `Metadata`-shaped object       |
| `createMetaDescriptors` | `(config: SEOConfig) => RemixMetaDescriptor[]` | Remix v2 `MetaDescriptor[]` array                 |
| `createHeadTags`        | `(config: SEOConfig) => string`                | HTML string of `<title>`, `<meta>`, `<link>` tags |
| `createHeadTagObjects`  | `(config: SEOConfig) => HeadTag[]`             | Structured head-tag objects                       |

### `SEOConfig` (input, from `@power-seo/core`)

| Prop                 | Type                | Description                              |
| -------------------- | ------------------- | ---------------------------------------- |
| `title`              | `string`            | Page title                               |
| `titleTemplate`      | `string`            | Title template, e.g. `'%s \| Site Name'` |
| `defaultTitle`       | `string`            | Default title used with `titleTemplate`  |
| `description`        | `string`            | Meta description                         |
| `canonical`          | `string`            | Canonical URL                            |
| `noindex`            | `boolean`           | Shortcut → forces `index: false`         |
| `nofollow`           | `boolean`           | Shortcut → forces `follow: false`        |
| `robots`             | `RobotsDirective`   | Robots directive configuration           |
| `openGraph`          | `OpenGraphConfig`   | Open Graph properties                    |
| `twitter`            | `TwitterCardConfig` | Twitter Card properties                  |
| `languageAlternates` | `HreflangConfig[]`  | Hreflang entries for i18n                |
| `additionalMetaTags` | `MetaTag[]`         | Extra custom meta tags                   |
| `additionalLinkTags` | `LinkTag[]`         | Extra custom link tags                   |

### `RobotsDirective`

| Prop               | Type                              | Description                             |
| ------------------ | --------------------------------- | --------------------------------------- |
| `index`            | `boolean`                         | `true` → `index`, `false` → `noindex`   |
| `follow`           | `boolean`                         | `true` → `follow`, `false` → `nofollow` |
| `noarchive`        | `boolean`                         | Prevent cached version                  |
| `nosnippet`        | `boolean`                         | Prevent snippet in results              |
| `noimageindex`     | `boolean`                         | Prevent image indexing                  |
| `notranslate`      | `boolean`                         | Prevent translation offer               |
| `maxSnippet`       | `number`                          | Max snippet length in characters        |
| `maxImagePreview`  | `'none' \| 'standard' \| 'large'` | Max image preview size                  |
| `maxVideoPreview`  | `number`                          | Max video preview length in seconds     |
| `unavailableAfter` | `string`                          | ISO 8601 expiry date                    |

### `OpenGraphConfig`

| Prop          | Type               | Description                                                      |
| ------------- | ------------------ | ---------------------------------------------------------------- |
| `type`        | `OpenGraphType`    | OG object type (`'website'`, `'article'`, `'product'`, and more) |
| `title`       | `string`           | `og:title` (falls back to `title`)                               |
| `description` | `string`           | `og:description` (falls back to `description`)                   |
| `url`         | `string`           | `og:url` (falls back to `canonical`)                             |
| `siteName`    | `string`           | `og:site_name`                                                   |
| `locale`      | `string`           | `og:locale`                                                      |
| `images`      | `OpenGraphImage[]` | Array of Open Graph image objects                                |
| `article`     | `OpenGraphArticle` | Article-specific OG properties                                   |

### `TwitterCardConfig`

| Prop          | Type                                                      | Description                                         |
| ------------- | --------------------------------------------------------- | --------------------------------------------------- |
| `cardType`    | `'summary' \| 'summary_large_image' \| 'app' \| 'player'` | Twitter Card type                                   |
| `site`        | `string`                                                  | `twitter:site` handle                               |
| `creator`     | `string`                                                  | `twitter:creator` handle                            |
| `title`       | `string`                                                  | `twitter:title` (falls back to `title`)             |
| `description` | `string`                                                  | `twitter:description` (falls back to `description`) |
| `image`       | `string`                                                  | `twitter:image` URL                                 |

---

## Types

All input types are re-exported from `@power-seo/core`; framework output types are defined in this package.

| Type                  | Source            | Shape                                                        |
| --------------------- | ----------------- | ------------------------------------------------------------ |
| `SEOConfig`           | `@power-seo/core` | Unified input configuration                                  |
| `RobotsDirective`     | `@power-seo/core` | Robots directive configuration                               |
| `OpenGraphConfig`     | `@power-seo/core` | Open Graph properties                                        |
| `OpenGraphImage`      | `@power-seo/core` | `{ url; secureUrl?; type?; width?; height?; alt? }`          |
| `TwitterCardConfig`   | `@power-seo/core` | Twitter Card configuration                                   |
| `HreflangConfig`      | `@power-seo/core` | `{ hrefLang: string; href: string }`                         |
| `MetaTag`             | `@power-seo/core` | `{ name?; property?; httpEquiv?; content }`                  |
| `LinkTag`             | `@power-seo/core` | Custom link tag attributes                                   |
| `NextMetadata`        | `@power-seo/meta` | Next.js App Router `Metadata`-shaped object                  |
| `NextOGImage`         | `@power-seo/meta` | `{ url; width?; height?; alt?; type? }`                      |
| `RemixMetaDescriptor` | `@power-seo/meta` | Remix v2 `MetaDescriptor` union member                       |
| `HeadTag`             | `@power-seo/meta` | `{ tag: 'meta' \| 'link' \| 'title'; attributes; content? }` |

---

## Use Cases

- **Next.js App Router** — generate `Metadata` for static and dynamic pages via `generateMetadata()`.
- **Remix v2 routes** — generate `MetaDescriptor[]` from loader data in the `meta` export.
- **Programmatic SEO** — build meta for thousands of auto-generated pages at build time.
- **SaaS marketing sites** — enforce one consistent meta pattern across every page.
- **Multi-language sites** — expand `languageAlternates` into per-locale hreflang links.
- **E-commerce product pages** — emit Open Graph images and Twitter Cards per product.
- **CMS-driven content** — map CMS fields onto `SEOConfig` and render framework-native output.
- **CI assertions** — inspect `createHeadTagObjects()` output to catch meta regressions in tests.

---

## Architecture Overview

- **Framework-neutral input** — every function reads the same `SEOConfig`; only the output mapper differs, so the same values render identically across frameworks.
- **Pure and synchronous** — no async, no I/O; safe inside Next.js Server Components, Remix loaders, and Express handlers.
- **Advanced robots handling** — `maxSnippet`, `maxImagePreview`, and `maxVideoPreview` are serialized with `buildRobotsContent()` into `metadata.other['robots']`, because the Next.js `Metadata` type does not model them directly.
- **XSS-safe serialization** — `createHeadTags()` escapes `&`, `"`, `<`, and `>` in every attribute value before joining tags.
- **Edge-runtime safe** — no Node.js globals; runs on Cloudflare Workers, Vercel Edge, and Deno.
- **Tree-shakeable** — `"sideEffects": false` with one named export per function.
- **Dual ESM + CJS** — ships both formats via tsup for any bundler or `require()` consumer.

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

seo, meta tags, nextjs metadata, app router, generateMetadata, remix v2, MetaDescriptor, generic ssr, open graph, twitter card, canonical url, robots directives, hreflang, server-side rendering, edge runtime, typescript, head tags, structured metadata, power-seo

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
