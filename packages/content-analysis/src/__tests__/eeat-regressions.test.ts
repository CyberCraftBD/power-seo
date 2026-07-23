import { describe, it, expect } from 'vitest';
import { checkYmylCompliance } from '../checks/eeat-ymyl-compliance.js';
import { checkYmylMultiplier } from '../checks/eeat-ymyl-multiplier.js';
import { checkConflictDisclosure } from '../checks/eeat-conflict-disclosure.js';
import { checkSourceQuality } from '../checks/eeat-source-quality.js';
import { checkTopicalAuthority } from '../checks/eeat-topical-authority.js';
import { checkOriginalResearch } from '../checks/eeat-original-research.js';
import { checkExpertSourcing } from '../checks/eeat-expert-sourcing.js';
import { checkMultimediaEvidence } from '../checks/eeat-multimedia-evidence.js';
import { checkAuthorSchema } from '../checks/eeat-author-schema.js';
import { checkEeatOverallScore } from '../checks/eeat-overall-score.js';
import { checkCorrectionPolicy } from '../checks/eeat-correction-policy.js';
import type { ContentAnalysisInput } from '@power-seo/core';

// Neutral padding (~115 words) to clear minimum word-count thresholds without
// adding expert, research, disclosure, or YMYL markers of its own.
const neutralPadding =
  '<p>The garden workshop moved along at a gentle pace through the spring weeks. Volunteers ' +
  'arranged the beds, watered the seedlings, and kept simple notes about the weather. Each ' +
  'afternoon the group walked the paths, trimmed the hedges, and tidied the shed before ' +
  'closing the gate. Neighbors often stopped to chat about the flowers near the fence, and ' +
  'the children enjoyed naming the colors they noticed along the border. The routine stayed ' +
  'the same from week to week, calm and familiar, with plenty of time for tea and quiet ' +
  'conversation under the old oak tree beside the greenhouse at the edge of the field.</p>';

// ============================================================================
// #154 — stateful /g regexes used with .test() made results nondeterministic
// ============================================================================

describe('stateful regex determinism (#154)', () => {
  it('checkYmylCompliance returns identical results on consecutive calls (disclaimer .test)', () => {
    const input: ContentAnalysisInput = {
      content:
        '<p>Choosing an investment strategy depends on your mortgage and retirement goals. ' +
        'This is not financial advice.</p>' +
        neutralPadding,
    };

    const first = checkYmylCompliance(input);
    const second = checkYmylCompliance(input);

    expect(second).toEqual(first);
    expect(first.description).toContain('disclaimers present');
  });

  it('checkYmylMultiplier returns identical results on consecutive calls', () => {
    const input: ContentAnalysisInput = {
      content:
        '<p>Choosing an investment strategy depends on your mortgage and retirement goals. ' +
        'This is not financial advice.</p>' +
        neutralPadding,
    };

    const first = checkYmylMultiplier(input);
    const second = checkYmylMultiplier(input);

    expect(second).toEqual(first);
    // The disclaimer was found, so its gap suggestion must not appear.
    expect(first.description).not.toContain('add category-appropriate disclaimers');
  });

  it('checkConflictDisclosure counts every affiliate link (no lastIndex carryover)', () => {
    const affiliate = [0, 1, 2, 3]
      .map((i) => `<a href="https://amzn.to/x${i}">Product ${i}</a>`)
      .join(' ');
    const regular = [0, 1, 2, 3]
      .map((i) => `<a href="https://example.com/page${i}">Page ${i}</a>`)
      .join(' ');
    const input: ContentAnalysisInput = {
      content:
        `<p>This post contains affiliate links to products we like.</p>${affiliate}${regular}` +
        neutralPadding,
    };

    const first = checkConflictDisclosure(input);
    const second = checkConflictDisclosure(input);

    expect(second).toEqual(first);
    expect(first.description).toContain('4 affiliate link');
  });

  it('checkSourceQuality detects a <h2>Sources</h2> section on consecutive calls', () => {
    const input: ContentAnalysisInput = {
      content:
        '<h2>Sources</h2>' +
        '<p>See <a href="https://www.census.gov/tools">census records</a>, ' +
        '<a href="https://stanford.edu/report">a university report</a>, and ' +
        '<a href="https://example.com/background">background reading</a>.</p>' +
        neutralPadding,
    };

    const first = checkSourceQuality(input);
    const second = checkSourceQuality(input);

    expect(second).toEqual(first);
    expect(first.description).toContain('References section present');
    expect(second.description).toContain('References section present');
  });
});

