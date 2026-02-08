// ============================================================================
// @ccbd-seo/schema — JSON-LD Builder Functions
// ============================================================================

import type {
  WithContext,
  ArticleSchema,
  ProductSchema,
  FAQPageSchema,
  FAQQuestionSchema,
  BreadcrumbListSchema,
  LocalBusinessSchema,
  OrganizationSchema,
  PersonSchema,
  EventSchema,
  RecipeSchema,
  HowToSchema,
  VideoObjectSchema,
  CourseSchema,
  JobPostingSchema,
  SoftwareAppSchema,
  WebSiteSchema,
  ItemListSchema,
  ReviewSchema,
  ServiceSchema,
  SchemaGraph,
  SchemaObject,
} from './types.js';

const CONTEXT = 'https://schema.org' as const;

/** Add @context to a schema object */
function withContext<T extends { '@type': string }>(schema: T): WithContext<T & { '@type': string }> {
  return { '@context': CONTEXT, ...schema };
}

/** Remove undefined values from an object */
function clean<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}

// --- Builder Functions ---

export function article(
  props: Omit<ArticleSchema, '@type'> & { type?: ArticleSchema['@type'] },
): WithContext<ArticleSchema> {
  const { type = 'Article', ...rest } = props;
  return withContext(clean({ '@type': type, ...rest }) as ArticleSchema);
}

export function blogPosting(
  props: Omit<ArticleSchema, '@type'>,
): WithContext<ArticleSchema> {
  return article({ ...props, type: 'BlogPosting' });
}

export function newsArticle(
  props: Omit<ArticleSchema, '@type'>,
): WithContext<ArticleSchema> {
  return article({ ...props, type: 'NewsArticle' });
}

export function product(
  props: Omit<ProductSchema, '@type'>,
): WithContext<ProductSchema> {
  return withContext(clean({ '@type': 'Product', ...props }) as ProductSchema);
}

export function faqPage(
  questions: Array<{ question: string; answer: string }>,
): WithContext<FAQPageSchema> {
  const mainEntity: FAQQuestionSchema[] = questions.map((q) => ({
    '@type': 'Question' as const,
    name: q.question,
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: q.answer,
    },
  }));

  return withContext({ '@type': 'FAQPage' as const, mainEntity });
}

export function breadcrumbList(
  items: Array<{ name: string; url?: string }>,
): WithContext<BreadcrumbListSchema> {
  return withContext({
    '@type': 'BreadcrumbList' as const,
    itemListElement: items.map((item, index) =>
      clean({
        '@type': 'ListItem' as const,
        position: index + 1,
        name: item.name,
        item: item.url,
      }),
    ),
  });
}

export function localBusiness(
  props: Omit<LocalBusinessSchema, '@type'> & { type?: string },
): WithContext<LocalBusinessSchema> {
  const { type = 'LocalBusiness', ...rest } = props;
  return withContext(clean({ '@type': type, ...rest }) as LocalBusinessSchema);
}

export function organization(
  props: Omit<OrganizationSchema, '@type'>,
): WithContext<OrganizationSchema> {
  return withContext(clean({ '@type': 'Organization', ...props }) as OrganizationSchema);
}

export function person(
  props: Omit<PersonSchema, '@type'>,
): WithContext<PersonSchema> {
  return withContext(clean({ '@type': 'Person', ...props }) as PersonSchema);
}

export function event(
  props: Omit<EventSchema, '@type'> & { type?: EventSchema['@type'] },
): WithContext<EventSchema> {
  const { type = 'Event', ...rest } = props;
  return withContext(clean({ '@type': type, ...rest }) as EventSchema);
}

export function recipe(
  props: Omit<RecipeSchema, '@type'>,
): WithContext<RecipeSchema> {
  return withContext(clean({ '@type': 'Recipe', ...props }) as RecipeSchema);
}

export function howTo(
  props: Omit<HowToSchema, '@type'>,
): WithContext<HowToSchema> {
  return withContext(clean({ '@type': 'HowTo', ...props }) as HowToSchema);
}

export function videoObject(
  props: Omit<VideoObjectSchema, '@type'>,
): WithContext<VideoObjectSchema> {
  return withContext(clean({ '@type': 'VideoObject', ...props }) as VideoObjectSchema);
}

export function course(
  props: Omit<CourseSchema, '@type'>,
): WithContext<CourseSchema> {
  return withContext(clean({ '@type': 'Course', ...props }) as CourseSchema);
}

export function jobPosting(
  props: Omit<JobPostingSchema, '@type'>,
): WithContext<JobPostingSchema> {
  return withContext(clean({ '@type': 'JobPosting', ...props }) as JobPostingSchema);
}

export function softwareApp(
  props: Omit<SoftwareAppSchema, '@type'> & { type?: SoftwareAppSchema['@type'] },
): WithContext<SoftwareAppSchema> {
  const { type = 'SoftwareApplication', ...rest } = props;
  return withContext(clean({ '@type': type, ...rest }) as SoftwareAppSchema);
}

export function webSite(
  props: Omit<WebSiteSchema, '@type'>,
): WithContext<WebSiteSchema> {
  return withContext(clean({ '@type': 'WebSite', ...props }) as WebSiteSchema);
}

export function itemList(
  props: Omit<ItemListSchema, '@type'>,
): WithContext<ItemListSchema> {
  return withContext(clean({ '@type': 'ItemList', ...props }) as ItemListSchema);
}

export function review(
  props: Omit<ReviewSchema, '@type'>,
): WithContext<ReviewSchema> {
  return withContext(clean({ '@type': 'Review', ...props }) as ReviewSchema);
}

export function service(
  props: Omit<ServiceSchema, '@type'>,
): WithContext<ServiceSchema> {
  return withContext(clean({ '@type': 'Service', ...props }) as ServiceSchema);
}

// --- Schema Graph Builder ---

/**
 * Build a connected schema graph with multiple types.
 *
 * @example
 * ```ts
 * const graph = schemaGraph([
 *   { '@type': 'WebSite', name: 'My Site', url: 'https://example.com' },
 *   { '@type': 'Organization', name: 'My Org', url: 'https://example.com' },
 * ]);
 * ```
 */
export function schemaGraph(schemas: SchemaObject[]): SchemaGraph {
  return {
    '@context': CONTEXT,
    '@graph': schemas,
  };
}

/**
 * Serialize a schema object to a JSON-LD string.
 */
export function toJsonLdString(
  schema: WithContext<SchemaObject> | SchemaGraph,
  pretty = false,
): string {
  return JSON.stringify(schema, null, pretty ? 2 : undefined);
}
