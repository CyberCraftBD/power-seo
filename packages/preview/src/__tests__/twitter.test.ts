import { describe, it, expect } from 'vitest';
import { generateTwitterPreview } from '../twitter.js';

describe('generateTwitterPreview', () => {
  it('generates a basic summary card', () => {
    const result = generateTwitterPreview({
      cardType: 'summary',
      title: 'My Post',
      description: 'A great post.',
    });

    expect(result.cardType).toBe('summary');
    expect(result.title).toBe('My Post');
    expect(result.description).toBe('A great post.');
    expect(result.image).toBeUndefined();
  });

  it('extracts domain from site handle', () => {
    const result = generateTwitterPreview({
      cardType: 'summary',
      title: 'Post',
      description: 'Desc.',
      site: '@mysite',
    });

    expect(result.domain).toBe('mysite');
  });

  it('handles site without @ prefix', () => {
    const result = generateTwitterPreview({
      cardType: 'summary',
      title: 'Post',
      description: 'Desc.',
      site: 'mysite',
    });

    expect(result.domain).toBe('mysite');
  });

  it('validates image for summary card', () => {
    const result = generateTwitterPreview({
      cardType: 'summary',
      title: 'Post',
      description: 'Desc.',
      image: { url: 'https://example.com/img.jpg', width: 144, height: 144 },
    });

    expect(result.image).toBeDefined();
    expect(result.image!.valid).toBe(true);
  });

  it('rejects undersized image for summary card', () => {
    const result = generateTwitterPreview({
      cardType: 'summary',
      title: 'Post',
      description: 'Desc.',
      image: { url: 'https://example.com/img.jpg', width: 50, height: 50 },
    });

    expect(result.image!.valid).toBe(false);
    expect(result.image!.message).toContain('summary');
  });

  it('validates image for summary_large_image card', () => {
    const result = generateTwitterPreview({
      cardType: 'summary_large_image',
      title: 'Post',
      description: 'Desc.',
      image: { url: 'https://example.com/img.jpg', width: 800, height: 418 },
    });

    expect(result.image!.valid).toBe(true);
  });

  it('rejects undersized image for summary_large_image card', () => {
    const result = generateTwitterPreview({
      cardType: 'summary_large_image',
      title: 'Post',
      description: 'Desc.',
      image: { url: 'https://example.com/img.jpg', width: 200, height: 100 },
    });

    expect(result.image!.valid).toBe(false);
    expect(result.image!.message).toContain('summary_large_image');
  });

  it('accepts image without dimensions', () => {
    const result = generateTwitterPreview({
      cardType: 'summary',
      title: 'Post',
      description: 'Desc.',
      image: { url: 'https://example.com/img.jpg' },
    });

    expect(result.image!.valid).toBe(true);
  });
});
