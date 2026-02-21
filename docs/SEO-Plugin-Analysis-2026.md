# SEO Plugin Analysis 2026

Research reference for the `@power-seo/*` monorepo. Covers the WordPress SEO plugin landscape, React ecosystem gaps, and how this project addresses them.

---

## WordPress SEO Plugin Comparison

| Feature               | Yoast SEO               | Rank Math          | AIOSEO            | SEOPress  | Squirrly          |
| --------------------- | ----------------------- | ------------------ | ----------------- | --------- | ----------------- |
| **Price (Pro)**       | $99/yr                  | $59/yr             | $49.60/yr         | $49/yr    | $29.99/mo         |
| **Content Analysis**  | Real-time scoring       | Real-time scoring  | TruSEO scoring    | Basic     | AI-assisted       |
| **Readability**       | Flesch-Kincaid + custom | Basic readability  | Readability score | None      | Readability check |
| **Schema/JSON-LD**    | 14+ types (Pro)         | 20+ types (free)   | 17+ types         | 18+ types | Limited           |
| **XML Sitemaps**      | Yes                     | Yes                | Yes               | Yes       | Yes               |
| **Redirects**         | Premium only            | Free (basic)       | Pro only          | Free      | Pro only          |
| **Breadcrumbs**       | Yes                     | Yes                | Yes               | Yes       | No                |
| **Social Previews**   | Yes                     | Yes                | Yes               | Yes       | Yes               |
| **Search Console**    | Yes                     | Yes                | Yes               | Yes       | Yes               |
| **Local SEO**         | Addon ($79)             | Free module        | Addon             | Pro       | No                |
| **WooCommerce SEO**   | Addon ($79)             | Free module        | Addon             | Pro       | No                |
| **Keyword Tracking**  | No                      | Rank Tracker (Pro) | No                | No        | Yes (built-in)    |
| **Internal Linking**  | Premium only            | Free suggestions   | Pro only          | Pro       | Audit only        |
| **Bulk Editing**      | Limited                 | Yes                | Yes               | Yes       | No                |
| **Role-Based Access** | Yes                     | Yes                | Yes               | Yes       | No                |

**Key takeaway:** WordPress developers have five mature, full-featured SEO suites. React/Next.js developers have nothing comparable -- just scattered single-purpose libraries.

---

## React/JS Ecosystem: Current State by Category

### Meta Tag Management

| Package                    | Weekly Downloads | Notes                     |
| -------------------------- | ---------------- | ------------------------- |
| `react-helmet`             | ~1.5M            | Unmaintained since 2020   |
| `react-helmet-async`       | ~2.5M            | Maintained fork, SSR-safe |
| `next/head` (built-in)     | N/A              | Next.js only              |
| `next/metadata` (built-in) | N/A              | Next.js App Router only   |

### XML Sitemaps

| Package                | Weekly Downloads | Notes                       |
| ---------------------- | ---------------- | --------------------------- |
| `next-sitemap`         | ~350K            | Next.js specific            |
| `sitemap`              | ~250K            | Generic Node.js XML builder |
| `react-router-sitemap` | ~5K              | React Router only, stale    |

### JSON-LD / Structured Data

| Package           | Weekly Downloads | Notes                               |
| ----------------- | ---------------- | ----------------------------------- |
| `schema-dts`      | ~80K             | TypeScript types only, no rendering |
| `next-seo`        | ~200K            | JSON-LD components for Next.js      |
| `react-schemaorg` | ~8K              | Thin wrapper, limited types         |

### Content Analysis

| Package          | Weekly Downloads | Notes                                  |
| ---------------- | ---------------- | -------------------------------------- |
| `yoastseo`       | ~15K             | Yoast's analysis engine (extracted)    |
| _(nothing else)_ | --               | No React-native content analysis tools |

### Readability Scoring

