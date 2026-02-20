// ============================================================================
// @power-seo/content-analysis — React Components
// ============================================================================

import { createElement, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import type { AnalysisConfig } from './types.js';
import { analyzeContent } from './analyzer.js';

// --- ScorePanel ---

export interface ScorePanelProps {
  score: number;
  maxScore: number;
}

function getScoreColor(percentage: number): string {
  if (percentage >= 70) return '#1e8e3e';
  if (percentage >= 40) return '#f29900';
  return '#d93025';
}

function getScoreLabel(percentage: number): string {
  if (percentage >= 70) return 'Good';
  if (percentage >= 40) return 'OK';
  return 'Needs improvement';
}

/**
 * Displays an overall SEO score as a colored bar with label.
 */
export function ScorePanel({ score, maxScore }: ScorePanelProps) {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const color = getScoreColor(percentage);
  const label = getScoreLabel(percentage);

  return createElement(
    'div',
    {
      style: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        backgroundColor: '#fff',
      },
    },
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        },
      },
      createElement(
        'span',
        { style: { fontWeight: 600, fontSize: '14px', color: '#333' } },
        'SEO Score',
      ),
      createElement(
        'span',
        { style: { fontWeight: 700, fontSize: '18px', color } },
        `${percentage}%`,
      ),
    ),
    createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '8px',
          backgroundColor: '#e8e8e8',
          borderRadius: '4px',
          overflow: 'hidden',
        },
      },
      createElement('div', {
        style: {
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        },
      }),
    ),
    createElement(
      'div',
      { style: { marginTop: '4px', fontSize: '12px', color: '#666' } },
      `${label} — ${score}/${maxScore} points`,
    ),
  );
}

// --- CheckList ---

export interface CheckListProps {
  results: AnalysisResult[];
}

const STATUS_ICONS: Record<string, string> = {
  good: '\u2705',
  ok: '\u26a0\ufe0f',
  poor: '\u274c',
};

const STATUS_COLORS: Record<string, string> = {
  good: '#1e8e3e',
  ok: '#f29900',
  poor: '#d93025',
};

/**
 * Renders analysis results as a list with status icons.
 */
export function CheckList({ results }: CheckListProps) {
  return createElement(
    'ul',
    {
      style: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
    },
    ...results.map((result) =>
      createElement(
        'li',
        {
          key: result.id,
          style: {
            padding: '10px 12px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
          },
        },
        createElement(
          'span',
          { style: { flexShrink: 0, fontSize: '14px' } },
          STATUS_ICONS[result.status] ?? '',
        ),
        createElement(
          'div',
          { style: { flex: 1 } },
          createElement(
            'div',
            {
              style: {
                fontWeight: 600,
                fontSize: '13px',
                color: STATUS_COLORS[result.status] ?? '#333',
              },
            },
            result.title,
          ),
          createElement(
            'div',
            { style: { fontSize: '12px', color: '#555', marginTop: '2px' } },
            result.description,
          ),
        ),
      ),
    ),
  );
}

// --- ContentAnalyzer ---

export interface ContentAnalyzerProps {
  input: ContentAnalysisInput;
  config?: AnalysisConfig;
  children?: ReactNode;
}

/**
 * All-in-one component that runs analysis and renders score + check list.
 */
export function ContentAnalyzer({ input, config, children }: ContentAnalyzerProps) {
  const output = useMemo(() => analyzeContent(input, config), [input, config]);

  return createElement(
    'div',
    {
      style: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
    },
    createElement(ScorePanel, { score: output.score, maxScore: output.maxScore }),
    createElement('div', { style: { height: '12px' } }),
    createElement(CheckList, { results: output.results }),
    children ?? null,
  );
}
