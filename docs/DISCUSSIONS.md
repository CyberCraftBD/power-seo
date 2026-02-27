# Power-SEO GitHub Discussions Guide

This document provides comprehensive discussion topics and answers for the power-seo project.

---

## 1. Getting Started

### Topic: "How do I install power-seo for Next.js?"

**Answer:**

Power-seo works with both Next.js 14+ (App Router) and Next.js 13 (Pages Router). Here's the recommended setup:

#### Next.js 14+ (App Router)

```bash
npm install @power-seo/meta @power-seo/schema
# or
pnpm add @power-seo/meta @power-seo/schema
```

In your `app/layout.tsx`:

```tsx
import { createMetadata } from '@power-seo/meta';

export const metadata = createMetadata({
  title: 'My Site',
  description: 'My awesome site description',
  openGraph: {
    type: 'website',
    siteName: 'My Site',
    images: [{ url: 'https://example.com/og.jpg', width: 1200, height: 630 }],
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

For dynamic pages:

```tsx
export function generateMetadata({ params }) {
  return createMetadata({
    title: `Product: ${params.id}`,
    canonical: `https://example.com/products/${params.id}`,
  });
}

export default function ProductPage({ params }) {
  return <h1>Product {params.id}</h1>;
}
```

#### Next.js 13 (Pages Router)

Use `@power-seo/react` instead:

```bash
npm install @power-seo/react @power-seo/schema
```

```tsx
import { SEO, Breadcrumb } from '@power-seo/react';

export default function ProductPage() {
  return (
    <>
      <SEO
        title="Product Name"
        description="Product description"
        canonical="https://example.com/products/123"
        openGraph={{
          type: 'product',
          images: [{ url: 'https://example.com/product.jpg', width: 800, height: 600 }],
        }}
      />
      <Breadcrumb
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Product Name' },
        ]}
      />
      <h1>Product Name</h1>
    </>
  );
}
```

---

### Topic: "Which packages do I need for my use case?"

**Answer:**

Here's a guide based on your specific use case:

#### Content Management / Blog Platform
- `@power-seo/meta` - SSR meta tags
- `@power-seo/schema` - JSON-LD structured data
- `@power-seo/content-analysis` - Yoast-style SEO scoring
- `@power-seo/readability` - Text readability analysis
- `@power-seo/preview` - SERP/OG/Twitter previews

#### eCommerce / Product Catalog
- `@power-seo/schema` - Product schema builders
- `@power-seo/images` - Image SEO and alt text analysis
- `@power-seo/sitemap` - XML sitemap generation
- `@power-seo/audit` - Full SEO audits for products

#### Multi-language Site
- `@power-seo/react` - hreflang components
- `@power-seo/sitemap` - Per-locale sitemaps
- `@power-seo/redirects` - Language-based redirects

#### SEO Analytics & Reporting
- `@power-seo/search-console` - GSC API integration
- `@power-seo/analytics` - Analytics dashboard builder
- `@power-seo/integrations` - Semrush/Ahrefs clients
- `@power-seo/audit` - Programmatic SEO audits

#### Enterprise / Full Toolkit
Install all 17 packages for complete SEO coverage.

---

### Topic: "How do I use power-seo with Remix?"

**Answer:**

Power-seo provides first-class Remix v2 support:

```bash
npm install @power-seo/meta @power-seo/schema
```

In your route (e.g., `routes/blog.$slug.tsx`):

```tsx
import { createMetaDescriptors } from '@power-seo/meta';
import { article, toJsonLdString } from '@power-seo/schema';

export const meta: MetaFunction = ({ data }) => {
  return createMetaDescriptors({
    title: data.post.title,
    description: data.post.excerpt,
    canonical: `https://example.com/blog/${data.post.slug}`,
    openGraph: {
      type: 'article',
      images: [{ url: data.post.coverImage, width: 1200, height: 630 }],
    },
  });
};

export default function BlogPost({ loaderData }) {
  const jsonLd = article({
    headline: loaderData.post.title,
    datePublished: loaderData.post.publishedAt,
    author: { name: loaderData.post.author, url: 'https://example.com/authors' },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdString(jsonLd) }}
      />
      <article>{/* content */}</article>
    </>
  );
}
```

**Key differences from Next.js:**
- Use `createMetaDescriptors()` instead of `createMetadata()`
- Returns `MetaDescriptor[]` for the `meta` export
- JSON-LD still uses `article()` builder and `toJsonLdString()`
- No `generateMetadata()` function - use the `meta` export

---

## 2. Common Questions & Answers

### Topic: "How accurate is the SERP preview truncation?"

**Answer:**

Power-seo calculates SERP preview truncation to **pixel accuracy** at 580px width, matching Google's actual display.

```ts
import { generateSerpPreview } from '@power-seo/preview';

