// @power-seo/audit — Types

import type { SchemaBase } from '@power-seo/core';

export type AuditCategory = 'meta' | 'content' | 'structure' | 'performance';
export type AuditSeverity = 'error' | 'warning' | 'info' | 'pass';

export interface AuditRule {
  id: string;
  category: AuditCategory;
  title: string;
  description: string;
  severity: AuditSeverity;
}

export interface PageAuditInput {
  url: string;
  title?: string;
  metaDescription?: string;
  content?: string;
  focusKeyphrase?: string;
  canonical?: string;
  robots?: string;
  openGraph?: { title?: string; description?: string; image?: string };
  schema?: SchemaBase[];
  images?: Array<{ src: string; alt?: string; size?: number }>;
  internalLinks?: string[];
  externalLinks?: string[];
  headings?: string[];
  statusCode?: number;
  responseTime?: number;
  contentLength?: number;
  wordCount?: number;
  keywordDensity?: number;
}

export interface PageAuditResult {
  url: string;
  score: number;
  categories: Record<AuditCategory, CategoryResult>;
  rules: AuditRule[];
  recommendations: string[];
}

export interface CategoryResult {
  score: number;
  passed: number;
  warnings: number;
  errors: number;
}

export interface SiteAuditInput {
  pages: PageAuditInput[];
  hostname?: string;
}

export interface SiteAuditResult {
  score: number;
  totalPages: number;
  pageResults: PageAuditResult[];
  topIssues: AuditRule[];
  summary: Record<AuditCategory, CategoryResult>;
}
