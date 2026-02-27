import { describe, it, expect } from 'vitest';
import { auditLazyLoading } from '../lazy-loading.js';
import type { ImageInfo } from '../types.js';

describe('auditLazyLoading', () => {
  it('should error when above-fold image has lazy loading', () => {
    const images: ImageInfo[] = [
      { src: '/hero.webp', isAboveFold: true, loading: 'lazy', width: 1200, height: 600 },
    ];
    const result = auditLazyLoading(images);
    const issue = result.issues.find((i) => i.id === 'lazy-above-fold');
    expect(issue).toBeDefined();
    expect(issue!.severity).toBe('error');
  });

  it('should warn when below-fold image lacks lazy loading', () => {
    const images: ImageInfo[] = [{ src: '/card.jpg', isAboveFold: false, width: 400, height: 300 }];
    const result = auditLazyLoading(images);
    const issue = result.issues.find((i) => i.id === 'lazy-missing-below-fold');
    expect(issue).toBeDefined();
    expect(issue!.severity).toBe('warning');
  });

  it('should recommend decoding="async" when missing', () => {
    const images: ImageInfo[] = [{ src: '/photo.jpg', width: 800, height: 600 }];
    const result = auditLazyLoading(images);
    const issue = result.issues.find((i) => i.id === 'decoding-missing');
    expect(issue).toBeDefined();
    expect(issue!.severity).toBe('info');
  });

  it('should warn when explicit dimensions are missing', () => {
    const images: ImageInfo[] = [{ src: '/photo.jpg' }];
    const result = auditLazyLoading(images);
    const issue = result.issues.find((i) => i.id === 'dimensions-missing');
    expect(issue).toBeDefined();
    expect(issue!.severity).toBe('warning');
  });

  it('should flag wide images without srcset', () => {
    const images: ImageInfo[] = [{ src: '/banner.jpg', width: 1200, height: 400 }];
    const result = auditLazyLoading(images);
    const issue = result.issues.find((i) => i.id === 'srcset-missing');
    expect(issue).toBeDefined();
    expect(issue!.severity).toBe('info');
  });

  it('should warn when srcset exists but sizes is missing', () => {
    const images: ImageInfo[] = [
      {
        src: '/responsive.jpg',
        srcset: '/responsive-300.jpg 300w, /responsive-600.jpg 600w',
        width: 600,
        height: 400,
      },
    ];
    const result = auditLazyLoading(images);
    const issue = result.issues.find((i) => i.id === 'sizes-missing');
    expect(issue).toBeDefined();
    expect(issue!.severity).toBe('warning');
  });

  it('should have no issues for properly configured images', () => {
    const images: ImageInfo[] = [
      {
        src: '/hero.webp',
        isAboveFold: true,
        loading: 'eager',
        decoding: 'async',
        width: 1200,
        height: 600,
        srcset: '/hero-600.webp 600w, /hero-1200.webp 1200w',
        sizes: '100vw',
      },
    ];
    const result = auditLazyLoading(images);
    expect(result.issues).toHaveLength(0);
  });

  it('should handle empty array', () => {
    const result = auditLazyLoading([]);
    expect(result.totalImages).toBe(0);
    expect(result.issues).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });
});
