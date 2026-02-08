// ============================================================================
// @ccbd-seo/search-console — Auth
// ============================================================================

import type {
  OAuthCredentials,
  ServiceAccountCredentials,
  TokenResult,
  TokenManager,
} from './types.js';
import { GSCApiError } from './types.js';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_BUFFER_MS = 60_000;

export async function exchangeRefreshToken(
  credentials: OAuthCredentials,
): Promise<TokenResult> {
  const body = new globalThis.URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await globalThis.fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new GSCApiError(
      `Token exchange failed: ${text}`,
      response.status,
      'TOKEN_EXCHANGE_ERROR',
    );
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

export async function getServiceAccountToken(
  credentials: ServiceAccountCredentials,
): Promise<TokenResult> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.clientEmail,
    scope: GSC_SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };

  const assertion = await credentials.signJwt(payload);

  const body = new globalThis.URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const response = await globalThis.fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new GSCApiError(
      `Service account token failed: ${text}`,
      response.status,
      'SERVICE_ACCOUNT_ERROR',
    );
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

export function createTokenManager(
  fetchToken: () => Promise<TokenResult>,
): TokenManager {
  let cached: TokenResult | null = null;
  let pending: Promise<string> | null = null;

  return {
    async getToken(): Promise<string> {
      if (cached && cached.expiresAt > Date.now() + TOKEN_BUFFER_MS) {
        return cached.accessToken;
      }

      if (pending) {
        return pending;
      }

      pending = fetchToken().then((result) => {
        cached = result;
        pending = null;
        return result.accessToken;
      });

      return pending;
    },

    invalidate(): void {
      cached = null;
      pending = null;
    },
  };
}
