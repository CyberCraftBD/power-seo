// @power-seo/tracking — React Components
// ----------------------------------------------------------------------------

import { createElement, useEffect, useState, useCallback } from 'react';
import type { ScriptConfig, ConsentManager, ConsentState } from './types.js';

// --- AnalyticsScript ---

export interface AnalyticsScriptProps {
  scripts: ScriptConfig[];
  consent: ConsentState;
}

export function AnalyticsScript({ scripts, consent }: AnalyticsScriptProps) {
  const loadable = scripts.filter((s) => s.shouldLoad(consent));

  if (loadable.length === 0) return null;

  return createElement(
    'div',
    { 'data-testid': 'analytics-scripts' },
    ...loadable.map((script) =>
      script.src
        ? createElement('script', {
            key: script.id,
            src: script.src,
            async: script.async ?? false,
            defer: script.defer ?? false,
            ...Object.fromEntries(Object.entries(script.attributes ?? {}).map(([k, v]) => [k, v])),
          })
        : createElement('script', {
            key: script.id,
            dangerouslySetInnerHTML: { __html: script.innerHTML ?? '' },
          }),
    ),
  );
}

// --- ConsentBanner ---

export interface ConsentBannerProps {
  manager: ConsentManager;
  privacyPolicyUrl?: string;
}

export function ConsentBanner({ manager, privacyPolicyUrl }: ConsentBannerProps) {
  const [state, setState] = useState<ConsentState>(manager.getState());
  const [visible, setVisible] = useState(!state.analytics);

  useEffect(() => {
    return manager.onChange((newState) => {
      setState(newState);
    });
  }, [manager]);

  const handleAcceptAll = useCallback(() => {
    manager.grantAll();
    setVisible(false);
  }, [manager]);

  const handleRejectAll = useCallback(() => {
    manager.revokeAll();
    setVisible(false);
  }, [manager]);

  if (!visible) return null;

  return createElement(
    'div',
    {
      'data-testid': 'consent-banner',
      role: 'dialog',
      'aria-label': 'Cookie consent',
      style: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        backgroundColor: '#fff',
        borderTop: '1px solid #e0e0e0',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        zIndex: 9999,
      },
    },
    createElement(
      'div',
      { style: { flex: 1 } },
      createElement(
        'p',
        { style: { margin: 0, color: '#333' } },
        'We use cookies to improve your experience and analyze site traffic.',
        privacyPolicyUrl
          ? createElement(
              'a',
              {
                href: privacyPolicyUrl,
                style: { marginLeft: '4px', color: '#1a73e8', textDecoration: 'underline' },
                target: '_blank',
                rel: 'noopener noreferrer',
              },
              'Privacy Policy',
            )
          : null,
      ),
    ),
    createElement(
      'div',
      { style: { display: 'flex', gap: '8px', flexShrink: 0 } },
      createElement(
        'button',
        {
          'data-testid': 'consent-reject',
          onClick: handleRejectAll,
          style: {
            padding: '8px 16px',
            border: '1px solid #dadce0',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#333',
          },
        },
        'Reject All',
      ),
      createElement(
        'button',
        {
          'data-testid': 'consent-accept',
          onClick: handleAcceptAll,
          style: {
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#1a73e8',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
          },
        },
        'Accept All',
      ),
    ),
  );
}
