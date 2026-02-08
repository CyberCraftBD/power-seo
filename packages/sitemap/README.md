# @ccbd-seo/sitemap

> XML sitemap generation, streaming, validation, and index splitting.

Supports image, video, and news sitemaps with automatic 50,000 URL limit splitting.

## Installation

```bash
npm install @ccbd-seo/sitemap @ccbd-seo/core
```

## Usage

### Generate a Sitemap

```ts
import { generateSitemap } from '@ccbd-seo/sitemap';

const xml = generateSitemap({
  urls: [
    { loc: 'https://example.com/', lastmod: '2026-01-15', changefreq: 'daily', priority: 1.0 },
    { loc: 'https://example.com/about', lastmod: '2026-01-10', priority: 0.8 },
  ],
});
```

### Sitemap Index (Large Sites)

```ts
import { generateSitemapIndex, splitSitemap } from '@ccbd-seo/sitemap';

// Split URLs into chunks of 50,000
const chunks = splitSitemap(urls);

const index = generateSitemapIndex({
  sitemaps: [
    { loc: 'https://example.com/sitemap-1.xml', lastmod: '2026-01-15' },
    { loc: 'https://example.com/sitemap-2.xml', lastmod: '2026-01-15' },
  ],
});
```

### Streaming (Memory-Efficient)

```ts
import { streamSitemap } from '@ccbd-seo/sitemap';

const stream = streamSitemap(urls);
// Use with Node.js streams or web Response
```

### Validation

```ts
import { validateSitemapUrl } from '@ccbd-seo/sitemap';

const result = validateSitemapUrl({
  loc: 'https://example.com/page',
  lastmod: '2026-01-15',
});
// { valid: boolean, errors: string[] }
```

## API Reference

### Generators

- `generateSitemap(config)` — Create complete XML sitemap string
- `generateSitemapIndex(config)` — Create sitemap index XML
- `splitSitemap(urls, maxPerSitemap?)` — Split URLs into chunks

### Utilities

- `streamSitemap(urls)` — Memory-efficient streaming XML output
- `validateSitemapUrl(entry)` — Validate a sitemap URL entry

### Constants

- `MAX_URLS_PER_SITEMAP` — 50,000 (Google limit)
- `MAX_SITEMAP_SIZE_BYTES` — 50MB (Google limit)

### Types

```ts
import type {
  SitemapURL,
  SitemapImage,
  SitemapVideo,
  SitemapNews,
  SitemapConfig,
  SitemapIndexEntry,
  SitemapIndexConfig,
  SitemapValidationResult,
} from '@ccbd-seo/sitemap';
```

## License

[MIT](../../LICENSE)
