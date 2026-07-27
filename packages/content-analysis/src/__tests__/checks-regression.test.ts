import { describe, it, expect } from 'vitest';
import { detectIntent } from '../checks/intent-utils.js';
import { checkIntentMultiDetection } from '../checks/intent-multi-detection.js';
import { checkIntentRelatedCoverage } from '../checks/intent-related-coverage.js';
import { checkIntentDepthMatch } from '../checks/intent-depth-match.js';
import { checkIntentPaaCoverage } from '../checks/intent-paa-coverage.js';
import { checkAeoFaqSection } from '../checks/aeo-faq-section.js';
import { checkAeoConciseAnswers } from '../checks/aeo-concise-answers.js';
import { checkAeoTldrSummary } from '../checks/aeo-tldr-summary.js';
import { checkAeoFactDensity } from '../checks/aeo-fact-density.js';
import { checkTableOfContents } from '../checks/table-of-contents.js';
import { checkSecondaryKeyphrases } from '../checks/secondary-keyphrases.js';
import { checkLinks } from '../checks/links.js';
import { checkNofollowLinks } from '../checks/nofollow-links.js';
import { checkCompetingLinks } from '../checks/competing-links.js';
import { checkSingleH1 } from '../checks/single-h1.js';
import { checkSubheadingDistribution } from '../checks/subheading-distribution.js';
import { checkKeyphraseMarkup } from '../checks/keyphrase-markup.js';
import { checkKeyphraseSlug } from '../checks/keyphrase-slug.js';
import { checkKeyphraseIntroduction } from '../checks/keyphrase-introduction.js';
import type { ContentAnalysisInput } from '@power-seo/core';

function makeInput(overrides: Partial<ContentAnalysisInput> = {}): ContentAnalysisInput {
  return {
    content: '<p>Default content for testing.</p>',
    ...overrides,
  };
}

/** N filler words with no digits, facts, or intent modifiers. */
function words(n: number): string {
  return Array(n).fill('lorem').join(' ');
}

// ============================================================================
// #149 — bare keyphrases must not be classified navigational
// ============================================================================

describe('detectIntent bare keyphrase baseline (#149)', () => {
  it('classifies a bare 2-word keyphrase as informational with full confidence', () => {
    const result = detectIntent('react hooks');
    expect(result.primary).toBe('informational');
    expect(result.confidence).toBe(1);
  });

  it('does not emit a navigational signal for bare keyphrases', () => {
    const result = detectIntent('react hooks');
    expect(result.signals.find((s) => s.type === 'navigational')).toBeUndefined();
  });

  it('still detects navigational intent from real navigational modifiers', () => {
    expect(detectIntent('github login').primary).toBe('navigational');
  });

  it('checkIntentMultiDetection reports no competing intents for a bare keyphrase (#167 item 3)', () => {
    const result = checkIntentMultiDetection(makeInput({ focusKeyphrase: 'react hooks' }));
    expect(result.status).toBe('good');
    expect(result.description).toContain('Single clear intent');
    expect(result.description).not.toContain('Competing intents');
  });
});

// ============================================================================
// #163 item 4 — "in <word>" must not force the local sub-type
// ============================================================================

describe('inferSubType local pattern (#163 item 4)', () => {
  it('does not classify keyphrases containing "in" as local', () => {
    expect(detectIntent('content marketing trends in healthcare').subType).not.toBe('local');
  });

  it('still classifies genuine local keyphrases as local', () => {
    expect(detectIntent('coffee shops near me').subType).toBe('local');
  });
});

// ============================================================================
// #167 item 2 — related coverage: new mappings + na for unknown shapes
// ============================================================================

