// Tests for the expectedIntent override (analyzeContent input) and the
// diminishing-returns match counting used by E-E-A-T/AEO checks (#152).
import { describe, it, expect } from 'vitest';
import { analyzeContent, detectIntent } from '../index.js';
import { countEffectiveMatches } from '@power-seo/core';
import { checkExperienceDepth } from '../checks/eeat-experience-depth.js';

const filler = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');

describe('expectedIntent override', () => {
  it('detectIntent auto-detects when no override is active', () => {
    expect(detectIntent('how to learn react').primary).toBe('informational');
    expect(detectIntent('buy running shoes').primary).toBe('transactional');
  });

  it('analyzeContent scores against the expected intent instead of auto-detection', () => {
    const out = analyzeContent({
      title: 'How to learn React',
      content: `<p>${filler(300)}</p>`,
      focusKeyphrase: 'how to learn react',
      expectedIntent: 'commercial',
    });
    const cls = out.results.find((r) => r.id === 'intent-keyword-classification');
    expect(cls).toBeDefined();
    expect(cls!.description.toLowerCase()).toContain('commercial');
  });

  it('accepts the internal taxonomy value directly', () => {
    const out = analyzeContent({
      title: 'How to learn React',
      content: `<p>${filler(300)}</p>`,
      focusKeyphrase: 'how to learn react',
      expectedIntent: 'commercial-investigation',
    });
    const cls = out.results.find((r) => r.id === 'intent-keyword-classification');
    expect(cls!.description.toLowerCase()).toContain('commercial');
  });

  it('clears the override after the run (no leakage between analyses)', () => {
    analyzeContent({
      content: `<p>${filler(200)}</p>`,
      focusKeyphrase: 'buy running shoes',
      expectedIntent: 'informational',
    });
    expect(detectIntent('buy running shoes').primary).toBe('transactional');
  });
});

describe('diminishing returns for repeated signal phrases (#152)', () => {
  it('repeats of one phrase earn log-scaled credit, variety earns full credit', () => {
    const stuffed = 'I tested. I tested. I tested. I tested.';
    const varied = 'I tested. I used. I tried. I noticed.';
    const patterns = [/\bi\s+tested\b/gi, /\bi\s+used\b/gi, /\bi\s+tried\b/gi, /\bi\s+noticed\b/gi];
    // 4 identical repeats -> 1 + log2(4) = 3
    expect(countEffectiveMatches(stuffed, patterns)).toBeCloseTo(3, 5);
    // 4 distinct phrases -> full credit
    expect(countEffectiveMatches(varied, patterns)).toBeCloseTo(4, 5);
  });

  it('experience-depth: a stuffed phrase cannot outscore varied phrasing', () => {
    const base = filler(1500);
    const stuffed = checkExperienceDepth({
      content: `<p>${base} ${'I recommend this. '.repeat(10)}</p>`,
    });
    const varied = checkExperienceDepth({
      content: `<p>${base} I tested it. I used it daily. I noticed gains. In my experience it works. The results showed improvement. When I switched, performance improved. Here's how I set it up. My workflow changed. I measured latency. I compared options.</p>`,
    });
    expect(varied.score).toBeGreaterThanOrEqual(stuffed.score);
    expect(stuffed.status).not.toBe('good');
  });
});
