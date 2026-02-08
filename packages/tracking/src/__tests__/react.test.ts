import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createElement } from 'react';
import { AnalyticsScript, ConsentBanner } from '../react.js';
import { createConsentManager } from '../consent.js';
import type { ScriptConfig, ConsentState } from '../types.js';

const grantedConsent: ConsentState = { necessary: true, analytics: true, marketing: true, preferences: true };
const deniedConsent: ConsentState = { necessary: true, analytics: false, marketing: false, preferences: false };

describe('AnalyticsScript', () => {
  it('should render container when consent is granted', () => {
    const scripts: ScriptConfig[] = [
      {
        id: 'test-script',
        src: 'https://example.com/script.js',
        async: true,
        consentCategory: 'analytics',
        shouldLoad: (c: ConsentState) => c.analytics,
      },
    ];

    render(createElement(AnalyticsScript, { scripts, consent: grantedConsent }));
    // jsdom suppresses <script> elements, but the wrapper div should be rendered
    const container = screen.getByTestId('analytics-scripts');
    expect(container).toBeDefined();
  });

  it('should not render scripts when consent is denied', () => {
    const scripts: ScriptConfig[] = [
      {
        id: 'test-script',
        src: 'https://example.com/script.js',
        consentCategory: 'analytics',
        shouldLoad: (c: ConsentState) => c.analytics,
      },
    ];

    const { container } = render(createElement(AnalyticsScript, { scripts, consent: deniedConsent }));
    expect(container.querySelector('[data-testid="analytics-scripts"]')).toBeNull();
  });

  it('should render inline scripts container', () => {
    const scripts: ScriptConfig[] = [
      {
        id: 'inline-script',
        innerHTML: 'console.log("hello")',
        consentCategory: 'necessary',
        shouldLoad: () => true,
      },
    ];

    render(createElement(AnalyticsScript, { scripts, consent: grantedConsent }));
    // jsdom suppresses <script> elements, but the wrapper div should be rendered
    const container = screen.getByTestId('analytics-scripts');
    expect(container).toBeDefined();
  });
});

describe('ConsentBanner', () => {
  it('should render banner when analytics not granted', () => {
    const manager = createConsentManager();
    render(createElement(ConsentBanner, { manager }));

    expect(screen.getByTestId('consent-banner')).toBeDefined();
    expect(screen.getByText(/cookies/i)).toBeDefined();
  });

  it('should call grantAll when accept is clicked', () => {
    const manager = createConsentManager();
    render(createElement(ConsentBanner, { manager }));

    fireEvent.click(screen.getByTestId('consent-accept'));

    expect(manager.isGranted('analytics')).toBe(true);
    expect(manager.isGranted('marketing')).toBe(true);
  });

  it('should call revokeAll when reject is clicked', () => {
    const manager = createConsentManager();
    render(createElement(ConsentBanner, { manager }));

    fireEvent.click(screen.getByTestId('consent-reject'));

    expect(manager.isGranted('analytics')).toBe(false);
    expect(manager.isGranted('marketing')).toBe(false);
  });

  it('should render privacy policy link when provided', () => {
    const manager = createConsentManager();
    render(createElement(ConsentBanner, { manager, privacyPolicyUrl: 'https://example.com/privacy' }));

    const link = screen.getByText('Privacy Policy');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://example.com/privacy');
  });
});
