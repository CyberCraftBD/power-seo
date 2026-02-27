// @power-seo/ai — Meta Description Prompt Builder & Parser
// ----------------------------------------------------------------------------

import {
  calculatePixelWidth,
  validateMetaDescription,
  META_DESCRIPTION_MAX_LENGTH,
} from '@power-seo/core';
import type { PromptTemplate, MetaDescriptionInput, MetaDescriptionResult } from '../types.js';

export function buildMetaDescriptionPrompt(input: MetaDescriptionInput): PromptTemplate {
  const maxLen = input.maxLength ?? META_DESCRIPTION_MAX_LENGTH;
  const contentExcerpt =
    input.content.length > 500 ? input.content.slice(0, 500) + '...' : input.content;

  let userPrompt = `Write a compelling meta description for the following page.\n\n`;
  userPrompt += `Title: ${input.title}\n`;
  userPrompt += `Content excerpt: ${contentExcerpt}\n`;
  if (input.focusKeyphrase) {
    userPrompt += `Focus keyphrase: ${input.focusKeyphrase}\n`;
  }
  if (input.tone) {
    userPrompt += `Tone: ${input.tone}\n`;
  }
  userPrompt += `\nRequirements:\n`;
  userPrompt += `- Maximum ${maxLen} characters\n`;
  userPrompt += `- Include a call to action\n`;
  userPrompt += `- Naturally incorporate the focus keyphrase if provided\n`;
  userPrompt += `- Return ONLY the meta description text, no quotes or extra formatting`;

  return {
    system:
      'You are an expert SEO specialist. Write concise, compelling meta descriptions that maximize click-through rates from search results. Follow the character limit strictly.',
    user: userPrompt,
    maxTokens: 200,
  };
}

export function parseMetaDescriptionResponse(response: string): MetaDescriptionResult {
  // Strip surrounding quotes if present
  let description = response.trim();
  if (
    (description.startsWith('"') && description.endsWith('"')) ||
    (description.startsWith("'") && description.endsWith("'"))
  ) {
    description = description.slice(1, -1);
  }

  const charCount = description.length;
  const pixelWidth = calculatePixelWidth(description);
  const validation = validateMetaDescription(description);

  return {
    description,
    charCount,
    pixelWidth,
    isValid: validation.valid,
    validationMessage: validation.valid ? undefined : validation.message,
  };
}
