# @ccbd-seo/meta

> SSR-optimized meta tag helpers for Next.js App Router, Remix v2, and generic server-side rendering.

## Installation

```bash
npm install @ccbd-seo/meta @ccbd-seo/core
```

## Usage

### Next.js App Router

```ts
// app/blog/[slug]/page.tsx
import { createMetadata } from '@ccbd-seo/meta';

export function generateMetadata({ params }) {
  return createMetadata({
    title: 'My Blog Post',
    description: 'A great article about SEO.',
    canonical: `https://example.com/blog/${params.slug}`,
    openGraph: {
      type: 'article',
      images: [{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
  });
}
```

### Remix v2

```ts
// app/routes/blog.$slug.tsx
import { createMetaDescriptors } from '@ccbd-seo/meta';

export const meta = () => {
  return createMetaDescriptors({
    title: 'My Blog Post',
    description: 'A great article about SEO.',
    canonical: 'https://example.com/blog/my-post',
    openGraph: { type: 'article' },
  });
};
```

### Generic SSR (HTML Strings)

```ts
import { createHeadTags } from '@ccbd-seo/meta';

const html = createHeadTags({
  title: 'My Page',
  description: 'Page description.',
  canonical: 'https://example.com/page',
});
// '<title>My Page</title><meta name="description" content="Page description." />...'
```

### Generic SSR (Tag Objects)

```ts
import { createHeadTagObjects } from '@ccbd-seo/meta';

const tags = createHeadTagObjects({
  title: 'My Page',
  description: 'Page description.',
});
// [{ tag: 'title', content: 'My Page' }, { tag: 'meta', attributes: { name: 'description', ... } }]
```

## API Reference

### Next.js

- `createMetadata(config)` — Returns Next.js App Router `Metadata` object

### Remix

- `createMetaDescriptors(config)` — Returns Remix v2 `MetaDescriptor[]` array

### Generic SSR

- `createHeadTags(config)` — Returns HTML string of head tags
- `createHeadTagObjects(config)` — Returns array of tag objects for programmatic use

### Types

```ts
import type {
  NextMetadata,
  NextOGImage,
  RemixMetaDescriptor,
  HeadTag,
} from '@ccbd-seo/meta';
```

## License

[MIT](../../LICENSE)
