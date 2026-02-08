// ============================================================================
// @ccbd-seo/images — Public API
// ============================================================================

export { analyzeAltText } from './alt-text.js';
export { auditLazyLoading } from './lazy-loading.js';
export { detectFormat, getFormatRecommendation, analyzeImageFormats } from './formats.js';
export { extractImageEntries, generateImageSitemap } from './image-sitemap.js';

export type {
  ImageFormat,
  ImageInfo,
  ImageIssueSeverity,
  ImageIssue,
  ImageAnalysisResult,
  ImageAuditResult,
  ImageSitemapPage,
  FormatAnalysisResult,
  FormatAuditResult,
  LazyLoadingAuditResult,
  SitemapImage,
} from './types.js';
