import { describe, it, expect } from 'vitest';
import { countDistinctMatches } from '../pattern-utils.js';

describe('countDistinctMatches', () => {
  it('counts non-overlapping matches across multiple patterns', () => {
    const text = 'we achieved results and we measured impact';
    const patterns = [/\bwe\s+achieved\b/gi, /\bwe\s+measured\b/gi];
    expect(countDistinctMatches(text, patterns)).toBe(2);
  });

  it('counts multiple occurrences of a single pattern', () => {
    const text = 'for example one thing, and for example another';
    expect(countDistinctMatches(text, [/\bfor\s+example\b/gi])).toBe(2);
  });

  it('merges overlapping matches from different patterns into one count', () => {
    const text = 'the problem was severe';
    const patterns = [/\bthe\s+problem\s+was\b/gi, /\bproblem\s+was\s+severe\b/gi];
    expect(countDistinctMatches(text, patterns)).toBe(1);
  });

  it('merges a chain of overlapping spans into one count', () => {
    const text = 'abcde';
    const patterns = [/abc/g, /bcd/g, /cde/g];
    expect(countDistinctMatches(text, patterns)).toBe(1);
  });

  it('counts adjacent but non-overlapping matches separately', () => {
    const text = 'abcdef';
    const patterns = [/abc/g, /def/g];
    expect(countDistinctMatches(text, patterns)).toBe(2);
  });

  it('returns 0 for empty text', () => {
    expect(countDistinctMatches('', [/\bfoo\b/gi, /\bbar\b/gi])).toBe(0);
  });

  it('returns 0 when nothing matches', () => {
    expect(countDistinctMatches('hello world', [/\bfoo\b/gi])).toBe(0);
  });

  it('handles patterns without the /g flag safely (no infinite loop, correct count)', () => {
    const text = 'foo bar foo baz foo';
    expect(countDistinctMatches(text, [/foo/])).toBe(3);
  });

  it('handles zero-length-match patterns without hanging', () => {
    const text = 'ab';
    expect(countDistinctMatches(text, [/x*/g])).toBeGreaterThanOrEqual(0);
  });

  it('resets lastIndex so repeated calls give consistent results', () => {
    const pattern = /foo/g;
    const text = 'foo foo';
    expect(countDistinctMatches(text, [pattern])).toBe(2);
    expect(countDistinctMatches(text, [pattern])).toBe(2);
  });
});
