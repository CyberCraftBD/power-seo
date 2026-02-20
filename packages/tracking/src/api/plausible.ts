// ============================================================================
// @power-seo/tracking — Plausible API Client
// ============================================================================

import type {
  PlausibleClient,
  PlausibleTimeseriesPoint,
  PlausibleBreakdownEntry,
  PlausibleAggregateResult,
} from '../types.js';

const PLAUSIBLE_BASE = 'https://plausible.io/api/v1';

export function createPlausibleClient(apiKey: string, selfHostedUrl?: string): PlausibleClient {
  const baseUrl = selfHostedUrl
    ? `${selfHostedUrl.replace(/\/$/, '')}/api/v1`
    : PLAUSIBLE_BASE;

  async function request<T>(path: string): Promise<T> {
    const response = await globalThis.fetch(`${baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Plausible API error: ${response.status} ${text}`);
    }

    return (await response.json()) as T;
  }

  return {
    async getTimeseries(siteId, period = '30d') {
      const raw = await request<{ results: PlausibleTimeseriesPoint[] }>(
        `/stats/timeseries?site_id=${encodeURIComponent(siteId)}&period=${period}`,
      );
      return raw.results ?? [];
    },

    async getBreakdown(siteId, property, period = '30d') {
      const raw = await request<{ results: PlausibleBreakdownEntry[] }>(
        `/stats/breakdown?site_id=${encodeURIComponent(siteId)}&property=${encodeURIComponent(property)}&period=${period}`,
      );
      return raw.results ?? [];
    },

    async getAggregate(siteId, period = '30d') {
      const raw = await request<{ results: PlausibleAggregateResult }>(
        `/stats/aggregate?site_id=${encodeURIComponent(siteId)}&period=${period}&metrics=visitors,pageviews,bounce_rate,visit_duration,events`,
      );
      return raw.results;
    },
  };
}
