import { describe, it, expect, vi, beforeEach } from 'vitest';
import { querySearchAnalytics, querySearchAnalyticsAll } from '../analytics.js';
import type { GSCClient, SearchAnalyticsResponse } from '../types.js';

function createMockClient(responses: SearchAnalyticsResponse[]): GSCClient {
  let callIndex = 0;
  return {
    siteUrl: 'https://example.com',
    request: vi.fn().mockImplementation(async () => {
      const resp = responses[callIndex] ?? { rows: [], responseAggregationType: 'auto' };
      callIndex++;
      return resp;
    }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('querySearchAnalytics', () => {
  it('should send correct request body', async () => {
    const client = createMockClient([
      {
        rows: [{ keys: ['test'], clicks: 10, impressions: 100, ctr: 0.1, position: 5 }],
        responseAggregationType: 'auto',
      },
    ]);

    const result = await querySearchAnalytics(client, {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      dimensions: ['query'],
    });

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.clicks).toBe(10);
    expect(client.request).toHaveBeenCalledWith(
      expect.stringContaining('/searchAnalytics/query'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('should cap rowLimit to 25000', async () => {
    const client = createMockClient([{ rows: [], responseAggregationType: 'auto' }]);

    await querySearchAnalytics(client, {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      rowLimit: 50000,
    });

    const [, options] = (client.request as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      { body: { rowLimit: number } },
    ];
    expect(options.body.rowLimit).toBe(25000);
  });

  it('should use default rowLimit of 1000', async () => {
    const client = createMockClient([{ rows: [], responseAggregationType: 'auto' }]);

    await querySearchAnalytics(client, {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    });

    const [, options] = (client.request as ReturnType<typeof vi.fn>).mock.calls[0] as [
      string,
      { body: { rowLimit: number } },
    ];
    expect(options.body.rowLimit).toBe(1000);
  });
});

describe('querySearchAnalyticsAll', () => {
  it('should paginate through all results', async () => {
    const page1Rows = Array.from({ length: 25000 }, (_, i) => ({
      keys: [`query-${i}`],
      clicks: 1,
      impressions: 10,
      ctr: 0.1,
      position: 5,
    }));
    const page2Rows = Array.from({ length: 100 }, (_, i) => ({
      keys: [`query-extra-${i}`],
      clicks: 1,
      impressions: 10,
      ctr: 0.1,
      position: 5,
    }));

    const client = createMockClient([
      { rows: page1Rows, responseAggregationType: 'auto' },
      { rows: page2Rows, responseAggregationType: 'auto' },
    ]);

    const result = await querySearchAnalyticsAll(client, {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      dimensions: ['query'],
    });

    expect(result).toHaveLength(25100);
    expect(client.request).toHaveBeenCalledTimes(2);
  });

  it('should return single page results without extra requests', async () => {
    const client = createMockClient([
      {
        rows: [{ keys: ['test'], clicks: 5, impressions: 50, ctr: 0.1, position: 3 }],
        responseAggregationType: 'auto',
      },
    ]);

    const result = await querySearchAnalyticsAll(client, {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    });

    expect(result).toHaveLength(1);
    expect(client.request).toHaveBeenCalledOnce();
  });
});
