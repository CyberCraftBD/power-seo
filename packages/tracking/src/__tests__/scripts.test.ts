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
    const script = buildPostHogScript({ apiKey: 'phc_key', host: 'https://ph.example.com' });
    expect(script.innerHTML).toContain('https://ph.example.com');
  });
});

describe('script builder XSS hardening (issue #139)', () => {
  it('should reject a GA4 measurementId that breaks out of the inline script', () => {
    expect(() =>
      buildGA4Script({ measurementId: "G-1234'});document.location='//evil'//" }),
    ).toThrow(/Invalid GA4 measurementId/);
  });

  it('should accept a valid GA4 measurementId', () => {
    expect(() => buildGA4Script({ measurementId: 'G-ABC123' })).not.toThrow();
  });

  it('should reject a Clarity projectId that breaks out of the inline script', () => {
    expect(() => buildClarityScript({ projectId: 'abc");evil();//' })).toThrow(
      /Invalid Clarity projectId/,
    );
  });

  it('should accept a valid Clarity projectId', () => {
    expect(() => buildClarityScript({ projectId: 'abc123' })).not.toThrow();
  });

  it('should reject a PostHog apiKey that breaks out of the inline script', () => {
    expect(() => buildPostHogScript({ apiKey: "phc_x'});document.location='//evil'//" })).toThrow(
      /Invalid PostHog apiKey/,
    );
  });

  it('should reject a PostHog host that breaks out of the inline script', () => {
    expect(() => buildPostHogScript({ apiKey: 'phc_key', host: "https://x'});evil();//" })).toThrow(
      /Invalid PostHog host/,
    );
  });

  it('should reject a valid-URL PostHog host that carries a </script> breakout in its path', () => {
    expect(() =>
      buildPostHogScript({
        apiKey: 'phc_key',
        host: 'https://x.com/</script><script>alert(1)</script>',
      }),
    ).toThrow(/Invalid PostHog host/);
  });

  it('should reject a PostHog host with a path, query, or credentials', () => {
    expect(() => buildPostHogScript({ apiKey: 'phc_key', host: 'https://x.com/path' })).toThrow(
      /Invalid PostHog host/,
    );
    expect(() => buildPostHogScript({ apiKey: 'phc_key', host: 'https://x.com/?a=b' })).toThrow(
      /Invalid PostHog host/,
    );
    expect(() => buildPostHogScript({ apiKey: 'phc_key', host: 'https://u:p@x.com' })).toThrow(
      /Invalid PostHog host/,
    );
  });

  it('should accept a bare-origin PostHog host with or without a trailing slash', () => {
    expect(() =>
      buildPostHogScript({ apiKey: 'phc_key', host: 'https://ph.example.com' }),
    ).not.toThrow();
    expect(() =>
      buildPostHogScript({ apiKey: 'phc_key', host: 'https://ph.example.com/' }),
    ).not.toThrow();
    expect(() =>
      buildPostHogScript({ apiKey: 'phc_key', host: 'https://ph.example.com:8000' }),
    ).not.toThrow();
  });

  it('should accept a valid PostHog apiKey', () => {
    expect(() => buildPostHogScript({ apiKey: 'phc_abc123' })).not.toThrow();
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
