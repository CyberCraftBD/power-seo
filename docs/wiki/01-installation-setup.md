# Installation & Setup Guide

Complete installation guide for power-seo across different frameworks and environments.

## Prerequisites

- **Node.js:** 18.0.0 or higher
- **pnpm:** 9.0.0 or higher (recommended)
- **npm:** 9.0.0 or higher (alternative)
- **TypeScript:** 5.0+ (optional but recommended)

### Verify your environment:

```bash
node --version    # v18.0.0+
npm --version     # 9.0.0+
pnpm --version    # 9.0.0+
tsc --version     # 5.0+
```

---

## Framework-Specific Installation

### Next.js 14+ (App Router) ⭐ Recommended

The most native integration with full App Router support.

#### Step 1: Install core packages

```bash
npm install @power-seo/meta @power-seo/schema
# or
pnpm add @power-seo/meta @power-seo/schema
```

#### Step 2: Setup in your app

**app/layout.tsx:**

```tsx
import { createMetadata } from '@power-seo/meta';

export const metadata = createMetadata({
  title: {
    template: '%s | My Site',
    default: 'My Site',
  },
  description: 'Welcome to my site',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    siteName: 'My Site',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**app/blog/[slug]/page.tsx:**

```tsx
import { createMetadata } from '@power-seo/meta';
import { article, toJsonLdString } from '@power-seo/schema';

export function generateMetadata({ params }) {
  return createMetadata({
    title: 'Blog Post Title',
    description: 'Blog post description',
    canonical: `https://example.com/blog/${params.slug}`,
    openGraph: {
      type: 'article',
      publishedTime: '2026-01-15T00:00:00Z',
      authors: ['Jane Doe'],
      tags: ['seo', 'nextjs'],
    },
  });
}

export default function BlogPage() {
  const schema = article({
    headline: 'Blog Post Title',
    datePublished: '2026-01-15',
    author: { name: 'Jane Doe' },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdString(schema) }}
      />
      {/* Page content */}
    </>
  );
}
```

#### Additional packages (optional)

For full feature set:

```bash
npm install @power-seo/content-analysis @power-seo/readability \
  @power-seo/preview @power-seo/sitemap @power-seo/audit @power-seo/images
```

---

### Next.js 13 (Pages Router)

For legacy Next.js with Pages Router:

```bash
npm install @power-seo/react @power-seo/schema @power-seo/core
```

**pages/_document.tsx:**

```tsx
import { Html, Head, Main, NextScript } from 'next/document';
import { DefaultSEO } from '@power-seo/react';

