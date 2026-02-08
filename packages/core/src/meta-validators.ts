// ============================================================================
// @ccbd-seo/core — Meta Tag Validators
// ============================================================================

import {
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  TITLE_MAX_PIXELS,
  META_DESCRIPTION_MAX_LENGTH,
  META_DESCRIPTION_MIN_LENGTH,
  META_DESCRIPTION_MAX_PIXELS,
  CHAR_PIXEL_WIDTHS,
  DEFAULT_CHAR_WIDTH,
} from './constants.js';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationResult {
  valid: boolean;
  severity: ValidationSeverity;
  message: string;
  charCount?: number;
  pixelWidth?: number;
}

/**
 * Calculate the pixel width of a string using Google SERP font metrics.
 */
export function calculatePixelWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    width += CHAR_PIXEL_WIDTHS[char] ?? DEFAULT_CHAR_WIDTH;
  }
  return Math.round(width * 100) / 100;
}

/**
 * Validate a page title for SEO best practices.
 *
 * Checks character length and pixel width against Google SERP limits.
 */
export function validateTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return {
      valid: false,
      severity: 'error',
      message: 'Title is empty. Every page must have a unique title.',
      charCount: 0,
      pixelWidth: 0,
    };
  }

  const trimmed = title.trim();
  const charCount = trimmed.length;
  const pixelWidth = calculatePixelWidth(trimmed);

  if (pixelWidth > TITLE_MAX_PIXELS) {
    return {
      valid: false,
      severity: 'warning',
      message: `Title is ${charCount} characters (${pixelWidth}px) and will be truncated in Google search results. Keep it under ${TITLE_MAX_PIXELS}px (~${TITLE_MAX_LENGTH} characters).`,
      charCount,
      pixelWidth,
    };
  }

  if (charCount < TITLE_MIN_LENGTH) {
    return {
      valid: true,
      severity: 'warning',
      message: `Title is only ${charCount} characters. Consider making it at least ${TITLE_MIN_LENGTH} characters for better SEO.`,
      charCount,
      pixelWidth,
    };
  }

  if (charCount > TITLE_MAX_LENGTH) {
    return {
      valid: true,
      severity: 'info',
      message: `Title is ${charCount} characters but fits within ${TITLE_MAX_PIXELS}px. The pixel width (${pixelWidth}px) is what matters for truncation.`,
      charCount,
      pixelWidth,
    };
  }

  return {
    valid: true,
    severity: 'info',
    message: `Title is ${charCount} characters (${pixelWidth}px). Good length.`,
    charCount,
    pixelWidth,
  };
}

/**
 * Validate a meta description for SEO best practices.
 *
 * Checks character length and pixel width against Google SERP limits.
 */
export function validateMetaDescription(description: string): ValidationResult {
  if (!description || description.trim().length === 0) {
    return {
      valid: false,
      severity: 'warning',
      message:
        'Meta description is empty. Without one, Google will auto-generate a snippet from page content.',
      charCount: 0,
      pixelWidth: 0,
    };
  }

  const trimmed = description.trim();
  const charCount = trimmed.length;
  const pixelWidth = calculatePixelWidth(trimmed);

  if (pixelWidth > META_DESCRIPTION_MAX_PIXELS) {
    return {
      valid: false,
      severity: 'warning',
      message: `Meta description is ${charCount} characters (${pixelWidth}px) and will be truncated. Keep it under ${META_DESCRIPTION_MAX_PIXELS}px (~${META_DESCRIPTION_MAX_LENGTH} characters).`,
      charCount,
      pixelWidth,
    };
  }

  if (charCount < META_DESCRIPTION_MIN_LENGTH) {
    return {
      valid: true,
      severity: 'warning',
      message: `Meta description is only ${charCount} characters. Aim for ${META_DESCRIPTION_MIN_LENGTH}-${META_DESCRIPTION_MAX_LENGTH} characters to maximize SERP real estate.`,
      charCount,
      pixelWidth,
    };
  }

  return {
    valid: true,
    severity: 'info',
    message: `Meta description is ${charCount} characters (${pixelWidth}px). Good length.`,
    charCount,
    pixelWidth,
  };
}
