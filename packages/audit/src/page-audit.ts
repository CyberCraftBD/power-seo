// ============================================================================
// @power-seo/audit — Page Audit
// ============================================================================

import type {
  PageAuditInput,
  PageAuditResult,
  AuditRule,
  AuditCategory,
  CategoryResult,
} from './types.js';
import { runMetaRules } from './rules/meta.js';
import { runContentRules } from './rules/content.js';
import { runStructureRules } from './rules/structure.js';
import { runPerformanceRules } from './rules/performance.js';

const CATEGORY_WEIGHTS: Record<AuditCategory, number> = {
  meta: 0.3,
  content: 0.3,
  structure: 0.25,
  performance: 0.15,
};

function calculateCategoryResult(rules: AuditRule[]): CategoryResult {
  let passed = 0;
  let warnings = 0;
  let errors = 0;

  for (const rule of rules) {
    switch (rule.severity) {
      case 'pass':
        passed++;
        break;
      case 'warning':
        warnings++;
        break;
      case 'error':
        errors++;
        break;
      // 'info' doesn't count toward scoring
    }
  }

  const total = passed + warnings + errors;
  const score = total > 0 ? Math.round((passed / total) * 100) : 100;

  return { score, passed, warnings, errors };
}

/**
 * Audit a single page for SEO best practices.
 *
 * Runs meta, content, structure, and performance rule modules.
 * Returns an overall score (0-100) and per-category breakdowns.
 */
export function auditPage(input: PageAuditInput): PageAuditResult {
  const metaRules = runMetaRules(input);
  const contentRules = runContentRules(input);
  const structureRules = runStructureRules(input);
  const performanceRules = runPerformanceRules(input);

  const allRules = [...metaRules, ...contentRules, ...structureRules, ...performanceRules];

  const categories: Record<AuditCategory, CategoryResult> = {
    meta: calculateCategoryResult(metaRules),
    content: calculateCategoryResult(contentRules),
    structure: calculateCategoryResult(structureRules),
    performance: calculateCategoryResult(performanceRules),
  };

  // Weighted average score
  const score = Math.round(
    categories.meta.score * CATEGORY_WEIGHTS.meta +
      categories.content.score * CATEGORY_WEIGHTS.content +
      categories.structure.score * CATEGORY_WEIGHTS.structure +
      categories.performance.score * CATEGORY_WEIGHTS.performance,
  );

  // Generate recommendations from errors and warnings
  const recommendations = allRules
    .filter((r) => r.severity === 'error' || r.severity === 'warning')
    .map((r) => r.description);

  return {
    url: input.url,
    score,
    categories,
    rules: allRules,
    recommendations,
  };
}
