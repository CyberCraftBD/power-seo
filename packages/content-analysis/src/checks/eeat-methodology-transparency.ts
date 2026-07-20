// @power-seo/content-analysis — E-E-A-T: Methodology & Process Transparency
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, countDistinctMatches } from '@power-seo/core';

const METHODOLOGY_PATTERNS: RegExp[] = [
  // Testing methodology
  /\bhow\s+we\s+tested\b/gi,
  /\bhow\s+i\s+tested\b/gi,
  /\b(our|my)\s+testing\s+(process|methodology|approach|criteria)\b/gi,
  /\btest(ing)?\s+methodology\b/gi,
  /\btest(ing)?\s+environment\b/gi,
  /\btest(ing)?\s+conditions?\b/gi,
  /\btest(ing)?\s+setup\b/gi,
  /\bwe\s+tested\s+(by|using|with|on|across)\b/gi,

  // Evaluation criteria
  /\b(our|my|the)\s+evaluation\s+criteria\b/gi,
  /\b(our|my|the)\s+selection\s+(criteria|process)\b/gi,
  /\b(our|my|the)\s+review\s+(process|criteria|methodology)\b/gi,
  /\b(our|my|the)\s+assessment\s+(criteria|framework|process)\b/gi,
  /\bscoring\s+(system|methodology|criteria|rubric)\b/gi,
  /\bgrading\s+(system|criteria|scale)\b/gi,
  /\brated\s+(on|based\s+on|according\s+to)\b/gi,
  /\bwe\s+(evaluated|assessed|rated|scored|ranked|compared)\b/gi,

  // Research process
  /\b(our|my|the)\s+(research\s+)?(process|approach|framework|method)\s+(involved|included|consisted|was)\b/gi,
  /\bdata\s+(collection|gathering|analysis)\s+(method|process|approach)\b/gi,
  /\bsample\s+(size|group|population)\b/gi,
  /\bcontrol\s+(group|variable|condition)\b/gi,
  /\bvariable\w*\s+(controlled|measured|tested)\b/gi,

  // Scope and limitations
  /\bscope\s+of\s+(this|our|the)\b/gi,
  /\blimitations?\s+(of\s+this|include|to\s+note|to\s+consider)\b/gi,
  /\bdisclaimer\b/gi,
  /\bit['’]?s?\s+(important|worth)\s+(to\s+)?not(e|ing)\s+that\b/gi,
  /\bwe\s+did\s+not\s+(test|evaluate|include|consider)\b/gi,
  /\bthis\s+(review|analysis|study)\s+(does\s+not|doesn['’]t)\s+(cover|include)\b/gi,
  /\bout\s+of\s+scope\b/gi,

  // Assumptions
  /\b(our|the)\s+assumption\w*\b/gi,
  /\bwe\s+assum(e|ed|ing)\b/gi,
  /\bfor\s+the\s+purposes?\s+of\s+this\b/gi,

  // Reproducibility
  /\byou\s+can\s+replicate\b/gi,
  /\breproducib\w+\b/gi,
  /\bfollow\s+(these|the\s+same)\s+steps\b/gi,
  /\brepeat\s+(this|the)\s+(experiment|test|process)\b/gi,

  // Tools and environment
  /\btools?\s+(used|we\s+used|i\s+used)\b/gi,
  /\b(software|hardware|equipment)\s+used\b/gi,
  /\b(tested|measured|analyzed)\s+(using|with|on)\b/gi,
  /\benvironment\s+(details|specs|specifications)\b/gi,
];

export function checkMethodologyTransparency(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content || '');
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 100) {
    return {
      id: 'eeat-methodology-transparency',
      title: 'Methodology transparency',
      description: 'Content is too short to assess methodology transparency.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Overlapping hits across patterns count once
  const totalMatches = countDistinctMatches(plainText, METHODOLOGY_PATTERNS);
  const categories: Set<string> = new Set();

  for (const pattern of METHODOLOGY_PATTERNS) {
    const matches = plainText.match(pattern);
    if (matches) {
      const src = pattern.source.toLowerCase();
      if (src.includes('test')) categories.add('testing process');
      else if (src.includes('evaluat') || src.includes('criteria') || src.includes('scor'))
        categories.add('evaluation criteria');
      else if (src.includes('sample') || src.includes('data') || src.includes('control'))
        categories.add('research process');
      else if (src.includes('scope') || src.includes('limitation') || src.includes('disclaimer'))
        categories.add('scope & limitations');
      else if (src.includes('assum')) categories.add('assumptions');
      else if (src.includes('replic') || src.includes('reproduc') || src.includes('repeat'))
        categories.add('reproducibility');
      else if (src.includes('tool') || src.includes('software') || src.includes('environment'))
        categories.add('tools & environment');
    }
  }

  const categoryList = Array.from(categories);

  if (totalMatches >= 5 && categoryList.length >= 3) {
    return {
      id: 'eeat-methodology-transparency',
      title: 'Methodology transparency',
      description: `Excellent methodology transparency across ${categoryList.length} areas: ${categoryList.join(', ')}. Transparent processes build reader trust and demonstrate expertise.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (totalMatches >= 2 && categoryList.length >= 1) {
    const missing: string[] = [];
    if (!categories.has('testing process') && !categories.has('evaluation criteria'))
      missing.push('evaluation criteria');
    if (!categories.has('scope & limitations')) missing.push('scope & limitations');
    if (!categories.has('tools & environment')) missing.push('tools used');
    return {
      id: 'eeat-methodology-transparency',
      title: 'Methodology transparency',
      description: `Partial methodology transparency (${categoryList.join(', ')}). Consider adding: ${missing.slice(0, 2).join(', ')}. Transparent methodology strengthens credibility.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-methodology-transparency',
    title: 'Methodology transparency',
    description:
      'No methodology transparency detected. Add: how you tested/evaluated, tools used, evaluation criteria, scope & limitations, and assumptions. Transparent processes are a strong expertise signal.',
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
