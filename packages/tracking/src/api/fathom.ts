// ============================================================================
// @power-seo/tracking — Fathom API Client
// ============================================================================

import type {
  FathomClient,
  FathomSite,
  FathomPageview,
  FathomReferrer,
} from '../types.js';

const FATHOM_BASE = 'https://api.usefathom.com/v1';

export function createFathomClient(apiKey: string): FathomClient {
  async function request<T>(path: string): Promise<T> {
    const response = await globalThis.fetch(`${FATHOM_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Fathom API error: ${response.status} ${text}`);
    }

    return (await response.json()) as T;
  }

  return {
    async getSites() {
      const raw = await request<{ data: FathomSite[] }>('/sites');
      return raw.data ?? [];
    },

    async getPageviews(siteId, period = '30d') {
      const raw = await request<{ data: FathomPageview[] }>(
        `/sites/${siteId}/pages?period=${period}`,
      );
      return raw.data ?? [];
    },

    async getReferrers(siteId, period = '30d') {
      const raw = await request<{ data: FathomReferrer[] }>(
        `/sites/${siteId}/referrers?period=${period}`,
      );
      return raw.data ?? [];
    },
  };
}
