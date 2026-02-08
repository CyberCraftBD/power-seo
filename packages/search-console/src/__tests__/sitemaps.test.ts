import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listSitemaps, submitSitemap, deleteSitemap } from '../sitemaps.js';
import type { GSCClient } from '../types.js';

beforeEach(() => {
  vi.clearAllMocks();
});

function createMockClient(): GSCClient {
  return {
    siteUrl: 'https://example.com',
    request: vi.fn(),
  };
}

describe('listSitemaps', () => {
  it('should return sitemap entries', async () => {
    const client = createMockClient();
    (client.request as ReturnType<typeof vi.fn>).mockResolvedValue({
      sitemap: [
        {
          path: 'https://example.com/sitemap.xml',
          isPending: false,
          isSitemapsIndex: false,
          type: 'sitemap',
          warnings: 0,
          errors: 0,
        },
      ],
    });

    const result = await listSitemaps(client);
    expect(result).toHaveLength(1);
    expect(result[0]?.path).toBe('https://example.com/sitemap.xml');
  });

  it('should return empty array when no sitemaps', async () => {
    const client = createMockClient();
    (client.request as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const result = await listSitemaps(client);
    expect(result).toHaveLength(0);
  });

  it('should encode siteUrl in path', async () => {
    const client = createMockClient();
    (client.request as ReturnType<typeof vi.fn>).mockResolvedValue({ sitemap: [] });

    await listSitemaps(client);

    expect(client.request).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('https://example.com')),
    );
  });
});

describe('submitSitemap', () => {
  it('should submit sitemap with PUT', async () => {
    const client = createMockClient();
    (client.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    await submitSitemap(client, 'https://example.com/sitemap.xml');

    expect(client.request).toHaveBeenCalledWith(
      expect.stringContaining('/sitemaps/'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });
});

describe('deleteSitemap', () => {
  it('should delete sitemap with DELETE', async () => {
    const client = createMockClient();
    (client.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    await deleteSitemap(client, 'https://example.com/sitemap.xml');

    expect(client.request).toHaveBeenCalledWith(
      expect.stringContaining('/sitemaps/'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
