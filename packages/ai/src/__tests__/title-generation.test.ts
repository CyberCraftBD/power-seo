import { describe, it, expect } from 'vitest';
import { buildTitlePrompt, parseTitleResponse } from '../prompts/title-generation.js';

describe('buildTitlePrompt', () => {
  it('should return a valid PromptTemplate', () => {
    const result = buildTitlePrompt({
      content: 'A guide to improving your website SEO.',
    });
    expect(result.system).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.maxTokens).toBe(500);
  });

  it('should include focus keyphrase when provided', () => {
    const result = buildTitlePrompt({
      content: 'Content about gardening tips.',
      focusKeyphrase: 'organic gardening',
    });
    expect(result.user).toContain('organic gardening');
  });

  it('should mention generating 5 variants', () => {
    const result = buildTitlePrompt({
      content: 'Some content.',
    });
    expect(result.user).toContain('5');
  });
});

describe('parseTitleResponse', () => {
  it('should parse numbered list format', () => {
    const response = `1. Best SEO Tools for Small Businesses in 2025
2. Top 10 SEO Tools Every Marketer Needs
3. How to Choose the Right SEO Tool for Your Website
4. SEO Tools Compared: Which One Delivers Results?
5. Boost Your Rankings: The Ultimate SEO Tools Guide`;
    const result = parseTitleResponse(response);
    expect(result).toHaveLength(5);
    expect(result[0].title).toBe('Best SEO Tools for Small Businesses in 2025');
    expect(result[0].charCount).toBeGreaterThan(0);
    expect(result[0].pixelWidth).toBeGreaterThan(0);
  });

  it('should parse JSON array format', () => {
    const response = JSON.stringify(['Title One: Great Guide', 'Title Two: Amazing Tips']);
    const result = parseTitleResponse(response);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Title One: Great Guide');
  });

  it('should compute pixelWidth for each title', () => {
    const response = '1. Test Title for SEO';
    const result = parseTitleResponse(response);
    expect(result).toHaveLength(1);
    expect(result[0].pixelWidth).toBeGreaterThan(0);
    expect(result[0].charCount).toBe('Test Title for SEO'.length);
  });

  it('should handle empty response', () => {
    const result = parseTitleResponse('');
    expect(result).toHaveLength(0);
  });

  it('should handle parenthesis-style numbering', () => {
    const response = '1) First Title Here\n2) Second Title Here';
    const result = parseTitleResponse(response);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('First Title Here');
  });
});
