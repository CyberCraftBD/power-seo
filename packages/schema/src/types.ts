// ============================================================================
// @power-seo/schema — JSON-LD Schema Types
// ============================================================================

/** Base type for all JSON-LD objects */
export interface JsonLdBase {
  '@context'?: 'https://schema.org';
  '@type': string;
  '@id'?: string;
}

/** A thing with a name and URL */
export interface ThingBase extends JsonLdBase {
  name?: string;
  url?: string;
  description?: string;
  image?: string | ImageObject | Array<string | ImageObject>;
  sameAs?: string | string[];
}

export interface ImageObject extends JsonLdBase {
  '@type': 'ImageObject';
  url: string;
  width?: number | string;
  height?: number | string;
  caption?: string;
}

export interface PersonSchema extends ThingBase {
  '@type': 'Person';
  givenName?: string;
  familyName?: string;
  email?: string;
  jobTitle?: string;
  affiliation?: OrganizationSchema;
}

export interface OrganizationSchema extends ThingBase {
  '@type': 'Organization';
  logo?: string | ImageObject;
  contactPoint?: ContactPoint | ContactPoint[];
  address?: PostalAddress;
  foundingDate?: string;
  numberOfEmployees?: number;
}

export interface ContactPoint extends JsonLdBase {
  '@type': 'ContactPoint';
  telephone?: string;
  contactType?: string;
  email?: string;
  areaServed?: string | string[];
  availableLanguage?: string | string[];
}

