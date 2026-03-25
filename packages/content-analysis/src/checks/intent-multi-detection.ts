// @power-seo/content-analysis -- Multi-Intent Detection Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

/** Human-readable labels for intent types. */
const INTENT_LABELS: Record<string, string> = {
  informational: 'informational',
  navigational: 'navigational',
  transactional: 'transactional',
  'commercial-investigation': 'commercial investigation',
  unknown: 'unknown',
};

export function checkIntentMultiDetection(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-multi-detection',
      title: 'Multi-intent detection',
      description: 'No focus keyphrase set. Set one to check for mixed intent signals.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const result = detectIntent(focusKeyphrase);
  const signals = result.signals;

  // Count how many distinct intent types have meaningful confidence (> 0)
  const meaningfulSignals = signals.filter(s => s.confidence > 0 && s.type !== 'unknown');
  const count = meaningfulSignals.length;

  if (count <= 1) {
    // Single clear intent
    const primary: { type: string; confidence: number } | undefined = meaningfulSignals[0];
    const label: string = primary ? (INTENT_LABELS[primary.type] ?? primary.type) : 'unknown';
    const pct = primary ? Math.round(primary.confidence * 100) : 0;

    return {
      id: 'intent-multi-detection',
      title: 'Multi-intent detection',
      description:
        'Single clear intent detected: ' + label + ' (' + pct + '% confidence). ' +
        'No ambiguity found. Search engines can confidently match this keyphrase to the right content type.',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // Build descriptions of each signal
  const signalDescriptions = meaningfulSignals.map(s => {
    const label: string = INTENT_LABELS[s.type] ?? s.type;
    return label + ' (' + Math.round(s.confidence * 100) + '%)';
  });

  if (count === 2) {
    const primary: { type: string; confidence: number } | undefined = meaningfulSignals[0];
    const secondary: { type: string; confidence: number } | undefined = meaningfulSignals[1];

    if (!primary || !secondary) {
      return {
        id: 'intent-multi-detection',
        title: 'Multi-intent detection',
        description: 'Could not fully analyze intent signals. Consider refining your keyphrase.',
        status: 'ok',
        score: 3,
        maxScore: 5,
      };
    }

    // Check if secondary is weak enough to not be a real conflict
    if (secondary.confidence < 0.3) {
      const primaryLabel: string = INTENT_LABELS[primary.type] ?? primary.type;
      const secondaryLabel: string = INTENT_LABELS[secondary.type] ?? secondary.type;

      return {
        id: 'intent-multi-detection',
        title: 'Multi-intent detection',
        description:
          'Mild ambiguity: primary intent is ' + primaryLabel +
          ' (' + Math.round(primary.confidence * 100) + '%) with a weak secondary signal for ' +
          secondaryLabel + ' (' + Math.round(secondary.confidence * 100) +
          '%). Your content can address both by leading with ' + primaryLabel +
          ' content and including a brief ' + secondaryLabel + ' section.',
        status: 'ok',
        score: 3,
        maxScore: 5,
      };
    }

    // Two competing intents
    const primaryLabel: string = INTENT_LABELS[primary.type] ?? primary.type;
    const secondaryLabel: string = INTENT_LABELS[secondary.type] ?? secondary.type;

    return {
      id: 'intent-multi-detection',
      title: 'Multi-intent detection',
      description:
        'Competing intents detected: ' + signalDescriptions.join(' vs. ') +
        '. The keyphrase signals both ' + primaryLabel + ' and ' + secondaryLabel +
        ' intent nearly equally. Consider splitting into two pages or narrowing the keyphrase ' +
        'to target one intent. For example, add "how to" for informational or "buy" for transactional.',
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  // 3+ conflicting intents
  return {
    id: 'intent-multi-detection',
    title: 'Multi-intent detection',
    description:
      'Heavily ambiguous keyphrase with ' + count + ' conflicting intent signals: ' +
      signalDescriptions.join(', ') +
      '. Search engines will struggle to determine what content to serve. ' +
      'Narrow your keyphrase by removing ambiguous words or adding a clear intent modifier ' +
      'to target a single intent type.',
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
