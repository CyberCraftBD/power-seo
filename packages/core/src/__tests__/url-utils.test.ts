import { describe, it, expect } from 'vitest';
import {
  resolveCanonical,
  normalizeUrl,
  ensureTrailingSlash,
  removeTrailingSlash,
  stripQueryParams,
  stripTrackingParams,
  extractSlug,
  isAbsoluteUrl,
  toSlug,
} from '../url-utils.js';

describe('resolveCanonical', () => {
  it('should resolve relative path', () => {
    expect(resolveCanonical('https://example.com', '/blog/post')).toBe(
      'https://example.com/blog/post',
    );
  });

  it('should handle absolute URL as path', () => {
    expect(resolveCanonical('https://example.com', 'https://other.com/page')).toBe(
      'https://other.com/page',
    );
  });

  it('should handle base URL without trailing slash', () => {
    expect(resolveCanonical('https://example.com/', '/about')).toBe('https://example.com/about');
  });
});

describe('normalizeUrl', () => {
  it('should remove trailing slash', () => {
    expect(normalizeUrl('https://example.com/page/')).toBe('https://example.com/page');
  });

  it('should keep root slash', () => {
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com/');
  });

  it('should remove default ports', () => {
    expect(normalizeUrl('https://example.com:443/page')).toBe('https://example.com/page');
  });
});

describe('stripQueryParams', () => {
  it('should strip all query params', () => {
    expect(stripQueryParams('https://example.com/page?a=1&b=2')).toBe('https://example.com/page');
  });

  it('should keep specified params', () => {
    const result = stripQueryParams('https://example.com/page?id=123&utm_source=twitter', ['id']);
    expect(result).toContain('id=123');
    expect(result).not.toContain('utm_source');
  });
});

describe('stripTrackingParams', () => {
  it('should remove UTM params', () => {
    const result = stripTrackingParams(
      'https://example.com/page?utm_source=twitter&utm_medium=social&id=123',
    );
    expect(result).not.toContain('utm_source');
    expect(result).not.toContain('utm_medium');
    expect(result).toContain('id=123');
  });

  it('should remove fbclid', () => {
    const result = stripTrackingParams('https://example.com/page?fbclid=abc123');
    expect(result).toBe('https://example.com/page');
  });
});

describe('extractSlug', () => {
  it('should extract slug from URL', () => {
    expect(extractSlug('https://example.com/blog/my-post')).toBe('my-post');
  });

  it('should handle root URL', () => {
    expect(extractSlug('https://example.com/')).toBe('');
  });
});

describe('toSlug', () => {
  it('should convert text to slug', () => {
    expect(toSlug('My Blog Post Title!')).toBe('my-blog-post-title');
  });

  it('should handle diacritics', () => {
    expect(toSlug('Café résumé')).toBe('cafe-resume');
  });

  it('should handle multiple spaces and hyphens', () => {
    expect(toSlug('hello   world---test')).toBe('hello-world-test');
  });
});

describe('isAbsoluteUrl', () => {
  it('should detect absolute URLs', () => {
    expect(isAbsoluteUrl('https://example.com')).toBe(true);
    expect(isAbsoluteUrl('http://example.com')).toBe(true);
  });

  it('should detect relative URLs', () => {
    expect(isAbsoluteUrl('/page')).toBe(false);
    expect(isAbsoluteUrl('page')).toBe(false);
  });
});

describe('ensureTrailingSlash', () => {
  it('should add trailing slash', () => {
    expect(ensureTrailingSlash('https://example.com/page')).toBe('https://example.com/page/');
  });

  it('should not double-add slash', () => {
    expect(ensureTrailingSlash('https://example.com/page/')).toBe('https://example.com/page/');
  });
});

describe('removeTrailingSlash', () => {
  it('should remove trailing slash', () => {
    expect(removeTrailingSlash('https://example.com/page/')).toBe('https://example.com/page');
  });

  it('should keep root slash', () => {
    expect(removeTrailingSlash('https://example.com/')).toBe('https://example.com/');
  });
});