describe('checkIntentRelatedCoverage (#167 item 2)', () => {
  it('matches the checklist mapping and scores the content', () => {
    const result = checkIntentRelatedCoverage(
      makeInput({
        focusKeyphrase: 'React SEO checklist',
        content:
          '<p>Here is how to apply each item. Avoid common mistakes such as missing alt text. ' +
          'Use these tools and templates to speed things up.</p>',
      }),
    );
    expect(result.status).toBe('good');
    expect(result.description).toContain('checklist / list');
  });

  it('recognizes tips, examples, and tutorial/guide keyphrase shapes as scorable', () => {
    for (const keyphrase of ['seo tips', 'resume examples', 'python tutorial', 'hiking guide']) {
      const result = checkIntentRelatedCoverage(
        makeInput({ focusKeyphrase: keyphrase, content: '<p>Plain unrelated text.</p>' }),
      );
      expect(result.status, keyphrase).not.toBe('na');
    }
  });

  it('returns na (not poor 0/5) for unknown keyphrase shapes', () => {
    const result = checkIntentRelatedCoverage(
      makeInput({ focusKeyphrase: 'quantum flux capacitor' }),
    );
    expect(result.status).toBe('na');
    expect(result.score).toBe(0);
  });
});

// ============================================================================
// #155 — question detection and answer location
// ============================================================================

describe('question heading detection (#155)', () => {
  const declarativeContent =
    '<h2>5 Tools That Will Save You Time</h2>' +
    '<h2>Reasons This Is Important</h2>' +
    '<h2>Mistakes You Can Avoid</h2>' +
    `<p>${words(210)}</p>`;

  it('aeo-faq-section reports 0 pairs (poor) for declarative marketing headings', () => {
    const result = checkAeoFaqSection(makeInput({ content: declarativeContent }));
    expect(result.status).toBe('poor');
    expect(result.score).toBe(0);
  });

  it('aeo-concise-answers returns na/0 when no question headings exist', () => {
    const result = checkAeoConciseAnswers(makeInput({ content: declarativeContent }));
    expect(result.status).toBe('na');
    expect(result.score).toBe(0);
  });

  it('intent-paa-coverage counts 0 question headings for declarative headings', () => {
    const result = checkIntentPaaCoverage(makeInput({ content: declarativeContent }));
    expect(result.status).toBe('poor');
    expect(result.score).toBe(0);
    expect(result.description).toContain('None of the 3');
  });

  it('still counts a genuine FAQ heading ending in "?"', () => {
    const content =
      `<h2>Guide Introduction</h2><p>${words(150)}</p>` +
      `<h3>What is React hydration?</h3><p>${words(50)}</p>`;

    const faq = checkAeoFaqSection(makeInput({ content }));
    expect(faq.status).toBe('ok');
    expect(faq.description).toContain('1 Q&A pair');

    const concise = checkAeoConciseAnswers(makeInput({ content }));
    expect(concise.status).toBe('good');

    const paa = checkIntentPaaCoverage(makeInput({ content }));
    expect(paa.description).toContain('Only 1 question-phrased heading');
  });

  it('counts a heading that starts with an interrogative word without "?"', () => {
    const content = `<h2>How to optimize images</h2><h2>Setup Instructions</h2><p>${words(210)}</p>`;
    const paa = checkIntentPaaCoverage(makeInput({ content }));
    expect(paa.description).toContain('Only 1 question-phrased heading');
  });
});

describe('answer location within section boundaries (#155)', () => {
  it('does not pair a question heading with a paragraph from the next section', () => {
    const content =
      `<p>${words(160)}</p>` +
      '<h2>How does caching work?</h2><ul><li>Point one</li></ul>' +
      `<h2>Pricing Details</h2><p>${words(50)}</p>`;
    const result = checkAeoFaqSection(makeInput({ content }));
    expect(result.status).toBe('poor');
    expect(result.score).toBe(0);
  });

  it('skips non-<p> blocks within the section to find the answer paragraph', () => {
    const content =
      `<p>${words(160)}</p>` +
      `<h2>How does caching work?</h2><ul><li>Point one</li></ul><p>${words(50)}</p>`;

    const faq = checkAeoFaqSection(makeInput({ content }));
    expect(faq.status).toBe('ok');
    expect(faq.description).toContain('1 Q&A pair');

    const concise = checkAeoConciseAnswers(makeInput({ content }));
    expect(concise.status).toBe('good');
  });
});

// ============================================================================
// #163 item 6 — TL;DR summary heading and bullet detection
// ============================================================================

