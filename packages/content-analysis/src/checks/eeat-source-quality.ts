// @power-seo/content-analysis — E-E-A-T: Source Quality & Diversity
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

// Source categories by domain patterns
const SOURCE_CATEGORIES: Array<{ category: string; patterns: RegExp[] }> = [
  {
    category: 'academic',
    patterns: [
      /\.edu\b/i,
      /scholar\.google/i,
      /pubmed/i,
      /ncbi\.nlm/i,
      /arxiv\.org/i,
      /doi\.org/i,
      /jstor\.org/i,
      /researchgate/i,
      /sciencedirect/i,
      /springer/i,
      /wiley\.com/i,
      /nature\.com/i,
      /science\.org/i,
      /ieee\.org/i,
      /acm\.org/i,
    ],
  },
  {
    category: 'government',
    patterns: [
      /\.gov\b/i,
      /\.gov\.\w{2}\b/i,
      /who\.int/i,
      /europa\.eu/i,
      /un\.org/i,
    ],
  },
  {
    category: 'authoritative',
    patterns: [
      /\.org\b/i,
      /wikipedia\.org/i,
      /mozilla\.org/i,
      /w3\.org/i,
      /ietf\.org/i,
    ],
  },
  {
    category: 'news',
    patterns: [
      /reuters/i,
      /apnews/i,
      /bbc\./i,
      /nytimes/i,
      /washingtonpost/i,
      /theguardian/i,
      /bloomberg/i,
      /forbes/i,
      /techcrunch/i,
      /wired/i,
      /arstechnica/i,
    ],
  },
  {
    category: 'industry',
    patterns: [
      /google\.com\/\w/i,
      /developers\.google/i,
      /developer\.mozilla/i,
      /docs\.microsoft/i,
      /aws\.amazon/i,
      /cloud\.google/i,
      /developer\.apple/i,
      /web\.dev/i,
    ],
  },
];

// Detect references/bibliography section
const REFERENCES_SECTION_PATTERNS: RegExp[] = [
  /\breferences?\b/gi,
  /\bbibliography\b/gi,
  /\bsources?\b/gi,
  /\bcitations?\b/gi,
  /\bworks?\s+cited\b/gi,
  /\bfurther\s+reading\b/gi,
];

export function checkSourceQuality(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content);
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 100) {
    return {
      id: 'eeat-source-quality',
      title: 'Source quality',
      description: 'Content is too short to assess source quality.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Extract all links from content HTML
  const linkPattern = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
  const links: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = linkPattern.exec(content)) !== null) {
    const href = match[1] || '';
    if (href.startsWith('http')) {
      links.push(href);
    }
  }

  // Also consider external links from input
  if (input.externalLinks) {
    for (const link of input.externalLinks) {
      if (!links.includes(link)) links.push(link);
    }
  }

  if (links.length === 0) {
    return {
      id: 'eeat-source-quality',
      title: 'Source quality',
      description: 'No external sources cited. Add links to authoritative sources (academic papers, government data, industry documentation) to back up claims and build trust.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  // Categorize sources
  const categoryCounts: Record<string, number> = {};
  const categorizedLinks: Record<string, string[]> = {};

  for (const link of links) {
    let categorized = false;
    for (const { category, patterns } of SOURCE_CATEGORIES) {
      if (patterns.some(p => p.test(link))) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        if (!categorizedLinks[category]) categorizedLinks[category] = [];
        categorizedLinks[category].push(link);
        categorized = true;
        break;
      }
    }
    if (!categorized) {
      categoryCounts['other'] = (categoryCounts['other'] || 0) + 1;
    }
  }

  // Check for references section in content
  const headings = content.match(/<h[2-6]\b[^>]*>[\s\S]*?<\/h[2-6]>/gi) || [];
  const hasReferencesSection = headings.some(h => {
    const headingText = stripHtml(h).toLowerCase();
    return REFERENCES_SECTION_PATTERNS.some(p => p.test(headingText));
  });

  const categories = Object.keys(categoryCounts).filter(c => c !== 'other');
  const highQualityCount = (categoryCounts['academic'] || 0) + (categoryCounts['government'] || 0);
  const diversity = categories.length;

  // Sources per 500 words
  const sourceDensity = (links.length / wordCount) * 500;

  let score = 0;
  if (links.length >= 3) score += 1;
  if (highQualityCount >= 1) score += 1;
  if (diversity >= 2) score += 1;
  if (sourceDensity >= 1) score += 1;
  if (hasReferencesSection) score += 1;

  const categoryDetails = categories.map(c => `${c}: ${categoryCounts[c]}`).join(', ');

  if (score >= 4) {
    return {
      id: 'eeat-source-quality',
      title: 'Source quality',
      description: `Strong source quality: ${links.length} external sources across ${diversity} categories (${categoryDetails}).${hasReferencesSection ? ' References section present.' : ''} Diverse, authoritative sourcing builds trust.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (score >= 2) {
    const suggestions: string[] = [];
    if (highQualityCount === 0) suggestions.push('add academic (.edu) or government (.gov) sources');
    if (diversity < 2) suggestions.push('diversify source types (academic, government, industry)');
    if (!hasReferencesSection) suggestions.push('add a "References" or "Sources" section');
    if (links.length < 3) suggestions.push('cite at least 3 external sources');
    return {
      id: 'eeat-source-quality',
      title: 'Source quality',
      description: `Moderate source quality (${links.length} sources, ${categoryDetails}). ${suggestions.join('; ')}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-source-quality',
    title: 'Source quality',
    description: `Weak source quality (${links.length} source${links.length > 1 ? 's' : ''}, mostly uncategorized). Add diverse, authoritative sources: academic (.edu, PubMed), government (.gov), industry documentation, and reputable news outlets. Include a "References" section.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
