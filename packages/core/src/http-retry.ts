// @power-seo/core — Generic Fetch-with-Retry Loop
// ----------------------------------------------------------------------------

import { sleep, calculateBackoff, sanitizeErrorSnippet } from './rate-limit.js';

/** An error that knows whether the failed request may be retried. */
export interface RetryableError extends Error {
  retryable: boolean;
}

export interface FetchJsonRetryOptions<E extends RetryableError> {
  /** Number of retries after the first attempt (total attempts = maxRetries + 1). */
  maxRetries: number;
  /**
   * Performs one fetch attempt. The caller owns URL, headers, body, timeout,
   * abort logic, and rate limiting. Errors thrown here (network failures,
   * AbortError) propagate immediately without retry.
   */
  doFetch: (attempt: number) => Promise<globalThis.Response>;
  /**
   * Builds the caller's error type from a failed (non-OK) response.
   * `bodySnippet` has already been passed through `sanitizeErrorSnippet` by
   * this helper — callers must NOT sanitize it again.
   */
  buildError: (status: number, bodySnippet: string) => E;
  /** Decides whether a built error should be retried. Defaults to `error.retryable`. */
  isRetryable?: (error: E) => boolean;
  /** Thrown if the retry loop exits without a result (defensive fallback). */
  fallbackError: () => E;
}

/**
 * Runs a fetch-with-retry loop with exponential backoff.
 *
 * - `response.ok` → resolves with `response.json()` as `T`.
 * - Non-OK response → builds the caller's error from the status and sanitized
 *   body snippet; throws it immediately when it is not retryable or attempts
 *   are exhausted, otherwise sleeps `calculateBackoff(attempt)` and retries.
 * - Errors thrown by `doFetch` itself or by body parsing propagate
 *   immediately without retry.
 */
export async function fetchJsonWithRetry<T, E extends RetryableError>(
  opts: FetchJsonRetryOptions<E>,
): Promise<T> {
  let lastError: E | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    const response = await opts.doFetch(attempt);

    if (response.ok) {
      return (await response.json()) as T;
    }

    const text = await response.text();
    const error = opts.buildError(response.status, sanitizeErrorSnippet(text));
    const retryable = opts.isRetryable ? opts.isRetryable(error) : error.retryable;

    if (!retryable || attempt === opts.maxRetries) {
      throw error;
    }

    lastError = error;
    await sleep(calculateBackoff(attempt));
  }

  throw lastError ?? opts.fallbackError();
}
