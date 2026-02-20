// ============================================================================
// @power-seo/ai — Title Generation Prompt Builder & Parser
// ============================================================================

import { calculatePixelWidth, TITLE_MAX_LENGTH } from '@power-seo/core';
import type { PromptTemplate, TitleInput, TitleResult } from '../types.js';

export function buildTitlePrompt(input: TitleInput): PromptTemplate {
  const contentExcerpt = input.content.length > 500 ? input.content.slice(0, 500) + '...' : input.content;

  let userPrompt = `Generate 5 SEO-optimized title tag variants for the following content.\n\n`;
  userPrompt += `Content excerpt: ${contentExcerpt}\n`;
  if (input.focusKeyphrase) {
    userPrompt += `Focus keyphrase: ${input.focusKeyphrase}\n`;
  }
  if (input.tone) {
    userPrompt += `Tone: ${input.tone}\n`;
  }
  userPrompt += `\nRequirements:\n`;
  userPrompt += `- Maximum ${TITLE_MAX_LENGTH} characters each\n`;
  userPrompt += `- Place the focus keyphrase near the beginning if provided\n`;
  userPrompt += `- Make each variant unique in approach (question, how-to, list, benefit, action)\n`;
  userPrompt += `- Return as a numbered list (1. Title one\\n2. Title two\\n...)`;

  return {
    system:
      'You are an SEO title specialist. Generate compelling, click-worthy page titles that rank well in search results. Each title should be unique in approach while targeting the same topic.',
    user: userPrompt,
    maxTokens: 500,
  };
}

export function parseTitleResponse(response: string): TitleResult[] {
  const results: TitleResult[] = [];
  const trimmed = response.trim();

  if (!trimmed) {
    return results;
  }

  // Try parsing as JSON array first
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        const title = typeof item === 'string' ? item : item?.title;
        if (typeof title === 'string' && title.trim().length > 0) {
          const t = title.trim();
          results.push({
            title: t,
            charCount: t.length,
            pixelWidth: calculatePixelWidth(t),
          });
        }
      }
      return results;
    }
  } catch {
    // Not JSON, try numbered list parsing
  }

  // Parse numbered list format: "1. Title here"
  const lines = trimmed.split('\n');
  for (const line of lines) {
    const match = line.match(/^\d+[.)]\s*(.+)/);
    if (match && match[1]) {
      const title = match[1].trim();
      if (title.length > 0) {
        results.push({
          title,
          charCount: title.length,
          pixelWidth: calculatePixelWidth(title),
        });
      }
    }
  }

  return results;
}
