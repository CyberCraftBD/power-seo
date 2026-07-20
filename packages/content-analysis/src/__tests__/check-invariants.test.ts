import { describe, it, expect } from 'vitest';
import * as contentAnalysis from '../index.js';
import { checkCorrectionPolicy } from '../checks/eeat-correction-policy.js';
import { checkContentAccuracy } from '../checks/eeat-content-accuracy.js';
import { checkExperienceDepth } from '../checks/eeat-experience-depth.js';
import type { AnalysisResult, ContentAnalysisInput } from '@power-seo/core';

// ============================================================================
// Fixtures
// ============================================================================

/** Build a rich ~1500-word HTML article with headings, images, links, and dates. */
function buildRichContent(): string {
  const paragraph = (topic: string, i: number): string =>
    `<p>When working on react seo for a production ${topic}, the first thing I tested was ` +
    `how the rendering pipeline affects crawlability and indexing over time. According to a ` +
    `study published in 2025, pages that ship meaningful server-rendered markup consistently ` +
    `outperform client-only rendering in organic visibility. In my experience, the difference ` +
    `becomes obvious after a few weeks of monitoring, because search engines allocate a limited ` +
    `crawl budget and structured pages simply make better use of it. Research shows that clear ` +
    `heading hierarchies, descriptive anchor text, and stable canonical URLs reduce duplicate ` +
    `content problems significantly. For example, in iteration ${i} of our migration we measured ` +
    `a steady improvement in impressions, and this resulted in more qualified traffic without ` +
    `any paid promotion. Consequently, the team decided to standardize the approach across every ` +
    `template. However, it is important to remember that no single technique guarantees rankings; ` +
    `instead, consistent technical hygiene combined with genuinely useful content is what moves ` +
    `the needle. Therefore, we documented the process step by step so that other developers could ` +
    `reproduce the setup, and we linked each section to primary sources for verification.</p>`;

  const sections: string[] = [];
  const topics = [
    'e-commerce platform',
    'documentation portal',
    'marketing site',
    'news publication',
    'developer blog',
    'multi-tenant SaaS dashboard',
  ];
  for (let i = 0; i < topics.length; i++) {
    sections.push(`<h2>Optimizing react seo for a ${topics[i]}</h2>`);
    sections.push(paragraph(topics[i]!, i + 1));
    sections.push(paragraph(`${topics[i]} at scale`, i + 1));
  }

  return [
    `<article>`,
    `<h1>The Complete Guide to React SEO in Modern Applications</h1>`,
    `<p><em>Published on January 15, 2026. Last updated on March 2, 2026.</em></p>`,
    `<p>Editor's note: this guide was reviewed and updated for accuracy in March 2026.</p>`,
    `<time datetime="2026-03-02">March 2, 2026</time>`,
    `<img src="/images/react-seo-hero.png" alt="Diagram of react seo rendering pipeline" />`,
    `<p>I've been using server-side rendering for react seo since 2021, and after 3 years of ` +
      `using it in production I can say the results were consistently positive. This article ` +
      `walks through what I found, what worked for me, and the exact configuration I implemented. ` +
      `Source: internal performance reports and public crawl data.</p>`,
    `<h2>Table of contents</h2>`,
    `<ul>`,
    `<li><a href="#rendering">Rendering strategies</a></li>`,
    `<li><a href="#metadata">Metadata management</a></li>`,
    `<li><a href="#structured-data">Structured data</a></li>`,
    `</ul>`,
    ...sections,
    `<h2>What is react seo?</h2>`,
    `<p>React seo is the practice of making React applications fully crawlable, indexable, and ` +
      `competitive in organic search. It combines server rendering, metadata management, ` +
      `structured data, and internal linking into one coherent strategy.</p>`,
    `<img src="/images/react-seo-results.png" alt="Chart showing organic traffic growth" />`,
    `<h2>Further reading</h2>`,
    `<p>See our <a href="/guides/nextjs-seo">internal guide on Next.js SEO</a> and the ` +
      `<a href="https://developers.google.com/search">official search documentation</a> for ` +
      `additional details. Studies show that teams who audit regularly catch regressions early.</p>`,
    `</article>`,
  ].join('\n');
}

