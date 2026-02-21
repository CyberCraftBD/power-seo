# @power-seo/redirects — URL Redirect Rule Engine for Next.js, Remix & Express — Exact, Glob & Regex Matching

[![npm version](https://img.shields.io/npm/v/@power-seo/redirects?style=flat-square)](https://www.npmjs.com/package/@power-seo/redirects)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/redirects?style=flat-square)](https://www.npmjs.com/package/@power-seo/redirects)
[![MIT License](https://img.shields.io/npm/l/@power-seo/redirects?style=flat-square)](../../LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen?style=flat-square)](#)

---

## Overview

**@power-seo/redirects** is a framework-agnostic URL redirect rule engine for TypeScript that helps you define redirect rules once and apply them across Next.js, Remix, and Express — with exact, glob, and regex pattern matching.

**What it does**
- ✅ **Unified redirect engine** — `createRedirectEngine()` accepts typed rules and matches URLs with `.match()`
- ✅ **Three pattern types** — exact string, glob wildcards with `:param` segments, and full regular expressions
- ✅ **Next.js adapter** — `toNextRedirects()` converts rules to the `next.config.js` redirect array format
- ✅ **Remix adapter** — `createRemixRedirectHandler()` returns a loader function for Remix catch-all routes
- ✅ **Express adapter** — `createExpressRedirectMiddleware()` returns an Express `RequestHandler`
- ✅ **Parameter substitution** — `substituteParams()` replaces `:param` placeholders in destination URLs

**What it is not**
- ❌ **Not a reverse proxy** — does not proxy requests to other servers; only issues redirect responses
- ❌ **Not a URL rewriter** — does not silently rewrite URLs; all matches produce 301 or 302 redirects

**Recommended for**
- **Site migrations**, **URL restructuring for SEO**, **Next.js route consolidation**, **legacy URL handling**, and **canonical URL enforcement**

---

## Why @power-seo/redirects Matters

**The problem**
- **Redirect rules are duplicated** — the same rules must be reimplemented for Next.js `next.config.js`, Remix loaders, and Express middleware separately
- **Pattern matching is ad-hoc** — teams write one-off regex or string comparisons scattered across route files
- **SEO is at risk** — missing 301 redirects during site migrations cause traffic drops and broken backlinks

**Why developers care**
- **SEO:** 301 redirects preserve link equity from old URLs to new ones during migrations
- **Performance:** Centralized rule engine evaluates all rules in one pass — no per-route middleware overhead
- **UX:** Correct redirects prevent users and Googlebot from hitting 404s after URL changes

---

## Key Features

- **Exact matching** — byte-for-byte URL comparison with optional case sensitivity control
- **Glob pattern matching** — `*` wildcard and `:param` named segment support (e.g., `/blog/:slug`)
- **Regex pattern matching** — full regular expression matching with capture group extraction
- **301 and 302 status codes** — permanent and temporary redirect support via `RedirectStatusCode` union type
- **`:param` substitution** — `substituteParams()` for named parameter placeholders in destination URLs
- **Trailing slash normalization** — configurable trailing-slash handling: `'strip'`, `'add'`, or `'ignore'`
- **Case-sensitive option** — per-engine case sensitivity control
- **Next.js adapter** — `toNextRedirects(rules)` maps `statusCode: 301` to `permanent: true` automatically
- **Remix loader adapter** — `createRemixRedirectHandler(rules)` returns a Remix-compatible loader function
- **Express middleware adapter** — `createExpressRedirectMiddleware(rules)` returns an Express `RequestHandler`
- **Priority-ordered evaluation** — rules are evaluated top-to-bottom; first match wins
- **Zero dependencies** — no runtime dependencies; lightweight and edge-compatible
- **Full TypeScript types** — typed `RedirectRule`, `RedirectMatch`, `RedirectEngine`, `RedirectEngineConfig`

---

## Benefits of Using @power-seo/redirects

- **Preserved link equity**: 301 redirects maintain PageRank from old URLs during migrations — critical for SEO
- **Simpler maintenance**: Define rules once in a shared file; adapters generate framework-specific formats automatically
- **Safer migrations**: First-match-wins priority ordering prevents accidental double redirects
- **Faster delivery**: Zero-dependency engine works in any runtime without configuration

---

## Quick Start

```ts
import { createRedirectEngine } from '@power-seo/redirects';

const engine = createRedirectEngine({
  rules: [
    { source: '/old-about',      destination: '/about',          statusCode: 301 },
    { source: '/blog/:slug',     destination: '/articles/:slug', statusCode: 301 },
    { source: '/docs/*',         destination: '/documentation/*', statusCode: 302 },
  ],
});

const match = engine.match('/blog/my-seo-guide');
// { destination: '/articles/my-seo-guide', statusCode: 301 }

const noMatch = engine.match('/no-redirect-here');
// null
```

**What you should see**
- `match` returns `{ destination, statusCode }` for matching URLs
- `null` for URLs with no matching rule

---

## Installation

```bash
npm i @power-seo/redirects
# or
yarn add @power-seo/redirects
# or
pnpm add @power-seo/redirects
# or
bun add @power-seo/redirects
```

---

## Framework Compatibility

**Supported**
- ✅ Next.js (App Router / Pages Router) — `toNextRedirects()` for `next.config.js`
- ✅ Remix — `createRemixRedirectHandler()` for catch-all routes
- ✅ Express — `createExpressRedirectMiddleware()` as request handler
- ✅ Node.js 18+ — pure TypeScript, no native bindings
- ✅ Edge runtimes — no Node.js-specific APIs

**Environment notes**
- **SSR/SSG:** Fully supported — rule matching is synchronous and pure
- **Edge runtime:** Supported — no filesystem access, no native bindings
- **Browser-only usage:** The engine itself works in browser JS; redirect execution is server-side

---

## Use Cases

- **Site migrations** — redirect 100s of old URLs to new paths with typed rule arrays
- **URL restructuring for SEO** — enforce new URL patterns with 301 redirects to preserve link equity
- **Trailing slash normalization** — enforce consistent URL format across all routes
- **Locale redirects** — redirect `/en/about` to `/about` or vice versa with glob patterns
- **Legacy URL handling** — redirect old numeric IDs to slug-based URLs with regex patterns
- **Canonical URL enforcement** — redirect `http:` to `https:`, `www.` to non-www
- **Multi-framework monorepos** — define rules once, generate Next.js, Remix, and Express configs

---

## Example (Before / After)

```text
Before:
- Redirect rules duplicated in next.config.js, Remix route loaders, and Express middleware
- Ad-hoc regex matching with inconsistent handling of trailing slashes and case
- No TypeScript types → wrong statusCode values go undetected until runtime

After (@power-seo/redirects):
- rules: RedirectRule[] defined once in redirects.config.ts
- toNextRedirects(rules) → Next.js redirect array
- createRemixRedirectHandler(rules) → Remix loader
- createExpressRedirectMiddleware(rules) → Express middleware
- All three from the same typed source of truth
```

---

## Implementation Best Practices

- **Use 301 for permanent redirects** — preserves link equity; Google follows and updates its index
- **Use 302 for temporary redirects** — e.g., maintenance pages or A/B test variants
- **Order rules from most-specific to least-specific** — first-match-wins prevents broad patterns from swallowing specific ones
- **Test rules in development** with `engine.match()` before deploying — zero-cost synchronous check
- **Keep redirect rules in a shared file** — import it into `next.config.js`, Remix routes, and Express server from one location

---

## Architecture Overview

**Where it runs**
- **Build-time**: `toNextRedirects()` generates the static Next.js redirect array at build time
- **Runtime**: Remix loader and Express middleware evaluate rules on every request
- **CI/CD**: Test `engine.match()` against expected URL patterns in unit tests

**Data flow**
1. **Input**: `RedirectRule[]` array with source patterns, destinations, and status codes
2. **Analysis**: Engine evaluates rules top-to-bottom; first match returns `{ destination, statusCode }`
3. **Output**: `RedirectMatch | null` — used by adapters to issue HTTP redirect responses
4. **Action**: Browser/Googlebot follows redirect; old URL updates to new URL in Google's index

---

## Features Comparison with Popular Packages

| Capability | next/redirects (config) | vercel.json | nginx rewrite | @power-seo/redirects |
|---|---:|---:|---:|---:|
| Works in Remix | ❌ | ❌ | ❌ | ✅ |
| Works in Express | ❌ | ❌ | ✅ | ✅ |
| Typed TypeScript API | ❌ | ❌ | ❌ | ✅ |
| Named `:param` substitution | ✅ | ✅ | ✅ | ✅ |
| Regex pattern support | ✅ | ✅ | ✅ | ✅ |
| Programmatic rule testing | ❌ | ❌ | ❌ | ✅ |
| Zero dependencies | ✅ | ✅ | ✅ | ✅ |

---

## @power-seo Ecosystem

All 17 packages are independently installable — use only what you need.

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

### Ecosystem vs alternatives

| Need | Common approach | @power-seo approach |
|---|---|---|
| URL redirects | Framework-specific config | `@power-seo/redirects` — one rule set, all frameworks |
| Sitemap generation | `next-sitemap` | `@power-seo/sitemap` — streaming, image, video, news |
| SEO auditing | Third-party tools | `@power-seo/audit` — in-code, CI-friendly |
| Analytics data | Direct API integration | `@power-seo/search-console` + `@power-seo/analytics` |

---

## Enterprise Integration

**Multi-tenant SaaS**
- **Per-tenant redirect rules**: Load rules from DB per tenant; instantiate one engine per tenant domain
- **URL migration pipelines**: Generate redirect rules from old → new URL mapping CSV; apply across all frameworks
- **Compliance**: Log all redirect matches with source and destination for audit trails

**ERP / internal portals**
- Enforce canonical URL formats for internal tools (e.g., strip trailing slashes, normalize casing)
- Redirect deprecated API endpoint paths to new versions with 301 rules
- Use regex rules to redirect numeric legacy IDs to slug-based resource URLs

**Recommended integration pattern**
- Define **all redirect rules in a single shared file** (`redirects.config.ts`)
- Use **`toNextRedirects()`**, **`createRemixRedirectHandler()`**, and **`createExpressRedirectMiddleware()`** to generate framework-specific implementations
- Test rules with **`engine.match()`** in unit tests
- Run tests in **CI** to prevent redirect regressions after rule updates

---

## Scope and Limitations

**This package does**
- ✅ Match URLs against exact, glob, and regex patterns
- ✅ Substitute named parameters in destination URLs
- ✅ Generate framework-specific redirect configs for Next.js, Remix, and Express
- ✅ Support 301 and 302 HTTP status codes

**This package does not**
- ❌ Proxy requests to other servers
- ❌ Rewrite URLs silently (all matches produce redirect responses)
- ❌ Manage CDN-level redirects (Vercel, Cloudflare) — use platform configs for those

---

## API Reference

### `createRedirectEngine(config)`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `config.rules` | `RedirectRule[]` | required | Ordered array of redirect rules |
| `config.caseSensitive` | `boolean` | `true` | Case-sensitive URL matching |
| `config.trailingSlash` | `'strip' \| 'add' \| 'ignore'` | `'ignore'` | Trailing slash normalization |

Returns `RedirectEngine`: `{ match(url: string): RedirectMatch | null }`.

### `matchExact(pattern, url, caseSensitive?)`

Returns `boolean`.

### `matchGlob(pattern, url, caseSensitive?)`

Returns `{ matched: boolean; params: Record<string, string> }`.

### `matchRegex(pattern, url)`

Returns `{ matched: boolean; groups: string[] }`.

### `substituteParams(template, params)`

```ts
substituteParams('/articles/:slug', { slug: 'react-seo-tips' });
// '/articles/react-seo-tips'
```

### `toNextRedirects(rules)`

Converts `RedirectRule[]` to Next.js `redirects()` array format. Maps `statusCode: 301` → `permanent: true`.

### `createRemixRedirectHandler(rules)`

Returns a Remix `LoaderFunction` that issues `redirect()` when a rule matches, or returns `null` otherwise.

### `createExpressRedirectMiddleware(rules)`

Returns an Express `RequestHandler` middleware function.

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
seo, redirects, url-redirect, 301-redirect, redirect-engine, nextjs, remix, express, glob-matching, regex-matching, site-migration, typescript, canonical-url, link-equity
```
