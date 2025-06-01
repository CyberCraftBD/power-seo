import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSemrushClient } from '../semrush/client.js';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createSemrushClient', () => {
  describe('getDomainOverview', () => {
    it('should return parsed domain overview', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ Or: 5000, Ot: 10000, Oc: 500, Ad: 100, At: 200, Ac: 50, Bk: 3000, As: 45 }],
          total: 1,
        }),
      });

      const client = createSemrushClient('test-key', { maxRetries: 0 });
      const result = await client.getDomainOverview('example.com');

      expect(result.domain).toBe('example.com');
      expect(result.organicKeywords).toBe(5000);
      expect(result.organicTraffic).toBe(10000);
      expect(result.authorityScore).toBe(45);
    });

    it('should use custom database', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ Or: 0, Ot: 0, Oc: 0, Ad: 0, At: 0, Ac: 0, Bk: 0, As: 0 }],
          total: 1,
        }),
      });

      const client = createSemrushClient('key', { maxRetries: 0 });
      await client.getDomainOverview('example.com', 'uk');

      const [url] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
      expect(url).toContain('database=uk');
    });
  });

  describe('getOrganicKeywords', () => {
    it('should return paginated keywords', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              Ph: 'seo tools',
              Po: 3,
              Pp: 5,
              Nq: 12000,
              Cp: 2.5,
              Ur: 'https://example.com/tools',
              Tr: 500,
              Td: 5.2,
              Tc: 1250,
              Co: 0.8,
            },
          ],
          total: 50,
        }),
      });

      const client = createSemrushClient('key', { maxRetries: 0 });
      const result = await client.getOrganicKeywords('example.com', { limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.keyword).toBe('seo tools');
      expect(result.data[0]?.position).toBe(3);
      expect(result.total).toBe(50);
    });
  });

  describe('getBacklinks', () => {
    it('should return paginated backlinks', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              source_url: 'https://blog.com/post',
              target_url: 'https://example.com',
              anchor: 'example',
              nofollow: false,
              first_seen: '2024-01-01',
              last_seen: '2024-06-01',
              source_ascore: 55,
            },
          ],
          total: 100,
        }),
      });

      const client = createSemrushClient('key', { maxRetries: 0 });
      const result = await client.getBacklinks('example.com');

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.sourceUrl).toBe('https://blog.com/post');
      expect(result.data[0]?.isNoFollow).toBe(false);
    });
  });

  describe('getKeywordDifficulty', () => {
    it('should return keyword difficulty data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            { Ph: 'seo', Kd: 72, Nq: 100000, Cp: 3.0, Co: 0.9, Nr: 500000 },
            { Ph: 'seo tools', Kd: 55, Nq: 12000, Cp: 2.5, Co: 0.8, Nr: 200000 },
          ],
          total: 2,
        }),
      });

      const client = createSemrushClient('key', { maxRetries: 0 });
      const result = await client.getKeywordDifficulty(['seo', 'seo tools']);

      expect(result).toHaveLength(2);
      expect(result[0]?.difficulty).toBe(72);
      expect(result[1]?.keyword).toBe('seo tools');
    });
  });

  describe('getRelatedKeywords', () => {
    it('should return related keywords', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ Ph: 'seo optimization', Nq: 5000, Cp: 2.0, Co: 0.7, Nr: 100000, Rr: 'seo' }],
          total: 1,
        }),
      });

      const client = createSemrushClient('key', { maxRetries: 0 });
      const result = await client.getRelatedKeywords('seo');

      expect(result).toHaveLength(1);
      expect(result[0]?.keyword).toBe('seo optimization');
      expect(result[0]?.relatedTo).toBe('seo');
    });
  });
});
