// ============================================================================
// @power-seo/preview — React Components
// ============================================================================

import { createElement, useState, useMemo } from 'react';
import type { TwitterCardType } from '@power-seo/core';
import { generateSerpPreview } from './serp.js';
import { generateOgPreview } from './og.js';
import { generateTwitterPreview } from './twitter.js';

// --- SerpPreview ---

export interface SerpPreviewProps {
  title: string;
  description: string;
  url: string;
  siteTitle?: string;
}

/**
 * Renders a Google-style SERP result card.
 */
export function SerpPreview({ title, description, url, siteTitle }: SerpPreviewProps) {
  const data = useMemo(
    () => generateSerpPreview({ title, description, url, siteTitle }),
    [title, description, url, siteTitle],
  );

  return createElement(
    'div',
    {
      style: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #dfe1e5',
        backgroundColor: '#fff',
      },
    },
    // URL breadcrumb
    createElement(
      'div',
      { style: { fontSize: '12px', color: '#202124', marginBottom: '4px' } },
      createElement('cite', { style: { fontStyle: 'normal', color: '#4d5156' } }, data.displayUrl),
    ),
    // Title
    createElement(
      'h3',
      {
        style: {
          fontSize: '20px',
          lineHeight: '1.3',
          color: '#1a0dab',
          margin: '0 0 4px 0',
          fontWeight: 400,
          cursor: 'pointer',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      },
      data.title,
    ),
    // Description
    createElement(
      'div',
      {
        style: {
          fontSize: '14px',
          lineHeight: '1.58',
          color: '#4d5156',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
      },
      data.description,
    ),
    // Validation warnings
    data.titleTruncated
      ? createElement(
          'div',
          {
            style: {
              marginTop: '8px',
              padding: '6px 8px',
              backgroundColor: '#fff8e1',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#f57f17',
            },
          },
          'Title will be truncated in search results.',
        )
      : null,
    data.descriptionTruncated
      ? createElement(
          'div',
          {
            style: {
              marginTop: '4px',
              padding: '6px 8px',
              backgroundColor: '#fff8e1',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#f57f17',
            },
          },
          'Description will be truncated in search results.',
        )
      : null,
  );
}

// --- OgPreview ---

export interface OgPreviewProps {
  title: string;
  description: string;
  url: string;
  image?: { url: string; width?: number; height?: number };
  siteName?: string;
}

/**
 * Renders a Facebook/Open Graph card mockup.
 */
export function OgPreview({ title, description, url, image, siteName }: OgPreviewProps) {
  const data = useMemo(
    () => generateOgPreview({ title, description, url, image, siteName }),
    [title, description, url, image, siteName],
  );

  return createElement(
    'div',
    {
      style: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        maxWidth: '524px',
        border: '1px solid #dadde1',
        borderRadius: '4px',
        overflow: 'hidden',
        backgroundColor: '#fff',
      },
    },
    // Image
    data.image
      ? createElement('div', {
          style: {
            width: '100%',
            height: '274px',
            backgroundColor: '#f0f2f5',
            backgroundImage: `url(${data.image.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          },
        })
      : null,
    // Content
    createElement(
      'div',
      {
        style: {
          padding: '10px 12px',
          borderTop: '1px solid #dadde1',
          backgroundColor: '#f2f3f5',
        },
      },
      // Site name
      createElement(
        'div',
        {
          style: {
            fontSize: '12px',
            color: '#606770',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.03em',
          },
        },
        data.siteName || new globalThis.URL(data.url).hostname,
      ),
      // Title
      createElement(
        'div',
        {
          style: {
            fontSize: '16px',
            fontWeight: 600,
            color: '#1d2129',
            lineHeight: '1.38',
            marginTop: '3px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        data.title,
      ),
      // Description
      createElement(
        'div',
        {
          style: {
            fontSize: '14px',
            color: '#606770',
            lineHeight: '1.38',
            marginTop: '3px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        data.description,
      ),
    ),
    // Image validation warning
    data.image && !data.image.valid
      ? createElement(
          'div',
          {
            style: {
              padding: '6px 12px',
              backgroundColor: '#fff3cd',
              fontSize: '11px',
              color: '#856404',
            },
          },
          data.image.message,
        )
      : null,
  );
}

// --- TwitterPreview ---

export interface TwitterPreviewProps {
  cardType: TwitterCardType;
  title: string;
  description: string;
  image?: { url: string; width?: number; height?: number };
  site?: string;
}

/**
 * Renders a Twitter/X card mockup.
 */
export function TwitterPreview({ cardType, title, description, image, site }: TwitterPreviewProps) {
  const data = useMemo(
    () => generateTwitterPreview({ cardType, title, description, image, site }),
    [cardType, title, description, image, site],
  );

  const isLarge = cardType === 'summary_large_image';

  return createElement(
    'div',
    {
      style: {
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        maxWidth: isLarge ? '504px' : '504px',
        border: '1px solid #e1e8ed',
        borderRadius: '14px',
        overflow: 'hidden',
        backgroundColor: '#fff',
      },
    },
    // Image (large card: top, summary: left side handled via flex below)
    isLarge && data.image
      ? createElement('div', {
          style: {
            width: '100%',
            height: '252px',
            backgroundColor: '#e1e8ed',
            backgroundImage: `url(${data.image.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          },
        })
      : null,
    // Content wrapper
    createElement(
      'div',
      {
        style: {
          display: isLarge ? 'block' : 'flex',
          alignItems: 'stretch',
        },
      },
      // Summary card: small thumbnail
      !isLarge && data.image
        ? createElement('div', {
            style: {
              width: '125px',
              minHeight: '125px',
              flexShrink: 0,
              backgroundColor: '#e1e8ed',
              backgroundImage: `url(${data.image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            },
          })
        : null,
      // Text content
      createElement(
        'div',
        {
          style: {
            padding: '12px',
            flex: 1,
            overflow: 'hidden',
          },
        },
        // Domain
        createElement(
          'div',
          { style: { fontSize: '13px', color: '#8899a6', marginBottom: '2px' } },
          data.domain ? `@${data.domain}` : '',
        ),
        // Title
        createElement(
          'div',
          {
            style: {
              fontSize: '15px',
              fontWeight: 700,
              color: '#0f1419',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          },
          data.title,
        ),
        // Description
        createElement(
          'div',
          {
            style: {
              fontSize: '14px',
              color: '#536471',
              lineHeight: '1.3',
              marginTop: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            },
          },
          data.description,
        ),
      ),
    ),
    // Image validation warning
    data.image && !data.image.valid
      ? createElement(
          'div',
          {
            style: {
              padding: '6px 12px',
              backgroundColor: '#fff3cd',
              fontSize: '11px',
              color: '#856404',
            },
          },
          data.image.message,
        )
      : null,
  );
}

// --- PreviewPanel ---

export interface PreviewPanelProps {
  title: string;
  description: string;
  url: string;
  image?: { url: string; width?: number; height?: number };
  siteName?: string;
  siteTitle?: string;
  twitterSite?: string;
  twitterCardType?: TwitterCardType;
}

type PreviewTab = 'google' | 'facebook' | 'twitter';

/**
 * Tabbed container with Google, Facebook, and Twitter preview cards.
 */
export function PreviewPanel({
  title,
  description,
  url,
  image,
  siteName,
  siteTitle,
  twitterSite,
  twitterCardType = 'summary_large_image',
}: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('google');

  const tabs: Array<{ id: PreviewTab; label: string }> = [
    { id: 'google', label: 'Google' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'twitter', label: 'Twitter / X' },
  ];

  return createElement(
    'div',
    {
      style: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
    },
    // Tab bar
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          gap: '0px',
          borderBottom: '2px solid #e0e0e0',
          marginBottom: '16px',
        },
      },
      ...tabs.map((tab) =>
        createElement(
          'button',
          {
            key: tab.id,
            onClick: () => setActiveTab(tab.id),
            type: 'button',
            style: {
              padding: '8px 16px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #1a73e8' : '2px solid transparent',
              marginBottom: '-2px',
              backgroundColor: 'transparent',
              color: activeTab === tab.id ? '#1a73e8' : '#5f6368',
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            },
          },
          tab.label,
        ),
      ),
    ),
    // Active preview
    activeTab === 'google'
      ? createElement(SerpPreview, { title, description, url, siteTitle })
      : null,
    activeTab === 'facebook'
      ? createElement(OgPreview, { title, description, url, image, siteName })
      : null,
    activeTab === 'twitter'
      ? createElement(TwitterPreview, {
          cardType: twitterCardType,
          title,
          description,
          image,
          site: twitterSite,
        })
      : null,
  );
}