export default function Document() {
  return (
    <Html>
      <Head>
        <DefaultSEO
          titleTemplate="%s | My Site"
          defaultTitle="My Site"
          description="Welcome to my site"
          openGraph={{
            type: 'website',
            locale: 'en_US',
            url: 'https://example.com',
            siteName: 'My Site',
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

---

### Remix v2

Native Remix v2 support with the `meta` export:

```bash
npm install @power-seo/meta @power-seo/schema
```

**routes/root.tsx:**

```tsx
import { createMetaDescriptors } from '@power-seo/meta';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () =>
  createMetaDescriptors({
    title: 'My Site',
    description: 'Welcome to my site',
    openGraph: {
      type: 'website',
      url: 'https://example.com',
      siteName: 'My Site',
    },
  });

export default function Root() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* App outlet */}
      </body>
    </html>
  );
}
```

**routes/blog.$slug.tsx:**

```tsx
import { createMetaDescriptors } from '@power-seo/meta';
import { article, toJsonLdString } from '@power-seo/schema';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = ({ data }) =>
  createMetaDescriptors({
    title: data.post.title,
    description: data.post.excerpt,
    canonical: `https://example.com/blog/${data.post.slug}`,
    openGraph: {
      type: 'article',
      publishedTime: data.post.publishedAt,
    },
  });

export default function BlogPost({ loaderData }) {
  const schema = article({
    headline: loaderData.post.title,
    datePublished: loaderData.post.publishedAt,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdString(schema) }}
      />
      {/* Content */}
    </>
  );
}
```

---

### React SPA (Vite, Create React App, Gatsby)

For client-side rendering:

```bash
npm install @power-seo/react @power-seo/schema @power-seo/core
```

**App.tsx:**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DefaultSEO } from '@power-seo/react';

function App() {
  return (
    <DefaultSEO
      titleTemplate="%s | My Site"
      defaultTitle="My Site"
      description="Welcome to my site"
      openGraph={{ type: 'website', siteName: 'My Site' }}
      twitter={{ site: '@mysite', cardType: 'summary_large_image' }}
    >
      <BrowserRouter>
        <Routes>
          {/* Routes */}
        </Routes>
      </BrowserRouter>
    </DefaultSEO>
  );
}
```

**pages/BlogPage.tsx:**

```tsx
import { SEO, Breadcrumb } from '@power-seo/react';
import { article, toJsonLdString } from '@power-seo/schema';
import { useEffect, useState } from 'react';

export default function BlogPage({ slug }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Fetch post data
  }, [slug]);

  if (!post) return null;

  const schema = article({
    headline: post.title,
    datePublished: post.publishedAt,
  });

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`https://example.com/blog/${post.slug}`}
        openGraph={{
          type: 'article',
          images: [{ url: post.coverImage, width: 1200, height: 630 }],
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdString(schema) }}
      />
      <Breadcrumb
        items={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
          { name: post.title },
        ]}
      />
      <article>{post.content}</article>
    </>
  );
}
```

---

### Node.js / Express / Fastify

For backend SEO tools:

```bash
npm install @power-seo/core @power-seo/sitemap @power-seo/audit
```

**Express example:**

```ts
import express from 'express';
import { generateSitemap, validateSitemapUrl } from '@power-seo/sitemap';

const app = express();

app.get('/sitemap.xml', (req, res) => {
  const urls = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'yearly', priority: 0.5 },
  ];

  const xml = generateSitemap({
    hostname: 'https://example.com',
    urls,
  });

  res.type('application/xml').send(xml);
});

app.listen(3000, () => console.log('Server running on :3000'));
```

---

## Installation by Use Case

### Headless CMS / Blog Platform

```bash
npm install @power-seo/meta @power-seo/schema \
  @power-seo/content-analysis @power-seo/readability \
  @power-seo/preview @power-seo/audit
```

Features:
- Content scoring (Yoast-style)
- Readability analysis
- SEO audit engine
- SERP preview generation

### eCommerce / Product Catalog

```bash
npm install @power-seo/meta @power-seo/schema \
  @power-seo/images @power-seo/sitemap \
  @power-seo/audit @power-seo/redirects
```

Features:
- Product schema builders
- Image SEO analysis
- Sitemap generation
- Redirect management
- SEO audits

### SaaS Dashboard / Application

```bash
npm install @power-seo/core @power-seo/audit \
  @power-seo/search-console @power-seo/analytics \
  @power-seo/integrations
```

Features:
- SEO auditing
- GSC integration
- Analytics dashboard
- Semrush/Ahrefs data
- Reporting tools

### Multi-language Site

```bash
npm install @power-seo/react @power-seo/schema \
  @power-seo/sitemap @power-seo/redirects
```

Features:
- Hreflang components
- Per-locale sitemaps
- Locale-aware redirects
- Multi-language schema

---

## Verify Installation

Test that everything is installed correctly:

```bash
# For Next.js
npm run build  # Should succeed

# For any project
node -e "console.log(require('@power-seo/core').validateTitle('Test'))"
```

---

## Next Steps

1. **[Quick Start](./02-quick-start.md)** - Get running in 5 minutes
2. **[Package Selection](./03-package-selection.md)** - Choose packages for your needs
3. **[Framework Integration](./06-framework-integration.md)** - Detailed framework setup

