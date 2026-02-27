import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGA4Client } from '../api/ga4.js';
import { createClarityClient } from '../api/clarity.js';
import { createPostHogClient } from '../api/posthog.js';
import { createPlausibleClient } from '../api/plausible.js';
import { createFathomClient } from '../api/fathom.js';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GA4 Client', () => {
  it('should query a report', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rows: [{ dimensionValues: [{ value: '/page' }], metricValues: [{ value: '100' }] }],
        rowCount: 1,
      }),
    });

    const client = createGA4Client('token');
    const result = await client.queryReport('12345', {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      metrics: ['sessions'],
      dimensions: ['pagePath'],
    });

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.dimensions[0]).toBe('/page');
    expect(result.rows[0]?.metrics[0]).toBe(100);
  });

  it('should get realtime report', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rows: [{ metricValues: [{ value: '42' }] }],
        rowCount: 1,
      }),
    });

    const client = createGA4Client('token');
    const result = await client.getRealtimeReport('12345', ['activeUsers']);

    expect(result.rows[0]?.metrics[0]).toBe(42);
  });

  it('should get metadata', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        dimensions: [{ apiName: 'date', uiName: 'Date', description: 'The date' }],
        metrics: [
          {
            apiName: 'sessions',
            uiName: 'Sessions',
            description: 'Session count',
            type: 'INTEGER',
          },
        ],
      }),
    });

    const client = createGA4Client('token');
    const result = await client.getMetadata('12345');

    expect(result.dimensions).toHaveLength(1);
    expect(result.metrics).toHaveLength(1);
  });
});

describe('Clarity Client', () => {
  it('should get projects', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 'proj1', name: 'My Site', url: 'https://example.com' }],
    });

    const client = createClarityClient('api-key');
    const result = await client.getProjects();

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('My Site');
  });

  it('should get insights', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ type: 'rage_clicks', value: 15, label: 'Rage Clicks', trend: 'up' }],
    });

    const client = createClarityClient('api-key');
    const result = await client.getInsights('proj1');

    expect(result[0]?.type).toBe('rage_clicks');
  });
});

describe('PostHog Client', () => {
  it('should query events', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { event: 'pageview', timestamp: '2024-01-15T10:00:00Z', properties: { url: '/page' } },
        ],
      }),
    });

    const client = createPostHogClient('phc_key');
    const result = await client.queryEvents('proj1', 'pageview');

    expect(result).toHaveLength(1);
    expect(result[0]?.event).toBe('pageview');
  });

  it('should get trends', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: [
          {
            label: 'pageview',
            data: [10, 20, 30],
            days: ['2024-01-01', '2024-01-02', '2024-01-03'],
          },
        ],
      }),
    });

    const client = createPostHogClient('phc_key');
    const result = await client.getTrends('proj1', ['pageview']);

    expect(result[0]?.label).toBe('pageview');
  });
});

describe('Plausible Client', () => {
  it('should get timeseries', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { date: '2024-01-15', visitors: 100, pageviews: 250, bounceRate: 45, visitDuration: 120 },
        ],
      }),
    });

    const client = createPlausibleClient('api-key');
    const result = await client.getTimeseries('example.com');

    expect(result[0]?.visitors).toBe(100);
  });

  it('should use self-hosted URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const client = createPlausibleClient('key', 'https://stats.example.com');
    await client.getTimeseries('example.com');

    const [url] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    expect(url).toContain('stats.example.com');
  });
});

describe('Fathom Client', () => {
  it('should get sites', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ id: 'ABCDEF', name: 'My Site', sharing: 'none' }],
      }),
    });

    const client = createFathomClient('api-key');
    const result = await client.getSites();

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('ABCDEF');
  });

  it('should get pageviews', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          { pathname: '/home', pageviews: 500, visitors: 300, avgDuration: 45, bounceRate: 40 },
        ],
      }),
    });

    const client = createFathomClient('api-key');
    const result = await client.getPageviews('ABCDEF');

    expect(result[0]?.pageviews).toBe(500);
  });
});
