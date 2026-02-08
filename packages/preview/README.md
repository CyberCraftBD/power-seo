# @ccbd-seo/preview

> SERP, Open Graph, and Twitter Card preview generators with React components.

See exactly how your pages appear in Google search results and social media shares.

## Installation

```bash
npm install @ccbd-seo/preview @ccbd-seo/core
```

## Usage

### SERP Preview

```ts
import { generateSerpPreview } from '@ccbd-seo/preview';

const preview = generateSerpPreview({
  title: 'Best Coffee Shops in NYC | MyBlog',
  description: 'Discover the top 10 coffee shops in New York City with reviews and photos.',
  url: 'https://example.com/coffee-shops-nyc',
});

console.log(preview.title);              // Pixel-accurate truncated title
console.log(preview.titleTruncated);     // Whether title was truncated
console.log(preview.displayUrl);          // Formatted URL breadcrumb
```

### Open Graph Preview

```ts
import { generateOgPreview } from '@ccbd-seo/preview';

const og = generateOgPreview({
  title: 'Best Coffee Shops',
  description: 'Top picks for coffee lovers.',
  url: 'https://example.com/coffee-shops-nyc',
  image: { url: 'https://example.com/og.jpg', width: 1200, height: 630 },
  siteName: 'MyBlog',
});
```

### Twitter Card Preview

```ts
import { generateTwitterPreview } from '@ccbd-seo/preview';

const twitter = generateTwitterPreview({
  cardType: 'summary_large_image',
  title: 'Best Coffee Shops',
  description: 'Top picks for coffee lovers.',
  image: { url: 'https://example.com/twitter.jpg', width: 1200, height: 600 },
  site: '@myblog',
});
```

### Pixel-Accurate Truncation

```ts
import { truncateAtPixelWidth } from '@ccbd-seo/preview';

const result = truncateAtPixelWidth('A long title that might get cut off in SERPs', 580);
// { text: 'A long title that might get cut...', truncated: true }
```

### React Components

```tsx
import { SerpPreview, OgPreview, TwitterPreview, PreviewPanel } from '@ccbd-seo/preview/react';

// Individual previews
<SerpPreview title="My Page" description="Page description." url="https://example.com" />

<OgPreview
  title="My Page"
  description="Page description."
  url="https://example.com"
  image={{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }}
  siteName="My Site"
/>

<TwitterPreview
  cardType="summary_large_image"
  title="My Page"
  description="Page description."
  image={{ url: 'https://example.com/twitter.jpg' }}
  site="@mysite"
/>

// All-in-one tabbed container (Google, Facebook, Twitter/X tabs)
<PreviewPanel
  title="My Page"
  description="Page description."
  url="https://example.com"
  image={{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }}
  siteName="My Site"
  twitterSite="@mysite"
  twitterCardType="summary_large_image"
/>
```

## API Reference

### Generators

- `generateSerpPreview(input)` — Google SERP result preview data
- `generateOgPreview(input)` — Facebook/LinkedIn share card preview data
- `generateTwitterPreview(input)` — Twitter/X card preview data

### Utilities

- `truncateAtPixelWidth(text, maxWidth)` — Pixel-accurate text truncation

### React Components (`@ccbd-seo/preview/react`)

| Component | Props | Purpose |
|-----------|-------|---------|
| `SerpPreview` | `{ title, description, url, siteTitle? }` | Google SERP result mockup |
| `OgPreview` | `{ title, description, url, image?, siteName? }` | Facebook/Open Graph card mockup |
| `TwitterPreview` | `{ cardType, title, description, image?, site? }` | Twitter/X card mockup |
| `PreviewPanel` | `{ title, description, url, image?, siteName?, siteTitle?, twitterSite?, twitterCardType? }` | Tabbed container with Google, Facebook, and Twitter previews |

### Types

```ts
import type {
  SerpPreviewInput,
  SerpPreviewData,
  OgPreviewInput,
  OgPreviewData,
  OgImageValidation,
  TwitterPreviewInput,
  TwitterPreviewData,
  TwitterImageValidation,
  TruncateResult,
} from '@ccbd-seo/preview';
```

## License

[MIT](../../LICENSE)
