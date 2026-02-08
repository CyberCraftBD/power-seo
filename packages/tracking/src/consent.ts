// ============================================================================
// @ccbd-seo/tracking — Consent Manager
// ============================================================================

import type { ConsentState, ConsentCategory, ConsentManager, ConsentChangeCallback } from './types.js';

const DEFAULT_STATE: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

export function createConsentManager(
  initial?: Partial<ConsentState>,
): ConsentManager {
  const state: ConsentState = {
    ...DEFAULT_STATE,
    ...initial,
    necessary: true, // necessary cannot be overridden
  };

  const listeners = new Set<ConsentChangeCallback>();

  function notify(): void {
    for (const cb of listeners) {
      cb({ ...state });
    }
  }

  return {
    getState() {
      return { ...state };
    },

    grant(category: ConsentCategory) {
      if (state[category]) return; // already granted
      state[category] = true;
      notify();
    },

    revoke(category: ConsentCategory) {
      if (category === 'necessary') return; // cannot revoke necessary
      if (!state[category]) return; // already revoked
      state[category] = false;
      notify();
    },

    grantAll() {
      state.analytics = true;
      state.marketing = true;
      state.preferences = true;
      notify();
    },

    revokeAll() {
      state.analytics = false;
      state.marketing = false;
      state.preferences = false;
      notify();
    },

    isGranted(category: ConsentCategory) {
      return state[category];
    },

    onChange(callback: ConsentChangeCallback) {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
  };
}
