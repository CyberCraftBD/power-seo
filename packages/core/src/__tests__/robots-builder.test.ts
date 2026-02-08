import { describe, it, expect } from 'vitest';
import { buildRobotsContent, parseRobotsContent } from '../robots-builder.js';

describe('buildRobotsContent', () => {
  it('should build noindex, nofollow', () => {
    const result = buildRobotsContent({ index: false, follow: false });
    expect(result).toBe('noindex, nofollow');
  });

  it('should build index, follow', () => {
    const result = buildRobotsContent({ index: true, follow: true });
    expect(result).toBe('index, follow');
  });

  it('should include max-snippet', () => {
    const result = buildRobotsContent({ maxSnippet: 150 });
    expect(result).toBe('max-snippet:150');
  });

  it('should include max-image-preview', () => {
    const result = buildRobotsContent({ maxImagePreview: 'large' });
    expect(result).toBe('max-image-preview:large');
  });

  it('should combine multiple directives', () => {
    const result = buildRobotsContent({
      index: false,
      follow: true,
      noarchive: true,
      maxSnippet: 100,
    });
    expect(result).toBe('noindex, follow, noarchive, max-snippet:100');
  });

  it('should return empty string for empty directive', () => {
    expect(buildRobotsContent({})).toBe('');
  });
});

describe('parseRobotsContent', () => {
  it('should parse noindex, nofollow', () => {
    const result = parseRobotsContent('noindex, nofollow');
    expect(result.index).toBe(false);
    expect(result.follow).toBe(false);
  });

  it('should parse max-snippet', () => {
    const result = parseRobotsContent('max-snippet:150');
    expect(result.maxSnippet).toBe(150);
  });

  it('should roundtrip', () => {
    const original = { index: false, follow: true, maxSnippet: 100, maxImagePreview: 'large' as const };
    const content = buildRobotsContent(original);
    const parsed = parseRobotsContent(content);
    expect(parsed.index).toBe(false);
    expect(parsed.follow).toBe(true);
    expect(parsed.maxSnippet).toBe(100);
    expect(parsed.maxImagePreview).toBe('large');
  });
});
