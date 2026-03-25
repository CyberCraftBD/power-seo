// @power-seo/content-analysis — Navigational Content Clarity Check
// ----------------------------------------------------------------------------
// Checks whether navigational content is clear and direct: brand prominence,
// direct links, contact info, conciseness, and navigation cues.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

interface NavigationalElement {
  name: string;
  present: boolean;
}

export function checkIntentNavigationalClarity(
  input: ContentAnalysisInput,
): AnalysisResult {
  const id = 'intent-navigational-clarity';
  const title = 'Navigational content clarity';

  // No keyphrase — cannot determine intent
  if (!input.focusKeyphrase || input.focusKeyphrase.trim().length === 0) {
    return { id, title, description: 'No focus keyphrase set.', status: 'na', score: 0, maxScore: 5 };
  }

  // Only applies to navigational intent
  const intent = detectIntent(input.focusKeyphrase);
  if (intent.primary !== 'navigational') {
    return {
      id,
      title,
      description: `Detected intent is "${intent.primary}" — this check only applies to navigational content.`,
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const content = input.content;
  const plainText = stripHtml(content);
  const plainTextLower = plainText.toLowerCase();
  const words = getWords(content);
  const wordCount = words.length;

  // Determine target term: keyphrase itself and its first word
  const keyphrase = input.focusKeyphrase.trim().toLowerCase();
  const keyphraseWords = keyphrase.split(/\s+/);
  const firstWord = keyphraseWords[0];

  const elements: NavigationalElement[] = [];

  // 1. Brand / target prominence: keyphrase (or first word) in title AND first 100 words
  const titleLower = (input.title ?? '').toLowerCase();
  const first100Words = words.slice(0, 100).join(' ').toLowerCase();

  const keyphraseInTitle = titleLower.includes(keyphrase)
    || (firstWord !== undefined && titleLower.includes(firstWord));
  const keyphraseInIntro = first100Words.includes(keyphrase)
    || (firstWord !== undefined && first100Words.includes(firstWord));

  elements.push({
    name: 'Brand/target prominence',
    present: keyphraseInTitle && keyphraseInIntro,
  });

  // 2. Direct links: at least 1 <a href link
  const linkMatches = content.match(/<a\s[^>]*href\s*=/gi);
  const linkCount = linkMatches ? linkMatches.length : 0;
  elements.push({ name: 'Direct links', present: linkCount >= 1 });

  // 3. Contact info
  const hasContact = /\b(?:email|phone|address|contact)\b/i.test(plainText)
    || /\S+@\S+\.\S+/.test(plainText);
  elements.push({ name: 'Contact information', present: hasContact });

  // 4. Conciseness: word count <= 800 (navigational pages should be direct)
  elements.push({ name: 'Conciseness (800 words or fewer)', present: wordCount <= 800 });

  // 5. Navigation cues
  const hasNavCues = /\b(?:click here|visit|go to|access|log in|sign in)\b/i.test(plainTextLower);
  elements.push({ name: 'Navigation cues', present: hasNavCues });

  // Tally present elements
  const presentElements = elements.filter((e) => e.present);
  const presentCount = presentElements.length;
  const missingElements = elements.filter((e) => !e.present);

  // Scoring
  let score: number;
  let status: 'good' | 'ok' | 'poor';

  if (presentCount >= 4) {
    score = 5;
    status = 'good';
  } else if (presentCount >= 2) {
    score = 3;
    status = 'ok';
  } else {
    score = 1;
    status = 'poor';
  }

  // Build description
  const presentList = presentElements.map((e) => e.name).join(', ');
  const missingList = missingElements.map((e) => e.name).join(', ');

  let description: string;
  if (presentCount >= 4) {
    description = `Clear navigational content (${presentCount}/5 elements). Present: ${presentList}.`;
    if (missingElements.length > 0) {
      description += ` Consider also adding: ${missingList}.`;
    }
  } else if (presentCount >= 2) {
    description = `Navigational content could be clearer (${presentCount}/5 elements). Present: ${presentList}. Missing: ${missingList}.`;
  } else {
    description = `Navigational content lacks clarity (${presentCount}/5).${presentCount > 0 ? ` Present: ${presentList}.` : ''} Missing: ${missingList}.`;
  }

  return { id, title, description, status, score, maxScore: 5 };
}
