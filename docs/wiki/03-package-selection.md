# Package Selection Guide

Choose the right power-seo packages for your specific use case.

## Quick Decision Tree

```
What's your primary goal?
│
├─→ Meta tags & SEO basics?
│   └─→ Use @power-seo/meta (Next.js/Remix) or @power-seo/react (SPA)
│
├─→ Content marketing / Blog?
│   └─→ Add @power-seo/schema + @power-seo/preview
│
├─→ Content quality assurance?
│   └─→ Add @power-seo/content-analysis + @power-seo/readability
│
├─→ eCommerce product pages?
│   └─→ Add @power-seo/schema + @power-seo/images + @power-seo/sitemap
│
├─→ Full SEO auditing?
│   └─→ Add @power-seo/audit
│
├─→ Analytics & reporting?
│   └─→ Add @power-seo/search-console + @power-seo/analytics
│
└─→ Multi-language site?
    └─→ Add hreflang from @power-seo/react + @power-seo/redirects
```

---

## Packages by Feature

### Foundational

**@power-seo/core** (ALWAYS NEEDED indirectly)
- Zero-dependency utilities and types
- Used internally by other packages
- Never directly imported in most cases
- ~3 KB

### Meta Tags & Basic SEO

**@power-seo/meta**
- **For:** Next.js 14+ or Remix v2
- **Size:** ~2 KB
- **Features:**
  - Type-safe metadata builders
  - Advanced robots directives
  - Canonical URLs
- **When to use:** Any SSR app with Next.js or Remix
- **Skip if:** Using React SPA (use @power-seo/react instead)

**@power-seo/react**
- **For:** React SPAs (Vite, CRA, Gatsby)
- **Size:** ~8 KB
- **Features:**
  - React components for meta tags
  - Breadcrumb component
  - Hreflang support
- **When to use:** Client-side only React apps
- **Skip if:** Using Next.js/Remix (use @power-seo/meta instead)

### Structured Data

**@power-seo/schema**
- **For:** Any project needing JSON-LD
- **Size:** ~8 KB
- **Features:**
  - 23 schema builders (Article, Product, FAQ, etc.)
  - Schema validation
  - React components for schema rendering
- **When to use:** Always (for rich snippets in Google)
- **Skip if:** Not targeting rich results

### Content Quality

**@power-seo/content-analysis**
- **For:** Content-heavy sites needing SEO scoring
- **Size:** ~12 KB
- **Features:**
  - Yoast-style SEO scoring (0-100)
  - Keyphrase density analysis
  - Heading structure validation
  - React components for live feedback
- **When to use:** Blog platforms, CMS, content editors
- **Skip if:** Static site with no editorial workflow

**@power-seo/readability**
- **For:** Sites where text clarity matters
- **Size:** ~6 KB
- **Features:**
  - Flesch-Kincaid grade level
  - Gunning Fog index
  - Coleman-Liau index
  - Text complexity analysis
- **When to use:** Educational content, accessibility-focused sites
- **Skip if:** Not concerned with reading level

### Social Media & Previews

**@power-seo/preview**
- **For:** Social sharing optimization
- **Size:** ~8 KB
- **Features:**
  - SERP preview (Google)
  - Open Graph preview (Facebook)
  - Twitter Card preview
  - Pixel-accurate truncation
- **When to use:** Any public-facing content
- **Skip if:** Not targeting social shares

### XML Sitemaps

**@power-seo/sitemap**
- **For:** Search engine indexing
- **Size:** ~5 KB
- **Features:**
  - XML sitemap generation
  - Streaming for large sites (50k+ URLs)
  - Sitemap splitting
  - Next.js adapter
- **When to use:** Always (for search engines)
- **Skip if:** Using static site generator with built-in sitemap

### Redirects

**@power-seo/redirects**
- **For:** URL migrations and rewrites
- **Size:** ~4 KB
- **Features:**
  - Redirect rule matching
  - Next.js and Remix adapters
  - Regex pattern support
  - Redirect chain detection
