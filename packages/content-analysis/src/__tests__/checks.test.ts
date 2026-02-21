import { describe, it, expect } from 'vitest';
import { checkTitle } from '../checks/title.js';
import { checkMetaDescription } from '../checks/meta-description.js';
import { checkKeyphraseUsage } from '../checks/keyphrase-usage.js';
import { checkHeadings } from '../checks/headings.js';
import { checkWordCount } from '../checks/word-count.js';
import { checkImages } from '../checks/images.js';
import { checkLinks } from '../checks/links.js';
import type { ContentAnalysisInput } from '@power-seo/core';

function makeInput(overrides: Partial<ContentAnalysisInput> = {}): ContentAnalysisInput {
  return {
    content: '<p>Default content for testing.</p>',
    ...overrides,
  };
}

// ============================================================================
// Title checks
// ============================================================================

describe('checkTitle', () => {
  it('returns poor when title is missing', () => {
    const results = checkTitle(makeInput());
    expect(results).toHaveLength(1);
    expect(results[0]!.id).toBe('title-presence');
    expect(results[0]!.status).toBe('poor');
  });

  it('returns good for a valid title', () => {
    const results = checkTitle(makeInput({ title: 'A Good SEO Title for Testing Purposes' }));
    const presence = results.find((r) => r.id === 'title-presence');
    expect(presence).toBeDefined();
    expect(presence!.status).toBe('good');
  });

  it('returns ok when title is too short', () => {
    const results = checkTitle(makeInput({ title: 'Short' }));
    const presence = results.find((r) => r.id === 'title-presence');
    expect(presence!.status).toBe('ok');
  });

  it('checks keyphrase in title when provided', () => {
    const results = checkTitle(
      makeInput({
        title: 'Learn React SEO for Your Application',
        focusKeyphrase: 'react seo',
      }),
    );
    const kpCheck = results.find((r) => r.id === 'title-keyphrase');
    expect(kpCheck).toBeDefined();
    expect(kpCheck!.status).toBe('good');
  });

  it('returns ok when keyphrase not in title', () => {
    const results = checkTitle(
      makeInput({
        title: 'A Great Blog Post About Web Development',
        focusKeyphrase: 'react seo',
      }),
    );
    const kpCheck = results.find((r) => r.id === 'title-keyphrase');
    expect(kpCheck!.status).toBe('ok');
  });

  it('does not add keyphrase check when no keyphrase', () => {
    const results = checkTitle(makeInput({ title: 'A Good Title for Testing' }));
    const kpCheck = results.find((r) => r.id === 'title-keyphrase');
    expect(kpCheck).toBeUndefined();
  });
});

// ============================================================================
// Meta description checks
// ============================================================================

describe('checkMetaDescription', () => {
  it('returns poor when meta description is missing', () => {
    const results = checkMetaDescription(makeInput());
    expect(results).toHaveLength(1);
    expect(results[0]!.id).toBe('meta-description-presence');
    expect(results[0]!.status).toBe('poor');
  });

  it('returns good for a valid meta description', () => {
    const desc =
      'This is a well-crafted meta description that provides a clear summary of the page content and is within the recommended length.';
    const results = checkMetaDescription(makeInput({ metaDescription: desc }));
    const presence = results.find((r) => r.id === 'meta-description-presence');
    expect(presence!.status).toBe('good');
  });

  it('returns ok for a too-short meta description', () => {
    const results = checkMetaDescription(makeInput({ metaDescription: 'Too short.' }));
    const presence = results.find((r) => r.id === 'meta-description-presence');
    expect(presence!.status).toBe('ok');
  });

  it('checks keyphrase in meta description', () => {
    const desc =
      'Learn everything about react seo in this comprehensive guide. We cover best practices and more topics.';
    const results = checkMetaDescription(
      makeInput({ metaDescription: desc, focusKeyphrase: 'react seo' }),
    );
    const kpCheck = results.find((r) => r.id === 'meta-description-keyphrase');
    expect(kpCheck).toBeDefined();
    expect(kpCheck!.status).toBe('good');
  });

  it('returns ok when keyphrase not in meta description', () => {
    const desc =
      'A comprehensive guide about web development best practices for modern applications and frameworks.';
    const results = checkMetaDescription(
      makeInput({ metaDescription: desc, focusKeyphrase: 'react seo' }),
    );
    const kpCheck = results.find((r) => r.id === 'meta-description-keyphrase');
    expect(kpCheck!.status).toBe('ok');
  });
});

