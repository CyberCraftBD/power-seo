# @power-seo/core Package Guide

The foundational package with zero dependencies. Contains types, validators, and utilities used by all other packages.

## Overview

- **Size:** ~3 KB (gzipped)
- **Dependencies:** None (zero-dependency)
- **Exports:** 50+ utilities and types
- **Platforms:** Any JavaScript environment

## Installation

```bash
npm install @power-seo/core
```

## Core Categories

### 1. Title Utilities

```ts
import { validateTitle, truncateTitle, createTitleTemplate } from '@power-seo/core';

// Validate title (with pixel width calculation)
const result = validateTitle('My Amazing Blog Post About SEO');
console.log(result.valid);      // boolean
console.log(result.charCount);  // 33
console.log(result.pixelWidth); // 245px (at 580px SERP width)
console.log(result.severity);   // 'ok' | 'warning' | 'error'

// Create title template
const makeTitle = createTitleTemplate({
  siteName: 'My Blog',
  separator: '—',
  position: 'end' // or 'start'
});
makeTitle('My Post');     // → 'My Post — My Blog'
makeTitle('Home');        // → 'Home — My Blog'
```

**Recommendations:**
- Optimal: 40-60 characters (280-400px)
- Maximum: 75 characters (never shown)

### 2. Meta Description Utilities

```ts
import { validateMetaDescription, truncateText } from '@power-seo/core';

const result = validateMetaDescription('Discover expert SEO tips and strategies for improving your search rankings.');
console.log(result.valid);      // boolean
console.log(result.charCount);  // 74
console.log(result.severity);   // 'ok' | 'warning'
console.log(result.message);    // 'Length is OK'

// Truncate text to length
const truncated = truncateText(
  'Long text here...',
  160,
  '...'
);
```

**Recommendations:**
- Optimal: 120-160 characters
- Mobile: Show 150 characters max
- Too short: Under 100 characters
- Too long: Over 180 characters

### 3. URL Utilities

```ts
import { toSlug, resolveCanonical, normalizeUrl, isValidUrl } from '@power-seo/core';

// Convert to URL-safe slug
toSlug('My Amazing Blog Post!');      // → 'my-amazing-blog-post'
toSlug('2026 Guide — Best Practices'); // → '2026-guide-best-practices'

// Resolve canonical URL
resolveCanonical('https://example.com', '/blog/post');
// → 'https://example.com/blog/post'

// Normalize URL
normalizeUrl('https://example.com//blog//post/');
// → 'https://example.com/blog/post'

// Validate URL format
isValidUrl('https://example.com');  // true
isValidUrl('not a url');            // false
```

### 4. HTML Processing

```ts
import { stripHtml, extractFirstTagContent, extractTagContents } from '@power-seo/core';

// Remove all HTML tags and decode entities
const html = '<h1>Title</h1><p>Paragraph &amp; text</p>';
const text = stripHtml(html);
// → 'Title\nParagraph & text'

// Extract specific tag content
const heading = extractFirstTagContent('h1', html);
// → 'Title'

const allParagraphs = extractTagContents('p', html);
// → ['Paragraph & text']
```

### 5. Text Statistics

```ts
import { getTextStatistics, calculateKeywordDensity } from '@power-seo/core';

const html = '<h1>SEO Tips</h1><p>Here are my best SEO tips...</p>';

// Get comprehensive text statistics
const stats = getTextStatistics(html);
console.log(stats.wordCount);      // 5
console.log(stats.sentenceCount);  // 2
console.log(stats.paragraphCount); // 2
console.log(stats.syllableCount);  // 8

// Calculate keyword density
const density = calculateKeywordDensity('SEO tips', html);
console.log(density.keyword);   // 'seo tips'
console.log(density.count);     // 2
console.log(density.density);   // 40 (2 out of 5 words)
console.log(density.totalWords);// 5
```

### 6. Robots Directive Utilities

```ts
import { buildRobotsContent, parseRobotsContent } from '@power-seo/core';

// Build robots directive string
const robotsContent = buildRobotsContent({
  index: true,
  follow: true,
  maxSnippet: 150,
  maxImagePreview: 'large',
  unavailableAfter: '2026-12-31T23:59:59Z'
});
// → 'index, follow, max-snippet:150, max-image-preview:large, unavailable_after:2026-12-31T23:59:59Z'

// Parse robots directive string
const parsed = parseRobotsContent('noindex, nofollow, max-snippet:-1');
console.log(parsed.index);      // false
console.log(parsed.follow);     // false
console.log(parsed.maxSnippet); // -1
```

