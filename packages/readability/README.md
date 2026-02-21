# @power-seo/readability — Readability Scoring for TypeScript — Flesch-Kincaid, Gunning Fog, Coleman-Liau & ARI

[![npm version](https://img.shields.io/npm/v/@power-seo/readability)](https://www.npmjs.com/package/@power-seo/readability)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/readability)](https://www.npmjs.com/package/@power-seo/readability)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/readability)

---

## Overview

**@power-seo/readability** is a **multi-algorithm readability scoring engine** for **TypeScript/JavaScript developers and SEO engineers** that helps you **measure, classify, and improve the reading ease of web content**.

**What it does**

- ✅ **Scores content with 5 industry-standard readability formulas** (Flesch, Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI)
- ✅ **Returns structured, actionable status labels** (`'good'` / `'improvement'` / `'error'`) with human-readable messages
- ✅ **Works in Node.js and the browser** with zero runtime dependencies

**What it is not**

- ❌ **Not an NLP or AI writing tool** — it scores and classifies; it does not rewrite content
- ❌ **Not a grammar or spell checker** — readability metrics only

**Recommended for**

- **SaaS marketing teams, content editors, and SEO engineers** building automated content scoring pipelines, CMS integrations, or editorial dashboards

---

## Why @power-seo/readability Matters

**The problem**

- **Hard-to-read content increases bounce rates** and reduces time-on-page signals Google uses for ranking
- **No consistent readability standard** — teams use different tools with inconsistent scoring, leading to content that ships without a readability check
- **Manual review doesn't scale** — large programmatic SEO sites and content pipelines need automated, per-page readability scoring

**Why developers care**

- **SEO:** Google's guidelines favor content written for humans — readability signals content quality
- **UX:** Lower reading complexity reduces cognitive load, improving engagement and conversion
- **Performance:** Catching over-complex copy early reduces editorial cycles and re-work

---

## Key Features

- **Flesch Reading Ease** — 0–100 score; higher = easier; target 60–70 for most web content
- **Flesch-Kincaid Grade Level** — maps content to US school grade levels (e.g. 8.0 = 8th grade)
- **Gunning Fog Index** — grade-level estimate based on complex word (3+ syllable) density
- **Coleman-Liau Index** — character-based formula; no syllable counting required
- **Automated Readability Index (ARI)** — grade estimate from character and word counts
- **Unified `analyzeReadability()` API** — run all five algorithms in a single call with composite status
- **Text statistics** — sentence count, word count, syllable count, character count, avg sentence length
- **Status labels** — each score maps to `'good'` / `'improvement'` / `'error'` with a human message
- **Zero runtime dependencies** — pure TypeScript; no NLP libraries
- **Tree-shakeable** — import only the algorithms you need
- **Type-safe API** — TypeScript-first with full type inference

---

## Benefits of Using @power-seo/readability

- **Improved content quality**: Catch over-complex copy before it ships — not after your rankings drop
- **Better SEO signals**: Content written at the right reading level aligns with Google's helpful content guidelines
- **Faster editorial review**: Automated scoring replaces manual readability checks across large content pipelines
- **Consistent standards**: One package enforces the same readability thresholds across your whole codebase

---

## Quick Start

```ts
import { analyzeReadability } from '@power-seo/readability';

const result = analyzeReadability({
  text: 'Search engine optimization is the practice of improving web pages to rank higher in search results. Good content uses clear sentences and relevant keywords.',
});

console.log(result.fleschReadingEase.score); // e.g. 58.4
console.log(result.fleschKincaidGrade.score); // e.g. 10.2
console.log(result.overall.status); // 'improvement'
console.log(result.overall.message); // 'Content may be difficult for some readers...'
```

**What you should see**

- A numeric score for each of the five algorithms
- A composite `overall.status` of `'good'`, `'improvement'`, or `'error'`
- A human-readable `message` for each score to surface in dashboards or editorial UIs

---

## Installation

```bash
npm i @power-seo/readability
# or
yarn add @power-seo/readability
# or
pnpm add @power-seo/readability
# or
bun add @power-seo/readability
```

---

## Framework Compatibility

**Supported**

- ✅ **Node.js** — v18+, works in server-side pipelines and CMS build steps
- ✅ **React / Next.js (App Router & Pages Router)** — use in Server Components or API Routes
- ✅ **Remix** — use in loaders or actions
- ✅ **Browser (vanilla JS/TS)** — no DOM APIs required; runs in any JS environment
- ✅ **Static site generators** (Astro, Gatsby, Eleventy) — run at build time

**Environment notes**

- **SSR/SSG:** Fully supported — no browser globals used
- **Edge runtime:** Supported — pure JS with no Node.js-only APIs
- **Browser-only usage:** Supported — bundle size is minimal with tree-shaking

---

## Use Cases

- **Programmatic SEO pages** — score thousands of auto-generated pages at build time
- **CMS editorial dashboards** — show live readability scores as editors write content
- **SaaS marketing sites** — gate content publication behind a minimum readability threshold
- **Blog / content pipelines** — CI check that fails when content is too complex
- **E-commerce product descriptions** — ensure product copy is accessible to your target audience
- **Multi-tenant SaaS portals** — per-tenant readability rules for white-label content
- **Educational platforms** — match content reading level to target student grade
- **ERP internal documentation** — enforce plain-language standards for internal guides

---

## Example Score Result (Before / After)

```text
Before (first draft — too complex):
- Flesch Reading Ease:   32.1  → 'error'    (very difficult; college level)
- Flesch-Kincaid Grade:  14.3  → 'error'    (postgraduate reading level)
- Gunning Fog:           15.7  → 'error'    (too many complex words)
- Overall:               'error'

After (simplified rewrite):
- Flesch Reading Ease:   64.8  → 'good'     (standard; 7th–8th grade)
- Flesch-Kincaid Grade:   7.9  → 'good'     (accessible to general audiences)
- Gunning Fog:            9.2  → 'good'     (appropriate complexity)
- Overall:               'good'
```

---

## Implementation Best Practices

- **Target Flesch Reading Ease 60–70** for most web content (7th–8th grade level)
- **Keep Gunning Fog below 12** — above 12 means your content requires college-level reading
- **Use `analyzeReadability()`** for full pipeline scoring; use individual functions when you need only one metric in a hot path
- **Strip HTML before scoring** — `analyzeReadability()` handles this automatically; individual functions expect plain text
- **Set per-content-type thresholds** — blog posts and landing pages should target lower grade levels than technical API docs
- **Surface scores in your CMS** — editors who see scores live produce better first drafts

---

## Architecture Overview

**Where it runs**

- **Build-time**: Score all pages during SSG/SSR builds; fail CI if thresholds not met
- **Runtime**: Score content in CMS editors or API routes for real-time feedback
- **CI/CD**: Integrate as a lint step to enforce readability standards per PR

**Data flow**

1. **Input**: Plain text string (or HTML — tags are stripped automatically)
2. **Analysis**: Text is tokenized; sentence, word, syllable, and character counts are computed
3. **Scoring**: Each of the five algorithms runs against the text statistics
4. **Output**: Typed score objects with numeric values, status labels, and human messages

---

## Features Comparison with Popular Packages

| Capability                             | `text-readability` | `readability-scores` | `flesch` | @power-seo/readability |
| -------------------------------------- | :----------------: | :------------------: | :------: | :--------------------: |
| Flesch Reading Ease                    |         ✅         |          ✅          |    ✅    |           ✅           |
| Flesch-Kincaid Grade                   |         ✅         |          ✅          |    ❌    |           ✅           |
| Gunning Fog Index                      |         ✅         |          ✅          |    ❌    |           ✅           |
| Coleman-Liau Index                     |         ✅         |          ✅          |    ❌    |           ✅           |
| Automated Readability Index            |         ✅         |          ✅          |    ❌    |           ✅           |
| Status labels (good/improvement/error) |         ❌         |          ❌          |    ❌    |           ✅           |
| Unified multi-algorithm API            |         ❌         |          ❌          |    ❌    |           ✅           |
| TypeScript-first with full types       |         ❌         |          ❌          |    ❌    |           ✅           |
| Zero runtime dependencies              |         ✅         |          ✅          |    ✅    |           ✅           |
| Tree-shakeable individual functions    |         ❌         |          ❌          |    ✅    |           ✅           |

---

## @power-seo Ecosystem

All 17 packages are independently installable — use only what you need.

### Ecosystem packages

| Package                                                                                    | Install                             | Description                                                             |
| ------------------------------------------------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------------- |
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core)                         | `npm i @power-seo/core`             | Framework-agnostic utilities, types, validators, and constants          |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react)                       | `npm i @power-seo/react`            | React SEO components — meta, Open Graph, Twitter Card, breadcrumbs      |
| [`@power-seo/meta`](https://www.npmjs.com/package/@power-seo/meta)                         | `npm i @power-seo/meta`             | SSR meta helpers for Next.js App Router, Remix v2, and generic SSR      |
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema)                     | `npm i @power-seo/schema`           | Type-safe JSON-LD structured data — 20 builders + 18 React components   |
| [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis) | `npm i @power-seo/content-analysis` | Yoast-style SEO content scoring engine with React components            |
| [`@power-seo/readability`](https://www.npmjs.com/package/@power-seo/readability)           | `npm i @power-seo/readability`      | Readability scoring — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI    |
| [`@power-seo/preview`](https://www.npmjs.com/package/@power-seo/preview)                   | `npm i @power-seo/preview`          | SERP, Open Graph, and Twitter/X Card preview generators                 |
| [`@power-seo/sitemap`](https://www.npmjs.com/package/@power-seo/sitemap)                   | `npm i @power-seo/sitemap`          | XML sitemap generation, streaming, index splitting, and validation      |
| [`@power-seo/redirects`](https://www.npmjs.com/package/@power-seo/redirects)               | `npm i @power-seo/redirects`        | Redirect engine with Next.js, Remix, and Express adapters               |
| [`@power-seo/links`](https://www.npmjs.com/package/@power-seo/links)                       | `npm i @power-seo/links`            | Link graph analysis — orphan detection, suggestions, equity scoring     |
| [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit)                       | `npm i @power-seo/audit`            | Full SEO audit engine — meta, content, structure, performance rules     |
| [`@power-seo/images`](https://www.npmjs.com/package/@power-seo/images)                     | `npm i @power-seo/images`           | Image SEO — alt text, lazy loading, format analysis, image sitemaps     |
| [`@power-seo/ai`](https://www.npmjs.com/package/@power-seo/ai)                             | `npm i @power-seo/ai`               | LLM-agnostic AI prompt templates and parsers for SEO tasks              |
| [`@power-seo/analytics`](https://www.npmjs.com/package/@power-seo/analytics)               | `npm i @power-seo/analytics`        | Merge GSC + audit data, trend analysis, ranking insights, dashboard     |
| [`@power-seo/search-console`](https://www.npmjs.com/package/@power-seo/search-console)     | `npm i @power-seo/search-console`   | Google Search Console API — OAuth2, service account, URL inspection     |
| [`@power-seo/integrations`](https://www.npmjs.com/package/@power-seo/integrations)         | `npm i @power-seo/integrations`     | Semrush and Ahrefs API clients with rate limiting and pagination        |
| [`@power-seo/tracking`](https://www.npmjs.com/package/@power-seo/tracking)                 | `npm i @power-seo/tracking`         | GA4, Clarity, PostHog, Plausible, Fathom — scripts + consent management |

### Ecosystem vs alternatives

| Need                    | Common approach                          | @power-seo approach                                          |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| Readability scoring     | `text-readability`, `readability-scores` | `@power-seo/readability` — typed, multi-algo, status labels  |
| Content quality scoring | Yoast SEO plugin                         | `@power-seo/content-analysis` — headless, framework-agnostic |
| SEO audit               | Lighthouse, Screaming Frog               | `@power-seo/audit` — programmatic, CI-friendly               |
| Metadata                | Next.js metadata API                     | `@power-seo/meta` + validation rules                         |

---

## Enterprise Integration

**Multi-tenant SaaS**

- **Per-tenant thresholds**: Configure different minimum readability scores per tenant type (e.g. consumer vs. B2B)
- **Audit pipelines**: Run readability checks per page type in CI with structured JSON output
- **Editorial dashboards**: Surface scores per content block in headless CMS integrations

**ERP / internal portals**

- **Enforce plain-language standards** for internal knowledge bases and SOPs
- **Compliance documentation**: Ensure regulatory content meets reading level requirements
- **Training material scoring**: Match content complexity to target employee role

**Recommended integration pattern**

- Run `analyzeReadability()` in CI on all content files
- Fail build on `overall.status === 'error'`
- Export scores to JSON artifacts for trend tracking
- Track per-page readability trends in dashboards

---

## Scope and Limitations

**This package does**

- ✅ Score plain text or HTML content against 5 readability algorithms
- ✅ Return structured, typed results with numeric scores and status labels
- ✅ Work in any JavaScript environment (Node.js, browser, edge)

**This package does not**

- ❌ Rewrite or suggest rewrites of content (use `@power-seo/ai` for AI-assisted suggestions)
- ❌ Check grammar, spelling, or factual accuracy
- ❌ Perform SEO keyword analysis (use `@power-seo/content-analysis` for that)

---

## API Reference

### `analyzeReadability(input)`

```ts
function analyzeReadability(input: ReadabilityInput): ReadabilityOutput;
```

#### `ReadabilityInput`

| Prop   | Type     | Description                                                  |
| ------ | -------- | ------------------------------------------------------------ |
| `text` | `string` | Plain text or HTML string (HTML tags stripped automatically) |

#### `ReadabilityOutput`

| Field                  | Type             | Description                        |
| ---------------------- | ---------------- | ---------------------------------- |
| `fleschReadingEase`    | `AlgorithmScore` | Flesch Reading Ease result         |
| `fleschKincaidGrade`   | `AlgorithmScore` | Flesch-Kincaid Grade Level result  |
| `gunningFog`           | `AlgorithmScore` | Gunning Fog Index result           |
| `colemanLiau`          | `AlgorithmScore` | Coleman-Liau Index result          |
| `automatedReadability` | `AlgorithmScore` | Automated Readability Index result |
| `stats`                | `TextStatistics` | Underlying text statistics         |
| `overall`              | `AnalysisResult` | Composite status and message       |

### Individual Algorithm Functions

All accept `TextStatistics` and return `AlgorithmScore`:

```ts
function fleschReadingEase(stats: TextStatistics): AlgorithmScore;
function fleschKincaidGrade(stats: TextStatistics): AlgorithmScore;
function gunningFog(stats: TextStatistics): AlgorithmScore;
function colemanLiau(stats: TextStatistics): AlgorithmScore;
function automatedReadability(stats: TextStatistics): AlgorithmScore;
```

### Types

| Type                | Definition                                                         |
| ------------------- | ------------------------------------------------------------------ |
| `ReadabilityInput`  | `{ text: string }`                                                 |
| `ReadabilityOutput` | Full result with all five algorithm scores + stats + overall       |
| `TextStatistics`    | `{ sentences, words, syllables, characters, avgWordsPerSentence }` |
| `AlgorithmScore`    | `{ score: number; status: AnalysisStatus; message: string }`       |
| `AnalysisStatus`    | `'good' \| 'improvement' \| 'error'`                               |
| `AnalysisResult`    | `{ status: AnalysisStatus; message: string }`                      |

### Score interpretation

| Flesch Reading Ease | Difficulty       | Typical Audience                               |
| ------------------- | ---------------- | ---------------------------------------------- |
| 90–100              | Very Easy        | 5th grade                                      |
| 70–90               | Easy             | 6th grade                                      |
| 60–70               | Standard         | 7th–8th grade — **ideal for most web content** |
| 50–60               | Fairly Difficult | High school                                    |
| 30–50               | Difficult        | College                                        |
| 0–30                | Very Difficult   | Academic / professional                        |

| Grade Level Score | Status                                       |
| ----------------- | -------------------------------------------- |
| ≤ 8               | `'good'` — accessible to general audiences   |
| 9–12              | `'improvement'` — consider simplifying       |
| > 12              | `'error'` — too complex for most web readers |

---

## Contributing

- Issues: [github.com/cybercraftbd/power-seo/issues](https://github.com/cybercraftbd/power-seo/issues)
- PRs: [github.com/cybercraftbd/power-seo/pulls](https://github.com/cybercraftbd/power-seo/pulls)
- Development setup:
  1. `pnpm i`
  2. `pnpm build`
  3. `pnpm test`

**Release workflow**

```bash
npm version patch|minor|major
npm run build
npm publish --access public
```

---

## About CyberCraft Bangladesh

**CyberCraft Bangladesh** is a Bangladesh-based enterprise-grade software engineering company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

|                      |                                                                |
| -------------------- | -------------------------------------------------------------- |
| **Website**          | [ccbd.dev](https://ccbd.dev)                                   |
| **GitHub**           | [github.com/cybercraftbd](https://github.com/cybercraftbd)     |
| **npm Organization** | [npmjs.com/org/power-seo](https://www.npmjs.com/org/power-seo) |
| **Email**            | [info@ccbd.dev](mailto:info@ccbd.dev)                          |

© 2026 CyberCraft Bangladesh · Released under the [MIT License](../../LICENSE)

---

## License

MIT

---

## Keywords

```text
seo, readability, flesch-kincaid, gunning-fog, coleman-liau, ari, automated-readability-index,
reading-ease, content-scoring, text-analysis, typescript, nodejs, content-seo, editorial-tools
```