// ============================================================================
// Keyphrase usage checks
// ============================================================================

describe('checkKeyphraseUsage', () => {
  it('returns good with message when no keyphrase set', () => {
    const results = checkKeyphraseUsage(makeInput());
    expect(results).toHaveLength(1);
    expect(results[0]!.id).toBe('keyphrase-density');
    expect(results[0]!.status).toBe('good');
  });

  it('checks density and distribution with keyphrase', () => {
    const content = Array(100).fill('This is a test sentence about react seo for web.').join(' ');
    const results = checkKeyphraseUsage(
      makeInput({
        content: `<h1>React SEO Guide</h1><p>${content}</p>`,
        focusKeyphrase: 'react seo',
        slug: 'react-seo-guide',
        images: [{ src: 'img.jpg', alt: 'React SEO diagram' }],
      }),
    );

    const density = results.find((r) => r.id === 'keyphrase-density');
    const distribution = results.find((r) => r.id === 'keyphrase-distribution');

    expect(density).toBeDefined();
    expect(distribution).toBeDefined();
  });

  it('reports poor density when keyphrase is barely used', () => {
    const content = Array(200).fill('This is a generic sentence about web development.').join(' ');
    const results = checkKeyphraseUsage(
      makeInput({
        content: `<p>React SEO is important.</p><p>${content}</p>`,
        focusKeyphrase: 'react seo',
      }),
    );

    const density = results.find((r) => r.id === 'keyphrase-density');
    expect(density).toBeDefined();
    expect(density!.status).toBe('poor');
  });
});

// ============================================================================
// Headings checks
// ============================================================================

describe('checkHeadings', () => {
  it('returns poor when no H1 found', () => {
    const results = checkHeadings(makeInput({ content: '<p>No headings here.</p>' }));
    const structure = results.find((r) => r.id === 'heading-structure');
    expect(structure!.status).toBe('poor');
  });

  it('returns ok when multiple H1s found', () => {
    const results = checkHeadings(makeInput({ content: '<h1>First</h1><h1>Second</h1>' }));
    const structure = results.find((r) => r.id === 'heading-structure');
    expect(structure!.status).toBe('ok');
  });

  it('returns good for proper heading structure', () => {
    const results = checkHeadings(
      makeInput({
        content: '<h1>Title</h1><h2>Section</h2><h3>Subsection</h3>',
      }),
    );
    const structure = results.find((r) => r.id === 'heading-structure');
    expect(structure!.status).toBe('good');
  });

  it('returns ok when heading levels are skipped', () => {
    const results = checkHeadings(
      makeInput({
        content: '<h1>Title</h1><h4>Skipped to H4</h4>',
      }),
    );
    const structure = results.find((r) => r.id === 'heading-structure');
    expect(structure!.status).toBe('ok');
  });

  it('checks keyphrase in subheadings', () => {
    const results = checkHeadings(
      makeInput({
        content: '<h1>Title</h1><h2>Why React SEO Matters</h2>',
        focusKeyphrase: 'react seo',
      }),
    );
    const kpCheck = results.find((r) => r.id === 'heading-keyphrase');
    expect(kpCheck).toBeDefined();
    expect(kpCheck!.status).toBe('good');
  });

  it('returns ok when keyphrase not in any subheading', () => {
    const results = checkHeadings(
      makeInput({
        content: '<h1>Title</h1><h2>Introduction</h2>',
        focusKeyphrase: 'react seo',
      }),
    );
    const kpCheck = results.find((r) => r.id === 'heading-keyphrase');
    expect(kpCheck!.status).toBe('ok');
  });
});