/** Content that uses ONLY curly (typographic) apostrophes — no straight quotes. */
function buildCurlyQuoteContent(): string {
  const paragraph =
    `<p>Editor’s note: this article was updated for accuracy. I’ve been using this ` +
    `tool for three years and I’ve worked with dozens of teams who adopted it. In my ` +
    `experience, it’s the configuration details that matter most, and here’s how I ` +
    `approached them. You won’t believe how often teams skip the basics — don’t ` +
    `miss out on the fundamentals before it’s too late. What they don’t tell you is ` +
    `that consistency beats cleverness. Here’s what happened when I tested the setup: the ` +
    `results showed steady gains, and this resulted in measurable improvements across the site. ` +
    `I personally recommend documenting everything step by step so others can reproduce it.</p>`;
  return `<article><h1>A Practitioner’s Guide</h1>${paragraph}${paragraph}</article>`;
}

const richInput: ContentAnalysisInput = {
  title: 'The Complete Guide to React SEO in Modern Applications (2026)',
  metaDescription:
    'Learn react seo from real production experience: rendering strategies, metadata, ' +
    'structured data, and internal linking, with measured results and sources.',
  content: buildRichContent(),
  focusKeyphrase: 'react seo',
  secondaryKeyphrases: ['server-side rendering', 'structured data'],
  slug: 'react-seo-guide',
  canonicalUrl: 'https://example.com/guides/react-seo-guide',
  siteUrl: 'https://example.com',
  internalLinks: ['/guides/nextjs-seo'],
  externalLinks: ['https://developers.google.com/search'],
  images: [
    { src: '/images/react-seo-hero.png', alt: 'Diagram of react seo rendering pipeline' },
    { src: '/images/react-seo-results.png', alt: 'Chart showing organic traffic growth' },
  ],
  author: { name: 'Jane Developer', url: 'https://example.com/authors/jane' },
  publishDate: '2026-01-15',
  modifiedDate: '2026-03-02',
};

const sparseInput: ContentAnalysisInput = {
  content: '',
};

const curlyQuoteInput: ContentAnalysisInput = {
  title: 'A Practitioner’s Guide',
  content: buildCurlyQuoteContent(),
  focusKeyphrase: 'practitioner’s guide',
};

const fixtures: Array<{ name: string; input: ContentAnalysisInput }> = [
  { name: 'rich article', input: richInput },
  { name: 'sparse/empty', input: sparseInput },
  { name: 'curly typographic quotes', input: curlyQuoteInput },
];

const VALID_STATUSES = ['good', 'ok', 'poor', 'na'];

// ============================================================================
// Universal invariants — every exported check* function, every fixture
// ============================================================================

// Enumerate every exported check function from the package index.
const checkEntries = Object.entries(contentAnalysis).filter(
  (entry): entry is [string, (input: ContentAnalysisInput) => AnalysisResult | AnalysisResult[]] =>
    entry[0].startsWith('check') && typeof entry[1] === 'function',
);

