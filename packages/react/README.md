# @power-seo/react — React SEO Components for Meta Tags, Open Graph, Twitter Card, Robots & Breadcrumbs

[![npm version](https://img.shields.io/npm/v/@power-seo/react)](https://www.npmjs.com/package/@power-seo/react)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/react)](https://www.npmjs.com/package/@power-seo/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-%3E%3D18-61DAFB)](https://react.dev/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/react)

---

## Overview

**@power-seo/react** is a complete set of declarative React components for SEO meta tag management for Next.js Pages Router, Vite, Gatsby, and any React application that renders to the DOM, helping you manage titles, Open Graph, Twitter Cards, canonical URLs, robots directives, hreflang, and breadcrumbs from a single composable API.

**What it does**
- ✅ **All-in-one `<SEO>` component** — renders title, meta description, canonical, robots, Open Graph, and Twitter Card from one component
- ✅ **Context-based defaults** — `<DefaultSEO>` at app root sets site-wide defaults; pages override selectively
- ✅ **Full robots directive support** — all 10 directives including `noindex`, `noarchive`, `max-snippet`, `max-image-preview`, `unavailable_after`
- ✅ **Hreflang internationalization** — `<Hreflang>` renders `<link rel="alternate">` tags for multi-language sites
- ✅ **Breadcrumbs with JSON-LD** — `<Breadcrumb>` renders visible nav plus embedded BreadcrumbList structured data

**What it is not**
- ❌ **Not an App Router solution** — use `@power-seo/meta` for Next.js App Router `generateMetadata()`
- ❌ **Not server-side only** — requires `react-helmet-async` under the hood; targets DOM-rendering React apps

**Recommended for**
- **Next.js Pages Router apps**, **Vite + React SPAs**, **Gatsby sites**, and **Create React App projects**

---

## Why @power-seo/react Matters

**The problem**
- **Scattered meta tag management** — teams add `<Helmet>` blocks inconsistently across hundreds of components
- **Missing Open Graph images** — no single source of truth for default OG images leads to bare link previews
- **Incorrect robots directives** — hand-crafted `content` strings omit valid directives or include typos

**Why developers care**
- **SEO:** Consistent title templates and canonical URLs prevent duplicate content penalties
- **UX:** Correct OG and Twitter Card images dramatically increase social click-through
- **Performance:** Centralized `<DefaultSEO>` prevents redundant meta tag renders on every page

---

## Key Features

- **`<SEO>` all-in-one component** — renders title, meta description, canonical, robots, Open Graph, and Twitter Card tags from a single component
- **`<DefaultSEO>` context-based defaults** — set site-wide title template, default OG image, and global robots directives; individual pages override selectively
- **`<Robots>` full directive support** — all 10 robots directives including `noindex`, `nofollow`, `noarchive`, `nosnippet`, `noimageindex`, `notranslate`, `max-snippet`, `max-image-preview`, `max-video-preview`, `unavailable_after`
- **`<OpenGraph>` all OG properties** — `og:title`, `og:description`, `og:type`, `og:url`, `og:image` (with width/height/alt), `og:site_name`, `og:locale`, `og:article:*` properties
- **`<TwitterCard>` all card types** — `summary`, `summary_large_image`, `app`, `player`; with site, creator, title, description, image
- **`<Canonical>` link tag** — renders `<link rel="canonical">` with proper href
- **`<Hreflang>` i18n alternate links** — renders `<link rel="alternate" hreflang="...">` tags for multi-language sites including `x-default`
- **`<Breadcrumb>` with JSON-LD** — renders visible breadcrumb navigation plus embedded `application/ld+json` BreadcrumbList
- **TypeScript-first** — full `.d.ts` declarations, all props fully typed
- **Tree-shakeable** — import only the components you use

---

## Benefits of Using @power-seo/react

- **Improved consistency**: `<DefaultSEO>` enforces site-wide title templates and OG defaults with zero duplication
- **Better social visibility**: Correct `<TwitterCard>` and `<OpenGraph>` images increase social click-through rates
- **Safer SEO implementation**: Typed robots directive props prevent typos that could accidentally noindex pages
- **Faster delivery**: Drop-in components eliminate boilerplate meta tag code from every page component

---

## Quick Start

```tsx
import { HelmetProvider } from 'react-helmet-async';
import { DefaultSEO, SEO } from '@power-seo/react';

function App() {
  return (
    <HelmetProvider>
      <DefaultSEO
        titleTemplate="%s | My Site"
        defaultTitle="My Site"
        description="The best site on the internet."
        openGraph={{ type: 'website', siteName: 'My Site' }}
        twitter={{ site: '@mysite', cardType: 'summary_large_image' }}
      />
      <Router>
        <Routes />
      </Router>
    </HelmetProvider>
  );
}

function BlogPage({ post }) {
  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`https://example.com/blog/${post.slug}`}
        openGraph={{
          type: 'article',
          images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
        }}
      />
      <article>{/* content */}</article>
    </>
  );
}
```

**What you should see**
- `<title>My Post Title | My Site</title>` in the DOM `<head>`
- Correct `og:image`, `twitter:card`, and `link rel="canonical"` tags on every page

---

## Installation

```bash
npm i @power-seo/react
# or
yarn add @power-seo/react
# or
pnpm add @power-seo/react
# or
bun add @power-seo/react
```

**Peer dependencies:**

```bash
npm install react react-dom react-helmet-async
```

> Note: Wrap your app in `<HelmetProvider>` from `react-helmet-async`.

---

## Framework Compatibility

**Supported**
- ✅ Next.js Pages Router — works with `_app.tsx` and per-page `<SEO>` components
- ✅ Vite + React — works in standard SPA setup
- ✅ Gatsby — works with `gatsby-plugin-react-helmet` or standalone
- ✅ Create React App — works out of the box

**Environment notes**
- **SSR/SSG:** Supported via `react-helmet-async` (SSR-safe)
- **Edge runtime:** Not supported (requires DOM/React reconciler)
- **Next.js App Router:** Not recommended — use `@power-seo/meta` instead for App Router

---

## Use Cases

- **Next.js Pages Router sites** — per-page SEO with site-wide defaults
- **SaaS marketing sites** — consistent OG cards for every landing page
- **Blog platforms** — article Open Graph with `og:article:publishedTime` and author data
- **E-commerce listings** — product pages with correct canonical and Twitter Cards
- **Multi-language sites** — hreflang alternate link management across locale variants
- **Staging environments** — easily `noindex` entire environments with a single `<DefaultSEO robots={{ index: false }} />`
- **Breadcrumb navigation** — visible breadcrumbs with embedded JSON-LD for Google rich results

---

## Example (Before / After)

```text
Before:
- Each page has a different <Helmet> implementation with inconsistent OG formats
- Some pages missing canonical, some missing twitter:card
- Robots directives hand-coded as raw strings with typos