describe('checkAeoTldrSummary (#163 item 6)', () => {
  it('does not treat "Product Overview" as a summary heading', () => {
    const content =
      `<h2>Product Overview</h2><p>${words(320)}</p>` + '<ul><li>Unrelated list item</li></ul>';
    const result = checkAeoTldrSummary(makeInput({ content }));
    expect(result.status).toBe('poor');
  });

  it('detects a "Key Takeaways" heading followed by a bullet list', () => {
    const content =
      '<h2>Key Takeaways</h2><ul><li>First point</li><li>Second point</li></ul>' +
      `<p>${words(320)}</p>`;
    const result = checkAeoTldrSummary(makeInput({ content }));
    expect(result.status).toBe('good');
  });

  it('does not credit a bullet list that belongs to a later section', () => {
    const content =
      '<h2>Summary</h2><p>A short narrative wrap-up.</p>' +
      `<h2>More Details</h2><ul><li>Detail item</li></ul><p>${words(320)}</p>`;
    const result = checkAeoTldrSummary(makeInput({ content }));
    expect(result.status).toBe('ok');
  });
});

// ============================================================================
// #167 item 6 — fact density regex nits
// ============================================================================

describe('checkAeoFactDensity (#167 item 6)', () => {
  it('counts "2× more" and "3.5x faster" as multiplier facts', () => {
    const content = `<p>${words(110)} The tool is 2× more efficient and 3.5x faster.</p>`;
    const result = checkAeoFactDensity(makeInput({ content }));
    expect(result.description).toMatch(/\b2 fact signals\b/);
  });

  it('counts "5 KB" as a measurement, not a currency', () => {
    const content = `<p>${words(110)} The bundle weighs 5 KB in total.</p>`;
    const result = checkAeoFactDensity(makeInput({ content }));
    expect(result.description).toMatch(/\b1 fact signals?\b/);
  });

  it('counts an abbreviated currency amount like $3B exactly once', () => {
    const content = `<p>${words(110)} The company raised $3B for expansion.</p>`;
    const result = checkAeoFactDensity(makeInput({ content }));
    expect(result.description).toMatch(/\b1 fact signals?\b/);
  });
});

// ============================================================================
// #166 — table of contents detection must be bounded per list
// ============================================================================

describe('checkTableOfContents (#166)', () => {
  it('is not fooled by an unrelated list plus a lone back-to-top anchor', () => {
    const content =
      '<ul><li>Apples</li><li>Oranges</li><li>Pears</li></ul>' +
      `<p>${words(1600)}</p>` +
      '<p><a href="#top">Back to top</a></p>';
    const result = checkTableOfContents(makeInput({ content }));
    expect(result.status).toBe('ok');
    expect(result.description).toContain('Consider adding a table of contents');
  });

  it('detects a genuine ToC list with 3 anchor links', () => {
    const content =
      '<ul>' +
      '<li><a href="#intro">Introduction</a></li>' +
      '<li><a href="#setup">Setup</a></li>' +
      '<li><a href="#faq">FAQ</a></li>' +
      '</ul>' +
      `<p>${words(1600)}</p>`;
    const result = checkTableOfContents(makeInput({ content }));
    expect(result.status).toBe('good');
  });
});

// ============================================================================
// #167 item 5 — secondary keyphrases: na when no seeds configured
// ============================================================================

describe('checkSecondaryKeyphrases (#167 item 5)', () => {
  it('returns na when no secondary keyphrases are configured', () => {
    const results = checkSecondaryKeyphrases(makeInput());
    expect(results).toHaveLength(1);
    expect(results[0]!.status).toBe('na');
    expect(results[0]!.score).toBe(0);
  });

  it('still scores configured secondary keyphrases', () => {
    const results = checkSecondaryKeyphrases(
      makeInput({
        content: '<p>This article covers server-side rendering and structured data.</p>',
        secondaryKeyphrases: ['server-side rendering', 'structured data'],
      }),
    );
    expect(results[0]!.status).toBe('good');
    expect(results[0]!.score).toBe(5);
  });
});

// ============================================================================
// #161 — hrefs containing '#' must be parsed; pure anchors skipped
// ============================================================================

