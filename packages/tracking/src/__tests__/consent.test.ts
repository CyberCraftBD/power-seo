import { describe, it, expect, vi } from 'vitest';
import { createConsentManager } from '../consent.js';

describe('createConsentManager', () => {
  it('should default necessary to true, others false', () => {
    const manager = createConsentManager();
    const state = manager.getState();

    expect(state.necessary).toBe(true);
    expect(state.analytics).toBe(false);
    expect(state.marketing).toBe(false);
    expect(state.preferences).toBe(false);
  });

  it('should accept initial state but keep necessary true', () => {
    const manager = createConsentManager({ analytics: true, necessary: false });
    const state = manager.getState();

    expect(state.necessary).toBe(true);
    expect(state.analytics).toBe(true);
  });

  it('should grant a category', () => {
    const manager = createConsentManager();
    manager.grant('analytics');

    expect(manager.isGranted('analytics')).toBe(true);
  });

  it('should revoke a category', () => {
    const manager = createConsentManager({ analytics: true });
    manager.revoke('analytics');

    expect(manager.isGranted('analytics')).toBe(false);
  });

  it('should not revoke necessary', () => {
    const manager = createConsentManager();
    manager.revoke('necessary');

    expect(manager.isGranted('necessary')).toBe(true);
  });

  it('should grant all categories', () => {
    const manager = createConsentManager();
    manager.grantAll();
    const state = manager.getState();

    expect(state.analytics).toBe(true);
    expect(state.marketing).toBe(true);
    expect(state.preferences).toBe(true);
  });

  it('should revoke all non-necessary categories', () => {
    const manager = createConsentManager({ analytics: true, marketing: true, preferences: true });
    manager.revokeAll();
    const state = manager.getState();

    expect(state.necessary).toBe(true);
    expect(state.analytics).toBe(false);
    expect(state.marketing).toBe(false);
    expect(state.preferences).toBe(false);
  });

  it('should notify on change', () => {
    const manager = createConsentManager();
    const callback = vi.fn();
    manager.onChange(callback);

    manager.grant('analytics');

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ analytics: true }));
  });

  it('should unsubscribe from onChange', () => {
    const manager = createConsentManager();
    const callback = vi.fn();
    const unsubscribe = manager.onChange(callback);

    unsubscribe();
    manager.grant('analytics');

    expect(callback).not.toHaveBeenCalled();
  });
});
