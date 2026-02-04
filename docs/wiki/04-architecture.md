# Architecture Overview

Deep dive into power-seo's architecture, design principles, and package relationships.

## Monorepo Structure

Power-seo is organized as a Turborepo monorepo with 17 independently published packages:

```
@power-seo/ (root)
├── packages/                       # 17 independently published npm packages
│   ├── core/                       # Zero-dependency foundation
│   │   ├── src/
│   │   │   ├── types/              # Core type definitions
│   │   │   ├── validators/         # Validation utilities
│   │   │   ├── utils/              # Helper functions
│   │   │   └── constants/          # SEO constants
│   │   ├── dist/                   # Build output (ESM + CJS)
│   │   └── package.json
│   │
│   ├── react/                      # React components
│   ├── meta/                       # SSR meta helpers
│   ├── schema/                     # JSON-LD builders
│   ├── content-analysis/           # Yoast-style scoring
│   ├── readability/                # Text readability
│   ├── preview/                    # SERP/OG/Twitter
│   ├── sitemap/                    # XML sitemap generation
│   ├── redirects/                  # Redirect engine
│   ├── links/                      # Link graph analysis
│   ├── audit/                      # SEO audit engine
│   ├── images/                     # Image SEO
│   ├── ai/                         # AI tools
│   ├── analytics/                  # Analytics dashboard
│   ├── search-console/             # Google Search Console
│   ├── integrations/               # Semrush/Ahrefs
│   └── tracking/                   # Analytics tracking
│
├── apps/
│   └── docs/                       # Documentation website
│
├── turbo.json                      # Turborepo configuration
├── pnpm-workspace.yaml             # pnpm workspaces
└── package.json                    # Root package

```

---

## Design Principles

### 1. **Modularity First**

Every package is independently installable and has zero required dependencies (except peer dependencies like React).

```
User A: npm install @power-seo/core
User B: npm install @power-seo/schema
User C: npm install @power-seo/core @power-seo/schema @power-seo/sitemap

No bloat. No unused code.
```

### 2. **Zero Dependency Core**

`@power-seo/core` has ZERO runtime dependencies:

```json
{
  "name": "@power-seo/core",
  "version": "1.0.10",
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  },
  "dependencies": {}
}
```

This means:
- ✅ Runs in any JavaScript environment
- ✅ No transitive dependency hell
- ✅ Works in Edge functions (Cloudflare Workers, Vercel Edge, Deno)
- ✅ Minimal build size impact

### 3. **Framework Agnostic**

The core packages work with any framework:
- Next.js, Remix, Gatsby, Vite, CRA
- Node.js, Express, Fastify, Hono
- Cloudflare Workers, Vercel Edge
- Deno

Framework-specific adapters are optional separate packages.

### 4. **Tree-Shakeable**

Every package has `"sideEffects": false`:

```json
{
  "name": "@power-seo/schema",
  "sideEffects": false
}
```

This means bundlers can remove unused exports:

```ts
// Only schema builders you use are bundled
import { article } from '@power-seo/schema';

// Unused builders are tree-shaken away
// import { product, faqPage } would add to bundle
```

### 5. **Dual ESM + CJS Output**

Every package ships both formats via tsup:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",      // ESM
      "require": "./dist/index.cjs"     // CommonJS
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js"
}
```

Consumers can use whichever they prefer:

```ts
// ESM
import { validateTitle } from '@power-seo/core';

// CommonJS
const { validateTitle } = require('@power-seo/core');
```

### 6. **TypeScript-First**

All packages are written in TypeScript with full `.d.ts` output:

```ts
// Full type safety - no separate @types/ needed
import {
  validateTitle,    // (title: string) => ValidationResult
  stripHtml,        // (html: string) => string
  buildRobotsContent, // (config: RobotsConfig) => string
} from '@power-seo/core';
```

---

## Package Dependency Graph

```
┌─────────────────────────────────────────────────────┐
│                  @power-seo/core                    │
│          (zero-dep foundation for all)              │
└──────────────┬──────────────────────────────────────┘
               │
       ┌───────┴──────────────────────────────────────────────┐
       │                                                      │
       ▼                                                      ▼
