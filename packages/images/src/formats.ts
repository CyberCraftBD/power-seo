// @power-seo/images — Format Detection & Optimization
// ----------------------------------------------------------------------------

import type { ImageInfo, ImageFormat, FormatAnalysisResult, FormatAuditResult } from './types.js';

const EXTENSION_MAP: Record<string, ImageFormat> = {
  jpg: 'jpeg',
  jpeg: 'jpeg',
  png: 'png',
  gif: 'gif',
  webp: 'webp',
  avif: 'avif',
  svg: 'svg',
  bmp: 'bmp',
  ico: 'ico',
  tiff: 'tiff',
  tif: 'tiff',
};

const MODERN_FORMATS: Set<ImageFormat> = new Set(['webp', 'avif', 'svg']);

const FORMAT_RECOMMENDATIONS: Partial<Record<ImageFormat, string>> = {
  jpeg: 'Convert to WebP or AVIF for 25-50% smaller file sizes with equivalent quality.',
  png: 'Convert to WebP or AVIF. For simple graphics, consider SVG.',
  gif: 'Convert animated GIFs to WebP or MP4 video for dramatically smaller file sizes.',
  bmp: 'Convert to WebP or AVIF. BMP is uncompressed and very large.',
  tiff: 'Convert to WebP or AVIF. TIFF is not web-optimized.',
  ico: 'Use SVG favicons for modern browsers with ICO fallback.',
};

export function detectFormat(src: string): ImageFormat {
  try {
    // Strip query string and hash
    const path = (src.split('?')[0] ?? '').split('#')[0] ?? '';
    const lastDot = path.lastIndexOf('.');
    if (lastDot === -1) return 'unknown';
    const ext = path.substring(lastDot + 1).toLowerCase();
    return EXTENSION_MAP[ext] ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

export function getFormatRecommendation(format: ImageFormat): string | undefined {
  return FORMAT_RECOMMENDATIONS[format];
}

export function analyzeImageFormats(images: ImageInfo[]): FormatAuditResult {
  if (images.length === 0) {
    return {
      totalImages: 0,
      modernFormatCount: 0,
      legacyFormatCount: 0,
      results: [],
      recommendations: [],
    };
  }

  const results: FormatAnalysisResult[] = [];
  let modernCount = 0;
  let legacyCount = 0;

  for (const image of images) {
    const currentFormat = image.format ?? detectFormat(image.src);
    const isModern = MODERN_FORMATS.has(currentFormat);
    const recommendation = isModern ? undefined : getFormatRecommendation(currentFormat);

    if (isModern) {
      modernCount++;
    } else {
      legacyCount++;
    }

    results.push({ src: image.src, currentFormat, isModern, recommendation });
  }

  const recommendations: string[] = [];
  if (legacyCount > 0) {
    recommendations.push(
      `${legacyCount} of ${images.length} images use legacy formats. Convert to WebP or AVIF for better performance.`,
    );
  }

  return {
    totalImages: images.length,
    modernFormatCount: modernCount,
    legacyFormatCount: legacyCount,
    results,
    recommendations,
  };
}
