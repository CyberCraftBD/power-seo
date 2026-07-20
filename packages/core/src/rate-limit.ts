// @power-seo/core — Rate Limiting (Token Bucket)
// ----------------------------------------------------------------------------

export interface TokenBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number;
}

export function createTokenBucket(requestsPerMinute: number): TokenBucket {
  return {
    tokens: requestsPerMinute,
    lastRefill: Date.now(),
    maxTokens: requestsPerMinute,
    refillRate: requestsPerMinute / 60_000,
  };
}

export function consumeToken(bucket: TokenBucket): boolean {
  const now = Date.now();
  const elapsed = now - bucket.lastRefill;
  bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + elapsed * bucket.refillRate);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }
  return false;
}

export function getWaitTime(bucket: TokenBucket): number {
  if (bucket.tokens >= 1) return 0;
  return Math.ceil((1 - bucket.tokens) / bucket.refillRate);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

/**
 * Exponential backoff delay for a retry attempt: base * 2^attempt, capped.
 *
 * @example
 * ```ts
 * calculateBackoff(0); // => 1000
 * calculateBackoff(3); // => 8000
 * calculateBackoff(9); // => 30000 (capped)
 * ```
 */
export function calculateBackoff(attempt: number, baseMs = 1000, maxMs = 30_000): number {
  return Math.min(baseMs * Math.pow(2, attempt), maxMs);
}

/**
 * Bound and redact an upstream HTTP response body before putting it in an
 * error message, so tokens or internal details never land in logs verbatim.
 */
export function sanitizeErrorSnippet(body: string, maxLength = 200): string {
  const redacted = body
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, 'Bearer [REDACTED]')
    .replace(
      /"(access_token|refresh_token|id_token|token|authorization|api[_-]?key|client_secret)"\s*:\s*"[^"]*"/gi,
      '"$1":"[REDACTED]"',
    );
  const collapsed = redacted.replace(/\s+/g, ' ').trim();
  return collapsed.length > maxLength ? `${collapsed.slice(0, maxLength)}…` : collapsed;
}
