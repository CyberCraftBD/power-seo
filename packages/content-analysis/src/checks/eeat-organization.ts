// @power-seo/content-analysis — E-E-A-T: Organization & Affiliation
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkOrganization(input: ContentAnalysisInput): AnalysisResult {
  const { author } = input;

  if (!author) {
    return {
      id: 'eeat-organization',
      title: 'Organization affiliation',
      description:
        'No author information provided. Add organization/affiliation data to strengthen authoritativeness signals.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  let orgScore = 0;
  const signals: string[] = [];
  const gaps: string[] = [];

  // Check worksFor organization
  if (author.worksFor) {
    if (author.worksFor.name) {
      orgScore += 2;
      signals.push(`works for "${author.worksFor.name}"`);
    }
    if (author.worksFor.url) {
      orgScore += 1;
      signals.push('organization URL provided');
    }
    if (author.worksFor.logo) {
      orgScore += 1;
      signals.push('organization logo provided');
    }
  } else {
    gaps.push('no worksFor organization');
  }

  // Check job title (implies organizational role)
  if (author.jobTitle && author.jobTitle.trim()) {
    orgScore += 1;
    signals.push(`role: ${author.jobTitle}`);
  } else {
    gaps.push('no job title');
  }

  // Check professional credentials (imply institutional backing)
  if (author.credentials && author.credentials.length > 0) {
    const withIssuers = author.credentials.filter((c) => c.issuer);
    if (withIssuers.length > 0) {
      orgScore += 2;
      signals.push(`credentials from: ${withIssuers.map((c) => c.issuer).join(', ')}`);
    } else {
      orgScore += 1;
      signals.push(`${author.credentials.length} credential(s) without issuer details`);
      gaps.push('add issuing organizations to credentials');
    }
  }

  // Check education (institutional affiliation)
  if (author.education && author.education.length > 0) {
    orgScore += 1;
    signals.push(`education: ${author.education.map((e) => e.institution).join(', ')}`);
  }

  if (orgScore >= 5) {
    return {
      id: 'eeat-organization',
      title: 'Organization affiliation',
      description: `Strong organizational backing: ${signals.join('; ')}. Institutional affiliations strengthen authoritativeness.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (orgScore >= 2) {
    return {
      id: 'eeat-organization',
      title: 'Organization affiliation',
      description: `Partial organization data (${signals.join('; ')}). Missing: ${gaps.join('; ')}. Add complete worksFor schema (name, url, logo) and credential issuers.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-organization',
    title: 'Organization affiliation',
    description: `Weak organizational signals. ${gaps.join('; ')}. Add worksFor (organization name, URL, logo), job title, and credentialing institutions to demonstrate professional backing.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
