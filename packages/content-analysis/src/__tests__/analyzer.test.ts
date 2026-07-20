import { describe, it, expect } from 'vitest';
import { analyzeContent } from '../analyzer.js';
import type { ContentAnalysisInput } from '@power-seo/core';

describe('analyzeContent', () => {
  it('returns a complete analysis output', () => {
    const input: ContentAnalysisInput = {
      title: 'React SEO Best Practices for Developers',
      metaDescription:
        'Learn the best practices for React SEO. This comprehensive guide covers everything you need to know about optimizing React apps.',
      content:
        '<h1>React SEO Best Practices</h1><h2>Why React SEO matters</h2><p>' +
        Array(100).fill('React SEO is essential for modern web applications.').join(' ') +
        '</p>',
      focusKeyphrase: 'react seo',
      slug: 'react-seo-best-practices',
      internalLinks: ['/blog', '/about'],
      externalLinks: ['https://reactjs.org'],
      images: [{ src: 'hero.jpg', alt: 'React SEO overview' }],
    };

    const output = analyzeContent(input);

    expect(output.score).toBeGreaterThan(0);
    expect(output.maxScore).toBeGreaterThan(0);
    expect(output.results).toBeInstanceOf(Array);
    expect(output.results.length).toBeGreaterThan(0);
    expect(output.recommendations).toBeInstanceOf(Array);

    // Every result should have required fields
    for (const result of output.results) {
      expect(result.id).toBeTruthy();
      expect(result.title).toBeTruthy();
      expect(result.description).toBeTruthy();
      expect(['good', 'ok', 'poor', 'na']).toContain(result.status);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.maxScore).toBeGreaterThan(0);
    }
  });

  it('works with minimal input', () => {
    const output = analyzeContent({ content: '' });

    expect(output.score).toBeGreaterThanOrEqual(0);
    expect(output.maxScore).toBeGreaterThan(0);
    expect(output.results.length).toBeGreaterThan(0);
  });

  it('respects disabledChecks config', () => {
    const input: ContentAnalysisInput = {
      title: 'Test Title',
      content: '<p>Some content.</p>',
    };

    const withAll = analyzeContent(input);
    const withDisabled = analyzeContent(input, {
      disabledChecks: ['title-presence', 'word-count'],
    });

    expect(withDisabled.results.length).toBeLessThan(withAll.results.length);
    expect(withDisabled.results.find((r) => r.id === 'title-presence')).toBeUndefined();
    expect(withDisabled.results.find((r) => r.id === 'word-count')).toBeUndefined();
  });

  it('generates recommendations from poor and ok results', () => {
    const output = analyzeContent({ content: 'Short.' });

    // Should have at least some recommendations (no title, no meta desc, thin content, etc.)
    expect(output.recommendations.length).toBeGreaterThan(0);
  });

  it('never scores above maxScore, and a "good" verdict earns full marks', () => {
    // Regression guard for the v1.0.15 maxScore recalibration that raised many
    // checks' maxScore but left their good-path score behind, making a perfect
    // page unable to ever reach 100%. A "good" result must equal its maxScore.
    const author = {
      name: 'Dr. Jane Smith',
      jobTitle: 'Senior Software Engineer',
      bio: 'Jane is a senior software engineer with over a decade of experience building and optimizing large-scale React applications for enterprise clients worldwide.',
      image: 'https://example.com/jane.jpg',
      url: 'https://example.com/authors/jane',
      worksFor: { name: 'Acme Corp', url: 'https://acme.example.com' },
      education: [{ name: 'MIT', degree: 'BSc Computer Science' }],
      credentials: [{ name: 'AWS Certified Solutions Architect' }],
      knowsAbout: ['react', 'seo', 'web development'],
      socialProfiles: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/jane' },
        { platform: 'twitter', url: 'https://twitter.com/jane' },
        { platform: 'github', url: 'https://github.com/jane' },
      ],
      yearsOfExperience: 12,
      publications: [{ title: 'Scaling React', url: 'https://example.com/pub' }],
      awards: ['Best Engineering Blog 2025'],
    };

    const richInput: ContentAnalysisInput = {
      title: 'React SEO: The Complete Guide for Developers in 2026',
      metaDescription:
        'A complete, hands-on React SEO guide. Learn how to optimize React apps for search with practical, tested techniques from real production experience.',
      content:
        '<h1>React SEO Guide</h1>' +
        '<h2>What is React SEO?</h2><p>' +
        Array(12)
          .fill(
            'React SEO refers to optimizing React applications so that search engines and AI answer engines can crawl, index, and cite them effectively.',
          )
          .join(' ') +
        '</p><h2>How do I improve React SEO?</h2><p>' +
        Array(12)
          .fill(
            'In my experience, I tested several rendering strategies over the past 3 years and measured Core Web Vitals improvements on Next.js, Remix, and Docker deployments.',
          )
          .join(' ') +
        '</p><h3>References</h3><p>According to research, per a study at <a href="https://stanford.edu/study">Stanford</a> and <a href="https://data.gov/report">data.gov</a>, structured content wins.</p>' +
        Array(30)
          .fill(
            '<p>Google, Microsoft, and TypeScript power modern development in the United States since 2019.</p>',
          )
          .join(''),
      focusKeyphrase: 'react seo',
      slug: 'react-seo-guide',
      canonicalUrl: 'https://example.com/react-seo-guide',
      siteUrl: 'https://example.com',
      internalLinks: ['/blog', '/about', '/contact'],
      externalLinks: [
        'https://stanford.edu/study',
        'https://data.gov/report',
        'https://reactjs.org',
      ],
      images: [
        { src: 'hero.jpg', alt: 'React SEO overview chart' },
        { src: 'chart.png', alt: 'Core Web Vitals before and after comparison' },
      ],
      author,
      publishDate: '2026-06-01',
      modifiedDate: '2026-07-01',
      contentCategory: 'web development',
      privacyPolicyUrl: 'https://example.com/privacy',
      correctionPolicyUrl: 'https://example.com/corrections',
      editorialReviewer: {
        name: 'John Editor',
        credentials: 'PhD',
        url: 'https://example.com/john',
      },
    };

    const inputs: ContentAnalysisInput[] = [
      richInput,
      { content: '' },
      { content: 'Short.', title: 'X' },
    ];

    for (const input of inputs) {
      const output = analyzeContent(input);
      for (const r of output.results) {
        expect(r.score, `${r.id}: score must not exceed maxScore`).toBeLessThanOrEqual(r.maxScore);
        if (r.status === 'good') {
          expect(r.score, `${r.id}: a "good" verdict must earn full marks`).toBe(r.maxScore);
        }
      }
    }
  });

  it('calculates score as sum of applicable (non-na) results', () => {
    const output = analyzeContent({
      content: '<p>Test content.</p>',
      title: 'Test Title for This Page',
    });

    // na results should be excluded from score totals
    const applicable = output.results.filter((r) => r.status !== 'na');
    const expectedScore = applicable.reduce((sum, r) => sum + r.score, 0);
    const expectedMaxScore = applicable.reduce((sum, r) => sum + r.maxScore, 0);

    expect(output.score).toBe(expectedScore);
    expect(output.maxScore).toBe(expectedMaxScore);

    // Verify na results exist but don't contribute to scores
    const naResults = output.results.filter((r) => r.status === 'na');
    expect(naResults.length).toBeGreaterThan(0);
    for (const na of naResults) {
      expect(na.score).toBe(0);
    }
  });
});
