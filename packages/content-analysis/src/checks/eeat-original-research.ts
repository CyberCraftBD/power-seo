// @power-seo/content-analysis — E-E-A-T: Original Research & Data
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

const RESEARCH_PATTERNS: RegExp[] = [
  // Original research language
  /\b(our|my)\s+study\b/gi,
  /\b(our|my)\s+research\b/gi,
  /\b(our|my)\s+analysis\b/gi,
  /\b(our|my)\s+findings?\b/gi,
  /\b(our|my)\s+data\b/gi,
  /\b(our|my)\s+survey\b/gi,
  /\b(our|my)\s+experiment\b/gi,
  /\b(our|my)\s+investigation\b/gi,
  /\b(our|my)\s+audit\b/gi,
  /\b(our|my)\s+benchmark\b/gi,
  /\bwe\s+(surveyed|analyzed|studied|measured|tested|examined|collected|gathered|interviewed|evaluated)\b/gi,
  /\bi\s+(surveyed|analyzed|studied|measured|examined|collected|gathered|interviewed|evaluated)\b/gi,

  // Methodology descriptions
  /\b(our|the)\s+methodology\b/gi,
  /\bsample\s+size\b/gi,
  /\bdata\s+collection\b/gi,
  /\bwe\s+used\s+a?\s*(methodology|approach|framework|method)\b/gi,
  /\bcontrol\s+group\b/gi,
  /\btest\s+group\b/gi,
  /\bstatistically\s+significant\b/gi,
  /\bconfidence\s+interval\b/gi,
  /\bmargin\s+of\s+error\b/gi,
  /\bcorrelation\b/gi,

  // Data presentation
  /\baccording\s+to\s+(our|my)\b/gi,
  /\b(our|my)\s+results\s+(show|indicate|suggest|reveal|demonstrate)\b/gi,
  /\bthe\s+data\s+(shows?|indicates?|suggests?|reveals?)\b/gi,
  /\bas\s+(our|my)\s+data\s+shows\b/gi,
  /\bwe\s+found\s+that\b/gi,
  /\bwe\s+discovered\s+that\b/gi,
  /\bwe\s+observed\s+that\b/gi,

  // Quantitative markers
  /\b\d+\s*%\s+of\s+(our|the)\s+(respondents|participants|users|customers|sample|subjects)\b/gi,
  /\b(n\s*=\s*\d+|N\s*=\s*\d+)\b/g,
  /\b\d+\s+out\s+of\s+\d+\b/gi,
  /\b(figure|table|chart|graph)\s+\d+\b/gi,
];

// Detect data tables in HTML
const DATA_TABLE_PATTERN = /<table\b[^>]*>[\s\S]*?<\/table>/gi;
const CHART_PATTERNS = /<(canvas|svg)\b|chart|graph|data-chart/gi;

export function checkOriginalResearch(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content || '');
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 50) {
    return {
      id: 'eeat-original-research',
      title: 'Original research',
      description: 'Content is too short to analyze for original research.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  let totalMatches = 0;
  const matchedTypes: Set<string> = new Set();

  for (const pattern of RESEARCH_PATTERNS) {
    const matches = plainText.match(pattern);
    if (matches) {
      totalMatches += matches.length;
      if (pattern.source.includes('methodology') || pattern.source.includes('sample')) {
        matchedTypes.add('methodology');
      } else if (pattern.source.includes('survey') || pattern.source.includes('experiment')) {
        matchedTypes.add('primary research');
      } else if (pattern.source.includes('%') || pattern.source.includes('n\\s*=')) {
        matchedTypes.add('quantitative data');
      } else {
        matchedTypes.add('research language');
      }
    }
  }

  // Check for data tables and charts in HTML
  const tableMatches = (input.content || '').match(DATA_TABLE_PATTERN);
  const chartMatches = (input.content || '').match(CHART_PATTERNS);
  if (tableMatches) {
    totalMatches += tableMatches.length * 2; // Tables are weighted more heavily
    matchedTypes.add('data tables');
  }
  if (chartMatches) {
    totalMatches += chartMatches.length * 2;
    matchedTypes.add('charts/visualizations');
  }

  // Check for inline statistics (e.g., "increased by 47%", "3.5x faster")
  const statsPattern = /\b\d+(\.\d+)?\s*(%|x\s+faster|x\s+more|x\s+better|x\s+higher|x\s+lower|times\s+more|percent)\b/gi;
  const statsMatches = plainText.match(statsPattern);
  if (statsMatches) {
    totalMatches += statsMatches.length;
    matchedTypes.add('statistics');
  }

  const density = (totalMatches / wordCount) * 500;
  const typeCount = matchedTypes.size;
  const types = Array.from(matchedTypes).join(', ');

  if (density >= 3 && typeCount >= 2) {
    return {
      id: 'eeat-original-research',
      title: 'Original research',
      description: `Strong original research signals detected (${totalMatches} markers across ${types}). Content demonstrates original data collection and analysis.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (density >= 1 || typeCount >= 1) {
    return {
      id: 'eeat-original-research',
      title: 'Original research',
      description: `Some research signals found (${types || 'basic markers'}). Add more original data, methodology descriptions, quantitative results, and data visualizations to strengthen expertise signals.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-original-research',
    title: 'Original research',
    description: 'No original research signals detected. Add original data, surveys, experiments, methodology descriptions, or data visualizations to demonstrate expertise and first-hand research.',
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
