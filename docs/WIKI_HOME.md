# Power-SEO Wiki

Welcome to the Power-SEO Wiki. This is your comprehensive guide to understanding and using all 17 packages in the power-seo ecosystem.

## Quick Navigation

### Getting Started
- **[Installation & Setup](./wiki/01-installation-setup.md)** - Install power-seo for your framework
- **[Quick Start Guide](./wiki/02-quick-start.md)** - Get up and running in 5 minutes
- **[Package Selection Guide](./wiki/03-package-selection.md)** - Choose the right packages for your project

### Core Concepts
- **[Architecture Overview](./wiki/04-architecture.md)** - Understand the project structure
- **[TypeScript & Types](./wiki/05-typescript-types.md)** - Full type safety across all packages
- **[Framework Integration](./wiki/06-framework-integration.md)** - How to use with Next.js, Remix, etc.

### Package Guides
- **[@power-seo/core](./wiki/pkg-core.md)** - Foundation utilities and types
- **[@power-seo/react](./wiki/pkg-react.md)** - React SEO components
- **[@power-seo/meta](./wiki/pkg-meta.md)** - SSR meta helpers for Next.js/Remix
- **[@power-seo/schema](./wiki/pkg-schema.md)** - JSON-LD structured data builders
- **[@power-seo/content-analysis](./wiki/pkg-content-analysis.md)** - Yoast-style SEO scoring
- **[@power-seo/readability](./wiki/pkg-readability.md)** - Text readability algorithms
- **[@power-seo/preview](./wiki/pkg-preview.md)** - SERP/OG/Twitter previews
- **[@power-seo/sitemap](./wiki/pkg-sitemap.md)** - XML sitemap generation
- **[@power-seo/redirects](./wiki/pkg-redirects.md)** - Redirect engine
- **[@power-seo/links](./wiki/pkg-links.md)** - Link graph analysis
- **[@power-seo/audit](./wiki/pkg-audit.md)** - Full SEO audit engine
- **[@power-seo/images](./wiki/pkg-images.md)** - Image SEO analysis
- **[@power-seo/ai](./wiki/pkg-ai.md)** - AI-powered SEO tools
- **[@power-seo/analytics](./wiki/pkg-analytics.md)** - Analytics dashboard builder
- **[@power-seo/search-console](./wiki/pkg-search-console.md)** - Google Search Console API
- **[@power-seo/integrations](./wiki/pkg-integrations.md)** - Semrush/Ahrefs clients
- **[@power-seo/tracking](./wiki/pkg-tracking.md)** - Analytics tracking + GDPR consent

### Advanced Topics
- **[Performance Optimization](./wiki/07-performance.md)** - Optimize for speed and bundle size
- **[Security & Privacy](./wiki/08-security-privacy.md)** - Security best practices
- **[Advanced Patterns](./wiki/09-advanced-patterns.md)** - Complex use cases

### Use Cases
- **[Headless CMS / Blog](./wiki/uc-cms-blog.md)** - Content management system setup
- **[eCommerce](./wiki/uc-ecommerce.md)** - Product pages and catalogs
- **[SaaS Dashboard](./wiki/uc-saas-dashboard.md)** - Application pages
- **[Multi-language Sites](./wiki/uc-multi-language.md)** - International SEO
- **[CI/CD Integration](./wiki/uc-ci-cd.md)** - Automated SEO quality gates

### Troubleshooting
- **[Common Issues](./wiki/10-troubleshooting.md)** - Solutions to common problems
- **[FAQ](./wiki/11-faq.md)** - Frequently asked questions
- **[Debug Guide](./wiki/12-debug-guide.md)** - Debugging techniques

### Contributing
- **[Development Setup](./wiki/13-development.md)** - Set up for contributions
- **[Contributing Guidelines](./wiki/14-contributing.md)** - How to contribute
- **[Testing Guide](./wiki/15-testing.md)** - Writing tests

---

## Overview

**Power-SEO** is a production-grade SEO toolkit for TypeScript, React, and Node.js. It provides 17 independently installable packages covering:

