import { describe, it, expect } from 'vitest';
import { toNextSitemap } from '../next-adapter.js';

describe('toNextSitemap', () => {
  it('passes through absolute URLs', () => {
    const entries = toNextSitemap([
      { loc: 'https://example.com/about', priority: 0.8, changefreq: 'weekly' },
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0]!.url).toBe('https://example.com/about');
    expect(entries[0]!.priority).toBe(0.8);
    expect(entries[0]!.changeFrequency).toBe('weekly');
  });

  it('resolves relative locs against hostname instead of dropping them (issue #137)', () => {
    const entries = toNextSitemap([{ loc: '/about', priority: 0.8 }], 'https://example.com');

    expect(entries).toHaveLength(1);
    expect(entries[0]!.url).toBe('https://example.com/about');
    expect(entries[0]!.priority).toBe(0.8);
  });

  it('normalizes trailing-slash hostnames without double slashes (issue #137)', () => {
    const entries = toNextSitemap([{ loc: '/about' }], 'https://example.com/');

    expect(entries).toHaveLength(1);
    expect(entries[0]!.url).toBe('https://example.com/about');
  });

  it('handles relative locs without a leading slash', () => {
    const entries = toNextSitemap([{ loc: 'about' }], 'https://example.com');

    expect(entries).toHaveLength(1);
    expect(entries[0]!.url).toBe('https://example.com/about');
  });

  it('skips relative locs when no hostname is provided', () => {
    const entries = toNextSitemap([{ loc: '/about' }]);

    expect(entries).toHaveLength(0);
  });
});
