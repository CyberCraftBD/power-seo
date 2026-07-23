// @power-seo/content-analysis — E-E-A-T: Published Works & Credentials
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkPublishedWorks(input: ContentAnalysisInput): AnalysisResult {
  const { author } = input;

  if (!author) {
    return {
      id: 'eeat-published-works',
      title: 'Published works & credentials',
      description:
        'No author information provided. Add publications, certifications, and awards to demonstrate authority.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  let score = 0;
  const signals: string[] = [];
  const gaps: string[] = [];

  // Publications
  if (author.publications && author.publications.length > 0) {
    const withUrls = author.publications.filter((p) => p.url);
    score += Math.min(3, author.publications.length);
    signals.push(
      `${author.publications.length} publication${author.publications.length > 1 ? 's' : ''}${withUrls.length > 0 ? ` (${withUrls.length} with URLs)` : ''}`,
    );
    if (withUrls.length < author.publications.length) {
      gaps.push('add URLs to all publications for verifiability');
    }
  } else {
    gaps.push('no publications listed');
  }

  // Credentials/Certifications
  if (author.credentials && author.credentials.length > 0) {
    score += Math.min(2, author.credentials.length);
    const credNames = author.credentials.map((c) => c.name);
    signals.push(`credentials: ${credNames.join(', ')}`);

    // Check for credential quality (has issuer and date)
    const completeCredentials = author.credentials.filter((c) => c.issuer && c.dateObtained);
    if (completeCredentials.length < author.credentials.length) {
      gaps.push('add issuer and date to all credentials for schema completeness');
    }
  } else {
    gaps.push('no professional certifications');
  }

  // Awards
  if (author.awards && author.awards.length > 0) {
    score += Math.min(2, author.awards.length);
    signals.push(
      `${author.awards.length} award${author.awards.length > 1 ? 's' : ''}: ${author.awards.slice(0, 3).join(', ')}`,
    );
  }

  // Years of experience
  if (author.yearsOfExperience) {
    if (author.yearsOfExperience >= 10) {
      score += 2;
      signals.push(`${author.yearsOfExperience}+ years of experience`);
    } else if (author.yearsOfExperience >= 5) {
      score += 1;
      signals.push(`${author.yearsOfExperience} years of experience`);
    }
  }

  if (score >= 5) {
    return {
      id: 'eeat-published-works',
      title: 'Published works & credentials',
      description: `Strong authority signals: ${signals.join('; ')}. Published works and credentials demonstrate recognized expertise.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (score >= 2) {
    return {
      id: 'eeat-published-works',
      title: 'Published works & credentials',
      description: `Moderate authority (${signals.join('; ')}). To strengthen: ${gaps.slice(0, 2).join('; ')}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-published-works',
    title: 'Published works & credentials',
    description: `Weak authority signals. ${gaps.join('; ')}. Add publications (articles, papers, books), professional certifications with issuers, and any industry awards or recognition.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
