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

  it('should not truncate text after an unclosed script tag (#148)', () => {
    // Double-strip: the first pass decodes &lt;script&gt; into a literal
    // <script> mention; the second pass must not delete the rest of the text.
    const once = stripHtml('<p>JSON-LD is a plain &lt;script&gt; tag.</p><p>More text after.</p>');
    const twice = stripHtml(once);
    expect(twice).toContain('More text after');
  });

  it('should not insert a space for inline tags (#157)', () => {
    expect(stripHtml('Word<b>P</b>ress')).toBe('WordPress');
    expect(stripHtml('The <strong>Word<em>P</em>ress</strong> CMS')).toBe('The WordPress CMS');
  });

  it('should keep a word boundary for block tags (#157)', () => {
    expect(stripHtml('<h2>Final Thoughts</h2><p>Now you know</p>')).toBe(
      'Final Thoughts Now you know',
    );
    expect(stripHtml('line one<br>line two')).toBe('line one line two');
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

  it('should not split after common abbreviations (#165)', () => {
    const sentences = getSentences('Use caching, e.g. Redis, for speed. It works.');
    expect(sentences).toEqual(['Use caching, e.g. Redis, for speed.', 'It works.']);
  });

  it('should not split after titles like Dr. and Mr. (#165)', () => {
    const sentences = getSentences('Dr. Smith met Mr. Jones. They spoke briefly.');
    expect(sentences.length).toBe(2);
  });
});

describe('getParagraphs', () => {
  it('should split HTML into paragraphs', () => {
    const paragraphs = getParagraphs('<p>First paragraph</p><p>Second paragraph</p>');
    expect(paragraphs.length).toBe(2);
  });

  it('should keep content between double-br separators (#160)', () => {
    const paragraphs = getParagraphs('Intro.<br><br>Middle should survive.<br><br>Outro.');
    expect(paragraphs).toEqual(['Intro.', 'Middle should survive.', 'Outro.']);
  });

  it('should not split on a single br (#160)', () => {
    expect(getParagraphs('one<br>two<br>three')).toEqual(['one two three']);
  });

  it('should treat lists, tables and headings as separate blocks (#150)', () => {
    const listItems = Array(200)
      .fill('<li>word word word</li>')
      .join('');
    const html = `<p>A short para.</p><ul>${listItems}</ul><p>Another short para.</p>`;
    const paragraphs = getParagraphs(html);
    expect(paragraphs.length).toBe(3);
    expect(paragraphs[0]).toBe('A short para.');
    expect(paragraphs[2]).toBe('Another short para.');
  });

  it('should exclude pre blocks from paragraphs (#150)', () => {
    const paragraphs = getParagraphs('<p>Prose here.</p><pre>const x = 1;</pre><p>More prose.</p>');
    expect(paragraphs).toEqual(['Prose here.', 'More prose.']);
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

  it('should count words with es/ed suffixes via vowel groups', () => {
    expect(countSyllables('tested')).toBe(2);
    expect(countSyllables('wishes')).toBe(2);
    expect(countSyllables('played')).toBe(1);
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

  it('should report letters and digits separately from characterCount (#165)', () => {
    const stats = getTextStatistics('Hello world, 42!');
    // "Hello world, 42!" — 10 letters + 2 digits, characterCount includes
    // spaces and punctuation.
    expect(stats.letterDigitCount).toBe(12);
    expect(stats.characterCount).toBe(16);
  });
});
