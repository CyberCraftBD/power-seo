import { describe, it, expect } from 'vitest';
import { matchExact, matchGlob, matchRegex, substituteParams } from '../matcher.js';

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
});

describe('substituteParams', () => {
  it('substitutes named params', () => {
    expect(substituteParams('/new/:id', { id: '123' })).toBe('/new/123');
  });

  it('substitutes wildcard', () => {
    expect(substituteParams('/new/*', { '*': 'path/to/page' })).toBe('/new/path/to/page');
  });
});
