// ============================================================================
// @ccbd-seo/core — SEO Constants
// ============================================================================

/** Google SERP title max display width in pixels */
export const TITLE_MAX_PIXELS = 580;

/** Google SERP title recommended max character length */
export const TITLE_MAX_LENGTH = 60;

/** Google SERP title minimum recommended character length */
export const TITLE_MIN_LENGTH = 30;

/** Google SERP meta description max display width in pixels (desktop) */
export const META_DESCRIPTION_MAX_PIXELS = 920;

/** Meta description recommended max character length */
export const META_DESCRIPTION_MAX_LENGTH = 160;

/** Meta description recommended min character length */
export const META_DESCRIPTION_MIN_LENGTH = 120;

/** Recommended minimum word count (to avoid thin content) */
export const MIN_WORD_COUNT = 300;

/** Recommended word count for blog posts */
export const RECOMMENDED_WORD_COUNT = 1000;

/** Open Graph recommended image dimensions */
export const OG_IMAGE = {
  WIDTH: 1200,
  HEIGHT: 630,
  MIN_WIDTH: 200,
  MIN_HEIGHT: 200,
  ASPECT_RATIO: 1.91,
} as const;

/** Twitter Card recommended image dimensions */
export const TWITTER_IMAGE = {
  SUMMARY: { WIDTH: 144, HEIGHT: 144 },
  SUMMARY_LARGE: { WIDTH: 800, HEIGHT: 418 },
} as const;

/** Maximum URL length recommended for SEO */
export const MAX_URL_LENGTH = 75;

/** Optimal keyword density range (percentage) */
export const KEYWORD_DENSITY = {
  MIN: 0.5,
  MAX: 2.5,
  OPTIMAL: 1.5,
} as const;

/** Readability thresholds */
export const READABILITY = {
  FLESCH_EASE_GOOD: 60,
  FLESCH_EASE_FAIR: 30,
  MAX_SENTENCE_LENGTH: 20,
  MAX_PARAGRAPH_WORDS: 150,
  MAX_PASSIVE_VOICE_PERCENT: 10,
  MIN_TRANSITION_WORD_PERCENT: 30,
} as const;

/** Common AI crawler user agents */
export const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'Google-Extended',
  'ClaudeBot',
  'anthropic-ai',
  'Bytespider',
  'PerplexityBot',
  'Applebot-Extended',
  'FacebookBot',
  'cohere-ai',
] as const;

/** Approximate character widths for Google SERP pixel calculation (Arial font) */
export const CHAR_PIXEL_WIDTHS: Record<string, number> = {
  // Lowercase
  a: 6.67, b: 6.67, c: 6.0, d: 6.67, e: 6.67, f: 3.33, g: 6.67, h: 6.67,
  i: 2.67, j: 2.67, k: 6.0, l: 2.67, m: 10.0, n: 6.67, o: 6.67, p: 6.67,
  q: 6.67, r: 4.0, s: 6.0, t: 3.67, u: 6.67, v: 6.0, w: 9.33, x: 6.0,
  y: 6.0, z: 6.0,
  // Uppercase
  A: 8.0, B: 8.0, C: 8.67, D: 8.67, E: 8.0, F: 7.33, G: 9.33, H: 8.67,
  I: 3.33, J: 6.0, K: 8.0, L: 6.67, M: 10.0, N: 8.67, O: 9.33, P: 8.0,
  Q: 9.33, R: 8.67, S: 8.0, T: 7.33, U: 8.67, V: 8.0, W: 11.33, X: 8.0,
  Y: 8.0, Z: 7.33,
  // Numbers
  '0': 6.67, '1': 6.67, '2': 6.67, '3': 6.67, '4': 6.67, '5': 6.67,
  '6': 6.67, '7': 6.67, '8': 6.67, '9': 6.67,
  // Common punctuation
  ' ': 3.33, '.': 3.33, ',': 3.33, '!': 3.33, '?': 6.67, ':': 3.33,
  ';': 3.33, '-': 4.0, '_': 6.67, '(': 4.0, ')': 4.0, '[': 3.33,
  ']': 3.33, '/': 3.33, '|': 3.11, '&': 8.0, '@': 12.17, '#': 6.67,
  '$': 6.67, '%': 10.67, '+': 7.0, '=': 7.0, '"': 4.27, "'": 2.3,
};

/** Default pixel width for unknown characters */
export const DEFAULT_CHAR_WIDTH = 6.67;

/** Common Schema.org types used in SEO */
export const SCHEMA_TYPES = [
  'Article',
  'BlogPosting',
  'NewsArticle',
  'Product',
  'FAQPage',
  'HowTo',
  'LocalBusiness',
  'Organization',
  'Person',
  'WebSite',
  'WebPage',
  'BreadcrumbList',
  'Event',
  'Recipe',
  'VideoObject',
  'Course',
  'JobPosting',
  'SoftwareApplication',
  'Review',
  'AggregateRating',
  'ItemList',
  'CollectionPage',
  'SearchAction',
  'Service',
  'MedicalWebPage',
] as const;

export type SchemaType = (typeof SCHEMA_TYPES)[number];
