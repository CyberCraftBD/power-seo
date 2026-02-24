// @power-seo/audit — Site Audit
// ----------------------------------------------------------------------------

import type {
  SiteAuditInput,
  SiteAuditResult,
  AuditRule,
  AuditCategory,
  CategoryResult,
} from './types.js';
import { auditPage } from './page-audit.js';

const CATEGORIES: AuditCategory[] = ['meta', 'content', 'structure', 'performance'];

export function auditSite(input: SiteAuditInput): SiteAuditResult {
  const pageResults = input.pages.map((page) => auditPage(page));
  const totalPages = pageResults.length;

  const score =
    totalPages > 0 ? Math.round(pageResults.reduce((sum, r) => sum + r.score, 0) / totalPages) : 0;

  const summary = {} as Record<AuditCategory, CategoryResult>;
  for (const cat of CATEGORIES) {
    if (totalPages === 0) {
      summary[cat] = { score: 0, passed: 0, warnings: 0, errors: 0 };
      continue;
    }

    let passed = 0;
    let warnings = 0;
    let errors = 0;

    for (const result of pageResults) {
      passed += result.categories[cat].passed;
      warnings += result.categories[cat].warnings;
      errors += result.categories[cat].errors;
    }

    const total = passed + warnings + errors;
    summary[cat] = {
      score: total > 0 ? Math.round((passed / total) * 100) : 100,
      passed,
      warnings,
      errors,
    };
  }

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

  return { score, totalPages, pageResults, topIssues, summary };
}