// ============================================================================
// #159 — YMYL detection false positives
// ============================================================================

describe('YMYL detection false positives (#159)', () => {
  it('an ML article using "recall" and "danger" is not classified as YMYL', () => {
    const input: ContentAnalysisInput = {
      content:
        '<p>Our model recall improved with more training data samples. Precision and recall ' +
        'trade off against each other, and low recall is a danger of tuning thresholds ' +
        'badly.</p>' +
        neutralPadding,
    };

    expect(checkYmylCompliance(input).status).toBe('na');
    expect(checkYmylMultiplier(input).status).toBe('na');
  });

  it('repeated hits of a single keyword do not classify content as YMYL', () => {
    const input: ContentAnalysisInput = {
      content:
        '<p>The treatment worked well. The treatment lasted three weeks. The treatment ' +
        'ended quietly.</p>' +
        neutralPadding,
    };

    expect(checkYmylCompliance(input).status).toBe('na');
    expect(checkYmylMultiplier(input).status).toBe('na');
  });

  it('contentCategory "Newsletter" with generic prose is not YMYL (no substring match on "news")', () => {
    const input: ContentAnalysisInput = {
      content: neutralPadding,
      contentCategory: 'Newsletter',
    };

    expect(checkYmylCompliance(input).status).toBe('na');
    expect(checkYmylMultiplier(input).status).toBe('na');
  });

  it('checkTopicalAuthority does not treat "Lawn Care" or "Syntax" as YMYL categories', () => {
    const author = { name: 'Sam Rivera', knowsAbout: ['gardening'] };

    const lawn = checkTopicalAuthority({ content: '', author, contentCategory: 'Lawn Care' });
    const syntax = checkTopicalAuthority({ content: '', author, contentCategory: 'Syntax' });
    const taxLaw = checkTopicalAuthority({ content: '', author, contentCategory: 'Tax Law' });

    expect(lawn.description).not.toContain('YMYL');
    expect(syntax.description).not.toContain('YMYL');
    // Exact tokens still trigger YMYL handling.
    expect(taxLaw.description).toContain('YMYL');
  });

  it('an explicit YMYL contentCategory still classifies via exact-token matching', () => {
    const input: ContentAnalysisInput = {
      content: neutralPadding,
      contentCategory: 'Health',
    };

    expect(checkYmylCompliance(input).status).not.toBe('na');
    expect(checkYmylMultiplier(input).status).not.toBe('na');
  });

  it('genuine medical content is still detected as YMYL', () => {
    const input: ContentAnalysisInput = {
      content:
        '<p>Discuss the dosage with your care team, watch closely for side effects, and ' +
        'confirm the diagnosis before starting treatment.</p>' +
        neutralPadding,
    };

    const result = checkYmylCompliance(input);
    expect(result.status).toBe('poor');
    expect(result.description).toContain('health/medical');
  });
});

// ============================================================================
// #163 — word-list false positives (disclosure "\bad\b", research "chart")
// ============================================================================