- **When to use:** Site migrations, URL restructuring
- **Skip if:** No redirect needs

### Link Analysis

**@power-seo/links**
- **For:** Internal link optimization
- **Size:** ~5 KB
- **Features:**
  - Link graph analysis
  - Orphan page detection
  - Link equity scoring (PageRank-style)
  - Link suggestions
- **When to use:** Large sites (100+ pages)
- **Skip if:** Small site with simple structure

### Full SEO Audit

**@power-seo/audit**
- **For:** Comprehensive SEO checking
- **Size:** ~15 KB
- **Features:**
  - 30+ audit rules
  - Meta, content, structure, performance checks
  - 0-100 score with categories
  - Actionable recommendations
- **When to use:** Quality assurance, CI/CD gates
- **Skip if:** Using individual packages for specific checks

### Image SEO

**@power-seo/images**
- **For:** Image optimization and analysis
- **Size:** ~6 KB
- **Features:**
  - Alt text validation
  - Lazy loading audit
  - Format recommendation (WebP/AVIF)
  - Image sitemap generation
- **When to use:** Image-heavy sites (eCommerce, galleries)
- **Skip if:** Text-heavy site with few images

### AI-Powered Tools

**@power-seo/ai**
- **For:** LLM-powered SEO assistance
- **Size:** ~4 KB
- **Features:**
  - Meta description generation prompts
  - Title suggestion prompts
  - Content analysis prompts
  - LLM-agnostic (works with OpenAI, Anthropic, etc.)
- **When to use:** CMS with AI features, content tools
- **Skip if:** No LLM integration needed

### Google Search Console

**@power-seo/search-console**
- **For:** GSC API integration
- **Size:** ~7 KB
- **Features:**
  - OAuth2 and service account auth
  - Search analytics queries
  - URL inspection
  - Sitemap management
- **When to use:** Analytics dashboards, reporting tools
- **Skip if:** Not integrating with GSC

### Analytics & Dashboard

**@power-seo/analytics**
- **For:** Analytics data merging and visualization
- **Size:** ~8 KB
- **Features:**
  - GSC + audit data merging
  - Position tracking
  - Dashboard data builder
  - Trend analysis
- **When to use:** SEO dashboards, reporting platforms
- **Skip if:** Not building analytics tools

### Integrations (Semrush / Ahrefs)

**@power-seo/integrations**
- **For:** Third-party SEO data
- **Size:** ~6 KB
- **Features:**
  - Semrush API client
  - Ahrefs API client
  - Rate limiting and pagination
  - Domain and keyword data
- **When to use:** Competitive analysis, keyword research tools
- **Skip if:** Not using Semrush/Ahrefs

### Analytics Tracking

**@power-seo/tracking**
- **For:** Analytics script management with consent
- **Size:** ~8 KB
- **Features:**
  - GA4, Clarity, PostHog, Plausible, Fathom
  - GDPR consent management
  - Conditional script loading
- **When to use:** Analytics tracking with privacy compliance
- **Skip if:** Using analytics directly or no tracking needed

---

## Installation Presets

### Preset 1: Minimal Setup (10 KB)

For basic Next.js site:

```bash
npm install @power-seo/meta @power-seo/schema
```

Includes:
- Meta tags ✓
- Structured data ✓
- No content analysis

### Preset 2: Content Marketing (35 KB)

For blog/content site:

```bash
npm install @power-seo/meta @power-seo/schema \
  @power-seo/content-analysis @power-seo/readability \
  @power-seo/preview @power-seo/audit
```

Includes:
- Meta tags ✓
- Structured data ✓
- Content scoring ✓
- Readability analysis ✓
- SERP previews ✓
- SEO audit ✓

### Preset 3: eCommerce (40 KB)

For product catalog:

