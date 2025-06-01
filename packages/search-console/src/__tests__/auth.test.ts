import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exchangeRefreshToken, getServiceAccountToken, createTokenManager } from '../auth.js';
import { GSCApiError } from '../types.js';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('exchangeRefreshToken', () => {
  it('should exchange refresh token for access token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'test-token', expires_in: 3600 }),
    });

    const result = await exchangeRefreshToken({
      clientId: 'id',
      clientSecret: 'secret',
      refreshToken: 'refresh',
    });

    expect(result.accessToken).toBe('test-token');
    expect(result.expiresAt).toBeGreaterThan(Date.now());
    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    expect(url).toBe('https://oauth2.googleapis.com/token');
    expect(options.method).toBe('POST');
  });

  it('should throw GSCApiError on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });

    await expect(
      exchangeRefreshToken({ clientId: 'id', clientSecret: 'secret', refreshToken: 'bad' }),
    ).rejects.toThrow(GSCApiError);
  });
});

describe('getServiceAccountToken', () => {
  it('should get token via JWT assertion', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'sa-token', expires_in: 3600 }),
    });

    const result = await getServiceAccountToken({
      clientEmail: 'sa@project.iam.gserviceaccount.com',
      privateKeyId: 'key-id',
      signJwt: async () => 'signed-jwt',
    });

    expect(result.accessToken).toBe('sa-token');
    const [, options] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    expect(options.body).toContain('signed-jwt');
  });

  it('should throw GSCApiError on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => 'Forbidden',
    });

    await expect(
      getServiceAccountToken({
        clientEmail: 'sa@test.com',
        privateKeyId: 'key',
        signJwt: async () => 'jwt',
      }),
    ).rejects.toThrow(GSCApiError);
  });
});

describe('createTokenManager', () => {
  it('should cache token and return cached on subsequent calls', async () => {
    const fetchToken = vi.fn().mockResolvedValue({
      accessToken: 'cached-token',
      expiresAt: Date.now() + 3_600_000,
    });

    const manager = createTokenManager(fetchToken);

    const t1 = await manager.getToken();
    const t2 = await manager.getToken();

    expect(t1).toBe('cached-token');
    expect(t2).toBe('cached-token');
    expect(fetchToken).toHaveBeenCalledOnce();
  });

  it('should refresh when token is near expiry', async () => {
    let callCount = 0;
    const fetchToken = vi.fn().mockImplementation(async () => {
      callCount++;
      return {
        accessToken: `token-${callCount}`,
        expiresAt: callCount === 1 ? Date.now() + 30_000 : Date.now() + 3_600_000,
      };
    });

    const manager = createTokenManager(fetchToken);

    const t1 = await manager.getToken();
    expect(t1).toBe('token-1');

    const t2 = await manager.getToken();
    expect(t2).toBe('token-2');
    expect(fetchToken).toHaveBeenCalledTimes(2);
  });

  it('should invalidate cache', async () => {
    const fetchToken = vi.fn().mockResolvedValue({
      accessToken: 'token',
      expiresAt: Date.now() + 3_600_000,
    });

    const manager = createTokenManager(fetchToken);

    await manager.getToken();
    manager.invalidate();
    await manager.getToken();

    expect(fetchToken).toHaveBeenCalledTimes(2);
  });
});
