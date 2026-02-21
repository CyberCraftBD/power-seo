# README Template — @power-seo/[package] - TAG line

> Use this template for any `@power-seo/*` package. Replace placeholders like **[application]**, **[package]**, **[repo-url]**, etc.

---

## Overview
**[application]** is a **[one-line definition]** for **[target users/platform]** that helps you **[primary outcome]**.

**What it does**
- ✅ **[Capability #1]**
- ✅ **[Capability #2]**
- ✅ **[Capability #3]**

**What it is not**
- ❌ **[Non-goal #1]**
- ❌ **[Non-goal #2]**

**Recommended for**
- **[Primary audience]** (e.g., Next.js SaaS apps, programmatic SEO sites, ERP portals)

---

## Why [application] Matters
Explain the *problem* first (not your library). Keep this section short and high-impact.

**The problem**
- **[Pain point #1]** (e.g., image issues degrade Core Web Vitals)
- **[Pain point #2]** (e.g., missing metadata reduces discoverability)
- **[Pain point #3]** (e.g., poor accessibility signals)

**Why developers care**
- **Performance:** **[e.g., LCP/CLS improvements]**
- **SEO:** **[e.g., indexing, crawl efficiency]**
- **UX:** **[e.g., mobile experience, layout stability]**

> Tip: Mention the exact audit signals you target (LCP, CLS, accessibility, discoverability), but keep it outcomes-focused.

---

## Key Features
List features as *capabilities*, not implementation details.

- **[Feature #1]** — **[what it enables in one line]**
- **[Feature #2]** — **[what it enables in one line]**
- **[Feature #3]** — **[what it enables in one line]**
- **[Feature #4]** — **[what it enables in one line]**
- **Type-safe API** — TypeScript-first and IDE-friendly
- **Production-ready** — stable defaults and clear outputs

> Tip: Keep this to 6–10 bullets. Put deep details in "Core Capabilities" / "API Reference".

---

## Benefits of Using [application]
Write this as "What you get" (measurable outcomes).

- **Improved performance**: **[e.g., reduce LCP delays / reduce CLS risk]**
- **Better discoverability**: **[e.g., improve image search visibility / indexing signals]**
- **Safer implementation**: **[e.g., detect risky patterns early]**
- **Faster delivery**: **[e.g., automated checks instead of manual review]**

> Tip: If you have benchmarks, add them. If you don't, use "can help" language.

---

## Quick Start
Show value in **10–20 seconds**.

```ts
// Example only — replace with your real API
import { auditSomething } from "@power-seo/[package]";

const result = auditSomething({
  html: "<html>...</html>",
  url: "https://example.com/page",
});

console.log(result);
```

**What you should see**
- **[Example output #1]**
- **[Example output #2]**

> Tip: Include ONE minimal example. Put advanced examples under "Core Capabilities".

---

## Installation
Provide all the common package managers.

```bash
npm i @power-seo/[package]
# or
yarn add @power-seo/[package]
# or
pnpm add @power-seo/[package]
# or
bun add @power-seo/[package]
```

---

## Framework Compatibility
List where it works and any constraints.

**Supported**
- ✅ Next.js (**App Router / Pages Router**) — **[how]**
- ✅ React — **[how]**
- ✅ Node.js — **[runtime versions]**
- ✅ Static site generators — **[how]**

**Environment notes**
- **SSR/SSG:** **[supported / not supported]**
- **Edge runtime:** **[supported / not supported]**
- **Browser-only usage:** **[supported / not supported]**

---

## Use Cases
Add 6–10 bullets that match your customers.

- **Programmatic SEO pages**
- **SaaS marketing sites**
- **E-commerce listings**
- **Blogs / CMS content**
- **Landing pages**
- **Multi-tenant portals**
- **ERP dashboards**
- **[Your unique use case]**

---

## Example Audit Result (Before / After)
This makes adoption easier. Keep it simple and credible.

```text
Before:
- LCP: [e.g., 3.8s]
- CLS: [e.g., 0.21]
- Issues: [e.g., lazy-load hero image, missing dimensions]

After:
- LCP: [e.g., 2.1s]
- CLS: [e.g., 0.03]
- Fixes: [e.g., eager-load hero image, add width/height]
```

> Tip: If you cannot claim numbers, show "before/after issues fixed" instead of metrics.

---

## Implementation Best Practices
Give guidance to prevent misuse and support SEO outcomes.

- **[Best practice #1]** (e.g., avoid lazy-loading above-the-fold images)
- **[Best practice #2]** (e.g., always define width/height for layout stability)
- **[Best practice #3]** (e.g., meaningful alt text for non-decorative images)
- **[Best practice #4]** (e.g., prefer WebP/AVIF when possible)
- **[Best practice #5]** (e.g., keep sitemaps up-to-date)

---

## Architecture Overview
Explain how it fits in real systems.

**Where it runs**
- **Build-time**: **[what you do at build time]**
- **Runtime**: **[what you do at runtime]**
- **CI/CD**: **[how to enforce checks]**

**Data flow**
1. **Input**: **[HTML/content/assets]**
2. **Analysis**: **[what is computed]**
3. **Output**: **[reports/sitemaps/recommendations]**
4. **Action**: **[how teams fix]**

> Tip: Add a diagram later if you want, but keep this section readable in text.

---

## Features Comparison with Popular Packages
Choose 3–5 popular packages your audience already knows. Be fair.

| Capability | [Popular #1] | [Popular #2] | [Popular #3] | @power-seo/[package] |
|---|---:|---:|---:|---:|
| [Capability A] | ❌/✅ | ❌/✅ | ❌/✅ | ✅ |
| [Capability B] | ❌/✅ | ❌/✅ | ❌/✅ | ✅ |
| [Capability C] | ❌/✅ | ❌/✅ | ❌/✅ | ✅ |
| [Capability D] | ❌/✅ | ❌/✅ | ❌/✅ | ✅ |

**How to write this section**
- Compare **capabilities**, not "who is better".
- If another tool does something well, say so.
- Clarify whether your package is **complementary** or a **replacement**.

---

## @power-seo Ecosystem with Popular Package Comparison
Show your ecosystem first, then how it maps against popular alternatives.

### Ecosystem packages
- `@power-seo/core` — **[what it provides]**
- `@power-seo/meta` — **[what it provides]**
- `@power-seo/schema` — **[what it provides]**
- `@power-seo/images` — **[what it provides]**
- `@power-seo/sitemap` — **[what it provides]**

### Ecosystem vs alternatives (example)
| Need | Common approach | @power-seo approach |
|---|---|---|
| Metadata | Next.js metadata | `@power-seo/meta` + rules |
| Schema JSON-LD | `next-seo` | `@power-seo/schema` |
| Sitemap | `next-sitemap` | `@power-seo/sitemap` + image support |
| Image analysis | ad-hoc audits | `@power-seo/images` |

> Tip: This section builds trust and encourages "suite adoption".

---

## Enterprise Integration
This is for SaaS/ERP users. Keep it practical.

**Multi-tenant SaaS**
- **Tenant-aware config**: **[how configs vary by tenant]**
- **Per-tenant sitemaps**: **[how generated]**
- **Audit pipelines**: **[CI checks per tenant/site]**

**ERP / internal portals**
- **Performance rules** for heavy dashboards
- **SEO only where needed** (public modules)
- **Compliance logs** for audits

**Recommended integration pattern**
- Run audits in **CI**
- Fail build on **critical issues**
- Export **reports** to artifacts (e.g., JSON)
- Track issues in **Jira/Trello/GitHub Issues**

---

## Scope and Limitations
Be transparent. This increases trust.

**This package does**
- ✅ **[scope item #1]**
- ✅ **[scope item #2]**
- ✅ **[scope item #3]**

**This package does not**
- ❌ **[non-scope item #1]**
- ❌ **[non-scope item #2]**
- ❌ **[non-scope item #3]**

---

## API Reference
Keep this section as your "source of truth".

**Exports**
- `functionA()` — **[what it does]**
- `functionB()` — **[what it does]**
- `type X` — **[what it is]**

**Examples**
- Basic: **[link or snippet]**
- Advanced: **[link or snippet]**

> Tip: Put large prop tables here. Keep the top of README short.

---

## Contributing
Tell people how to help.

- Issues: **[issue tracker URL]**
- PRs: **[PR guide URL]**
- Development setup:
  1. `pnpm i`
  2. `pnpm build`
  3. `pnpm test`

**Release workflow**
- `npm version patch|minor|major`
- `npm publish --access public`

---

## About CyberCraft Bangladesh
CyberCraft Bangladesh is an independent software technology company specializing in **Full-Stack SEO**, web development, digital marketing, and enterprise **SaaS & ERP** application development.

- Website: https://ccbd.dev
- GitHub: https://github.com/cybercraftbd
- npm: https://www.npmjs.com/org/ccbd-seo
- Email: info@ccbd.dev

---

## License
**[MIT]** / **[Apache-2.0]** / **[Your License]**

---

## Keywords
Add keywords that improve npm discoverability (comma-separated).

```text
seo, technical-seo, full-stack-seo, nextjs, core-web-vitals, lcp, cls, images, image-seo, sitemap, structured-data, schema, saas, erp
```

---

# Development Instructions (How to Develop & Maintain This Package)

## A. Local development (recommended workspace layout)
Suggested monorepo layout:

```text
SEO/
  package.json
  packages/
    images/
    meta/
    core/
```

From repo root:
```bash
pnpm -r install
pnpm -r build
pnpm -r test
```

## B. Package build rules (must-have)
1. **Ship compiled output** (`dist/`) not TS source.
2. Ensure `package.json` includes:
   - `"main"` pointing to `dist/index.cjs` or `dist/index.js`
   - `"types"` pointing to `dist/index.d.ts`
   - `"files": ["dist", "README.md", "package.json"]`

## C. Versioning
- Use SemVer:
  - `patch`: bugfix
  - `minor`: new backward-compatible feature
  - `major`: breaking change

Commands:
```bash
npm version patch
npm run build
npm publish --access public
```

## D. Quality checks (to reduce production issues)
Add scripts:
- `lint` (eslint)
- `typecheck` (tsc --noEmit)
- `test` (vitest/jest)
- `build` (tsup/tsc)

CI should run:
- `install → lint → typecheck → test → build`

## E. Publishing tips (avoid common npm issues)
- Always run: `npm whoami` before publishing.
- If 2FA is enabled, use a granular token for CI.
- Never retry publish repeatedly; rate-limits can trigger.
- If publish fails due to version existing: bump version and retry once.

---

**Template version:** 1.0
