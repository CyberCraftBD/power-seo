// ============================================================================
// @ccbd-seo/react — <Canonical> Component
// ============================================================================

import { createElement } from 'react';
import { resolveCanonical } from '@ccbd-seo/core';

export interface CanonicalProps {
  /** The canonical URL (absolute or relative to baseUrl) */
  url: string;
  /** Base URL for resolving relative paths */
  baseUrl?: string;
  /** Whether to add trailing slash (default: false) */
  trailingSlash?: boolean;
}

/**
 * Render a canonical link tag.
 *
 * @example
 * ```tsx
 * <Canonical url="https://example.com/blog/post" />
 * // or with base URL:
 * <Canonical url="/blog/post" baseUrl="https://example.com" />
 * ```
 */
export function Canonical({ url, baseUrl, trailingSlash = false }: CanonicalProps) {
  let canonical = baseUrl ? resolveCanonical(baseUrl, url) : url;

  if (trailingSlash && !canonical.endsWith('/')) {
    canonical += '/';
  } else if (!trailingSlash && canonical.endsWith('/') && canonical !== url.replace(/\/$/, '') + '/') {
    // Only strip trailing slash if it was explicitly added
  }

  return createElement('link', {
    rel: 'canonical',
    href: canonical,
  });
}
