# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.11] - 2026-02-28

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
