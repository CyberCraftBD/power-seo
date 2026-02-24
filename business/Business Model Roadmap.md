# power-seo — Business Model & Development Roadmap

> **Principle:** Reputation and user trust come first.
> **Rule:** All npm packages stay free forever. Paid value is added through depth, scale, and AI intelligence — never by restricting existing features.

---

## Table of Contents

**Part 1 — Strategic Overview**
1. [Executive Summary](#1-executive-summary)
2. [Market Analysis](#2-market-analysis)
3. [Project Vision & Goals](#3-project-vision--goals)
4. [Strategic Principles](#4-strategic-principles)

**Part 2 — Product Architecture**
5. [Technical Architecture](#5-technical-architecture)
6. [Package Reference](#6-package-reference)
7. [Framework Integration](#7-framework-integration)
8. [External API Integrations](#8-external-api-integrations)

**Part 3 — Business Model**
9. [Versioning Policy](#9-versioning-policy)
10. [Pricing Plans](#10-pricing-plans)
11. [AI Credit System](#11-ai-credit-system)
12. [Package Feature Matrix](#12-package-feature-matrix)
13. [Cost & Profitability](#13-cost--profitability)

**Part 4 — Development Roadmap**
14. [Completed Milestones](#14-completed-milestones)
15. [Phase 1 — Foundation & Trust](#15-phase-1--foundation--trust-v100--v12x)
16. [Phase 2 — AI Launch + First Plans](#16-phase-2--ai-launch--first-plans-v13x)
17. [Phase 3 — Business Plan + Image AI](#17-phase-3--business-plan--image-ai-v14x)
18. [Phase 4 — Agency Plan + Advanced AI](#18-phase-4--agency-plan--advanced-ai-v15x)
19. [Phase 5 — Bulk Operations & Automation](#19-phase-5--bulk-operations--automation-v16x)
20. [Phase 6 — Cloud & SaaS](#20-phase-6--cloud--saas-v17x--v18x)
21. [Phase 7 — Maturity](#21-phase-7--maturity-v2x)
22. [Future Package Candidates](#22-future-package-candidates)
23. [Strategic Opportunities](#23-strategic-opportunities)

**Part 5 — Engineering Standards**
24. [Security & Compliance](#24-security--compliance)
25. [Testing Strategy](#25-testing-strategy)
26. [CI/CD Pipeline](#26-cicd-pipeline)
27. [Publishing Workflow](#27-publishing-workflow)

**Part 6 — Risk & Governance**
28. [Free vs Paid — Full Feature Summary](#28-free-vs-paid--full-feature-summary)
29. [Risk Analysis](#29-risk-analysis)
30. [Reputation Protection Rules](#30-reputation-protection-rules)

**Part 7 — Reference**
31. [Instructions for Claude](#31-instructions-for-claude)

---

## 1. Executive Summary

**@power-seo** is the first and only comprehensive SEO toolkit for React, bringing WordPress-level SEO capabilities to the JavaScript ecosystem. It fills a fundamental gap: WordPress developers have five mature SEO suites (Yoast, Rank Math, AIOSEO, SEOPress, Squirrly) while React/Next.js developers have nothing comparable — just scattered, single-purpose libraries.

### Current State (v1.0.x)

| Metric | Value |
| --- | --- |
| Published packages | 17 under `@power-seo` npm org |
| Tests | 500+ across all packages (Vitest) |
| Output formats | Dual ESM + CJS with TypeScript declarations |
| Framework support | Next.js App Router, Remix v2, generic SSR, Astro |
| Documentation | Starlight site (Astro) |
| Examples | Next.js App Router + Remix v2 |
| License | MIT |

### Value Proposition

| Audience | Value |
| --- | --- |
| **Solo developers** | Drop-in SEO components that work out of the box |
| **Agencies** | Modular — install only the packages you need |
| **Enterprises** | Type-safe, tree-shakeable, auditable SEO infrastructure |
| **The ecosystem** | Free, open-source, MIT-licensed — no vendor lock-in |

### Market Position

@power-seo is the **only** React toolkit covering content analysis, readability, SERP previews, structured data, sitemaps, redirects, internal linking, auditing, image SEO, AI-assisted SEO, analytics, and consent management — all in one coherent monorepo.

---

## 2. Market Analysis

### WordPress SEO Plugin Landscape

| Feature | Yoast SEO ($99/yr) | Rank Math ($59/yr) | AIOSEO ($49/yr) | SEOPress ($49/yr) |
| --- | --- | --- | --- | --- |
| Content analysis | Real-time scoring | Real-time scoring | TruSEO scoring | Basic |
| Readability | Flesch-Kincaid + custom | Basic | Score only | None |
| Schema/JSON-LD | 14+ types (Pro) | 20+ types (free) | 17+ types | 18+ types |
| XML Sitemaps | Yes | Yes | Yes | Yes |
| Redirects | Premium only | Free (basic) | Pro only | Free |
| Social previews | Yes | Yes | Yes | Yes |
| Search Console | Yes | Yes | Yes | Yes |
| Internal linking | Premium only | Free suggestions | Pro only | Pro |

**Key insight:** WordPress developers have five mature, full-featured SEO suites. React developers have nothing comparable.

### React/JS Ecosystem Gaps (Before @power-seo)

| Capability | WordPress | React/Next.js |
| --- | --- | --- |
| Real-time content analysis | Built-in editor panel | **Nothing** |
| Readability scoring in UI | Live Flesch-Kincaid | **Zero** |
| SERP preview components | Google/social previews | **Zero** |
| Redirect manager | GUI-based 301/302/410 | **Zero** |
| SEO audit/scoring dashboard | Built-in site health | **Zero** |
| Internal link suggestions | Automated | **Zero** |
| Keyword density tracking | Real-time | **Zero** |
| Breadcrumb components | PHP template tags | **Zero** |
| Search Console integration | Embedded dashboard | **Zero** |
| Schema/JSON-LD validation | Auto-generated | Partial (next-seo basics) |

### Existing React Libraries (Pre-@power-seo)

| Category | Package | Weekly Downloads | Limitation |
| --- | --- | --- | --- |
| Meta tags | react-helmet-async | ~2.5M | Meta only, no analysis |
| Sitemaps | next-sitemap | ~350K | Next.js specific |
| JSON-LD | next-seo | ~200K | Next.js only |
| Content analysis | yoastseo | ~15K | WordPress-coupled |
| Readability | text-readability | ~3K | Single algorithm, no UI |

### How @power-seo Fills Every Gap

| Package | Gap Addressed | WordPress Equivalent |
| --- | --- | --- |
| `content-analysis` | Real-time content scoring, keyword density | Yoast content analysis panel |
| `readability` | Flesch-Kincaid + 3 more algorithms + React components | Yoast readability tab |
| `preview` | Google SERP, OG, Twitter Card preview components | Yoast/Rank Math social previews |
| `redirects` | Programmatic redirect manager (301/302/307/410) | Rank Math redirect manager |
| `schema` | Type-safe JSON-LD for 19 schema types | Rank Math schema builder |
| `sitemap` | Framework-agnostic XML/HTML sitemap generation | Yoast XML sitemaps |
| `audit` | Page-level and site-level SEO scoring | Yoast/AIOSEO site health |
| `search-console` | Google Search Console API integration | Rank Math analytics |
| `links` | Internal link analysis and suggestions | Yoast internal linking |
| `meta` | Unified meta tag management with SSR support | Core meta tag handling |
| `tracking` | Consent-aware analytics script management | Cookie plugins + GTM |

---

## 3. Project Vision & Goals

### Vision Statement

> Become the default SEO infrastructure for React applications — trusted by developers, adopted by agencies, and relied upon by enterprises.

### Goals Hierarchy (Priority Order)

```
1. TRUST      → Open-source, free forever npm packages, no bait-and-switch
2. USERS      → Solve real problems, reduce SEO implementation time
3. STABILITY  → Stable APIs, semantic versioning, comprehensive tests
4. POPULARITY → npm downloads, GitHub stars, community contributions
5. REVENUE    → Paid intelligence and cloud services (never core features)
```

### Non-Functional Requirements

| Requirement | Standard | Target |
| --- | --- | --- |
| Type safety | TypeScript strict mode | Zero `any` types in public API |
| Bundle size | Tree-shakeable, `sideEffects: false` | Each package < 50KB minified |
| Node.js support | LTS versions | Node 18, 20, 22 |
| Module format | Dual ESM + CJS | All 17 packages |
| Test coverage | Line coverage | > 90% per package |
| Build time | Turborepo parallel | < 30s full build |

### Competitive Threats & Mitigations

| Threat | Mitigation |
| --- | --- |
| Next.js ships native SEO features | @power-seo works alongside `next/metadata` — adds analysis, previews, auditing that Next.js never will |
| Vercel ships an SEO utility | Focus on depth: 17 packages vs a single utility |
| WordPress ecosystem extends to headless | @power-seo is React-native, not a WordPress bridge |
| Another OSS project copies the approach | First-mover advantage, community trust, established npm presence |

---

## 4. Strategic Principles

### A. Monetize Intelligence, Not Capabilities

- Never charge for *having* a feature
- Charge for:
  - **Depth** — multiple keywords
  - **Scale** — bulk automation, dynamic image conversion
  - **Intelligence** — AI reasoning, content generation, ROI prediction

This avoids backlash and aligns with how professional SEO tools are accepted (Yoast/Rank Math model).

### B. Delay Hard Monetization Until Trust Signals Exist

Paid rollout starts only **after**:

- 1,000+ weekly npm installs
- 50+ GitHub contributors / issues
- Real-world case studies (even small)

### C. One-Line Strategy

> **Free infrastructure builds trust. Paid depth and scale builds early revenue. AI credits and cloud services build long-term scale.**

---

## 5. Technical Architecture

### Monorepo Structure

```
power-seo/
├── packages/           17 publishable npm packages
│   ├── core/           Foundation: types, constants, utilities
│   ├── react/          React SEO components
│   ├── schema/         JSON-LD structured data (19 types)
│   ├── content-analysis/ Content scoring engine
│   ├── preview/        SERP/OG/Twitter previews
│   ├── readability/    Readability algorithms
│   ├── sitemap/        XML sitemap generation
│   ├── redirects/      Redirect engine
│   ├── links/          Link graph analysis
│   ├── audit/          SEO auditing
│   ├── images/         Image SEO
│   ├── ai/             AI prompt templates + parsers
│   ├── analytics/      Analytics dashboard
│   ├── search-console/ Google Search Console API
│   ├── integrations/   Semrush + Ahrefs clients
│   ├── tracking/       Analytics scripts + consent
│   └── meta/           SSR meta tag helpers
├── apps/docs/          Starlight documentation site
├── examples/           Next.js App Router + Remix v2
├── turbo.json          Turborepo build orchestration
└── pnpm-workspace.yaml pnpm workspace config
```

### Build Pipeline

| Tool | Purpose | Version |
| --- | --- | --- |
| pnpm | Package manager + workspaces | 9.15+ |
| Turborepo | Parallel builds + caching | 2.3+ |
| tsup | ESM + CJS + `.d.ts` bundling | 8.3+ |
| TypeScript | Strict type checking | 5.9+ |
| Vitest | Test framework | 2.1+ |
| ESLint | Linting (flat config v9) | 9.x |
| Prettier | Code formatting | 3.4+ |
| Changesets | Version management + npm publish | 2.27+ |

### Package Dependency Graph

```
Level 0:  core
Level 1:  react · schema · sitemap · redirects · readability
          links · images · ai · search-console · integrations · tracking
Level 2:  preview (core + react) · content-analysis (core)
Level 3:  audit (core + content-analysis + readability + schema)
Level 4:  analytics (core + audit) · meta (core + react)
```

### Dual Export Pattern

Packages with React components export two entry points:

```json
{
  "exports": {
    ".":        { "import": "./dist/index.js",  "require": "./dist/index.cjs" },
    "./react":  { "import": "./dist/react.js",  "require": "./dist/react.cjs" }
  }
}
```

Packages using this pattern: `schema` · `content-analysis` · `preview` · `tracking`

---

## 6. Package Reference

All 17 packages, their current version, test count, and API surface:

| Package | Version | Tests | Export | Description |
| --- | --- | --- | --- | --- |
| `core` | 1.0.x | — | Single | Types, constants, meta validators, URL utils, text stats, keyword density |
| `react` | 1.0.x | — | Single | React SEO components: SEO, DefaultSEO, OpenGraph, TwitterCard, Canonical, Robots, Hreflang, Breadcrumb |
| `schema` | 1.0.x | — | Dual | 19 JSON-LD builder functions + 19 React components + validation |
| `content-analysis` | 1.0.x | 47 | Dual | 7 check functions + ScorePanel + CheckList + ContentAnalyzer components |
| `preview` | 1.0.x | 36 | Dual | SERP/OG/Twitter generators + SerpPreview + OgPreview + TwitterPreview + PreviewPanel |
| `readability` | 1.0.x | 28 | Single | Flesch, Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI algorithms |
| `sitemap` | 1.0.x | 33 | Single | XML generation, streaming, index splitting, validation |
| `redirects` | 1.0.x | 47 | Single | Exact/glob/regex matching + Next.js, Remix, Express adapters |
| `links` | 1.0.x | 31 | Single | Link graph, orphan detection, link equity, keyword-based suggestions |
| `audit` | 1.0.x | 44 | Single | Page + site auditing across meta/content/structure/performance rules |
| `images` | 1.0.x | 40 | Single | Alt text audit, lazy loading, format detection, image sitemaps |
| `ai` | 1.0.x | 40 | Single | LLM-agnostic prompt builders + response parsers + SERP eligibility |
| `analytics` | 1.0.x | 33 | Single | GSC + audit merging, trend lines, anomaly detection, dashboard data |
| `search-console` | 1.0.x | 26 | Single | Google Search Console API client (OAuth 2.0 + Service Account) |
| `integrations` | 1.0.x | 19 | Single | Semrush + Ahrefs typed HTTP clients |
| `tracking` | 1.0.x | 38 | Dual | GA4/Clarity/PostHog/Plausible/Fathom builders + API clients + consent manager |
| `meta` | 1.0.x | 28 | Single | Next.js `createMetadata()`, Remix `createMetaDescriptors()`, generic SSR helpers |

### Key API Patterns

**Content Analysis (single → multi-keyword, plan-gated):**
```ts
// Current (free) — single keyphrase
analyzeContent({ content, focusKeyphrase: 'react seo' })

// v1.3.x+ — array, limit enforced by plan
analyzeContent({ content, focusKeyphrases: ['react seo', 'next.js seo'] }, planContext)
```

**AI Functions (credit-gated, all plans):**
```ts
// All AI functions accept optional PlanContext
const titles = await generateTitles({ title, content }, { apiKey: 'pseo_xxx' })
```

**Plan Context (passed optionally, falls back to free tier):**
```ts
interface PlanContext {
  apiKey: string        // Validated server-side
  tier: 'free' | 'starter' | 'pro' | 'business' | 'agency'
  maxKeywords: number   // 1 / 3 / 5 / 10 / unlimited
  imageQuota: number    // 0 / 50 / 200 / 1000 / 5000
  credits: { text: number; image: number }
}
```

### Schema Coverage (19 Types)

`Article` · `BlogPosting` · `NewsArticle` · `Product` · `FAQPage` · `BreadcrumbList` · `LocalBusiness` · `Organization` · `Person` · `Event` · `Recipe` · `HowTo` · `VideoObject` · `Course` · `JobPosting` · `SoftwareApplication` · `WebSite` · `Review` · `Service`

Plus: `schemaGraph()` (multi-schema `@graph`), `toJsonLdString()`, `validateSchema()`

---

## 7. Framework Integration

### Next.js App Router

```ts
import { createMetadata } from '@power-seo/meta';

export const metadata = createMetadata({
  title: 'My Site',
  description: 'Site description',
  canonical: 'https://example.com',
  openGraph: { type: 'website', images: [{ url: '/og.jpg' }] },
});
```

### Remix v2

```ts
import { createMetaDescriptors } from '@power-seo/meta';

export const meta = () =>
  createMetaDescriptors({
    title: 'Blog Post',
    description: 'Post description',
    canonical: 'https://example.com/blog/post',
  });
```

### Astro / Generic SSR

```ts
import { createHeadTags } from '@power-seo/meta';

const html = createHeadTags({ title: 'My Page', canonical: 'https://example.com/page' });
// Returns HTML string: <title>My Page</title><meta name="description" ...>
```

Use framework-agnostic builder functions from `@power-seo/core` and `@power-seo/schema` directly — no React dependency needed.

---

## 8. External API Integrations

### Google Search Console API

| Detail | Value |
| --- | --- |
| Cost | Free |
| Auth | OAuth 2.0 (user consent) or Service Account (server-to-server) |
| Base URL | `https://searchconsole.googleapis.com/v1/` |
| Integration priority | **P0 — Ship first** (free, broad adoption) |

**Key endpoints:**

| Endpoint | Purpose |
| --- | --- |
| `searchAnalytics.query` | Clicks, impressions, CTR, position (up to 16 months, 25,000 rows/request) |
| `urlInspection.index.inspect` | Index status, crawl info, mobile usability |
| `sitemaps.submit / delete` | Sitemap management |

**Rate limits:** 1,200 queries/min per site · 2,000 URL inspections/day

**npm:** `@googleapis/searchconsole` (standalone, lighter than full `googleapis`)

**Auth scope:** `webmasters.readonly` for read access, `webmasters` for read/write

---

### Semrush API

| Detail | Value |
| --- | --- |
| Cost | Business plan ($499.95/mo) — user's own subscription |
| Auth | API key as query parameter |
| Base URL | `https://api.semrush.com/` |
| Integration priority | **P1 — Ship second** (most popular paid SEO tool) |

**Key report types:**

| Report | Description | Units/Row |
| --- | --- | --- |
| `domain_organic` | Organic keyword positions | 10 |
| `phrase_all` | Keyword volume, CPC, competition | 10 |
| `phrase_related` | Related keyword suggestions | 40 |
| `keyword_difficulty` | Keyword difficulty score | 50 |
| `backlinks_overview` | Backlink profile summary | 20 |

**Rate limits:** 10 req/sec · 50,000 API units/month (Business plan)

**Response format:** Semicolon-separated CSV (not JSON). Parse manually.

**Implementation:** Build a thin wrapper in `@power-seo/integrations` — no community package. The API is simple HTTP GET + CSV parsing.

---

### Ahrefs API v3

| Detail | Value |
| --- | --- |
| Cost | Enterprise plan ($1,499/mo) — user's own subscription |
| Auth | `Authorization: Bearer YOUR_TOKEN` |
| Base URL | `https://api.ahrefs.com/v3/` |
| Integration priority | **P2 — Ship third** (high cost limits adoption) |

**Key endpoints:**

| Resource | Endpoint | Description |
| --- | --- | --- |
| Site Explorer | `GET /v3/site-explorer/overview` | DR, organic traffic, backlinks |
| Site Explorer | `GET /v3/site-explorer/organic-keywords` | Ranking keywords |
| Keywords Explorer | `GET /v3/keywords-explorer/overview` | Volume, KD, CPC |
| Keywords Explorer | `GET /v3/keywords-explorer/keyword-ideas` | Related keyword suggestions |
| Batch Analysis | `POST /v3/site-explorer/overview/batch` | Up to 200 targets |

**Rate limits:** 500,000 rows/month (Enterprise) · throttled server-side

**Implementation:** Build a typed HTTP client using `fetch` — no official SDK exists. Use exponential backoff for rate limiting. Cache responses aggressively (data updates ~daily).

### Integration Summary

| API | Plan Required | Our Role | Available In |
| --- | --- | --- | --- |
| Google Search Console | Free | Full integration | All plans |
| Semrush | User's Business plan ($499/mo) | Thin proxy/wrapper | Business+ (user key) |
| Ahrefs | User's Enterprise plan ($1,499/mo) | Thin proxy/wrapper | Agency (user key) |

> **Policy:** power-seo never stores or proxies third-party API keys. Users provide their own keys at runtime. Graceful degradation when APIs fail.

---

## 9. Versioning Policy

| Version Range | Policy |
| --- | --- |
| v1.0.0 – v1.2.x | 100% free, no paid features — foundation & trust |
| v1.3.x | AI credit system launched; Free + Starter + Pro plans go live |
| v1.4.x | Business plan; image AI; tracking & analytics AI |
| v1.5.x | Agency plan; advanced AI; third-party data integrations |
| v1.6.x | Bulk operations & automation |
| v1.7.x – v1.8.x | Cloud & SaaS platform |
| v2.x | Mature monetization, enterprise, white-label |

**Locked rule:** No free feature is ever removed or degraded.

---

## 10. Pricing Plans

Five tiers. All npm package core features remain free forever. Plans gate depth, scale, and AI usage.

| | **Free** | **Starter** | **Pro** | **Business** | **Agency** |
| --- | --- | --- | --- | --- | --- |
| **Monthly price** | $0 | $9 | $24 | $49 | $99 |
| **Annual price** | $0 | $84/yr ($7/mo) | $228/yr ($19/mo) | $468/yr ($39/mo) | $948/yr ($79/mo) |
| **Annual saving** | — | Save $24 | Save $60 | Save $120 | Save $240 |
| **Focus keywords** | 1 | 3 | 5 | 10 | Unlimited |
| **Dynamic img convert/mo** | 0 (manual only) | 50 | 200 | 1,000 | 5,000 |
| **AI text credits/mo** | 100 | 600 | 1,500 | 3,500 | 10,000 |
| **AI image gen credits/mo** | 0 | 5 | 15 | 50 | 150 |
| **Sites** | 1 | 1 | 3 | 10 | Unlimited |
| **Credit rollover** | No | No | 1 month | 2 months | 3 months |
| **AI provider** | CCBD only | CCBD + own key | All providers | All providers | All providers |
| **Support** | Community | Email | Priority email | Email + chat | Dedicated |

---

## 11. AI Credit System

### Text Credits

All AI text functions across all 17 packages draw from a **single unified credit pool**. Credits are included monthly with each plan and can be purchased separately at any time.

**1 credit ≈ 1,000 AI tokens** (combined input + output, GPT‑4o‑mini default)

| Operation | Package | Credits | User cost |
| --- | --- | --- | --- |
| Meta title generation (5 variants) | `meta` | 2 | $0.02 |
| Meta description generation | `meta` | 3 | $0.03 |
| Content analysis AI feedback | `content-analysis` | 8 | $0.08 |
| Readability AI suggestions | `readability` | 6 | $0.06 |
| AI link suggestions | `links` | 7 | $0.07 |
| AI tracking insight | `tracking` | 10 | $0.10 |
| AI analytics opportunity report | `analytics` | 12 | $0.12 |
| Image alt text rewrite (per image) | `images` | 1 | $0.01 |
| Content writing (per 500 words) | `ai` | 10 | $0.10 |

### Text Credit Top-Up Packs (Any Plan, Any Time)

| Pack | Credits | Price | Per 1K credits | Discount |
| --- | --- | --- | --- | --- |
| Mini | 500 | $5 | $10.00 | — |
| Standard | 2,000 | $15 | $7.50 | 25% |
| Pro | 5,000 | $30 | $6.00 | 40% |
| Bulk | 20,000 | $100 | $5.00 | 50% |

> Top-up credits **never expire**. Monthly plan credits reset each billing cycle.

### Image Generation Credits (Separate Pool)

Image generation uses a distinct pool due to higher unit cost (DALL-E 3: $0.040/image).

**1 image credit = 1 generated image (standard 1024×1024, DALL-E 3)**

| Pack | Credits | Price | Per credit | Discount |
| --- | --- | --- | --- | --- |
| Basic | 10 | $3 | $0.30 | — |
| Standard | 50 | $12 | $0.24 | 20% |
| Pro | 200 | $40 | $0.20 | 33% |

### What 100 Free Credits Gets You

| Use case | Operations |
| --- | --- |
| Meta titles only | ~50 title sets |
| Meta descriptions only | ~33 descriptions |
| Content AI analysis only | ~12 full analyses |
| Mixed typical usage | ~15–20 AI operations |

### AI Provider Routing

| Provider | Plans | Notes |
| --- | --- | --- |
| CCBD AI (GPT-4o-mini) | All plans (default) | Cheapest, good quality for SEO |
| User's OpenAI key | Starter+ | User pays their own API costs |
| User's Anthropic key | Starter+ | User pays their own API costs |
| User's Gemini key | Starter+ | User pays their own API costs |
| DALL-E 3 (image gen) | Starter+ | Proxied via CCBD for image credits |

---

## 12. Package Feature Matrix

| Package | Free | Starter | Pro | Business | Agency |
| --- | --- | --- | --- | --- | --- |
| `core` | All features | All | All | All | All |
| `content-analysis` | 1 keyword, all 13 checks | 3 keywords | 5 keywords | 10 keywords | Unlimited |
| `readability` | All checks + scores | + AI rewrite suggestions | + AI tone analysis | + AI tone analysis | + AI tone analysis |
| `meta` | Validation & scoring | + AI title & description gen | + AI OG/Twitter card gen | + AI OG/Twitter card gen | + AI OG/Twitter card gen |
| `schema` | All 19 schema builders | All | All | All | All |
| `preview` | SERP & OG preview render | All | All | All | All |
| `images` | Alt/format/lazy audit + manual convert | + 50 dynamic converts/mo | + 200 dynamic converts/mo | + 1,000 converts/mo + AI alt rewrite | + 5,000 converts/mo + AI image gen |
| `audit` | Full deterministic audit | All | All | All | All |
| `links` | Graph, equity, orphan, keyword suggestions | + AI contextual suggestions | + AI anchor text optimization | + AI anchor text optimization | + AI anchor text optimization |
| `sitemap` | Full sitemap generation | All | All | All | All |
| `redirects` | Full redirect management | All | All | All | All |
| `analytics` | Dashboard, rankings, trends, GSC correlation | + AI opportunity report | + AI ROI prediction | + AI bulk recommendations | + AI bulk recommendations |
| `tracking` | Consent, scripts, platform clients | + AI anomaly detection | + AI traffic insights | + AI conversion recommendations | + AI conversion recommendations |
| `search-console` | Full GSC API client | All | All | All | All |
| `integrations` | Framework integrations | All | All | + Semrush (user key) | + Semrush + Ahrefs (user key) |
| `react` | All React components | All | All | All | All |
| `ai` | SERP eligibility (rule-based), prompt builders | + Full AI text generation | + All providers | + Bulk AI generation | + Bulk AI generation |

---

## 13. Cost & Profitability

### AI API Costs (What We Pay)

| Provider | Input / 1M tokens | Output / 1M tokens |
| --- | --- | --- |
| GPT-4o-mini (default) | $0.15 | $0.60 |
| Claude Haiku 4.5 | $1.00 | $5.00 |
| DALL-E 3 (image gen) | $0.040 / image | — |

### Actual Cost Per Text Operation (GPT-4o-mini)

| Operation | Tokens | Our AI cost |
| --- | --- | --- |
| Meta title generation | ~550 | $0.000165 |
| Meta description | ~700 | $0.000195 |
| Content analysis AI | ~2,100 | $0.000585 |
| Readability AI | ~1,700 | $0.000465 |
| Link suggestions | ~1,700 | $0.000465 |
| Tracking insight | ~2,800 | $0.000720 |
| Analytics report | ~3,300 | $0.000855 |
| Image alt rewrite (per image) | ~400 | $0.000105 |
| Content writing 500w | ~1,350 | $0.000405 |
| **Weighted average** | | **~$0.0005** |

### Infrastructure Monthly Costs

| Item | Early (0–500 users) | Growth (500–2,000 users) |
| --- | --- | --- |
| Cloud hosting (API servers) | $150 | $600 |
| Database (PostgreSQL) | $75 | $200 |
| Redis (cache + rate limiting) | $40 | $100 |
| CDN / bandwidth | $50 | $150 |
| Error monitoring | $40 | $60 |
| Email service | $20 | $40 |
| Misc (domain, SSL, CI/CD) | $25 | $50 |
| **Infrastructure subtotal** | **~$400/mo** | **~$1,200/mo** |
| Dev & maintenance (time cost) | ~$2,300/mo | ~$4,200/mo |
| **Total fixed cost** | **~$2,700/mo** | **~$5,400/mo** |

### Gross Margins

| Revenue stream | Gross margin |
| --- | --- |
| Text credits (AI) | ~94% |
| Image gen credits | ~82% |
| Subscriptions | ~90%+ (fixed cost leverage) |

### Revenue Projections

| Scenario | Paying users | MRR | Costs | Net Profit | Margin |
| --- | --- | --- | --- | --- | --- |
| Early | 300 | ~$9,150 | ~$2,950 | ~$6,200 | ~68% |
| Growth | 1,000 | ~$32,000 | ~$6,200 | ~$25,800 | ~81% |

**Break-even:** ~350 paying users at early-stage cost base.

### Competitive Pricing Comparison

| Tool | Entry price | AI included | Audience |
| --- | --- | --- | --- |
| Yoast Premium | $99/yr ($8.25/mo) | Limited | WordPress only |
| Rank Math Pro | $59/yr ($5/mo) | Limited | WordPress only |
| Surfer SEO | $99/mo | 5 AI articles | Content writers |
| Clearscope | $170/mo | No | Enterprise content |
| MarketMuse | $99/mo | 5 briefs | Content strategy |
| **power-seo Starter** | **$9/mo** | 600 credits | React / JS developers |
| **power-seo Pro** | **$24/mo** | 1,500 credits | React / JS developers |
| **power-seo Business** | **$49/mo** | 3,500 credits | Multi-site developers |
| **power-seo Agency** | **$99/mo** | 10,000 credits | Agencies + SaaS builders |

power-seo is **4–7× cheaper** than comparable AI SEO tools, is a library not a locked SaaS, and is the only solution built for the React/JS ecosystem.

---

## 14. Completed Milestones

All development phases through v1.0.0 are complete:

```
Phase 0 → Monorepo foundation, CI, docs infrastructure     ✅ Done
Phase 1 → content-analysis + preview                       ✅ Done
Phase 2 → readability + sitemap                            ✅ Done
Phase 3 → redirects + links + audit                        ✅ Done
Phase 4 → images + ai + analytics                          ✅ Done
Phase 5 → search-console + integrations + tracking         ✅ Done
Phase 6 → meta + docs site + examples + v1.0.0 release     ✅ Done
```

---

## 15. Phase 1 — Foundation & Trust (v1.0.0 – v1.2.x) ✅ Current

**Goal:** Become the default SEO toolkit for React.

### What ships

- All 17 `@power-seo/*` packages published to npm
- Deterministic SEO analysis (no AI dependency)
- Content analysis with single focus keyword
- Readability scoring (Flesch, Flesch-Kincaid, Gunning Fog, Coleman-Liau)
- SERP / OG / Twitter Card previews
- 19-type JSON-LD schema builders
- Audits (meta, content, structure, performance rules)
- Links, images (suggestions + manual), sitemaps, redirects
- `@power-seo/ai` with rule-based SERP eligibility and prompt builders (free)
- Community building, bug fixes, API refinements

### Packages released

`core` · `content-analysis` · `readability` · `meta` · `schema` · `preview` · `audit` · `links` · `images` · `sitemap` · `redirects` · `analytics` · `tracking` · `search-console` · `integrations` · `react` · `ai`

### Monetization

- ❌ None

### Why this matters

- Builds credibility and npm adoption
- Encourages community contribution
- Positions power-seo as *infrastructure*, not a product

---

## 16. Phase 2 — AI Launch + First Plans (v1.3.x)

**Goal:** Introduce AI with a clear credit system. Launch Starter and Pro plans.

### What ships

- **AI credit system** infrastructure (credit API, license key validation, provider router)
- `@power-seo/content-analysis`: `focusKeyphrase: string` → `focusKeyphrases: string[]` — backward compatible, plan-gated limit
- `@power-seo/images`: dynamic conversion endpoint with monthly quota
- AI functions added to: `meta`, `readability`, `links`, `content-analysis`, `ai`
- **Plans launched:** Free (100 credits) · Starter ($9/mo, 600 credits) · Pro ($24/mo, 1,500 credits)
- Free plan receives 100 AI text credits/month (enough to genuinely try all AI features)
- Image generation credits introduced for Starter+

### Monetization

- ✅ Starter plan — $9/mo
- ✅ Pro plan — $24/mo
- ✅ Text credit top-up packs (all plans)
- ✅ Image gen credit top-up packs (Starter+)

### Trust safeguard

- All existing single-keyword, suggestion-only, deterministic features remain 100% free
- No existing API is removed or changed — only new parameters added
- Free credits ensure no "paywall shock"

---

## 17. Phase 3 — Business Plan + Image AI (v1.4.x)

**Goal:** Serve growing businesses and developers managing multiple sites.

### What ships

- **Business plan launched** ($49/mo — 10 keywords, 1,000 dynamic img converts, 3,500 text credits, 50 img gen credits)
- AI alt text rewriting for images (`images` package, consumes image gen credits)
- AI-powered tracking insights (`tracking` package, consumes text credits)
- AI analytics opportunity reports (`analytics` package, consumes text credits)
- Semrush integration via user-provided API key (`integrations` package, Business+)

### Monetization

- ✅ Business plan — $49/mo
- ✅ Image gen credit pool fully active

### Why this works

- Business plan targets developers managing multiple client sites
- Image AI is a strong upsell: every site has images needing optimized alt text
- Tracking + analytics AI turns raw data into actionable decisions

---

## 18. Phase 4 — Agency Plan + Advanced AI (v1.5.x)

**Goal:** Serve agencies, SaaS builders, and power users embedding power-seo into products.

### What ships

- **Agency plan launched** ($99/mo — unlimited keywords, 5,000 dynamic img converts, 10,000 text credits, 150 img gen credits)
- AI image generation (`images` package, DALL-E 3, consumes image gen credits)
- AI ROI directional prediction (`analytics` package)
- Ahrefs integration via user-provided API key (`integrations` package, Agency only)
- All AI providers available (OpenAI, Anthropic, Gemini via user-supplied keys)
- Advanced AI anchor text optimization (`links` package)

### Monetization

- ✅ Agency plan — $99/mo
- ✅ Bulk credit top-up packs (20,000 credits for $100)

### Trust safeguard

- AI ROI output restricted to directional ranges only (e.g. +10–20% CTR)
- Mandatory disclaimer on all AI predictions: *Estimates, not guarantees*
- Deterministic SEO logic always visible alongside AI suggestions

---

## 19. Phase 5 — Bulk Operations & Automation (v1.6.x)

**Goal:** Monetize high-volume agencies and SaaS platforms.

### What ships

| Feature | Monetization |
| --- | --- |
| Bulk AI content generation | Text credit-based |
| Bulk image alt text rewriting | Image credit-based |
| Bulk optimization suggestions | Subscription + credits |
| Scheduled AI audits | Cloud-only (Phase 6 preview) |
| Multi-site batch processing | Agency plan |

### Credit rollover improvements

- Business: 2-month rollover for unused credits
- Agency: 3-month rollover for unused credits

---

## 20. Phase 6 — Cloud & SaaS (v1.7.x – v1.8.x)

**Goal:** Establish the main recurring revenue engine beyond npm subscriptions.

### power-seo Cloud (Paid, Separate Product)

- AI-powered SEO dashboard
- Historical SEO data & trend tracking
- Site-wide audit scheduling & monitoring
- Alerts (ranking drops, audit regressions)
- Team collaboration & role management
- White-label option (Agency plan)

### AI Providers in Cloud

- Default: CCBD AI (GPT-4o-mini)
- Advanced: User choice — ChatGPT / Gemini / Claude
- Image generation: DALL-E 3 (standard), with HD option

### Credit Interoperability

- All credits (text + image gen) work across both npm packages and the Cloud dashboard
- Single credit pool per account, regardless of usage surface

---

## 21. Phase 7 — Maturity (v2.x)

**Goal:** Enterprise readiness without OSS compromise.

### Paid Enhancements

- Advanced ROI modeling (directional estimates only, never guarantees)
- White-label dashboards
- Enterprise SLA with guaranteed uptime
- Custom AI model routing (bring your own fine-tuned model)
- Priority credit processing

### Still Free Forever

- All 17 `@power-seo/*` npm packages
- All deterministic SEO logic
- Single-keyword analysis
- Image audit & manual workflows
- All React components

---

## 22. Future Package Candidates

| Package | Purpose | Priority |
| --- | --- | --- |
| `@power-seo/local` | Local SEO — Google Business Profile schema, NAP consistency | Medium |
| `@power-seo/ecommerce` | E-commerce SEO — Product enrichment, faceted navigation | Medium |
| `@power-seo/i18n` | Multilingual SEO — Hreflang graph validation, locale-aware sitemaps | Low |

---

## 23. Strategic Opportunities

| Opportunity | Details |
| --- | --- |
| **"Tailwind of SEO"** | Utility-first, composable, developer-loved — same positioning as Tailwind CSS |
| **Integration partnerships** | Official Vercel / Netlify marketplace listings |
| **CMS partnerships** | Contentful, Sanity, Strapi integrations |
| **Educational content** | SEO courses using @power-seo as the teaching toolkit |
| **Enterprise consulting** | Custom SEO implementation for large React applications |

### Market Sizing

- React ecosystem: 20M+ weekly downloads for `react`
- Target: Next.js, Remix, Astro developers building content sites, e-commerce, SaaS
- Comparison: Yoast serves 12M+ WordPress sites — React ecosystem is entirely underserved

---

## 24. Security & Compliance

### OWASP Top 10

| Risk | Mitigation |
| --- | --- |
| XSS | JSON-LD uses `JSON.stringify()` (auto-escaped); `dangerouslySetInnerHTML` only with sanitized builder output |
| Injection | URL utilities use `globalThis.URL` parser — no string concatenation for URLs |
| SSRF | API clients accept user-provided credentials at runtime; no default proxy |
| Sensitive data exposure | No credentials stored; all API clients accept tokens at runtime only |

### GDPR Compliance

- `@power-seo/tracking` includes `createConsentManager()` with cookie categories: `necessary`, `analytics`, `marketing`, `preferences`
- `necessary` category cannot be revoked
- All script builders accept a `shouldLoad(consent)` callback — scripts only load when consent is granted
- `ConsentBanner` React component provides accept/reject all functionality
- No data collection by the library itself

### ISO 25010 Quality Attributes

| Attribute | Implementation |
| --- | --- |
| Functional Suitability | 17 packages covering all SEO capabilities |
| Performance Efficiency | Tree-shakeable, zero runtime dependencies in core |
| Compatibility | Dual ESM/CJS, Node 18/20/22, React 18+ |
| Usability | TypeScript IntelliSense, comprehensive docs, examples |
| Reliability | 500+ tests, CI matrix on 3 Node versions |
| Security | OWASP-aware, GDPR consent management |
| Maintainability | Modular monorepo, consistent patterns |
| Portability | Framework-agnostic core, framework adapters separate |

### Dependency Policy

- Zero runtime dependencies in most packages
- `react` is an optional peer dependency (never bundled)
- No native modules
- Regular dependency audits via `pnpm audit`

---

## 25. Testing Strategy

### Framework

- **Vitest** 2.1+ with workspace configuration
- **jsdom** environment for React component tests
- **node** environment for pure JavaScript packages

### Test Distribution

| Package | Tests | Environment |
| --- | --- | --- |
| content-analysis | 47 | node + jsdom |
| preview | 36 | node + jsdom |
| readability | 28 | node |
| sitemap | 33 | node |
| redirects | 47 | node |
| links | 31 | node |
| audit | 44 | node |
| images | 40 | node |
| ai | 40 | node |
| analytics | 33 | node |
| search-console | 26 | node |
| integrations | 19 | node |
| tracking | 38 | node + jsdom |
| meta | 28 | node |
| **Total** | **500+** | |

### Testing Patterns

- Unit tests for all public API functions
- Integration tests for cross-package dependencies (audit uses content-analysis + readability)
- React component tests using `@testing-library/react` with jsdom
- Edge case coverage: empty inputs, boundary values, malformed data
- Known jsdom limitation: `<script>` elements are stripped — test script renderers via container element existence, not `querySelector('script')`

---

## 26. CI/CD Pipeline

### GitHub Actions Workflows

**CI (Pull Requests + Push to main):**

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
steps:
  - pnpm install (with cache)
  - pnpm build
  - pnpm lint
  - pnpm typecheck
  - pnpm test
```

**Release (Merge to main):**

```yaml
steps:
  - pnpm install
  - pnpm build
  - pnpm publish --access public --provenance --no-git-checks   ← uses pnpm, not npm
  - Create GitHub release + tag
```

**Note:** Always use `pnpm publish` (not `npm publish`) so `workspace:*` dependencies are automatically resolved to real version numbers before hitting the npm registry.

**Docs (Push to main):**

```yaml
steps:
  - Build Starlight docs
  - Deploy to GitHub Pages
```

### Quality Gates

| Gate | Command | Requirement |
| --- | --- | --- |
| Build | `turbo run build` | Zero errors |
| Lint | `turbo run lint` | Zero errors |
| Types | `turbo run typecheck` | Zero errors |
| Tests | `turbo run test` | All passing |
| Format | `prettier --check` | No issues |

---

## 27. Publishing Workflow

### Publication Order (Dependency-Safe)

```
1.  @power-seo/core                 (no dependencies)
2.  @power-seo/react                (depends on core)
3.  @power-seo/schema               (depends on core)
4.  @power-seo/content-analysis     (depends on core)
5.  @power-seo/preview              (depends on core)
6.  @power-seo/readability          (depends on core)
7.  @power-seo/sitemap              (depends on core)
8.  @power-seo/redirects            (depends on core)
9.  @power-seo/links                (depends on core)
10. @power-seo/images               (depends on core)
11. @power-seo/ai                   (depends on core)
12. @power-seo/search-console       (depends on core)
13. @power-seo/integrations         (depends on core)
14. @power-seo/tracking             (depends on core)
15. @power-seo/audit                (depends on core + content-analysis + readability + schema)
16. @power-seo/analytics            (depends on core + audit)
17. @power-seo/meta                 (depends on core)
```

pnpm handles this order automatically with `pnpm -r publish`.

### Ongoing Release Flow (Changesets)

```
Developer makes changes
    ↓
pnpm changeset   (describes what changed: patch / minor / major)
    ↓
PR merged to main
    ↓
Changesets bot creates "Version Packages" PR (bumps versions + changelogs)
    ↓
Maintainer merges version PR
    ↓
GitHub Actions: build → pnpm -r publish → GitHub release + tag
```

### Quick Reference

| Task | Command |
| --- | --- |
| Login to npm | `npm login` |
| Build all packages | `pnpm build` |
| Create a changeset | `pnpm changeset` |
| Version packages | `pnpm version-packages` |
| Publish all packages | `pnpm -r publish --access public --no-git-checks` |
| Publish single package | `cd packages/core && pnpm publish --access public --no-git-checks` |
| Preview package contents | `npm pack --dry-run` |
| Check package on npm | `npm view @power-seo/core` |
| Deprecate a version | `npm deprecate @power-seo/core@1.0.0 "Use 1.0.1 instead"` |

### npm Organization Management

```bash
npm org set power-seo USERNAME developer   # Add team member
npm org rm power-seo USERNAME             # Remove team member
npm org ls power-seo                       # List members
```

**Roles:** `owner` (full admin) · `admin` (manage team + packages) · `developer` (publish only)

**Security:** Never commit npm tokens to git. Use GitHub Secrets for CI/CD. Enable 2FA on npm account. Use Automation token type (bypasses 2FA for CI).

---

## 28. Free vs Paid — Full Feature Summary

| Feature | Free | Starter | Pro | Business | Agency |
| --- | --- | --- | --- | --- | --- |
| All deterministic SEO checks | ✅ | ✅ | ✅ | ✅ | ✅ |
| Readability analysis | ✅ | ✅ | ✅ | ✅ | ✅ |
| Schema builders (19 types) | ✅ | ✅ | ✅ | ✅ | ✅ |
| SERP / OG preview | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sitemap generation | ✅ | ✅ | ✅ | ✅ | ✅ |
| Redirect management | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image audit & suggestions | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image manual convert | ✅ | ✅ | ✅ | ✅ | ✅ |
| Link graph, equity, orphan detection | ✅ | ✅ | ✅ | ✅ | ✅ |
| GSC data fetching | ✅ | ✅ | ✅ | ✅ | ✅ |
| Consent & tracking script management | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard & trend analytics | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1 focus keyword | ✅ | ✅ | ✅ | ✅ | ✅ |
| Up to 3 focus keywords | ❌ | ✅ | ✅ | ✅ | ✅ |
| Up to 5 focus keywords | ❌ | ❌ | ✅ | ✅ | ✅ |
| Up to 10 focus keywords | ❌ | ❌ | ❌ | ✅ | ✅ |
| Unlimited focus keywords | ❌ | ❌ | ❌ | ❌ | ✅ |
| Dynamic image conversion (50/mo) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Dynamic image conversion (200/mo) | ❌ | ❌ | ✅ | ✅ | ✅ |
| Dynamic image conversion (1,000/mo) | ❌ | ❌ | ❌ | ✅ | ✅ |
| Dynamic image conversion (5,000/mo) | ❌ | ❌ | ❌ | ❌ | ✅ |
| AI text credits / mo | 100 | 600 | 1,500 | 3,500 | 10,000 |
| AI image gen credits / mo | 0 | 5 | 15 | 50 | 150 |
| Bring your own AI key | ❌ | ✅ | ✅ | ✅ | ✅ |
| AI meta title & description | Credit | Credit | Credit | Credit | Credit |
| AI content analysis feedback | Credit | Credit | Credit | Credit | Credit |
| AI readability suggestions | Credit | Credit | Credit | Credit | Credit |
| AI link suggestions | Credit | Credit | Credit | Credit | Credit |
| AI tracking insights | Credit | Credit | Credit | Credit | Credit |
| AI analytics reports | Credit | Credit | Credit | Credit | Credit |
| AI image alt text rewriting | ❌ | Credit | Credit | Credit | Credit |
| AI image generation | ❌ | Credit | Credit | Credit | Credit |
| Full content writing | Credit | Credit | Credit | Credit | Credit |
| Semrush integration | ❌ | ❌ | ❌ | User key | User key |
| Ahrefs integration | ❌ | ❌ | ❌ | ❌ | User key |
| Credit rollover | ❌ | ❌ | 1 month | 2 months | 3 months |
| Sites | 1 | 1 | 3 | 10 | Unlimited |
| Support | Community | Email | Priority email | Email + chat | Dedicated |

---

## 29. Risk Analysis

### 1. Open-Source Trust Erosion

**Risk:** Community fears future paywalls or feature removal once paid features arrive.
**Impact:** Loss of contributors, reduced npm adoption, public backlash.
**Mitigation:**
- Public guarantee: **All `@power-seo/*` packages remain free forever**
- Never downgrade or limit existing features
- Clear changelog showing only *additions*, never removals

### 2. AI Over-Claiming (SEO Accuracy Risk)

**Risk:** AI predictions perceived as promises or guarantees.
**Impact:** Legal exposure, loss of professional credibility, user distrust.
**Mitigation:**
- Restrict AI ROI output to directional ranges only (e.g. +10–20%)
- Mandatory disclaimer: *Estimates, not guarantees*
- Deterministic SEO logic always visible alongside AI suggestions

### 3. Aggressive Monetization Too Early

**Risk:** Introducing paid features before community trust is established.
**Impact:** Poor conversion, negative sentiment, project abandonment.
**Mitigation:**
- Delay paid rollout until trust signals exist (1,000+ installs, 50+ issues)
- Conservative rollout: 1–2 paid features per minor version

### 4. AI Cost Overrun

**Risk:** Uncontrolled AI usage causing infrastructure losses.
**Impact:** Negative margins, forced price increases, service instability.
**Mitigation:**
- Credit-based AI usage — users consume what they buy
- Hard per-request rate limits and daily caps enforced server-side
- Credits refunded only on confirmed provider failure

### 5. Vendor Lock-In (AI Providers)

**Risk:** Dependency on a single LLM provider (pricing or policy changes).
**Impact:** Cost spikes, feature disruption.
**Mitigation:**
- Default: CCBD AI (GPT-4o-mini) — cheapest, good quality
- Optional: User's own key for any provider (OpenAI, Anthropic, Gemini)
- Abstracted AI adapter layer in `@power-seo/ai` — swap providers without API changes

### 6. API Dependency Risk (Semrush / Ahrefs)

**Risk:** Third-party API changes, pricing increases, or access limits.
**Impact:** Feature outages, unexpected costs.
**Mitigation:**
- **User-provided API keys only** — power-seo never holds third-party keys
- Graceful degradation when APIs fail
- Feature documented as requiring user's own Semrush/Ahrefs subscription

### 7. Cloud vs OSS Boundary Confusion

**Risk:** Users confuse free npm libraries with paid cloud services.
**Impact:** Support burden, reputation damage.
**Mitigation:**
- Clear separation in all documentation:
  - **npm packages = free forever**
  - **AI credits = pay per use**
  - **Plans = depth + scale + credit allocation**
  - **Cloud dashboard = separate paid product (Phase 6)**

### 8. Community Fragmentation

**Risk:** Forks claiming to be "more open".
**Impact:** Split ecosystem, reduced influence.
**Mitigation:**
- Transparent governance
- Welcoming contribution model
- No hostile licensing — core logic always open

### 9. Security & Data Privacy Risk (Cloud)

**Risk:** Handling SEO, analytics, and AI data introduces privacy concerns.
**Impact:** Legal exposure, loss of enterprise trust.
**Mitigation:**
- Minimal data retention — no content stored beyond the API request lifecycle
- User data never used to train models
- Opt-in analytics only

### 10. Credit System Abuse

**Risk:** Users share API keys, exploit free credits, or abuse trial credits.
**Impact:** Negative margins, unfair to paying users.
**Mitigation:**
- API keys scoped to a single account (server-validated)
- Free tier: 100 credits/month with no rollover
- Rate limiting per key: max 10 AI requests/minute
- Anomaly detection on unusually high usage patterns

### Final Risk Principle

> **Short-term revenue must never compromise long-term trust.**
> If a monetization decision threatens reputation, it must be delayed or redesigned.

---

## 30. Reputation Protection Rules (Never Break)

- No retroactive paywalls — no existing free feature is ever removed or degraded
- No forced AI — all deterministic features work without an API key or plan
- No "best SEO ever" marketing — all AI outputs are clearly marked as assistive
- Transparent pricing — all plan limits and credit costs publicly documented
- Clear version changelogs — additions only, never removals

---

## 31. Instructions for Claude

When implementing paid systems for this project:

- Always prefer conservative defaults
- Assume public scrutiny on every feature decision
- Optimize for sustainability over speed
- All npm package functions must work without an API key for their deterministic features
- AI functions must return a clear, user-friendly error when no API key or insufficient credits are present — never a silent failure
- The `PlanContext` object (`apiKey`, `tier`, `maxKeywords`, `imageQuota`, `credits`) is always optional — omitting it falls back to free-tier behaviour
- Credit deduction must be atomic — deduct only after a successful AI response, never on failure
- Never hardcode credit costs in individual packages — costs are defined centrally in `@power-seo/ai`
- Never use `npm publish` in CI/CD — always use `pnpm publish` so `workspace:*` dependencies resolve correctly
- When adding AI features to a package, the non-AI (deterministic) path must always remain functional without any API key

---

*Last updated: 2026-02-24 — Consolidates: Business Model Roadmap, Final Development Plan, API Research, SEO Plugin Analysis, Publishing Guide.*
