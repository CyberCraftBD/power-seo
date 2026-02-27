// @power-seo/ai — Content Suggestions Prompt Builder & Parser
// ----------------------------------------------------------------------------

import { stripHtml, getWords } from '@power-seo/core';
import type { PromptTemplate, ContentSuggestionInput, ContentSuggestion } from '../types.js';

export function buildContentSuggestionsPrompt(input: ContentSuggestionInput): PromptTemplate {
  const plainText = stripHtml(input.content);
  const words = getWords(plainText);
  const contentExcerpt = plainText.length > 800 ? plainText.slice(0, 800) + '...' : plainText;

  let userPrompt = `Analyze the following content and suggest improvements for SEO.\n\n`;
  userPrompt += `Title: ${input.title}\n`;
  userPrompt += `Word count: ${words.length}\n`;
  userPrompt += `Content excerpt: ${contentExcerpt}\n`;
  if (input.focusKeyphrase) {
    userPrompt += `Focus keyphrase: ${input.focusKeyphrase}\n`;
  }
  if (input.analysisResults) {
    userPrompt += `\nCurrent analysis results:\n${input.analysisResults}\n`;
  }
  userPrompt += `\nReturn a JSON array of suggestions with this structure:\n`;
  userPrompt += `[{ "type": "heading"|"paragraph"|"keyword"|"link", "suggestion": "...", "priority": 1-5, "reason": "..." }]\n`;
  userPrompt += `Return ONLY the JSON array, no other text.`;

  return {
    system:
      'You are an SEO content advisor. Analyze content and provide actionable suggestions to improve search rankings. Focus on heading structure, keyword usage, internal linking, and content completeness. Return valid JSON only.',
    user: userPrompt,
    maxTokens: 1000,
  };
}

export function parseContentSuggestionsResponse(response: string): ContentSuggestion[] {
  try {
    let cleaned = response.trim();

    // Handle markdown code fences
    if (cleaned.startsWith('```')) {
      const firstNewline = cleaned.indexOf('\n');
      cleaned = cleaned.slice(firstNewline + 1);
      const lastFence = cleaned.lastIndexOf('```');
      if (lastFence !== -1) {
        cleaned = cleaned.slice(0, lastFence);
      }
    }

    cleaned = cleaned.trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item: Record<string, unknown>) =>
        item &&
        typeof item.type === 'string' &&
        typeof item.suggestion === 'string' &&
        typeof item.priority === 'number',
    ) as ContentSuggestion[];
  } catch {
    return [];
  }
}
