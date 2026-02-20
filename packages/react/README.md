# @power-seo/react — React SEO Components for Meta Tags, Open Graph & Structured Data

> Framework-agnostic React components for managing SEO meta tags, Open Graph, Twitter Cards, canonical URLs, hreflang, robots directives, and breadcrumbs. Works with Next.js Pages Router, Vite, Gatsby, and any React application that renders to the DOM.

[![npm version](https://img.shields.io/npm/v/@power-seo/react)](https://www.npmjs.com/package/@power-seo/react)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/react)](https://www.npmjs.com/package/@power-seo/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-%3E%3D18-61DAFB)](https://react.dev/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/react)

`@power-seo/react` provides a complete set of declarative React components for SEO meta tag management. Use `<DefaultSEO>` at the app root to set site-wide defaults, then override per page with `<SEO>`. Includes full robots directive support, Open Graph, Twitter Card, canonical URLs, hreflang internationalization, and breadcrumb navigation with embedded JSON-LD.

## Features

- **`<SEO>` all-in-one component** — renders title, meta description, canonical, robots, Open Graph, and Twitter Card tags from a single component
- **`<DefaultSEO>` context-based defaults** — set site-wide title template, default Open Graph image, and global robots directives; individual pages override selectively
- **`<Robots>` full directive support** — all 10 robots directives including noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, max-snippet, max-image-preview, max-video-preview, unavailable_after
- **`<OpenGraph>` all OG properties** — og:title, og:description, og:type, og:url, og:image (with width/height/alt), og:site_name, og:locale, og:article:* properties
- **`<TwitterCard>` all card types** — summary, summary_large_image, app, player; with site, creator, title, description, image props
- **`<Canonical>` link tag** — renders `<link rel="canonical">` with proper href
- **`<Hreflang>` i18n alternate links** — renders `<link rel="alternate" hreflang="...">` tags for multi-language sites including x-default
- **`<Breadcrumb>` with JSON-LD** — renders visible breadcrumb navigation plus embedded `application/ld+json` BreadcrumbList structured data
- **Framework-agnostic** — works with Next.js Pages Router, Vite + React, Gatsby, Create React App, and any React app using `react-helmet-async` under the hood
- **TypeScript-first** — full `.d.ts` declarations, all props fully typed
- **Tree-shakeable** — import only the components you use
- **Dual ESM + CJS** — works in any bundler or Node.js environment

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [DefaultSEO](#defaultseo)
  - [Per-Page SEO](#per-page-seo)
  - [Robots Directives](#robots-directives)
  - [Open Graph](#open-graph)
  - [Twitter Card](#twitter-card)
  - [Canonical URL](#canonical-url)
  - [Hreflang](#hreflang)
  - [Breadcrumbs](#breadcrumbs)
  - [Utility Functions](#utility-functions)
- [API Reference](#api-reference)
  - [Components](#components)
  - [SEO Props](#seo-props)
  - [DefaultSEO Props](#defaultseo-props)
  - [Robots Props](#robots-props)
  - [OpenGraph Props](#opengraph-props)
  - [TwitterCard Props](#twittercard-props)
  - [Canonical Props](#canonical-props)
  - [Hreflang Props](#hreflang-props)
  - [Breadcrumb Props](#breadcrumb-props)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
npm install @power-seo/react
```

```bash
yarn add @power-seo/react
```

```bash
pnpm add @power-seo/react
```

**Peer dependencies:**

```bash
npm install react react-dom react-helmet-async
```

> Note: `react-helmet-async` is required as a peer dependency for head tag management. Wrap your app in `<HelmetProvider>` from `react-helmet-async`.

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

## Usage

### DefaultSEO

Set site-wide SEO defaults at the root of your application. Individual page `<SEO>` components merge with and override these defaults.

```tsx
import { DefaultSEO } from '@power-seo/react';

<DefaultSEO
  titleTemplate="%s | Acme Inc"
  defaultTitle="Acme Inc — Enterprise Solutions"
  description="Acme Inc builds enterprise-grade software for forward-thinking teams."
  canonical="https://acme.com"
  openGraph={{
    type: 'website',
    siteName: 'Acme Inc',
    images: [{ url: 'https://acme.com/og-default.jpg', width: 1200, height: 630 }],
  }}
  twitter={{ site: '@acmeinc', cardType: 'summary_large_image' }}
  robots={{ index: true, follow: true }}
/>
```

### Per-Page SEO

Override defaults on a per-page basis. Props specified in `<SEO>` take precedence over `<DefaultSEO>`.

```tsx
import { SEO } from '@power-seo/react';

// Blog post page
<SEO
  title="10 Tips for Better SEO"
  description="Learn practical SEO techniques that improve organic search rankings."
  canonical="https://acme.com/blog/10-seo-tips"
  openGraph={{
    type: 'article',
    images: [{ url: 'https://acme.com/blog/seo-tips-cover.jpg', width: 1200, height: 630 }],
    article: {
      publishedTime: '2026-01-15T09:00:00Z',
      modifiedTime: '2026-01-20T12:00:00Z',
      authors: ['https://acme.com/authors/jane-doe'],
      tags: ['SEO', 'Digital Marketing', 'Content'],
    },
  }}
  twitter={{ cardType: 'summary_large_image', creator: '@janedoe' }}
/>

// Private / staging page — prevent indexing
<SEO
  title="Admin Dashboard"
  robots={{ index: false, follow: false }}
/>
```

### Robots Directives

The `<Robots>` component renders a `<meta name="robots">` tag with the full set of Google-supported directives.

```tsx
import { Robots } from '@power-seo/react';

// Standard indexable page
<Robots index={true} follow={true} />

// Block crawlers entirely (staging, admin, draft content)
<Robots index={false} follow={false} />

// Allow indexing but prevent caching and translation
<Robots index={true} follow={true} noarchive={true} notranslate={true} />

// Control snippet and image preview length
<Robots index={true} follow={true} maxSnippet={150} maxImagePreview="large" maxVideoPreview={30} />

// Remove from results after a date (limited-time offers, events)
<Robots index={true} follow={true} unavailableAfter="2026-12-31T23:59:59Z" />

// Prevent image indexing on the page
<Robots index={true} follow={true} noimageindex={true} />
```

Generated HTML examples:

```html
<!-- <Robots index={true} follow={true} maxSnippet={150} maxImagePreview="large" /> -->
<meta name="robots" content="index, follow, max-snippet:150, max-image-preview:large">

<!-- <Robots index={false} follow={false} noarchive={true} /> -->
<meta name="robots" content="noindex, nofollow, noarchive">
```

### Open Graph

```tsx
import { OpenGraph } from '@power-seo/react';

// Website
<OpenGraph
  type="website"
  title="Acme Inc"
  description="Enterprise solutions for modern teams."
  url="https://acme.com"
  siteName="Acme Inc"
  images={[{ url: 'https://acme.com/og.jpg', width: 1200, height: 630, alt: 'Acme Inc' }]}
  locale="en_US"
/>

// Article
<OpenGraph
  type="article"
  title="10 Tips for Better SEO"
  description="Practical SEO techniques for 2026."
  url="https://acme.com/blog/10-seo-tips"
  images={[{ url: 'https://acme.com/og-blog.jpg', width: 1200, height: 630 }]}
  article={{
    publishedTime: '2026-01-15T09:00:00Z',
    authors: ['https://acme.com/authors/jane-doe'],
    section: 'SEO',
    tags: ['SEO', 'Content Marketing'],
  }}
/>
```

### Twitter Card

```tsx
import { TwitterCard } from '@power-seo/react';

// Summary card (square image, compact layout)
<TwitterCard
  cardType="summary"
  site="@acmeinc"
  title="Acme Inc"
  description="Enterprise solutions for modern teams."
  image="https://acme.com/twitter-card.jpg"
  imageAlt="Acme Inc logo"
/>

// Summary large image card (banner-style)
<TwitterCard
  cardType="summary_large_image"
  site="@acmeinc"
  creator="@janedoe"
  title="10 Tips for Better SEO"
  description="Practical techniques that improve organic search rankings in 2026."
  image="https://acme.com/blog/seo-tips-twitter.jpg"
  imageAlt="SEO tips illustration"
/>
```

### Canonical URL

```tsx
import { Canonical } from '@power-seo/react';

<Canonical href="https://example.com/blog/my-post" />
// → <link rel="canonical" href="https://example.com/blog/my-post">
```

### Hreflang

```tsx
import { Hreflang } from '@power-seo/react';

<Hreflang
  links={[
    { hrefLang: 'en', href: 'https://example.com/blog/my-post' },
    { hrefLang: 'fr', href: 'https://fr.example.com/blog/my-post' },
    { hrefLang: 'de', href: 'https://de.example.com/blog/my-post' },
    { hrefLang: 'x-default', href: 'https://example.com/blog/my-post' },
  ]}
/>
// Renders:
// <link rel="alternate" hreflang="en" href="https://example.com/blog/my-post">
// <link rel="alternate" hreflang="fr" href="https://fr.example.com/blog/my-post">
// <link rel="alternate" hreflang="de" href="https://de.example.com/blog/my-post">
// <link rel="alternate" hreflang="x-default" href="https://example.com/blog/my-post">
```

### Breadcrumbs

`<Breadcrumb>` renders both a visible breadcrumb nav element and an embedded JSON-LD `BreadcrumbList` for rich results in Google Search.

```tsx
import { Breadcrumb } from '@power-seo/react';

<Breadcrumb
  items={[
    { name: 'Home', url: 'https://example.com' },
    { name: 'Blog', url: 'https://example.com/blog' },
    { name: 'SEO Tips' }, // last item — no URL needed (current page)
  ]}
  separator="/"
  className="breadcrumb-nav"
/>
```

Rendered output includes both the visible `<nav>` element and the `<script type="application/ld+json">` BreadcrumbList schema.

### Utility Functions

```ts
import { buildRobotsContent, parseRobotsContent } from '@power-seo/react';

// Also re-exported from @power-seo/core for convenience
buildRobotsContent({ index: false, follow: true, maxSnippet: 150 });
// → "noindex, follow, max-snippet:150"
```

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

### DefaultSEO Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `titleTemplate` | `string` | `'%s'` | Title template e.g. `'%s \| My Site'` |
| `defaultTitle` | `string` | — | Title used when no page title is set |
| `description` | `string` | — | Default meta description |
| `canonical` | `string` | — | Default canonical base URL |
| `openGraph` | `OpenGraphConfig` | — | Default Open Graph config |
| `twitter` | `TwitterConfig` | — | Default Twitter Card config |
| `robots` | `RobotsDirective` | — | Global robots directive |
| `languageAlternates` | `HreflangEntry[]` | — | Global hreflang entries |
| `additionalMetaTags` | `MetaTag[]` | — | Default additional meta tags |
| `additionalLinkTags` | `LinkTag[]` | — | Default additional link tags |

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

### OpenGraph Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'website' \| 'article' \| 'book' \| 'profile' \| 'music' \| 'video'` | `'website'` | OG type |
| `title` | `string` | — | og:title |
| `description` | `string` | — | og:description |
| `url` | `string` | — | og:url (canonical page URL) |
| `siteName` | `string` | — | og:site_name |
| `images` | `OGImage[]` | — | og:image entries (url, width, height, alt) |
| `locale` | `string` | `'en_US'` | og:locale |
| `article` | `OGArticle` | — | Article-specific properties (publishedTime, authors, tags) |
| `profile` | `OGProfile` | — | Profile-specific properties (firstName, lastName, username) |

### TwitterCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cardType` | `'summary' \| 'summary_large_image' \| 'app' \| 'player'` | `'summary'` | Twitter card type |
| `site` | `string` | — | @username of the website's Twitter account |
| `creator` | `string` | — | @username of the content creator |
| `title` | `string` | — | Card title |
| `description` | `string` | — | Card description |
| `image` | `string` | — | Image URL (must be absolute) |
| `imageAlt` | `string` | — | Alt text for the card image |

### Canonical Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | **Required.** The canonical URL (must be absolute) |

### Hreflang Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `links` | `HreflangEntry[]` | — | **Required.** Array of `{ hrefLang: string; href: string }` objects |

### Breadcrumb Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | — | **Required.** Array of `{ name: string; url?: string }` objects |
| `separator` | `string` | `'/'` | Visual separator between breadcrumb items |
| `className` | `string` | — | CSS class for the outer `<nav>` element |
| `itemClassName` | `string` | — | CSS class for each `<span>` item |
| `activeClassName` | `string` | — | CSS class for the last (current) item |
| `renderJsonLd` | `boolean` | `true` | Whether to render the BreadcrumbList JSON-LD script |

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
