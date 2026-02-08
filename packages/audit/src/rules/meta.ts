// ============================================================================
// @ccbd-seo/audit — Meta Rules
// ============================================================================

import { validateTitle, validateMetaDescription } from '@ccbd-seo/core';
import type { PageAuditInput, AuditRule } from '../types.js';

export function runMetaRules(input: PageAuditInput): AuditRule[] {
  const rules: AuditRule[] = [];

  // Title present
  if (!input.title) {
    rules.push({
      id: 'meta-title-present',
      category: 'meta',
      title: 'Page title',
      description: 'Page is missing a title tag. Every page must have a unique title.',
      severity: 'error',
    });
  } else {
    const titleResult = validateTitle(input.title);
    rules.push({
      id: 'meta-title-length',
      category: 'meta',
      title: 'Title length',
      description: titleResult.message,
      severity: titleResult.valid ? 'pass' : 'warning',
    });
  }

  // Meta description present
  if (!input.metaDescription) {
    rules.push({
      id: 'meta-description-present',
      category: 'meta',
      title: 'Meta description',
      description: 'Page is missing a meta description. Add one to improve SERP click-through rates.',
      severity: 'error',
    });
  } else {
    const descResult = validateMetaDescription(input.metaDescription);
    rules.push({
      id: 'meta-description-length',
      category: 'meta',
      title: 'Meta description length',
      description: descResult.message,
      severity: descResult.valid ? 'pass' : 'warning',
    });
  }

  // Open Graph
  if (input.openGraph) {
    if (!input.openGraph.title) {
      rules.push({
        id: 'meta-og-title',
        category: 'meta',
        title: 'OG title',
        description: 'Open Graph title is missing. Social shares may lack a proper title.',
        severity: 'warning',
      });
    } else {
      rules.push({
        id: 'meta-og-title',
        category: 'meta',
        title: 'OG title',
        description: 'Open Graph title is present.',
        severity: 'pass',
      });
    }

    if (!input.openGraph.description) {
      rules.push({
        id: 'meta-og-description',
        category: 'meta',
        title: 'OG description',
        description: 'Open Graph description is missing. Social shares may lack a proper description.',
        severity: 'warning',
      });
    } else {
      rules.push({
        id: 'meta-og-description',
        category: 'meta',
        title: 'OG description',
        description: 'Open Graph description is present.',
        severity: 'pass',
      });
    }

    if (!input.openGraph.image) {
      rules.push({
        id: 'meta-og-image',
        category: 'meta',
        title: 'OG image',
        description: 'Open Graph image is missing. Social shares will lack a preview image.',
        severity: 'warning',
      });
    } else {
      rules.push({
        id: 'meta-og-image',
        category: 'meta',
        title: 'OG image',
        description: 'Open Graph image is present.',
        severity: 'pass',
      });
    }
  }

  // Canonical
  if (!input.canonical) {
    rules.push({
      id: 'meta-canonical',
      category: 'meta',
      title: 'Canonical URL',
      description: 'No canonical URL specified. Add one to prevent duplicate content issues.',
      severity: 'warning',
    });
  } else {
    rules.push({
      id: 'meta-canonical',
      category: 'meta',
      title: 'Canonical URL',
      description: 'Canonical URL is set.',
      severity: 'pass',
    });
  }

  // Robots noindex
  if (input.robots && input.robots.toLowerCase().includes('noindex')) {
    rules.push({
      id: 'meta-robots-noindex',
      category: 'meta',
      title: 'Robots noindex',
      description: 'This page has a noindex directive. It will not appear in search results.',
      severity: 'info',
    });
  }

  return rules;
}
