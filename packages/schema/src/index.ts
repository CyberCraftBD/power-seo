// ============================================================================
// @power-seo/schema — Main Entry Point (framework-agnostic)
// ============================================================================

// Types
export type {
  JsonLdBase,
  ThingBase,
  ImageObject,
  PersonSchema,
  OrganizationSchema,
  ContactPoint,
  PostalAddress,
  ArticleSchema,
  ProductSchema,
  OfferSchema,
  AggregateRatingSchema,
  ReviewSchema,
  RatingSchema,
  FAQPageSchema,
  FAQQuestionSchema,
  BreadcrumbListSchema,
  BreadcrumbItem,
  LocalBusinessSchema,
  OpeningHours,
  GeoCoordinates,
  EventSchema,
  RecipeSchema,
  NutritionInfo,
  HowToSchema,
  HowToStep,
  HowToSupply,
  HowToTool,
  MonetaryAmount,
  VideoObjectSchema,
  CourseSchema,
  CourseInstance,
  JobPostingSchema,
  SoftwareAppSchema,
  WebSiteSchema,
  SearchActionSchema,
  ItemListSchema,
  ListItem,
  ServiceSchema,
  SchemaObject,
  WithContext,
  SchemaGraph,
} from './types.js';

// Builder Functions
export {
  article,
  blogPosting,
  newsArticle,
  product,
  faqPage,
  breadcrumbList,
  localBusiness,
  organization,
  person,
  event,
  recipe,
  howTo,
  videoObject,
  course,
  jobPosting,
  softwareApp,
  webSite,
  itemList,
  review,
  service,
  schemaGraph,
  toJsonLdString,
} from './builders.js';

// Validation
export { validateSchema } from './validation.js';
export type { ValidationIssue, SchemaValidationResult } from './validation.js';
