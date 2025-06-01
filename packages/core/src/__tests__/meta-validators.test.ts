import { describe, it, expect } from 'vitest';
import { validateTitle, validateMetaDescription, calculatePixelWidth } from '../meta-validators.js';

describe('calculatePixelWidth', () => {
  it('should calculate width for simple text', () => {
    const width = calculatePixelWidth('Hello');
    expect(width).toBeGreaterThan(0);
  });

  it('should return 0 for empty string', () => {
    expect(calculatePixelWidth('')).toBe(0);
  });

  it('should handle uppercase wider than lowercase', () => {
    const upper = calculatePixelWidth('HELLO');
    const lower = calculatePixelWidth('hello');
    expect(upper).toBeGreaterThan(lower);
  });
});

describe('validateTitle', () => {
  it('should fail for empty title', () => {
    const result = validateTitle('');
    expect(result.valid).toBe(false);
    expect(result.severity).toBe('error');
  });

  it('should pass for good title', () => {
    const result = validateTitle('A Great Page Title for SEO Purposes');
    expect(result.valid).toBe(true);
  });

  it('should warn for short title', () => {
    const result = validateTitle('Short');
    expect(result.valid).toBe(true);
    expect(result.severity).toBe('warning');
  });

  it('should warn for title that exceeds pixel width', () => {
    const longTitle =
      'This is a very long page title that should definitely exceed the maximum pixel width allowed by Google search results';
    const result = validateTitle(longTitle);
    expect(result.severity).toBe('warning');
  });

  it('should include character count and pixel width', () => {
    const result = validateTitle('Test Title');
    expect(result.charCount).toBeDefined();
    expect(result.pixelWidth).toBeDefined();
    expect(result.charCount).toBe(10);
  });
});

describe('validateMetaDescription', () => {
  it('should warn for empty description', () => {
    const result = validateMetaDescription('');
    expect(result.valid).toBe(false);
    expect(result.severity).toBe('warning');
  });

  it('should pass for good description', () => {
    const result = validateMetaDescription(
      'This is a well-crafted meta description that provides a clear summary of the page content and encourages users to click through from search results.',
    );
    expect(result.valid).toBe(true);
  });

  it('should warn for short description', () => {
    const result = validateMetaDescription('Too short.');
    expect(result.severity).toBe('warning');
  });
});
