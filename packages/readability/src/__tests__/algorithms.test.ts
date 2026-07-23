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

  // Issue #165: scores must be computed from raw words/sentences and
  // syllables/words ratios, not the pre-rounded avg* display fields.
  it('computes from raw ratios, not pre-rounded averages (#165)', () => {
    const stats = {
      wordCount: 10000,
      sentenceCount: 500,
      paragraphCount: 10,
      syllableCount: 15449, // 1.5449 syllables/word — rounds to 1.54 for display
      characterCount: 60000,
      letterDigitCount: 48000,
      avgWordsPerSentence: 20,
      avgSyllablesPerWord: 1.54,
    };
    // Raw: 206.835 - 1.015 * 20 - 84.6 * 1.5449 = 55.837 → 55.84
    // Pre-rounded 1.54 would give 56.25 instead.
    expect(fleschReadingEase(stats)).toBeCloseTo(55.84, 2);
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

  it('computes from raw ratios, not pre-rounded averages (#165)', () => {
    const stats = {
      wordCount: 10000,
      sentenceCount: 500,
      paragraphCount: 10,
      syllableCount: 15449, // 1.5449 syllables/word — rounds to 1.54 for display
      characterCount: 60000,
      letterDigitCount: 48000,
      avgWordsPerSentence: 20,
      avgSyllablesPerWord: 1.54,
    };
    // Raw: 0.39 * 20 + 11.8 * 1.5449 - 15.59 = 10.43982 → 10.44
    // Pre-rounded 1.54 would give 10.38 instead.
    expect(fleschKincaidGrade(stats)).toBeCloseTo(10.44, 2);
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

  // Issue #141 [Medium]: letter count must exclude punctuation and digits,
  // otherwise the grade is biased upward on number-heavy text.
  it('excludes digits and punctuation from the letter count when content is provided', () => {
    // Digit- and punctuation-heavy sentence: characterCount is inflated by all
    // the numbers and commas, so the characterCount-based approximation reports
    // far more "letters" than actually exist.
    const content =
      'The quarterly report covers 2020, 2021, 2022, 2023, 2024, 2025 and includes ' +
      '1234 5678 90 items totaling 999999 units across 42 regions with 7 teams.';
    const stats = getTextStatistics(content);

    const gradeWithContent = colemanLiau(stats, content);
    const gradeApprox = colemanLiau(stats);

    // The content-aware grade must be meaningfully lower (not inflated by digits).
    expect(gradeWithContent).toBeLessThan(gradeApprox);
    expect(gradeApprox - gradeWithContent).toBeGreaterThan(5);
  });

  // Issue #141 [Medium]: punctuation must not count as letters either.
  it('does not count commas and periods as letters', () => {
    const content =
      'Well, yes, indeed, of course, naturally, certainly, absolutely, and, finally, done.';
    const stats = getTextStatistics(content);
    // Since #165 the fallback uses letterDigitCount, which already excludes
    // punctuation — on digit-free text both paths now agree exactly.
    expect(colemanLiau(stats)).toBeCloseTo(colemanLiau(stats, content), 2);
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

  // Issue #165: ARI is defined over letters and digits per word, but the old
  // implementation used characterCount, which includes spaces and punctuation.
  it('uses letters+digits per word, not characterCount (#165)', () => {
    const stats = complexStats;
    const letters = (complexText.match(/[A-Za-z0-9]/g) ?? []).length;
    const expected =
      4.71 * (letters / stats.wordCount) + 0.5 * (stats.wordCount / stats.sentenceCount) - 21.43;
    const inflated =
      4.71 * (stats.characterCount / stats.wordCount) +
      0.5 * (stats.wordCount / stats.sentenceCount) -
      21.43;

    expect(automatedReadability(stats)).toBeCloseTo(Math.max(0, expected), 2);
    expect(automatedReadability(stats)).toBeLessThan(inflated);
  });
});
