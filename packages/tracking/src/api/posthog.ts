// @power-seo/tracking — PostHog API Client
// ----------------------------------------------------------------------------

import type {
  PostHogClient,
  PostHogEvent,
  PostHogTrendResult,
  PostHogFunnelStep,
} from '../types.js';

const POSTHOG_BASE = 'https://us.posthog.com/api';

export function createPostHogClient(apiKey: string, host?: string): PostHogClient {
  const baseUrl = host ? `${host.replace(/\/$/, '')}/api` : POSTHOG_BASE;

  async function request<T>(path: string, body?: unknown): Promise<T> {
    const response = await globalThis.fetch(`${baseUrl}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`PostHog API error: ${response.status} ${text}`);
    }

    return (await response.json()) as T;
  }

  return {
    async queryEvents(projectId, event, limit = 100) {
      const raw = await request<{ results: PostHogEvent[] }>(
        `/projects/${projectId}/events?event=${encodeURIComponent(event)}&limit=${limit}`,
      );
      return raw.results ?? [];
    },

    async getTrends(projectId, events, days = 7) {
      const body = {
        events: events.map((e) => ({ id: e, type: 'events' })),
        date_from: `-${days}d`,
      };
      const raw = await request<{ result: PostHogTrendResult[] }>(
        `/projects/${projectId}/insights/trend`,
        body,
      );
      return raw.result ?? [];
    },

    async getFunnels(projectId, steps) {
      const body = {
        events: steps.map((s) => ({ id: s, type: 'events' })),
      };
      const raw = await request<{ result: PostHogFunnelStep[] }>(
        `/projects/${projectId}/insights/funnel`,
        body,
      );
      return raw.result ?? [];
    },
  };
}
