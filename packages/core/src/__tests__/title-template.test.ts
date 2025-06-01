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
