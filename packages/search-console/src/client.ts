// @power-seo/search-console — Client
// ----------------------------------------------------------------------------

import type { GSCClientConfig, GSCClient, RequestOptions } from './types.js';
import { GSCApiError } from './types.js';
import {
  createTokenBucket,
  consumeToken,
  getWaitTime,
  sleep,
  fetchJsonWithRetry,
} from '@power-seo/core';

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

    return fetchJsonWithRetry<T, GSCApiError>({
      maxRetries,
      doFetch: () =>
        globalThis.fetch(url, {
          method: options?.method ?? 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: options?.body ? JSON.stringify(options.body) : undefined,
          signal: options?.signal,
        }),
      buildError: (status, snippet) =>
        new GSCApiError(`GSC API error: ${status} ${snippet}`, status, `HTTP_${status}`),
      fallbackError: () => new GSCApiError('Request failed', 500, 'UNKNOWN'),
    });
  }

  return {
    request,
    siteUrl: config.siteUrl,
    auth: config.auth,
  };
}
