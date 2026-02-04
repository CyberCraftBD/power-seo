# Quick Start Guide — 5 Minutes

Get power-seo running in your project in less than 5 minutes.

## For Next.js 14+ (App Router)

### Step 1: Install (30 seconds)

```bash
npm install @power-seo/meta @power-seo/schema
```

### Step 2: Add metadata to layout (1 minute)

**app/layout.tsx:**

```tsx
import { createMetadata } from '@power-seo/meta';

export const metadata = createMetadata({
  title: {
    template: '%s | My Site',
    default: 'Welcome to My Site',
  },
  description: 'Your site description here',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    type: 'website',
    url: 'https://example.com',
    siteName: 'My Site',
  },
});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Step 3: Add page-specific metadata (1 minute)

**app/blog/[slug]/page.tsx:**

```tsx
import { createMetadata } from '@power-seo/meta';
import { article, toJsonLdString } from '@power-seo/schema';

export function generateMetadata({ params }) {
  return createMetadata({
    title: 'My Blog Post',
    description: 'A great article about SEO.',
    canonical: `https://example.com/blog/${params.slug}`,
    openGraph: {
      type: 'article',
      publishedTime: '2026-01-15T00:00:00Z',
    },
  });
}

export default function BlogPage() {
  const schema = article({
    headline: 'My Blog Post',
    datePublished: '2026-01-15',
    author: { name: 'Jane Doe' },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdString(schema) }}
      />
      <article>
        <h1>My Blog Post</h1>
        <p>Your content here...</p>
      </article>
    </>
  );
}
```

### Step 4: Test (1 minute)

```bash
npm run build
npm run dev
```

Visit `http://localhost:3000/blog/my-post` and:
- Check browser DevTools → Elements → `<head>`
- Verify meta tags are present
- Use [Schema.org validator](https://schema.org/validator) to test JSON-LD

✅ **Done!** You now have full SEO meta tags and structured data.

---

## For Remix v2

### Step 1: Install (30 seconds)

```bash
npm install @power-seo/meta @power-seo/schema
```

### Step 2: Add metadata to root (1 minute)

**routes/root.tsx:**

```tsx
import { createMetaDescriptors } from '@power-seo/meta';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () =>
  createMetaDescriptors({
    title: 'My Site',
    description: 'Your site description',
    canonical: 'https://example.com',
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
      </head>
      <body>{/* Outlet */}</body>
    </html>
  );
}
```

### Step 3: Add route-specific metadata (1 minute)

**routes/blog.$slug.tsx:**

```tsx
import { createMetaDescriptors } from '@power-seo/meta';
import { article, toJsonLdString } from '@power-seo/schema';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ params }) => {
  const post = await getPost(params.slug);
  return { post };
};

export const meta: MetaFunction = ({ data }) =>
  createMetaDescriptors({
    title: data.post.title,
    description: data.post.excerpt,
    canonical: `https://example.com/blog/${data.post.slug}`,
    openGraph: {
      type: 'article',
      publishedTime: data.post.date,
    },
  });

export default function BlogPost({ loaderData }) {
  const schema = article({
    headline: loaderData.post.title,
    datePublished: loaderData.post.date,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdString(schema) }}
      />
      <article>{loaderData.post.content}</article>
    </>
  );
}
```

### Step 4: Test (1 minute)

```bash
npm run dev
```

✅ **Done!** Meta tags automatically render on both server and client.

---

## For React SPA (Vite / CRA / Gatsby)

### Step 1: Install (30 seconds)

```bash
npm install @power-seo/react @power-seo/schema @power-seo/core
```

### Step 2: Wrap App with DefaultSEO (1 minute)

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
      openGraph={{
        type: 'website',
        locale: 'en_US',
        url: 'https://example.com',
        siteName: 'My Site',
      }}
      twitter={{
        site: '@mysite',
        cardType: 'summary_large_image',
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPage />} />
        </Routes>
      </BrowserRouter>
    </DefaultSEO>
  );
}

export default App;
```

### Step 3: Add page-specific SEO (1 minute)

**pages/BlogPage.tsx:**

```tsx
import { SEO, Breadcrumb } from '@power-seo/react';
import { article, toJsonLdString } from '@power-seo/schema';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function BlogPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Fetch post data
    getPost(slug).then(setPost);
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  const schema = article({
    headline: post.title,
    datePublished: post.date,
    author: { name: post.author },
  });

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`https://example.com/blog/${post.slug}`}
        openGraph={{
          type: 'article',
          images: [{ url: post.image, width: 1200, height: 630 }],
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
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  );
}
```

### Step 4: Test (1 minute)

```bash
npm run dev
```

Navigate to a blog page and check browser DevTools for meta tags.

✅ **Done!** SPA now has dynamic SEO meta tags.

---

## Common Quick Tasks

### Add Content Analysis (Yoast-style scoring)

```bash
npm install @power-seo/content-analysis
```

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const result = analyzeContent({
  title: 'My Article',
  metaDescription: 'Description',
  content: '<h1>My Article</h1><p>Content...</p>',
  focusKeyphrase: 'my keyword',
  images: [{ src: '/image.jpg', alt: 'Image alt' }],
  internalLinks: ['/page1', '/page2'],
  externalLinks: ['https://external.com'],
});

console.log(`SEO Score: ${result.score}/${result.maxScore}`);
result.recommendations.forEach(rec => console.log(`- ${rec}`));
```

### Add XML Sitemap

```bash
npm install @power-seo/sitemap
```

**app/sitemap.ts (Next.js):**

```ts
import { toNextSitemap } from '@power-seo/sitemap/next';

export default async function sitemap() {
  const urls = await fetchAllUrls();
  return toNextSitemap(urls);
}
```

### Add SERP Preview

```bash
npm install @power-seo/preview
```

```ts
import { generateSerpPreview } from '@power-seo/preview';

const preview = generateSerpPreview({
  title: 'My Article Title',
  description: 'My article description',
  url: 'https://example.com/article',
  siteTitle: 'My Site',
});

console.log(preview.title);          // Full title with site name
console.log(preview.titleTruncated); // true if cut off
console.log(preview.displayUrl);     // Formatted URL
```

---

## What's Next?

- **[Package Selection](./03-package-selection.md)** - Choose packages for your needs
- **[All 17 Packages](./pkg-core.md)** - Detailed guides for each package
- **[Use Cases](./uc-cms-blog.md)** - Real-world examples

