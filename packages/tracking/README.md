# @power-seo/tracking — Analytics Script Builders & GDPR Consent Management for GA4, Clarity, PostHog, Plausible & Fathom

[![npm version](https://img.shields.io/npm/v/@power-seo/tracking)](https://www.npmjs.com/package/@power-seo/tracking)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/tracking)](https://www.npmjs.com/package/@power-seo/tracking)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/tracking)

---

## Overview

**@power-seo/tracking** is a consent-aware analytics toolkit for TypeScript that helps you manage GDPR-compliant script loading, define consent state, and query analytics APIs for GA4, Microsoft Clarity, PostHog, Plausible, and Fathom — all without runtime dependencies.

**What it does**
- ✅ **Script builders for 5 platforms** — `buildGA4Script`, `buildClarityScript`, `buildPostHogScript`, `buildPlausibleScript`, `buildFathomScript`
- ✅ **Consent-aware loading** — every `ScriptConfig` exposes `shouldLoad(consentState)` to prevent loading without consent
- ✅ **Consent manager** — `createConsentManager()` with `grant()`, `revoke()`, `grantAll()`, `revokeAll()`, `onChange()`
- ✅ **React components** — `<AnalyticsScript>` and `<ConsentBanner>` for drop-in GDPR banner integration
- ✅ **Analytics API clients** — query GA4, Clarity, PostHog, Plausible, and Fathom data programmatically

**What it is not**
- ❌ **Not a Tag Manager** — does not replace Google Tag Manager; it is a code-first alternative
- ❌ **Not a legal compliance tool** — provides the technical mechanism; legal GDPR compliance requires proper privacy policy and DPA

**Recommended for**
- **Next.js App Router and Pages Router apps**, **Remix applications**, **SaaS products needing GDPR compliance**, and **analytics reporting dashboards**

---

## Why @power-seo/tracking Matters

**The problem**
- **Analytics scripts load before consent** — most analytics integrations don't check consent state before injecting `<script>` tags, violating GDPR
- **5 different provider APIs** — each analytics platform has different initialization code, configuration, and loading strategy
- **Consent state is UI state** — analytics loading needs to react to user consent choices in real time

**Why developers care**
- **Compliance:** GDPR requires analytics scripts not to load until the user grants consent
- **Performance:** Consent-gated loading prevents unnecessary scripts from affecting LCP and TTI before user interaction
- **UX:** A unified consent manager drives the consent banner, script loading, and API data fetching from one source of truth

---

## Key Features

- **Script builders for 5 platforms** — GA4 (2 script tags), Microsoft Clarity, PostHog, Plausible, and Fathom Analytics
- **Consent-aware loading** — every `ScriptConfig` exposes `shouldLoad(consentState)` — never loads a tracker without the right consent category
- **Consent manager** — `createConsentManager()` returns a typed store with `grant()`, `revoke()`, `grantAll()`, `revokeAll()`, `getState()`, and `onChange()` subscription
- **GDPR-friendly defaults** — `necessary` consent is always `true` and cannot be revoked; `analytics`, `marketing`, `preferences` default to `false`
- **React components** — `<AnalyticsScript>` renders only consented scripts; `<ConsentBanner>` is a ready-to-use GDPR banner
- **GA4 Data API client** — `createGA4Client()` queries reports, real-time data, and metadata
- **Clarity API client** — `createClarityClient()` fetches projects, session insights, and heatmap data
- **PostHog API client** — `createPostHogClient()` queries events, trends, funnels, and persons
- **Plausible Stats API client** — `createPlausibleClient()` fetches timeseries, breakdowns, and aggregate stats
- **Fathom API client** — `createFathomClient()` fetches sites, pageviews, and referrer data
- **Zero runtime dependencies** — pure TypeScript with optional React peer dependency
- **Full TypeScript support** — typed config interfaces, consent state, and response shapes for every provider

---

## Benefits of Using @power-seo/tracking

- **GDPR compliance**: `shouldLoad(consent)` guarantees scripts only load when the correct consent category is granted
- **Simpler integration**: One consent manager drives the consent banner UI, script loading, and API access — no fragmented state
- **Better performance**: Analytics scripts with `lazyOnload` strategy don't block page render
- **Faster delivery**: Typed script builders for 5 providers eliminate provider-specific documentation research

---

## Quick Start

```ts
import { createConsentManager, buildGA4Script, buildPlausibleScript } from '@power-seo/tracking';

// 1. Create consent manager — analytics off by default
const consent = createConsentManager({
  necessary:   true,
  analytics:   false,
  marketing:   false,
  preferences: false,
});

// 2. Build script configs
const scripts = [
  ...buildGA4Script({ measurementId: 'G-XXXXXXX' }),
  buildPlausibleScript({ domain: 'example.com' }),
];

// 3. Only load scripts where consent matches
const toLoad = scripts.filter((s) => s.shouldLoad(consent.getState()));
// toLoad → [] until analytics consent is granted

// 4. Grant consent (e.g. after user clicks "Accept All")
consent.grantAll();
const nowToLoad = scripts.filter((s) => s.shouldLoad(consent.getState()));
// nowToLoad → [GA4Script1, GA4Script2, PlausibleScript]
```

**What you should see**
- Zero scripts loaded until `consent.grantAll()` is called
- Scripts filtered by `shouldLoad(consentState)` — no analytics without user approval

---

## Installation

```bash
npm i @power-seo/tracking
# or
yarn add @power-seo/tracking
# or
pnpm add @power-seo/tracking
# or
bun add @power-seo/tracking
```

For React components, React 18+ is required as a peer dependency.

---

## Framework Compatibility

**Supported**
- ✅ Next.js App Router — use `<AnalyticsScript>` and `<ConsentBanner>` in root layout
- ✅ Next.js Pages Router — use in `_app.tsx`
- ✅ Remix — use in root route component
- ✅ Node.js 18+ — API clients for server-side analytics data fetching
- ✅ Vite + React — works in standard SPA setup

**Environment notes**
- **SSR/SSG:** Script builders and consent manager are SSR-safe; React components require client-side rendering for DOM injection
- **Edge runtime:** Script builders and consent manager are edge-compatible; API clients require Node.js fetch
- **Browser-only usage:** `shouldLoad()` and consent manager work in browser environments

---

## Use Cases

- **GDPR-compliant web apps** — load analytics scripts only after user consent
- **SaaS marketing sites** — track user behavior with GA4 while respecting privacy regulations
- **E-commerce stores** — Clarity session recordings for UX optimization with consent gate
- **Multi-provider analytics** — run GA4 + Plausible + PostHog side-by-side for data validation
- **Privacy-first apps** — Plausible or Fathom as cookieless, GDPR-compliant alternatives to GA4
- **Analytics dashboards** — query GA4, Plausible, or Fathom APIs for custom reporting
- **A/B testing pipelines** — PostHog feature flags + event tracking with consent management
- **Enterprise compliance** — full audit trail of when consent was granted per category

---

## Example (Before / After)

```text
Before:
- GA4 script injected in <head> unconditionally → violates GDPR before consent
- 3 separate analytics integrations with different initialization patterns
- Consent banner only hides scripts after first render → tracking still fires

After (@power-seo/tracking):
- buildGA4Script({ measurementId }) → ScriptConfig with shouldLoad(consent)
- createConsentManager({ analytics: false }) → analytics = false until user clicks Accept
- <AnalyticsScript scripts={scripts} consent={consent} /> → renders nothing until consented
```

---

## Implementation Best Practices

- **Set `analytics: false` by default** in `createConsentManager()` — GDPR requires opt-in, not opt-out
- **Persist consent state** to `localStorage` or a cookie — re-read on page load to avoid showing the banner twice
- **Use `onChange()`** to reactively reload scripts after consent is granted
- **Do not load GA4 or Clarity** without `analytics` consent — these are tracking, not `necessary` scripts
- **Include a working privacy policy link** in `<ConsentBanner privacyPolicyUrl="/privacy-policy" />`

---

## Architecture Overview

**Where it runs**
- **Build-time**: Script builder configs are defined server-side; passed to client as serialized props
- **Runtime**: Consent manager runs client-side; `shouldLoad()` is evaluated on consent change
- **CI/CD**: API clients run server-side for scheduled analytics data fetching and reporting

**Data flow**
1. **Input**: Provider credentials (measurementId, projectId), initial consent state
2. **Analysis**: `shouldLoad(consentState)` evaluates per-script consent requirements
3. **Output**: Filtered `ScriptConfig[]` injected into `<head>` as `<script>` tags
4. **Action**: Analytics providers receive tracking data only when consent is granted

---

## Features Comparison with Popular Packages

| Capability | @next/third-parties | partytown | cookiebot | @power-seo/tracking |
|---|---:|---:|---:|---:|
| Typed script builders | ❌ | ❌ | ❌ | ✅ |
| Consent-aware `shouldLoad()` | ❌ | ❌ | ✅ | ✅ |
| Built-in consent manager | ❌ | ❌ | ✅ (paid) | ✅ |
| Analytics API clients | ❌ | ❌ | ❌ | ✅ |
| 5-provider support | ⚠️ | ⚠️ | ✅ | ✅ |
| Zero runtime dependencies | ✅ | ✅ | ❌ | ✅ |

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
| Analytics scripts | Direct `<script>` in HTML | `@power-seo/tracking` — consent-gated `ScriptConfig` |
| GDPR consent banner | Cookiebot (paid) | `@power-seo/tracking` — built-in `<ConsentBanner>` |
| GSC data queries | `googleapis` | `@power-seo/search-console` — typed, auto-paginated |
| SEO analytics dashboard | Looker Studio | `@power-seo/analytics` — merge GSC + audit data |

---

## Enterprise Integration

**Multi-tenant SaaS**
- **Per-tenant analytics**: Each tenant supplies their own `measurementId`; instantiate separate `ScriptConfig` per tenant
- **Consent per tenant**: Persist consent state in tenant-scoped cookies or DB; initialize `createConsentManager()` from stored state
- **Data isolation**: API clients are instantiated per tenant — no cross-tenant data leakage

**ERP / internal portals**
- Load Clarity session recordings only on public-facing pages, not authenticated internal routes
- Use PostHog feature flags + event tracking for internal user behavior analytics with explicit consent
- Build custom analytics reports with `createGA4Client()` or `createPlausibleClient()` for stakeholder dashboards

**Recommended integration pattern**
- Store consent state in **`localStorage`** or **HTTP-only cookie**
- Initialize `createConsentManager()` from stored state on every page load
- Trigger `onChange()` to reload scripts reactively when user updates consent preferences
- Export consent events to **audit logs** for compliance documentation

---

## Scope and Limitations

**This package does**
- ✅ Build consent-aware script configs for 5 analytics platforms
- ✅ Manage GDPR consent state with typed store and reactive subscriptions
- ✅ Render consent-gated script tags and GDPR banner via React components
- ✅ Query analytics data programmatically via 5 provider API clients

**This package does not**
- ❌ Replace a full consent management platform (CMP) for complex legal requirements
- ❌ Implement consent record-keeping or proof-of-consent storage — handle this in your backend
- ❌ Block server-side tracking (cookies set by CDN or server) — client-side only

---

## API Reference

### Script Builders

| Function | Config Props | Returns | Description |
|----------|-------------|---------|-------------|
| `buildGA4Script` | `{ measurementId }` | `ScriptConfig[]` | Google Analytics 4 (2 script tags) |
| `buildClarityScript` | `{ projectId }` | `ScriptConfig` | Microsoft Clarity |
| `buildPostHogScript` | `{ apiKey, apiHost? }` | `ScriptConfig` | PostHog |
| `buildPlausibleScript` | `{ domain, customDomain? }` | `ScriptConfig` | Plausible Analytics |
| `buildFathomScript` | `{ siteId }` | `ScriptConfig` | Fathom Analytics |

#### `ScriptConfig`

| Prop | Type | Description |
|------|------|-------------|
| `src` | `string \| undefined` | External script URL |
| `inlineScript` | `string \| undefined` | Inline JavaScript content |
| `strategy` | `'beforeInteractive' \| 'afterInteractive' \| 'lazyOnload'` | Loading strategy hint |
| `shouldLoad` | `(consent: ConsentState) => boolean` | Returns `true` if this script may load |

### Consent Manager

```ts
function createConsentManager(initialState: Partial<ConsentState>): ConsentManager
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `grant` | `(category: ConsentCategory) => void` | Grant a consent category |
| `revoke` | `(category: ConsentCategory) => void` | Revoke a consent category |
| `grantAll` | `() => void` | Grant all non-necessary categories |
| `revokeAll` | `() => void` | Revoke all non-necessary categories |
| `getState` | `() => ConsentState` | Get the current consent snapshot |
| `onChange` | `(cb: ConsentChangeCallback) => () => void` | Subscribe to changes; returns unsubscribe |

### API Clients

```ts
function createGA4Client(config: GA4Config): GA4Client
function createClarityClient(config: ClarityConfig): ClarityClient
function createPostHogClient(config: PostHogConfig): PostHogClient
function createPlausibleClient(config: PlausibleConfig): PlausibleClient
function createFathomClient(config: FathomConfig): FathomClient
```

### React Components

| Component | Props | Description |
|-----------|-------|-------------|
| `<AnalyticsScript>` | `{ scripts: ScriptConfig[], consent: ConsentState }` | Renders `<script>` tags that pass `shouldLoad(consent)` |
| `<ConsentBanner>` | `{ manager: ConsentManager, privacyPolicyUrl?: string }` | GDPR cookie consent banner with Accept All / Reject All |

### Types

```ts
import type {
  ConsentCategory,        // 'necessary' | 'analytics' | 'marketing' | 'preferences'
  ConsentState,           // { necessary, analytics, marketing, preferences }
  ConsentManager,
  ScriptConfig,
  GA4Config, GA4Client,
  ClarityConfig, ClarityClient,
  PostHogConfig, PostHogClient,
  PlausibleConfig, PlausibleClient,
  FathomConfig, FathomClient,
} from '@power-seo/tracking';
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
analytics, ga4, google-analytics, microsoft-clarity, posthog, plausible, fathom, gdpr, consent-management, cookie-consent, typescript, react, nextjs, privacy
```
