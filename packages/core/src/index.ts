// ============================================================================
// @power-seo/core — Main Entry Point
// ============================================================================

// Types
export type {
  MetaTag,
  LinkTag,
  OpenGraphType,
  OpenGraphImage,
  OpenGraphVideo,
  OpenGraphArticle,
  OpenGraphProfile,
  OpenGraphBook,
  OpenGraphConfig,
  TwitterCardType,
  TwitterCardConfig,
  RobotsDirective,
  HreflangConfig,
  SEOConfig,
  ContentAnalysisInput,
  AnalysisStatus,
  AnalysisResult,
  ContentAnalysisOutput,
  ReadabilityInput,
  ReadabilityOutput,
  TextStatistics,
  SitemapURL,
  SitemapImage,
  SitemapVideo,
  SitemapNews,
  SitemapConfig,
  RedirectStatusCode,
  RedirectRule,
  SchemaBase,
  SchemaGraphConfig,
} from './types.js';

// Constants
export {
  TITLE_MAX_PIXELS,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  META_DESCRIPTION_MAX_PIXELS,
  META_DESCRIPTION_MAX_LENGTH,
  META_DESCRIPTION_MIN_LENGTH,
  MIN_WORD_COUNT,
  RECOMMENDED_WORD_COUNT,
  OG_IMAGE,
  TWITTER_IMAGE,
  MAX_URL_LENGTH,
  KEYWORD_DENSITY,
  READABILITY,
  AI_CRAWLERS,
  CHAR_PIXEL_WIDTHS,
  DEFAULT_CHAR_WIDTH,
  SCHEMA_TYPES,
} from './constants.js';
export type { SchemaType } from './constants.js';

// Title Template Engine
export { applyTitleTemplate, createTitleTemplate } from './title-template.js';
export type { TitleTemplateVars } from './title-template.js';

// Meta Validators
export {
  calculatePixelWidth,
  validateTitle,
  validateMetaDescription,
} from './meta-validators.js';
export type { ValidationSeverity, ValidationResult } from './meta-validators.js';

// URL Utilities
export {
  resolveCanonical,
  normalizeUrl,
  ensureTrailingSlash,
  removeTrailingSlash,
  stripQueryParams,
  stripTrackingParams,
  extractSlug,
  isAbsoluteUrl,
  toSlug,
} from './url-utils.js';

// Text Statistics
export {
  stripHtml,
  getWords,
  getSentences,
  getParagraphs,
  countSyllables,
  countTotalSyllables,
  getTextStatistics,
} from './text-stats.js';

// Keyword Density
export {
  calculateKeywordDensity,
  countKeywordOccurrences,
  analyzeKeyphraseOccurrences,
} from './keyword-density.js';
export type { KeywordDensityResult, KeyphraseOccurrences } from './keyword-density.js';

// Robots Builder
export { buildRobotsContent, parseRobotsContent } from './robots-builder.js';

// Meta Builder
export {
  buildMetaTags,
  buildLinkTags,
  buildOpenGraphTags,
  buildTwitterTags,
  buildHreflangTags,
  resolveTitle,
} from './meta-builder.js';

// Rate Limiting
export {
  createTokenBucket,
  consumeToken,
  getWaitTime,
  sleep,
} from './rate-limit.js';
export type { TokenBucket } from './rate-limit.js';