┌──────────────────┐                           ┌──────────────────────┐
│ @power-seo/react │                           │ @power-seo/schema    │
│  (React SEO      │                           │ (JSON-LD builders    │
│   components)    │                           │  + validators)       │
└──────────────────┘                           └──────────────────────┘
       │                                              │
       ├─ Breadcrumb                                 ├─ articleSchema
       ├─ Meta                                       ├─ productSchema
       ├─ SEO                                        ├─ faqPageSchema
       └─ Hreflang                                   └─ 20+ other builders
                                                           │
       ┌───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────┐
│ @power-seo/meta      │
│ (SSR meta helpers)   │
├──────────────────────┤
│ createMetadata()     │  (Next.js)
│ createMetaDescriptors() │ (Remix)
└──────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  Feature Packages                             │
├──────────────────────────────────────────────────────────────┤
│ @power-seo/content-analysis    (Yoast-style scoring)         │
│ @power-seo/readability         (Text readability)            │
│ @power-seo/preview             (SERP/OG/Twitter)             │
│ @power-seo/sitemap             (XML sitemap generation)      │
│ @power-seo/redirects           (Redirect engine)             │
│ @power-seo/links               (Link graph analysis)         │
│ @power-seo/audit               (Full SEO audit)              │
│ @power-seo/images              (Image SEO)                   │
│ @power-seo/ai                  (LLM prompts)                 │
│ @power-seo/analytics           (Analytics dashboard)         │
│ @power-seo/search-console      (Google Search Console)       │
│ @power-seo/integrations        (Semrush/Ahrefs)             │
│ @power-seo/tracking            (Analytics tracking)          │
└──────────────────────────────────────────────────────────────┘
```

**Key insight:** Every package independently depends ONLY on `@power-seo/core`. This prevents version conflicts and makes each package truly standalone.

---

## Data Flow Examples

### Content Analysis Flow

```
Input:
  title: "My Article"
  content: "<h1>My Article</h1><p>Content...</p>"
  focusKeyphrase: "article"

         ↓

@power-seo/content-analysis
  ├─ Uses @power-seo/core
  │   ├─ stripHtml() → extract plain text
  │   ├─ calculateKeywordDensity() → check keyword presence
  │   └─ getTextStatistics() → word/sentence counts
  ├─ Analyze keyphrase distribution
  ├─ Check meta description length
  ├─ Validate heading structure
  └─ Calculate overall score

         ↓

Output:
{
  score: 45,
  maxScore: 55,
  results: [
    { name: "title", status: "ok", message: "..." },
    { name: "keyphrase", status: "warning", message: "..." }
  ],
  recommendations: ["Improve keyphrase density", "Add more headings"]
}
```

### Sitemap Generation Flow

```
Input:
  urls: [
    { loc: "/", priority: 1.0 },
    { loc: "/blog", priority: 0.7 },
    ...49,998 more URLs
  ]

         ↓

@power-seo/sitemap
  ├─ Uses @power-seo/core
  │   └─ validateSitemapUrl() → validate each URL
  ├─ Validate URL count (max 50,000)
  ├─ Validate URL format and encoding
  ├─ Check for duplicates
  └─ Generate XML

         ↓

Output:
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <priority>1.0</priority>
  </url>
  ...
</urlset>
```

### Audit Engine Flow

```
Input:
  url: "https://example.com/page"
  title: "Page Title"
  metaDescription: "Description"
  headings: ["h1:Page Title", "h2:Section"]
  focusKeyphrase: "keyword"

         ↓

@power-seo/audit
  ├─ Run meta rules
  │   ├─ titleLengthRule (uses @power-seo/core validators)
  │   ├─ descriptionLengthRule
  │   └─ metaRobotsRule
  ├─ Run content rules
  │   ├─ headingStructureRule
  │   ├─ keywordDensityRule (uses @power-seo/content-analysis)
  │   └─ readabilityRule (uses @power-seo/readability)
  ├─ Run technical rules
  │   ├─ sslCertificateRule
  │   └─ mobileViewportRule
  ├─ Weight and aggregate scores
  └─ Generate recommendations

         ↓

Output:
{
  score: 72,
  categories: {
    meta: 85,
    content: 65,
    structure: 70,
    performance: 55
  },
  rules: [
    { name: "titleLength", status: "pass", ... },
    { name: "readability", status: "warning", ... }
  ],
  recommendations: ["Improve readability", "Add more internal links"]
}
```

---

## Build & Release Process

### Build Pipeline (Turborepo)

```
pnpm build

  ↓

Turborepo executes tasks in dependency order:
  1. Build @power-seo/core (no dependencies)
  2. Build other packages (in parallel where possible)
  3. Each package runs: tsc → tsup → eslint

  ↓

