# @ccbd-seo/audit

> SEO page and site auditing with meta, content, structure, and performance rule sets.

Returns scored reports with actionable issues across 4 categories.

## Installation

```bash
npm install @ccbd-seo/audit @ccbd-seo/core @ccbd-seo/content-analysis @ccbd-seo/readability @ccbd-seo/schema
```

## Usage

### Page Audit

```ts
import { auditPage } from '@ccbd-seo/audit';

const result = auditPage({
  url: 'https://example.com/blog/my-post',
  title: 'My Blog Post',
  metaDescription: 'A great article about SEO.',
  content: '<h1>My Blog Post</h1><p>Content here...</p>',
  headings: [{ level: 1, text: 'My Blog Post' }],
  images: [{ src: '/image.jpg', alt: 'Photo' }],
  links: { internal: ['/about'], external: ['https://google.com'] },
});

console.log(result.score);      // 0-100
console.log(result.categories); // { meta, content, structure, performance }
console.log(result.issues);     // Array of { rule, severity, message }
```

### Site Audit

```ts
import { auditSite } from '@ccbd-seo/audit';

const report = auditSite({
  pages: [page1, page2, page3],
});

console.log(report.averageScore);
console.log(report.topIssues);
```

### Individual Rule Sets

```ts
import { runMetaRules, runContentRules, runStructureRules, runPerformanceRules } from '@ccbd-seo/audit';

const metaIssues = runMetaRules(pageInput);
const contentIssues = runContentRules(pageInput);
const structureIssues = runStructureRules(pageInput);
const perfIssues = runPerformanceRules(pageInput);
```

## API Reference

### Audits

- `auditPage(input)` — Single page audit across all 4 categories
- `auditSite(input)` — Multi-page audit with score aggregation

### Rule Sets

- `runMetaRules(input)` — Title, description, canonical, robots, OG tags
- `runContentRules(input)` — Word count, keyphrase, readability
- `runStructureRules(input)` — Headings, images, links, schema validation
- `runPerformanceRules(input)` — Image optimization, resource hints

### Types

```ts
import type {
  AuditCategory,
  AuditSeverity,
  AuditRule,
  PageAuditInput,
  PageAuditResult,
  CategoryResult,
  SiteAuditInput,
  SiteAuditResult,
} from '@ccbd-seo/audit';
```

## License

[MIT](../../LICENSE)
