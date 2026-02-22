<div align="center">
  <img src="./image/banner.svg" alt="@power-seo — Production-Grade SEO Toolkit for TypeScript, React & Node.js" width="100%" />
</div>

[![CI](https://github.com/CyberCraftBD/power-seo/actions/workflows/production.yml/badge.svg)](https://github.com/CyberCraftBD/power-seo/actions/workflows/production.yml)
[![npm version](https://img.shields.io/npm/v/@power-seo/core?label=version)](https://www.npmjs.com/org/power-seo)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/core)](https://www.npmjs.com/package/@power-seo/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

`@power-seo` is a monorepo of 17 modular, TypeScript-first SEO packages for React and its frameworks. Each package is independently installable — install only what your project needs. Dual ESM + CJS output, fully tree-shakeable, zero compromise on type safety.

## Features

- **17 independent packages** — install only what you need, no monolithic bundle
- **Next.js App Router native** — `createMetadata()` returns a proper `Metadata` object
- **Remix v2 native** — `createMetaDescriptors()` returns `MetaDescriptor[]`
- **Robots directive builder** — full support for noindex, nofollow, max-snippet, max-image-preview, unavailable_after
- **JSON-LD structured data** — 20 schema.org types with typed builders and React components
- **Yoast-style content analysis** — score titles, descriptions, keyphrases, headings, word count, images, links
- **Readability scoring** — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI algorithms
- **SERP & social previews** — pixel-accurate Google, Facebook, and Twitter/X card previews
- **XML sitemaps** — generate, stream, validate, and split large sitemaps (50,000+ URLs)
- **Redirect engine** — 301/302 with glob/regex patterns + Next.js/Remix/Express adapters
- **Full SEO audit** — 0–100 scores across meta, content, structure, performance categories
- **Image SEO** — alt text, lazy loading (CWV-aware), WebP/AVIF recommendations, image sitemaps
- **Link graph analysis** — orphan page detection, link suggestions, PageRank-style equity scoring
- **AI-assisted SEO** — LLM-agnostic prompts for meta descriptions, titles, content suggestions (OpenAI, Anthropic, Gemini)
- **Google Search Console API** — OAuth2 + service account auth, analytics queries, URL inspection, sitemap management
- **Semrush & Ahrefs clients** — domain overview, keyword data, backlinks, difficulty scores
- **Analytics tracking** — GA4, Clarity, PostHog, Plausible, Fathom with GDPR consent management
- **TypeScript-first** — full `.d.ts` declarations, no `@types/` package needed
- **Tree-shakeable** — `sideEffects: false` on all packages
- **Dual ESM + CJS** — works in any bundler or Node.js environment

---

## Why @power-seo?

| Feature                                  | @power-seo | next-seo | react-helmet |
| ---------------------------------------- | ---------- | -------- | ------------ |
| Modular — 17 independent packages        | ✅         | ❌       | ❌           |
| TypeScript-first, full `.d.ts`           | ✅         | Partial  | ❌           |
| Next.js App Router native                | ✅         | ✅ v7+   | ❌           |
| Remix v2 native support                  | ✅         | ❌       | ❌           |
| Robots directive builder (full)          | ✅         | Partial  | ❌           |
| JSON-LD structured data (20+ types)      | ✅         | Partial  | ❌           |
| Content analysis (Yoast-style)           | ✅         | ❌       | ❌           |
| Readability scoring                      | ✅         | ❌       | ❌           |
| SERP / OG / Twitter Card previews        | ✅         | ❌       | ❌           |
| XML Sitemap generation + streaming       | ✅         | ❌       | ❌           |
| Redirect engine + framework adapters     | ✅         | ❌       | ❌           |
| Full SEO audit engine (0-100 score)      | ✅         | ❌       | ❌           |
| Image SEO analysis                       | ✅         | ❌       | ❌           |
| Link graph / orphan detection            | ✅         | ❌       | ❌           |
| AI prompt templates (LLM-agnostic)       | ✅         | ❌       | ❌           |
| Google Search Console API client         | ✅         | ❌       | ❌           |
| Semrush + Ahrefs API clients             | ✅         | ❌       | ❌           |
| GA4, Clarity, PostHog, Plausible, Fathom | ✅         | ❌       | ❌           |
| GDPR consent management                  | ✅         | ❌       | ❌           |
| Tree-shakeable (`sideEffects: false`)    | ✅         | Partial  | ❌           |
| Dual ESM + CJS output                    | ✅         | ✅       | ❌           |

---

## Packages

| Package                                                      | Version                                                                                                                       | Description                                                                                   |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [`@power-seo/core`](./packages/core)                         | [![npm](https://img.shields.io/npm/v/@power-seo/core)](https://www.npmjs.com/package/@power-seo/core)                         | Framework-agnostic SEO utilities, types, constants, validators                                |
| [`@power-seo/react`](./packages/react)                       | [![npm](https://img.shields.io/npm/v/@power-seo/react)](https://www.npmjs.com/package/@power-seo/react)                       | React SEO components — SEO, OpenGraph, TwitterCard, Robots, Canonical, Hreflang, Breadcrumb   |
| [`@power-seo/meta`](./packages/meta)                         | [![npm](https://img.shields.io/npm/v/@power-seo/meta)](https://www.npmjs.com/package/@power-seo/meta)                         | SSR meta helpers for Next.js App Router, Remix v2, and generic SSR                            |
| [`@power-seo/schema`](./packages/schema)                     | [![npm](https://img.shields.io/npm/v/@power-seo/schema)](https://www.npmjs.com/package/@power-seo/schema)                     | JSON-LD structured data — 20 builder functions + 18 React components                          |
| [`@power-seo/content-analysis`](./packages/content-analysis) | [![npm](https://img.shields.io/npm/v/@power-seo/content-analysis)](https://www.npmjs.com/package/@power-seo/content-analysis) | Yoast-style content scoring engine with optional React components                             |
| [`@power-seo/preview`](./packages/preview)                   | [![npm](https://img.shields.io/npm/v/@power-seo/preview)](https://www.npmjs.com/package/@power-seo/preview)                   | SERP, Open Graph, and Twitter/X Card preview generators + React components                    |
| [`@power-seo/readability`](./packages/readability)           | [![npm](https://img.shields.io/npm/v/@power-seo/readability)](https://www.npmjs.com/package/@power-seo/readability)           | Readability scoring — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI                          |
| [`@power-seo/sitemap`](./packages/sitemap)                   | [![npm](https://img.shields.io/npm/v/@power-seo/sitemap)](https://www.npmjs.com/package/@power-seo/sitemap)                   | XML sitemap generation, streaming, sitemap index splitting, validation                        |
| [`@power-seo/redirects`](./packages/redirects)               | [![npm](https://img.shields.io/npm/v/@power-seo/redirects)](https://www.npmjs.com/package/@power-seo/redirects)               | Redirect engine — exact, glob, regex matching + Next.js / Remix / Express adapters            |
| [`@power-seo/links`](./packages/links)                       | [![npm](https://img.shields.io/npm/v/@power-seo/links)](https://www.npmjs.com/package/@power-seo/links)                       | Link graph analysis — orphan detection, link suggestions, equity scoring                      |
| [`@power-seo/audit`](./packages/audit)                       | [![npm](https://img.shields.io/npm/v/@power-seo/audit)](https://www.npmjs.com/package/@power-seo/audit)                       | SEO page and site auditing with meta, content, structure, and performance rules               |
| [`@power-seo/images`](./packages/images)                     | [![npm](https://img.shields.io/npm/v/@power-seo/images)](https://www.npmjs.com/package/@power-seo/images)                     | Image SEO — alt text, lazy loading, format optimization, image sitemaps                       |
| [`@power-seo/ai`](./packages/ai)                             | [![npm](https://img.shields.io/npm/v/@power-seo/ai)](https://www.npmjs.com/package/@power-seo/ai)                             | LLM-agnostic prompt builders and response parsers for AI-assisted SEO                         |
| [`@power-seo/analytics`](./packages/analytics)               | [![npm](https://img.shields.io/npm/v/@power-seo/analytics)](https://www.npmjs.com/package/@power-seo/analytics)               | Merge GSC data with audit snapshots — trends, rankings, dashboard builder                     |
| [`@power-seo/search-console`](./packages/search-console)     | [![npm](https://img.shields.io/npm/v/@power-seo/search-console)](https://www.npmjs.com/package/@power-seo/search-console)     | Google Search Console API client — OAuth2, service account, URL inspection, sitemaps          |
| [`@power-seo/integrations`](./packages/integrations)         | [![npm](https://img.shields.io/npm/v/@power-seo/integrations)](https://www.npmjs.com/package/@power-seo/integrations)         | Semrush and Ahrefs API clients with shared HTTP client                                        |
| [`@power-seo/tracking`](./packages/tracking)                 | [![npm](https://img.shields.io/npm/v/@power-seo/tracking)](https://www.npmjs.com/package/@power-seo/tracking)                 | Script builders + API clients — GA4, Clarity, PostHog, Plausible, Fathom + consent management |

---

## Quick Start

### Next.js App Router

```bash
npm install @power-seo/meta @power-seo/schema
```

```ts
// app/blog/[slug]/page.tsx
import { createMetadata } from '@power-seo/meta';
import { article, toJsonLdString } from '@power-seo/schema';

export function generateMetadata({ params }: { params: { slug: string } }) {
  return createMetadata({
    title: 'My Blog Post',
    description: 'A great article about SEO.',
    canonical: `https://example.com/blog/${params.slug}`,
    openGraph: {
      type: 'article',
      images: [{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }],
    },
    robots: { index: true, follow: true, maxSnippet: 150 },
  });
}

export default function Page() {
  const jsonLd = article({
    headline: 'My Blog Post',
    datePublished: '2026-01-15',
    author: { name: 'Jane Doe' },
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdString(jsonLd) }} />
      <article>{/* page content */}</article>
    </>
  );
}
```

### Remix v2

```bash
npm install @power-seo/meta
```

```ts
// app/routes/blog.$slug.tsx
import { createMetaDescriptors } from '@power-seo/meta';

export const meta = () =>
  createMetaDescriptors({
    title: 'My Blog Post',
    description: 'A great article about SEO.',
    canonical: 'https://example.com/blog/my-post',
    openGraph: { type: 'article', images: [{ url: 'https://example.com/og.jpg' }] },
  });
```

### React Components (CSR/SPA)

```bash
npm install @power-seo/react
```

```tsx
import {
  DefaultSEO,
  SEO,
  OpenGraph,
  TwitterCard,
  Canonical,
  Hreflang,
  Breadcrumb,
} from '@power-seo/react';

function App() {
  return (
    <>
      <DefaultSEO
        titleTemplate="%s | My Site"
        defaultTitle="My Site"
        openGraph={{ type: 'website' }}
      />
    </>
  );
}

function BlogPage() {
  return (
    <>
      <SEO
        title="My Blog Post"
        description="An article about SEO."
        canonical="https://example.com/blog/my-post"
      />
      <OpenGraph
        title="My Blog Post"
        url="https://example.com/blog/my-post"
        images={[{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }]}
      />
      <TwitterCard cardType="summary_large_image" site="@mysite" title="My Blog Post" />
      <Canonical href="https://example.com/blog/my-post" />
      <Hreflang
        links={[
          { hrefLang: 'en', href: 'https://example.com/blog/my-post' },
          { hrefLang: 'fr', href: 'https://fr.example.com/blog/my-post' },
        ]}
      />
      <Breadcrumb
        items={[
          { name: 'Home', url: 'https://example.com' },
          { name: 'Blog', url: 'https://example.com/blog' },
          { name: 'My Blog Post' },
        ]}
      />
    </>
  );
}
```

### Robots Directives

```bash
npm install @power-seo/react
```

```tsx
import { Robots } from '@power-seo/react';

// Standard indexable page
<Robots index={true} follow={true} />

// Block indexing (staging, admin, private pages)
<Robots index={false} follow={false} />

// Advanced — control snippet length and image preview size
<Robots index={true} follow={true} maxSnippet={150} maxImagePreview="large" maxVideoPreview={-1} />

// Remove from search results after a specific date
<Robots index={true} follow={true} unavailableAfter="2026-12-31" />

// Prevent caching and translation
<Robots index={true} follow={true} noarchive={true} notranslate={true} />
```

**Via `@power-seo/core`** (framework-agnostic):

```ts
import { buildRobotsContent, parseRobotsContent } from '@power-seo/core';

buildRobotsContent({ index: false, follow: true, maxSnippet: 150 });
// → "noindex, follow, max-snippet:150"

parseRobotsContent('noindex, nofollow, noarchive');
// → { index: false, follow: false, noarchive: true }
```

| Directive          | Type                              | Description                                    |
| ------------------ | --------------------------------- | ---------------------------------------------- |
| `index`            | `boolean`                         | `true` → `index`, `false` → `noindex`          |
| `follow`           | `boolean`                         | `true` → `follow`, `false` → `nofollow`        |
| `noarchive`        | `boolean`                         | Prevent cached version in search results       |
| `nosnippet`        | `boolean`                         | Prevent text/video snippet in results          |
| `noimageindex`     | `boolean`                         | Prevent images on this page from being indexed |
| `notranslate`      | `boolean`                         | Prevent Google Translate offer                 |
| `maxSnippet`       | `number`                          | Max text snippet length (e.g. `150`)           |
| `maxImagePreview`  | `'none' \| 'standard' \| 'large'` | Max image preview size                         |
| `maxVideoPreview`  | `number`                          | Max video preview duration in seconds          |
| `unavailableAfter` | `string`                          | Date after which to remove page from results   |

### Content Analysis

```bash
npm install @power-seo/content-analysis
```

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const output = analyzeContent({
  title: 'Best Coffee Shops in NYC',
  metaDescription: 'Discover the top coffee shops in New York City.',
  content: '<h1>Best Coffee Shops</h1><p>Your article HTML here...</p>',
  focusKeyphrase: 'coffee shops nyc',
  url: 'https://example.com/coffee-shops-nyc',
});

console.log(output.score); // e.g. 18
console.log(output.maxScore); // 21
console.log(output.status); // "good" | "ok" | "poor"
console.log(output.recommendations); // string[] of actionable suggestions
```

### Structured Data (JSON-LD)

```bash
npm install @power-seo/schema
```

```ts
import { article, faqPage, schemaGraph, toJsonLdString, validateSchema } from '@power-seo/schema';

const jsonLd = article({
  headline: 'My Blog Post',
  datePublished: '2026-01-15',
  author: { name: 'Jane Doe' },
});
const html = toJsonLdString(jsonLd);
const validation = validateSchema(jsonLd);
```

```tsx
import { ArticleJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@power-seo/schema/react';

<ArticleJsonLd headline="My Post" datePublished="2026-01-15" author={{ name: 'Jane Doe' }} />
<FAQJsonLd questions={[{ question: 'What is SEO?', answer: 'Search engine optimization.' }]} />
<BreadcrumbJsonLd items={[{ name: 'Home', url: 'https://example.com' }, { name: 'Blog', url: 'https://example.com/blog' }]} />
```

### SERP & Social Previews

```bash
npm install @power-seo/preview
```

```tsx
import { PreviewPanel } from '@power-seo/preview/react';

<PreviewPanel
  title="My Page Title — Example Site"
  description="A compelling description for search engines."
  url="https://example.com/my-page"
  image={{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }}
  siteName="Example Site"
  twitterSite="@mysite"
  twitterCardType="summary_large_image"
/>;
```

### Sitemap Generation

```bash
npm install @power-seo/sitemap
```

```ts
import { generateSitemap, streamSitemap } from '@power-seo/sitemap';

const xml = generateSitemap({
  urls: [
    { loc: 'https://example.com/', changefreq: 'daily', priority: 1.0 },
    { loc: 'https://example.com/blog/my-post', lastmod: '2026-01-15', priority: 0.7 },
  ],
});

// Next.js App Router route handler
export async function GET() {
  const urls = await fetchAllUrls();
  return new Response(streamSitemap(urls), { headers: { 'Content-Type': 'application/xml' } });
}
```

### Redirect Engine

```bash
npm install @power-seo/redirects
```

```ts
import { createRedirectEngine, toNextRedirects } from '@power-seo/redirects';

const engine = createRedirectEngine({
  rules: [
    { source: '/old-page', destination: '/new-page', statusCode: 301 },
    { source: '/blog/:slug', destination: '/articles/:slug', statusCode: 301 },
  ],
});

const match = engine.match('/old-page');
// { destination: '/new-page', statusCode: 301 }
```

### SEO Audit

```bash
npm install @power-seo/audit
```

```ts
import { auditPage, auditSite } from '@power-seo/audit';

const result = auditPage({
  url: 'https://example.com/my-page',
  title: 'My Page',
  metaDescription: 'A page about something.',
  content: '<h1>My Page</h1><p>Content here.</p>',
  focusKeyphrase: 'my keyword',
  images: [{ src: '/hero.jpg', alt: 'Hero image' }],
  internalLinks: ['/about', '/contact'],
  responseTime: 350,
});

console.log(result.score); // 0–100 weighted score
console.log(result.categories); // { meta, content, structure, performance }
console.log(result.recommendations); // string[] of actionable fixes
```

### Readability Analysis

```bash
npm install @power-seo/readability
```

```ts
import { analyzeReadability } from '@power-seo/readability';

const result = analyzeReadability({ content: '<p>Your article HTML content here.</p>' });
console.log(result.status); // "good" | "ok" | "poor"
console.log(result.scores.fleschReadingEase); // 0-100
console.log(result.scores.gradeLevel); // US grade level
console.log(result.recommendations); // ['Shorten sentences...']
```

### Image SEO

```bash
npm install @power-seo/images
```

```ts
import {
  analyzeAltText,
  auditLazyLoading,
  analyzeImageFormats,
  generateImageSitemap,
} from '@power-seo/images';

const altResult = analyzeAltText({
  images: [
    { src: '/hero.jpg', alt: '' },
    { src: '/photo.jpg', alt: 'Running shoes' },
  ],
});
const lazyResult = auditLazyLoading({
  images: [{ src: '/hero.jpg', loading: 'lazy', isAboveFold: true }],
});
const formatResult = analyzeImageFormats({ images: [{ src: '/photo.jpg', size: 450_000 }] });
```

### Link Graph Analysis

```bash
npm install @power-seo/links
```

```ts
import { buildLinkGraph, findOrphanPages, suggestLinks, analyzeLinkEquity } from '@power-seo/links';

const graph = buildLinkGraph([
  { url: '/home', links: ['/about', '/blog'] },
  { url: '/about', links: ['/home'] },
  { url: '/hidden', links: [] }, // orphan
]);

const orphans = findOrphanPages(graph); // [{ url: '/hidden', inboundCount: 0 }]
const suggestions = suggestLinks(graph);
const equity = analyzeLinkEquity(graph);
```

### AI-Assisted SEO

```bash
npm install @power-seo/ai
```

```ts
import { buildMetaDescriptionPrompt, parseMetaDescriptionResponse } from '@power-seo/ai';

const prompt = buildMetaDescriptionPrompt({
  title: 'Best Coffee Shops in NYC',
  content: '...',
  keyphrase: 'coffee shops nyc',
});
const llmResponse = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: prompt.user }],
});
const result = parseMetaDescriptionResponse(llmResponse.choices[0].message.content);
console.log(result.descriptions[0].text);
```

### Analytics Dashboard

```bash
npm install @power-seo/analytics
```

```ts
import { buildDashboardData, mergeGscWithAudit, analyzeQueryRankings, trackPositionChanges } from '@power-seo/analytics';

const insights = mergeGscWithAudit({ gscPages: [...], auditResults: [...] });
const rankings = analyzeQueryRankings(gscRows);
const changes = trackPositionChanges(previousRows, currentRows);
const dashboard = buildDashboardData({ gscPages: currentRows, gscQueries: queryRows, auditResults: latestAudit });
```

### Google Search Console

```bash
npm install @power-seo/search-console
```

```ts
import {
  createGSCClient,
  createTokenManager,
  querySearchAnalytics,
  inspectUrl,
} from '@power-seo/search-console';

const client = createGSCClient({
  siteUrl: 'https://example.com',
  tokenManager: createTokenManager({
    type: 'service_account',
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
  }),
});

const rows = await querySearchAnalytics(client, {
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  dimensions: ['query', 'page'],
});
const inspection = await inspectUrl(client, 'https://example.com/my-page');
```

### Third-Party Integrations

```bash
npm install @power-seo/integrations
```

```ts
import { createSemrushClient, createAhrefsClient } from '@power-seo/integrations';

const semrush = createSemrushClient({ apiKey: process.env.SEMRUSH_API_KEY! });
const overview = await semrush.getDomainOverview({ domain: 'example.com' });

const ahrefs = createAhrefsClient({ apiKey: process.env.AHREFS_API_KEY! });
const siteOverview = await ahrefs.getSiteOverview({ target: 'example.com' });
```

### Analytics Tracking & GDPR Consent

```bash
npm install @power-seo/tracking
```

```ts
import { buildGA4Script, buildPlausibleScript, createConsentManager } from '@power-seo/tracking';

const manager = createConsentManager({ necessary: true, analytics: false, marketing: false });
manager.grant('analytics');

const ga4Scripts = buildGA4Script({ measurementId: 'G-XXXXXXXXXX' });
const toLoad = ga4Scripts.filter((s) => s.shouldLoad(manager.getState()));
```

```tsx
import { AnalyticsScript, ConsentBanner } from '@power-seo/tracking/react';

<ConsentBanner manager={manager} privacyPolicyUrl="/privacy" />
<AnalyticsScript scripts={ga4Scripts} consent={manager.getState()} />
```

### Core Utilities

```bash
npm install @power-seo/core
```

```ts
import {
  buildMetaTags,
  validateTitle,
  validateMetaDescription,
  toSlug,
  getTextStatistics,
  calculateKeywordDensity,
  buildRobotsContent,
} from '@power-seo/core';

validateTitle('My Page Title'); // { valid, length, pixelWidth, warnings }
validateMetaDescription('A page description.'); // { valid, length, pixelWidth, warnings }
toSlug('My Blog Post!'); // → "my-blog-post"
buildRobotsContent({ index: false, maxSnippet: 150 }); // → "noindex, max-snippet:150"
getTextStatistics('<p>Content here.</p>'); // { wordCount, sentenceCount, ... }
calculateKeywordDensity('react seo is great for react apps', 'react'); // → 0.1667
```

---

## Framework Compatibility

| Framework                     | Recommended Packages                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| **Next.js 14+ (App Router)**  | All packages                                                                        |
| **Next.js 13 (Pages Router)** | `@power-seo/react`, `@power-seo/schema`, `@power-seo/core`                          |
| **Remix v2**                  | `@power-seo/meta`, `@power-seo/schema`, `@power-seo/redirects`                      |
| **Vite + React (SPA)**        | `@power-seo/react`, `@power-seo/schema`, `@power-seo/content-analysis`              |
| **Gatsby**                    | `@power-seo/react`, `@power-seo/schema`, `@power-seo/sitemap`                       |
| **Node.js (non-React)**       | `@power-seo/core`, `@power-seo/sitemap`, `@power-seo/audit`, `@power-seo/redirects` |
| **Express / Fastify**         | `@power-seo/redirects`, `@power-seo/sitemap`, `@power-seo/audit`                    |

---

## Architecture

```
@power-seo/ (Turborepo monorepo)
├── packages/                     # 17 independently published npm packages
│   ├── core/                     # Zero-dependency foundation — types, utils, constants
│   ├── react/                    # React components (peerDep: react >=18)
│   ├── meta/                     # SSR meta helpers (Next.js / Remix / generic)
│   ├── schema/                   # JSON-LD builders + React components
│   ├── content-analysis/         # Yoast-style scoring engine
│   ├── readability/              # Text readability algorithms
│   ├── preview/                  # SERP / OG / Twitter Card preview generators
│   ├── sitemap/                  # XML sitemap generation + streaming
│   ├── redirects/                # Redirect engine + Next.js / Remix / Express adapters
│   ├── links/                    # Link graph analysis
│   ├── audit/                    # Full SEO audit engine
│   ├── images/                   # Image SEO analysis
│   ├── ai/                       # LLM prompt templates + response parsers
│   ├── analytics/                # Analytics + GSC data merging + dashboard builder
│   ├── search-console/           # Google Search Console API client
│   ├── integrations/             # Semrush + Ahrefs API clients
│   └── tracking/                 # Analytics script builders + API clients + consent
├── apps/
│   └── docs/                     # Documentation site (Astro Starlight)
├── examples/
│   ├── nextjs-app/               # Next.js App Router example
│   └── remix-app/                # Remix v2 example
├── turbo.json                    # Turborepo pipeline config
└── pnpm-workspace.yaml           # pnpm workspace definition
```

**Design principles:**

- **Modular by design** — install only what you need
- **Framework-agnostic core** — `@power-seo/core` has zero runtime dependencies
- **Dual ESM + CJS** — all packages ship both formats via tsup
- **Tree-shakeable** — all packages set `"sideEffects": false`
- **TypeScript-first** — full `.d.ts` declarations
- **React optional** — packages with React components declare `react` as `peerDependency`

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [pnpm](https://pnpm.io/) >= 9.0.0

### Setup

```bash
git clone https://github.com/CyberCraftBD/power-seo.git
cd power-seo
pnpm install
pnpm build
```

### Commands

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `pnpm build`     | Build all packages (Turborepo cached) |
| `pnpm dev`       | Watch mode for all packages           |
| `pnpm test`      | Run all tests with Vitest             |
| `pnpm lint`      | Lint all packages (ESLint v9)         |
| `pnpm typecheck` | Type-check all packages               |
| `pnpm format`    | Format with Prettier                  |
| `pnpm clean`     | Remove all build artifacts            |

```bash
# Run for a specific package
pnpm --filter @power-seo/schema build
pnpm --filter @power-seo/schema test
pnpm --filter @power-seo/schema typecheck
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, branch naming, commit conventions, PR process, and how to add a new package.

---

## License

[MIT](./LICENSE) © 2026 CyberCraft Bangladesh

---

## About CyberCraft Bangladesh

**CyberCraft Bangladesh** is a Bangladesh-based enterprise-grade software engineering company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

|                      |                                                                |
| -------------------- | -------------------------------------------------------------- |
| **Website**          | [ccbd.dev](https://ccbd.dev)                                   |
| **GitHub**           | [github.com/cybercraftbd](https://github.com/cybercraftbd)     |
| **npm Organization** | [npmjs.com/org/power-seo](https://www.npmjs.com/org/power-seo) |
| **Email**            | [info@ccbd.dev](mailto:info@ccbd.dev)                          |

© 2026 CyberCraft Bangladesh · Released under the [MIT License](./LICENSE)
