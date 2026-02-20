// ============================================================================
// @power-seo/audit — Site Audit
// ============================================================================

import type { SiteAuditInput, SiteAuditResult, AuditRule, AuditCategory, CategoryResult } from './types.js';
import { auditPage } from './page-audit.js';

const CATEGORIES: AuditCategory[] = ['meta', 'content', 'structure', 'performance'];

/**
 * Audit an entire site by running page audits across all pages
 * and aggregating the results.
 */
export function auditSite(input: SiteAuditInput): SiteAuditResult {
  const pageResults = input.pages.map((page) => auditPage(page));

  const totalPages = pageResults.length;

  // Average score
  const score = totalPages > 0
    ? Math.round(pageResults.reduce((sum, r) => sum + r.score, 0) / totalPages)
    : 0;

  // Aggregate category results
  const summary = {} as Record<AuditCategory, CategoryResult>;
  for (const cat of CATEGORIES) {
    if (totalPages === 0) {
      summary[cat] = { score: 0, passed: 0, warnings: 0, errors: 0 };
      continue;
    }

    let totalPassed = 0;
    let totalWarnings = 0;
    let totalErrors = 0;

    for (const result of pageResults) {
      totalPassed += result.categories[cat].passed;
      totalWarnings += result.categories[cat].warnings;
      totalErrors += result.categories[cat].errors;
    }

    const totalChecks = totalPassed + totalWarnings + totalErrors;
    summary[cat] = {
      score: totalChecks > 0 ? Math.round((totalPassed / totalChecks) * 100) : 100,
      passed: totalPassed,
      warnings: totalWarnings,
      errors: totalErrors,
    };
  }

  // Find top issues (most frequently occurring non-pass rules)
  const issueCount = new Map<string, { rule: AuditRule; count: number }>();
  for (const result of pageResults) {
    for (const rule of result.rules) {
      if (rule.severity === 'pass' || rule.severity === 'info') continue;
      const existing = issueCount.get(rule.id);
      if (existing) {
        existing.count++;
      } else {
        issueCount.set(rule.id, { rule, count: 1 });
      }
    }
  }

  const topIssues = [...issueCount.values()]
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.rule);

  return {
    score,
    totalPages,
    pageResults,
    topIssues,
    summary,
  };
}
