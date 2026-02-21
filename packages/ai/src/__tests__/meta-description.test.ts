import { describe, it, expect } from 'vitest';
import {
  buildMetaDescriptionPrompt,
  parseMetaDescriptionResponse,
} from '../prompts/meta-description.js';

describe('buildMetaDescriptionPrompt', () => {
  it('should return a valid PromptTemplate', () => {
    const result = buildMetaDescriptionPrompt({
      title: 'Best SEO Tools 2025',
      content: 'A comprehensive guide to the best SEO tools available today.',
    });
    expect(result.system).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.maxTokens).toBe(200);
  });

  it('should include the title and content in the user prompt', () => {
    const result = buildMetaDescriptionPrompt({
      title: 'Best SEO Tools',
      content: 'Guide to SEO tools for professionals.',
    });
    expect(result.user).toContain('Best SEO Tools');
    expect(result.user).toContain('Guide to SEO tools');
  });

  it('should include focus keyphrase when provided', () => {
    const result = buildMetaDescriptionPrompt({
      title: 'Test',
      content: 'Test content',
      focusKeyphrase: 'SEO optimization',
    });
    expect(result.user).toContain('SEO optimization');
  });

  it('should include custom maxLength in prompt', () => {
    const result = buildMetaDescriptionPrompt({
      title: 'Test',
      content: 'Test content',
      maxLength: 120,
    });
    expect(result.user).toContain('120');
  });

  it('should include tone when provided', () => {
    const result = buildMetaDescriptionPrompt({
      title: 'Test',
      content: 'Test content',
      tone: 'professional',
    });
    expect(result.user).toContain('professional');
  });
});

describe('parseMetaDescriptionResponse', () => {
  it('should strip surrounding double quotes', () => {
    const result = parseMetaDescriptionResponse('"Discover the best SEO tools for your website."');
    expect(result.description).toBe('Discover the best SEO tools for your website.');
  });

  it('should strip surrounding single quotes', () => {
    const result = parseMetaDescriptionResponse("'Great meta description here.'");
    expect(result.description).toBe('Great meta description here.');
  });

  it('should compute pixelWidth', () => {
    const result = parseMetaDescriptionResponse('A test meta description for SEO analysis.');
    expect(result.pixelWidth).toBeGreaterThan(0);
    expect(result.charCount).toBe('A test meta description for SEO analysis.'.length);
  });

  it('should validate the description and mark valid ones', () => {
    const goodDesc =
      'This is a perfectly good meta description that provides useful information about the page content and encourages users to click through.';
    const result = parseMetaDescriptionResponse(goodDesc);
    expect(result.isValid).toBe(true);
    expect(result.validationMessage).toBeUndefined();
  });

  it('should mark empty description as invalid', () => {
    const result = parseMetaDescriptionResponse('');
    expect(result.isValid).toBe(false);
    expect(result.validationMessage).toBeDefined();
  });
});
