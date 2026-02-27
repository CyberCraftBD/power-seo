import { describe, it, expect } from 'vitest';
import { generateOgPreview } from '../og.js';

describe('generateOgPreview', () => {
  it('generates a basic OG preview', () => {
    const result = generateOgPreview({
      title: 'My Article',
      description: 'A great article about SEO.',
      url: 'https://example.com/article',
    });

    expect(result.title).toBe('My Article');
    expect(result.description).toBe('A great article about SEO.');
    expect(result.url).toBe('https://example.com/article');
    expect(result.image).toBeUndefined();
  });

  it('includes site name', () => {
    const result = generateOgPreview({
      title: 'My Article',
      description: 'Description.',
      url: 'https://example.com',
      siteName: 'My Site',
    });

    expect(result.siteName).toBe('My Site');
  });

  it('validates image with correct dimensions', () => {
    const result = generateOgPreview({
      title: 'Article',
      description: 'Desc.',
      url: 'https://example.com',
      image: { url: 'https://example.com/image.jpg', width: 1200, height: 630 },
    });

    expect(result.image).toBeDefined();
    expect(result.image!.valid).toBe(true);
  });

  it('validates image with non-recommended dimensions', () => {
    const result = generateOgPreview({
      title: 'Article',
      description: 'Desc.',
      url: 'https://example.com',
      image: { url: 'https://example.com/image.jpg', width: 800, height: 600 },
    });

    expect(result.image!.valid).toBe(true);
    expect(result.image!.message).toContain('Recommended');
  });

  it('rejects image below minimum dimensions', () => {
    const result = generateOgPreview({
      title: 'Article',
      description: 'Desc.',
      url: 'https://example.com',
      image: { url: 'https://example.com/image.jpg', width: 100, height: 100 },
    });

    expect(result.image!.valid).toBe(false);
    expect(result.image!.message).toContain('Minimum');
  });

  it('accepts image without dimensions', () => {
    const result = generateOgPreview({
      title: 'Article',
      description: 'Desc.',
      url: 'https://example.com',
      image: { url: 'https://example.com/image.jpg' },
    });

    expect(result.image!.valid).toBe(true);
  });
});
