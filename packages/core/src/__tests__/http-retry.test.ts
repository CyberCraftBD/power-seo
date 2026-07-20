import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchJsonWithRetry } from '../http-retry.js';
import type { RetryableError } from '../http-retry.js';

class TestApiError extends Error implements RetryableError {
  readonly status: number;
  readonly retryable: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'TestApiError';
    this.status = status;
    this.retryable = status === 429 || status >= 500;
  }
}

function okResponse(data: unknown): globalThis.Response {
  return {
    ok: true,
    status: 200,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as unknown as globalThis.Response;
}

function errorResponse(status: number, body: string): globalThis.Response {
  return {
    ok: false,
    status,
    json: async () => ({}),
    text: async () => body,
  } as unknown as globalThis.Response;
}

function makeOptions(doFetch: (attempt: number) => Promise<globalThis.Response>) {
  return {
    maxRetries: 3,
    doFetch,
    buildError: (status: number, snippet: string) =>
      new TestApiError(`test API error: ${status} ${snippet}`, status),
    fallbackError: () => new TestApiError('Request failed', 500),
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('fetchJsonWithRetry', () => {
  it('returns parsed JSON on first-try success', async () => {
    const doFetch = vi.fn(async () => okResponse({ value: 42 }));

    const result = await fetchJsonWithRetry<{ value: number }, TestApiError>(makeOptions(doFetch));

    expect(result).toEqual({ value: 42 });
    expect(doFetch).toHaveBeenCalledTimes(1);
    expect(doFetch).toHaveBeenCalledWith(0);
  });

  it('retries a 500 with exponential backoff, then succeeds', async () => {
    vi.useFakeTimers();
    const doFetch = vi
      .fn()
      .mockResolvedValueOnce(errorResponse(500, 'Server Error'))
      .mockResolvedValueOnce(okResponse({ recovered: true }));

    const promise = fetchJsonWithRetry<{ recovered: boolean }, TestApiError>(makeOptions(doFetch));

    // First attempt fails; retry must wait for calculateBackoff(0) = 1000ms.
    await vi.advanceTimersByTimeAsync(999);
    expect(doFetch).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    const result = await promise;

    expect(result).toEqual({ recovered: true });
    expect(doFetch).toHaveBeenCalledTimes(2);
    expect(doFetch).toHaveBeenNthCalledWith(2, 1);
  });

  it('throws immediately on a non-retryable 400 without retrying', async () => {
    const doFetch = vi.fn(async () => errorResponse(400, 'Bad Request'));

    await expect(fetchJsonWithRetry(makeOptions(doFetch))).rejects.toThrow(
      'test API error: 400 Bad Request',
    );
    expect(doFetch).toHaveBeenCalledTimes(1);
  });

  it('sanitizes the body snippet before passing it to buildError', async () => {
    const doFetch = vi.fn(async () =>
      errorResponse(400, 'denied for Bearer abc.def-123 by upstream'),
    );

    await expect(fetchJsonWithRetry(makeOptions(doFetch))).rejects.toThrow(
      'test API error: 400 denied for Bearer [REDACTED] by upstream',
    );
  });

  it('throws the last error when retries are exhausted', async () => {
    vi.useFakeTimers();
    const doFetch = vi.fn(async () => errorResponse(503, 'Unavailable'));

    const promise = fetchJsonWithRetry({ ...makeOptions(doFetch), maxRetries: 2 });
    const assertion = expect(promise).rejects.toMatchObject({
      name: 'TestApiError',
      status: 503,
      message: 'test API error: 503 Unavailable',
    });

    await vi.runAllTimersAsync();
    await assertion;
    expect(doFetch).toHaveBeenCalledTimes(3);
  });

  it('respects a custom isRetryable predicate', async () => {
    const doFetch = vi.fn(async () => errorResponse(503, 'Unavailable'));

    await expect(
      fetchJsonWithRetry({ ...makeOptions(doFetch), isRetryable: () => false }),
    ).rejects.toThrow('test API error: 503 Unavailable');
    expect(doFetch).toHaveBeenCalledTimes(1);
  });

  it('propagates errors thrown by doFetch without retrying', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    const doFetch = vi.fn(async () => {
      throw abortError;
    });

    await expect(fetchJsonWithRetry(makeOptions(doFetch))).rejects.toBe(abortError);
    expect(doFetch).toHaveBeenCalledTimes(1);
  });

  it('propagates non-Error rejections as-is', async () => {
    const doFetch = vi.fn(async () => {
      throw 'string rejection';
    });

    await expect(fetchJsonWithRetry(makeOptions(doFetch))).rejects.toBe('string rejection');
    expect(doFetch).toHaveBeenCalledTimes(1);
  });
});
