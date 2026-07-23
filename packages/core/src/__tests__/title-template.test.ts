import { describe, it, expect } from 'vitest';
import { applyTitleTemplate, createTitleTemplate } from '../title-template.js';

describe('applyTitleTemplate', () => {
  it('should replace %title% and %siteName%', () => {
    const result = applyTitleTemplate('%title% | %siteName%', {
      title: 'My Page',
      siteName: 'My Site',
    });
    expect(result).toBe('My Page | My Site');
  });

  it('should handle missing variables gracefully', () => {
    const result = applyTitleTemplate('%title% | %siteName%', {
      title: 'My Page',
    });
    expect(result).toBe('My Page');
  });

  it('should return title when template is empty', () => {
    const result = applyTitleTemplate('', { title: 'My Page' });
    expect(result).toBe('My Page');
  });

  it('should handle page numbers', () => {
    const result = applyTitleTemplate('%title% - Page %page% | %siteName%', {
      title: 'Blog',
      page: 2,
      siteName: 'My Site',
    });
    expect(result).toBe('Blog - Page 2 | My Site');
  });

  it('should handle custom separator', () => {
    const result = applyTitleTemplate('%title% %separator% %siteName%', {
      title: 'About',
      separator: '—',
      siteName: 'My Site',
    });
    expect(result).toBe('About — My Site');
  });

  it('should preserve legitimate leading/trailing separators in resolved values (#135)', () => {
    // A title that legitimately starts with an em-dash must keep it.
    const result = applyTitleTemplate('%title% | %siteName%', {
      title: '—Rock Band',
      siteName: 'My Site',
    });
    expect(result).toBe('—Rock Band | My Site');
  });

  it('should preserve a trailing separator character in a resolved value (#135)', () => {
    const result = applyTitleTemplate('%title%', { title: 'Rock Band—' });
    expect(result).toBe('Rock Band—');
  });

  it('should still drop the separator when a placeholder resolves to empty (#135)', () => {
    const result = applyTitleTemplate('%title% | %siteName%', { title: 'About' });
    expect(result).toBe('About');
  });

  it('should keep leading/trailing dashes that belong to the title value (#167)', () => {
    const result = applyTitleTemplate('%title%', { title: '-9 to 5- The Guide-' });
    expect(result).toBe('-9 to 5- The Guide-');
  });
});

describe('createTitleTemplate', () => {
  it('should create a reusable title function', () => {
    const makeTitle = createTitleTemplate({
      siteName: 'My Site',
      separator: '|',
    });

    expect(makeTitle('Home')).toBe('Home | My Site');
    expect(makeTitle('About')).toBe('About | My Site');
  });

  it('should allow overriding defaults', () => {
    const makeTitle = createTitleTemplate({
      siteName: 'My Site',
      separator: '|',
    });

    expect(makeTitle('Home', { siteName: 'Other Site' })).toBe('Home | Other Site');
  });
});
