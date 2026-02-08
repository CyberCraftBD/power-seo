// ============================================================================
// @ccbd-seo/preview — Twitter Card Preview Generator
// ============================================================================

import { TWITTER_IMAGE } from '@ccbd-seo/core';
import type { TwitterCardType } from '@ccbd-seo/core';
import type { TwitterPreviewInput, TwitterPreviewData, TwitterImageValidation } from './types.js';

function validateTwitterImage(
  image: { url: string; width?: number; height?: number },
  cardType: TwitterCardType,
): TwitterImageValidation {
  const { url, width, height } = image;

  if (!url) {
    return { url, width, height, valid: false, message: 'Image URL is required.' };
  }

  const specs =
    cardType === 'summary_large_image' ? TWITTER_IMAGE.SUMMARY_LARGE : TWITTER_IMAGE.SUMMARY;

  if (width !== undefined && height !== undefined) {
    if (width < specs.WIDTH || height < specs.HEIGHT) {
      return {
        url,
        width,
        height,
        valid: false,
        message: `Image is ${width}x${height}px. Recommended minimum for ${cardType} is ${specs.WIDTH}x${specs.HEIGHT}px.`,
      };
    }
  }

  return { url, width, height, valid: true };
}

function extractDomain(site?: string): string | undefined {
  if (!site) return undefined;
  // Twitter site handle: @example → example
  return site.replace(/^@/, '');
}

/**
 * Generate a Twitter Card preview.
 */
export function generateTwitterPreview(config: TwitterPreviewInput): TwitterPreviewData {
  const { cardType, title, description, image, site } = config;

  const result: TwitterPreviewData = {
    cardType,
    title,
    description,
    domain: extractDomain(site),
  };

  if (image) {
    result.image = validateTwitterImage(image, cardType);
  }

  return result;
}