describe('link parsing with fragments (#161)', () => {
  it('detects an external link whose href contains a fragment', () => {
    const results = checkLinks(
      makeInput({
        content: '<p>Read the <a href="https://example.com/study#results">study</a>.</p>',
      }),
    );
    const external = results.find((r) => r.id === 'external-links');
    expect(external!.status).toBe('good');
    expect(external!.description).toContain('1 external link');
  });

  it('still skips pure anchor links', () => {
    const results = checkLinks(makeInput({ content: '<p><a href="#top">Back to top</a></p>' }));
    expect(results.find((r) => r.id === 'internal-links')!.status).toBe('poor');
    expect(results.find((r) => r.id === 'external-links')!.status).toBe('poor');
  });

  it('checkNofollowLinks sees external links containing fragments', () => {
    const result = checkNofollowLinks(
      makeInput({
        content: '<p><a href="https://example.com/a#frag" rel="nofollow">x</a></p>',
      }),
    );
    expect(result.status).toBe('ok');
    expect(result.description).toContain('nofollow');
  });

  it('checkNofollowLinks ignores pure anchor links', () => {
    const result = checkNofollowLinks(
      makeInput({ content: '<p><a href="#top" rel="nofollow">top</a></p>' }),
    );
    expect(result.status).toBe('na');
  });

  it('checkCompetingLinks sees competing links containing fragments', () => {
    const result = checkCompetingLinks(
      makeInput({
        focusKeyphrase: 'react seo',
        content: '<p><a href="https://rival.com/react-seo-guide#top">react seo guide</a></p>',
      }),
    );
    expect(result.status).toBe('ok');
    expect(result.description).toContain('1 competing external link');
  });
});

// ============================================================================
// #167 item 4 — depth match upper bounds
// ============================================================================

describe('checkIntentDepthMatch upper bounds (#167 item 4)', () => {
  it('flags 6,000-word informational content as above the ideal range', () => {
    const result = checkIntentDepthMatch(
      makeInput({ focusKeyphrase: 'how to learn react', content: words(6000) }),
    );
    expect(result.status).toBe('ok');
    expect(result.description).toContain('above the ideal range');
  });

  it('keeps 3,000-word informational content within the ideal range', () => {
    const result = checkIntentDepthMatch(
      makeInput({ focusKeyphrase: 'how to learn react', content: words(3000) }),
    );
    expect(result.status).toBe('good');
    expect(result.description).toContain('within the ideal range');
  });

  it('flags 6,000-word commercial content as above the ideal range', () => {
    const result = checkIntentDepthMatch(
      makeInput({ focusKeyphrase: 'best crm software', content: words(6000) }),
    );
    expect(result.status).toBe('ok');
    expect(result.description).toContain('above the ideal range');
  });

  it('marks 1,800-word transactional content as ok, above the ideal range', () => {
    const result = checkIntentDepthMatch(
      makeInput({ focusKeyphrase: 'buy running shoes', content: words(1800) }),
    );
    expect(result.status).toBe('ok');
    expect(result.description).toContain('above the ideal range');
  });
});

// ============================================================================
// #163 item 3 — CTA alignment must scan link/button text, not body prose
// ============================================================================

describe('intent-cta-alignment prose false positives (#163)', () => {
  it('does not flag "Open Graph" in prose as a navigational CTA', async () => {
    const { checkIntentCtaAlignment } = await import('../checks/intent-cta-alignment.js');
    const result = checkIntentCtaAlignment(
      makeInput({
        focusKeyphrase: 'react seo checklist guide',
        content:
          '<p>Set your Open Graph tags so social platforms can access preview data. ' +
          'You can launch the build and open the report afterwards.</p>',
      }),
    );
    expect(result.description).not.toContain('"open"');
    expect(result.status).not.toBe('poor');
  });

  it('still detects CTA phrases inside anchor and button text', async () => {
    const { checkIntentCtaAlignment } = await import('../checks/intent-cta-alignment.js');
    const result = checkIntentCtaAlignment(
      makeInput({
        focusKeyphrase: 'best crm software guide',
        content: '<p>Intro prose.</p><a href="/more">Learn more</a><button>Buy now</button>',
      }),
    );
    expect(result.description).toContain('buy now');
  });
});

