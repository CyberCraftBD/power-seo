# @power-seo/tracking — Analytics Script Builders & Consent Management for GA4, Clarity, PostHog, Plausible & Fathom

Build consent-aware analytics script configurations, manage GDPR cookie consent state, load tracking scripts conditionally, and query analytics APIs — all in TypeScript.

[![npm version](https://img.shields.io/npm/v/@power-seo/tracking)](https://www.npmjs.com/package/@power-seo/tracking)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/tracking)](https://www.npmjs.com/package/@power-seo/tracking)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/tracking)

`@power-seo/tracking` solves the two hardest parts of adding analytics to a modern web app: generating correct script configurations for five different providers, and only loading those scripts when the user has actually consented. The script builders (`buildGA4Script`, `buildClarityScript`, `buildPostHogScript`, `buildPlausibleScript`, `buildFathomScript`) produce `ScriptConfig` objects that each carry a `shouldLoad(consentState)` method. Pair them with `createConsentManager()` to get a reactive consent state store with `grant()`, `revoke()`, `grantAll()`, `revokeAll()`, and `onChange()`. The included React components (`AnalyticsScript`, `ConsentBanner`) wire everything together in a single render. For data retrieval, API clients for GA4, Clarity, PostHog, Plausible, and Fathom let you query analytics data programmatically.

> **Zero runtime dependencies** — pure TypeScript with optional React peer dependency.

## Features

- **Script builders for 5 platforms** — GA4 (multiple script tags), Microsoft Clarity, PostHog, Plausible Analytics, and Fathom Analytics
- **Consent-aware loading** — every `ScriptConfig` exposes `shouldLoad(consentState)` so you never load a tracker without the right category of consent
- **Consent manager** — `createConsentManager()` returns a typed store with `grant()`, `revoke()`, `grantAll()`, `revokeAll()`, `getState()`, and `onChange()` subscription for reactive consent UI
- **GDPR-friendly defaults** — `necessary` consent is always `true` and cannot be revoked; all other categories (`analytics`, `marketing`, `preferences`) default to `false`
- **React components** — `<AnalyticsScript>` renders only the scripts that pass consent; `<ConsentBanner>` is a ready-to-use GDPR banner with Accept All / Reject All buttons and a privacy policy link
- **GA4 Data API client** — `createGA4Client()` queries reports, real-time data, and metadata from the GA4 Data API
- **Clarity API client** — `createClarityClient()` fetches projects, session insights, and heatmap data
- **PostHog API client** — `createPostHogClient()` queries events, trends, funnels, and persons
- **Plausible Stats API client** — `createPlausibleClient()` fetches timeseries, breakdowns, and aggregate stats
- **Fathom API client** — `createFathomClient()` fetches sites, pageviews, and referrer data
- **Full TypeScript support** — typed config interfaces, consent state, and response shapes for every provider

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Script Builders](#script-builders)
  - [Consent Management](#consent-management)
  - [Consent-Aware Script Loading](#consent-aware-script-loading)
  - [React Components](#react-components)
  - [Analytics API Clients](#analytics-api-clients)
- [API Reference](#api-reference)
  - [Script Builders](#script-builders-api)
  - [Consent](#consent-api)
  - [API Clients](#api-clients)
  - [React Components](#react-components-api)
  - [Types](#types)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
npm install @power-seo/tracking
```

```bash
yarn add @power-seo/tracking
```

```bash
pnpm add @power-seo/tracking
```

For React components, React 18+ is required as a peer dependency.

## Quick Start

```ts
import {
  createConsentManager,
  buildGA4Script,
  buildPlausibleScript,
} from '@power-seo/tracking';

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

## Usage

### Script Builders

Each builder returns a `ScriptConfig` (or `ScriptConfig[]` for GA4) with the script attributes and a `shouldLoad()` method:

```ts
import {
  buildGA4Script,
  buildClarityScript,
  buildPostHogScript,
  buildPlausibleScript,
  buildFathomScript,
} from '@power-seo/tracking';

// Google Analytics 4 — returns ScriptConfig[] (multiple tags required)
const ga4Scripts = buildGA4Script({ measurementId: 'G-XXXXXXX' });
// [{ src, strategy, shouldLoad(consent) }, { inlineScript, shouldLoad(consent) }]

// Microsoft Clarity — returns ScriptConfig
const clarity = buildClarityScript({ projectId: 'abc123xyz' });

// PostHog — returns ScriptConfig
const posthog = buildPostHogScript({
  apiKey:  'phc_xxxxxxxxxxxx',
  apiHost: 'https://app.posthog.com', // optional, defaults to cloud
});

// Plausible Analytics — returns ScriptConfig
const plausible = buildPlausibleScript({
  domain:    'example.com',
  customDomain: 'https://analytics.example.com', // optional self-hosted
});

// Fathom Analytics — returns ScriptConfig
const fathom = buildFathomScript({ siteId: 'ABCDEFGH' });
```

### Consent Management

```ts
import { createConsentManager } from '@power-seo/tracking';
import type { ConsentState, ConsentManager } from '@power-seo/tracking';

const manager: ConsentManager = createConsentManager({
  necessary:   true,   // always true, cannot be revoked
  analytics:   false,  // opt-in by default
  marketing:   false,
  preferences: false,
});

// Grant / revoke individual categories
manager.grant('analytics');
manager.revoke('marketing');

// Bulk operations
manager.grantAll();    // grant analytics + marketing + preferences
manager.revokeAll();   // revoke analytics + marketing + preferences

// Read current state
const state: ConsentState = manager.getState();
// { necessary: true, analytics: true, marketing: false, preferences: false }

// Subscribe to changes (for reactive UI)
const unsubscribe = manager.onChange((state: ConsentState) => {
  console.log('Consent updated:', state);
  reloadScripts(state);
});

// Later: unsubscribe when component unmounts
unsubscribe();
```

### Consent-Aware Script Loading

```ts
import { createConsentManager, buildGA4Script, buildClarityScript } from '@power-seo/tracking';

const manager = createConsentManager({ necessary: true, analytics: false });
const scripts = [...buildGA4Script({ measurementId: 'G-XXX' }), buildClarityScript({ projectId: 'abc' })];

// Inject into DOM only if consent is granted
function loadApprovedScripts() {
  const consent = manager.getState();
  scripts
    .filter((s) => s.shouldLoad(consent))
    .forEach((s) => {
      if (s.src) {
        const el = document.createElement('script');
        el.src = s.src;
        el.async = true;
        document.head.appendChild(el);
      } else if (s.inlineScript) {
        const el = document.createElement('script');
        el.textContent = s.inlineScript;
        document.head.appendChild(el);
      }
    });
}

manager.onChange(() => loadApprovedScripts());
```

### React Components

```tsx
import { AnalyticsScript, ConsentBanner } from '@power-seo/tracking/react';
import {
  createConsentManager,
  buildGA4Script,
  buildPlausibleScript,
  buildClarityScript,
} from '@power-seo/tracking';

// In _app.tsx or layout.tsx
const manager = createConsentManager({
  necessary:   true,
  analytics:   false,
  marketing:   false,
  preferences: false,
});

const scripts = [
  ...buildGA4Script({ measurementId: 'G-XXXXXXX' }),
  buildPlausibleScript({ domain: 'example.com' }),
  buildClarityScript({ projectId: 'abc123' }),
];

export default function RootLayout({ children }) {
  const [consent, setConsent] = useState(manager.getState());

  useEffect(() => {
    return manager.onChange((state) => setConsent(state));
  }, []);

  return (
    <html>
      <head>
        {/* Renders only scripts that pass consent */}
        <AnalyticsScript scripts={scripts} consent={consent} />
      </head>
      <body>
        {children}
        {/* GDPR banner — shows until user accepts or rejects */}
        <ConsentBanner
          manager={manager}
          privacyPolicyUrl="/privacy-policy"
        />
      </body>
    </html>
  );
}
```

### Analytics API Clients

```ts
import {
  createGA4Client,
  createPlausibleClient,
  createFathomClient,
  createClarityClient,
  createPostHogClient,
} from '@power-seo/tracking';

// Google Analytics 4 Data API
const ga4 = createGA4Client({
  credentials: {
    clientEmail: process.env.GA4_CLIENT_EMAIL!,
    privateKey:  process.env.GA4_PRIVATE_KEY!,
    propertyId:  process.env.GA4_PROPERTY_ID!,
  },
});
const report = await ga4.queryReport({
  dateRanges:  [{ startDate: '2026-01-01', endDate: '2026-01-31' }],
  dimensions:  [{ name: 'pagePath' }],
  metrics:     [{ name: 'sessions' }, { name: 'bounceRate' }],
});

// Plausible Stats API
const plausible = createPlausibleClient({ apiKey: process.env.PLAUSIBLE_API_KEY! });
const stats = await plausible.getAggregate({
  domain: 'example.com',
  period: '30d',
  metrics: 'visitors,pageviews,bounce_rate',
});

// Fathom API
const fathom = createFathomClient({ apiKey: process.env.FATHOM_API_KEY! });
const pageviews = await fathom.getPageviews({
  siteId:    'ABCDEFGH',
  dateFrom:  '2026-01-01',
  dateTo:    '2026-01-31',
  groupBy:   'pathname',
});
```

## API Reference

### Script Builders API

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
| `shouldLoad` | `(consent: ConsentState) => boolean` | Returns `true` if this script may load under the current consent state |

### Consent API

```ts
function createConsentManager(initialState: Partial<ConsentState>): ConsentManager
```

#### `ConsentManager`

| Method | Signature | Description |
|--------|-----------|-------------|
| `grant` | `(category: ConsentCategory) => void` | Grant a consent category |
| `revoke` | `(category: ConsentCategory) => void` | Revoke a consent category |
| `grantAll` | `() => void` | Grant all non-necessary categories |
| `revokeAll` | `() => void` | Revoke all non-necessary categories |
| `getState` | `() => ConsentState` | Get the current consent snapshot |
| `onChange` | `(cb: ConsentChangeCallback) => () => void` | Subscribe to consent changes; returns unsubscribe function |

### API Clients

```ts
function createGA4Client(config: GA4Config): GA4Client
function createClarityClient(config: ClarityConfig): ClarityClient
function createPostHogClient(config: PostHogConfig): PostHogClient
function createPlausibleClient(config: PlausibleConfig): PlausibleClient
function createFathomClient(config: FathomConfig): FathomClient
```

### React Components API

| Component | Props | Description |
|-----------|-------|-------------|
| `AnalyticsScript` | `{ scripts: ScriptConfig[], consent: ConsentState }` | Renders `<script>` tags for each script that passes `shouldLoad(consent)` |
| `ConsentBanner` | `{ manager: ConsentManager, privacyPolicyUrl?: string }` | GDPR cookie consent banner with Accept All / Reject All |

### Types

```ts
import type {
  ConsentCategory,        // 'necessary' | 'analytics' | 'marketing' | 'preferences'
  ConsentState,           // { necessary, analytics, marketing, preferences }
  ConsentManager,         // { grant, revoke, grantAll, revokeAll, getState, onChange }
  ConsentChangeCallback,  // (state: ConsentState) => void
  ScriptConfig,           // { src?, inlineScript?, strategy, shouldLoad }
  GA4Config,
  GA4Client,
  ClarityConfig,
  ClarityClient,
  PostHogConfig,
  PostHogClient,
  PlausibleConfig,
  PlausibleClient,
  FathomConfig,
  FathomClient,
} from '@power-seo/tracking';
```

## The @power-seo Ecosystem

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
