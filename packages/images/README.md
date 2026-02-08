# @ccbd-seo/images

> Deep image SEO analysis: alt text auditing, lazy loading checks, format optimization, and image sitemap generation.

## Installation

```bash
npm install @ccbd-seo/images @ccbd-seo/core
```

## Usage

### Alt Text Analysis

```ts
import { analyzeAltText } from '@ccbd-seo/images';

const result = analyzeAltText({
  images: [
    { src: '/hero.jpg', alt: '' },
    { src: '/photo.jpg', alt: 'A beautiful sunset over the ocean' },
    { src: '/IMG_1234.jpg', alt: 'IMG_1234' },
  ],
  keyphrase: 'sunset photography',
});
// Issues: missing alt, filename-as-alt, keyphrase opportunities
```

### Lazy Loading Audit

```ts
import { auditLazyLoading } from '@ccbd-seo/images';

const result = auditLazyLoading({
  images: [
    { src: '/hero.jpg', loading: 'lazy', isAboveFold: true },
    { src: '/content.jpg', loading: undefined, isAboveFold: false },
  ],
});
// Warns: above-fold image should not be lazy-loaded
```

### Format Analysis

```ts
import { detectFormat, getFormatRecommendation, analyzeImageFormats } from '@ccbd-seo/images';

detectFormat('photo.jpg'); // 'jpeg'
getFormatRecommendation('jpeg'); // Suggests WebP/AVIF

const formats = analyzeImageFormats({
  images: [{ src: '/photo.jpg' }, { src: '/icon.png' }],
});
// Recommends modern format alternatives
```

### Image Sitemap

```ts
import { extractImageEntries, generateImageSitemap } from '@ccbd-seo/images';

const entries = extractImageEntries('<img src="/photo.jpg" alt="Photo" />', 'https://example.com');
const xml = generateImageSitemap([
  { pageUrl: 'https://example.com/', images: entries },
]);
```

## API Reference

### Analyzers

- `analyzeAltText(input)` — Audit alt text quality (missing, too short/long, filename patterns, duplicates, keyphrase)
- `auditLazyLoading(input)` — CWV-aware checks (above-fold lazy loading, missing dimensions, srcset/sizes)
- `detectFormat(src)` — Identify image format from URL/filename
- `getFormatRecommendation(format)` — Suggest modern format alternatives (WebP, AVIF)
- `analyzeImageFormats(input)` — Format audit across all images

### Sitemap

- `extractImageEntries(html, baseUrl)` — Extract image data from HTML string
- `generateImageSitemap(pages)` — Generate image sitemap XML with `<image:image>` extensions

### Types

```ts
import type {
  ImageFormat,
  ImageInfo,
  ImageIssueSeverity,
  ImageIssue,
  ImageAnalysisResult,
  ImageAuditResult,
  ImageSitemapPage,
  FormatAnalysisResult,
  FormatAuditResult,
  LazyLoadingAuditResult,
  SitemapImage,
} from '@ccbd-seo/images';
```

## License

[MIT](../../LICENSE)
