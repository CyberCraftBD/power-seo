# Changelog

All notable changes to the `@power-seo` monorepo are documented here.

---

## [1.0.10] — 2026-02-26

### Summary

Comprehensive documentation overhaul, SVG asset library restructure, and API accuracy fixes across all 17 packages. No breaking changes.

---

### Documentation

#### Keywords (all 17 packages)

- Expanded `keywords` array in every `package.json` to ~20 targeted, search-relevant npm keywords
- `content-analysis` already had 20; all other 16 packages expanded from 5–11 up to 20 keywords
- Curated per-package to reflect purpose: framework integrations, algorithms, tool names, use cases

#### Package READMEs (all 17 packages)

- Standardized all package READMEs to follow the canonical style guide
- Added `## Why X?` section with `| | Without | With |` comparison table
- Added `## Comparison` table benchmarking against alternatives (Yoast SEO, next-seo, schema-dts, etc.)
- Added `## Architecture Overview` section with design rationale
- Added `## Supply Chain Security` section documenting provenance attestation
- Added `## The @power-seo Ecosystem` cross-reference table for all 17 packages
- Added `## Use Cases` with realistic real-world scenarios
- Removed boilerplate sections: Overview, Contributing, License (redundant)

#### Root README

- Complete rewrite: 13 Quick Start code sections covering all major packages
- Added 5 real-world use cases (Next.js blog, e-commerce, SaaS, local business, enterprise)
- Integrated 21 SVG asset references throughout the document
- Added architecture diagram and ecosystem overview

#### Docs Site (`apps/docs/`)

- **17 package MDX files** (`packages/*.mdx`): fully rewritten with accurate API signatures, type tables, live examples
- **`index.mdx`**: expanded from 79 to ~200 lines — full Quick Start, ecosystem overview, feature highlights
- **`guides/nextjs.mdx`**: fixed `generateSitemap` call (added required `hostname` parameter)
- **`guides/remix.mdx`**: fixed `toJsonLdString` usage documentation
- **`guides/migration.mdx`**: added Yoast SEO migration section + 9 previously missing packages (links, redirects, readability, preview, images, ai, analytics, search-console, integrations)

---

### Assets

#### SVG Image Library (`image/`)

Restructured from flat directory to per-package subdirectories. Added 120+ new SVG files:

| Package            | New Files                                                                       |
| ------------------ | ------------------------------------------------------------------------------- |
| `ai`               | banner, comparison, llm-agnostic-benefit, parsing-accuracy, roi, suggestions-ui |
| `analytics`        | banner, comparison, dashboard-ui, merge-benefit, roi, trend-accuracy            |
| `audit`            | banner, comparison, report-ui, roi, rules-accuracy, site-audit-benefit          |
| `content-analysis` | checks-accuracy, comparison, editor-ui, roi, yoast-replacement-benefit          |
| `core`             | banner, comparison, roi, type-safety                                            |
| `images`           | audit-ui, banner, comparison, cwv-benefit, format-accuracy, roi                 |
| `integrations`     | banner, comparison, roi, universal-benefit, zero-lock-benefit                   |
| `links`            | banner, comparison, crawl-ui, discovery-benefit, roi, seo-benefit               |
| `meta`             | banner, comparison, nextjs-benefit, remix-benefit, roi, ssr-benefit             |
| `preview`          | banner, comparison, preview-ui, roi, serp-accuracy, validation-benefit          |
| `react`            | banner, comparison, roi, ssr-benefit, treeshake-benefit, typesafe-benefit       |
| `readability`      | banner, comparison, flesch-ui, passive-voice-benefit, roi, sentence-benefit     |
| `redirects`        | banner, comparison,301-benefit, framework-benefit, roi, tracking-ui             |
| `schema`           | banner, comparison, jsonld-ui, roi, types-benefit, validation-benefit           |
| `search-console`   | banner, comparison, ctr-benefit, gsc-ui, rank-benefit, roi                      |
| `sitemap`          | banner, comparison, crawl-benefit, nextjs-benefit, roi, sitemap-ui              |
| `tracking`         | banner, comparison, consent-benefit, events-ui, roi, typesafe-benefit           |

Removed obsolete per-feature SVGs that were replaced by the new standardized set.

---

### Bug Fixes (API documentation accuracy)

- **`guides/nextjs.mdx`**: `generateSitemap` now shown with required `hostname` field
- **`guides/nextjs.mdx`**: Article schema `image` field corrected to `string | ImageObject` type
- **`guides/remix.mdx`**: `toJsonLdString` documented as XSS-safe (escapes `<`, `>`, `&` to Unicode)
- **`guides/migration.mdx`**: `focusKeyphrase` field name corrected (was `keyphrase` in old docs)
- **`packages/preview.mdx`**: `TITLE_MAX_PIXELS = 580` (not 600 as previously documented)
- **`packages/schema.mdx`**: `validateSchema` return type corrected to `{ valid, issues: ValidationIssue[] }` (not `errors`)

---

### Internal

- All packages remain at semantic version parity after this release
- `workspace:*` internal dependencies are resolved to exact published versions at publish time by pnpm
- Supply chain: all packages published with `--provenance` flag for npm attestation

---

## [1.0.9] and earlier

See individual package changelogs and git history for pre-1.0.10 changes.