| Package                       | Weekly Downloads | Notes                          |
| ----------------------------- | ---------------- | ------------------------------ |
| `text-readability`            | ~3K              | Flesch-Kincaid, basic          |
| `automated-readability-index` | <1K              | Single algorithm               |
| _(no React integration)_      | --               | No component-level readability |

---

## Gaps in the React Ecosystem

These are the capabilities that WordPress SEO plugins provide out of the box but have **zero equivalent** in the React/Next.js ecosystem:

| Capability                          | WordPress (Yoast/Rank Math)   | React/Next.js Ecosystem                         |
| ----------------------------------- | ----------------------------- | ----------------------------------------------- |
| **Real-time content analysis**      | Built-in editor panel         | Nothing (yoastseo pkg is WordPress-coupled)     |
| **Readability scoring in UI**       | Live Flesch-Kincaid in editor | Zero -- raw algorithms exist, no UI integration |
| **SERP preview components**         | Google/social preview panels  | Zero -- no reusable preview components          |
| **Redirect manager**                | GUI-based 301/302/410 manager | Zero -- manual server config or middleware      |
| **SEO audit/scoring dashboard**     | Built-in site health checks   | Zero -- must use external tools                 |
| **Internal link suggestions**       | Automated suggestions         | Zero                                            |
| **Keyword density/focus keyphrase** | Real-time tracking            | Zero                                            |
| **Breadcrumb components**           | PHP template tags             | Zero -- no SEO-aware breadcrumb components      |
| **Search Console integration**      | Embedded dashboard            | Zero -- must build from scratch                 |
| **Bulk meta editing**               | WP admin table UI             | Zero                                            |
| **Schema/JSON-LD validation**       | Auto-generated + tested       | Partial -- `next-seo` covers basics             |
| **Canonical URL management**        | Automatic with overrides      | Manual only                                     |

---

## How @power-seo/\* Fills These Gaps

The `@power-seo/*` monorepo provides a WordPress-grade SEO toolkit for React/Next.js applications, organized as focused packages:

| Package                       | Gap Addressed                                                            | WordPress Equivalent            |
| ----------------------------- | ------------------------------------------------------------------------ | ------------------------------- |
| `@power-seo/content-analysis` | Real-time content scoring, keyword density, focus keyphrase tracking     | Yoast content analysis panel    |
| `@power-seo/readability`      | Flesch-Kincaid, Gunning Fog, SMOG, ARI -- with React hooks               | Yoast readability tab           |
| `@power-seo/preview`          | Google SERP preview, Open Graph preview, Twitter Card preview components | Yoast/Rank Math social previews |
| `@power-seo/redirects`        | Programmatic redirect manager with 301/302/307/410 support               | Rank Math redirect manager      |
| `@power-seo/schema`           | Type-safe JSON-LD generation with validation for 20+ schema types        | Rank Math schema builder        |
| `@power-seo/sitemap`          | Framework-agnostic XML/HTML sitemap generation with streaming            | Yoast XML sitemaps              |
| `@power-seo/breadcrumbs`      | SEO-optimized breadcrumb components with JSON-LD                         | Yoast breadcrumbs               |
| `@power-seo/audit`            | Page-level and site-level SEO scoring dashboard                          | Yoast/AIOSEO site health        |
| `@power-seo/search-console`   | Google Search Console API integration with React hooks                   | Rank Math analytics             |
| `@power-seo/meta`             | Unified meta tag management with SSR support                             | Core meta tag handling          |
| `@power-seo/links`            | Internal link analysis and suggestions                                   | Yoast internal linking          |

### Design Principles

- **Framework-agnostic core:** Analysis engines work in any JS runtime. React bindings are separate.
- **Tree-shakeable:** Import only what you need. No 200KB bundle for a single feature.
- **TypeScript-first:** Full type safety across all packages.
- **SSR-compatible:** Every component works with Next.js App Router, Pages Router, and Remix.
- **Monorepo with shared tooling:** Consistent build, test, and publish pipeline via Turborepo.

---

_Last updated: 2026-02-06_
