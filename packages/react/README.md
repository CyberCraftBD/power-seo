# @ccbd-seo/react

> React components for managing SEO meta tags, Open Graph, Twitter Cards, and breadcrumbs.

## Installation

```bash
npm install @ccbd-seo/react @ccbd-seo/core
```

## Usage

### Site-Wide Defaults

```tsx
import { DefaultSEO } from '@ccbd-seo/react';

function App({ children }) {
  return (
    <>
      <DefaultSEO
        titleTemplate="%s | My Site"
        defaultTitle="My Site"
        openGraph={{
          type: 'website',
          siteName: 'My Site',
        }}
      />
      {children}
    </>
  );
}
```

### Per-Page SEO

```tsx
import { SEO } from '@ccbd-seo/react';

function BlogPost() {
  return (
    <>
      <SEO
        title="My Blog Post"
        description="A great article about React SEO."
        canonical="https://example.com/blog/my-post"
        openGraph={{
          type: 'article',
          images: [{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }],
        }}
        twitter={{ card: 'summary_large_image' }}
      />
      <article>{/* ... */}</article>
    </>
  );
}
```

### Individual Components

```tsx
import { OpenGraph, TwitterCard, Canonical, Robots, Hreflang, Breadcrumb } from '@ccbd-seo/react';

<Canonical url="https://example.com/page" />
<Robots index={true} follow={true} />
<Hreflang entries={[{ lang: 'en', url: 'https://example.com' }]} />
<Breadcrumb items={[
  { name: 'Home', url: 'https://example.com' },
  { name: 'Blog', url: 'https://example.com/blog' },
  { name: 'Post' },
]} />
```

## API Reference

### Components

| Component | Props Type | Purpose |
|-----------|-----------|---------|
| `SEO` | `SEOProps` | All-in-one: renders meta, OG, Twitter, canonical, robots, and hreflang tags |
| `DefaultSEO` | `DefaultSEOProps` | Site-wide SEO defaults via React context |
| `OpenGraph` | `OpenGraphProps` | Open Graph meta tags |
| `TwitterCard` | `TwitterCardProps` | Twitter Card meta tags |
| `Canonical` | `CanonicalProps` | Canonical link tag |
| `Robots` | `RobotsProps` | Robots meta tag |
| `Hreflang` | `HreflangProps` | Hreflang alternate link tags |
| `Breadcrumb` | `BreadcrumbProps` | SEO-aware breadcrumb with JSON-LD |

### Utilities

- `renderMetaTags(tags)` — Render `MetaTag[]` objects to React elements
- `renderLinkTags(tags)` — Render `LinkTag[]` objects to React elements

### Context

- `SEOContext` — React context for default SEO configuration
- `useDefaultSEO()` — Hook to access the default SEO context value

## License

[MIT](../../LICENSE)
