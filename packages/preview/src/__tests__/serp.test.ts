import { describe, it, expect } from 'vitest';
import { generateSerpPreview } from '../serp.js';

describe('generateSerpPreview', () => {
  it('generates a basic SERP preview', () => {
    const result = generateSerpPreview({
      title: 'Best React SEO Practices',
      description: 'Learn the best practices for optimizing React applications for search engines.',
      url: 'https://example.com/blog/react-seo',
    });

    expect(result.title).toBeTruthy();
    expect(result.displayUrl).toBe('example.com \u203a blog \u203a react-seo');
    expect(result.description).toBeTruthy();
    expect(result.titleValidation).toBeDefined();
    expect(result.descriptionValidation).toBeDefined();
  });

  it('appends site title to displayed title', () => {
    const result = generateSerpPreview({
      title: 'Blog Post',
      description: 'Description here.',
      url: 'https://example.com',
      siteTitle: 'My Site',
    });

    expect(result.title).toContain('Blog Post');
    expect(result.titleValidation).toBeDefined();
  });

  it('formats URL without path as hostname only', () => {
    const result = generateSerpPreview({
      title: 'Home',
      description: 'Welcome.',
      url: 'https://www.example.com/',
    });

    expect(result.displayUrl).toBe('example.com');
  });

  it('strips www from URL', () => {
    const result = generateSerpPreview({
      title: 'Page',
      description: 'Desc.',
      url: 'https://www.example.com/about',
    });

    expect(result.displayUrl).toBe('example.com \u203a about');
  });

  it('truncates long titles', () => {
    const result = generateSerpPreview({
      title: 'A'.repeat(200),
      description: 'Short description.',
      url: 'https://example.com',
    });

    expect(result.titleTruncated).toBe(true);
    expect(result.title.endsWith('...')).toBe(true);
  });

  it('truncates long descriptions', () => {
    const result = generateSerpPreview({
      title: 'Title',
      description: 'A'.repeat(500),
      url: 'https://example.com',
    });

    expect(result.descriptionTruncated).toBe(true);
    expect(result.description.endsWith('...')).toBe(true);
  });

  it('includes validation results', () => {
    const result = generateSerpPreview({
      title: 'Good Title for SEO Best Practices',
      description:
        'A well-written meta description that provides a clear summary of the page content and is within the recommended character length range.',
      url: 'https://example.com',
    });

    expect(result.titleValidation.valid).toBe(true);
    expect(result.descriptionValidation.valid).toBe(true);
  });
});
