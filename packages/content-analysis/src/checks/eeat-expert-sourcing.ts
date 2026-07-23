// @power-seo/content-analysis — E-E-A-T: Expert Sourcing & Quotes
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, countDistinctMatches } from '@power-seo/core';

// Expert attribution patterns
const EXPERT_QUOTE_PATTERNS: RegExp[] = [
  // Named expert citations
  /\baccording\s+to\s+(?:Dr\.?|Prof\.?|Professor)\s+[A-Z]/gi,
  // [Aa] so sentence-initial "According to Jane Doe" matches; NAME stays case-sensitive
  /\b[Aa]ccording\s+to\s+[A-Z][a-z]+\s+[A-Z][a-z]+/g,
  /\b(?:Dr\.?|Prof\.?|Professor)\s+[A-Z][a-z]+\s+(says?|said|explains?|explained|notes?|noted|suggests?|argues?|stated|believes?|recommends?|observes?|points?\s+out)\b/g,
  /\b[A-Z][a-z]+\s+[A-Z][a-z]+,?\s+(?:a|an)\s+(?:professor|researcher|scientist|expert|analyst|specialist|consultant|advisor|doctor|physician|engineer|author|founder|CEO|CTO|director)\b/g,

  // Quote blocks
  /\b[Aa]s\s+[A-Z][a-z]+\s+(?:[A-Z][a-z]+\s+)?(?:explains?|puts?\s+it|notes?|says?|wrote|writes?|stated)\b/g,
  /\bin\s+the\s+words\s+of\b/gi,
  /\b[A-Z][a-z]+\s+(?:[A-Z][a-z]+\s+)?told\s+(?:us|me|the)\b/g,

  // Interview/contribution markers
  /\bwe\s+(?:spoke|talked)\s+(?:with|to)\b/gi,
  /\bin\s+(?:an|our)\s+interview\s+with\b/gi,
  /\b[A-Z][a-z]+\s+shared\s+(?:that|their|his|her)\b/g,
  /\bcontribut(?:ed|or|ing)\s+(?:expert|author|writer|analyst)\b/gi,
  /\bguest\s+(?:expert|contributor|author|writer)\b/gi,

  // Expert consensus
  /\bexperts?\s+(?:agree|recommend|suggest|advise|say|warn|note|point\s+out)\b/gi,
  /\b(?:industry|leading|top|renowned)\s+experts?\b/gi,
  /\baccording\s+to\s+(?:industry\s+)?experts?\b/gi,
  /\b(?:medical|financial|legal|technical)\s+(?:expert|professional|specialist)\b/gi,
];

// HTML quote elements — bounded lazy bodies so nested markup
// (e.g. <cite><a href="...">Name</a></cite>) still matches
const BLOCKQUOTE_PATTERN = /<blockquote\b[^>]*>[\s\S]*?<\/blockquote>/gi;
const CITE_PATTERN = /<cite\b[^>]*>[\s\S]{1,300}?<\/cite>/gi;
const Q_PATTERN = /<q\b[^>]*>[\s\S]{1,300}?<\/q>/gi;

export function checkExpertSourcing(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content);
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 100) {
    return {
      id: 'eeat-expert-sourcing',
      title: 'Expert sourcing',
      description: 'Content is too short to assess expert sourcing.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Overlapping hits across patterns count once
  let expertMentions = countDistinctMatches(plainText, EXPERT_QUOTE_PATTERNS);
  const sourceTypes: Set<string> = new Set();

  // Classify source types per pattern
  for (const pattern of EXPERT_QUOTE_PATTERNS) {
    const matches = plainText.match(pattern);
    if (matches) {
      const src = pattern.source.toLowerCase();
      if (src.includes('interview') || src.includes('spoke') || src.includes('told')) {
        sourceTypes.add('interviews');
      } else if (src.includes('contribut') || src.includes('guest')) {
        sourceTypes.add('expert contributors');
      } else if (src.includes('ccording') || src.includes('says') || src.includes('explains')) {
        sourceTypes.add('expert citations');
      } else if (src.includes('experts?')) {
        sourceTypes.add('expert consensus');
      }
    }
  }

  // Check HTML quote elements (require at least one non-tag character inside)
  const hasTextContent = (html: string): boolean => stripHtml(html).trim().length > 0;
  const blockquotes = content.match(BLOCKQUOTE_PATTERN) || [];
  const cites = (content.match(CITE_PATTERN) || []).filter(hasTextContent);
  const quotes = (content.match(Q_PATTERN) || []).filter(hasTextContent);

  if (blockquotes.length > 0) {
    expertMentions += blockquotes.length;
    sourceTypes.add('blockquotes');
  }
  if (cites.length > 0) {
    expertMentions += cites.length;
    sourceTypes.add('cited sources');
  }
  if (quotes.length > 0) {
    expertMentions += quotes.length;
  }

  const types = Array.from(sourceTypes);

  if (expertMentions >= 3 && types.length >= 2) {
    return {
      id: 'eeat-expert-sourcing',
      title: 'Expert sourcing',
      description: `Strong expert sourcing with ${expertMentions} references across ${types.join(', ')}. Expert quotes and attributed statements strengthen content authority.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (expertMentions >= 1) {
    const suggestions: string[] = [];
    if (blockquotes.length === 0)
      suggestions.push('use <blockquote> with <cite> for attributed quotes');
    if (types.length < 2)
      suggestions.push('diversify sources: add interviews, expert quotes, or contributor insights');
    if (expertMentions < 3) suggestions.push('cite at least 3 expert sources');
    return {
      id: 'eeat-expert-sourcing',
      title: 'Expert sourcing',
      description: `Some expert sourcing found (${expertMentions} reference${expertMentions > 1 ? 's' : ''}: ${types.join(', ')}). ${suggestions.join('; ')}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-expert-sourcing',
    title: 'Expert sourcing',
    description:
      'No expert sourcing detected. Add expert quotes ("According to Dr. Smith..."), attributed insights, interview data, or expert contributor sections. Use <blockquote> with <cite> for proper attribution.',
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