// ============================================================================
// Word count check
// ============================================================================

describe('checkWordCount', () => {
  it('returns poor for thin content', () => {
    const result = checkWordCount(makeInput({ content: 'Just a few words.' }));
    expect(result.status).toBe('poor');
    expect(result.id).toBe('word-count');
  });

  it('returns ok for medium content', () => {
    const words = Array(500).fill('word').join(' ');
    const result = checkWordCount(makeInput({ content: words }));
    expect(result.status).toBe('ok');
  });

  it('returns good for substantial content', () => {
    const words = Array(1000).fill('word').join(' ');
    const result = checkWordCount(makeInput({ content: words }));
    expect(result.status).toBe('good');
  });
});

// ============================================================================
// Images checks
// ============================================================================

describe('checkImages', () => {
  it('returns ok when no images', () => {
    const results = checkImages(makeInput());
    expect(results).toHaveLength(1);
    expect(results[0]!.id).toBe('image-alt');
    expect(results[0]!.status).toBe('ok');
  });

  it('returns good when all images have alt text', () => {
    const results = checkImages(
      makeInput({
        images: [
          { src: 'a.jpg', alt: 'Image A' },
          { src: 'b.jpg', alt: 'Image B' },
        ],
      }),
    );
    const altCheck = results.find((r) => r.id === 'image-alt');
    expect(altCheck!.status).toBe('good');
  });

  it('returns poor when no images have alt text', () => {
    const results = checkImages(
      makeInput({
        images: [{ src: 'a.jpg' }, { src: 'b.jpg', alt: '' }],
      }),
    );
    const altCheck = results.find((r) => r.id === 'image-alt');
    expect(altCheck!.status).toBe('poor');
  });

  it('returns ok when some images missing alt text', () => {
    const results = checkImages(
      makeInput({
        images: [{ src: 'a.jpg', alt: 'Good alt' }, { src: 'b.jpg' }],
      }),
    );
    const altCheck = results.find((r) => r.id === 'image-alt');
    expect(altCheck!.status).toBe('ok');
  });

  it('checks keyphrase in image alt', () => {
    const results = checkImages(
      makeInput({
        images: [{ src: 'a.jpg', alt: 'React SEO diagram' }],
        focusKeyphrase: 'react seo',
      }),
    );
    const kpCheck = results.find((r) => r.id === 'image-keyphrase');
    expect(kpCheck).toBeDefined();
    expect(kpCheck!.status).toBe('good');
  });

  it('returns ok when keyphrase not in any alt', () => {
    const results = checkImages(
      makeInput({
        images: [{ src: 'a.jpg', alt: 'A nice picture' }],
        focusKeyphrase: 'react seo',
      }),
    );
    const kpCheck = results.find((r) => r.id === 'image-keyphrase');
    expect(kpCheck!.status).toBe('ok');
  });
});

// ============================================================================
// Links checks
// ============================================================================

describe('checkLinks', () => {
  it('returns ok for no internal and external links', () => {
    const results = checkLinks(makeInput());
    expect(results).toHaveLength(2);
    expect(results.find((r) => r.id === 'internal-links')!.status).toBe('ok');
    expect(results.find((r) => r.id === 'external-links')!.status).toBe('ok');
  });

  it('returns good when both link types present', () => {
    const results = checkLinks(
      makeInput({
        internalLinks: ['/about', '/contact'],
        externalLinks: ['https://example.com'],
      }),
    );
    expect(results.find((r) => r.id === 'internal-links')!.status).toBe('good');
    expect(results.find((r) => r.id === 'external-links')!.status).toBe('good');
  });

  it('returns ok for missing internal links only', () => {
    const results = checkLinks(
      makeInput({
        externalLinks: ['https://example.com'],
      }),
    );
    expect(results.find((r) => r.id === 'internal-links')!.status).toBe('ok');
    expect(results.find((r) => r.id === 'external-links')!.status).toBe('good');
  });
});
