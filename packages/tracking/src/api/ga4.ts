// @power-seo/tracking — GA4 API Client
// ----------------------------------------------------------------------------

import type { GA4Client, GA4ReportResponse, GA4ReportRow, GA4Metadata } from '../types.js';

const GA4_BASE = 'https://analyticsdata.googleapis.com/v1beta';

export function createGA4Client(accessToken: string): GA4Client {
  async function request<T>(url: string, body?: unknown): Promise<T> {
    const response = await globalThis.fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GA4 API error: ${response.status} ${text}`);
    }

    return (await response.json()) as T;
  }

  return {
    async queryReport(propertyId, req) {
      const body = {
        dateRanges: [{ startDate: req.startDate, endDate: req.endDate }],
        metrics: req.metrics.map((m) => ({ name: m })),
        dimensions: (req.dimensions ?? []).map((d) => ({ name: d })),
        limit: req.limit ?? 1000,
      };

      const raw = await request<{
        rows?: Array<{
          dimensionValues?: Array<{ value: string }>;
          metricValues?: Array<{ value: string }>;
        }>;
        rowCount?: number;
        metricHeaders?: Array<{ name: string; type: string }>;
      }>(`${GA4_BASE}/properties/${propertyId}:runReport`, body);

      const rows: GA4ReportRow[] = (raw.rows ?? []).map((r) => ({
        dimensions: (r.dimensionValues ?? []).map((d) => d.value),
        metrics: (r.metricValues ?? []).map((m) => Number(m.value)),
      }));

      return {
        rows,
        rowCount: raw.rowCount ?? rows.length,
        metadata: raw.metricHeaders ? { metricHeaders: raw.metricHeaders } : undefined,
      } satisfies GA4ReportResponse;
    },

    async getRealtimeReport(propertyId, metrics) {
      const body = {
        metrics: metrics.map((m) => ({ name: m })),
      };

      const raw = await request<{
        rows?: Array<{
          dimensionValues?: Array<{ value: string }>;
          metricValues?: Array<{ value: string }>;
        }>;
        rowCount?: number;
      }>(`${GA4_BASE}/properties/${propertyId}:runRealtimeReport`, body);

      const rows: GA4ReportRow[] = (raw.rows ?? []).map((r) => ({
        dimensions: (r.dimensionValues ?? []).map((d) => d.value),
        metrics: (r.metricValues ?? []).map((m) => Number(m.value)),
      }));

      return { rows, rowCount: raw.rowCount ?? rows.length } satisfies GA4ReportResponse;
    },

    async getMetadata(propertyId) {
      const raw = await request<{
        dimensions?: Array<{ apiName: string; uiName: string; description: string }>;
        metrics?: Array<{ apiName: string; uiName: string; description: string; type: string }>;
      }>(`${GA4_BASE}/properties/${propertyId}/metadata`);

      return {
        dimensions: raw.dimensions ?? [],
        metrics: raw.metrics ?? [],
      } satisfies GA4Metadata;
    },
  };
}
