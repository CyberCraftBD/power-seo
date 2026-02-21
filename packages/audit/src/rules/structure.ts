// ============================================================================
// @power-seo/audit — Structure Rules
// ============================================================================

import { isAbsoluteUrl } from '@power-seo/core';
import { validateSchema } from '@power-seo/schema';
import type { SchemaObject } from '@power-seo/schema';
import type { PageAuditInput, AuditRule } from '../types.js';

export function runStructureRules(input: PageAuditInput): AuditRule[] {
  const rules: AuditRule[] = [];

  // Canonical validation
  if (input.canonical) {
    if (!isAbsoluteUrl(input.canonical)) {
      rules.push({
        id: 'structure-canonical-valid',
        category: 'structure',
        title: 'Canonical URL format',
        description: 'Canonical URL must be an absolute URL (starting with https://).',
        severity: 'error',
      });
    } else {
      rules.push({
        id: 'structure-canonical-valid',
        category: 'structure',
        title: 'Canonical URL format',
        description: 'Canonical URL is a valid absolute URL.',
        severity: 'pass',
      });

      // Check self-referencing canonical
      if (input.canonical !== input.url) {
        rules.push({
          id: 'structure-canonical-self',
          category: 'structure',
          title: 'Self-referencing canonical',
          description: 'Canonical URL does not match the page URL. Verify this is intentional.',
          severity: 'warning',
        });
      } else {
        rules.push({
          id: 'structure-canonical-self',
          category: 'structure',
          title: 'Self-referencing canonical',
          description: 'Canonical URL correctly references this page.',
          severity: 'pass',
        });
      }
    }
  }

  // Schema validation
  if (input.schema && input.schema.length > 0) {
    rules.push({
      id: 'structure-schema-present',
      category: 'structure',
      title: 'Structured data',
      description: `${input.schema.length} schema object(s) found.`,
      severity: 'pass',
    });

    for (const schema of input.schema) {
      const result = validateSchema(schema as unknown as SchemaObject);
      if (!result.valid) {
        for (const issue of result.issues) {
          rules.push({
            id: `structure-schema-${schema['@type']?.toLowerCase() ?? 'unknown'}-${issue.field}`,
            category: 'structure',
            title: `Schema: ${schema['@type']} — ${issue.field}`,
            description: issue.message,
            severity: issue.severity === 'error' ? 'error' : 'warning',
          });
        }
      } else if (result.issues.length > 0) {
        for (const issue of result.issues) {
          rules.push({
            id: `structure-schema-${schema['@type']?.toLowerCase() ?? 'unknown'}-${issue.field}`,
            category: 'structure',
            title: `Schema: ${schema['@type']} — ${issue.field}`,
            description: issue.message,
            severity: 'warning',
          });
        }
      }
    }
  } else {
    rules.push({
      id: 'structure-schema-present',
      category: 'structure',
      title: 'Structured data',
      description: 'No structured data (Schema.org) found on this page.',
      severity: 'warning',
    });
  }

  // Heading H1
  if (input.headings && input.headings.length > 0) {
    rules.push({
      id: 'structure-heading-h1',
      category: 'structure',
      title: 'H1 heading',
      description: 'Page has an H1 heading.',
      severity: 'pass',
    });

    // Check heading hierarchy (assumes headings are in order with level prefix like "h1:", "h2:")
    const levels = input.headings
      .map((h) => {
        const match = h.match(/^h(\d)/i);
        return match ? parseInt(match[1]!, 10) : null;
      })
      .filter((l): l is number => l !== null);

    let hierarchyOk = true;
    for (let i = 1; i < levels.length; i++) {
      if (levels[i]! > levels[i - 1]! + 1) {
        hierarchyOk = false;
        break;
      }
    }

    if (hierarchyOk) {
      rules.push({
        id: 'structure-heading-hierarchy',
        category: 'structure',
        title: 'Heading hierarchy',
        description: 'Heading levels follow a logical hierarchy.',
        severity: 'pass',
      });
    } else {
      rules.push({
        id: 'structure-heading-hierarchy',
        category: 'structure',
        title: 'Heading hierarchy',
        description:
          'Heading levels skip one or more levels (e.g. H1 to H3). Use sequential heading levels.',
        severity: 'warning',
      });
    }
  } else {
    rules.push({
      id: 'structure-heading-h1',
      category: 'structure',
      title: 'H1 heading',
      description: 'Page is missing an H1 heading.',
      severity: 'error',
    });
  }

  // HTTPS check
  if (input.url.startsWith('http://')) {
    rules.push({
      id: 'structure-https',
      category: 'structure',
      title: 'HTTPS',
      description:
        'Page is served over HTTP instead of HTTPS. Migrate to HTTPS for security and SEO.',
      severity: 'error',
    });
  } else if (input.url.startsWith('https://')) {
    rules.push({
      id: 'structure-https',
      category: 'structure',
      title: 'HTTPS',
      description: 'Page is served over HTTPS.',
      severity: 'pass',
    });
  }

  return rules;
}
