// @power-seo/content-analysis — E-E-A-T: Topical Authority Signals
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

// YMYL categories that require strong topical authority
const YMYL_CATEGORIES = [
  'health', 'medical', 'medicine', 'healthcare',
  'finance', 'financial', 'investing', 'banking', 'insurance', 'tax',
  'legal', 'law',
  'safety', 'emergency',
  'news', 'politics', 'government',
];

// Map credential keywords to relevant categories
const CREDENTIAL_RELEVANCE: Record<string, string[]> = {
  'md': ['health', 'medical', 'medicine', 'healthcare'],
  'doctor': ['health', 'medical', 'medicine', 'healthcare'],
  'physician': ['health', 'medical', 'medicine', 'healthcare'],
  'nurse': ['health', 'medical', 'medicine', 'healthcare'],
  'pharmacist': ['health', 'medical', 'medicine', 'healthcare'],
  'rn': ['health', 'medical', 'medicine', 'healthcare'],
  'dentist': ['health', 'medical', 'medicine', 'healthcare'],
  'therapist': ['health', 'medical', 'medicine', 'healthcare'],
  'psychologist': ['health', 'medical', 'medicine', 'healthcare'],
  'nutritionist': ['health', 'medical', 'medicine', 'healthcare'],
  'dietitian': ['health', 'medical', 'medicine', 'healthcare'],
  'cpa': ['finance', 'financial', 'tax', 'accounting'],
  'cfp': ['finance', 'financial', 'investing'],
  'cfa': ['finance', 'financial', 'investing'],
  'accountant': ['finance', 'financial', 'tax', 'accounting'],
  'financial advisor': ['finance', 'financial', 'investing'],
  'attorney': ['legal', 'law'],
  'lawyer': ['legal', 'law'],
  'jd': ['legal', 'law'],
  'paralegal': ['legal', 'law'],
  'engineer': ['technology', 'engineering', 'construction'],
  'developer': ['technology', 'software', 'programming'],
  'architect': ['technology', 'construction', 'design'],
  'professor': ['education', 'academic', 'research'],
  'phd': ['academic', 'research'],
  'researcher': ['academic', 'research', 'science'],
  'scientist': ['science', 'research'],
  'certified': ['professional'],
};

export function checkTopicalAuthority(input: ContentAnalysisInput): AnalysisResult {
  const { author, contentCategory } = input;

  if (!author || !contentCategory) {
    return {
      id: 'eeat-topical-authority',
      title: 'Topical authority',
      description: 'Set both author information and content category to assess topical authority alignment. This check verifies the author has relevant expertise for the content topic.',
      status: 'na',
      score: 0,
      maxScore: 8,
    };
  }

  const category = contentCategory.toLowerCase();
  const isYMYL = YMYL_CATEGORIES.some(c => category.includes(c));

  let authorityScore = 0;
  const authoritySignals: string[] = [];
  const gaps: string[] = [];

  // Check if knowsAbout includes the content category
  if (author.knowsAbout && author.knowsAbout.length > 0) {
    const topicMatch = author.knowsAbout.some(topic =>
      topic.toLowerCase().includes(category) || category.includes(topic.toLowerCase())
    );
    if (topicMatch) {
      authorityScore += 3;
      authoritySignals.push('author knowsAbout aligns with content topic');
    } else {
      authorityScore += 1;
      gaps.push(`author knowsAbout (${author.knowsAbout.join(', ')}) doesn't match content category "${contentCategory}"`);
    }
  } else {
    gaps.push('no knowsAbout topics defined');
  }

  // Check if credentials are relevant to the content category
  if (author.credentials && author.credentials.length > 0) {
    const relevantCreds = author.credentials.filter(cred => {
      const credLower = cred.name.toLowerCase();
      for (const [keyword, categories] of Object.entries(CREDENTIAL_RELEVANCE)) {
        if (credLower.includes(keyword) && categories.some(c => category.includes(c))) {
          return true;
        }
      }
      return false;
    });

    if (relevantCreds.length > 0) {
      authorityScore += 3;
      authoritySignals.push(`relevant credentials: ${relevantCreds.map(c => c.name).join(', ')}`);
    } else {
      authorityScore += 1;
      gaps.push('credentials not directly related to content topic');
    }
  } else {
    if (isYMYL) {
      gaps.push('YMYL content requires verifiable credentials');
    } else {
      gaps.push('no credentials provided');
    }
  }

  // Check job title relevance
  if (author.jobTitle) {
    const titleLower = author.jobTitle.toLowerCase();
    const titleRelevant = Object.entries(CREDENTIAL_RELEVANCE).some(([keyword, categories]) =>
      titleLower.includes(keyword) && categories.some(c => category.includes(c))
    );
    if (titleRelevant) {
      authorityScore += 2;
      authoritySignals.push(`job title "${author.jobTitle}" is relevant`);
    }
  }

  // Check years of experience
  if (author.yearsOfExperience && author.yearsOfExperience >= 5) {
    authorityScore += 1;
    authoritySignals.push(`${author.yearsOfExperience}+ years of experience`);
  }

  // YMYL amplifier — stricter scoring for YMYL content
  const ymylNote = isYMYL
    ? ' This is YMYL content — Google applies stricter E-E-A-T evaluation.'
    : '';

  if (authorityScore >= 6) {
    return {
      id: 'eeat-topical-authority',
      title: 'Topical authority',
      description: `Strong topical authority: ${authoritySignals.join('; ')}.${ymylNote}`,
      status: 'good',
      score: 5,
      maxScore: 8,
    };
  }

  if (authorityScore >= 3) {
    return {
      id: 'eeat-topical-authority',
      title: 'Topical authority',
      description: `Moderate topical authority (${authoritySignals.join('; ')}). Gaps: ${gaps.join('; ')}.${ymylNote}`,
      status: 'ok',
      score: 3,
      maxScore: 8,
    };
  }

  return {
    id: 'eeat-topical-authority',
    title: 'Topical authority',
    description: `Weak topical authority for "${contentCategory}" content. ${gaps.join('; ')}. Ensure the author has demonstrable expertise in this topic area.${ymylNote}`,
    status: 'poor',
    score: 1,
    maxScore: 8,
  };
}
