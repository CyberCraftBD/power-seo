// ============================================================================
// @power-seo/integrations — Shared HTTP Client
// ============================================================================

import type { HttpClientConfig, HttpClient, AuthStrategy } from './types.js';
import { IntegrationApiError } from './types.js';
import { createTokenBucket, consumeToken, getWaitTime, sleep } from '@power-seo/core';

const DEFAULT_RATE_LIMIT = 600;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 30_000;

function buildUrl(
  baseUrl: string,
  path: string,
  params: Record<string, string>,
  auth: AuthStrategy,
): string {
  const url = new globalThis.URL(`${baseUrl}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  if (auth.type === 'query') {
    url.searchParams.set(auth.paramName, auth.value);
  }
  return url.toString();
}

function buildHeaders(auth: AuthStrategy): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (auth.type === 'bearer') {
    headers['Authorization'] = `Bearer ${auth.token}`;
  }
  return headers;
}

function getProviderFromUrl(baseUrl: string): string {
  if (baseUrl.includes('semrush')) return 'semrush';
  if (baseUrl.includes('ahrefs')) return 'ahrefs';
  return 'unknown';
}

export function createHttpClient(config: HttpClientConfig): HttpClient {
  const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
  const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const bucket = createTokenBucket(config.rateLimitPerMinute ?? DEFAULT_RATE_LIMIT);
  const provider = getProviderFromUrl(config.baseUrl);

  async function makeRequest<T>(url: string, init: globalThis.RequestInit): Promise<T> {
    const waitTime = getWaitTime(bucket);
    if (waitTime > 0) {
      await sleep(waitTime);
    }
    consumeToken(bucket);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const controller = new globalThis.AbortController();
      const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await globalThis.fetch(url, {
          ...init,
          signal: controller.signal,
        });

        globalThis.clearTimeout(timeout);

        if (response.ok) {
          return (await response.json()) as T;
        }

        const text = await response.text();
        const error = new IntegrationApiError(
          `${provider} API error: ${response.status} ${text}`,
          response.status,
          provider,
        );

        if (!error.retryable || attempt === maxRetries) {
          throw error;
        }

        lastError = error;
        const backoff = Math.min(1000 * Math.pow(2, attempt), 30_000);
        await sleep(backoff);
      } catch (err) {
        globalThis.clearTimeout(timeout);
        if (err instanceof IntegrationApiError) {
          if (!err.retryable || attempt === maxRetries) {
            throw err;
          }
          lastError = err;
          const backoff = Math.min(1000 * Math.pow(2, attempt), 30_000);
          await sleep(backoff);
        } else {
          throw err;
        }
      }
    }

    throw lastError ?? new IntegrationApiError('Request failed', 500, provider);
  }

  return {
    async get<T>(path: string, params?: Record<string, string>): Promise<T> {
      const url = buildUrl(config.baseUrl, path, params ?? {}, config.auth);
      const headers = buildHeaders(config.auth);
      return makeRequest<T>(url, { method: 'GET', headers });
    },

    async post<T>(path: string, body?: unknown): Promise<T> {
      const url = buildUrl(config.baseUrl, path, {}, config.auth);
      const headers = buildHeaders(config.auth);
      return makeRequest<T>(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    },
  };
}
