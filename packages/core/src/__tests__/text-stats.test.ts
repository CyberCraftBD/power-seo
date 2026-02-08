import { describe, it, expect } from 'vitest';
import {
  stripHtml,
  getWords,
  getSentences,
  getParagraphs,
  countSyllables,
  getTextStatistics,
} from '../text-stats.js';

describe('stripHtml', () => {
  it('should strip HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('should strip script tags with content', () => {
    expect(stripHtml('<p>Hello</p><script>alert("hi")</script>')).toBe('Hello');
  });

  it('should decode HTML entities', () => {
    expect(stripHtml('Hello &amp; world')).toBe('Hello & world');
  });

  it('should handle empty input', () => {
    expect(stripHtml('')).toBe('');
  });
});

describe('getWords', () => {
  it('should split text into words', () => {
    expect(getWords('Hello world test')).toEqual(['Hello', 'world', 'test']);
  });

  it('should handle HTML content', () => {
    expect(getWords('<p>Hello <em>world</em></p>')).toEqual(['Hello', 'world']);
  });

  it('should return empty array for empty content', () => {
    expect(getWords('')).toEqual([]);
  });
});

describe('getSentences', () => {
  it('should split text into sentences', () => {
    const sentences = getSentences('Hello world. This is a test. Another one.');
    expect(sentences.length).toBe(3);
  });

  it('should handle single sentence', () => {
    expect(getSentences('Just one sentence.')).toEqual(['Just one sentence.']);
  });
});

describe('getParagraphs', () => {
  it('should split HTML into paragraphs', () => {
    const paragraphs = getParagraphs('<p>First paragraph</p><p>Second paragraph</p>');
    expect(paragraphs.length).toBe(2);
  });
});

describe('countSyllables', () => {
  it('should count syllables in common words', () => {
    expect(countSyllables('hello')).toBe(2);
    expect(countSyllables('world')).toBe(1);
    expect(countSyllables('beautiful')).toBe(3);
    expect(countSyllables('the')).toBe(1);
  });

  it('should return at least 1 for any word', () => {
    expect(countSyllables('a')).toBeGreaterThanOrEqual(1);
    expect(countSyllables('I')).toBeGreaterThanOrEqual(1);
  });
});

describe('getTextStatistics', () => {
  it('should return comprehensive statistics', () => {
    const stats = getTextStatistics(
      '<p>Hello world. This is a test sentence. Another one here.</p>',
    );

    expect(stats.wordCount).toBe(10);
    expect(stats.sentenceCount).toBe(3);
    expect(stats.paragraphCount).toBeGreaterThanOrEqual(1);
    expect(stats.syllableCount).toBeGreaterThan(0);
    expect(stats.characterCount).toBeGreaterThan(0);
    expect(stats.avgWordsPerSentence).toBeCloseTo(3.3, 0);
  });

  it('should handle empty content', () => {
    const stats = getTextStatistics('');
    expect(stats.wordCount).toBe(0);
    expect(stats.sentenceCount).toBe(0);
  });
});
