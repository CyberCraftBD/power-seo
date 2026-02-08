// ============================================================================
// @ccbd-seo/audit — Public API
// ============================================================================

export { auditPage } from './page-audit.js';
export { auditSite } from './site-audit.js';
export { runMetaRules } from './rules/meta.js';
export { runContentRules } from './rules/content.js';
export { runStructureRules } from './rules/structure.js';
export { runPerformanceRules } from './rules/performance.js';

export type {
  AuditCategory,
  AuditSeverity,
  AuditRule,
  PageAuditInput,
  PageAuditResult,
  CategoryResult,
  SiteAuditInput,
  SiteAuditResult,
} from './types.js';
