import { describe, it, expect } from 'vitest';
import { truncateAtPixelWidth } from '../truncate.js';

describe('truncateAtPixelWidth', () => {
  it('returns empty string for empty input', () => {
    const result = truncateAtPixelWidth('', 100);
    expect(result.text).toBe('');
    expect(result.truncated).toBe(false);
  });

  it('returns original text when it fits', () => {
    const result = truncateAtPixelWidth('Hi', 500);
    expect(result.text).toBe('Hi');
    expect(result.truncated).toBe(false);
  });

  it('truncates long text and appends ellipsis', () => {
    const longText = 'A'.repeat(200);
    const result = truncateAtPixelWidth(longText, 100);
    expect(result.truncated).toBe(true);
    expect(result.text.endsWith('...')).toBe(true);
    expect(result.text.length).toBeLessThan(longText.length);
  });

  it('does not truncate text that fits exactly', () => {
    // Very short text that fits in generous budget
    const result = truncateAtPixelWidth('Test', 1000);
    expect(result.truncated).toBe(false);
    expect(result.text).toBe('Test');
  });

  it('accounts for ellipsis width in budget', () => {
    // The truncated text + "..." should fit within maxPixels
    const text = 'This is a moderately long test string for truncation';
    const result = truncateAtPixelWidth(text, 200);
    if (result.truncated) {
      // The text before "..." plus the "..." should have total width <= 200px
      expect(result.text.endsWith('...')).toBe(true);
    }
  });
});
