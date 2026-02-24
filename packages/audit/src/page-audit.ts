// @power-seo/audit — Page Audit
// ----------------------------------------------------------------------------

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
    }
  }

  const total = passed + warnings + errors;
  return { score: total > 0 ? Math.round((passed / total) * 100) : 100, passed, warnings, errors };
}

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

  const score = Math.round(
    categories.meta.score * CATEGORY_WEIGHTS.meta +
      categories.content.score * CATEGORY_WEIGHTS.content +
      categories.structure.score * CATEGORY_WEIGHTS.structure +
      categories.performance.score * CATEGORY_WEIGHTS.performance,
  );

  const recommendations = allRules
    .filter((r) => r.severity === 'error' || r.severity === 'warning')
    .map((r) => r.description);

  return { url: input.url, score, categories, rules: allRules, recommendations };
}
