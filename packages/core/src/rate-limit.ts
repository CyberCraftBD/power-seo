// ============================================================================
// @ccbd-seo/core — Rate Limiting (Token Bucket)
// ============================================================================

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
