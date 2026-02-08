// ============================================================================
// @ccbd-seo/schema — React Components for JSON-LD
// ============================================================================

import { createElement } from 'react';
import type {
  ArticleSchema,
  ProductSchema,
  LocalBusinessSchema,
  OrganizationSchema,
  EventSchema,
  RecipeSchema,
  HowToSchema,
  VideoObjectSchema,
  CourseSchema,
  JobPostingSchema,
  SoftwareAppSchema,
  WebSiteSchema,
  ReviewSchema,
  ServiceSchema,
  SchemaGraph,
  WithContext,
  JsonLdBase,
} from './types.js';
import {
  article,
  blogPosting,
  newsArticle,
  product,
  faqPage,
  breadcrumbList,
  localBusiness,
  organization,
  event,
  recipe,
  howTo,
  videoObject,
  course,
  jobPosting,
  softwareApp,
  webSite,
  review,
  service,
} from './builders.js';

// --- Generic JsonLd Component ---

export interface JsonLdProps<T extends JsonLdBase = JsonLdBase> {
  schema: WithContext<T> | SchemaGraph;
  /** Use data-testid for testing */
  dataTestId?: string;
}

/**
 * Render a JSON-LD script tag for any schema type.
 *
 * @example
 * ```tsx
 * <JsonLd schema={article({ headline: 'My Article', ... })} />
 * ```
 */
export function JsonLd<T extends JsonLdBase>({ schema, dataTestId }: JsonLdProps<T>) {
  return createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(schema),
    },
    'data-testid': dataTestId,
  });
}

// --- Pre-built Convenience Components ---

type OmitType<T> = Omit<T, '@type' | '@context'>;

export interface ArticleJsonLdProps extends OmitType<ArticleSchema> {
  type?: ArticleSchema['@type'];
}

export function ArticleJsonLd(props: ArticleJsonLdProps) {
  return createElement(JsonLd, { schema: article(props) });
}

export function BlogPostingJsonLd(props: OmitType<ArticleSchema>) {
  return createElement(JsonLd, { schema: blogPosting(props) });
}

export function NewsArticleJsonLd(props: OmitType<ArticleSchema>) {
  return createElement(JsonLd, { schema: newsArticle(props) });
}

export function ProductJsonLd(props: OmitType<ProductSchema>) {
  return createElement(JsonLd, { schema: product(props) });
}

export interface FAQJsonLdProps {
  questions: Array<{ question: string; answer: string }>;
}

export function FAQJsonLd({ questions }: FAQJsonLdProps) {
  return createElement(JsonLd, { schema: faqPage(questions) });
}

export interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url?: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return createElement(JsonLd, { schema: breadcrumbList(items) });
}

export interface LocalBusinessJsonLdProps extends OmitType<LocalBusinessSchema> {
  type?: string;
}

export function LocalBusinessJsonLd(props: LocalBusinessJsonLdProps) {
  return createElement(JsonLd, { schema: localBusiness(props) });
}

export function OrganizationJsonLd(props: OmitType<OrganizationSchema>) {
  return createElement(JsonLd, { schema: organization(props) });
}

export interface EventJsonLdProps extends OmitType<EventSchema> {
  type?: EventSchema['@type'];
}

export function EventJsonLd(props: EventJsonLdProps) {
  return createElement(JsonLd, { schema: event(props) });
}

export function RecipeJsonLd(props: OmitType<RecipeSchema>) {
  return createElement(JsonLd, { schema: recipe(props) });
}

export function HowToJsonLd(props: OmitType<HowToSchema>) {
  return createElement(JsonLd, { schema: howTo(props) });
}

export function VideoJsonLd(props: OmitType<VideoObjectSchema>) {
  return createElement(JsonLd, { schema: videoObject(props) });
}

export function CourseJsonLd(props: OmitType<CourseSchema>) {
  return createElement(JsonLd, { schema: course(props) });
}

export function JobPostingJsonLd(props: OmitType<JobPostingSchema>) {
  return createElement(JsonLd, { schema: jobPosting(props) });
}

export interface SoftwareAppJsonLdProps extends OmitType<SoftwareAppSchema> {
  type?: SoftwareAppSchema['@type'];
}

export function SoftwareAppJsonLd(props: SoftwareAppJsonLdProps) {
  return createElement(JsonLd, { schema: softwareApp(props) });
}

export function WebSiteJsonLd(props: OmitType<WebSiteSchema>) {
  return createElement(JsonLd, { schema: webSite(props) });
}

export function ReviewJsonLd(props: OmitType<ReviewSchema>) {
  return createElement(JsonLd, { schema: review(props) });
}

export function ServiceJsonLd(props: OmitType<ServiceSchema>) {
  return createElement(JsonLd, { schema: service(props) });
}
