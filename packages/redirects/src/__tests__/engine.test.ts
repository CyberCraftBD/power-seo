import { describe, it, expect } from 'vitest';
import { createRedirectEngine } from '../engine.js';
import type { RedirectRule } from '@ccbd-seo/core';

describe('createRedirectEngine', () => {
  it('matches exact redirect rule', () => {
    const engine = createRedirectEngine([
      { source: '/old', destination: '/new', statusCode: 301 },
    ]);
    const result = engine.match('/old');
    expect(result).not.toBeNull();
    expect(result!.resolvedDestination).toBe('/new');
    expect(result!.statusCode).toBe(301);
  });

  it('matches glob redirect rule', () => {
    const engine = createRedirectEngine([
      { source: '/blog/*', destination: '/posts/*', statusCode: 301 },
    ]);
    const result = engine.match('/blog/my-post');
    expect(result).not.toBeNull();
    expect(result!.resolvedDestination).toBe('/posts/my-post');
  });

  it('matches regex redirect rule', () => {
    const engine = createRedirectEngine([
      { source: '/old/(.*)', destination: '/new/$1', statusCode: 302, isRegex: true },
    ]);
    const result = engine.match('/old/page');
    expect(result).not.toBeNull();
    expect(result!.resolvedDestination).toBe('/new/page');
    expect(result!.statusCode).toBe(302);
  });

  it('returns null when no rule matches', () => {
    const engine = createRedirectEngine([
      { source: '/old', destination: '/new', statusCode: 301 },
    ]);
    expect(engine.match('/other')).toBeNull();
  });

  it('returns first match when multiple rules match (priority)', () => {
    const engine = createRedirectEngine([
      { source: '/page', destination: '/first', statusCode: 301 },
      { source: '/page', destination: '/second', statusCode: 302 },
    ]);
    const result = engine.match('/page');
    expect(result!.resolvedDestination).toBe('/first');
    expect(result!.statusCode).toBe(301);
  });

  it('resolves redirect chains (A→B→C returns C)', () => {
    const engine = createRedirectEngine([
      { source: '/a', destination: '/b', statusCode: 301 },
      { source: '/b', destination: '/c', statusCode: 301 },
    ]);
    const result = engine.match('/a');
    expect(result).not.toBeNull();
    expect(result!.resolvedDestination).toBe('/c');
  });

  it('detects redirect loops and throws', () => {
    const engine = createRedirectEngine([
      { source: '/a', destination: '/b', statusCode: 301 },
      { source: '/b', destination: '/a', statusCode: 301 },
    ]);
    expect(() => engine.match('/a')).toThrow('Redirect loop detected');
  });

  it('addRule adds a new rule', () => {
    const engine = createRedirectEngine([]);
    expect(engine.match('/test')).toBeNull();

    engine.addRule({ source: '/test', destination: '/new-test', statusCode: 301 });
    const result = engine.match('/test');
    expect(result).not.toBeNull();
    expect(result!.resolvedDestination).toBe('/new-test');
  });

  it('removeRule removes a rule by source', () => {
    const engine = createRedirectEngine([
      { source: '/old', destination: '/new', statusCode: 301 },
    ]);
    expect(engine.match('/old')).not.toBeNull();

    const removed = engine.removeRule('/old');
    expect(removed).toBe(true);
    expect(engine.match('/old')).toBeNull();
  });

  it('removeRule returns false when rule not found', () => {
    const engine = createRedirectEngine([]);
    expect(engine.removeRule('/nonexistent')).toBe(false);
  });

  it('getRules returns a copy of the rules array', () => {
    const rules: RedirectRule[] = [
      { source: '/a', destination: '/b', statusCode: 301 },
    ];
    const engine = createRedirectEngine(rules);
    const returned = engine.getRules();
    expect(returned).toEqual(rules);
    expect(returned).not.toBe(rules); // should be a copy
  });

  it('handles trailing slash config "remove"', () => {
    const engine = createRedirectEngine(
      [{ source: '/old', destination: '/new', statusCode: 301 }],
      { trailingSlash: 'remove' },
    );
    expect(engine.match('/old/')).not.toBeNull();
  });

  it('handles trailing slash config "add"', () => {
    const engine = createRedirectEngine(
      [{ source: '/old/', destination: '/new/', statusCode: 301 }],
      { trailingSlash: 'add' },
    );
    expect(engine.match('/old')).not.toBeNull();
  });

  it('handles case sensitivity config', () => {
    const engine = createRedirectEngine(
      [{ source: '/Old', destination: '/new', statusCode: 301 }],
      { caseSensitive: true },
    );
    expect(engine.match('/old')).toBeNull();
    expect(engine.match('/Old')).not.toBeNull();
  });

  it('works with empty rules array', () => {
    const engine = createRedirectEngine([]);
    expect(engine.match('/anything')).toBeNull();
    expect(engine.getRules()).toEqual([]);
  });
});