- ✅ Meta tags and Open Graph management
- ✅ JSON-LD structured data (23 schema builders)
- ✅ Content analysis (Yoast-style scoring)
- ✅ Readability analysis (Flesch-Kincaid, Gunning Fog, etc.)
- ✅ SERP/OG/Twitter preview generation
- ✅ XML sitemap generation and streaming
- ✅ Redirect engine with framework adapters
- ✅ Link graph analysis and orphan detection
- ✅ Full SEO audit engine with 30+ rules
- ✅ Image SEO analysis and optimization
- ✅ AI-powered SEO prompts and parsers
- ✅ Google Search Console API integration
- ✅ Analytics dashboard builder
- ✅ Semrush and Ahrefs API clients
- ✅ Analytics tracking with GDPR consent

## Key Features

### Framework Native
- **Next.js 14+** - First-class App Router support
- **Remix v2** - Native meta function integration
- **React SPA** - Full SPA compatibility
- **Node.js** - Backend and CLI tooling

### Type-Safe
- Full TypeScript support across all packages
- No external `@types/` dependencies needed
- Strict type checking on builders and validators
- IDE autocomplete for all APIs

### Modular & Lightweight
- Install only what you need
- Zero dependencies in core packages
- Dual ESM + CJS output
- Tree-shakeable (`sideEffects: false`)

### Production Ready
- Provenance-signed releases via Sigstore
- Supply chain security audits
- Full test coverage (95%+)
- Security vulnerability scanning

---

## Monorepo Structure

```
@power-seo/
├── packages/
│   ├── core/                    # Zero-dependency foundation
│   ├── react/                   # React components
│   ├── meta/                    # SSR meta helpers
│   ├── schema/                  # JSON-LD builders
│   ├── content-analysis/        # Yoast-style scoring
│   ├── readability/             # Text readability
│   ├── preview/                 # SERP/OG/Twitter
│   ├── sitemap/                 # XML sitemaps
│   ├── redirects/               # Redirect engine
│   ├── links/                   # Link analysis
│   ├── audit/                   # SEO audit
│   ├── images/                  # Image SEO
│   ├── ai/                      # AI tools
│   ├── analytics/               # Analytics
│   ├── search-console/          # GSC API
│   ├── integrations/            # Semrush/Ahrefs
│   └── tracking/                # Analytics tracking
└── apps/
    └── docs/                    # Documentation website
```

---

## Installation

```bash
# Install for Next.js 14+ (App Router)
npm install @power-seo/meta @power-seo/schema

# Install for Remix v2
npm install @power-seo/meta

# Install for React SPA
npm install @power-seo/react @power-seo/schema

# Install for comprehensive toolkit
npm install @power-seo/core @power-seo/react @power-seo/schema \
  @power-seo/content-analysis @power-seo/readability @power-seo/preview \
  @power-seo/sitemap @power-seo/redirects @power-seo/links @power-seo/audit \
  @power-seo/images @power-seo/ai @power-seo/analytics \
  @power-seo/search-console @power-seo/integrations @power-seo/tracking
```

---

## Quick Examples

### Next.js Meta Tags
```tsx
import { createMetadata } from '@power-seo/meta';

export const metadata = createMetadata({
  title: 'My Page',
  description: 'Page description',
  canonical: 'https://example.com/page',
});
```

### JSON-LD Schema
```ts
import { article, toJsonLdString, validateSchema } from '@power-seo/schema';

const schema = article({
  headline: 'My Article',
  datePublished: '2026-01-15',
});

const { valid } = validateSchema(schema);
const html = toJsonLdString(schema);
```

### Content Analysis
```ts
import { analyzeContent } from '@power-seo/content-analysis';

const result = analyzeContent({
  title: 'My Article',
  content: '<h1>My Article</h1><p>Content...</p>',
  focusKeyphrase: 'my keyword',
});

console.log(result.score); // 0-100
```

### XML Sitemap
```ts
import { generateSitemap } from '@power-seo/sitemap';

const xml = generateSitemap({
  hostname: 'https://example.com',
  urls: [{ loc: '/', priority: 1.0 }],
});
```

---

## Version & Requirements

- **Node.js:** >= 18.0.0
- **TypeScript:** >= 5.0 (optional, but recommended)
- **React:** >= 18 (optional, for React packages)

Current version: **1.0.10** (February 2026)

---

## Community & Support

- **GitHub Issues:** [Report bugs](https://github.com/CyberCraftBD/power-seo/issues)
- **Discussions:** [Ask questions](https://github.com/CyberCraftBD/power-seo/discussions)
- **Email:** info@ccbd.dev
- **Website:** [ccbd.dev](https://ccbd.dev)

---

## License

MIT © 2026 [CyberCraft Bangladesh](https://ccbd.dev)
