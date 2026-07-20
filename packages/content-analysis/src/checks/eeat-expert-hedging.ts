// @power-seo/content-analysis — E-E-A-T: Expert Hedging & Precision
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, countDistinctMatches } from '@power-seo/core';

// Good epistemic language — calibrated confidence (experts use these)
const HEDGING_PATTERNS: RegExp[] = [
  /\bresearch\s+(suggests?|indicates?|shows?)\b/gi,
  /\bevidence\s+(suggests?|indicates?|shows?|supports?)\b/gi,
  /\bstudies\s+(suggest|indicate|show|have\s+found)\b/gi,
  /\baccording\s+to\s+(research|studies|data|experts?)\b/gi,
  /\b(may|might|could)\s+(help|improve|reduce|increase|affect|cause|lead\s+to)\b/gi,
  /\btends?\s+to\b/gi,
  /\bgenerally\s+(speaking|considered)\b/gi,
  /\bin\s+(most|many|some)\s+cases\b/gi,
  /\btypically\b/gi,
  /\bit\s+appears?\s+that\b/gi,
  /\bit\s+seems?\s+(that|like)\b/gi,
  /\bcurrent\s+(evidence|research|data)\b/gi,
  /\bas\s+of\s+(this\s+writing|\d{4})\b/gi,
  /\bbased\s+on\s+(available|current|existing)\s+(data|evidence|research)\b/gi,
  /\bto\s+the\s+best\s+of\s+(our|my)\s+knowledge\b/gi,
  /\bwhile\s+more\s+research\s+is\s+needed\b/gi,
  /\bfurther\s+(research|study|investigation)\s+is\s+needed\b/gi,
  /\blimitations?\s+(include|of\s+this|to\s+consider)\b/gi,
  /\bit['’]?s?\s+worth\s+noting\s+that\b/gi,
  /\bhowever,?\s+it['’]?s?\s+important\s+to\b/gi,
  /\bthat\s+said\b/gi,
  /\bon\s+the\s+other\s+hand\b/gi,
  /\bwith\s+the\s+caveat\s+that\b/gi,
];

// Bad absolute claims — unsubstantiated certainty (non-experts overuse these)
const ABSOLUTE_PATTERNS: RegExp[] = [
  /\bguaranteed\s+(to|results?|success)\b/gi,
  /\b100\s*%\s+(proven|guaranteed|effective|safe|sure|certain)\b/gi,
  /\bdefinitely\s+(works?|will|the\s+best)\b/gi,
  /\balways\s+(works?|will|leads?\s+to|results?\s+in)\b/gi,
  /\bnever\s+(fails?|wrong|a\s+bad)\b/gi,
  /\bthe\s+only\s+(way|method|solution|answer)\b/gi,
  /\babsolutely\s+(the\s+best|essential|necessary|certain)\b/gi,
  /\bwithout\s+a\s+doubt\b/gi,
  /\bundeniably\b/gi,
  /\bunquestionably\b/gi,
  /\birrefutably\b/gi,
  /\bscientifically\s+proven\b/gi,
  /\bproven\s+to\s+(work|cure|fix|solve)\b/gi,
  /\bcure[\s-]all\b/gi,
  /\bmiracle\s+(cure|solution|product)\b/gi,
  /\binstant\s+(results?|cure|fix|solution)\b/gi,
  /\bno\s+risk\b/gi,
  /\brisk[\s-]free\b/gi,
  /\bfoolproof\b/gi,
  /\bsecret\s+(formula|method|trick|hack)\s+that\b/gi,
  /\beveryone\s+(should|must|needs?\s+to)\b/gi,
  /\byou\s+must\s+(buy|try|use|get)\b/gi,
  /\bact\s+now\b/gi,
  /\blimited\s+time\s+only\b/gi,
  /\bbefore\s+it['’]?s?\s+too\s+late\b/gi,
];

export function checkExpertHedging(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content || '');
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 50) {
    return {
      id: 'eeat-expert-hedging',
      title: 'Expert precision',
      description: 'Content is too short to analyze claim precision.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Overlapping hits across patterns count once
  const hedgingCount = countDistinctMatches(plainText, HEDGING_PATTERNS);

  const absoluteCount = countDistinctMatches(plainText, ABSOLUTE_PATTERNS);
  const absoluteExamples: string[] = [];
  for (const pattern of ABSOLUTE_PATTERNS) {
    if (absoluteExamples.length >= 3) break;
    const matches = plainText.match(pattern);
    if (matches) {
      for (const m of matches) {
        if (absoluteExamples.length < 3) {
          absoluteExamples.push(`"${m.trim()}"`);
        }
      }
    }
  }

  // Good: has hedging language AND few/no absolute claims
  if (hedgingCount >= 3 && absoluteCount === 0) {
    return {
      id: 'eeat-expert-hedging',
      title: 'Expert precision',
      description: `Excellent claim precision with ${hedgingCount} calibrated statements ("research suggests", "evidence indicates"). No unsubstantiated absolute claims detected. This signals expert-level communication.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (hedgingCount >= 2 && absoluteCount <= 1) {
    return {
      id: 'eeat-expert-hedging',
      title: 'Expert precision',
      description: `Good claim precision with ${hedgingCount} hedged statements.${absoluteCount > 0 ? ` Found ${absoluteCount} absolute claim: ${absoluteExamples.join(', ')} — consider softening.` : ''} Experts use calibrated confidence rather than absolute certainty.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (hedgingCount >= 1 && absoluteCount <= 3) {
    const suggestions: string[] = [];
    if (absoluteCount > 0)
      suggestions.push(`soften ${absoluteCount} absolute claims: ${absoluteExamples.join(', ')}`);
    suggestions.push(
      'add hedging phrases: "research suggests", "in most cases", "evidence indicates"',
    );
    return {
      id: 'eeat-expert-hedging',
      title: 'Expert precision',
      description: `Moderate claim precision. ${suggestions.join('; ')}. Calibrated language builds credibility.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  if (absoluteCount > 3) {
    return {
      id: 'eeat-expert-hedging',
      title: 'Expert precision',
      description: `${absoluteCount} unsubstantiated absolute claims detected (${absoluteExamples.join(', ')}). This undermines credibility. Replace with evidence-backed, calibrated language: "research suggests", "studies indicate", "in most cases".`,
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-expert-hedging',
    title: 'Expert precision',
    description:
      'No hedging or precision language detected. Experts qualify claims with "research suggests", "evidence indicates", "in most cases". Add calibrated confidence language to demonstrate expertise.',
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
