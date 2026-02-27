# Changelog

All notable changes to the `@power-seo` monorepo are documented here.

---

## [1.0.10] — 2026-02-26

### Summary

Comprehensive documentation overhaul, SVG asset library restructure, and API accuracy fixes across all 17 packages. No breaking changes.

---

### Documentation

#### Docs Site (`apps/docs/`)
- **17 package MDX files** (`packages/*.mdx`): fully rewritten with accurate API signatures, type tables, live examples
- **`index.mdx`**: expanded from 79 to ~200 lines — full Quick Start, ecosystem overview, feature highlights
- **`guides/nextjs.mdx`**: fixed `generateSitemap` call (added required `hostname` parameter)
- **`guides/remix.mdx`**: fixed `toJsonLdString` usage documentation
- **`guides/migration.mdx`**: added Yoast SEO migration section + 9 previously missing packages (links, redirects, readability, preview, images, ai, analytics, search-console, integrations)

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
