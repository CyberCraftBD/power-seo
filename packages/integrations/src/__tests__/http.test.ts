import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHttpClient } from '../http.js';
import { IntegrationApiError } from '../types.js';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createHttpClient', () => {
  it('should make GET requests with query param auth', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'ok' }),
    });

    const client = createHttpClient({
      baseUrl: 'https://api.semrush.com',
      auth: { type: 'query', paramName: 'key', value: 'test-key' },
    });

    const result = await client.get<{ result: string }>('/test', { param1: 'val1' });
    expect(result.result).toBe('ok');

    const [url] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    expect(url).toContain('key=test-key');
    expect(url).toContain('param1=val1');
  });

  it('should make GET requests with bearer auth', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'value' }),
    });

    const client = createHttpClient({
      baseUrl: 'https://api.ahrefs.com/v3',
      auth: { type: 'bearer', token: 'bearer-token' },
    });

    await client.get('/test');

    const [, options] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    expect((options.headers as Record<string, string>)['Authorization']).toBe(
      'Bearer bearer-token',
    );
  });

  it('should make POST requests with body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const client = createHttpClient({
      baseUrl: 'https://api.ahrefs.com/v3',
      auth: { type: 'bearer', token: 'token' },
    });

    await client.post('/endpoint', { key: 'val' });

    const [, options] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ key: 'val' }));
  });

  it('should throw IntegrationApiError on non-retryable errors', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => 'Forbidden',
    });

    const client = createHttpClient({
      baseUrl: 'https://api.semrush.com',
      auth: { type: 'query', paramName: 'key', value: 'bad-key' },
      maxRetries: 0,
    });

    await expect(client.get('/test')).rejects.toThrow(IntegrationApiError);
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

    const client = createHttpClient({
      baseUrl: 'https://api.semrush.com',
      auth: { type: 'query', paramName: 'key', value: 'key' },
      maxRetries: 2,
    });

    const result = await client.get<{ success: boolean }>('/test');
    expect(result.success).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on 5xx errors', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 502,
        text: async () => 'Bad Gateway',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ recovered: true }),
      });

    const client = createHttpClient({
      baseUrl: 'https://api.ahrefs.com/v3',
      auth: { type: 'bearer', token: 'token' },
      maxRetries: 2,
    });

    const result = await client.get<{ recovered: boolean }>('/test');
    expect(result.recovered).toBe(true);
  });

  it('should include provider in error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    const client = createHttpClient({
      baseUrl: 'https://api.semrush.com',
      auth: { type: 'query', paramName: 'key', value: 'bad' },
      maxRetries: 0,
    });

    try {
      await client.get('/test');
    } catch (err) {
      expect(err).toBeInstanceOf(IntegrationApiError);
      expect((err as IntegrationApiError).provider).toBe('semrush');
    }
  });
});
