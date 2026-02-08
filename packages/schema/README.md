# @ccbd-seo/schema

> Type-safe JSON-LD structured data builders and React components for rich search results.

Supports 19 schema.org types with typed builder functions, a generic `JsonLd` React component, and 18 pre-built convenience components.

## Installation

```bash
npm install @ccbd-seo/schema
```

## Usage

### Building Structured Data

```ts
import { article, faqPage, toJsonLdString } from '@ccbd-seo/schema';

const jsonLd = article({
  headline: 'How to Improve SEO',
  datePublished: '2026-01-15',
  author: { name: 'Jane Doe' },
  image: 'https://example.com/image.jpg',
});

const html = toJsonLdString(jsonLd);
// Returns JSON string for embedding in a <script type="application/ld+json"> tag
```

### Schema Graph (Multiple Schemas)

```ts
import { schemaGraph, webSite, organization, toJsonLdString } from '@ccbd-seo/schema';

const graph = schemaGraph([
  webSite({ name: 'My Site', url: 'https://example.com' }),
  organization({ name: 'My Company', url: 'https://example.com' }),
]);

const html = toJsonLdString(graph);
```

### Validation

```ts
import { validateSchema } from '@ccbd-seo/schema';

const result = validateSchema(jsonLd);
// { valid: boolean, issues: ValidationIssue[] }
```

### React Components

```tsx
import { JsonLd, ArticleJsonLd, FAQJsonLd, ProductJsonLd } from '@ccbd-seo/schema/react';

// Generic — accepts any schema
<JsonLd schema={article({ headline: 'My Post', datePublished: '2026-01-15' })} />

// Pre-built convenience components
<ArticleJsonLd headline="My Post" datePublished="2026-01-15" author={{ name: 'Jane' }} />
<FAQJsonLd questions={[{ question: 'What is SEO?', answer: 'Search engine optimization.' }]} />
<ProductJsonLd name="Widget" description="A great widget" />
```

## API Reference

### Builder Functions

| Function | Schema Type |
|----------|------------|
| `article(data)` | Article |
| `blogPosting(data)` | BlogPosting |
| `newsArticle(data)` | NewsArticle |
| `product(data)` | Product |
| `faqPage(questions)` | FAQPage |
| `breadcrumbList(items)` | BreadcrumbList |
| `localBusiness(data)` | LocalBusiness |
| `organization(data)` | Organization |
| `person(data)` | Person |
| `event(data)` | Event |
| `recipe(data)` | Recipe |
| `howTo(data)` | HowTo |
| `videoObject(data)` | VideoObject |
| `course(data)` | Course |
| `jobPosting(data)` | JobPosting |
| `softwareApp(data)` | SoftwareApplication |
| `webSite(data)` | WebSite |
| `itemList(data)` | ItemList |
| `review(data)` | Review |
| `service(data)` | Service |

### Utilities

- `schemaGraph(schemas)` — Combine multiple schemas into a `@graph` array
- `toJsonLdString(schema)` — Serialize schema to JSON-LD string
- `validateSchema(schema)` — Validate schema structure and required fields

### React Components (`@ccbd-seo/schema/react`)

| Component | Props |
|-----------|-------|
| `JsonLd` | `{ schema: WithContext<T> \| SchemaGraph, dataTestId?: string }` |
| `ArticleJsonLd` | Article fields + optional `type` |
| `BlogPostingJsonLd` | Article fields (typed as BlogPosting) |
| `NewsArticleJsonLd` | Article fields (typed as NewsArticle) |
| `ProductJsonLd` | Product fields |
| `FAQJsonLd` | `{ questions: { question: string, answer: string }[] }` |
| `BreadcrumbJsonLd` | `{ items: { name: string, url?: string }[] }` |
| `LocalBusinessJsonLd` | LocalBusiness fields + optional `type` |
| `OrganizationJsonLd` | Organization fields |
| `EventJsonLd` | Event fields + optional `type` |
| `RecipeJsonLd` | Recipe fields |
| `HowToJsonLd` | HowTo fields |
| `VideoJsonLd` | VideoObject fields |
| `CourseJsonLd` | Course fields |
| `JobPostingJsonLd` | JobPosting fields |
| `SoftwareAppJsonLd` | SoftwareApp fields + optional `type` |
| `WebSiteJsonLd` | WebSite fields |
| `ReviewJsonLd` | Review fields |
| `ServiceJsonLd` | Service fields |

## License

[MIT](../../LICENSE)