const preview = generateSerpPreview({
  title: 'How to Learn React - Complete Beginner Guide 2026',
  description: 'Master React from zero to hero with our comprehensive guide including hooks, context, and state management.',
  url: 'https://example.com/blog/react-guide',
  siteTitle: 'Dev Blog',
});

console.log(preview.titleTruncated);  // false or true
console.log(preview.title);            // Full title with site name
console.log(preview.displayUrl);       // Breadcrumb-style URL display
```

**How it works:**
1. Title width calculated in pixels (not characters)
2. Includes site title suffix in calculation
3. Respects Google's typical 55-60 character limit (varies by font)
4. Returns `titleTruncated: true` if cut off in SERP

**Test your content:**
- **Safe zone:** 40-50 characters (always visible)
- **Warning zone:** 50-60 characters (might be truncated)
- **Danger zone:** 60+ characters (will be truncated)

---

### Topic: "Can I use power-seo in an SPA (Single Page Application)?"

**Answer:**

Yes! Use `@power-seo/react` for SPAs:

```bash
npm install @power-seo/react @power-seo/schema @power-seo/core
```

The difference from SSR:
- Meta tags update dynamically in browser (not on server)
- Use `<Helmet>` pattern for SEO
- Suitable for Vite, Create React App, Gatsby

```tsx
import { SEO, DefaultSEO, Breadcrumb } from '@power-seo/react';
import { article, toJsonLdString } from '@power-seo/schema';

function App() {
  return (
    <DefaultSEO
      titleTemplate="%s | My App"
      defaultTitle="My App"
      openGraph={{ type: 'website', siteName: 'My App' }}
    >
      <Router>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </Router>
    </DefaultSEO>
  );
}

function BlogPost() {
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Fetch post data
  }, []);

  if (!post) return <div>Loading...</div>;

  const jsonLd = article({
    headline: post.title,
    datePublished: post.date,
    image: { url: post.image, width: 1200, height: 630 },
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
        dangerouslySetInnerHTML={{ __html: toJsonLdString(jsonLd) }}
      />
      <Breadcrumb items={breadcrumbs} />
      <article>{post.content}</article>
    </>
  );
}
```

**Trade-offs:**
- ✅ Dynamic meta tag updates
- ❌ Google crawls with a delay (no SSR)
- ❌ Initial page load shows generic OG image
- ✅ Good for internal site navigation with dynamic content

---

### Topic: "How do I validate JSON-LD schema before publishing?"

**Answer:**

Use `validateSchema()` to catch schema errors before they reach production:

```ts
import { article, validateSchema, toJsonLdString } from '@power-seo/schema';

const schema = article({
  headline: 'My Article',
  datePublished: '2026-01-15',
  author: { name: 'Jane Doe' },
  image: { url: 'https://example.com/image.jpg', width: 1200, height: 630 },
});

const { valid, issues } = validateSchema(schema);

if (!valid) {
  console.error('Schema validation failed:');
  issues.forEach((issue) => {
    console.error(`- ${issue.path}: ${issue.message}`);
  });
  process.exit(1);
}

// Schema is valid - safe to render
const html = toJsonLdString(schema);
```

**Common validation errors:**
- Missing required fields (headline, datePublished)
- Invalid image dimensions
- Malformed URLs
- Invalid date formats (must be ISO 8601)

**Pro tip:** Combine multiple schemas with `schemaGraph()`:

```ts
import { schemaGraph, article, faqPage, breadcrumbList, validateSchema } from '@power-seo/schema';

const graph = schemaGraph([
  article({ headline: 'My Article', datePublished: '2026-01-15' }),
  faqPage([
    { question: 'Q1?', answer: 'A1' },
    { question: 'Q2?', answer: 'A2' },
  ]),
  breadcrumbList([
    { name: 'Home', url: 'https://example.com' },
    { name: 'Articles', url: 'https://example.com/articles' },
    { name: 'My Article' },
  ]),
]);

const { valid, issues } = validateSchema(graph);
```

---

## 3. Feature Requests & Discussion

### Topic: "How to implement SEO quality gates in CI/CD?"

**Answer:**

Use `@power-seo/audit`, `@power-seo/content-analysis`, and `@power-seo/readability` to block deployments:

```ts
// ci-seo-check.ts
import { auditPage } from '@power-seo/audit';
import { analyzeContent } from '@power-seo/content-analysis';
import { analyzeReadability } from '@power-seo/readability';

