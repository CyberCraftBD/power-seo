// @power-seo/content-analysis — Content Freshness Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

/** Current date used for age calculations. */
const NOW = new Date('2026-03-23T00:00:00Z');
const CURRENT_YEAR = NOW.getFullYear();

/** Milliseconds in a day. */
const MS_PER_DAY = 86_400_000;

/**
 * Parse a date value (string or Date) into a Date object, or null if invalid.
 */
function parseDate(value: string | Date | undefined): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Calculate the number of days between two dates.
 */
function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / MS_PER_DAY;
}

/**
 * Detect stale temporal references in plain text content.
 */
function findStaleReferences(text: string, publishDate: Date | null): string[] {
  const stale: string[] = [];
  const textLower = text.toLowerCase();

  // Check for "in 20XX" references where XX is old
  const yearRefRegex = /\bin\s+(20[0-9]{2})\b/gi;
  let match;
  while ((match = yearRefRegex.exec(text)) !== null) {
    const year = parseInt(match[1]!, 10);
    if (year < CURRENT_YEAR - 1) {
      stale.push(`Outdated year reference: "${match[0]}"`);
    }
  }

  // Check for "according to a 20XX study" where XX < current year - 2
  const studyRegex = /according\s+to\s+a\s+(20[0-9]{2})\s+study/gi;
  while ((match = studyRegex.exec(text)) !== null) {
    const year = parseInt(match[1]!, 10);
    if (year < CURRENT_YEAR - 2) {
      stale.push(`Stale study reference: "${match[0]}"`);
    }
  }

  // Check "last year" — stale if publish date is >1 year old
  if (textLower.includes('last year') && publishDate) {
    const age = daysBetween(NOW, publishDate);
    if (age > 365) {
      stale.push('"last year" reference in content older than 1 year');
    }
  }

  // Check "this year" without specific date context
  if (textLower.includes('this year') && publishDate) {
    const pubYear = publishDate.getFullYear();
    if (pubYear < CURRENT_YEAR) {
      stale.push(`"this year" reference but content was published in ${pubYear}`);
    }
  }

  // Check "recently" in old content (>6 months)
  if (textLower.includes('recently') && publishDate) {
    const age = daysBetween(NOW, publishDate);
    if (age > 180) {
      stale.push('"recently" used in content older than 6 months');
    }
  }

  // Check "latest version" without a specific version number following it
  const latestVersionRegex = /latest\s+version(?!\s+\d)/gi;
  if (latestVersionRegex.test(text)) {
    stale.push('"latest version" used without specifying a version number');
  }

  return stale;
}

export function checkContentFreshness(input: ContentAnalysisInput): AnalysisResult {
  const publishDate = parseDate(input.publishDate);
  const modifiedDate = parseDate(input.modifiedDate);

  if (!publishDate && !modifiedDate) {
    return {
      id: 'content-freshness',
      title: 'Content freshness',
      description:
        'No publish or modified date available. Set dates to evaluate content freshness.',
      status: 'na',
      score: 0,
      maxScore: 10,
    };
  }

  // Calculate content age
  const referenceDate = publishDate || modifiedDate!;
  const ageDays = daysBetween(NOW, referenceDate);
  const ageMonths = ageDays / 30.44; // average days per month

  // Check if recently updated
  const updateDays = modifiedDate ? daysBetween(NOW, modifiedDate) : null;
  const updatedWithin3Months = updateDays !== null && updateDays <= 91;

  // Detect stale temporal references
  const plainText = stripHtml(input.content);
  const staleRefs = findStaleReferences(plainText, publishDate);

  // Build description parts
  const parts: string[] = [];

  if (publishDate) {
    parts.push(
      `Published ${Math.round(ageMonths)} month${Math.round(ageMonths) === 1 ? '' : 's'} ago`,
    );
  }
  if (modifiedDate && updateDays !== null) {
    const updateMonths = Math.round(updateDays / 30.44);
    parts.push(`last updated ${updateMonths} month${updateMonths === 1 ? '' : 's'} ago`);
  }

  if (staleRefs.length > 0) {
    parts.push(
      `${staleRefs.length} stale temporal reference${staleRefs.length === 1 ? '' : 's'} found: ${staleRefs.join('; ')}`,
    );
  }

  // Determine score
  // Good: < 6 months old OR updated within 3 months
  if (ageMonths < 6 || updatedWithin3Months) {
    return {
      id: 'content-freshness',
      title: 'Content freshness',
      description: `${parts.join('. ')}. Content is fresh${staleRefs.length > 0 ? ', but consider updating the stale references' : ''}.`,
      status: 'good',
      score: 5,
      maxScore: 10,
    };
  }

  // OK: 6-12 months without update
  if (ageMonths <= 12) {
    return {
      id: 'content-freshness',
      title: 'Content freshness',
      description: `${parts.join('. ')}. Content is aging — consider reviewing and updating it to maintain relevance.`,
      status: 'ok',
      score: 3,
      maxScore: 10,
    };
  }

  // Poor: > 12 months without update
  return {
    id: 'content-freshness',
    title: 'Content freshness',
    description: `${parts.join('. ')}. Content is over 12 months old without a recent update. Refresh it to improve rankings and accuracy.`,
    status: 'poor',
    score: 1,
    maxScore: 10,
  };
}
