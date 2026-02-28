# @power-seo/redirects

![redirects banner](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/banner.svg)

Define redirect rules once — apply them in Next.js, Remix, and Express with typed exact, glob, and regex URL matching.

[![npm version](https://img.shields.io/npm/v/@power-seo/redirects)](https://www.npmjs.com/package/@power-seo/redirects)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/redirects)](https://www.npmjs.com/package/@power-seo/redirects)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/redirects)](https://socket.dev/npm/package/@power-seo/redirects)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/redirects)

`@power-seo/redirects` is a framework-agnostic URL redirect rule engine for TypeScript — define `RedirectRule[]` once in a shared config file and generate Next.js `next.config.js` redirect arrays, Remix loader functions, and Express middleware from the same typed source of truth. Evaluate rules with exact string matching, glob wildcards with `:param` segments, or full regular expressions. First-match-wins priority ordering, configurable trailing-slash handling, and named parameter substitution are included. All adapters are tree-shakeable — import only the framework you target.

> **Zero runtime dependencies** — pure TypeScript, no native bindings, edge-compatible.

---

## Why @power-seo/redirects?

| | Without | With |
|---|---|---|
| Cross-framework rules | ❌ Duplicated in next.config.js, Remix loaders, Express middleware | ✅ One `RedirectRule[]` — all three from a single file |
| Pattern matching | ❌ Ad-hoc regex scattered across route files | ✅ Exact, glob, and regex with typed API |
| Named params | ❌ Manual capture group indexing | ✅ `:param` substitution in destination URLs |
| Trailing slash | ❌ Inconsistent per route | ✅ Configurable `'strip'` / `'add'` / `'ignore'` |
| TypeScript | ❌ `statusCode` typos detected at runtime | ✅ `RedirectStatusCode` union enforces `301 \| 302` at compile time |
| Testing | ❌ Deploy to verify redirects work | ✅ `engine.match()` in unit tests — zero-cost synchronous check |
| SEO | ❌ Missing 301s break link equity during migrations | ✅ Typed rules prevent status code mistakes |

![Redirects Comparison](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/comparison.svg)


<p align="left">
  <a href="https://www.buymeacoffee.com/ccbd.dev" target="_blank">
    <img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=ccbd.dev&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" />
  </a>
</p>

---

## Features

- **Exact matching** — byte-for-byte URL comparison with optional case sensitivity control
- **Glob pattern matching** — `*` wildcard and `:param` named segment support (e.g. `/blog/:slug`)
- **Regex pattern matching** — full regular expression matching with capture group extraction
- **301 and 302 status codes** — permanent and temporary redirect support via `RedirectStatusCode` union type
- **`:param` substitution** — `substituteParams()` for named parameter placeholders in destination URLs
- **Trailing slash normalization** — configurable `'strip'`, `'add'`, or `'ignore'` per engine
- **Case-sensitive option** — per-engine case sensitivity control
- **Next.js adapter** — `toNextRedirects(rules)` maps `statusCode: 301` → `permanent: true` automatically
- **Remix loader adapter** — `createRemixRedirectHandler(rules)` returns a Remix-compatible loader function
- **Express middleware adapter** — `createExpressRedirectMiddleware(rules)` returns an Express `RequestHandler`
- **Priority-ordered evaluation** — rules are evaluated top-to-bottom; first match wins
- **Zero runtime dependencies** — no external libraries; edge-compatible
- **Full TypeScript types** — typed `RedirectRule`, `RedirectMatch`, `RedirectEngine`, `RedirectEngineConfig`
- **Tree-shakeable** — import only the adapters you use; `"sideEffects": false`

![Redirects Network UI](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/network-ui.svg)

---

## Comparison

| Feature | @power-seo/redirects | next/redirects (config) | vercel.json | nginx rewrite |
| --- | :---: | :---: | :---: | :---: |
| Works in Next.js | ✅ | ✅ | ✅ | ❌ |
| Works in Remix | ✅ | ❌ | ❌ | ❌ |
| Works in Express | ✅ | ❌ | ❌ | ✅ |
| Typed TypeScript API | ✅ | ❌ | ❌ | ❌ |
| Named `:param` substitution | ✅ | ✅ | ✅ | ✅ |
| Regex pattern support | ✅ | ✅ | ✅ | ✅ |
| Glob wildcard support | ✅ | ✅ | ✅ | ✅ |
| Programmatic rule testing | ✅ | ❌ | ❌ | ❌ |
| One rule set → multiple frameworks | ✅ | ❌ | ❌ | ❌ |
| Zero runtime dependencies | ✅ | ✅ | ✅ | ✅ |
| Tree-shakeable | ✅ | ❌ | ❌ | ❌ |

![Matching Accuracy](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/matching-accuracy.svg)

---

## Installation

```bash
npm install @power-seo/redirects
```

```bash
yarn add @power-seo/redirects
```

```bash
pnpm add @power-seo/redirects
```

---

## Quick Start

```ts
import { createRedirectEngine } from '@power-seo/redirects';

const engine = createRedirectEngine({
  rules: [
    { source: '/old-about', destination: '/about', statusCode: 301 },
    { source: '/blog/:slug', destination: '/articles/:slug', statusCode: 301 },
    { source: '/docs/*', destination: '/documentation/*', statusCode: 302 },
  ],
});

const match = engine.match('/blog/my-seo-guide');
// { rule: {...}, resolvedDestination: '/articles/my-seo-guide', statusCode: 301 }

const noMatch = engine.match('/no-redirect-here');
// null
```

![Unification Benefit](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/unification-benefit.svg)

---

## Usage

### Shared Rule File

Define rules once and import them into every framework adapter:

```ts
// redirects.config.ts
import type { RedirectRule } from '@power-seo/redirects';

export const rules: RedirectRule[] = [
  { source: '/old-about', destination: '/about', statusCode: 301 },
  { source: '/blog/:slug', destination: '/articles/:slug', statusCode: 301 },
  { source: '/docs/*', destination: '/documentation/*', statusCode: 302 },
  { source: '/products/:id(\\d+)', destination: '/items/:id', statusCode: 301 },
];
```

### Next.js — `next.config.js`

`toNextRedirects()` converts `RedirectRule[]` to the format Next.js expects. `statusCode: 301` maps to `permanent: true`.

```ts
// next.config.js
const { toNextRedirects } = require('@power-seo/redirects');
const { rules } = require('./redirects.config');

module.exports = {
  async redirects() {
    return toNextRedirects(rules);
  },
};
```

### Remix — Catch-All Route

`createRemixRedirectHandler()` returns a Remix loader function for use in a `$.tsx` catch-all route.

```ts
// app/routes/$.tsx
import { createRemixRedirectHandler } from '@power-seo/redirects';
import { rules } from '~/redirects.config';

export const loader = createRemixRedirectHandler(rules);
```

### Express — Middleware

`createExpressRedirectMiddleware()` returns an Express `RequestHandler`. Register it early in the middleware chain.

```ts
import express from 'express';
import { createExpressRedirectMiddleware } from '@power-seo/redirects';
import { rules } from './redirects.config';

const app = express();
app.use(createExpressRedirectMiddleware(rules));
```

### Trailing Slash and Case Sensitivity

```ts
const engine = createRedirectEngine(rules, {
  caseSensitive: false,   // match /About and /about equally
  trailingSlash: 'remove', // /about/ → /about before matching
});
```

### Parameter Substitution

```ts
import { substituteParams } from '@power-seo/redirects';

substituteParams('/articles/:slug', { slug: 'react-seo-tips' });
// '/articles/react-seo-tips'
```

### Testing Rules in CI

```ts
import { createRedirectEngine } from '@power-seo/redirects';
import { rules } from './redirects.config';

const engine = createRedirectEngine({ rules });

const match1 = engine.match('/old-about');
expect(match1?.resolvedDestination).toBe('/about');
expect(match1?.statusCode).toBe(301);

const match2 = engine.match('/blog/my-post');
expect(match2?.resolvedDestination).toBe('/articles/my-post');
expect(match2?.statusCode).toBe(301);

expect(engine.match('/no-match')).toBeNull();
```

---

## API Reference

### `createRedirectEngine(initialRules, config)`

```ts
function createRedirectEngine(initialRules?: RedirectRule[], config?: RedirectEngineConfig): RedirectEngine;
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `initialRules` | `RedirectRule[]` | `[]` | Initial ordered array of redirect rules |
| `config.caseSensitive` | `boolean` | `false` | Case-sensitive URL matching |
| `config.trailingSlash` | `'keep' \| 'remove' \| 'add'` | `'remove'` | Trailing slash normalization |

Returns `RedirectEngine`: `{ match(url: string): RedirectMatch | null; addRule(rule: RedirectRule): void; removeRule(source: string): boolean; getRules(): RedirectRule[] }`.

### `matchExact(pattern, url, caseSensitive?)`

Returns `boolean`. Byte-for-byte URL comparison.

### `matchGlob(pattern, url, caseSensitive?)`

Returns `{ matched: boolean; params: Record<string, string> }`. Supports `:param` named segments and `*` wildcard.

### `matchRegex(url, pattern, destination, config)`

Returns `{ matched: boolean; destination: string }`. Full regular expression matching with capture group substitution into the destination.

### `substituteParams(template, params)`

```ts
substituteParams('/articles/:slug', { slug: 'react-seo-tips' });
// '/articles/react-seo-tips'
```

### `toNextRedirects(rules)`

Converts `RedirectRule[]` to Next.js `redirects()` array format. Maps `statusCode: 301` → `permanent: true`, `statusCode: 302` → `permanent: false`.

### `createRemixRedirectHandler(rules)`

Returns a Remix `LoaderFunction` that issues `redirect()` when a rule matches, or returns `null` otherwise.

### `createExpressRedirectMiddleware(rules)`

Returns an Express `RequestHandler` that calls `res.redirect()` on match or `next()` when no rule matches.

### Types

| Type | Description |
| --- | --- |
| `RedirectStatusCode` | `301 \| 302` |
| `RedirectRule` | `{ source: string; destination: string; statusCode: RedirectStatusCode; caseSensitive?: boolean }` |
| `RedirectMatch` | `{ rule: RedirectRule; resolvedDestination: string; statusCode: RedirectStatusCode }` |
| `RedirectEngineConfig` | `{ rules: RedirectRule[]; caseSensitive?: boolean; trailingSlash?: 'strip' \| 'add' \| 'ignore' }` |
| `RedirectEngine` | `{ match(url: string): RedirectMatch \| null }` |
| `NextRedirect` | `{ source: string; destination: string; permanent: boolean }` |

---

## Use Cases

- **Site migrations** — redirect hundreds of old URLs to new paths with a typed rule array
- **URL restructuring for SEO** — enforce new URL patterns with 301 redirects to preserve link equity
- **Trailing slash normalization** — enforce consistent URL format across all routes
- **Locale redirects** — redirect `/en/about` to `/about` with glob patterns
- **Legacy URL handling** — redirect old numeric IDs to slug-based URLs with regex patterns
- **Canonical URL enforcement** — redirect `http:` to `https:`, `www.` to non-www
- **Multi-framework monorepos** — define rules once, generate Next.js, Remix, and Express configs from the same file

---

## Architecture Overview

- **Pure TypeScript** — no compiled binary, no native modules
- **Zero runtime dependencies** — no external libraries; safe on any runtime
- **Framework-agnostic core** — `createRedirectEngine()` has no framework imports; adapters are separate named exports
- **First-match-wins** — rules are evaluated top-to-bottom; order matters for overlapping patterns
- **SSR compatible** — `toNextRedirects()` runs at build time; Remix and Express adapters run at request time
- **Edge runtime safe** — no Node.js-specific APIs; runs in Cloudflare Workers, Vercel Edge, Deno
- **Tree-shakeable** — `"sideEffects": false`; import only the adapters you use
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
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema)                     | `npm i @power-seo/schema`           | Type-safe JSON-LD structured data — 23 builders + 22 React components   |
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