export interface PostalAddress extends JsonLdBase {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface ArticleSchema extends ThingBase {
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle' | 'TechArticle';
  headline: string;
  author: PersonSchema | PersonSchema[] | OrganizationSchema | string;
  datePublished: string;
  dateModified?: string;
  publisher?: OrganizationSchema;
  mainEntityOfPage?: string | { '@type': 'WebPage'; '@id': string };
  articleBody?: string;
  articleSection?: string;
  wordCount?: number;
  keywords?: string | string[];
  thumbnailUrl?: string;
}

export interface ProductSchema extends ThingBase {
  '@type': 'Product';
  brand?: OrganizationSchema | { '@type': 'Brand'; name: string };
  sku?: string;
  gtin?: string;
  gtin8?: string;
  gtin13?: string;
  gtin14?: string;
  mpn?: string;
  offers?: OfferSchema | OfferSchema[];
  aggregateRating?: AggregateRatingSchema;
  review?: ReviewSchema | ReviewSchema[];
  color?: string;
  material?: string;
}

export interface OfferSchema extends JsonLdBase {
  '@type': 'Offer' | 'AggregateOffer';
  price: number | string;
  priceCurrency: string;
  availability?:
    | 'https://schema.org/InStock'
    | 'https://schema.org/OutOfStock'
    | 'https://schema.org/PreOrder'
    | 'https://schema.org/Discontinued'
    | string;
  priceValidUntil?: string;
  url?: string;
  seller?: OrganizationSchema;
  itemCondition?: string;
  lowPrice?: number | string;
  highPrice?: number | string;
  offerCount?: number;
}

export interface AggregateRatingSchema extends JsonLdBase {
  '@type': 'AggregateRating';
  ratingValue: number | string;
  reviewCount?: number;
  ratingCount?: number;
  bestRating?: number | string;
  worstRating?: number | string;
}

export interface ReviewSchema extends JsonLdBase {
  '@type': 'Review';
  author: PersonSchema | string;
  reviewRating?: RatingSchema;
  reviewBody?: string;
  datePublished?: string;
  name?: string;
}

export interface RatingSchema extends JsonLdBase {
  '@type': 'Rating';
  ratingValue: number | string;
  bestRating?: number | string;
  worstRating?: number | string;
}

export interface FAQPageSchema extends JsonLdBase {
  '@type': 'FAQPage';
  mainEntity: FAQQuestionSchema[];
}

export interface FAQQuestionSchema extends JsonLdBase {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

export interface BreadcrumbListSchema extends JsonLdBase {
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

export interface BreadcrumbItem extends JsonLdBase {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

export interface LocalBusinessSchema extends ThingBase {
  '@type': 'LocalBusiness' | 'Restaurant' | 'Store' | 'MedicalBusiness' | string;
  address: PostalAddress;
  telephone?: string;
  openingHoursSpecification?: OpeningHours | OpeningHours[];
  geo?: GeoCoordinates;
  priceRange?: string;
  servesCuisine?: string | string[];
  menu?: string;
  hasMap?: string;
  aggregateRating?: AggregateRatingSchema;
  review?: ReviewSchema | ReviewSchema[];
}

export interface OpeningHours extends JsonLdBase {
  '@type': 'OpeningHoursSpecification';
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

export interface GeoCoordinates extends JsonLdBase {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

export interface EventSchema extends ThingBase {
  '@type': 'Event' | 'MusicEvent' | 'BusinessEvent' | 'EducationEvent' | string;
  startDate: string;
  endDate?: string;
  location: string | PostalAddress | { '@type': 'VirtualLocation'; url: string };
  organizer?: PersonSchema | OrganizationSchema;
  performer?: PersonSchema | PersonSchema[];
  offers?: OfferSchema | OfferSchema[];
  eventStatus?: string;
  eventAttendanceMode?: string;
}

export interface RecipeSchema extends ThingBase {
  '@type': 'Recipe';
  author: PersonSchema | string;
  datePublished?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  recipeIngredient: string[];
  recipeInstructions: HowToStep[] | string[];
  nutrition?: NutritionInfo;
  aggregateRating?: AggregateRatingSchema;
  video?: VideoObjectSchema;
  keywords?: string;
}

export interface NutritionInfo extends JsonLdBase {
  '@type': 'NutritionInformation';
  calories?: string;
  fatContent?: string;
  carbohydrateContent?: string;
  proteinContent?: string;
  fiberContent?: string;
  sodiumContent?: string;
  sugarContent?: string;
}

export interface HowToSchema extends ThingBase {
  '@type': 'HowTo';
  step: HowToStep[];
  totalTime?: string;
  estimatedCost?: string | MonetaryAmount;
  supply?: HowToSupply[];
  tool?: HowToTool[];
}

export interface HowToStep extends JsonLdBase {
  '@type': 'HowToStep';
  name?: string;
  text: string;
  url?: string;
  image?: string;
}

export interface HowToSupply extends JsonLdBase {
  '@type': 'HowToSupply';
  name: string;
}

export interface HowToTool extends JsonLdBase {
  '@type': 'HowToTool';
  name: string;
}

export interface MonetaryAmount extends JsonLdBase {
  '@type': 'MonetaryAmount';
  currency: string;
  value: number | string;
}

export interface VideoObjectSchema extends ThingBase {
  '@type': 'VideoObject';
  thumbnailUrl: string | string[];
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  interactionStatistic?: {
    '@type': 'InteractionCounter';
    interactionType: { '@type': 'WatchAction' };
    userInteractionCount: number;
  };
}

export interface CourseSchema extends ThingBase {
  '@type': 'Course';
  provider?: OrganizationSchema;
  offers?: OfferSchema | OfferSchema[];
  hasCourseInstance?: CourseInstance | CourseInstance[];
  coursePrerequisites?: string | string[];
  educationalLevel?: string;
}

export interface CourseInstance extends JsonLdBase {
  '@type': 'CourseInstance';
  courseMode?: string;
  instructor?: PersonSchema;
  startDate?: string;
  endDate?: string;
}

export interface JobPostingSchema extends ThingBase {
  '@type': 'JobPosting';
  title: string;
  datePosted: string;
  validThrough?: string;
  hiringOrganization: OrganizationSchema;
  jobLocation?: PostalAddress | PostalAddress[];
  baseSalary?: MonetaryAmount | { '@type': 'MonetaryAmount'; currency: string; value: { '@type': 'QuantitativeValue'; value?: number; minValue?: number; maxValue?: number; unitText?: string } };
  employmentType?: string | string[];
  jobLocationType?: string;
  applicantLocationRequirements?: { '@type': 'Country'; name: string } | Array<{ '@type': 'Country'; name: string }>;
}

export interface SoftwareAppSchema extends ThingBase {
  '@type': 'SoftwareApplication' | 'MobileApplication' | 'WebApplication';
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: OfferSchema;
  aggregateRating?: AggregateRatingSchema;
  downloadUrl?: string;
  softwareVersion?: string;
}

export interface WebSiteSchema extends ThingBase {
  '@type': 'WebSite';
  potentialAction?: SearchActionSchema;
}

export interface SearchActionSchema extends JsonLdBase {
  '@type': 'SearchAction';
  target: string | { '@type': 'EntryPoint'; urlTemplate: string };
  'query-input'?: string;
}

export interface ItemListSchema extends JsonLdBase {
  '@type': 'ItemList';
  itemListElement: ListItem[];
  numberOfItems?: number;
  itemListOrder?: 'https://schema.org/ItemListOrderAscending' | 'https://schema.org/ItemListOrderDescending' | 'https://schema.org/ItemListUnordered' | string;
}

export interface ListItem extends JsonLdBase {
  '@type': 'ListItem';
  position: number;
  url?: string;
  name?: string;
  item?: ThingBase;
}

export interface ServiceSchema extends ThingBase {
  '@type': 'Service';
  provider?: OrganizationSchema | PersonSchema;
  areaServed?: string | string[];
  serviceType?: string;
  offers?: OfferSchema | OfferSchema[];
  aggregateRating?: AggregateRatingSchema;
}

/** Union of all supported schema types */
export type SchemaObject =
  | ArticleSchema
  | ProductSchema
  | FAQPageSchema
  | BreadcrumbListSchema
  | LocalBusinessSchema
  | OrganizationSchema
  | PersonSchema
  | EventSchema
  | RecipeSchema
  | HowToSchema
  | VideoObjectSchema
  | CourseSchema
  | JobPostingSchema
  | SoftwareAppSchema
  | WebSiteSchema
  | ItemListSchema
  | ReviewSchema
  | ServiceSchema;

/** JSON-LD with context */
export type WithContext<T extends JsonLdBase> = T & {
  '@context': 'https://schema.org';
};

/** Schema graph — multiple connected schemas */
export interface SchemaGraph {
  '@context': 'https://schema.org';
  '@graph': SchemaObject[];
}