After (@power-seo/react):
- <DefaultSEO> enforces site-wide title template and default OG image
- <SEO> on each page overrides only what differs — canonical, OG image, article properties
- <Robots> accepts typed boolean props — no raw content string typos
```

---

## Implementation Best Practices

- **Always use `<HelmetProvider>`** at the root — required for SSR and correct head management
- **Set `<DefaultSEO>` once** at the app root — every page inherits defaults without re-declaring
- **Use `noindex={true}` on `<SEO>`** for staging, admin, and private pages — not in `next.config.js` redirects
- **Always set `canonical`** on pages with query parameters to prevent duplicate content
- **Include `x-default` in `<Hreflang>`** to signal the default language for international visitors

---

## Architecture Overview

**Where it runs**
- **Client-side (CSR):** `react-helmet-async` manages `<head>` updates on navigation
- **Server-side (SSR):** `HelmetProvider` collects head tags during render and serializes them into the initial HTML
- **CI/CD:** No direct CI integration — audit head tags with `@power-seo/audit`

**Data flow**
1. **Input**: Page-level title, description, OG config, robots directive props
2. **Analysis**: `react-helmet-async` merges `<DefaultSEO>` defaults with `<SEO>` overrides
3. **Output**: Rendered `<head>` tags: `<title>`, `<meta>`, `<link>`, `<script>` (JSON-LD for breadcrumbs)
4. **Action**: Correct head tags for crawlers, social scrapers, and browser tab display

---

## Features Comparison with Popular Packages

| Capability | next-seo | react-helmet | react-helmet-async | @power-seo/react |
|---|---:|---:|---:|---:|
| Typed robots directives | ✅ | ❌ | ❌ | ✅ |
| DefaultSEO context pattern | ✅ | ❌ | ❌ | ✅ |
| Hreflang support | ✅ | ❌ | ❌ | ✅ |
| Breadcrumb with JSON-LD | ✅ | ❌ | ❌ | ✅ |
| `max-snippet` / `max-image-preview` | ✅ | ❌ | ❌ | ✅ |
| TypeScript-first API | ✅ | ⚠️ | ⚠️ | ✅ |

---

## @power-seo Ecosystem

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

### Ecosystem vs alternatives

| Need | Common approach | @power-seo approach |
|---|---|---|
| React meta tags | `next-seo` / `react-helmet` | `@power-seo/react` — typed components |
| App Router metadata | `generateMetadata()` | `@power-seo/meta` — typed helpers |
| JSON-LD structured data | Manual `<script>` tags | `@power-seo/schema` — typed builders |
| Sitemap generation | `next-sitemap` | `@power-seo/sitemap` — streaming + index |

---

## Enterprise Integration

**Multi-tenant SaaS**
- **Tenant-aware title templates**: Pass tenant name into `<DefaultSEO titleTemplate="%s | {tenantName}" />`
- **Per-tenant OG images**: Different default OG image per tenant via `<DefaultSEO openGraph={{ images: [...] }} />`
- **Staging noindex**: Wrap entire staging apps in `<DefaultSEO robots={{ index: false }} />`

**ERP / internal portals**
- Apply `noindex, nofollow` globally on internal modules
- Add breadcrumbs with JSON-LD only on public-facing pages
- Use `<Hreflang>` for internationalized ERP portals with locale-specific URLs

**Recommended integration pattern**
- Set `<DefaultSEO>` in `_app.tsx` or root layout
- Override with `<SEO>` on each page using data fetched server-side
- Audit head tags in CI using `@power-seo/audit`

---

## Scope and Limitations

**This package does**
- ✅ Render React head tag components for DOM-based React apps
- ✅ Manage title templates, Open Graph, Twitter Cards, robots, canonical, hreflang
- ✅ Render breadcrumb navigation with embedded JSON-LD

**This package does not**
- ❌ Work with Next.js App Router `generateMetadata()` — use `@power-seo/meta` instead
- ❌ Generate sitemaps — use `@power-seo/sitemap`
- ❌ Build JSON-LD schemas beyond breadcrumbs — use `@power-seo/schema`

---

## API Reference

### Components

| Component | Description |
|-----------|-------------|
| `<SEO>` | All-in-one per-page SEO component — title, description, canonical, robots, OG, Twitter |
| `<DefaultSEO>` | App-root defaults — title template, global OG, global Twitter, global robots |
| `<Robots>` | Renders `<meta name="robots">` with all supported directives |
| `<OpenGraph>` | Renders Open Graph `og:*` meta tags |
| `<TwitterCard>` | Renders Twitter Card `twitter:*` meta tags |
| `<Canonical>` | Renders `<link rel="canonical">` |
| `<Hreflang>` | Renders `<link rel="alternate" hreflang="...">` tags |
| `<Breadcrumb>` | Renders breadcrumb nav + embedded BreadcrumbList JSON-LD |

### SEO Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Page title (applied to title template if DefaultSEO is present) |
| `description` | `string` | — | Meta description |
| `canonical` | `string` | — | Canonical URL |
| `robots` | `RobotsDirective` | — | Robots directive config object |
| `openGraph` | `OpenGraphConfig` | — | Open Graph configuration |
| `twitter` | `TwitterConfig` | — | Twitter Card configuration |
| `noindex` | `boolean` | `false` | Shorthand for `robots.index = false` |
| `nofollow` | `boolean` | `false` | Shorthand for `robots.follow = false` |
| `languageAlternates` | `HreflangEntry[]` | — | Hreflang entries for i18n |
| `additionalMetaTags` | `MetaTag[]` | — | Any additional custom meta tags |
| `additionalLinkTags` | `LinkTag[]` | — | Any additional custom link tags |

### Robots Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `boolean` | `true` | `true` → `index`, `false` → `noindex` |
| `follow` | `boolean` | `true` | `true` → `follow`, `false` → `nofollow` |
| `noarchive` | `boolean` | `false` | Prevent cached version in search results |
| `nosnippet` | `boolean` | `false` | Prevent text/video snippet in results |
| `noimageindex` | `boolean` | `false` | Prevent image indexing on this page |
| `notranslate` | `boolean` | `false` | Prevent Google Translate offer |
| `maxSnippet` | `number` | — | Max text snippet length (e.g. `150`) |
| `maxImagePreview` | `'none' \| 'standard' \| 'large'` | — | Max image preview size in results |
| `maxVideoPreview` | `number` | — | Max video preview duration in seconds |
| `unavailableAfter` | `string` | — | ISO 8601 date after which to remove page from results |

### Breadcrumb Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | — | **Required.** Array of `{ name: string; url?: string }` objects |
| `separator` | `string` | `'/'` | Visual separator between breadcrumb items |
| `className` | `string` | — | CSS class for the outer `<nav>` element |
| `itemClassName` | `string` | — | CSS class for each `<span>` item |
| `activeClassName` | `string` | — | CSS class for the last (current) item |
| `renderJsonLd` | `boolean` | `true` | Whether to render the BreadcrumbList JSON-LD script |

### Utility Functions

```ts
import { buildRobotsContent, parseRobotsContent } from '@power-seo/react';

buildRobotsContent({ index: false, follow: true, maxSnippet: 150 });
// → "noindex, follow, max-snippet:150"
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
seo, react, meta-tags, open-graph, twitter-card, robots, canonical, hreflang, breadcrumb, json-ld, nextjs, gatsby, typescript, react-helmet
```
