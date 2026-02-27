import { describe, it, expect } from 'vitest';
import { analyzeReadability } from '../analyzer.js';

describe('analyzeReadability', () => {
  it('returns a complete ReadabilityOutput', () => {
    const result = analyzeReadability({
      content:
        '<p>The cat sat on the mat. It was a very good day for cats. However, the dog preferred the sofa. Therefore, they each had their own spot.</p>' +
        '<p>In addition, the bird watched from above. Meanwhile, the fish swam in circles. Consequently, the house was peaceful.</p>',
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.fleschReadingEase).toBeGreaterThanOrEqual(0);
    expect(result.fleschKincaidGrade).toBeGreaterThanOrEqual(0);
    expect(result.avgSentenceLength).toBeGreaterThan(0);
    expect(result.avgSyllablesPerWord).toBeGreaterThan(0);
    expect(typeof result.passiveVoicePercentage).toBe('number');
    expect(typeof result.longSentencePercentage).toBe('number');
    expect(typeof result.longParagraphCount).toBe('number');
    expect(typeof result.transitionWordPercentage).toBe('number');
    expect(result.results).toBeInstanceOf(Array);
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.recommendations).toBeInstanceOf(Array);
  });

  it('handles empty content', () => {
    const result = analyzeReadability({ content: '' });

    expect(result.score).toBe(0);
    expect(result.fleschReadingEase).toBe(0);
    expect(result.fleschKincaidGrade).toBe(0);
  });

  it('scores simple text higher than complex text', () => {
    const simple = analyzeReadability({
      content:
        '<p>The cat sat on the mat. It was a good day. The sun was out. Birds sang in the trees.</p>',
    });

    const complex = analyzeReadability({
      content:
        '<p>The implementation of sophisticated algorithms necessitates comprehensive understanding of computational complexity and architectural considerations.</p>',
    });

    expect(simple.fleschReadingEase).toBeGreaterThan(complex.fleschReadingEase);
  });

  it('detects passive voice', () => {
    const result = analyzeReadability({
      content:
        '<p>The ball was thrown by the boy. The cake was eaten by the children. The book was written by the author.</p>',
    });

    expect(result.passiveVoicePercentage).toBeGreaterThan(0);
  });

  it('detects transition words', () => {
    const result = analyzeReadability({
      content:
        '<p>First, we need to plan. However, plans can change. Therefore, flexibility is key. In addition, communication matters. Finally, execution is everything.</p>',
    });

    expect(result.transitionWordPercentage).toBeGreaterThan(0);
  });

  it('detects long sentences', () => {
    // Build a sentence with more than 20 words
    const longSentence =
      'This is an extremely long sentence that contains far more words than the recommended maximum number of words per sentence and should be flagged as too long by the readability analyzer.';
    const result = analyzeReadability({
      content: `<p>${longSentence} Short one.</p>`,
    });

    expect(result.longSentencePercentage).toBeGreaterThan(0);
  });

  it('detects long paragraphs', () => {
    // A paragraph with more than 150 words
    const longParagraph = Array(160).fill('word').join(' ') + '.';
    const result = analyzeReadability({
      content: `<p>${longParagraph}</p><p>Short paragraph.</p>`,
    });

    expect(result.longParagraphCount).toBeGreaterThan(0);
  });

  it('generates recommendations for poor readability', () => {
    const result = analyzeReadability({
      content:
        '<p>The implementation of sophisticated algorithms necessitates comprehensive understanding of computational complexity and architectural considerations that span multiple domains of expertise including but not limited to distributed systems programming paradigms and theoretical computer science methodologies.</p>',
    });

    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('has results with valid structure', () => {
    const result = analyzeReadability({
      content: '<p>Simple text. Easy to read. Good words.</p>',
    });

    for (const r of result.results) {
      expect(r.id).toBeTruthy();
      expect(r.title).toBeTruthy();
      expect(r.description).toBeTruthy();
      expect(['good', 'ok', 'poor']).toContain(r.status);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.maxScore).toBeGreaterThan(0);
    }
  });
});
