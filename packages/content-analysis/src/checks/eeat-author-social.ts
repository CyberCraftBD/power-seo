// @power-seo/content-analysis — E-E-A-T: Author Cross-Platform Presence
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

// Platform categories for diversity scoring
const PLATFORM_CATEGORIES: Record<string, string> = {
  linkedin: 'professional',
  twitter: 'social',
  'x.com': 'social',
  github: 'technical',
  gitlab: 'technical',
  bitbucket: 'technical',
  stackoverflow: 'technical',
  medium: 'publishing',
  substack: 'publishing',
  'dev.to': 'publishing',
  hashnode: 'publishing',
  wordpress: 'publishing',
  youtube: 'video',
  vimeo: 'video',
  twitch: 'video',
  facebook: 'social',
  instagram: 'social',
  mastodon: 'social',
  threads: 'social',
  bluesky: 'social',
  researchgate: 'academic',
  'scholar.google': 'academic',
  orcid: 'academic',
  academia: 'academic',
  dribbble: 'portfolio',
  behance: 'portfolio',
  kaggle: 'technical',
  'huggingface.co': 'technical',
};

function detectPlatform(url: string): { platform: string; category: string } | null {
  const urlLower = url.toLowerCase();
  for (const [platform, category] of Object.entries(PLATFORM_CATEGORIES)) {
    if (urlLower.includes(platform)) {
      return { platform, category };
    }
  }
  return null;
}

export function checkAuthorSocial(input: ContentAnalysisInput): AnalysisResult {
  const { author } = input;

  if (!author) {
    return {
      id: 'eeat-author-social',
      title: 'Author social presence',
      description:
        'No author information provided. Add author social profiles to demonstrate real identity and cross-platform authority.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  const profiles = author.socialProfiles || [];

  if (profiles.length === 0) {
    return {
      id: 'eeat-author-social',
      title: 'Author social presence',
      description:
        'No social profiles linked. Add LinkedIn, Twitter/X, GitHub, or other professional profiles. Social presence signals that the author is a real, identifiable person (sameAs schema property).',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  // Analyze platform diversity
  const categories = new Set<string>();
  const platforms: string[] = [];

  for (const profile of profiles) {
    const detected = detectPlatform(profile.url);
    if (detected) {
      categories.add(detected.category);
      platforms.push(detected.platform);
    } else {
      platforms.push(profile.platform || 'other');
      categories.add('other');
    }
  }

  const hasLinkedIn = platforms.some((p) => p === 'linkedin');
  const hasTechnical = categories.has('technical');
  const hasPublishing = categories.has('publishing');
  const hasAcademic = categories.has('academic');

  const diversityScore = categories.size;

  if (profiles.length >= 3 && diversityScore >= 3) {
    const details: string[] = [];
    if (hasLinkedIn) details.push('LinkedIn (professional identity)');
    if (hasTechnical) details.push('technical platforms');
    if (hasPublishing) details.push('publishing platforms');
    if (hasAcademic) details.push('academic profiles');
    return {
      id: 'eeat-author-social',
      title: 'Author social presence',
      description: `Strong cross-platform presence with ${profiles.length} profiles across ${diversityScore} categories: ${details.join(', ')}. Diverse presence strengthens author identity verification.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (profiles.length >= 2 || (profiles.length >= 1 && hasLinkedIn)) {
    const suggestions: string[] = [];
    if (!hasLinkedIn) suggestions.push('add LinkedIn for professional credibility');
    if (diversityScore < 2)
      suggestions.push('diversify across professional, technical, and publishing platforms');
    if (profiles.length < 3) suggestions.push('add more profiles for stronger identity signals');
    return {
      id: 'eeat-author-social',
      title: 'Author social presence',
      description: `${profiles.length} social profile${profiles.length > 1 ? 's' : ''} linked (${platforms.join(', ')}). ${suggestions.join('; ')}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-author-social',
    title: 'Author social presence',
    description: `Only ${profiles.length} social profile linked (${platforms.join(', ')}). Add at least 3 profiles across different categories (LinkedIn, GitHub, publishing platforms) for stronger author identity verification.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
