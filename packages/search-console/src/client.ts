// ============================================================================
// @power-seo/search-console — Client
// ============================================================================

import type { GSCClientConfig, GSCClient, RequestOptions } from './types.js';
import { GSCApiError } from './types.js';
import { createTokenBucket, consumeToken, getWaitTime, sleep } from '@power-seo/core';

const DEFAULT_BASE_URL = 'https://searchconsole.googleapis.com/webmasters/v3';
const DEFAULT_RATE_LIMIT = 1200;
const DEFAULT_MAX_RETRIES = 3;

export function createGSCClient(config: GSCClientConfig): GSCClient {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
  const bucket = createTokenBucket(config.rateLimitPerMinute ?? DEFAULT_RATE_LIMIT);

  async function request<T>(path: string, options?: RequestOptions): Promise<T> {
    const waitTime = getWaitTime(bucket);
    if (waitTime > 0) {
      await sleep(waitTime);
    }
    consumeToken(bucket);

    const token = await config.auth.getToken();
    const url = `${baseUrl}${path}`;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await globalThis.fetch(url, {
          method: options?.method ?? 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: options?.body ? JSON.stringify(options.body) : undefined,
          signal: options?.signal,
        });

        if (response.ok) {
          return (await response.json()) as T;
        }

        const text = await response.text();
        const error = new GSCApiError(
          `GSC API error: ${response.status} ${text}`,
          response.status,
          `HTTP_${response.status}`,
        );

        if (!error.retryable || attempt === maxRetries) {
          throw error;
        }

        lastError = error;
        const backoff = Math.min(1000 * Math.pow(2, attempt), 30_000);
        await sleep(backoff);
      } catch (err) {
        if (err instanceof GSCApiError) {
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

    throw lastError ?? new GSCApiError('Request failed', 500, 'UNKNOWN');
  }

  return {
    request,
    siteUrl: config.siteUrl,
  };
}
