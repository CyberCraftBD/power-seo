import { describe, it, expect } from 'vitest';
import { detectFormat, getFormatRecommendation, analyzeImageFormats } from '../formats.js';
import type { ImageInfo } from '../types.js';

describe('detectFormat', () => {
  it('should detect jpg format', () => {
    expect(detectFormat('/images/photo.jpg')).toBe('jpeg');
  });

  it('should detect png format', () => {
    expect(detectFormat('/images/logo.png')).toBe('png');
  });

  it('should detect webp format', () => {
    expect(detectFormat('/images/hero.webp')).toBe('webp');
  });

  it('should detect avif format', () => {
    expect(detectFormat('/images/photo.avif')).toBe('avif');
  });

  it('should detect svg format', () => {
    expect(detectFormat('/icons/logo.svg')).toBe('svg');
  });

  it('should handle .jpeg extension', () => {
    expect(detectFormat('/images/photo.jpeg')).toBe('jpeg');
  });

  it('should return unknown for no extension', () => {
    expect(detectFormat('/images/photo')).toBe('unknown');
  });

  it('should strip query strings before detecting', () => {
    expect(detectFormat('/images/photo.webp?w=800&h=600')).toBe('webp');
  });
});

describe('getFormatRecommendation', () => {
  it('should return recommendation for legacy formats', () => {
    expect(getFormatRecommendation('jpeg')).toBeDefined();
    expect(getFormatRecommendation('png')).toBeDefined();
    expect(getFormatRecommendation('gif')).toBeDefined();
  });

  it('should return undefined for modern formats', () => {
    expect(getFormatRecommendation('webp')).toBeUndefined();
    expect(getFormatRecommendation('avif')).toBeUndefined();
    expect(getFormatRecommendation('svg')).toBeUndefined();
  });
});

describe('analyzeImageFormats', () => {
  it('should count modern vs legacy formats', () => {
    const images: ImageInfo[] = [
      { src: '/photo.jpg' },
      { src: '/hero.webp' },
      { src: '/icon.svg' },
      { src: '/banner.png' },
    ];
    const result = analyzeImageFormats(images);
    expect(result.totalImages).toBe(4);
    expect(result.modernFormatCount).toBe(2);
    expect(result.legacyFormatCount).toBe(2);
  });

  it('should provide per-image results', () => {
    const images: ImageInfo[] = [{ src: '/photo.jpg' }, { src: '/hero.webp' }];
    const result = analyzeImageFormats(images);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].isModern).toBe(false);
    expect(result.results[0].recommendation).toBeDefined();
    expect(result.results[1].isModern).toBe(true);
    expect(result.results[1].recommendation).toBeUndefined();
  });

  it('should handle empty array', () => {
    const result = analyzeImageFormats([]);
    expect(result.totalImages).toBe(0);
    expect(result.modernFormatCount).toBe(0);
    expect(result.legacyFormatCount).toBe(0);
    expect(result.results).toHaveLength(0);
  });
});
