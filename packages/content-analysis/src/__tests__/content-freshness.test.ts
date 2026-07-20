// @power-seo/content-analysis — Content Freshness Check Tests
// ----------------------------------------------------------------------------

import { describe, it, expect } from 'vitest';
import type { ContentAnalysisInput } from '@power-seo/core';
import { checkContentFreshness } from '../checks/content-freshness.js';
import { analyzeContent } from '../analyzer.js';

/** Milliseconds in a day. */
const MS_PER_DAY = 86_400_000;

/** Fixed reference date used across all tests for determinism. */
const FIXED_NOW = new Date('2025-06-15T00:00:00.000Z');

/** Returns a date exactly `months` average months (30.44 days) before `date`. */
function monthsBefore(date: Date, months: number): Date {
  return new Date(date.getTime() - months * 30.44 * MS_PER_DAY);
}

/** Content without any temporal references that could trigger staleness detection. */
const NEUTRAL_CONTENT =
  '<h1>Gardening Basics</h1><p>Soil preparation is the foundation of a healthy garden. ' +
  'Compost improves drainage and adds nutrients to the soil.</p>';

function makeInput(publishDate?: Date): ContentAnalysisInput {
  return {
    content: NEUTRAL_CONTENT,
    ...(publishDate ? { publishDate } : {}),
  };
}

describe('checkContentFreshness (injected reference date)', () => {
  it('returns good for content published 2 months before the reference date', () => {
    const result = checkContentFreshness(makeInput(monthsBefore(FIXED_NOW, 2)), FIXED_NOW);
    expect(result.id).toBe('content-freshness');
    expect(result.status).toBe('good');
    expect(result.score).toBe(10);
  });

  it('returns ok for content published 8 months before the reference date', () => {
    const result = checkContentFreshness(makeInput(monthsBefore(FIXED_NOW, 8)), FIXED_NOW);
    expect(result.status).toBe('ok');
    expect(result.score).toBe(6);
  });

  it('returns poor for content published 18 months before the reference date', () => {
    const result = checkContentFreshness(makeInput(monthsBefore(FIXED_NOW, 18)), FIXED_NOW);
    expect(result.status).toBe('poor');
    expect(result.score).toBe(2);
  });

  it('returns na when no publish or modified date is provided', () => {
    const result = checkContentFreshness(makeInput(), FIXED_NOW);
    expect(result.status).toBe('na');
    expect(result.score).toBe(0);
  });

  it('is deterministic for the same injected reference date', () => {
    const input = makeInput(monthsBefore(FIXED_NOW, 8));
    expect(checkContentFreshness(input, FIXED_NOW)).toEqual(
      checkContentFreshness(input, FIXED_NOW),
    );
  });
});

describe('analyzeContent options.now threading', () => {
  it('produces the same content-freshness result as the direct call with the same date', () => {
    const input = makeInput(monthsBefore(FIXED_NOW, 8));

    const direct = checkContentFreshness(input, FIXED_NOW);
    const output = analyzeContent(input, { now: FIXED_NOW });
    const threaded = output.results.find((r) => r.id === 'content-freshness');

    expect(threaded).toBeDefined();
    expect(threaded).toEqual(direct);
    expect(threaded!.status).toBe('ok');
  });

  it('threads the injected date across freshness thresholds', () => {
    for (const [months, status] of [
      [2, 'good'],
      [18, 'poor'],
    ] as const) {
      const input = makeInput(monthsBefore(FIXED_NOW, months));
      const output = analyzeContent(input, { now: FIXED_NOW });
      const result = output.results.find((r) => r.id === 'content-freshness');
      expect(result?.status).toBe(status);
    }
  });

  it('remains backward compatible when no options are passed', () => {
    const output = analyzeContent(makeInput());
    const result = output.results.find((r) => r.id === 'content-freshness');
    expect(result?.status).toBe('na');
  });
});