describe('word-list false positives (#163)', () => {
  it('"ad hoc" is not an FTC disclosure: undisclosed sponsored post is poor', () => {
    const result = checkConflictDisclosure({
      isSponsored: true,
      content:
        '<p>We organized an ad hoc committee to review the plan this month.</p>' + neutralPadding,
    });

    expect(result.status).toBe('poor');
    expect(result.score).toBe(0);
    expect(result.description).toContain('FTC');
  });

  it('a "#ad" hashtag after whitespace counts as a disclosure', () => {
    const result = checkConflictDisclosure({
      isSponsored: true,
      content:
        '<p>Quick share for the weekend: this haul includes some #ad content from the ' +
        'outdoor shop.</p>' +
        neutralPadding,
    });

    expect(result.status).toBe('good');
    expect(result.description).toContain('disclosed');
  });

  it('prose repeating "paragraph" and "photography" has no research signals', () => {
    const result = checkOriginalResearch({
      content:
        '<p>Each paragraph in this essay describes landscape photography. A good paragraph ' +
        'flows into the next paragraph, and thoughtful photography rewards patience.</p>' +
        neutralPadding,
    });

    expect(result.status).toBe('poor');
    expect(result.score).toBe(0);
  });

  it('content with "the chart below shows" is still detected as a visualization', () => {
    const result = checkOriginalResearch({
      content:
        '<p>The chart below shows monthly totals from the tracker we maintain.</p>' +
        neutralPadding,
    });

    expect(result.status).not.toBe('poor');
    expect(result.description).toContain('charts/visualizations');
  });
});

// ============================================================================
// #164 — expert sourcing defects
// ============================================================================

describe('expert sourcing (#164)', () => {
  it('detects sentence-initial "According to <First Last>" citations', () => {
    const result = checkExpertSourcing({
      content:
        '<p>According to Jane Doe, the certification process takes months to finish. ' +
        'According to Marcus Webb, the review stage is the hardest part.</p>' +
        neutralPadding,
    });

    expect(result.status).not.toBe('poor');
    expect(result.score).toBeGreaterThan(0);
    expect(result.description).toContain('expert citations');
  });

  it('counts <cite> elements containing nested markup', () => {
    const result = checkExpertSourcing({
      content:
        '<blockquote>The rollout took longer than expected but paid off.' +
        '<cite><a href="https://example.com/team">Dr. Jane Doe</a></cite></blockquote>' +
        neutralPadding,
    });

    expect(result.status).not.toBe('poor');
    expect(result.description).toContain('cited sources');
  });

  it('ignores <cite> elements with no text content', () => {
    const result = checkExpertSourcing({
      content:
        '<p>Nothing here is attributed to anyone.</p><cite><img src="/logo.png"/></cite>' +
        neutralPadding,
    });

    expect(result.status).toBe('poor');
    expect(result.score).toBe(0);
  });

  it('registers expert consensus phrases as a source type', () => {
    const result = checkExpertSourcing({
      content:
        '<p>Experts agree that steady practice beats cramming. Leading experts recommend ' +
        'short daily sessions over marathon weekends.</p>' +
        neutralPadding,
    });

    expect(result.status).not.toBe('poor');
    expect(result.description).toContain('expert consensus');
  });

  it('counts <figcaption> elements containing nested markup (multimedia evidence)', () => {
    const result = checkMultimediaEvidence({
      content:
        '<figure><img src="/dash.png" alt="Screenshot of the analytics dashboard in use" />' +
        '<figcaption><strong>Setup:</strong> the dashboard once configured</figcaption>' +
        '</figure>' +
        neutralPadding,
    });

    // The caption is recognized, so the "wrap images in <figure> with
    // <figcaption>" suggestion must not appear.
    expect(result.description).not.toContain('figcaption');
  });
});

// ============================================================================
// #167 — description consistency, proportional scoring, date sanity
// ============================================================================

describe('author schema description consistency (#167)', () => {
  const author = {
    name: 'Jane Doe',
    jobTitle: 'Principal Engineer',
    bio: 'Jane has built and operated large web platforms for more than a decade across several industries.',
    worksFor: { name: 'Example Corp' },
    credentials: [{ name: 'AWS Certified Solutions Architect' }],
    knowsAbout: ['web performance', 'search'],
    socialProfiles: [{ platform: 'x', url: 'https://x.com/janedoe' }],
  };

  it('reports the weight-based percentage next to the true field count', () => {
    const result = checkAuthorSchema({ content: '', author });

    // 11/14 weight = 79%, and exactly 7 of the 10 schema fields are filled.
    expect(result.description).toContain('79% complete (7 of 10 fields)');
  });

  it('uses a single consistent bio word-count target (30+ words)', () => {
    const shortBio = checkAuthorSchema({
      content: '',
      author: { ...author, bio: 'Jane builds large web platforms for enterprises.' },
    });
    const midBio = checkAuthorSchema({ content: '', author });

    expect(shortBio.description).toContain('30+ words');
    expect(midBio.description).toContain('30+ words');
    expect(midBio.description).not.toContain('50+ words');
  });
});

