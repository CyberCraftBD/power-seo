import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAhrefsClient } from '../ahrefs/client.js';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createAhrefsClient', () => {
  describe('getSiteOverview', () => {
    it('should return parsed site overview', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              domain_rating: 65,
              url_rating: 55,
              backlinks: 10000,
              referring_domains: 500,
              organic_keywords: 3000,
              organic_traffic: 8000,
              traffic_value: 15000,
            },
          ],
          total: 1,
        }),
      });

      const client = createAhrefsClient('test-token', { maxRetries: 0 });
      const result = await client.getSiteOverview('example.com');

      expect(result.domain).toBe('example.com');
      expect(result.domainRating).toBe(65);
      expect(result.referringDomains).toBe(500);
      expect(result.trafficValue).toBe(15000);
    });

    it('should use bearer auth', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              domain_rating: 0,
              url_rating: 0,
              backlinks: 0,
              referring_domains: 0,
              organic_keywords: 0,
              organic_traffic: 0,
              traffic_value: 0,
            },
          ],
          total: 1,
        }),
      });

      const client = createAhrefsClient('my-bearer-token', { maxRetries: 0 });
      await client.getSiteOverview('example.com');

      const [, options] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
      expect((options.headers as Record<string, string>)['Authorization']).toBe(
        'Bearer my-bearer-token',
      );
    });
  });

  describe('getOrganicKeywords', () => {
    it('should return paginated keywords', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              keyword: 'seo tips',
              position: 5,
              volume: 8000,
              cpc: 1.5,
              url: 'https://example.com/tips',
              traffic: 300,
              traffic_percent: 3.8,
              difficulty: 40,
            },
          ],
          total: 200,
        }),
      });

      const client = createAhrefsClient('token', { maxRetries: 0 });
      const result = await client.getOrganicKeywords('example.com', { limit: 50, offset: 0 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.keyword).toBe('seo tips');
      expect(result.data[0]?.searchVolume).toBe(8000);
      expect(result.total).toBe(200);
    });
  });

  describe('getBacklinks', () => {
    it('should return paginated backlinks', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              url_from: 'https://blog.com/article',
              url_to: 'https://example.com',
              anchor: 'click here',
              domain_rating: 45,
              url_rating: 30,
              is_dofollow: true,
              first_seen: '2024-02-01',
              last_seen: '2024-06-15',
            },
          ],
          total: 500,
        }),
      });

      const client = createAhrefsClient('token', { maxRetries: 0 });
      const result = await client.getBacklinks('example.com');

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.sourceUrl).toBe('https://blog.com/article');
      expect(result.data[0]?.isDoFollow).toBe(true);
    });
  });

  describe('getKeywordDifficulty', () => {
    it('should return keyword difficulty data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              keyword: 'seo',
              difficulty: 80,
              volume: 100000,
              cpc: 3.5,
              clicks: 50000,
              global_volume: 500000,
            },
          ],
          total: 1,
        }),
      });

      const client = createAhrefsClient('token', { maxRetries: 0 });
      const result = await client.getKeywordDifficulty(['seo']);

      expect(result).toHaveLength(1);
      expect(result[0]?.difficulty).toBe(80);
      expect(result[0]?.globalVolume).toBe(500000);
    });
  });

  describe('getReferringDomains', () => {
    it('should return paginated referring domains', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              domain: 'blog.com',
              domain_rating: 55,
              backlinks: 12,
              first_seen: '2023-06-01',
              last_seen: '2024-06-01',
              is_dofollow: true,
            },
          ],
          total: 300,
        }),
      });

      const client = createAhrefsClient('token', { maxRetries: 0 });
      const result = await client.getReferringDomains('example.com');

      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.domain).toBe('blog.com');
      expect(result.data[0]?.domainRating).toBe(55);
      expect(result.total).toBe(300);
    });
  });
});