describe('universal check invariants', () => {
  it('finds the exported check functions', () => {
    // Sanity guard: if the index ever stops exporting checks, fail loudly.
    expect(checkEntries.length).toBeGreaterThanOrEqual(60);
  });

  for (const { name: fixtureName, input } of fixtures) {
    describe(`fixture: ${fixtureName}`, () => {
      for (const [checkName, checkFn] of checkEntries) {
        it(`${checkName} returns well-formed results`, () => {
          let raw: AnalysisResult | AnalysisResult[];
          try {
            raw = checkFn(input);
          } catch (err) {
            throw new Error(
              `${checkName} threw on fixture "${fixtureName}": ${(err as Error).message}`,
            );
          }

          const results = Array.isArray(raw) ? raw : [raw];
          expect(results.length).toBeGreaterThan(0);

          for (const result of results) {
            const label = `${checkName} -> ${result?.id ?? '(no id)'}`;

            expect(result, label).toBeTypeOf('object');
            expect(typeof result.id, `${label}: id must be a string`).toBe('string');
            expect(result.id.length, `${label}: id must be non-empty`).toBeGreaterThan(0);
            expect(typeof result.description, `${label}: description must be a string`).toBe(
              'string',
            );
            expect(
              result.description.length,
              `${label}: description must be non-empty`,
            ).toBeGreaterThan(0);
            expect(
              VALID_STATUSES,
              `${label}: status "${result.status}" must be a valid AnalysisStatus`,
            ).toContain(result.status);
            expect(typeof result.score, `${label}: score must be a number`).toBe('number');
            expect(typeof result.maxScore, `${label}: maxScore must be a number`).toBe('number');
            expect(result.score, `${label}: score must be >= 0`).toBeGreaterThanOrEqual(0);
            expect(result.score, `${label}: score must be <= maxScore`).toBeLessThanOrEqual(
              result.maxScore,
            );
            expect(result.maxScore, `${label}: maxScore must be > 0`).toBeGreaterThan(0);
          }
        });
      }
    });
  }
});

// ============================================================================
// Smart-quote regression tests — curly apostrophes (’) must be recognized
// ============================================================================

describe('smart-quote (curly apostrophe) regression', () => {
  // Padding to clear the 50-word minimum thresholds without adding any
  // markers or misleading phrases of its own.
  const neutralPadding =
    '<p>The remaining paragraphs describe the general configuration of the project in plain ' +
    'terms. Each section of the site uses the same layout, the same navigation, and the same ' +
    'template structure, which keeps maintenance simple for the whole team across every page ' +
    'and every release cycle throughout the year.</p>';

  it('checkCorrectionPolicy recognizes "Editor’s note:" with a curly apostrophe', () => {
    // Provide publish/modified dates as a baseline so the content indicator is
    // what tips the result over the next status threshold.
    const dates = { publishDate: '2026-01-15', modifiedDate: '2026-03-02' };
    const withNote = checkCorrectionPolicy({
      ...dates,
      content: `<p>Editor’s note: we corrected a figure in this article.</p>${neutralPadding}`,
    });
    const withoutNote = checkCorrectionPolicy({
      ...dates,
      content: `<p>This article covers the basics of the topic.</p>${neutralPadding}`,
    });

    // The curly-apostrophe editor's note must count as an update/correction indicator.
    expect(withNote.description).toContain('update/correction indicator');
    expect(withoutNote.description).not.toContain('update/correction indicator');
    // And it must improve the outcome vs. identical content without the note.
    expect(withNote.status).toBe('good');
    expect(withoutNote.status).toBe('ok');
    expect(withNote.score).toBeGreaterThan(withoutNote.score);
  });

  it('checkContentAccuracy flags clickbait phrased with curly apostrophes', () => {
    const result = checkContentAccuracy({
      content:
        `<p>You won’t believe how well this works — don’t miss out on this ` +
        `limited time offer, act now before it’s gone forever.</p>${neutralPadding}${neutralPadding}`,
    });

    // Multiple misleading phrases with no evidence backing must be flagged.
    expect(result.status).toBe('poor');
    expect(result.description).toContain('accuracy issues detected');
    expect(result.description.toLowerCase()).toContain('clickbait');
  });

  it('checkExperienceDepth detects first-person experience with curly apostrophes', () => {
    const result = checkExperienceDepth({
      content:
        `<p>I’ve been using this tool for three years. I’ve worked with many teams, ` +
        `and I’ve spent countless hours refining the setup. In my experience the defaults ` +
        `are rarely enough, and here’s how I approached tuning them for production use.</p>` +
        neutralPadding,
    });

    expect(result.status).not.toBe('poor');
    expect(['good', 'ok']).toContain(result.status);
    expect(result.score).toBeGreaterThan(0);
    // Description should reference detected markers, not the "no signals" message.
    expect(result.description).not.toContain('No first-hand experience signals');
  });
});