describe('E-E-A-T overall score proportional scoring (#167)', () => {
  const author = {
    name: 'Jane Doe',
    jobTitle: 'Principal Engineer',
    bio: 'Jane has built and operated large web platforms for more than a decade across several industries.',
    credentials: [{ name: 'PE' }],
    knowsAbout: ['web'],
    worksFor: { name: 'Example Corp' },
    publications: [{ title: 'Scaling the Web' }],
    socialProfiles: [
      { platform: 'x', url: 'https://x.com/a' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/a' },
      { platform: 'github', url: 'https://github.com/a' },
    ],
  };

  const baseInput: ContentAnalysisInput = {
    content: neutralPadding,
    canonicalUrl: 'https://example.com/post',
    publishDate: '2026-01-15',
    privacyPolicyUrl: 'https://example.com/privacy',
    author,
  };

  it('scores proportionally to pillar points instead of flat cliff values', () => {
    // Experience 0/3, Expertise 3/3, Authority 3/3, Trust 3/3 = 9/12
    const full = checkEeatOverallScore(baseInput);
    expect(full.status).toBe('good');
    expect(full.score).toBe(6); // round(9/12 * 8)

    // Dropping one trust marker moves the score by 1 point, not 3+.
    const { privacyPolicyUrl: _omitted, ...withoutPrivacy } = baseInput;
    const reduced = checkEeatOverallScore(withoutPrivacy);
    expect(reduced.status).toBe('ok');
    expect(reduced.score).toBe(5); // round(8/12 * 8)
    expect(full.score - reduced.score).toBe(1);
  });

  it('keeps the pillar breakdown in the description', () => {
    const result = checkEeatOverallScore(baseInput);
    expect(result.description).toContain('Experience 0/3');
    expect(result.description).toContain('Trust 3/3');
  });

  it('ignores a future publish date in the trust pillar', () => {
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const withFuture = checkEeatOverallScore({ ...baseInput, publishDate: futureDate });
    const withoutDate = checkEeatOverallScore({ ...baseInput, publishDate: undefined });

    expect(withFuture.score).toBe(withoutDate.score);
    expect(withFuture.status).toBe(withoutDate.status);
  });
});

describe('future-date sanity (#167)', () => {
  const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  it('checkCorrectionPolicy treats future dates as absent', () => {
    const withFuture = checkCorrectionPolicy({
      content: neutralPadding,
      publishDate: futureDate,
      modifiedDate: futureDate,
    });
    const withPast = checkCorrectionPolicy({
      content: neutralPadding,
      publishDate: '2026-01-15',
      modifiedDate: '2026-03-02',
    });

    expect(withFuture.status).toBe('poor');
    expect(withFuture.description).not.toContain('publish date:');
    expect(withPast.status).toBe('ok');
  });

  it('checkCorrectionPolicy does not credit a modified date before the publish date', () => {
    const result = checkCorrectionPolicy({
      content: neutralPadding,
      publishDate: '2026-03-01',
      modifiedDate: '2026-01-01',
    });

    expect(result.status).toBe('poor');
    expect(result.description).not.toContain('last modified');
    expect(result.description).not.toContain('updated since publication');
  });

  it('checkYmylMultiplier does not credit a future publish date for freshness', () => {
    const result = checkYmylMultiplier({
      content:
        '<p>Discuss the dosage with your care team, watch closely for side effects, and ' +
        'confirm the diagnosis before starting treatment.</p>' +
        neutralPadding,
      canonicalUrl: 'https://example.com/health-guide',
      publishDate: futureDate,
    });

    expect(result.description).toContain('add publish date');
  });
});
