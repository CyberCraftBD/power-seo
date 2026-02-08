# @ccbd-seo

> WordPress-level SEO capabilities for React and its frameworks.

A comprehensive, modular SEO toolkit for React applications. Each package can be used independently or combined for full-stack SEO coverage — from meta tags and structured data to content analysis, sitemaps, redirects, and analytics.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@ccbd-seo/core`](./packages/core) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/core)](https://www.npmjs.com/package/@ccbd-seo/core) | Framework-agnostic SEO utilities, types, constants, validators |
| [`@ccbd-seo/react`](./packages/react) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/react)](https://www.npmjs.com/package/@ccbd-seo/react) | React SEO components — meta tags, Open Graph, Twitter Card, breadcrumbs |
| [`@ccbd-seo/schema`](./packages/schema) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/schema)](https://www.npmjs.com/package/@ccbd-seo/schema) | JSON-LD structured data — 19 builder functions + 19 React components |
| [`@ccbd-seo/content-analysis`](./packages/content-analysis) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/content-analysis)](https://www.npmjs.com/package/@ccbd-seo/content-analysis) | Yoast-style content scoring engine with React components |
| [`@ccbd-seo/preview`](./packages/preview) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/preview)](https://www.npmjs.com/package/@ccbd-seo/preview) | SERP, Open Graph, and Twitter Card preview generators |
| [`@ccbd-seo/readability`](./packages/readability) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/readability)](https://www.npmjs.com/package/@ccbd-seo/readability) | Readability scoring — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI |
| [`@ccbd-seo/sitemap`](./packages/sitemap) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/sitemap)](https://www.npmjs.com/package/@ccbd-seo/sitemap) | XML sitemap generation, streaming, validation, index splitting |
| [`@ccbd-seo/redirects`](./packages/redirects) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/redirects)](https://www.npmjs.com/package/@ccbd-seo/redirects) | Redirect engine with URL pattern matching and framework adapters |
| [`@ccbd-seo/links`](./packages/links) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/links)](https://www.npmjs.com/package/@ccbd-seo/links) | Link graph analysis — orphan detection, suggestions, equity scoring |
| [`@ccbd-seo/audit`](./packages/audit) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/audit)](https://www.npmjs.com/package/@ccbd-seo/audit) | SEO page/site auditing with meta, content, structure, and performance rules |
| [`@ccbd-seo/images`](./packages/images) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/images)](https://www.npmjs.com/package/@ccbd-seo/images) | Image SEO — alt text quality, lazy loading, format optimization, image sitemaps |
| [`@ccbd-seo/ai`](./packages/ai) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/ai)](https://www.npmjs.com/package/@ccbd-seo/ai) | LLM-agnostic prompt templates and response parsers for AI-assisted SEO |
| [`@ccbd-seo/analytics`](./packages/analytics) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/analytics)](https://www.npmjs.com/package/@ccbd-seo/analytics) | Analytics dashboard — merge GSC data with audit results for trend analysis |
| [`@ccbd-seo/search-console`](./packages/search-console) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/search-console)](https://www.npmjs.com/package/@ccbd-seo/search-console) | Google Search Console API client with OAuth2 and service account auth |
| [`@ccbd-seo/integrations`](./packages/integrations) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/integrations)](https://www.npmjs.com/package/@ccbd-seo/integrations) | Semrush and Ahrefs API clients with shared HTTP client |
| [`@ccbd-seo/tracking`](./packages/tracking) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/tracking)](https://www.npmjs.com/package/@ccbd-seo/tracking) | Analytics script builders, consent management — GA4, Clarity, PostHog, Plausible, Fathom |
| [`@ccbd-seo/meta`](./packages/meta) | [![npm](https://img.shields.io/npm/v/@ccbd-seo/meta)](https://www.npmjs.com/package/@ccbd-seo/meta) | SSR meta tag helpers for Next.js App Router, Remix, and generic SSR |

## Quick Start

### Next.js App Router

```bash
npm install @ccbd-seo/meta @ccbd-seo/schema
```

```ts
// app/blog/[slug]/page.tsx
import { createMetadata } from '@ccbd-seo/meta';
import { article, toJsonLdString } from '@ccbd-seo/schema';

export function generateMetadata({ params }) {
  return createMetadata({
    title: 'My Blog Post',
    description: 'A great article about SEO.',
    canonical: `https://example.com/blog/${params.slug}`,
    openGraph: {
      type: 'article',
      images: [{ url: 'https://example.com/og.jpg' }],
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdString(jsonLd) }}
      />
      <article>{/* ... */}</article>
    </>
  );
}
```

### Remix v2

```bash
npm install @ccbd-seo/meta
```

```ts
// app/routes/blog.$slug.tsx
import { createMetaDescriptors } from '@ccbd-seo/meta';

export const meta = () => {
  return createMetaDescriptors({
    title: 'My Blog Post',
    description: 'A great article about SEO.',
    canonical: 'https://example.com/blog/my-post',
    openGraph: {
      type: 'article',
      images: [{ url: 'https://example.com/og.jpg' }],
    },
  });
};
```

### Content Analysis

```bash
npm install @ccbd-seo/content-analysis
```

```ts
import { analyzeContent } from '@ccbd-seo/content-analysis';

const result = analyzeContent({
  title: 'Best Coffee Shops in NYC',
  metaDescription: 'Discover the top coffee shops in New York City.',
  content: '<p>Your article HTML here...</p>',
  keyphrase: 'coffee shops nyc',
  url: 'https://example.com/coffee-shops-nyc',
});

console.log(result.score);    // 15
console.log(result.maxScore); // 21
console.log(result.status);   // "good" | "ok" | "poor"
console.log(result.results);  // Individual check results with suggestions
```

### Structured Data (React)

```bash
npm install @ccbd-seo/schema
```

```tsx
import { ArticleJsonLd, FAQJsonLd } from '@ccbd-seo/schema/react';

function BlogPost() {
  return (
    <>
      <ArticleJsonLd
        headline="My Article"
        datePublished="2026-01-15"
        author={{ name: 'Jane Doe' }}
      />
      <FAQJsonLd
        questions={[
          { question: 'What is SEO?', answer: 'Search engine optimization.' },
        ]}
      />
    </>
  );
}
```

### SERP Preview (React)

```bash
npm install @ccbd-seo/preview
```

```tsx
import { PreviewPanel } from '@ccbd-seo/preview/react';

function SEOEditor() {
  return (
    <PreviewPanel
      title="My Page Title"
      description="A description of the page for search engines."
      url="https://example.com/my-page"
      image={{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }}
    />
  );
}
```

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- [pnpm](https://pnpm.io/) >= 9.0.0

### Setup

```bash
git clone https://github.com/ccbd-seo/ccbd-seo.git
cd ccbd-seo
pnpm install
pnpm build
```

### Commands

| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting |
| `pnpm clean` | Remove all build artifacts and node_modules |

### Project Structure

```
@ccbd-seo/
├── packages/          # 17 publishable packages
├── apps/
│   └── docs/          # Documentation site (Starlight)
├── examples/
│   ├── nextjs-app/    # Next.js App Router example
│   └── remix-app/     # Remix v2 example
├── turbo.json         # Turborepo config
├── pnpm-workspace.yaml
└── tsconfig.json      # Root TypeScript config
```

## Documentation

Full documentation is available at the [docs site](./apps/docs) built with [Starlight](https://starlight.astro.build/).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, branch naming, commit conventions, and PR process.

## License

[MIT](./LICENSE)