// ============================================================================
// #167 item 1 — single-h1: body starting at H2 is correct when title is the H1
// ============================================================================

describe('single-h1 implicit page title (#167)', () => {
  it('does not penalize content that starts with an H2', async () => {
    const { checkSingleH1 } = await import('../checks/single-h1.js');
    const result = checkSingleH1(
      makeInput({
        content: '<h2>First Section</h2><p>Text.</p><h3>Sub</h3><p>More.</p>',
      }),
    );
    expect(result.status).toBe('good');
    expect(result.score).toBe(5);
  });

  it('still flags content that starts at H3 or deeper', async () => {
    const { checkSingleH1 } = await import('../checks/single-h1.js');
    const result = checkSingleH1(
      makeInput({
        content: '<h3>Deep Start</h3><p>Text.</p><h4>Sub</h4><p>More.</p>',
      }),
    );
    expect(result.status).toBe('ok');
    expect(result.description).toContain('H3');
  });

  it('flags a body <h1> as a duplicate when the page title is also an H1', () => {
    // title (implicit H1) + body <h1> = two H1s on the rendered page → poor.
    const result = checkSingleH1(
      makeInput({ title: 'My Post', content: '<h1>My Post</h1><h2>Section</h2><p>Text.</p>' }),
    );
    expect(result.status).toBe('poor');
    expect(result.description).toContain('H1');
  });

  it('treats a body starting at H2 as good when a title is set', () => {
    const result = checkSingleH1(
      makeInput({ title: 'My Post', content: '<h2>Section</h2><p>Text.</p>' }),
    );
    expect(result.status).toBe('good');
  });
});

// ============================================================================
// Subheading distribution — a single leading <h2> is not "no subheadings",
// and heading text must not inflate the following section's word count.
// ============================================================================

describe('subheading-distribution false reports', () => {
  it('does not report "no subheadings" when one leading H2 is present', () => {
    const body = Array(400).fill('word').join(' ');
    const result = checkSubheadingDistribution(
      makeInput({ content: `<h2>Overview</h2><p>${body}</p>` }),
    );
    expect(result.description).not.toContain('no subheadings');
  });

  it('does not count heading words toward the section length', () => {
    // 298 body words under a 3-word heading must stay under the 300 limit.
    const body = Array(298).fill('word').join(' ');
    const result = checkSubheadingDistribution(
      makeInput({ content: `<h2>Getting Started Now</h2><p>${body}</p>` }),
    );
    expect(result.description).not.toContain('exceed');
  });
});

// ============================================================================
// Keyphrase markup — nested emphasis must be counted once.
// ============================================================================

describe('keyphrase-markup nested emphasis', () => {
  it('counts <strong><em>kp</em></strong> as a single emphasized instance', () => {
    const result = checkKeyphraseMarkup(
      makeInput({
        focusKeyphrase: 'seo tips',
        content: '<p>Read our <strong><em>seo tips</em></strong> and more seo tips below.</p>',
      }),
    );
    // 1 of 2 occurrences emphasized — optimal, and never "over-emphasized".
    expect(result.description).not.toContain('over-emphasized');
    expect(result.description).toContain('1 time');
  });
});

// ============================================================================
// Keyphrase in URL — per-word match must be whole slug tokens, not substrings.
// ============================================================================

describe('keyphrase-slug substring false positive', () => {
  it('does not treat "seo" as present in the slug "season-guide"', () => {
    const result = checkKeyphraseSlug(
      makeInput({ focusKeyphrase: 'seo guide', slug: '/blog/season-guide' }),
    );
    expect(result.status).not.toBe('good');
  });
});

// ============================================================================
// Keyphrase in introduction — detected even when the intro is not in a <p>.
// ============================================================================

describe('keyphrase-introduction outside a <p>', () => {
  it('detects the keyphrase in a leading <div> intro', () => {
    const result = checkKeyphraseIntroduction(
      makeInput({
        focusKeyphrase: 'react seo',
        content: '<div>This guide covers react seo end to end.</div><p>More detail.</p>',
      }),
    );
    expect(result.status).toBe('good');
  });
});
