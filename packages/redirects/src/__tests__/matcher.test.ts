import { describe, it, expect } from 'vitest';
import {
  matchExact,
  matchGlob,
  matchRegex,
  substituteParams,
  isDestinationSafe,
} from '../matcher.js';

describe('matchExact', () => {
  it('matches identical paths', () => {
    expect(matchExact('/about', '/about')).toBe(true);
  });

  it('returns false for non-matching paths', () => {
    expect(matchExact('/about', '/contact')).toBe(false);
  });

  it('normalizes trailing slashes by default', () => {
    expect(matchExact('/about/', '/about')).toBe(true);
  });

  it('is case-insensitive by default', () => {
    expect(matchExact('/About', '/about')).toBe(true);
  });

  it('respects case sensitivity config', () => {
    expect(matchExact('/About', '/about', { caseSensitive: true })).toBe(false);
  });

  it('respects trailing slash "keep" config', () => {
    expect(matchExact('/about/', '/about', { trailingSlash: 'keep' })).toBe(false);
  });

  it('handles full URLs by extracting path', () => {
    expect(matchExact('https://example.com/about', '/about')).toBe(true);
  });
});

describe('matchGlob', () => {
  it('matches wildcard *', () => {
    const result = matchGlob('/blog/my-post', '/blog/*');
    expect(result.matched).toBe(true);
    expect(result.params['*']).toBe('my-post');
  });

  it('matches wildcard with nested paths', () => {
    const result = matchGlob('/blog/2024/my-post', '/blog/*');
    expect(result.matched).toBe(true);
    expect(result.params['*']).toBe('2024/my-post');
  });

  it('matches named param :slug', () => {
    const result = matchGlob('/users/123', '/users/:id');
    expect(result.matched).toBe(true);
    expect(result.params['id']).toBe('123');
  });

  it('matches multiple named params', () => {
    const result = matchGlob('/users/123/posts/456', '/users/:userId/posts/:postId');
    expect(result.matched).toBe(true);
    expect(result.params['userId']).toBe('123');
    expect(result.params['postId']).toBe('456');
  });

  it('returns false for non-matching glob', () => {
    const result = matchGlob('/about', '/blog/*');
    expect(result.matched).toBe(false);
  });

  it('returns false when url has fewer segments than pattern', () => {
    const result = matchGlob('/users', '/users/:id');
    expect(result.matched).toBe(false);
  });

  it('returns false when url has extra segments beyond non-wildcard pattern', () => {
    const result = matchGlob('/users/123/extra', '/users/:id');
    expect(result.matched).toBe(false);
  });

  it('does not capture the query string into a named param (issue #138)', () => {
    const result = matchGlob('/p/1?x=2', '/p/:id');
    expect(result.matched).toBe(true);
    expect(result.params['id']).toBe('1');
  });

  it('matches wildcard patterns even when the url carries a query (issue #138)', () => {
    const result = matchGlob('/blog/my-post?utm=x', '/blog/*');
    expect(result.matched).toBe(true);
    expect(result.params['*']).toBe('my-post');
  });
});

describe('matchRegex', () => {
  it('matches regex with capture groups', () => {
    const result = matchRegex('/old/hello', '/old/(.*)', '/new/$1');
    expect(result.matched).toBe(true);
    expect(result.destination).toBe('/new/hello');
  });

  it('matches regex with multiple capture groups', () => {
    const result = matchRegex('/blog/2024/post', '/blog/(\\d+)/(.*)', '/archive/$1/$2');
    expect(result.matched).toBe(true);
    expect(result.destination).toBe('/archive/2024/post');
  });

  it('returns false for non-matching regex', () => {
    const result = matchRegex('/about', '/blog/(.*)', '/new/$1');
    expect(result.matched).toBe(false);
  });

  it('handles invalid regex gracefully', () => {
    const result = matchRegex('/test', '[invalid', '/dest');
    expect(result.matched).toBe(false);
  });

  it('substitutes every occurrence of a capture group (issue #138)', () => {
    const result = matchRegex('/old/hi', '/old/(.*)', '/new/$1/again/$1');
    expect(result.matched).toBe(true);
    expect(result.destination).toBe('/new/hi/again/hi');
  });
});

describe('substituteParams', () => {
  it('substitutes named params', () => {
    expect(substituteParams('/new/:id', { id: '123' })).toBe('/new/123');
  });

  it('substitutes wildcard', () => {
    expect(substituteParams('/new/*', { '*': 'path/to/page' })).toBe('/new/path/to/page');
  });

  it('does not collide on shared key prefixes (issue #138)', () => {
    expect(substituteParams('/x/:idx/:id', { id: 'AAA', idx: 'BBB' })).toBe('/x/BBB/AAA');
  });

  it('substitutes a token used more than once (issue #138)', () => {
    expect(substituteParams('/x/:id/:id', { id: 'AAA' })).toBe('/x/AAA/AAA');
  });

  it('substitutes every occurrence of the wildcard', () => {
    expect(substituteParams('/a/*/b/*', { '*': 'X' })).toBe('/a/X/b/X');
  });
});

describe('isDestinationSafe', () => {
  it('allows normal internal destinations', () => {
    expect(isDestinationSafe('/new/:id', '/new/123')).toBe(true);
  });

  it('blocks javascript: destinations', () => {
    expect(isDestinationSafe('*', 'javascript:alert(1)')).toBe(false);
  });

  it('blocks dangerous schemes case-insensitively and with leading whitespace', () => {
    expect(isDestinationSafe('*', '  JaVaScRiPt:alert(1)')).toBe(false);
    expect(isDestinationSafe('*', 'data:text/html,<script>x</script>')).toBe(false);
    expect(isDestinationSafe('*', 'vbscript:msgbox(1)')).toBe(false);
    expect(isDestinationSafe('*', 'file:///etc/passwd')).toBe(false);
  });

  it('blocks substitution-induced protocol-relative destinations', () => {
    expect(isDestinationSafe('/*', '//evil.com/phish')).toBe(false);
    expect(isDestinationSafe('/*', '\\\\evil.com/phish')).toBe(false);
    expect(isDestinationSafe('/*', '/\\evil.com/phish')).toBe(false);
  });

  it('blocks substitution-induced absolute external destinations', () => {
    expect(isDestinationSafe('/go/:target', 'https://evil.com/phish')).toBe(false);
  });

  it('blocks scheme-prefixed destinations without double slashes (WHATWG normalization)', () => {
    expect(isDestinationSafe('/*', 'https:/evil.com/phish')).toBe(false);
    expect(isDestinationSafe('/*', 'https:evil.com')).toBe(false);
  });

  it('preserves intentionally external destination templates', () => {
    expect(isDestinationSafe('https://example.org/*', 'https://example.org/page')).toBe(true);
  });

  it('honors allowExternalRedirects config', () => {
    expect(
      isDestinationSafe('/*', 'https://partner.example/landing', {
        allowExternalRedirects: true,
      }),
    ).toBe(true);
  });

  it('never allows dangerous schemes even with allowExternalRedirects', () => {
    expect(isDestinationSafe('*', 'javascript:alert(1)', { allowExternalRedirects: true })).toBe(
      false,
    );
  });
});
