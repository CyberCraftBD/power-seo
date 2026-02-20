import { describe, it, expect } from 'vitest';
import { getTextStatistics } from '@power-seo/core';
import { fleschReadingEase, fleschKincaidGrade } from '../algorithms/flesch-kincaid.js';
import { gunningFog } from '../algorithms/gunning-fog.js';
import { colemanLiau } from '../algorithms/coleman-liau.js';
import { automatedReadability } from '../algorithms/automated-readability.js';

// Simple text: "The cat sat on the mat. It was a good cat."
const simpleText = 'The cat sat on the mat. It was a good cat.';
const simpleStats = getTextStatistics(simpleText);

// Complex text with longer sentences and more syllables
const complexText =
  'The implementation of sophisticated algorithms necessitates comprehensive understanding of computational complexity. ' +
  'Furthermore, the architectural considerations must accommodate scalability requirements while maintaining performance characteristics. ' +
  'Consequently, developers should evaluate alternative methodologies before committing to a particular implementation strategy.';
const complexStats = getTextStatistics(complexText);

describe('fleschReadingEase', () => {
  it('returns 0 for empty content', () => {
    const emptyStats = getTextStatistics('');
    expect(fleschReadingEase(emptyStats)).toBe(0);
  });

  it('returns a high score for simple text', () => {
    const score = fleschReadingEase(simpleStats);
    expect(score).toBeGreaterThan(60);
  });

  it('returns a lower score for complex text', () => {
    const score = fleschReadingEase(complexStats);
    expect(score).toBeLessThan(fleschReadingEase(simpleStats));
  });

  it('returns a value between 0 and 100', () => {
    const score = fleschReadingEase(simpleStats);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('fleschKincaidGrade', () => {
  it('returns 0 for empty content', () => {
    const emptyStats = getTextStatistics('');
    expect(fleschKincaidGrade(emptyStats)).toBe(0);
  });

  it('returns a low grade for simple text', () => {
    const grade = fleschKincaidGrade(simpleStats);
    expect(grade).toBeLessThan(6);
  });

  it('returns a higher grade for complex text', () => {
    const simpleGrade = fleschKincaidGrade(simpleStats);
    const complexGrade = fleschKincaidGrade(complexStats);
    expect(complexGrade).toBeGreaterThan(simpleGrade);
  });

  it('returns a non-negative value', () => {
    expect(fleschKincaidGrade(simpleStats)).toBeGreaterThanOrEqual(0);
  });
});

describe('gunningFog', () => {
  it('returns 0 for empty content', () => {
    expect(gunningFog('')).toBe(0);
  });

  it('returns a low score for simple text', () => {
    const score = gunningFog(simpleText);
    expect(score).toBeLessThan(8);
  });

  it('returns a higher score for complex text', () => {
    const simple = gunningFog(simpleText);
    const complex = gunningFog(complexText);
    expect(complex).toBeGreaterThan(simple);
  });

  it('returns a non-negative value', () => {
    expect(gunningFog(simpleText)).toBeGreaterThanOrEqual(0);
  });
});

describe('colemanLiau', () => {
  it('returns 0 for empty content', () => {
    const emptyStats = getTextStatistics('');
    expect(colemanLiau(emptyStats)).toBe(0);
  });

  it('returns a reasonable grade for simple text', () => {
    const grade = colemanLiau(simpleStats);
    expect(grade).toBeGreaterThanOrEqual(0);
    expect(grade).toBeLessThan(10);
  });

  it('returns a higher grade for complex text', () => {
    const simpleGrade = colemanLiau(simpleStats);
    const complexGrade = colemanLiau(complexStats);
    expect(complexGrade).toBeGreaterThan(simpleGrade);
  });
});

describe('automatedReadability', () => {
  it('returns 0 for empty content', () => {
    const emptyStats = getTextStatistics('');
    expect(automatedReadability(emptyStats)).toBe(0);
  });

  it('returns a low score for simple text', () => {
    const score = automatedReadability(simpleStats);
    expect(score).toBeLessThan(8);
  });

  it('returns a higher score for complex text', () => {
    const simple = automatedReadability(simpleStats);
    const complex = automatedReadability(complexStats);
    expect(complex).toBeGreaterThan(simple);
  });

  it('returns a non-negative value', () => {
    expect(automatedReadability(simpleStats)).toBeGreaterThanOrEqual(0);
  });
});
