import { describe, it, expect } from 'vitest';
import { analyzeAltText } from '../alt-text.js';
import type { ImageInfo } from '../types.js';

describe('analyzeAltText', () => {
  it('should pass for images with good alt text', () => {
    const images: ImageInfo[] = [
      { src: '/hero.webp', alt: 'A sunset over the mountains with orange sky' },
    ];
    const result = analyzeAltText(images);
    expect(result.totalImages).toBe(1);
    expect(result.perImage[0].score).toBe(result.perImage[0].maxScore);
    const passIssues = result.issues.filter((i) => i.severity === 'pass');
    expect(passIssues.length).toBeGreaterThan(0);
  });

  it('should error for missing alt attribute', () => {
    const images: ImageInfo[] = [{ src: '/photo.jpg' }];
    const result = analyzeAltText(images);
    const missing = result.issues.find((i) => i.id === 'alt-missing');
    expect(missing).toBeDefined();
    expect(missing!.severity).toBe('error');
  });

  it('should error for null alt attribute', () => {
    const images: ImageInfo[] = [{ src: '/photo.jpg', alt: undefined }];
    const result = analyzeAltText(images);
    const missing = result.issues.find((i) => i.id === 'alt-missing');
    expect(missing).toBeDefined();
  });

  it('should pass for decorative alt=""', () => {
    const images: ImageInfo[] = [{ src: '/divider.png', alt: '' }];
    const result = analyzeAltText(images);
    const decorative = result.issues.find((i) => i.id === 'alt-decorative');
    expect(decorative).toBeDefined();
    expect(decorative!.severity).toBe('pass');
  });

  it('should warn for alt text that is too short', () => {
    const images: ImageInfo[] = [{ src: '/img.jpg', alt: 'Dog' }];
    const result = analyzeAltText(images);
    const tooShort = result.issues.find((i) => i.id === 'alt-too-short');
    expect(tooShort).toBeDefined();
    expect(tooShort!.severity).toBe('warning');
  });

  it('should warn for alt text that is too long', () => {
    const longAlt = 'A'.repeat(130);
    const images: ImageInfo[] = [{ src: '/img.jpg', alt: longAlt }];
    const result = analyzeAltText(images);
    const tooLong = result.issues.find((i) => i.id === 'alt-too-long');
    expect(tooLong).toBeDefined();
    expect(tooLong!.severity).toBe('warning');
  });

  it('should warn for redundant prefix in alt text', () => {
    const images: ImageInfo[] = [
      { src: '/hero.jpg', alt: 'Image of a beautiful landscape with mountains' },
    ];
    const result = analyzeAltText(images);
    const redundant = result.issues.find((i) => i.id === 'alt-redundant-prefix');
    expect(redundant).toBeDefined();
    expect(redundant!.severity).toBe('warning');
  });

  it('should warn for filename pattern in alt text', () => {
    const images: ImageInfo[] = [{ src: '/photo.jpg', alt: 'IMG_2024_vacation' }];
    const result = analyzeAltText(images);
    const filename = result.issues.find((i) => i.id === 'alt-filename');
    expect(filename).toBeDefined();
    expect(filename!.severity).toBe('warning');
  });

  it('should warn for duplicate alt text across images', () => {
    const images: ImageInfo[] = [
      { src: '/img1.jpg', alt: 'Product photo showing the widget' },
      { src: '/img2.jpg', alt: 'Product photo showing the widget' },
    ];
    const result = analyzeAltText(images);
    const duplicates = result.issues.filter((i) => i.id === 'alt-duplicate');
    expect(duplicates.length).toBe(2);
  });

  it('should return info when keyphrase is not in any alt', () => {
    const images: ImageInfo[] = [{ src: '/img.jpg', alt: 'A beautiful sunset landscape photo' }];
    const result = analyzeAltText(images, 'SEO tools');
    const noKeyphrase = result.issues.find((i) => i.id === 'alt-no-keyphrase');
    expect(noKeyphrase).toBeDefined();
    expect(noKeyphrase!.severity).toBe('info');
  });

  it('should not flag keyphrase when it exists in alt text', () => {
    const images: ImageInfo[] = [
      { src: '/img.jpg', alt: 'Best SEO tools for content optimization' },
    ];
    const result = analyzeAltText(images, 'SEO tools');
    const noKeyphrase = result.issues.find((i) => i.id === 'alt-no-keyphrase');
    expect(noKeyphrase).toBeUndefined();
  });

  it('should return empty results for no images', () => {
    const result = analyzeAltText([]);
    expect(result.totalImages).toBe(0);
    expect(result.score).toBe(100);
    expect(result.issues).toHaveLength(0);
  });
});
