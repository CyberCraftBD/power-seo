import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGSCClient } from '../client.js';
import { GSCApiError } from '../types.js';
import type { TokenManager } from '../types.js';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

function createMockAuth(): TokenManager {
  return {
    getToken: vi.fn().mockResolvedValue('test-token'),
    invalidate: vi.fn(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createGSCClient', () => {
  it('should make authenticated GET requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'value' }),
    });

    const client = createGSCClient({
      auth: createMockAuth(),
      siteUrl: 'https://example.com',
    });

    const result = await client.request<{ data: string }>('/test');
    expect(result.data).toBe('value');

    const [url, options] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    expect(url).toContain('/test');
    expect((options.headers as Record<string, string>)['Authorization']).toBe('Bearer test-token');
  });

  it('should make POST requests with body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const client = createGSCClient({
      auth: createMockAuth(),
      siteUrl: 'https://example.com',
    });

    await client.request('/endpoint', { method: 'POST', body: { key: 'val' } });

    const [, options] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ key: 'val' }));
  });

  it('should throw GSCApiError on non-retryable errors', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => 'Forbidden',
    });

    const client = createGSCClient({
      auth: createMockAuth(),
      siteUrl: 'https://example.com',
      maxRetries: 0,
    });

    await expect(client.request('/test')).rejects.toThrow(GSCApiError);
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('should retry on 429 errors', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Rate limited',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    const client = createGSCClient({
      auth: createMockAuth(),
      siteUrl: 'https://example.com',
      maxRetries: 2,
    });

    const result = await client.request<{ success: boolean }>('/test');
    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on 5xx errors', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Server Error',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recovered: true }),
      });

    const client = createGSCClient({
      auth: createMockAuth(),
      siteUrl: 'https://example.com',
      maxRetries: 2,
    });

    const result = await client.request<{ recovered: boolean }>('/test');
    expect(result.recovered).toBe(true);
  });

  it('should store siteUrl on client', () => {
    const client = createGSCClient({
      auth: createMockAuth(),
      siteUrl: 'https://example.com',
    });

    expect(client.siteUrl).toBe('https://example.com');
  });
});
