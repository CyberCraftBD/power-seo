import { describe, it, expect } from 'vitest';
import { buildGA4Script } from '../scripts/ga4.js';
import { buildClarityScript } from '../scripts/clarity.js';
import { buildPostHogScript } from '../scripts/posthog.js';
import { buildPlausibleScript } from '../scripts/plausible.js';
import { buildFathomScript } from '../scripts/fathom.js';
import type { ConsentState } from '../types.js';

const grantedConsent: ConsentState = {
  necessary: true,
  analytics: true,
  marketing: true,
  preferences: true,
};
const deniedConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

describe('buildGA4Script', () => {
  it('should return multiple ScriptConfig items with consent mode v2', () => {
    const scripts = buildGA4Script({ measurementId: 'G-XXXXXX' });
    expect(scripts.length).toBeGreaterThanOrEqual(3);
    expect(scripts[0]?.consentCategory).toBe('necessary');
    expect(scripts[0]?.innerHTML).toContain('consent');
  });

  it('should include measurement ID in src', () => {
    const scripts = buildGA4Script({ measurementId: 'G-TEST123' });
    const gtagScript = scripts.find((s) => s.src);
    expect(gtagScript?.src).toContain('G-TEST123');
  });

  it('should gate analytics scripts behind consent', () => {
    const scripts = buildGA4Script({ measurementId: 'G-XXXXXX' });
    const analyticsScripts = scripts.filter((s) => s.consentCategory === 'analytics');
    expect(analyticsScripts.every((s) => s.shouldLoad(grantedConsent))).toBe(true);
    expect(analyticsScripts.every((s) => !s.shouldLoad(deniedConsent))).toBe(true);
  });

  it('should skip consent mode when disabled', () => {
    const scripts = buildGA4Script({ measurementId: 'G-XXXXXX', consentModeV2: false });
    expect(scripts.length).toBe(2);
  });
});

describe('buildClarityScript', () => {
  it('should return ScriptConfig with project ID', () => {
    const script = buildClarityScript({ projectId: 'abc123' });
    expect(script.id).toContain('abc123');
    expect(script.innerHTML).toContain('abc123');
    expect(script.consentCategory).toBe('analytics');
  });

  it('should gate behind analytics consent', () => {
    const script = buildClarityScript({ projectId: 'abc' });
    expect(script.shouldLoad(grantedConsent)).toBe(true);
    expect(script.shouldLoad(deniedConsent)).toBe(false);
  });
});

describe('buildPostHogScript', () => {
  it('should return ScriptConfig with API key', () => {
    const script = buildPostHogScript({ apiKey: 'phc_key' });
    expect(script.innerHTML).toContain('phc_key');
    expect(script.consentCategory).toBe('analytics');
  });

  it('should use custom host', () => {
    const script = buildPostHogScript({ apiKey: 'key', host: 'https://ph.example.com' });
    expect(script.innerHTML).toContain('https://ph.example.com');
  });
});

describe('buildPlausibleScript', () => {
  it('should return ScriptConfig with domain', () => {
    const script = buildPlausibleScript({ domain: 'example.com' });
    expect(script.src).toBe('https://plausible.io/js/script.js');
    expect(script.attributes?.['data-domain']).toBe('example.com');
    expect(script.defer).toBe(true);
  });

  it('should support self-hosted URL', () => {
    const script = buildPlausibleScript({
      domain: 'example.com',
      selfHostedUrl: 'https://stats.example.com/',
    });
    expect(script.src).toBe('https://stats.example.com/js/script.js');
  });
});

describe('buildFathomScript', () => {
  it('should return ScriptConfig with site ID', () => {
    const script = buildFathomScript({ siteId: 'ABCDEF' });
    expect(script.src).toBe('https://cdn.usefathom.com/script.js');
    expect(script.attributes?.['data-site']).toBe('ABCDEF');
    expect(script.defer).toBe(true);
  });
});
