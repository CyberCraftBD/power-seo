// ============================================================================
// @power-seo/core — URL Utilities
// ============================================================================

/**
 * Resolve a canonical URL from a base URL and path.
 *
 * @example
 * ```ts
 * resolveCanonical('https://example.com', '/blog/post');
 * // => "https://example.com/blog/post"
 * ```
 */
export function resolveCanonical(baseUrl: string, path?: string): string {
  if (!path) {
    return normalizeUrl(baseUrl);
  }

  // If path is already absolute URL, return it normalized
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return normalizeUrl(path);
  }

  let base = baseUrl;
  while (base.endsWith('/')) base = base.slice(0, -1);
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return normalizeUrl(`${base}${cleanPath}`);
}

/**
 * Normalize a URL by removing default ports, double slashes, etc.
 */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new globalThis.URL(url);

    // Remove default ports
    if (
      (parsed.protocol === 'https:' && parsed.port === '443') ||
      (parsed.protocol === 'http:' && parsed.port === '80')
    ) {
      parsed.port = '';
    }

    // Remove trailing slash from path (except root)
    if (parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    }

    // Remove double slashes in path
    parsed.pathname = parsed.pathname.replace(/\/\/+/g, '/');

    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Ensure a URL has a trailing slash (useful for directories).
 */
export function ensureTrailingSlash(url: string): string {
  if (url.endsWith('/')) return url;

  try {
    const parsed = new globalThis.URL(url);
    // Don't add trailing slash to URLs with file extensions
    const lastSegment = parsed.pathname.split('/').pop() ?? '';
    if (lastSegment.includes('.')) return url;
    parsed.pathname += '/';
    return parsed.toString();
  } catch {
    return url.endsWith('/') ? url : `${url}/`;
  }
}

/**
 * Remove trailing slash from a URL.
 */
export function removeTrailingSlash(url: string): string {
  try {
    const parsed = new globalThis.URL(url);
    if (parsed.pathname !== '/' && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    }
    return parsed.toString();
  } catch {
    return url.endsWith('/') && url !== '/' ? url.slice(0, -1) : url;
  }
}

/**
 * Strip query parameters from a URL, optionally keeping specific ones.
 *
 * @example
 * ```ts
 * stripQueryParams('https://example.com/page?utm_source=twitter&id=123', ['id']);
 * // => "https://example.com/page?id=123"
 * ```
 */
export function stripQueryParams(url: string, keepParams?: string[]): string {
  try {
    const parsed = new globalThis.URL(url);

    if (!keepParams || keepParams.length === 0) {
      parsed.search = '';
      return parsed.toString();
    }

    const newParams = new globalThis.URLSearchParams();
    for (const param of keepParams) {
      const value = parsed.searchParams.get(param);
      if (value !== null) {
        newParams.set(param, value);
      }
    }

    parsed.search = newParams.toString() ? `?${newParams.toString()}` : '';
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Strip common tracking parameters (UTM, fbclid, gclid, etc.) from a URL.
 */
export function stripTrackingParams(url: string): string {
  const trackingParams = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'fbclid',
    'gclid',
    'gclsrc',
    'dclid',
    'msclkid',
    'ref',
    'mc_cid',
    'mc_eid',
    '_ga',
    '_gl',
    'yclid',
    'twclid',
    'igshid',
  ];

  try {
    const parsed = new globalThis.URL(url);
    for (const param of trackingParams) {
      parsed.searchParams.delete(param);
    }
    parsed.search = parsed.searchParams.toString() ? `?${parsed.searchParams.toString()}` : '';
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Extract the slug from a URL path.
 *
 * @example
 * ```ts
 * extractSlug('https://example.com/blog/my-post');
 * // => "my-post"
 * ```
 */
export function extractSlug(url: string): string {
  try {
    const parsed = new globalThis.URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] ?? '';
  } catch {
    const segments = url.split('/').filter(Boolean);
    return segments[segments.length - 1] ?? '';
  }
}

/**
 * Check if a URL is relative or absolute.
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Convert a string to a URL-safe slug.
 *
 * @example
 * ```ts
 * toSlug('My Blog Post Title!');
 * // => "my-blog-post-title"
 * ```
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Trim hyphens
}
