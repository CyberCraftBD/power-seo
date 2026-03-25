// @power-seo/content-analysis -- Intent Modifier Analysis Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

/** Human-readable labels for intent types. */
const INTENT_LABELS: Record<string, string> = {
  informational: 'informational intent',
  navigational: 'navigational intent',
  transactional: 'transactional/action intent',
  'commercial-investigation': 'commercial investigation intent',
  unknown: 'unclear intent',
};

export function checkIntentModifierAnalysis(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-modifier-analysis',
      title: 'Intent modifier analysis',
      description: 'No focus keyphrase set. Set one to analyze intent modifiers.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const result = detectIntent(focusKeyphrase);
  const modifiers = result.modifiers;

  if (modifiers.length === 0) {
    return {
      id: 'intent-modifier-analysis',
      title: 'Intent modifier analysis',
      description:
        'No intent modifier words found in the keyphrase. Bare keywords are harder to optimize ' +
        'because search engines must guess user intent. Add modifiers like "how to", "best", ' +
        '"buy", "review", "vs", or "guide" to signal clear intent.',
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  // Build a deduplicated summary of modifiers grouped by intent
  const byIntent = new Map<string, string[]>();
  for (const mod of modifiers) {
    const label: string = INTENT_LABELS[mod.signalsIntent] ?? 'unclear intent';
    const existing = byIntent.get(label);
    if (existing) {
      if (!existing.includes(mod.word)) {
        existing.push(mod.word);
      }
    } else {
      byIntent.set(label, [mod.word]);
    }
  }

  const parts: string[] = [];
  for (const [label, words] of byIntent) {
    const quoted = words.map(w => '"' + w + '"').join(', ');
    parts.push(quoted + ' (' + label + ')');
  }

  const summary = 'Modifiers found: ' + parts.join('; ') + '.';

  if (modifiers.length >= 2) {
    return {
      id: 'intent-modifier-analysis',
      title: 'Intent modifier analysis',
      description:
        modifiers.length + ' intent modifiers detected. ' + summary +
        ' Multiple modifiers give search engines strong signals about what the user expects.',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // Exactly 1 modifier
  const firstMod = modifiers[0];
  const singleLabel: string = firstMod
    ? (INTENT_LABELS[firstMod.signalsIntent] ?? 'unclear intent')
    : 'unclear intent';

  return {
    id: 'intent-modifier-analysis',
    title: 'Intent modifier analysis',
    description:
      '1 intent modifier detected. ' + summary +
      ' A single modifier signals ' + singleLabel +
      ', but adding a second modifier would strengthen the intent signal and help search engines ' +
      'match your content more precisely.',
    status: 'ok',
    score: 3,
    maxScore: 5,
  };
}
