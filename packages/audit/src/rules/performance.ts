// ============================================================================
// @ccbd-seo/audit — Performance Rules
// ============================================================================

import type { PageAuditInput, AuditRule } from '../types.js';

export function runPerformanceRules(input: PageAuditInput): AuditRule[] {
  const rules: AuditRule[] = [];

  // Response time
  if (input.responseTime !== undefined) {
    if (input.responseTime > 3000) {
      rules.push({
        id: 'perf-response-time',
        category: 'performance',
        title: 'Response time',
        description: `Response time is ${input.responseTime}ms (> 3000ms). This page loads very slowly.`,
        severity: 'error',
      });
    } else if (input.responseTime > 1000) {
      rules.push({
        id: 'perf-response-time',
        category: 'performance',
        title: 'Response time',
        description: `Response time is ${input.responseTime}ms (> 1000ms). Consider optimizing for faster load times.`,
        severity: 'warning',
      });
    } else {
      rules.push({
        id: 'perf-response-time',
        category: 'performance',
        title: 'Response time',
        description: `Response time is ${input.responseTime}ms. Good performance.`,
        severity: 'pass',
      });
    }
  }

  // Content size
  if (input.contentLength !== undefined) {
    if (input.contentLength > 100_000) {
      rules.push({
        id: 'perf-content-size',
        category: 'performance',
        title: 'Content size',
        description: `Content size is ${Math.round(input.contentLength / 1024)}KB (> 100KB). Consider reducing page weight.`,
        severity: 'warning',
      });
    } else {
      rules.push({
        id: 'perf-content-size',
        category: 'performance',
        title: 'Content size',
        description: `Content size is ${Math.round(input.contentLength / 1024)}KB. Acceptable page weight.`,
        severity: 'pass',
      });
    }
  }

  // Image count
  if (input.images) {
    if (input.images.length > 50) {
      rules.push({
        id: 'perf-image-count',
        category: 'performance',
        title: 'Image count',
        description: `Page has ${input.images.length} images (> 50). Consider lazy loading or reducing image count.`,
        severity: 'warning',
      });
    } else {
      rules.push({
        id: 'perf-image-count',
        category: 'performance',
        title: 'Image count',
        description: `Page has ${input.images.length} image(s). Acceptable count.`,
        severity: 'pass',
      });
    }

    // Image alt text
    const missingAlt = input.images.filter((img) => !img.alt);
    if (missingAlt.length > 0) {
      rules.push({
        id: 'perf-image-alt',
        category: 'performance',
        title: 'Image alt text',
        description: `${missingAlt.length} image(s) are missing alt text. Add descriptive alt attributes for accessibility and SEO.`,
        severity: 'warning',
      });
    } else {
      rules.push({
        id: 'perf-image-alt',
        category: 'performance',
        title: 'Image alt text',
        description: 'All images have alt text.',
        severity: 'pass',
      });
    }
  }

  // Status code
  if (input.statusCode !== undefined) {
    if (input.statusCode >= 400) {
      rules.push({
        id: 'perf-status-code',
        category: 'performance',
        title: 'HTTP status code',
        description: `Page returned status ${input.statusCode}. This indicates a client or server error.`,
        severity: 'error',
      });
    } else if (input.statusCode >= 300) {
      rules.push({
        id: 'perf-status-code',
        category: 'performance',
        title: 'HTTP status code',
        description: `Page returned status ${input.statusCode} (redirect). Ensure this is intentional.`,
        severity: 'warning',
      });
    } else {
      rules.push({
        id: 'perf-status-code',
        category: 'performance',
        title: 'HTTP status code',
        description: `Page returned status ${input.statusCode}. OK.`,
        severity: 'pass',
      });
    }
  }

  return rules;
}
