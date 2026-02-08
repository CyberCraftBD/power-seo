// ============================================================================
// @ccbd-seo/core — SEO Types & Interfaces
// ============================================================================

// --- Meta Tags ---

export interface MetaTag {
  name?: string;
  property?: string;
  httpEquiv?: string;
  content: string;
}

export interface LinkTag {
  rel: string;
  href: string;
  hreflang?: string;
  type?: string;
  sizes?: string;
  media?: string;
  as?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

// --- Open Graph ---

export type OpenGraphType =
  | 'website'
  | 'article'
  | 'book'
  | 'profile'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other'
  | 'product';

export interface OpenGraphImage {
  url: string;
  secureUrl?: string;
  type?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface OpenGraphVideo {
  url: string;
  secureUrl?: string;
  type?: string;
  width?: number;
  height?: number;
}

export interface OpenGraphArticle {
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export interface OpenGraphProfile {
  firstName?: string;
  lastName?: string;
  username?: string;
  gender?: string;
}

export interface OpenGraphBook {
  authors?: string[];
  isbn?: string;
  releaseDate?: string;
  tags?: string[];
}

export interface OpenGraphConfig {
  type?: OpenGraphType;
  url?: string;
  title?: string;
  description?: string;
  siteName?: string;
  locale?: string;
  localeAlternate?: string[];
  images?: OpenGraphImage[];
  videos?: OpenGraphVideo[];
  article?: OpenGraphArticle;
  profile?: OpenGraphProfile;
  book?: OpenGraphBook;
}

// --- Twitter Card ---

export type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player';

export interface TwitterCardConfig {
  cardType?: TwitterCardType;
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  player?: string;
  playerWidth?: number;
  playerHeight?: number;
  playerStream?: string;
  appIdIphone?: string;
  appIdIpad?: string;
  appIdGooglePlay?: string;
  appUrlIphone?: string;
  appUrlIpad?: string;
  appUrlGooglePlay?: string;
  appNameIphone?: string;
  appNameIpad?: string;
  appNameGooglePlay?: string;
}

// --- Robots ---

export interface RobotsDirective {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  notranslate?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
  unavailableAfter?: string;
}

// --- Hreflang ---

export interface HreflangConfig {
  hrefLang: string;
  href: string;
}

// --- SEO Configuration ---

export interface SEOConfig {
  title?: string;
  titleTemplate?: string;
  defaultTitle?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  robots?: RobotsDirective;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterCardConfig;
  additionalMetaTags?: MetaTag[];
  additionalLinkTags?: LinkTag[];
  languageAlternates?: HreflangConfig[];
}

// --- Content Analysis ---

export interface ContentAnalysisInput {
  title?: string;
  metaDescription?: string;
  content: string;
  focusKeyphrase?: string;
  slug?: string;
  locale?: string;
  internalLinks?: string[];
  externalLinks?: string[];
  images?: Array<{ src: string; alt?: string }>;
}

export type AnalysisStatus = 'good' | 'ok' | 'poor';

export interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  status: AnalysisStatus;
  score: number;
  maxScore: number;
}

export interface ContentAnalysisOutput {
  score: number;
  maxScore: number;
  results: AnalysisResult[];
  recommendations: string[];
}

// --- Readability ---

export interface ReadabilityInput {
  content: string;
  locale?: string;
}

export interface ReadabilityOutput {
  score: number;
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  avgSentenceLength: number;
  avgSyllablesPerWord: number;
  passiveVoicePercentage: number;
  longSentencePercentage: number;
  longParagraphCount: number;
  transitionWordPercentage: number;
  results: AnalysisResult[];
  recommendations: string[];
}

// --- Text Statistics ---

export interface TextStatistics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  syllableCount: number;
  characterCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
}

// --- Sitemap ---

export interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
  news?: SitemapNews;
}

export interface SitemapImage {
  loc: string;
  caption?: string;
  geoLocation?: string;
  title?: string;
  license?: string;
}

export interface SitemapVideo {
  thumbnailLoc: string;
  title: string;
  description: string;
  contentLoc?: string;
  playerLoc?: string;
  duration?: number;
  expirationDate?: string;
  rating?: number;
  viewCount?: number;
  publicationDate?: string;
  familyFriendly?: boolean;
  live?: boolean;
}

export interface SitemapNews {
  publication: {
    name: string;
    language: string;
  };
  publicationDate: string;
  title: string;
}

export interface SitemapConfig {
  hostname: string;
  urls: SitemapURL[];
  maxUrlsPerSitemap?: number;
  outputDir?: string;
}

// --- Redirect ---

export type RedirectStatusCode = 301 | 302 | 307 | 308 | 410;

export interface RedirectRule {
  source: string;
  destination: string;
  statusCode: RedirectStatusCode;
  isRegex?: boolean;
}

// --- Schema.org Shared Types ---

export interface SchemaBase {
  '@context'?: string;
  '@type': string;
  '@id'?: string;
  [key: string]: unknown;
}

export interface SchemaGraphConfig {
  '@context': 'https://schema.org';
  '@graph': SchemaBase[];
}
