// @power-seo/content-analysis — E-E-A-T: Author Schema Completeness
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

/**
 * Validates author Person schema completeness.
 * Checks: name, jobTitle, worksFor, education, credentials, knowsAbout,
 * socialProfiles (sameAs), image, bio (description), url.
 */
export function checkAuthorSchema(input: ContentAnalysisInput): AnalysisResult {
  const { author } = input;

  if (!author) {
    return {
      id: 'eeat-author-schema',
      title: 'Author schema',
      description: 'No author information provided. Add author data (name, bio, credentials, social profiles) to build E-E-A-T trust signals.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  interface SchemaField {
    name: string;
    filled: boolean;
    weight: number;
    schemaProperty: string;
  }

  const fields: SchemaField[] = [
    { name: 'name', filled: !!(author.name && author.name.trim()), weight: 2, schemaProperty: 'name' },
    { name: 'job title', filled: !!(author.jobTitle && author.jobTitle.trim()), weight: 1.5, schemaProperty: 'jobTitle' },
    { name: 'bio/description', filled: !!(author.bio && author.bio.trim().length >= 20), weight: 1.5, schemaProperty: 'description' },
    { name: 'profile image', filled: !!(author.image && author.image.trim()), weight: 1, schemaProperty: 'image' },
    { name: 'author URL', filled: !!(author.url && author.url.trim()), weight: 1, schemaProperty: 'url' },
    { name: 'organization (worksFor)', filled: !!(author.worksFor && author.worksFor.name), weight: 1.5, schemaProperty: 'worksFor' },
    { name: 'education (alumniOf)', filled: !!(author.education && author.education.length > 0), weight: 1, schemaProperty: 'alumniOf' },
    { name: 'credentials', filled: !!(author.credentials && author.credentials.length > 0), weight: 1.5, schemaProperty: 'hasCredential' },
    { name: 'expertise topics (knowsAbout)', filled: !!(author.knowsAbout && author.knowsAbout.length > 0), weight: 1.5, schemaProperty: 'knowsAbout' },
    { name: 'social profiles (sameAs)', filled: !!(author.socialProfiles && author.socialProfiles.length > 0), weight: 1.5, schemaProperty: 'sameAs' },
  ];

  const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
  const filledWeight = fields.filter(f => f.filled).reduce((sum, f) => sum + f.weight, 0);
  const completeness = filledWeight / totalWeight;

  const filledFields = fields.filter(f => f.filled).map(f => f.name);
  const missingFields = fields.filter(f => !f.filled).map(f => f.name);

  // Check bio quality
  let bioQuality = '';
  if (author.bio) {
    const bioWords = author.bio.trim().split(/\s+/).length;
    if (bioWords < 10) bioQuality = ' (bio is too short — aim for 30+ words)';
    else if (bioWords < 30) bioQuality = ' (consider expanding bio to 50+ words)';
  }

  if (completeness >= 0.75) {
    return {
      id: 'eeat-author-schema',
      title: 'Author schema',
      description: `Author schema is ${Math.round(completeness * 100)}% complete (${filledFields.length}/${fields.length} fields). Schema properties: ${filledFields.join(', ')}.${bioQuality}`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (completeness >= 0.4) {
    return {
      id: 'eeat-author-schema',
      title: 'Author schema',
      description: `Author schema is ${Math.round(completeness * 100)}% complete. Missing: ${missingFields.join(', ')}. Add these Person schema properties to strengthen expertise signals.${bioQuality}`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-author-schema',
    title: 'Author schema',
    description: `Author schema is only ${Math.round(completeness * 100)}% complete. Missing: ${missingFields.join(', ')}. A complete author schema (name, jobTitle, worksFor, credentials, knowsAbout, sameAs) is critical for E-E-A-T.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
