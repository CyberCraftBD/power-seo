# @power-seo/redirects

![Redirect rule engine with Next.js, Remix, and Express adapters banner](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/banner.svg)

Define redirect rules once — apply them in Next.js, Remix, and Express with typed exact, glob, and regex URL matching.

[![npm version](https://img.shields.io/npm/v/@power-seo/redirects)](https://www.npmjs.com/package/@power-seo/redirects)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/redirects)](https://www.npmjs.com/package/@power-seo/redirects)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/redirects)](https://socket.dev/npm/package/@power-seo/redirects)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/redirects)

`@power-seo/redirects` is a framework-agnostic URL redirect rule engine for TypeScript. Define a `RedirectRule[]` array once in a shared config file and drive Next.js `next.config.js` redirect arrays, Remix loaders, and Express middleware from the same typed source of truth. It is for teams running site migrations, URL restructures, and multi-framework monorepos who need consistent, testable 301/302/307/308/410 redirects without duplicating rules per framework.

![Redirect engine unifying Next.js, Remix, and Express rules from one typed config file](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/header.svg)

---

## Why @power-seo/redirects?

Redirects normally live in three incompatible places — `next.config.js`, Remix loaders, and Express middleware — and drift apart over time. This package makes one typed rule array the single source of truth, adds an open-redirect guard, and lets you assert redirect behaviour in unit tests instead of discovering broken 301s in production.

|                       | Without                                                         | With                                                                  |
| --------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------- |
| Cross-framework rules | Duplicated in next.config.js, Remix loaders, Express middleware | One `RedirectRule[]` — all three adapters read the same file          |
| Pattern matching      | Ad-hoc regex scattered across route files                       | Exact, glob (`*`, `:param`), and regex through one typed API          |
| Named params          | Manual capture-group indexing                                   | `:param` substitution into destination URLs                           |
| Trailing slash        | Inconsistent per route                                          | Configurable `'keep' \| 'remove' \| 'add'` (default `'remove'`)       |
| Status codes          | `statusCode` typos surface at runtime                           | `RedirectStatusCode` union enforces `301 \| 302 \| 307 \| 308 \| 410` |
| Open-redirect safety  | Capture groups can inject `//evil.com` or `javascript:` targets | `isDestinationSafe` guard blocks off-origin/dangerous destinations    |
| Testing               | Deploy to verify redirects work                                 | `engine.match()` in unit tests — synchronous, zero network            |
| SEO                   | Missing 301s break link equity during migrations                | Typed rules prevent status-code mistakes and preserve equity          |

![Workflow comparison: manually duplicated redirect configs versus one typed rule file with compile-time checks and unit-testable matching in @power-seo/redirects](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/roi.svg)

---

## Features

- **Exact matching** — `matchExact()` compares normalized paths after trailing-slash and case handling
- **Glob pattern matching** — `matchGlob()` supports the `*` wildcard and `:param` named segments (e.g. `/blog/:slug`)
- **Regex pattern matching** — `matchRegex()` runs full regular expressions with `$1`, `$2` capture-group substitution into the destination
- **Named parameter substitution** — `substituteParams()` fills `:param` and `*` placeholders in destination URLs
- **Open-redirect guard** — `isDestinationSafe()` blocks `javascript:`, `data:`, `vbscript:`, `file:`, and off-origin/protocol-relative destinations injected via capture groups (opt in with `allowExternalRedirects`)
- **Redirect chain resolution** — the engine follows A→B→C and returns the final destination, throwing on loops and chains longer than 10 hops
- **Status codes** — `301 | 302 | 307 | 308 | 410` via the `RedirectStatusCode` union
- **Trailing-slash normalization** — configurable `'keep'`, `'remove'`, or `'add'` per engine (default `'remove'`)
- **Case sensitivity** — per-engine `caseSensitive` flag (default `false`)
- **Next.js adapter** — `toNextRedirects()` maps `301/308` → `permanent: true` and drops `410` rules Next.js can't express
- **Remix adapter** — `createRemixRedirectHandler()` returns a `Request → Response | null` handler; emits a `410 Gone` response when the rule status is `410`
- **Express adapter** — `createExpressRedirectMiddleware()` returns middleware that calls `res.redirect()` or `next()`
- **Priority-ordered evaluation** — rules are checked top-to-bottom; first match wins
- **Zero third-party runtime dependencies** — depends only on `@power-seo/core`; edge-compatible
- **Tree-shakeable** — `"sideEffects": false`; import only the adapters you use

![Redirect rule network showing exact, glob, and regex matching paths](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/network-ui.svg)

---

## Comparison

![Feature comparison matrix showing @power-seo/redirects versus next.config.js redirects, vercel.json, and nginx rewrite rules](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/comparison.svg)

| Feature                            | @power-seo/redirects | next.config redirects | vercel.json | nginx rewrite |
| ---------------------------------- | :------------------: | :-------------------: | :---------: | :-----------: |
| Works in Next.js                   |          ✅          |          ✅           |     ✅      |      ❌       |
| Works in Remix                     |          ✅          |          ❌           |     ❌      |      ❌       |
| Works in Express                   |          ✅          |          ❌           |     ❌      |      ✅       |
| One rule set → multiple frameworks |          ✅          |          ❌           |     ❌      |      ❌       |
| Typed TypeScript API               |          ✅          |          ❌           |     ❌      |      ❌       |
| Named `:param` substitution        |          ✅          |          ✅           |     ✅      |      ✅       |
| Regex pattern support              |          ✅          |          ✅           |     ✅      |      ✅       |
| Glob wildcard support              |          ✅          |          ✅           |     ✅      |      ✅       |
| Open-redirect guard                |          ✅          |          ❌           |     ❌      |      ❌       |
| Programmatic rule testing          |          ✅          |          ❌           |     ❌      |      ❌       |
| Zero third-party deps              |          ✅          |          ✅           |     ✅      |      ✅       |

![Redirect pattern matching accuracy across exact, glob, and regex rules](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/matching-accuracy.svg)

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

## Usage

### How do I match a URL against redirect rules?

Call `createRedirectEngine(rules, config?)` with an ordered array of rules, then call `engine.match(url)`. Rules are evaluated top-to-bottom and the first match wins. `match()` returns a `RedirectMatch` — `{ rule, resolvedDestination, statusCode }` — with `:param` and capture groups already substituted, or `null` when nothing matches. Set `isRegex: true` on a rule to opt into regular-expression source matching.

```ts
import { createRedirectEngine } from '@power-seo/redirects';

const engine = createRedirectEngine(
  [
    { source: '/old-about', destination: '/about', statusCode: 301 },
    { source: '/blog/:slug', destination: '/articles/:slug', statusCode: 301 },
    { source: '/docs/*', destination: '/documentation/*', statusCode: 302 },
  ],
  { trailingSlash: 'remove', caseSensitive: false },
);

engine.match('/blog/my-seo-guide');
// { rule: {...}, resolvedDestination: '/articles/my-seo-guide', statusCode: 301 }

engine.match('/no-redirect-here');
// null
```

![One typed redirect config unified across Next.js, Remix, and Express](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/redirects/unification-benefit.svg)

### How do I share one rule file across frameworks?

Export a single typed `RedirectRule[]` and import it into every adapter. This keeps the source of truth in one file so a migration edit propagates to Next.js, Remix, and Express at once. The `RedirectRule` type comes from `@power-seo/core` and is re-exported here for convenience.

```ts
// redirects.config.ts
import type { RedirectRule } from '@power-seo/redirects';

export const rules: RedirectRule[] = [
  { source: '/old-about', destination: '/about', statusCode: 301 },
  { source: '/blog/:slug', destination: '/articles/:slug', statusCode: 301 },
  { source: '/docs/*', destination: '/documentation/*', statusCode: 302 },
  { source: '^/products/(\\d+)$', destination: '/items/$1', statusCode: 301, isRegex: true },
];
```

### How do I add redirects to next.config.js?

`toNextRedirects(rules)` converts your `RedirectRule[]` into the shape Next.js expects. Status `301` and `308` map to `permanent: true`; `302` and `307` map to `permanent: false`. Rules with status `410` are dropped, since Next.js `redirects()` cannot express a Gone response.

```js
// next.config.js
const { toNextRedirects } = require('@power-seo/redirects');
const { rules } = require('./redirects.config');

module.exports = {
  async redirects() {
    return toNextRedirects(rules);
  },
};
```

### How do I add redirects to a Remix route?

`createRemixRedirectHandler(rules, config?)` returns a function that takes a `Request` and returns a redirect `Response`, a `410 Gone` response, or `null` when no rule matches. Use it inside a `$.tsx` catch-all loader and fall through to your normal handling when it returns `null`.

```ts
// app/routes/$.tsx
import { createRemixRedirectHandler } from '@power-seo/redirects';
import { rules } from '~/redirects.config';

const handleRedirect = createRemixRedirectHandler(rules);

export function loader({ request }: { request: Request }) {
  const response = handleRedirect(request);
  if (response) return response;
  throw new Response('Not Found', { status: 404 });
}
```

### How do I add redirects to Express?

`createExpressRedirectMiddleware(rules, config?)` returns middleware that matches `req.url`, then calls `res.redirect(statusCode, destination)` on a hit or `next()` on a miss. A `410` rule sends `res.status(410).end()`. Register it early in the middleware chain.

```ts
import express from 'express';
import { createExpressRedirectMiddleware } from '@power-seo/redirects';
import { rules } from './redirects.config';

const app = express();
app.use(createExpressRedirectMiddleware(rules));
```

### How do I normalize trailing slashes and case?

Pass a `RedirectEngineConfig` as the second argument. `trailingSlash` accepts `'keep'`, `'remove'` (default), or `'add'` and normalizes both the incoming URL and the rule source before matching. `caseSensitive` defaults to `false`, so `/About` and `/about` match the same rule.

```ts
const engine = createRedirectEngine(rules, {
  caseSensitive: false, // /About and /about match equally
  trailingSlash: 'remove', // /about/ → /about before matching
});
```

### How does the open-redirect guard work?

Destinations are validated before a match is returned. A resolved destination using a dangerous scheme (`javascript:`, `data:`, `vbscript:`, `file:`) is always rejected. A destination that becomes off-origin or protocol-relative (`//host`) through capture-group substitution is rejected too — unless the rule's own template was already external, or you opt in with `allowExternalRedirects: true`.

```ts
const engine = createRedirectEngine(
  [{ source: '^/go/(.*)$', destination: '$1', statusCode: 302, isRegex: true }],
  { allowExternalRedirects: false }, // default — blocks /go/https://evil.com
);

engine.match('/go/https://evil.com');
// null — capture group turned the destination external; guarded off
```

### How do I test redirect rules in CI?

Because `engine.match()` is synchronous and network-free, you can assert the resolved destination and status code directly in a unit test — no deploy required.

```ts
import { createRedirectEngine } from '@power-seo/redirects';
import { rules } from './redirects.config';

const engine = createRedirectEngine(rules);

const hit = engine.match('/blog/my-post');
expect(hit?.resolvedDestination).toBe('/articles/my-post');
expect(hit?.statusCode).toBe(301);

expect(engine.match('/no-match')).toBeNull();
```

---

## API Reference

### `createRedirectEngine(initialRules?, config?)`

```ts
function createRedirectEngine(
  initialRules?: RedirectRule[],
  config?: RedirectEngineConfig,
): RedirectEngine;
```

| Parameter                       | Type                          | Default    | Description                                          |
| ------------------------------- | ----------------------------- | ---------- | ---------------------------------------------------- |
| `initialRules`                  | `RedirectRule[]`              | `[]`       | Ordered array of redirect rules (first match wins)   |
| `config.trailingSlash`          | `'keep' \| 'remove' \| 'add'` | `'remove'` | Trailing-slash normalization applied before matching |
| `config.caseSensitive`          | `boolean`                     | `false`    | Case-sensitive URL matching                          |
| `config.allowExternalRedirects` | `boolean`                     | `false`    | Allow capture groups to resolve to off-origin URLs   |

Returns a `RedirectEngine`: `{ match, addRule, removeRule, getRules }`. `match()` resolves redirect chains (A→B→C returns C), throws on loops, and throws when a chain exceeds 10 hops.

### `matchExact(url, source, config?)`

```ts
function matchExact(url: string, source: string, config?: RedirectEngineConfig): boolean;
```

Returns `true` when `url` and `source` are equal after path normalization (trailing slash + case).

### `matchGlob(url, pattern, config?)`

```ts
function matchGlob(
  url: string,
  pattern: string,
  config?: RedirectEngineConfig,
): { matched: boolean; params: Record<string, string> };
```

Matches `*` (captured under the `'*'` key) and `:param` named segments, returning the captured `params`.

### `matchRegex(url, pattern, destination, config?)`

```ts
function matchRegex(
  url: string,
  pattern: string,
  destination: string,
  config?: RedirectEngineConfig,
): { matched: boolean; destination: string };
```

Anchors `pattern` as `^pattern$`, applies the `i` flag unless `caseSensitive` is set, and substitutes `$1`, `$2`, … capture groups into `destination`. Returns `{ matched: false }` for invalid patterns.

### `substituteParams(destination, params)`

```ts
function substituteParams(destination: string, params: Record<string, string>): string;

substituteParams('/articles/:slug', { slug: 'react-seo-tips' });
// '/articles/react-seo-tips'
```

### `isDestinationSafe(rawDestination, resolvedDestination, config?)`

```ts
function isDestinationSafe(
  rawDestination: string,
  resolvedDestination: string,
  config?: RedirectEngineConfig,
): boolean;
```

Returns `false` for dangerous schemes, and for off-origin destinations produced by substitution unless the raw template was itself external or `allowExternalRedirects` is `true`.

### `toNextRedirects(rules)`

Converts `RedirectRule[]` to `NextRedirect[]`. Maps `301/308` → `permanent: true`, `302/307` → `permanent: false`, and filters out `410` rules.

### `createRemixRedirectHandler(rules, config?)`

Returns `(request: Request) => Response | null` — a redirect `Response` on match, a `410 Gone` response for `410` rules, or `null` when nothing matches.

### `createExpressRedirectMiddleware(rules, config?)`

Returns Express middleware `(req, res, next) => void` that calls `res.redirect(statusCode, destination)` on match, `res.status(410).end()` for `410` rules, or `next()` when nothing matches.

---

## Types

| Type                   | Shape                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `RedirectStatusCode`   | `301 \| 302 \| 307 \| 308 \| 410` (from `@power-seo/core`)                                                                |
| `RedirectRule`         | `{ source: string; destination: string; statusCode: RedirectStatusCode; isRegex?: boolean }`                              |
| `RedirectMatch`        | `{ rule: RedirectRule; resolvedDestination: string; statusCode: RedirectStatusCode }`                                     |
| `RedirectEngineConfig` | `{ trailingSlash?: 'keep' \| 'remove' \| 'add'; caseSensitive?: boolean; allowExternalRedirects?: boolean }`              |
| `RedirectEngine`       | `{ match(url): RedirectMatch \| null; addRule(rule): void; removeRule(source): boolean; getRules(): RedirectRule[] }`     |
| `NextRedirect`         | `{ source: string; destination: string; permanent: boolean; has?: Array<{ type: string; key: string; value?: string }> }` |

---

## Use Cases

- **Site migrations** — redirect hundreds of old URLs to new paths from one typed rule array
- **URL restructuring for SEO** — 301 old patterns to new ones to preserve link equity
- **Trailing-slash normalization** — enforce one canonical URL format across every route
- **Locale redirects** — collapse `/en/about` to `/about` with glob patterns
- **Legacy ID handling** — map numeric IDs to slug URLs with regex capture groups
- **Retiring pages** — return `410 Gone` for permanently removed content in Remix and Express
- **Multi-framework monorepos** — generate Next.js, Remix, and Express configs from the same file

---

## Architecture Overview

- **Pure TypeScript** — no compiled binary, no native modules
- **Depends only on `@power-seo/core`** — no third-party runtime libraries
- **Framework-agnostic core** — `createRedirectEngine()` imports no framework; adapters are separate named exports
- **First-match-wins** — rules evaluate top-to-bottom, so ordering controls overlapping patterns
- **Chain-safe** — resolves multi-hop chains, throws on loops and on chains over 10 hops
- **Open-redirect hardened** — destinations pass `isDestinationSafe()` before a match is returned
- **Edge-runtime safe** — no Node.js-specific APIs; runs on Cloudflare Workers, Vercel Edge, and Deno
- **Tree-shakeable** — `"sideEffects": false`; import only the adapters you use
- **Dual ESM + CJS** — ships both formats via tsup for any bundler or `require()`

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

seo, redirects, 301 redirect, url matching, redirect rule engine, glob matching, regex redirect, named params, site migration, trailing slash, link equity, next.js, remix, express, open-redirect guard, canonical redirect, framework-agnostic, programmatic redirects, typescript, url redirect

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
