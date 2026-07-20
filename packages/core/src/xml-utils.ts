// @power-seo/core — XML Utilities
// ----------------------------------------------------------------------------

/**
 * Escape special XML characters.
 *
 * @example
 * ```ts
 * escapeXml('Tom & Jerry <show>');
 * // => "Tom &amp; Jerry &lt;show&gt;"
 * ```
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
