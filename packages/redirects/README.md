# @power-seo/redirects — URL Redirect Rule Engine for Next.js, Remix, and Express

Production-ready redirect engine with exact, glob, and regex pattern matching — plus drop-in adapters for Next.js, Remix, and Express.

[![npm version](https://img.shields.io/npm/v/@power-seo/redirects?style=flat-square)](https://www.npmjs.com/package/@power-seo/redirects)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/redirects?style=flat-square)](https://www.npmjs.com/package/@power-seo/redirects)
[![MIT License](https://img.shields.io/npm/l/@power-seo/redirects?style=flat-square)](../../LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen?style=flat-square)](#)

`@power-seo/redirects` is a framework-agnostic URL redirect rule engine that handles every redirection pattern you'll encounter in modern web development. Whether you're migrating a legacy site, restructuring URLs for SEO, or enforcing canonical paths, this package gives you a single, type-safe API to define and match redirect rules.

Rules are defined once and converted to the native format of your target framework — no reimplementing the same logic for Next.js `next.config.js`, Remix loaders, and Express middleware separately. The engine supports exact string matches, glob wildcards, and full regular expressions, with `:param` named group substitution in destination URLs.

The package is fully isomorphic (Node.js and edge runtimes), has zero runtime dependencies, and ships with complete TypeScript types. Every exported function is individually tree-shakeable, so bundlers only include what you actually use.

## Features

- **Exact matching** — byte-for-byte URL comparison with optional case sensitivity control
- **Glob pattern matching** — `*` wildcard and `:param` named segment support (e.g., `/blog/:slug`)
- **Regex pattern matching** — full regular expression matching with named capture group extraction
- **301 and 302 status codes** — permanent and temporary redirect support via `RedirectStatusCode` union type
- **`:param` substitution** — named parameter placeholders in destination URLs (`substituteParams`)
- **Trailing slash normalization** — configurable trailing-slash handling for canonical URL enforcement
- **Case-sensitive option** — per-engine or per-rule case sensitivity control
- **Next.js adapter** — `toNextRedirects(rules)` converts rules to the array format expected by `next.config.js`
- **Remix loader adapter** — `createRemixRedirectHandler(rules)` returns a loader function that calls `redirect()` when a rule matches
- **Express middleware adapter** — `createExpressRedirectMiddleware(rules)` returns an Express `RequestHandler`
- **Priority-ordered rule evaluation** — rules are evaluated top-to-bottom; first match wins
- **Type-safe configuration** — full TypeScript generics for `RedirectRule`, `RedirectMatch`, and `RedirectEngineConfig`
- **Zero dependencies** — no runtime dependencies; lightweight and edge-compatible

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Redirect Engine](#redirect-engine)
  - [Pattern Matchers](#pattern-matchers)
  - [Next.js Adapter](#nextjs-adapter)
  - [Remix Adapter](#remix-adapter)
  - [Express Adapter](#express-adapter)
  - [Trailing Slash Normalization](#trailing-slash-normalization)
- [API Reference](#api-reference)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
# npm
npm install @power-seo/redirects

# yarn
yarn add @power-seo/redirects

# pnpm
pnpm add @power-seo/redirects
```

## Quick Start

```ts
import { createRedirectEngine } from '@power-seo/redirects';

const engine = createRedirectEngine({
  rules: [
    { source: '/old-about',       destination: '/about',           statusCode: 301 },
    { source: '/blog/:slug',      destination: '/articles/:slug',  statusCode: 301 },
    { source: '/docs/*',          destination: '/documentation/*', statusCode: 302 },
    { source: '/legacy/(\\d+)',   destination: '/posts/$1',        statusCode: 301 },
  ],
});

const match = engine.match('/blog/my-seo-guide');
// { destination: '/articles/my-seo-guide', statusCode: 301 }

const noMatch = engine.match('/no-redirect-here');
// null
```

## Usage

### Redirect Engine

`createRedirectEngine` accepts a configuration object and returns an engine with a `.match(url)` method. Rules are evaluated in the order they appear in the `rules` array; the first matching rule wins.

```ts
import { createRedirectEngine } from '@power-seo/redirects';

const engine = createRedirectEngine({
  caseSensitive: false,        // optional — default: true
  trailingSlash: 'strip',      // optional — 'strip' | 'add' | 'ignore'
  rules: [
    // Exact match
    { source: '/home', destination: '/', statusCode: 301 },

    // Named parameter substitution
    { source: '/product/:id/details', destination: '/products/:id', statusCode: 301 },

    // Glob wildcard (preserves the * portion)
    { source: '/old-blog/*', destination: '/blog/*', statusCode: 301 },

    // Temporary redirect
    { source: '/sale', destination: '/promotions', statusCode: 302 },
  ],
});

const result = engine.match('/product/42/details');
// { destination: '/products/42', statusCode: 301 }
```

### Pattern Matchers

Use the lower-level matchers directly when you need custom matching logic outside the engine.

```ts
import { matchExact, matchGlob, matchRegex, substituteParams } from '@power-seo/redirects';

// Exact matching
matchExact('/about', '/about');          // true
matchExact('/About', '/about');          // false (case-sensitive by default)
matchExact('/About', '/about', false);   // true (case-insensitive)

// Glob matching — supports * wildcard and :param segments
matchGlob('/blog/*', '/blog/my-post');              // { matched: true, params: {} }
matchGlob('/user/:id/posts', '/user/42/posts');     // { matched: true, params: { id: '42' } }
matchGlob('/docs/*', '/blog/article');              // { matched: false }

// Regex matching — returns match object with named groups
const result = matchRegex('^/user/(\\d+)$', '/user/42');
// { matched: true, groups: ['42'] }

// Parameter substitution — replace :param in destination
substituteParams('/articles/:slug', { slug: 'react-seo-tips' });
// '/articles/react-seo-tips'

substituteParams('/category/:cat/post/:id', { cat: 'seo', id: '7' });
// '/category/seo/post/7'
```

### Next.js Adapter

Use `toNextRedirects` to convert your rules into the array format that Next.js expects in `next.config.js`. This keeps your redirect definitions in a single shared file.

```ts
// redirects.config.ts
import type { RedirectRule } from '@power-seo/redirects';

export const rules: RedirectRule[] = [
  { source: '/old-blog/:slug', destination: '/blog/:slug', statusCode: 301 },
  { source: '/resources',      destination: '/docs',       statusCode: 301 },
];
```

```js
// next.config.js
import { toNextRedirects } from '@power-seo/redirects';
import { rules } from './redirects.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return toNextRedirects(rules);
  },
};

export default nextConfig;
```

The adapter maps `statusCode: 301` to `permanent: true` and `statusCode: 302` to `permanent: false` automatically.

### Remix Adapter

`createRemixRedirectHandler` returns a Remix-compatible loader function. When a matching rule is found, it returns a `redirect()` response; otherwise it returns `null` so the route can render normally.

```ts
// app/routes/$.tsx (catch-all route)
import { createRemixRedirectHandler } from '@power-seo/redirects';
import { rules } from '~/redirects.config';

export const loader = createRemixRedirectHandler(rules);

export default function CatchAll() {
  return <div>Page Not Found</div>;
}
```

```ts
// Custom usage with additional loader logic
import { createRemixRedirectHandler } from '@power-seo/redirects';
import { type LoaderFunctionArgs, json } from '@remix-run/node';

const redirectLoader = createRemixRedirectHandler(rules);

export async function loader(args: LoaderFunctionArgs) {
  const redirectResponse = await redirectLoader(args);
  if (redirectResponse) return redirectResponse;

  // Continue with normal loader logic
  const data = await fetchPageData(args.params);
  return json(data);
}
```

### Express Adapter

`createExpressRedirectMiddleware` returns a standard Express `RequestHandler`. Mount it early in your middleware stack so redirects are processed before routing.

```ts
import express from 'express';
import { createExpressRedirectMiddleware } from '@power-seo/redirects';
import { rules } from './redirects.config.js';

const app = express();

// Mount redirect middleware before routes
app.use(createExpressRedirectMiddleware(rules));

// Regular routes
app.get('/', (req, res) => res.send('Home'));

app.listen(3000);
```

```ts
// Advanced: custom middleware with logging
import { createRedirectEngine } from '@power-seo/redirects';
import type { Request, Response, NextFunction } from 'express';

const engine = createRedirectEngine({ rules });

app.use((req: Request, res: Response, next: NextFunction) => {
  const match = engine.match(req.path);
  if (match) {
    console.log(`Redirecting ${req.path} → ${match.destination} [${match.statusCode}]`);
    return res.redirect(match.statusCode, match.destination);
  }
  next();
});
```

### Trailing Slash Normalization

Configure trailing slash behavior globally on the engine or override per-rule.

```ts
const engine = createRedirectEngine({
  trailingSlash: 'strip', // Remove trailing slashes before matching
  rules: [
    { source: '/about', destination: '/about-us', statusCode: 301 },
  ],
});

// Both '/about' and '/about/' will match the rule above
engine.match('/about/');  // { destination: '/about-us', statusCode: 301 }
engine.match('/about');   // { destination: '/about-us', statusCode: 301 }
```

## API Reference

### `createRedirectEngine(config)`

Creates a redirect rule engine instance.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `config.rules` | `RedirectRule[]` | required | Ordered array of redirect rules |
| `config.caseSensitive` | `boolean` | `true` | Whether URL matching is case-sensitive |
| `config.trailingSlash` | `'strip' \| 'add' \| 'ignore'` | `'ignore'` | How to normalize trailing slashes before matching |

Returns a `RedirectEngine` object with:

| Method | Signature | Description |
|--------|-----------|-------------|
| `match` | `(url: string) => RedirectMatch \| null` | Match a URL against all rules; returns first match or `null` |

---

### `matchExact(pattern, url, caseSensitive?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pattern` | `string` | required | The exact URL string to match against |
| `url` | `string` | required | The incoming URL to test |
| `caseSensitive` | `boolean` | `true` | Whether comparison is case-sensitive |

Returns `boolean`.

---

### `matchGlob(pattern, url, caseSensitive?)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pattern` | `string` | required | Glob pattern with `*` wildcards and `:param` segments |
| `url` | `string` | required | The incoming URL to test |
| `caseSensitive` | `boolean` | `true` | Whether comparison is case-sensitive |

Returns `{ matched: boolean; params: Record<string, string> }`.

---

### `matchRegex(pattern, url)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pattern` | `string` | required | Regular expression string (without delimiters) |
| `url` | `string` | required | The incoming URL to test |

Returns `{ matched: boolean; groups: string[] }`.

---

### `substituteParams(template, params)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `template` | `string` | required | Destination URL template with `:param` placeholders |
| `params` | `Record<string, string>` | required | Key-value map of parameter names to values |

Returns `string`.

---

### `toNextRedirects(rules)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `rules` | `RedirectRule[]` | required | Array of redirect rules to convert |

Returns `NextRedirect[]` — the array format accepted by Next.js `redirects()` in `next.config.js`.

---

### `createRemixRedirectHandler(rules)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `rules` | `RedirectRule[]` | required | Array of redirect rules |

Returns a Remix `LoaderFunction` that issues a `redirect()` response when a rule matches, or returns `null` otherwise.

---

### `createExpressRedirectMiddleware(rules)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `rules` | `RedirectRule[]` | required | Array of redirect rules |

Returns an Express `RequestHandler` middleware function.

---

### Types

```ts
import type {
  RedirectStatusCode,       // 301 | 302
  RedirectRule,             // { source, destination, statusCode, caseSensitive? }
  RedirectMatch,            // { destination: string; statusCode: RedirectStatusCode }
  RedirectEngineConfig,     // { rules, caseSensitive?, trailingSlash? }
  RedirectEngine,           // { match(url): RedirectMatch | null }
  NextRedirect,             // { source, destination, permanent }
} from '@power-seo/redirects';
```

## The @power-seo Ecosystem

`@power-seo/redirects` is part of the **@power-seo** monorepo — a complete, modular SEO toolkit for modern JavaScript applications.

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