async function checkSeoQuality() {
  const errors: string[] = [];

  // 1. Full audit (0-100 score)
  const audit = auditPage({
    url: 'https://example.com/my-page',
    title: 'Page Title',
    metaDescription: 'Meta description here',
    headings: ['h1:Page Title', 'h2:Section One'],
    focusKeyphrase: 'my keyword',
    wordCount: 1200,
    internalLinks: ['/', '/about', '/blog'],
    externalLinks: ['https://example.com'],
  });

  if (audit.score < 70) {
    errors.push(`❌ Audit score too low: ${audit.score}/100`);
  }

  // 2. Content analysis (Yoast-style)
  const content = analyzeContent({
    title: 'Page Title',
    metaDescription: 'Meta description',
    content: '<h1>Page Title</h1><p>Content here...</p>',
    focusKeyphrase: 'my keyword',
    images: [{ src: '/image.jpg', alt: 'Image alt text' }],
    internalLinks: ['/blog', '/about'],
    externalLinks: ['https://example.com'],
  });

  if (content.score / content.maxScore < 0.6) {
    errors.push(`❌ Content SEO score below 60%: ${Math.round((content.score / content.maxScore) * 100)}%`);
  }

  // 3. Readability
  const readability = analyzeReadability({
    content: '<h1>Page Title</h1><p>Content here...</p>',
  });

  if (readability.status === 'poor') {
    errors.push(`❌ Readability is poor - simplify content`);
  }

  if (errors.length > 0) {
    console.error('SEO Quality Gate Failed:');
    errors.forEach((e) => console.error(e));
    process.exit(1);
  }

  console.log('✅ All SEO checks passed');
}

checkSeoQuality();
```

**GitHub Actions workflow:**

```yaml
name: SEO Quality Gate

on: [pull_request]

jobs:
  seo-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - name: Run SEO checks
        run: pnpm exec ts-node ci-seo-check.ts
```

---

### Topic: "How to generate sitemaps for 50,000+ URLs?"

**Answer:**

Use `streamSitemap()` for constant memory usage instead of `generateSitemap()`:

```ts
// app/sitemap.xml/route.ts (Next.js)
import { streamSitemap } from '@power-seo/sitemap';

export async function GET() {
  // Fetch URLs (could be from database)
  const urls = await fetchAllUrls();

  // Stream - memory stays constant regardless of URL count
  const chunks = [...streamSitemap('https://example.com', urls)];

  return new Response(chunks.join(''), {
    headers: { 'Content-Type': 'application/xml' },
  });
}

async function fetchAllUrls() {
  return [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'yearly', priority: 0.5 },
    // ... 49,998 more URLs
  ];
}
```

**For splitting large sitemaps into index:**

```ts
import { splitSitemap } from '@power-seo/sitemap';

const { index, sitemaps } = splitSitemap({
  hostname: 'https://example.com',
  urls: allUrls, // Can be 1M+ URLs
});

// index.xml contains sitemap references
// sitemaps[0], sitemaps[1], etc. contain actual URLs (max 50k each)
```

**Key differences:**
- `generateSitemap()` - loads all URLs in memory
- `streamSitemap()` - processes URLs as generators (constant memory)
- `splitSitemap()` - auto-splits into multiple sitemaps at 50k limit

---

## 4. Troubleshooting

### Topic: "My meta tags aren't showing on social media"

**Answer:**

Debug using `generateOgPreview()`:

```ts
import { generateOgPreview, generateTwitterPreview } from '@power-seo/preview';

const og = generateOgPreview({
  title: 'My Post Title',
  description: 'My post description',
  url: 'https://example.com/posts/my-post',
  image: { url: 'https://example.com/og.jpg', width: 1200, height: 630 },
});

console.log(og.image?.valid);   // Check if image is valid
console.log(og.image?.message); // Error message if invalid

const twitter = generateTwitterPreview({
  title: 'My Post Title',
  description: 'My post description',
  url: 'https://example.com/posts/my-post',
  image: { url: 'https://example.com/twitter.jpg', width: 800, height: 418 },
  cardType: 'summary_large_image',
});

console.log(twitter.valid); // true/false
```

**Common issues:**
- ❌ Image URL not publicly accessible
- ❌ Image dimensions don't meet platform minimums
- ❌ Meta tags not in `<head>` (SSR issue)
- ❌ Og:type not valid (use `website`, `article`, `product`)

---

### Topic: "Content analysis score seems too low"

**Answer:**

Content analysis uses multiple factors. Check each:

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const result = analyzeContent({
  title: 'My Title',
  metaDescription: 'My description',
  content: '<h1>My Title</h1><p>Content...</p>',
  focusKeyphrase: 'my keyword',
  images: [{ src: '/image.jpg', alt: 'Alt text' }],
  internalLinks: ['/page1', '/page2'],
  externalLinks: ['https://external.com'],
});

console.log(result.score);        // 25
console.log(result.maxScore);     // 55
console.log(result.results);      // Individual check results
result.results.forEach((r) => {
  console.log(`${r.name}: ${r.status} - ${r.message}`);
});
```

