// @power-seo/images — Types
// ----------------------------------------------------------------------------

export type { SitemapImage } from '@power-seo/core';

export type ImageFormat =
  | 'jpeg'
  | 'png'
  | 'gif'
  | 'webp'
  | 'avif'
  | 'svg'
  | 'bmp'
  | 'ico'
  | 'tiff'
  | 'unknown';

export interface ImageInfo {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: ImageFormat;
  loading?: string;
  decoding?: string;
  srcset?: string;
  sizes?: string;
  isAboveFold?: boolean;
}

export type ImageIssueSeverity = 'error' | 'warning' | 'info' | 'pass';

export interface ImageIssue {
  id: string;
  title: string;
  description: string;
  severity: ImageIssueSeverity;
  image?: ImageInfo;
}

export interface ImageAnalysisResult {
  src: string;
  issues: ImageIssue[];
  score: number;
  maxScore: number;
}

export interface ImageAuditResult {
  totalImages: number;
  score: number;
  maxScore: number;
  issues: ImageIssue[];
  perImage: ImageAnalysisResult[];
  recommendations: string[];
}

export interface ImageSitemapPage {
  pageUrl: string;
  images: ImageInfo[];
}

export interface FormatAnalysisResult {
  src: string;
  currentFormat: ImageFormat;
  isModern: boolean;
  recommendation?: string;
}

export interface FormatAuditResult {
  totalImages: number;
  modernFormatCount: number;
  legacyFormatCount: number;
  results: FormatAnalysisResult[];
  recommendations: string[];
}

export interface LazyLoadingAuditResult {
  totalImages: number;
  issues: ImageIssue[];
  recommendations: string[];
}
