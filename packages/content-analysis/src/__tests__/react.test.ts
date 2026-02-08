import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createElement } from 'react';
import { ScorePanel, CheckList, ContentAnalyzer } from '../react.js';
import type { AnalysisResult } from '@ccbd-seo/core';

describe('ScorePanel', () => {
  it('renders the score percentage', () => {
    const { container } = render(createElement(ScorePanel, { score: 70, maxScore: 100 }));
    expect(container.textContent).toContain('70%');
  });

  it('renders the label and points', () => {
    const { container } = render(createElement(ScorePanel, { score: 35, maxScore: 100 }));
    expect(container.textContent).toContain('35%');
    expect(container.textContent).toContain('35/100');
  });

  it('handles zero maxScore', () => {
    const { container } = render(createElement(ScorePanel, { score: 0, maxScore: 0 }));
    expect(container.textContent).toContain('0%');
  });

  it('shows Good label for high scores', () => {
    const { container } = render(createElement(ScorePanel, { score: 80, maxScore: 100 }));
    expect(container.textContent).toContain('Good');
  });

  it('shows Needs improvement label for low scores', () => {
    const { container } = render(createElement(ScorePanel, { score: 20, maxScore: 100 }));
    expect(container.textContent).toContain('Needs improvement');
  });
});

describe('CheckList', () => {
  const mockResults: AnalysisResult[] = [
    {
      id: 'title-presence',
      title: 'SEO title',
      description: 'Title is good.',
      status: 'good',
      score: 5,
      maxScore: 5,
    },
    {
      id: 'word-count',
      title: 'Word count',
      description: 'Content is too short.',
      status: 'poor',
      score: 1,
      maxScore: 5,
    },
  ];

  it('renders all results', () => {
    const { container } = render(createElement(CheckList, { results: mockResults }));
    expect(container.textContent).toContain('SEO title');
    expect(container.textContent).toContain('Word count');
  });

  it('renders descriptions', () => {
    const { container } = render(createElement(CheckList, { results: mockResults }));
    expect(container.textContent).toContain('Title is good.');
    expect(container.textContent).toContain('Content is too short.');
  });

  it('renders empty list for no results', () => {
    const { container } = render(createElement(CheckList, { results: [] }));
    const list = container.querySelector('ul');
    expect(list).toBeTruthy();
    expect(list!.children.length).toBe(0);
  });
});

describe('ContentAnalyzer', () => {
  it('renders score panel and check list', () => {
    const { container } = render(
      createElement(ContentAnalyzer, {
        input: {
          title: 'Good SEO Title for a Blog Post',
          metaDescription:
            'A well-written meta description that provides a clear summary of the page content and is long enough for search engines.',
          content: '<h1>Title</h1><p>' + Array(200).fill('Content word.').join(' ') + '</p>',
        },
      }),
    );

    // Should contain score percentage
    expect(container.textContent).toMatch(/\d+%/);
    // Should contain check titles
    expect(container.textContent).toContain('SEO title');
  });

  it('passes config to analyzer', () => {
    const { container } = render(
      createElement(ContentAnalyzer, {
        input: {
          title: 'Test',
          content: '<p>Content.</p>',
        },
        config: {
          disabledChecks: ['title-presence'],
        },
      }),
    );

    // The component should still render
    expect(container.textContent).toMatch(/\d+%/);
  });
});