### 7. Metadata Builders

```ts
import {
  buildMetaTags,
  buildOpenGraphTags,
  buildTwitterCardTags,
  buildLinkTags
} from '@power-seo/core';

// Build meta tags object
const metaTags = buildMetaTags({
  title: 'Page Title',
  description: 'Page description',
  keywords: 'seo, marketing',
  author: 'Jane Doe',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1'
});
// Returns object with all standard meta tags

// Build Open Graph tags
const ogTags = buildOpenGraphTags({
  type: 'article',
  title: 'My Article',
  description: 'Article description',
  url: 'https://example.com/article',
  image: { url: 'https://example.com/og.jpg', width: 1200, height: 630 }
});

// Build link tags (canonical, alternate, etc.)
const links = buildLinkTags({
  canonical: 'https://example.com/page',
  alternates: [
    { hrefLang: 'en', href: 'https://example.com/en/page' },
    { hrefLang: 'fr', href: 'https://example.com/fr/page' }
  ]
});
```

### 8. Constants

```ts
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MAX_PIXELS,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  SLUG_REGEX,
  SEO_KEYWORDS_MAX
} from '@power-seo/core';

console.log(TITLE_MIN_LENGTH);    // 30
console.log(TITLE_MAX_LENGTH);    // 75
console.log(TITLE_MAX_PIXELS);    // 580
console.log(DESCRIPTION_MIN_LENGTH); // 50
console.log(DESCRIPTION_MAX_LENGTH); // 180
console.log(SEO_KEYWORDS_MAX);    // 10
```

---

## Type Definitions

### Validation Result

```ts
interface ValidationResult {
  valid: boolean;
  severity: 'ok' | 'warning' | 'error';
  charCount: number;
  message: string;
  suggestions?: string[];
}
```

### Text Statistics

```ts
interface TextStatistics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  syllableCount: number;
  averageWordLength: number;
  averageSentenceLength: number;
}
```

### Keyword Density

```ts
interface KeywordDensity {
  keyword: string;
  count: number;
  density: number; // percentage
  totalWords: number;
  positions: number[]; // word positions
}
```

### Robots Directives

```ts
interface RobotsConfig {
  index?: boolean;
  follow?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
  unavailableAfter?: string; // ISO 8601
}
```

---

## Common Patterns

### Build Complete SEO Validation

```ts
import {
  validateTitle,
  validateMetaDescription,
  stripHtml,
  getTextStatistics,
  calculateKeywordDensity
} from '@power-seo/core';

function validatePageSeo(input: {
  title: string;
  description: string;
  content: string;
  focusKeyword: string;
}) {
  const titleValidation = validateTitle(input.title);
  const descriptionValidation = validateMetaDescription(input.description);

  const text = stripHtml(input.content);
  const stats = getTextStatistics(input.content);
  const density = calculateKeywordDensity(input.focusKeyword, input.content);

  return {
    title: titleValidation,
    description: descriptionValidation,
    wordCount: stats.wordCount,
    keywordDensity: density.density,
    issues: [
      !titleValidation.valid && 'Title needs adjustment',
      !descriptionValidation.valid && 'Description needs adjustment',
      stats.wordCount < 300 && 'Content is too short (minimum 300 words)',
      density.density < 0.5 && 'Focus keyword density is too low',
      density.density > 5 && 'Focus keyword density is too high'
    ].filter(Boolean)
  };
}
```

### Normalize All URLs in Content

```ts
import { normalizeUrl, stripHtml, extractTagContents } from '@power-seo/core';

function normalizeLinksInContent(html: string) {
  let normalized = html;

  // Find all href values and normalize
  const hrefRegex = /href=["']([^"']+)["']/g;
  normalized = normalized.replace(hrefRegex, (match, url) => {
    const normalized = normalizeUrl(url);
    return `href="${normalized}"`;
  });

  return normalized;
}
```

---

## Performance Notes

- **stripHtml()** - Uses indexOf-based scanning (no regex, no ReDoS)
- **calculateKeywordDensity()** - O(n) string processing
- **getTextStatistics()** - Single pass through content
- All functions are synchronous and non-blocking

---

## Next Steps

1. **[Quick Start](./02-quick-start.md)** - Use core in your project
2. **[@power-seo/schema](./pkg-schema.md)** - Build JSON-LD schemas
3. **[@power-seo/audit](./pkg-audit.md)** - Use validators in audits

