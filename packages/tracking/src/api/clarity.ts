// ============================================================================
// @ccbd-seo/tracking — Clarity API Client
// ============================================================================

import type {
  ClarityClient,
  ClarityProject,
  ClarityInsight,
  ClarityHeatmapData,
} from '../types.js';

const CLARITY_BASE = 'https://www.clarity.ms/api/v1';

export function createClarityClient(apiKey: string): ClarityClient {
  async function request<T>(path: string): Promise<T> {
    const response = await globalThis.fetch(`${CLARITY_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Clarity API error: ${response.status} ${text}`);
    }

    return (await response.json()) as T;
  }

  return {
    async getProjects() {
      return request<ClarityProject[]>('/projects');
    },

    async getInsights(projectId) {
      return request<ClarityInsight[]>(`/projects/${projectId}/insights`);
    },

    async getHeatmapData(projectId, url) {
      const encodedUrl = encodeURIComponent(url);
      return request<ClarityHeatmapData>(
        `/projects/${projectId}/heatmaps?url=${encodedUrl}`,
      );
    },
  };
}