**Scoring factors:**
- Keyphrase in title
- Keyphrase density (2-3% is optimal)
- Meta description length (120-160 chars)
- Headings structure (h1 at top, proper hierarchy)
- Word count (minimum 300 words)
- Internal links present
- External links present
- Images with alt text

---

## 5. Best Practices

### Topic: "SEO best practices for Next.js eCommerce"

**Answer:**

Follow this checklist:

```ts
// 1. Meta tags + Open Graph (required)
export const metadata = createMetadata({
  title: 'Product Name | Your Store',
  description: 'Short product description optimized for SERP',
  canonical: `https://shop.example.com/products/product-slug`,
  openGraph: {
    type: 'product',
    images: [{
      url: 'https://shop.example.com/product-og.jpg',
      width: 1200,
      height: 630,
      alt: 'Product Name',
    }],
  },
});

// 2. Product schema (required for Google Shopping)
import { product, validateSchema, toJsonLdString } from '@power-seo/schema';

const schema = product({
  name: 'Product Name',
  description: 'Detailed product description',
  image: [{
    url: 'https://shop.example.com/product.jpg',
    width: 800,
    height: 800,
  }],
  brand: { name: 'Your Brand' },
  offers: {
    price: 99.99,
    priceCurrency: 'USD',
    availability: 'InStock',
    seller: { name: 'Your Store' },
  },
  aggregateRating: {
    ratingValue: 4.5,
    reviewCount: 128,
  },
});

const { valid } = validateSchema(schema);

// 3. Image SEO
import { analyzeImageFormats, analyzeAltText } from '@power-seo/images';

const images = [
  { src: '/product-main.jpg', alt: 'Product name', isAboveFold: true, size: 250000 },
  { src: '/product-detail.jpg', alt: 'Product detail', isAboveFold: false, size: 180000 },
];

const altAudit = analyzeAltText({ images });
const formatAudit = analyzeImageFormats({ images });

// 4. Sitemap (required)
import { generateSitemap } from '@power-seo/sitemap';

export default async function sitemap() {
  const products = await fetchAllProducts();
  return products.map((p) => ({
    url: `https://shop.example.com/products/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.8,
    changefreq: 'weekly',
  }));
}

// 5. Structured data validation
const { valid, issues } = validateSchema(schema);
if (!valid) {
  logger.error('Product schema invalid:', issues);
  // Don't render invalid schema
}
```

---

## 6. Package-Specific Questions

### Topic: "What's the difference between @power-seo/core and @power-seo/react?"

**Answer:**

| Feature | `@power-seo/core` | `@power-seo/react` |
|---------|-------------------|-------------------|
| **Dependencies** | Zero (framework-agnostic) | React 18+ |
| **Use Case** | Any JavaScript environment | React SPAs only |
| **Exports** | Utilities, types, validators | Components, hooks |
| **Example** | `validateTitle()`, `stripHtml()` | `<SEO>`, `<Breadcrumb>` |
| **Bundle Size** | ~3KB | ~8KB |
| **SSR** | Yes | Yes (with Node.js) |
| **Edge Functions** | Yes | Yes |

**Use `@power-seo/core` when:**
- Building backend APIs
- Writing Node.js scripts
- Using headless frameworks (Express, Fastify, Remix loaders)
- Need zero dependencies

**Use `@power-seo/react` when:**
- Building React SPAs (Vite, CRA, Gatsby)
- Need components for meta management
- SSR not available (client-side only)

---

### Topic: "How to use @power-seo/schema in Typescript?"

**Answer:**

Full type safety for JSON-LD:

```ts
import {
  Article,
  Product,
  FAQPage,
  article,
  product,
  faqPage,
  validateSchema,
} from '@power-seo/schema';

// Type-safe builder functions
const myArticle: Article = article({
  headline: 'My Article',
  datePublished: '2026-01-15',
  author: { name: 'Jane Doe', url: 'https://example.com/authors/jane' },
  image: {
    url: 'https://example.com/og.jpg',
    width: 1200,
    height: 630,
  },
});

// Catch errors at compile time
const invalidArticle = article({
  headline: 'My Article',
  // ❌ TypeScript error: Property 'datePublished' is missing
});

// Full schema object typing
type MyProductType = Product & {
  customField?: string; // Extend if needed
};

// Validate at runtime
const { valid, issues } = validateSchema(myArticle);
if (!valid) {
  issues.forEach((issue) => {
    console.error(`${issue.path}: ${issue.message}`);
  });
}
```

---

This guide covers the most common questions and discussions around power-seo. Feel free to open new discussions for additional topics!