```bash
npm install @power-seo/meta @power-seo/schema \
  @power-seo/images @power-seo/sitemap \
  @power-seo/audit @power-seo/redirects \
  @power-seo/links
```

Includes:
- Meta tags ✓
- Product schema ✓
- Image SEO ✓
- Sitemaps ✓
- Audits ✓
- Redirects ✓
- Link analysis ✓

### Preset 4: Analytics & Reporting (50 KB)

For SEO dashboard:

```bash
npm install @power-seo/audit \
  @power-seo/search-console @power-seo/analytics \
  @power-seo/integrations @power-seo/tracking
```

Includes:
- Audits ✓
- GSC integration ✓
- Analytics dashboard ✓
- Semrush/Ahrefs ✓
- Analytics tracking ✓

### Preset 5: Full Toolkit (120 KB)

Everything:

```bash
npm install @power-seo/core @power-seo/react @power-seo/meta \
  @power-seo/schema @power-seo/content-analysis @power-seo/readability \
  @power-seo/preview @power-seo/sitemap @power-seo/redirects \
  @power-seo/links @power-seo/audit @power-seo/images \
  @power-seo/ai @power-seo/analytics @power-seo/search-console \
  @power-seo/integrations @power-seo/tracking
```

---

## Bundle Size Comparison

For a Next.js blog with typical setup:

| Setup | Bundle | Features |
|-------|--------|----------|
| @power-seo/meta | 2 KB | Meta tags |
| + @power-seo/schema | 8 KB | + Structured data |
| + content-analysis | 12 KB | + Content scoring |
| + readability | 6 KB | + Readability |
| + preview | 8 KB | + SERP previews |
| + audit | 15 KB | + Full audit |
| + images | 6 KB | + Image SEO |
| **Total** | **57 KB** | **Full blog setup** |

*Gzipped sizes; bundlers further optimize via tree-shaking*

---

## Framework Recommendations

### Next.js 14+ (App Router)

**Always use:**
- @power-seo/meta
- @power-seo/schema

**Likely to use:**
- @power-seo/sitemap
- @power-seo/redirects

**Optionally use:**
- @power-seo/content-analysis (for blog)
- @power-seo/audit (for QA)
- @power-seo/search-console (for analytics)

### Remix v2

**Always use:**
- @power-seo/meta
- @power-seo/schema

**Likely to use:**
- @power-seo/redirects (built-in Remix pattern)
- @power-seo/audit

### React SPA (Vite/CRA)

**Always use:**
- @power-seo/react
- @power-seo/schema

**Note:** Cannot use @power-seo/meta (SSR-only)

### Node.js Backend

**Use for tools:**
- @power-seo/core (utilities)
- @power-seo/sitemap (generation)
- @power-seo/audit (auditing)

**Cannot use:**
- @power-seo/react (React-only)
- @power-seo/meta (SSR-only)

---

## Decision Checklist

- [ ] Do you have Next.js or Remix? → Use @power-seo/meta
- [ ] Do you have React SPA? → Use @power-seo/react
- [ ] Do you need structured data? → Add @power-seo/schema
- [ ] Do you have a blog? → Add @power-seo/content-analysis
- [ ] Do you need SERP previews? → Add @power-seo/preview
- [ ] Do you have many URLs (100+)? → Add @power-seo/sitemap
- [ ] Do you have images? → Add @power-seo/images
- [ ] Do you do URL rewrites? → Add @power-seo/redirects
- [ ] Do you need SEO audits? → Add @power-seo/audit
- [ ] Do you track analytics? → Add @power-seo/search-console
- [ ] Do you have multi-language? → Add @power-seo/react for hreflang
- [ ] Do you need AI features? → Add @power-seo/ai

---

## Next Steps

Once you've selected your packages:

1. **[Quick Start](./02-quick-start.md)** - Get running in 5 minutes
2. **[Installation Setup](./01-installation-setup.md)** - Detailed setup instructions
3. **[Package Guides](./pkg-core.md)** - Deep dive into each package

