# @ccbd-seo/core

> Framework-agnostic SEO utilities, types, constants, and validators.

The foundation package for the `@ccbd-seo` ecosystem. Provides shared types, constants, meta tag validators, URL utilities, text statistics, keyword density analysis, and meta/robots builders used by all other packages.

## Installation

```bash
npm install @ccbd-seo/core
```

## Usage

### Meta Tag Builders

```ts
import {
  buildMetaTags,
  buildLinkTags,
  buildOpenGraphTags,
  buildTwitterTags,
  buildHreflangTags,
  resolveTitle,
} from '@ccbd-seo/core';

const meta = buildMetaTags({
  title: 'My Page',
  description: 'Page description',
  robots: { index: true, follow: true },
});

const links = buildLinkTags({
  canonical: 'https://example.com/page',
});

const og = buildOpenGraphTags({
  title: 'My Page',
  description: 'Page description',
  type: 'website',
  url: 'https://example.com',
});
```

### Title Template Engine

```ts
import { applyTitleTemplate, createTitleTemplate } from '@ccbd-seo/core';

const title = applyTitleTemplate('Blog Post', '%s | My Site');
// → "Blog Post | My Site"

const template = createTitleTemplate({ separator: '|', suffix: 'My Site' });
```

### Meta Validators

```ts
import { validateTitle, validateMetaDescription, calculatePixelWidth } from '@ccbd-seo/core';

const titleResult = validateTitle('My Page Title');
// { valid, length, pixelWidth, warnings }

const descResult = validateMetaDescription('A description of the page.');
const pixels = calculatePixelWidth('My Title');
```

### URL Utilities

```ts
import {
  resolveCanonical,
  normalizeUrl,
  ensureTrailingSlash,
  removeTrailingSlash,
  stripQueryParams,
  stripTrackingParams,
  extractSlug,
  isAbsoluteUrl,
  toSlug,
} from '@ccbd-seo/core';

normalizeUrl('https://example.com/PATH?utm_source=x');
// → "https://example.com/path"

ensureTrailingSlash('https://example.com/blog');
// → "https://example.com/blog/"

removeTrailingSlash('https://example.com/blog/');
// → "https://example.com/blog"

stripQueryParams('https://example.com?foo=bar');
// → "https://example.com"

toSlug('My Blog Post!');
// → "my-blog-post"

isAbsoluteUrl('https://example.com'); // true
isAbsoluteUrl('/relative/path');      // false
```

### Text Statistics

```ts
import {
  stripHtml,
  getWords,
  getSentences,
  getParagraphs,
  countSyllables,
  countTotalSyllables,
  getTextStatistics,
} from '@ccbd-seo/core';

const stats = getTextStatistics('<p>Your HTML content here.</p>');
// { wordCount, sentenceCount, paragraphCount, syllableCount, avgWordsPerSentence, avgSyllablesPerWord }

const words = getWords('Hello world');
// ["Hello", "world"]

const paragraphs = getParagraphs('First paragraph.\n\nSecond paragraph.');
// ["First paragraph.", "Second paragraph."]

const syllables = countSyllables('beautiful'); // 3
const total = countTotalSyllables(['beautiful', 'day']); // 4
```

### Keyword Density

```ts
import {
  calculateKeywordDensity,
  countKeywordOccurrences,
  analyzeKeyphraseOccurrences,
} from '@ccbd-seo/core';

const density = calculateKeywordDensity('Your text content...', 'keyword');
const count = countKeywordOccurrences('Your text content...', 'keyword');
const occurrences = analyzeKeyphraseOccurrences('Your text content...', 'focus keyphrase');
```

### Robots Builder

```ts
import { buildRobotsContent, parseRobotsContent } from '@ccbd-seo/core';

const content = buildRobotsContent({ index: true, follow: true, noarchive: true });
// → "index, follow, noarchive"

const parsed = parseRobotsContent('noindex, nofollow');
// → { index: false, follow: false }
```

## API Reference

### Meta Builders
- `buildMetaTags(config)` — Generate meta tag objects from SEO config
- `buildLinkTags(config)` — Generate link tag objects (canonical, alternate)
- `buildOpenGraphTags(config)` — Generate Open Graph meta tags
- `buildTwitterTags(config)` — Generate Twitter Card meta tags
- `buildHreflangTags(entries)` — Generate hreflang link tags
- `resolveTitle(title, template?)` — Resolve title with optional template

### Title Management
- `applyTitleTemplate(title, template)` — Apply template string to title
- `createTitleTemplate(options)` — Create reusable title template

### Validators
- `validateTitle(title)` — Validate title length and pixel width
- `validateMetaDescription(description)` — Validate description length and pixel width
- `calculatePixelWidth(text)` — Calculate pixel width of text using character width table

### URL Utilities
- `resolveCanonical(url, base)` — Resolve canonical URL against base
- `normalizeUrl(url)` — Normalize URL format (lowercase, remove trailing slash)
- `ensureTrailingSlash(url)` — Add trailing slash if missing
- `removeTrailingSlash(url)` — Remove trailing slash if present
- `stripQueryParams(url)` — Remove all query parameters
- `stripTrackingParams(url)` — Remove UTM and tracking parameters
- `extractSlug(url)` — Extract slug from URL path
- `isAbsoluteUrl(url)` — Check if URL is absolute
- `toSlug(text)` — Convert text to URL-safe slug

### Text Statistics
- `getTextStatistics(text)` — Get comprehensive text statistics
- `stripHtml(html)` — Remove HTML tags from string
- `getWords(text)` — Split text into words array
- `getSentences(text)` — Split text into sentences array
- `getParagraphs(text)` — Split text into paragraphs array
- `countSyllables(word)` — Count syllables in a single word
- `countTotalSyllables(words)` — Count total syllables across word array

### Keyword Analysis
- `calculateKeywordDensity(text, keyword)` — Calculate keyword density percentage
- `countKeywordOccurrences(text, keyword)` — Count keyword appearances in text
- `analyzeKeyphraseOccurrences(text, keyphrase)` — Detailed keyphrase usage analysis

### Robots
- `buildRobotsContent(config)` — Generate robots meta content string
- `parseRobotsContent(content)` — Parse robots meta string into config object

### Constants
- `TITLE_MAX_PIXELS`, `TITLE_MAX_LENGTH`, `TITLE_MIN_LENGTH`
- `META_DESCRIPTION_MAX_PIXELS`, `META_DESCRIPTION_MAX_LENGTH`, `META_DESCRIPTION_MIN_LENGTH`
- `MIN_WORD_COUNT`, `RECOMMENDED_WORD_COUNT`
- `OG_IMAGE`, `TWITTER_IMAGE` — Image dimension recommendations
- `MAX_URL_LENGTH`, `KEYWORD_DENSITY`, `READABILITY`
- `AI_CRAWLERS`, `CHAR_PIXEL_WIDTHS`, `DEFAULT_CHAR_WIDTH`, `SCHEMA_TYPES`

## License

[MIT](../../LICENSE)
