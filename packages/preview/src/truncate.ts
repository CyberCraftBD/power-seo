// ============================================================================
// @ccbd-seo/preview — Pixel-Width Truncation Utility
// ============================================================================

import { CHAR_PIXEL_WIDTHS, DEFAULT_CHAR_WIDTH } from '@ccbd-seo/core';

export interface TruncateResult {
  text: string;
  truncated: boolean;
}

/**
 * Truncate text at a pixel-width boundary using Google SERP font metrics.
 * Appends "..." if truncated, accounting for the ellipsis pixel cost.
 */
export function truncateAtPixelWidth(text: string, maxPixels: number): TruncateResult {
  if (!text) {
    return { text: '', truncated: false };
  }

  // Calculate the pixel width of "..."
  const ellipsis = '...';
  let ellipsisWidth = 0;
  for (const char of ellipsis) {
    ellipsisWidth += CHAR_PIXEL_WIDTHS[char] ?? DEFAULT_CHAR_WIDTH;
  }

  let currentWidth = 0;
  let truncateIndex = -1;

  for (let i = 0; i < text.length; i++) {
    const charWidth = CHAR_PIXEL_WIDTHS[text[i]!] ?? DEFAULT_CHAR_WIDTH;
    currentWidth += charWidth;

    if (currentWidth > maxPixels) {
      // We've exceeded the limit — need to truncate
      // Find the position where text + ellipsis fits
      if (truncateIndex === -1) {
        // Backtrack to find where text + ellipsis fits within maxPixels
        let fitWidth = 0;
        for (let j = 0; j < i; j++) {
          const w = CHAR_PIXEL_WIDTHS[text[j]!] ?? DEFAULT_CHAR_WIDTH;
          if (fitWidth + w + ellipsisWidth > maxPixels) {
            truncateIndex = j;
            break;
          }
          fitWidth += w;
        }
        if (truncateIndex === -1) {
          truncateIndex = i;
        }
      }
      return {
        text: text.slice(0, truncateIndex) + ellipsis,
        truncated: true,
      };
    }
  }

  return { text, truncated: false };
}
