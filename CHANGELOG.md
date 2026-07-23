# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.17] - 2026-07-23

### Fixed

- **`@power-seo/core`** — `stripHtml` no longer truncates all remaining text when a `<script>`/`<style>` tag has no closing tag (only the opening tag is removed), fixing silent content loss for checks that re-strip entity-decoded prose mentioning `<script>` (#148). Inline tags (`<b>`, `<em>`, `<a>`, `<code>`, …) no longer insert a space when stripped, so keyphrases spanning inline formatting match again and word counts are accurate; block tags still separate words (#157).
- **`@power-seo/core`** — `getParagraphs` no longer deletes content between the first and last `<br>` on a line (only two consecutive `<br>`s act as a separator), splits on all block-level closers (`</ul>`, `</ol>`, `</table>`, `</figure>`, `</blockquote>`, headings) instead of only `</p>`, and excludes `<pre>` blocks from paragraph analysis (#150, #160).
- **`@power-seo/core`** — Keyphrases with non-word edges ("C++", "C#", ".NET") now match: keyword occurrence/density regexes use lookaround boundaries instead of `\b` (#158). `extractTagContents('p')` no longer matches `<pre>`/`<picture>` as paragraph openers (#162). Sentence splitting no longer breaks after common abbreviations (e.g., i.e., etc., vs., Mr., Dr.) (#165). `ensureTrailingSlash` no longer produces a double slash on bare domains (#167).
- **`@power-seo/readability`** — Passive-voice detection requires an actual past participle (curated irregular list + suffix rule) instead of any word ending in t/en/ed, and the percentage is computed per sentence and clamped to 100 (#156). Transition words are matched with word boundaries, so "distillery"/"tribute" no longer count (#163). ARI and Coleman-Liau count letters and digits only (spaces/punctuation no longer inflate grades by ~5 levels), and Flesch/FKG are computed from raw ratios instead of pre-rounded averages (#165). `<pre>`/`<code>` content is excluded from all readability statistics (#151).
- **`@power-seo/content-analysis`** — Bare keyphrases are no longer classified navigational by insertion order: intent defaults to informational unless real navigational modifiers are present, which also removes fabricated "competing intents" warnings for short keyphrases (#149, #167). The `local` sub-type no longer triggers on any keyphrase containing "in" (#163).
- **`@power-seo/content-analysis`** — FAQ/PAA question detection requires a real question (ends with `?` or starts with an interrogative); answer paragraphs are searched only within the question's own section, so declarative headings with an unrelated trailing paragraph no longer score full AEO Q&A points (#155). TL;DR detection requires the bullet list to follow the summary heading within its section, and the heading must be a real summary title (#163).
- **`@power-seo/content-analysis`** — Stateful `/g` regexes used with `.test()` were made non-global in YMYL disclaimer, affiliate-link, and References-section detection, eliminating flip-flopping results between identical calls and within-call affiliate undercounting (#154).
- **`@power-seo/content-analysis`** — YMYL detection requires two distinct category terms, matches `contentCategory` by exact token (a "Newsletter" category no longer triggers news, "syntax" no longer triggers tax), and phrase-ifies over-broad terms like "recall"; shared detection lives in `shared-ymyl.ts` (#159).
- **`@power-seo/content-analysis`** — "ad hoc" no longer counts as an FTC disclosure and `#ad`/`#sponsored` hashtags are matched correctly (#163); "paragraph"/"photography" no longer count as charts in original-research detection (#163); CTA-intent alignment scans link and button text instead of all prose, so "Open Graph" in body copy no longer registers as a navigational CTA (#163); sentence-initial "According to Jane Doe" is detected, `<cite>`/`<figcaption>` containing nested markup are counted, and the expert-consensus source type is no longer dead code (#164).
- **`@power-seo/content-analysis`** — Link parsing no longer drops hrefs containing `#` fragments (external/internal/nofollow/competing link checks now see them) (#161). Table-of-contents detection requires ≥2 anchor links inside one list instead of matching any list plus any later anchor in the document (#166).
- **`@power-seo/content-analysis`** — `intent-related-coverage` returns `na` for unrecognized keyphrase shapes instead of a dead-end 0/5 and adds checklist/tips/examples/tutorial mappings; `secondary-keyphrases` returns `na` when no seeds are configured; `intent-depth-match` enforces documented upper bounds for informational/commercial content; `single-h1` no longer penalizes body content that starts at H2 when the page title serves as the H1; author-schema descriptions report a consistent field count; the E-E-A-T overall score is graded from pillar points instead of flat tiers, removing multi-point cliffs; future publish/modified dates no longer earn freshness credit (#167).

## [1.0.16] - 2026-07-20

### Security

- **`@power-seo/redirects`** — Open-redirect guard (#129). Resolved destinations are now validated before use: `javascript:`, `data:`, `vbscript:`, and `file:` schemes are always rejected; destinations that become off-origin through wildcard/param/regex substitution (`//host`, `\\host`, any `scheme:` prefix — including single-slash forms like `https:/host` that browsers normalize to absolute URLs) are rejected unless the rule's own destination template is external or `allowExternalRedirects` is enabled.
- **`@power-seo/schema`** + **`@power-seo/react`** — JSON-LD XSS hardening (#124, #125, #136, #146). All JSON-LD React components and the `Breadcrumb` component serialize through the shared escaping serializer (`<`, `>`, `&`, plus the U+2028/U+2029 line separators) closing `</script>`-injection vectors.
- **`@power-seo/integrations`** + **`@power-seo/search-console`** — Upstream API response bodies are sanitized (secrets redacted, truncated to 200 chars) before appearing in thrown error messages (#130).
- **`@power-seo/tracking`** — Analytics script builders validate GA4/Clarity/PostHog IDs against strict allow-lists and reject any PostHog `host` that is not a bare http(s) origin, preventing XSS breakout from inline `dangerouslySetInnerHTML` scripts (#139).

### Fixed

- **`@power-seo/meta`** — `createMetadata()` no longer clobbers `metadata.other` when both advanced robots directives and `additionalMetaTags` are used; entries are merged (#133).
- **`@power-seo/meta`** + **`@power-seo/core`** — `createMetadata()` and `buildMetaTags()` now derive `og:title`/`og:description`/`og:url` and `twitter:title`/`twitter:description` from top-level `title`/`description`/`canonical` when not explicitly set, so social cards are complete by default (#134). Explicit `openGraph`/`twitter` values still take precedence.
- **`@power-seo/content-analysis`** — Content freshness no longer uses a hardcoded "now"; the current date is injected (overridable via `options.now`) (#127).
- **`@power-seo/content-analysis`** — Media count no longer double-counts video iframes and no longer counts raw video URLs in text as embeds (#121).
- **`@power-seo/content-analysis`** — Transition-word thresholds now come from shared `READABILITY` constants, matching `@power-seo/readability` (#122).
- **`@power-seo/audit`** — Keyphrase density thresholds now use the shared `KEYWORD_DENSITY` constants (0.5–2.5%) instead of a hardcoded 3.0% bound (#126).
- **`@power-seo/content-analysis`** — Overlapping regex patterns no longer inflate marker counts in E-E-A-T case-study detection; distinct match spans are merged via the new `countDistinctMatches` utility (#128).
- **`@power-seo/core`** — Removed dead identical-branch ternary in `countSyllables` suffix handling (#132).
- **`@power-seo/core`** — `buildMetaTags` no longer discards `noindex`/`nofollow` overrides; `resolveTitle`/`applyTitleTemplate` no longer corrupt titles containing `$`-patterns or legitimate leading/trailing separators; `stripQueryParams` keeps repeated params; `calculateKeywordDensity` matches its documented metric (#135).
- **`@power-seo/schema`** — `clean()` now recurses into nested objects and arrays instead of stripping only top-level `undefined` (#136).
- **`@power-seo/sitemap`** — Priorities are emitted without lossy rounding; `toNextSitemap` normalizes relative locs against an optional hostname instead of silently dropping them; `splitSitemap` index URLs are normalized to avoid double slashes (#137).
- **`@power-seo/redirects`** — Query strings no longer break rule matching or leak into path params; `substituteParams` and `matchRegex` replace every occurrence with boundary-aware matching; `toNextRedirects` performs a real regex/wildcard → Next.js segment translation (#138).
- **`@power-seo/images`** — `FILENAME_PATTERN` no longer flags descriptive alt text like "Photo 2 dogs playing" as a raw filename (#140).
- **`@power-seo/readability`** — `colemanLiau` counts alphabetic letters directly instead of approximating from character count, so punctuation- and digit-heavy text no longer inflates the grade (#141).
- **`@power-seo/links`** — `findOrphanPages` retains page titles; `buildLinkGraph` strips fragments and skips `mailto:`/`tel:` links so they no longer create phantom nodes (#142).
- **`@power-seo/audit`** — Empty/info-only categories are excluded and category weights renormalized instead of substituting a synthetic score of 100 (#143).
- **`@power-seo/search-console`** — `inspectUrl` targets the URL Inspection endpoint instead of the v3 root; `createTokenManager` resets its cache on a failed token fetch instead of caching the rejection forever (#144).
- **`@power-seo/analytics`** — `analyzeQueryRankings` uses contiguous half-open buckets with an open-ended top bucket, so fractional GSC positions are no longer dropped (#145).

### Changed

- **`@power-seo/core`** — Consolidated shared utilities: `escapeXml` (`xml-utils`), HTTP retry/backoff (`http-retry`), JSON-LD serialization (`json-ld`), and pattern matching (`pattern-utils`) are now single-sourced in core and reused by sitemap, redirects, integrations, and search-console (#131). Word counting and sentence splitting are unified across content-analysis checks (#123).

## [1.0.15] - 2026-04-06

### Added

#### AEO: Answer Engine Optimization — 8 New Checks (`@power-seo/content-analysis`)

Answer Engine Optimization (AEO) is now a first-class scoring category. With AI Overviews appearing in 48% of all queries (Feb 2026) and Perplexity/ChatGPT routing 4.4× more converting traffic than organic search, AEO signals are critical for content discoverability in AI-driven environments.

- **`aeo-direct-answer`** (maxScore: 10) — Detects definition-first openings ("X is/refers to/means…"). Definition-first openings generate up to 34× more daily AI citations vs. narrative openings.
- **`aeo-faq-section`** (maxScore: 10) — Counts Q&A pairs: question-phrased H2/H3 headings followed by 30–200 word answer paragraphs. FAQPage schema + FAQ section yields 2.7–3.2× higher AI Overview citation rate.
- **`aeo-fact-density`** (maxScore: 8) — Measures verifiable fact signals (percentages, currencies, years, study attributions, measurements) per 100 words. Princeton GEO study: adding statistics increases AI visibility by 40%.
- **`aeo-tldr-summary`** (maxScore: 7) — Detects TL;DR / Key Takeaways / summary sections with structured bullet lists. Summary blocks receive 2.1× more AI citations (Moz AI Content Study, 2025).
- **`aeo-concise-answers`** (maxScore: 7) — Checks that question headings are followed by concise 40–120 word answer paragraphs. Perplexity AI study: 40–60 word answers under question headings generate 220% more citations.
- **`aeo-structured-data-hints`** (maxScore: 7) — Detects structured content patterns: tables, numbered step-by-step processes, comparison sections, how-to ordered lists. AI engines extract structured content 3.8× more often than prose (SurferSEO, Q4 2025).
- **`aeo-citation-readiness`** (maxScore: 8) — Measures citation signals: external source links, attribution phrases ("according to…"), footnotes, and a Sources/References section. BrightEdge 2025: cited pages have 3.1× more external references.
- **`aeo-entity-coverage`** (maxScore: 9) — Estimates named entity density (proper nouns, brands, technologies, people, standards). Target: 15–25 entities per 1,000 words. Kalicube AEO study: 15+ entities/1,000 words = 4.8× higher AI engine selection rate.

#### New `CheckId` Union Types
- Added 8 new AEO check IDs to the `CheckId` union type in `types.ts`
- Full TypeScript type safety and `disabledChecks` config support for all AEO checks

### Changed

#### SEO Score Weight Rebalancing (`@power-seo/content-analysis`)

Weights revised based on 2026 ranking factor research: Google Content Warehouse API Leak (2024), NavBoost signals confirmed in DOJ antitrust trial, First Page Sage Q1 2025 correlation study, and Ahrefs/Portent readability research.

| Category | Old Weight | New Weight | Rationale |
|---|---|---|---|
| E-E-A-T | 35% | 30% | Adjusted to accommodate AEO |
| Intent | 27% | 24% | Adjusted to accommodate AEO |
| **AEO** | **0%** | **20%** | New category — AI engine citation signals |
| SEO Analysis | 26% | 18% | Keyword density confirmed NOT a ranking factor (Mueller) |
| SERP/CTR | 2% | 5% | NavBoost click signals confirmed critical by DOJ trial |
| Readability | 9% | 2% | Zero correlation with rankings (Ahrefs, Portent studies) |
| Social | 1% | 1% | Unchanged |

#### maxScore Calibration — content-analysis Checks

All check `maxScore` values recalibrated to reflect 2026 research-backed importance weighting. Previously all checks had `maxScore: 5`; now checks are weighted by their actual impact on search rankings:

| Check | Old maxScore | New maxScore | Reason |
|---|---|---|---|
| `word-count` | 5 | 10 | First Page Sage: satisfying content = 23% of ranking weight |
| `content-freshness` | 5 | 10 | First Page Sage: freshness = 6%; critical for AI grounding |
| `media-count` | 5 | 8 | Visual content improves dwell time (NavBoost signal) |
| `eeat-content-accuracy` | 5 | 10 | Core trust signal; YMYL pages penalised heavily for inaccuracy |
| `eeat-source-quality` | 5 | 10 | External citations = primary E-E-A-T trust signal |
| `eeat-author-schema` | 5 | 10 | Author markup directly consumed by Google E-E-A-T evaluators |
| `eeat-experience-depth` | 5 | 9 | First-hand experience confirmed as ranking differentiator (HCU) |
| `eeat-topical-authority` | 5 | 8 | Content Warehouse API: `siteFocusScore` is a core ranking signal |
| `eeat-overall-score` | 5 | 8 | Aggregated E-E-A-T pillar summary |
| `intent-keyword-classification` | 5 | 10 | Intent mismatch = primary cause of ranking failure |
| `intent-content-alignment` | 5 | 10 | Google's primary satisfaction signal |
| `intent-satisfaction-score` | 5 | 10 | NavBoost: satisfying intent → good clicks → ranking boost |
| `intent-format-match` | 5 | 8 | Format mismatch reduces dwell time (NavBoost bad click signal) |
| `intent-depth-match` | 5 | 8 | Thin content for intent = high bounce = NavBoost penalty |
| `intent-snippet-readiness` | 5 | 6 | Featured snippet still present in non-AI-Overview results |
| `keyphrase-density` | 5 | 1 | Confirmed NOT a ranking factor (John Mueller, multiple statements) |

#### maxScore Calibration — readability Checks (`@power-seo/readability`)

| Check | Old maxScore | New maxScore | Reason |
|---|---|---|---|
| `sentence-length` | 5 | 8 | Affects scanability and dwell time |
| `paragraph-length` | 5 | 8 | Mobile UX signal; affects bounce rate |
| `passive-voice` | 5 | 6 | Clarity signal; affects comprehension |
| `flesch-reading-ease` | 5 | 4 | Zero correlation with rankings (Ahrefs 2024 study, 1.9M pages) |
| `transition-words` | 5 | 3 | Minor UX signal only |
| `consecutive-sentences` | 5 | 3 | Minor stylistic signal only |

### Fixed

- `word-count` good-result `maxScore` was 5 (not updated with other returns) — corrected to 10
- All "poor" status returns in modified check files now have consistent `maxScore` matching "good"/"ok" returns
- `intent-format-match` "na" early-return `maxScore` corrected from 5 to 8

---

## [1.0.14] - 2026-03-25

### Added

#### E-E-A-T Checks — 25 New Checks (`@power-seo/content-analysis`)

Comprehensive Google E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signal detection:

**Experience (5 checks)**
- `eeat-experience-depth` — First-hand experience signals (personal pronouns, temporal markers, testing outcomes, process narration)
- `eeat-original-research` — Original data, surveys, experiments, and unique findings
- `eeat-specificity-depth` — Specific details, product versions, measurements that demonstrate hands-on knowledge
- `eeat-multimedia-evidence` — Screenshots, diagrams, original photos, embedded video evidence
- `eeat-case-study-patterns` — Case study and real-world example patterns

**Expertise (5 checks)**
- `eeat-author-schema` — Author JSON-LD schema completeness (name, jobTitle, worksFor, credentials, knowsAbout, sameAs)
- `eeat-topical-authority` — Topical focus and niche expertise signals
- `eeat-technical-vocabulary` — Domain-specific technical terminology usage
- `eeat-expert-hedging` — Calibrated language ("research suggests", "in most cases") vs. overconfident claims
- `eeat-methodology-transparency` — Research methods, data sources, and process transparency

**Authoritativeness (5 checks)**
- `eeat-author-social` — Social profile links (LinkedIn, Twitter/X, GitHub)
- `eeat-organization` — Organization schema and brand signals
- `eeat-published-works` — References to publications, research papers, books
- `eeat-expert-sourcing` — Citations from named experts and authoritative sources
- `eeat-editorial-review` — Editorial process signals (reviewed by, fact-checked, updated by)

**Trustworthiness (6 checks)**
- `eeat-source-quality` — External link quality and diversity (academic, government, industry)
- `eeat-ymyl-compliance` — YMYL (Your Money or Your Life) content risk level assessment
- `eeat-conflict-disclosure` — Conflict of interest and sponsorship disclosure
- `eeat-content-accuracy` — Misleading language, unsubstantiated claims, clickbait detection
- `eeat-correction-policy` — Correction notices, update transparency
- `eeat-privacy-safety` — Privacy policy, terms, and safety signal detection

**Meta Scores (2 checks)**
- `eeat-overall-score` — Aggregated E-E-A-T pillar health summary
- `eeat-ymyl-multiplier` — Score multiplier for YMYL categories (medical, legal, financial)

#### Search Intent Analysis — 30 New Checks (`@power-seo/content-analysis`)

Full search intent lifecycle coverage:

**Intent Detection (4)**: `intent-keyword-classification`, `intent-sub-type`, `intent-modifier-analysis`, `intent-multi-detection`

**Content Alignment (6)**: `intent-content-alignment`, `intent-title-match`, `intent-meta-match`, `intent-heading-match`, `intent-opening-match`, `intent-conclusion-match`

**Specific Requirements (5)**: `intent-informational-completeness`, `intent-transactional-elements`, `intent-commercial-elements`, `intent-navigational-clarity`, `intent-format-match`

**Signal Quality (5)**: `intent-signal-density`, `intent-signal-distribution`, `intent-depth-match`, `intent-mixed-warning`, `intent-cta-alignment`

**SERP Features (3)**: `intent-snippet-readiness`, `intent-schema-readiness`, `intent-paa-coverage`

**User Journey (4)**: `intent-satisfaction-score`, `intent-funnel-position`, `intent-related-coverage`, `intent-engagement-signals`

#### Extended Content Checks — 10 New Checks (`@power-seo/content-analysis`)
- `competing-links` — Detects links that may redirect users away from conversion paths
- `content-freshness` — Evaluates last-modified date and freshness signals
- `headline-analyzer` — Power word analysis, sentiment, and title effectiveness scoring
- `inclusive-language` — Flags potentially non-inclusive terminology
- `keyphrase-even-distribution` — Checks keyphrases are distributed throughout, not front-loaded
- `keyphrase-introduction` — Validates keyphrase appears in the opening paragraph
- `keyphrase-markup` — Checks keyphrase is emphasised with `<strong>` or `<em>` tags
- `media-count` — Image and video count relative to content length
- `table-of-contents` — Detects structured navigation for long-form content
- `word-complexity` — Identifies unnecessarily complex vocabulary

---

## [1.0.13] - 2026-03-20

### Fixed

#### Score Inflation and Check Accuracy (`@power-seo/content-analysis`) — #116

- **Score inflation**: Corrected inflated scores caused by checks returning `score > maxScore` in edge cases — scores are now always clamped to `[0, maxScore]`
- **H1 recognition**: Fixed H1 title detection not matching when content starts with whitespace or BOM characters (#117)
- **Link parsing**: Fixed external/internal link counting failing when content uses protocol-relative URLs (`//example.com`) (#118)
- **Canonical URL check**: Fixed false positive "missing canonical" when canonical is set to the page URL itself (#119)
- **Blob URL labels**: Fixed image alt-text check incorrectly flagging blob: URLs as missing alt text (#120)

#### Reliability
- Hardened `getWords()` utility to handle null/undefined content without throwing
- Fixed `checkHeadings()` returning wrong H-level counts when headings contain nested inline elements
- Corrected `keyphrase-slug` false positives when canonical URL contains query parameters

---

## [1.0.12] - 2026-03-03

### Fixed

#### Core Functionality
- **#115 @power-seo/sitemap**: Fixed XML string return incompatibility with Next.js app/sitemap.ts convention — now returns proper array structure for Next.js integration
- **#114 @power-seo/meta**: Fixed silent dropping of advanced robots directives (maxSnippet, maxImagePreview, etc.) — now properly handles all directive types
- **#113 @power-seo/react**: Fixed incompatibility with Next.js App Router Server Components — components now work correctly in server-side contexts

#### Security & Performance
- **Network Access**: Removed unnecessary network access from build/runtime context in @power-seo/integrations package
- Fixed potential XSS vectors in schema markup handling
- Improved input validation for URL normalization

#### Minor Package Fixes
- **@power-seo/core**: Enhanced URL normalization to handle edge cases with query parameters
- **@power-seo/schema**: Fixed type inference for optional schema properties
- **@power-seo/audit**: Corrected scoring calculation for edge cases with zero-length content

#### Documentation
- **@power-seo/preview**: Added TwitterImageValidation structure documentation
- **@power-seo/sitemap**: Fixed lastmod conversion claim and clarified namespace detection scope
- **@power-seo/redirects**: Corrected API function signatures, status codes, and config types (5 fixes)
- **@power-seo/links**: Fixed function signatures and property names (3 fixes)
- **@power-seo/audit**: Added missing hostname parameter to API reference
- **@power-seo/images**: Corrected function signatures, return types, and examples (7 fixes)
- **@power-seo/ai**: Fixed focusKeyphrase parameter name in OpenAI example
- **@power-seo/analytics**: Corrected correlation return type, ranking tiers, and usage examples
- **@power-seo/search-console**: Fixed TokenManager type definition and CI/CD example
- **@power-seo/integrations**: Corrected error properties and config parameter types
- **@power-seo/tracking**: Added missing isGranted method to API reference

**Total: 18 documentation fixes + 3 critical bug fixes + network access fix across all packages**

---

## [1.0.11] - 2026-03-01

### Added

#### Documentation
- Comprehensive GitHub Wiki with 38+ pages covering all packages and use cases
- Interactive MDX documentation files for enhanced learning experience
- Home page with organized navigation for Quick Start, Core Concepts, and Package APIs
- Wiki homepage synchronized across repository and GitHub Pages
- Complete guide to all 17 packages with API references

#### Features
- Wiki-based documentation system for better discoverability
- Enhanced package documentation with real-world examples
- MDX files for interactive documentation in docs/ directory
- Improved navigation structure across all documentation

### Changed

#### Documentation
- Updated README.md with comprehensive documentation links
- Restructured docs/ directory with WIKI_HOME.mdx for easy navigation
- Improved package selection guide with visual organization
- Enhanced framework integration documentation

### Fixed

- Wiki homepage rendering and display issues
- Documentation page synchronization across platforms
- Fixed duplicate wiki page references
- Improved markdown formatting for better GitHub rendering

---

## [1.0.10] - 2026-02-28

### Added

#### New Packages
- **@power-seo/ai** - LLM-agnostic AI prompt templates for SEO tasks
- **@power-seo/search-console** - Google Search Console API client
- **@power-seo/integrations** - Semrush and Ahrefs API clients
- **@power-seo/tracking** - Analytics tracking with GDPR consent
- **@power-seo/analytics** - Analytics dashboard builder
- **@power-seo/images** - Image SEO analysis
- **@power-seo/readability** - Readability scoring algorithms

#### Features
- Real-time content analysis (Yoast-style scoring)
- Pixel-accurate SERP previews
- XML sitemap streaming for 50,000+ URLs
- Comprehensive SEO audit (30+ rules)
- Link graph analysis with orphan detection
- Advanced robots directives support
- Multi-language support with hreflang
- Batch processing and data export
- Advanced filtering and monitoring

#### Documentation
- 11 comprehensive wiki pages (5,063 lines)
- 20+ GitHub Discussion templates
- Getting started guides for all frameworks
- Package selection guide with presets
- Architecture overview
- Real-world use case tutorials
- Troubleshooting guide (20+ solutions)
- Complete API reference

#### Build & CI/CD
- GitHub Actions workflows
- Changesets-based versioning
- ESLint and Prettier configuration
- Vitest with 95%+ coverage
- Turborepo optimization
- CodeQL and Socket.dev monitoring
- Provenance-signed releases

### Changed

#### API Improvements
- Full TypeScript support across all packages
- Standardized error handling
- Better validation error messages
- Enhanced type definitions

#### Performance
- Optimized bundle sizes
- Tree-shakeable exports
- Dual ESM + CJS output
- Parallel rule execution
- Improved memory usage

#### Documentation
- Updated package READMEs
- Added 120+ SVG assets
- Interactive examples
- Architecture documentation

### Fixed

- XSS vulnerabilities in JSON-LD rendering
- ReDoS-prone regex patterns
- URL normalization issues
- Redirect chain detection edge cases
- Memory optimization for large datasets

### Security

- No install scripts
- No runtime network access
- No eval or dynamic code
- Input validation and sanitization
- Automated security scanning
- Dependency vulnerability management

---

## [1.0.1] - 2026-01-05

### Added
- Multi-language support and i18n
- Accessibility improvements
- Advanced analytics dashboard
- Batch processing
- Data export utilities

### Fixed
- Content analysis edge cases
- Readability accuracy
- Schema validation

---

## [1.0.0] - 2025-12-01

### Added

#### Core Packages (10)
- @power-seo/core - Zero-dependency foundation
- @power-seo/react - React SEO components
- @power-seo/meta - SSR meta helpers
- @power-seo/schema - JSON-LD builders (23 types)
- @power-seo/content-analysis - Yoast-style scoring
- @power-seo/preview - SERP/OG/Twitter previews
- @power-seo/sitemap - XML sitemap generation
- @power-seo/redirects - Redirect engine
- @power-seo/links - Link graph analysis
- @power-seo/audit - Full audit engine

### Features
- Type-safe builders for all SEO tasks
- Framework-native (Next.js 14+, Remix v2, React SPAs)
- Comprehensive test coverage
- Full TypeScript support
- Tree-shakeable exports
- Production-ready

---

## [1.0.0-beta.1] - 2025-10-01

### Added
- Beta release for testing
- End-to-end test suite
- Documentation and examples

### Fixed
- Community feedback issues
- Edge case handling

---

## [1.0.0-alpha] - 2025-09-15

### Added
- Alpha release for early testing
- Core functionality
- API documentation
- CI/CD workflows

---

## Requirements

- **Node.js:** >= 18.0.0
- **TypeScript:** >= 5.0 (optional)
- **React:** >= 18.0.0 (for React packages only)

## License

MIT © 2026 CyberCraft Bangladesh
