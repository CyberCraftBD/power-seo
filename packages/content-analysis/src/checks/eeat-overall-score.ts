// @power-seo/content-analysis — E-E-A-T: Overall Score Aggregation
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, countDistinctMatches } from '@power-seo/core';
import { TEMPORAL_EXPERIENCE_PATTERNS } from './shared-patterns.js';

// First-person experience markers (subset for quick pillar scan)
const EXPERIENCE_MARKERS: RegExp[] = [
  /\bi\s+tested\b/gi,
  /\bi\s+used\b/gi,
  /\bi\s+tried\b/gi,
  /\bi\s+found\s+that\b/gi,
  /\bi\s+experienced\b/gi,
  /\bi\s+personally\b/gi,
  /\bi\s+recommend\b/gi,
  /\bi\s+built\b/gi,
  /\bi\s+implemented\b/gi,
  /\bi\s+measured\b/gi,
  /\bi\s+compared\b/gi,
  /\bin\s+my\s+experience\b/gi,
  /\bfrom\s+my\s+experience\b/gi,
  /\bhaving\s+used\b/gi,
  /\bhaving\s+tested\b/gi,
  /\bwhat\s+i\s+found\b/gi,
  /\bwhat\s+worked\s+for\s+me\b/gi,
  /\bhands.on\b/gi,
  /\breal.world\b/gi,
];

// Temporal experience patterns (stronger signal) — shared with eeat-experience-depth
const TEMPORAL_EXPERIENCE: RegExp[] = TEMPORAL_EXPERIENCE_PATTERNS;

interface PillarAssessment {
  name: string;
  score: number;
  maxScore: number;
  strong: boolean;
}

function assessExperience(plainText: string, wordCount: number): PillarAssessment {
  let score = 0;

  // Check first-person experience markers (overlapping hits count once)
  const markerCount = countDistinctMatches(plainText, EXPERIENCE_MARKERS);

  const density = wordCount > 0 ? (markerCount / wordCount) * 500 : 0;
  if (density >= 2) score += 2;
  else if (density >= 1) score += 1;

  // Check temporal experience patterns (stronger signal, overlaps count once)
  const temporalCount = countDistinctMatches(plainText, TEMPORAL_EXPERIENCE);

  if (temporalCount >= 2) score += 1;

  return {
    name: 'Experience',
    score,
    maxScore: 3,
    strong: score >= 2,
  };
}

function assessExpertise(input: ContentAnalysisInput): PillarAssessment {
  const { author } = input;
  let score = 0;

  if (!author) {
    return { name: 'Expertise', score: 0, maxScore: 3, strong: false };
  }

  // Credentials signal deep expertise
  if (author.credentials && author.credentials.length > 0) {
    score += 1;
  }

  // knowsAbout shows topical expertise
  if (author.knowsAbout && author.knowsAbout.length > 0) {
    score += 1;
  }

  // Bio + jobTitle demonstrate professional standing
  if (author.bio && author.bio.trim().length >= 20 && author.jobTitle && author.jobTitle.trim()) {
    score += 1;
  }

  return {
    name: 'Expertise',
    score,
    maxScore: 3,
    strong: score >= 2,
  };
}

function assessAuthoritativeness(input: ContentAnalysisInput): PillarAssessment {
  const { author } = input;
  let score = 0;

  if (!author) {
    return { name: 'Authority', score: 0, maxScore: 3, strong: false };
  }

  // Social profiles breadth signals cross-platform authority
  if (author.socialProfiles && author.socialProfiles.length >= 3) {
    score += 1;
  }

  // Publications demonstrate recognized expertise
  if (author.publications && author.publications.length > 0) {
    score += 1;
  }

  // Organization affiliation (worksFor) provides institutional backing
  if (author.worksFor && author.worksFor.name) {
    score += 1;
  }

  return {
    name: 'Authority',
    score,
    maxScore: 3,
    strong: score >= 2,
  };
}

/** A date only earns trust credit if it is valid and not in the future. */
function isCreditableDate(value: string | Date | undefined): boolean {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now();
}

function assessTrustWorthiness(input: ContentAnalysisInput): PillarAssessment {
  let score = 0;

  // HTTPS canonical URL
  const url = input.canonicalUrl || input.siteUrl || '';
  if (url.startsWith('https://')) {
    score += 1;
  }

  // Publish date signals transparency and freshness (future dates ignored)
  if (isCreditableDate(input.publishDate)) {
    score += 1;
  }

  // Privacy policy URL
  if (input.privacyPolicyUrl) {
    score += 1;
  }

  // Penalize: sponsored content without proper disclosure is a trust issue
  // If sponsored, we require at least privacy policy or publish date to offset
  if (input.isSponsored && score < 2) {
    score = Math.max(0, score - 1);
  }

  return {
    name: 'Trust',
    score,
    maxScore: 3,
    strong: score >= 2,
  };
}

export function checkEeatOverallScore(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content || '');
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 50) {
    return {
      id: 'eeat-overall-score',
      title: 'E-E-A-T overall score',
      description: 'Content is too short to assess E-E-A-T signals.',
      status: 'na',
      score: 0,
      maxScore: 8,
    };
  }

  const experience = assessExperience(plainText.toLowerCase(), wordCount);
  const expertise = assessExpertise(input);
  const authority = assessAuthoritativeness(input);
  const trust = assessTrustWorthiness(input);

  const pillars = [experience, expertise, authority, trust];
  const pillarSummary = pillars.map((p) => `${p.name} ${p.score}/${p.maxScore}`).join(', ');

  // Proportional scoring: every pillar point counts, so a single-marker
  // change moves the combined score gradually instead of in 3-5 point cliffs.
  const maxScore = 8;
  const totalPillarPoints = pillars.reduce((sum, p) => sum + p.score, 0);
  const maxPillarPoints = pillars.reduce((sum, p) => sum + p.maxScore, 0);
  const ratio = maxPillarPoints > 0 ? totalPillarPoints / maxPillarPoints : 0;
  const score = Math.round(ratio * maxScore);

  if (ratio >= 0.75) {
    return {
      id: 'eeat-overall-score',
      title: 'E-E-A-T overall score',
      description: `Strong E-E-A-T profile with ${totalPillarPoints}/${maxPillarPoints} pillar points. ${pillarSummary}. Content demonstrates real experience, author expertise, authoritative backing, and trustworthiness.`,
      status: 'good',
      score,
      maxScore,
    };
  }

  if (ratio >= 0.4) {
    const weakPillars = pillars.filter((p) => !p.strong).map((p) => p.name);
    return {
      id: 'eeat-overall-score',
      title: 'E-E-A-T overall score',
      description: `Moderate E-E-A-T profile with ${totalPillarPoints}/${maxPillarPoints} pillar points. ${pillarSummary}. Strengthen ${weakPillars.join(' and ')} to improve overall quality signals.`,
      status: 'ok',
      score,
      maxScore,
    };
  }

  const weakPillars = pillars.filter((p) => !p.strong).map((p) => p.name);
  return {
    id: 'eeat-overall-score',
    title: 'E-E-A-T overall score',
    description: `Weak E-E-A-T profile with only ${totalPillarPoints}/${maxPillarPoints} pillar points. ${pillarSummary}. ${weakPillars.join(', ')} need improvement. Add first-person experience, author credentials, social profiles, publications, and trust signals (HTTPS, publish date, privacy policy).`,
    status: 'poor',
    score,
    maxScore,
  };
}
