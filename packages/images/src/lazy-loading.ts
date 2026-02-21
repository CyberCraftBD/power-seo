// ============================================================================
// @power-seo/images — Lazy Loading Audit
// ============================================================================

import type { ImageInfo, ImageIssue, LazyLoadingAuditResult } from './types.js';

export function auditLazyLoading(images: ImageInfo[]): LazyLoadingAuditResult {
  if (images.length === 0) {
    return { totalImages: 0, issues: [], recommendations: [] };
  }

  const issues: ImageIssue[] = [];

  for (const image of images) {
    // Above-fold + loading="lazy" → error (hurts LCP)
    if (image.isAboveFold && image.loading === 'lazy') {
      issues.push({
        id: 'lazy-above-fold',
        title: 'Above-fold image uses lazy loading',
        description: `Image "${image.src}" is above the fold but has loading="lazy". This delays LCP. Remove lazy loading for above-fold images.`,
        severity: 'error',
        image,
      });
    }

    // Below-fold without loading="lazy" → warning
    if (image.isAboveFold === false && image.loading !== 'lazy') {
      issues.push({
        id: 'lazy-missing-below-fold',
        title: 'Below-fold image missing lazy loading',
        description: `Image "${image.src}" is below the fold but lacks loading="lazy". Add lazy loading to improve page load performance.`,
        severity: 'warning',
        image,
      });
    }

    // Missing decoding attribute → info
    if (!image.decoding) {
      issues.push({
        id: 'decoding-missing',
        title: 'Missing decoding attribute',
        description: `Image "${image.src}" has no decoding attribute. Consider adding decoding="async" for non-blocking decode.`,
        severity: 'info',
        image,
      });
    }

    // Missing explicit width/height → warning (CLS risk)
    if (image.width === undefined || image.height === undefined) {
      issues.push({
        id: 'dimensions-missing',
        title: 'Missing explicit dimensions',
        description: `Image "${image.src}" lacks explicit width/height attributes. This can cause Cumulative Layout Shift (CLS).`,
        severity: 'warning',
        image,
      });
    }

    // Wide image without srcset → info
    if (image.width !== undefined && image.width > 600 && !image.srcset) {
      issues.push({
        id: 'srcset-missing',
        title: 'Wide image without srcset',
        description: `Image "${image.src}" is ${image.width}px wide but has no srcset. Consider providing responsive variants.`,
        severity: 'info',
        image,
      });
    }

    // Has srcset but no sizes → warning
    if (image.srcset && !image.sizes) {
      issues.push({
        id: 'sizes-missing',
        title: 'srcset without sizes attribute',
        description: `Image "${image.src}" has srcset but no sizes attribute. The browser needs sizes to pick the right source.`,
        severity: 'warning',
        image,
      });
    }
  }

  const recommendations: string[] = [];
  const aboveFoldLazy = issues.filter((i) => i.id === 'lazy-above-fold');
  const missingLazy = issues.filter((i) => i.id === 'lazy-missing-below-fold');
  const missingDims = issues.filter((i) => i.id === 'dimensions-missing');

  if (aboveFoldLazy.length > 0) {
    recommendations.push(
      `Remove loading="lazy" from ${aboveFoldLazy.length} above-fold image(s) to improve LCP.`,
    );
  }
  if (missingLazy.length > 0) {
    recommendations.push(
      `Add loading="lazy" to ${missingLazy.length} below-fold image(s) for faster initial load.`,
    );
  }
  if (missingDims.length > 0) {
    recommendations.push(
      `Add width/height attributes to ${missingDims.length} image(s) to prevent CLS.`,
    );
  }

  return { totalImages: images.length, issues, recommendations };
}
