# @power-seo/schema Package Guide

Type-safe JSON-LD structured data builders and validators. Includes 23 schema builders and React components.

## Overview

- **Size:** ~8 KB (gzipped)
- **Exports:** 23 schema builders + React components
- **Features:** Full validation, React components, XSS-safe rendering

## Installation

```bash
npm install @power-seo/schema
```

## 23 Schema Builders

### Content Schemas

**1. Article**
```ts
import { article } from '@power-seo/schema';

const schema = article({
  headline: 'My Great Article',
  description: 'Article description',
  datePublished: '2026-01-15T10:00:00Z',
  dateModified: '2026-01-16T15:30:00Z',
  author: {
    name: 'Jane Doe',
    url: 'https://example.com/authors/jane'
  },
  image: {
    url: 'https://example.com/og.jpg',
    width: 1200,
    height: 630
  }
});
```

**2. NewsArticle**
```ts
const schema = newsArticle({
  headline: 'Breaking News',
  description: 'News description',
  datePublished: '2026-01-15T10:00:00Z',
  author: { name: 'Reporter Name' }
});
```

**3. BlogPosting**
```ts
const schema = blogPosting({
  headline: 'Blog Post Title',
  datePublished: '2026-01-15',
  author: { name: 'Blog Author' }
});
```

### Product Schemas

**4. Product**
```ts
import { product } from '@power-seo/schema';

const schema = product({
  name: 'Wireless Headphones',
  description: 'High-quality wireless headphones',
  image: [{
    url: 'https://example.com/product.jpg',
    width: 800,
    height: 600
  }],
  brand: { name: 'MyBrand' },
  offers: {
    price: 99.99,
    priceCurrency: 'USD',
    availability: 'InStock',
    seller: { name: 'Example Store' }
  },
  aggregateRating: {
    ratingValue: 4.5,
    reviewCount: 128
  }
});
```

**5. Service**
```ts
const schema = service({
  name: 'My Service',
  description: 'Service description',
  provider: { name: 'Provider Name' },
  image: 'https://example.com/service.jpg'
});
```

### Organization Schemas

**6. Organization**
```ts
import { organization } from '@power-seo/schema';

const schema = organization({
  name: 'My Company',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  sameAs: [
    'https://facebook.com/mycompany',
    'https://twitter.com/mycompany'
  ],
  contactPoint: {
    contactType: 'customer support',
    email: 'support@example.com',
    telephone: '+1-555-123-4567'
  }
});
```

**7. LocalBusiness**
```ts
const schema = localBusiness({
  name: 'My Local Business',
  address: {
    streetAddress: '123 Main St',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10001',
    addressCountry: 'US'
  },
  telephone: '+1-555-123-4567',
  openingHoursSpecification: [{
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday'],
    opens: '09:00',
    closes: '17:00'
  }]
});
```

**8. Person**
```ts
const schema = person({
  name: 'Jane Doe',
  url: 'https://example.com/authors/jane',
  image: 'https://example.com/jane.jpg',
  jobTitle: 'Software Engineer',
  worksFor: { name: 'Company Name' }
});
```

### Navigation & Structure

**9. BreadcrumbList**
```ts
import { breadcrumbList } from '@power-seo/schema';

const schema = breadcrumbList([
  { name: 'Home', url: 'https://example.com' },
  { name: 'Products', url: 'https://example.com/products' },
  { name: 'Headphones' }
]);
```

**10. FAQPage**
```ts
import { faqPage } from '@power-seo/schema';

const schema = faqPage([
  {
    question: 'What is power-seo?',
    answer: 'Power-seo is an SEO toolkit for React and TypeScript.'
  },
  {
    question: 'How do I install it?',
    answer: 'npm install @power-seo/core @power-seo/schema'
  }
]);
```

**11. SiteNavigationElement**
```ts
const schema = siteNavigationElement({
  name: 'Main Menu',
  url: 'https://example.com'
});
```

### Event & Schedule

**12. Event**
```ts
import { event } from '@power-seo/schema';

const schema = event({
  name: 'Web Development Conference',
  description: 'Learn modern web development',
  startDate: '2026-06-15T09:00:00Z',
  endDate: '2026-06-17T17:00:00Z',
  location: {
    name: 'Convention Center',
    address: {
      streetAddress: '123 Main St',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10001'
    }
  },
  offers: {
    price: 299,
    priceCurrency: 'USD',
    availability: 'PreOrder'
  }
});
```

### Creative Works

**13. Book**
```ts
import { book } from '@power-seo/schema';

const schema = book({
  name: 'The SEO Guide',
  author: { name: 'Jane Doe' },
  isbn: '978-0-123456-78-9',
  publisher: { name: 'Tech Press' },
  datePublished: '2026-01-15'
});
```

**14. Movie**
```ts
const schema = movie({
  name: 'Great Film',
  director: { name: 'Director Name' },
  datePublished: '2025-12-15',
  image: 'https://example.com/movie.jpg',
  aggregateRating: {
    ratingValue: 8.5,
    reviewCount: 5000
  }
});
```

**15. MusicRelease**
```ts
const schema = musicRelease({
  name: 'Album Name',
  byArtist: { name: 'Artist Name' },
  datePublished: '2026-01-15'
});
```

### Professional & Educational

