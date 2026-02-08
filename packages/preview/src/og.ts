// ============================================================================
// @ccbd-seo/preview — Open Graph Preview Generator
// ============================================================================

import { OG_IMAGE } from '@ccbd-seo/core';
import type { OgPreviewInput, OgPreviewData, OgImageValidation } from './types.js';

function validateOgImage(image: {
  url: string;
  width?: number;
  height?: number;
}): OgImageValidation {
  const { url, width, height } = image;

  if (!url) {
    return { url, width, height, valid: false, message: 'Image URL is required.' };
  }

  if (width !== undefined && height !== undefined) {
    if (width < OG_IMAGE.MIN_WIDTH || height < OG_IMAGE.MIN_HEIGHT) {
      return {
        url,
        width,
        height,
        valid: false,
        message: `Image is ${width}x${height}px. Minimum size is ${OG_IMAGE.MIN_WIDTH}x${OG_IMAGE.MIN_HEIGHT}px.`,
      };
    }

    if (width !== OG_IMAGE.WIDTH || height !== OG_IMAGE.HEIGHT) {
      return {
        url,
        width,
        height,
        valid: true,
        message: `Image is ${width}x${height}px. Recommended size is ${OG_IMAGE.WIDTH}x${OG_IMAGE.HEIGHT}px.`,
      };
    }
  }

  return { url, width, height, valid: true };
}

/**
 * Generate an Open Graph (Facebook) preview.
 */
export function generateOgPreview(config: OgPreviewInput): OgPreviewData {
  const { title, description, url, image, siteName } = config;

  const result: OgPreviewData = {
    title,
    description,
    url,
    siteName,
  };

  if (image) {
    result.image = validateOgImage(image);
  }

  return result;
}