Output:
  packages/core/dist/ (ESM + CJS + types)
  packages/react/dist/
  packages/schema/dist/
  ... (15 more packages)
```

### Testing

```
pnpm test

  ↓

Vitest runs tests in isolation:
  ├─ packages/core/__tests__/
  ├─ packages/react/__tests__/
  ├─ packages/schema/__tests__/
  └─ ... (all 17 packages)

  ↓

Coverage report (95%+ target)
```

### Release Process

```
pnpm changeset
  └─ Document changes (features, fixes, breaking changes)

         ↓

pnpm version-packages
  └─ Bump versions based on change types

         ↓

pnpm release
  └─ Runs pnpm publish --access public --provenance
  └─ Signs releases via Sigstore (supply chain security)
  └─ Publishes all 17 packages to npm atomically

         ↓

GitHub Release
  └─ Create release notes from CHANGELOG
  └─ Include git commit history
```

---

## Key Files & Configuration

### Root Configuration Files

- **`turbo.json`** - Turborepo task pipeline (build, test, lint)
- **`pnpm-workspace.yaml`** - Define workspace packages
- **`package.json`** - Shared scripts, dependencies, metadata
- **`.eslintrc.json`** - Shared ESLint config
- **`.prettierrc`** - Shared Prettier config

### Per-Package Files

Each of 17 packages has:
- **`package.json`** - Package metadata, exports, dependencies
- **`tsconfig.json`** - TypeScript configuration
- **`tsup.config.ts`** - Build configuration (ESM + CJS)
- **`vitest.config.ts`** - Test configuration
- **`src/index.ts`** - Main entry point
- **`README.md`** - Package-specific documentation

---

## Performance Characteristics

### Bundle Size Impact

When installing multiple packages:

```
@power-seo/core               ~3 KB (gzipped)
@power-seo/schema            ~8 KB (gzipped)
@power-seo/react            ~12 KB (gzipped)
@power-seo/content-analysis ~15 KB (gzipped)
@power-seo/readability       ~6 KB (gzipped)

Total for typical blog setup: ~44 KB (gzipped)
  - Tree-shakeable (only import what you use)
  - Dual ESM output (bundlers further optimize)
```

### Runtime Performance

Core operations are optimized for speed:

```
validateTitle()              < 0.1ms
stripHtml()                  < 1ms
calculateKeywordDensity()    ~5ms (for 10KB content)
analyzeContent()             ~20ms (full analysis)
generateSitemap(50k URLs)    ~100ms (streaming)
```

---

## Security Architecture

### Supply Chain Security

1. **No Install Scripts** - No `postinstall` hooks across any package
2. **No Runtime Network** - All packages are pure computation
3. **No Dynamic Code** - No `eval`, `new Function()`, etc.
4. **Provenance Signing** - Every release signed via Sigstore
5. **CI-Only Publishing** - Only GitHub Actions can publish
6. **Automated Scanning** - CodeQL + Socket.dev on every PR

### Type Safety

TypeScript provides compile-time safety:

```ts
// Compile error: missing required field
const invalid = article({
  headline: 'Title',
  // ❌ Property 'datePublished' is missing
});

// Type-safe builder
const valid = article({
  headline: 'Title',
  datePublished: '2026-01-15', // ✅ Required
  author: { name: 'Jane' },
});
```

---

## Extensibility

### Custom Rules (Audit Engine)

Extend the audit engine with custom rules:

```ts
import { auditPage, createCustomRule } from '@power-seo/audit';

const myCustomRule = createCustomRule({
  id: 'my-custom-rule',
  name: 'My Custom Rule',
  check: (input) => {
    return input.title.length > 30 ? 'pass' : 'fail';
  },
});

const result = auditPage({
  ...auditInput,
  customRules: [myCustomRule],
});
```

### Custom Validators

Create validators for specific needs:

```ts
import { stripHtml, validateTitle } from '@power-seo/core';

function validateMyContent(content: string) {
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).length;

  return {
    valid: wordCount >= 300,
    wordCount,
    message: wordCount < 300 ? 'Content too short' : 'OK',
  };
}
```

---

## What's Next?

- **[TypeScript & Types](./05-typescript-types.md)** - Full type system
- **[Framework Integration](./06-framework-integration.md)** - Deep dive per framework
- **[Development Guide](./13-development.md)** - Contributing to power-seo