**16. JobPosting**
```ts
import { jobPosting } from '@power-seo/schema';

const schema = jobPosting({
  title: 'Senior Software Engineer',
  description: 'We are looking for a talented engineer...',
  hiringOrganization: { name: 'Tech Company' },
  jobLocation: {
    name: 'Remote',
    address: {
      addressCountry: 'US'
    }
  },
  baseSalary: {
    currency: 'USD',
    minValue: 100000,
    maxValue: 150000,
    unitText: 'YEAR'
  },
  employmentType: 'FULL_TIME'
});
```

**17. Course**
```ts
const schema = course({
  name: 'Learn SEO Fundamentals',
  description: 'Master SEO basics',
  provider: { name: 'Online Academy' }
});
```

### Media

**18. Recipe**
```ts
import { recipe } from '@power-seo/schema';

const schema = recipe({
  name: 'Chocolate Chip Cookies',
  description: 'Delicious homemade cookies',
  ingredients: ['2 cups flour', '1 cup sugar', '1 cup butter'],
  instructions: 'Mix ingredients and bake at 375°F for 12 minutes',
  cookTime: 'PT15M',
  prepTime: 'PT10M',
  totalTime: 'PT25M',
  recipeYield: '24 cookies'
});
```

**19. VideoObject**
```ts
const schema = videoObject({
  name: 'How to Use Power-SEO',
  description: 'A tutorial on power-seo',
  contentUrl: 'https://example.com/video.mp4',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  uploadDate: '2026-01-15T10:00:00Z'
});
```

**20. ImageObject**
```ts
import { imageObject } from '@power-seo/schema';

const schema = imageObject({
  url: 'https://example.com/image.jpg',
  width: 1200,
  height: 630,
  caption: 'Image caption'
});
```

### Aggregate & Rating

**21. AggregateRating**
```ts
const schema = aggregateRating({
  ratingValue: 4.5,
  reviewCount: 128,
  bestRating: 5,
  worstRating: 1
});
```

### Metadata

**22. Brand**
```ts
import { brand } from '@power-seo/schema';

const schema = brand({
  name: 'My Brand',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png'
});
```

---

## Schema Composition

### Combining Multiple Schemas

```ts
import { schemaGraph, article, faqPage, breadcrumbList } from '@power-seo/schema';

const graph = schemaGraph([
  article({
    headline: 'My Article',
    datePublished: '2026-01-15'
  }),
  faqPage([
    { question: 'Q1?', answer: 'A1' },
    { question: 'Q2?', answer: 'A2' }
  ]),
  breadcrumbList([
    { name: 'Home', url: 'https://example.com' },
    { name: 'Articles', url: 'https://example.com/articles' },
    { name: 'My Article' }
  ])
]);
```

---

## Validation

```ts
import { validateSchema } from '@power-seo/schema';

const { valid, issues } = validateSchema(schema);

if (!valid) {
  issues.forEach(issue => {
    console.error(`${issue.path}: ${issue.message}`);
  });
}
```

**Common validation errors:**
- Missing required fields
- Invalid date formats (must be ISO 8601)
- Invalid image dimensions
- Malformed URLs

---

## Rendering

### Convert to String (XSS-Safe)

```ts
import { toJsonLdString } from '@power-seo/schema';

const jsonLdString = toJsonLdString(schema);
// → JSON string with XSS escaping (< > & escaped to Unicode)
```

### React Components

```tsx
import {
  ArticleJsonLd,
  ProductJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
  EventJsonLd
} from '@power-seo/schema/react';

export default function ProductPage() {
  return (
    <>
      <ProductJsonLd
        name="Product Name"
        image={['https://example.com/product.jpg']}
        description="Product description"
        offers={{
          price: 99.99,
          priceCurrency: 'USD',
          availability: 'InStock'
        }}
      />

      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://example.com' },
          { name: 'Products' }
        ]}
      />

      <h1>Product Name</h1>
      {/* Product content */}
    </>
  );
}
```

---

## Type Definitions

Each schema has full TypeScript types:

```ts
interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description?: string;
  datePublished: string; // ISO 8601
  dateModified?: string;
  author?: Person | Organization;
  image?: ImageObject | string;
  wordCount?: number;
  articleBody?: string;
}

interface ProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description?: string;
  image?: string | ImageObject | (string | ImageObject)[];
  brand?: Brand | Organization;
  offers?: Offer | Offer[];
  aggregateRating?: AggregateRating;
  review?: Review[];
}
```

---

## Best Practices

1. **Always validate** before rendering:
   ```ts
   const { valid } = validateSchema(schema);
   if (!valid) return null; // Don't render invalid schema
   ```

2. **Use React components** for automatic script tags:
   ```tsx
   <ArticleJsonLd headline="..." datePublished="..." />
   // Renders <script type="application/ld+json">...</script>
   ```

3. **Combine schemas** for richer results:
   ```ts
   schemaGraph([
     article({ ... }),
     breadcrumbList([ ... ]),
     faqPage([ ... ])
   ])
   ```

4. **Keep data fresh** - Update dateModified:
   ```ts
   article({
     datePublished: '2026-01-15',
     dateModified: '2026-01-16', // Update when content changes
   })
   ```

---

## Next Steps

1. **[Quick Start](./02-quick-start.md)** - Use schemas in your project
2. **[@power-seo/core](./pkg-core.md)** - Validate content before schema
3. **[@power-seo/audit](./pkg-audit.md)** - Audit schema quality

