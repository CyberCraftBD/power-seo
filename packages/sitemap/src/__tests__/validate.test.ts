import { describe, it, expect } from 'vitest';
import { validateSitemapUrl } from '../validate.js';

describe('validateSitemapUrl', () => {
  it('validates a correct URL entry', () => {
    const result = validateSitemapUrl({
      loc: 'https://example.com/page',
      lastmod: '2024-01-15',
      changefreq: 'weekly',
      priority: 0.8,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects empty loc', () => {
    const result = validateSitemapUrl({ loc: '' });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('required');
  });

  it('rejects relative URLs', () => {
    const result = validateSitemapUrl({ loc: '/relative-path' });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('absolute'))).toBe(true);
  });

  it('rejects invalid lastmod format', () => {
    const result = validateSitemapUrl({
      loc: 'https://example.com/page',
      lastmod: 'January 15, 2024',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('lastmod'))).toBe(true);
  });

  it('accepts valid ISO 8601 lastmod formats', () => {
    const dates = [
      '2024-01-15',
      '2024-01-15T10:30:00Z',
      '2024-01-15T10:30:00+05:00',
      '2024-01-15T10:30+02:00',
    ];

    for (const date of dates) {
      const result = validateSitemapUrl({
        loc: 'https://example.com/',
        lastmod: date,
      });
      expect(result.errors.filter((e) => e.includes('lastmod'))).toHaveLength(0);
    }
  });

  it('rejects out-of-range priority', () => {
    const result = validateSitemapUrl({
      loc: 'https://example.com/',
      priority: 1.5,
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('priority'))).toBe(true);
  });

  it('accepts priority 0 and 1', () => {
    for (const priority of [0, 0.5, 1]) {
      const result = validateSitemapUrl({
        loc: 'https://example.com/',
        priority,
      });
      expect(result.errors.filter((e) => e.includes('priority'))).toHaveLength(0);
    }
  });

  it('warns about long URLs', () => {
    const result = validateSitemapUrl({
      loc: 'https://example.com/' + 'a'.repeat(100),
    });

    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('characters');
  });

  it('validates image entries', () => {
    const result = validateSitemapUrl({
      loc: 'https://example.com/page',
      images: [
        { loc: 'https://example.com/img.jpg' },
        { loc: '' },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Image 2'))).toBe(true);
  });

  it('validates video entries', () => {
    const result = validateSitemapUrl({
      loc: 'https://example.com/page',
      videos: [
        {
          thumbnailLoc: 'https://example.com/thumb.jpg',
          title: 'Video',
          description: 'Desc',
          contentLoc: 'https://example.com/vid.mp4',
        },
      ],
    });

    expect(result.valid).toBe(true);
  });

  it('rejects video missing required fields', () => {
    const result = validateSitemapUrl({
      loc: 'https://example.com/page',
      videos: [
        {
          thumbnailLoc: '',
          title: '',
          description: '',
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('validates news entries', () => {
    const result = validateSitemapUrl({
      loc: 'https://example.com/news',
      news: {
        publication: { name: 'Test', language: 'en' },
        publicationDate: '2024-01-15',
        title: 'Story',
      },
    });

    expect(result.valid).toBe(true);
  });

  it('rejects news missing required fields', () => {
    const result = validateSitemapUrl({
      loc: 'https://example.com/news',
      news: {
        publication: { name: '', language: '' },
        publicationDate: '',
        title: '',
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('News'))).toBe(true);
  });
});
