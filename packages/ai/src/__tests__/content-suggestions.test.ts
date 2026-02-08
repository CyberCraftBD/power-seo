import { describe, it, expect } from 'vitest';
import { buildContentSuggestionsPrompt, parseContentSuggestionsResponse } from '../prompts/content-suggestions.js';

describe('buildContentSuggestionsPrompt', () => {
  it('should return a valid PromptTemplate', () => {
    const result = buildContentSuggestionsPrompt({
      title: 'SEO Guide',
      content: '<p>Learn about SEO best practices for your website.</p>',
    });
    expect(result.system).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.maxTokens).toBe(1000);
  });

  it('should include word count in the prompt', () => {
    const result = buildContentSuggestionsPrompt({
      title: 'Test',
      content: 'One two three four five.',
    });
    expect(result.user).toContain('Word count:');
  });

  it('should include analysis results when provided', () => {
    const result = buildContentSuggestionsPrompt({
      title: 'Test',
      content: 'Some content here.',
      analysisResults: 'Missing H2 headings, low keyword density',
    });
    expect(result.user).toContain('Missing H2 headings');
  });
});

describe('parseContentSuggestionsResponse', () => {
  it('should parse valid JSON array', () => {
    const json = JSON.stringify([
      { type: 'heading', suggestion: 'Add H2 for benefits section', priority: 3, reason: 'Improves structure' },
      { type: 'keyword', suggestion: 'Add more keyword variations', priority: 2 },
    ]);
    const result = parseContentSuggestionsResponse(json);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('heading');
    expect(result[0].suggestion).toBe('Add H2 for benefits section');
  });

  it('should handle markdown code fences', () => {
    const fenced = '```json\n[{"type":"link","suggestion":"Add internal links","priority":1}]\n```';
    const result = parseContentSuggestionsResponse(fenced);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('link');
  });

  it('should return empty array on invalid JSON', () => {
    const result = parseContentSuggestionsResponse('This is not JSON at all.');
    expect(result).toEqual([]);
  });

  it('should filter out invalid items', () => {
    const json = JSON.stringify([
      { type: 'heading', suggestion: 'Valid', priority: 1 },
      { invalid: true },
      { type: 'keyword' },
    ]);
    const result = parseContentSuggestionsResponse(json);
    expect(result).toHaveLength(1);
  });

  it('should return empty array for non-array JSON', () => {
    const result = parseContentSuggestionsResponse('{"type": "heading"}');
    expect(result).toEqual([]);
  });

  it('should handle empty response', () => {
    const result = parseContentSuggestionsResponse('[]');
    expect(result).toEqual([]);
  });
});
