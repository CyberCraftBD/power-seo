// ============================================================================
// @power-seo/schema — Google Rich Results Validation
// ============================================================================

import type { SchemaObject } from './types.js';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  field: string;
  message: string;
}

export interface SchemaValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

/**
 * Validate one or more schema objects against Google Rich Results requirements.
 * When an array is passed, each object is validated and all issues are merged.
 */
export function validateSchema(schema: SchemaObject | SchemaObject[]): SchemaValidationResult {
  if (Array.isArray(schema)) {
    const allIssues: ValidationIssue[] = [];
    for (const s of schema) {
      const result = validateSchema(s);
      allIssues.push(...result.issues);
    }
    return {
      valid: allIssues.filter((i) => i.severity === 'error').length === 0,
      issues: allIssues,
    };
  }

  const issues: ValidationIssue[] = [];

  const obj = schema as unknown as Record<string, unknown>;

  switch (schema['@type']) {
    case 'Article':
    case 'BlogPosting':
    case 'NewsArticle':
    case 'TechArticle':
      validateArticle(obj, issues);
      break;
    case 'Product':
      validateProduct(obj, issues);
      break;
    case 'FAQPage':
      validateFAQPage(obj, issues);
      break;
    case 'BreadcrumbList':
      validateBreadcrumbList(obj, issues);
      break;
    case 'Event':
    case 'MusicEvent':
    case 'BusinessEvent':
    case 'EducationEvent':
      validateEvent(obj, issues);
      break;
    case 'Recipe':
      validateRecipe(obj, issues);
      break;
    case 'VideoObject':
      validateVideoObject(obj, issues);
      break;
    case 'JobPosting':
      validateJobPosting(obj, issues);
      break;
    case 'LocalBusiness':
    case 'Restaurant':
    case 'Store':
      validateLocalBusiness(obj, issues);
      break;
    case 'Course':
      validateCourse(obj, issues);
      break;
  }

  return {
    valid: issues.filter((i) => i.severity === 'error').length === 0,
    issues,
  };
}

function requireField(obj: Record<string, unknown>, field: string, issues: ValidationIssue[]) {
  if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
    issues.push({
      severity: 'error',
      field,
      message: `Required field "${field}" is missing.`,
    });
  }
}

function recommendField(obj: Record<string, unknown>, field: string, issues: ValidationIssue[]) {
  if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
    issues.push({
      severity: 'warning',
      field,
      message: `Recommended field "${field}" is missing.`,
    });
  }
}

function validateArticle(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  requireField(schema, 'headline', issues);
  requireField(schema, 'author', issues);
  requireField(schema, 'datePublished', issues);
  recommendField(schema, 'image', issues);
  recommendField(schema, 'dateModified', issues);
  recommendField(schema, 'publisher', issues);
  recommendField(schema, 'mainEntityOfPage', issues);

  if (typeof schema.headline === 'string' && schema.headline.length > 110) {
    issues.push({
      severity: 'warning',
      field: 'headline',
      message: 'Headline should be under 110 characters for Google Rich Results.',
    });
  }
}

function validateProduct(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  requireField(schema, 'name', issues);
  recommendField(schema, 'image', issues);
  recommendField(schema, 'description', issues);
  recommendField(schema, 'offers', issues);
  recommendField(schema, 'aggregateRating', issues);
  recommendField(schema, 'brand', issues);
  recommendField(schema, 'sku', issues);
}

function validateFAQPage(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  const mainEntity = schema.mainEntity as Array<Record<string, unknown>> | undefined;
  if (!mainEntity || !Array.isArray(mainEntity) || mainEntity.length === 0) {
    issues.push({
      severity: 'error',
      field: 'mainEntity',
      message: 'FAQPage requires at least one Question in mainEntity.',
    });
    return;
  }

  for (let i = 0; i < mainEntity.length; i++) {
    const q = mainEntity[i]!;
    if (!q.name) {
      issues.push({
        severity: 'error',
        field: `mainEntity[${i}].name`,
        message: `Question ${i + 1} is missing "name" (the question text).`,
      });
    }
    const answer = q.acceptedAnswer as Record<string, unknown> | undefined;
    if (!answer?.text) {
      issues.push({
        severity: 'error',
        field: `mainEntity[${i}].acceptedAnswer.text`,
        message: `Question ${i + 1} is missing an answer text.`,
      });
    }
  }
}

function validateBreadcrumbList(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  const items = schema.itemListElement as Array<Record<string, unknown>> | undefined;
  if (!items || !Array.isArray(items) || items.length === 0) {
    issues.push({
      severity: 'error',
      field: 'itemListElement',
      message: 'BreadcrumbList requires at least one ListItem.',
    });
  }
}

function validateEvent(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  requireField(schema, 'name', issues);
  requireField(schema, 'startDate', issues);
  requireField(schema, 'location', issues);
  recommendField(schema, 'description', issues);
  recommendField(schema, 'image', issues);
  recommendField(schema, 'offers', issues);
  recommendField(schema, 'organizer', issues);
}

function validateRecipe(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  requireField(schema, 'name', issues);
  requireField(schema, 'image', issues);
  requireField(schema, 'recipeIngredient', issues);
  requireField(schema, 'recipeInstructions', issues);
  recommendField(schema, 'author', issues);
  recommendField(schema, 'datePublished', issues);
  recommendField(schema, 'description', issues);
  recommendField(schema, 'prepTime', issues);
  recommendField(schema, 'totalTime', issues);
}

function validateVideoObject(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  requireField(schema, 'name', issues);
  requireField(schema, 'description', issues);
  requireField(schema, 'thumbnailUrl', issues);
  requireField(schema, 'uploadDate', issues);
  recommendField(schema, 'contentUrl', issues);
  recommendField(schema, 'duration', issues);
}

function validateJobPosting(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  requireField(schema, 'title', issues);
  requireField(schema, 'description', issues);
  requireField(schema, 'datePosted', issues);
  requireField(schema, 'hiringOrganization', issues);
  recommendField(schema, 'validThrough', issues);
  recommendField(schema, 'employmentType', issues);
  recommendField(schema, 'baseSalary', issues);
}

function validateLocalBusiness(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  requireField(schema, 'name', issues);
  requireField(schema, 'address', issues);
  recommendField(schema, 'telephone', issues);
  recommendField(schema, 'openingHoursSpecification', issues);
  recommendField(schema, 'image', issues);
  recommendField(schema, 'url', issues);
  recommendField(schema, 'geo', issues);
}

function validateCourse(schema: Record<string, unknown>, issues: ValidationIssue[]) {
  requireField(schema, 'name', issues);
  requireField(schema, 'description', issues);
  recommendField(schema, 'provider', issues);
  recommendField(schema, 'offers', issues);
}
