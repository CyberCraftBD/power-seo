// ============================================================================
// @power-seo/react — <Breadcrumb> Component
// ============================================================================

import { createElement, Fragment } from 'react';

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export interface BreadcrumbProps {
  /** Breadcrumb items from root to current page */
  items: BreadcrumbItem[];
  /** Separator between items (default: " / ") */
  separator?: string;
  /** CSS class for the nav element */
  className?: string;
  /** CSS class for each link */
  linkClassName?: string;
  /** CSS class for the current (last) item */
  activeClassName?: string;
  /** Whether to render the JSON-LD alongside the visual breadcrumb (default: true) */
  includeJsonLd?: boolean;
}

/**
 * Visual breadcrumb navigation with optional BreadcrumbList JSON-LD.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { name: 'Home', url: '/' },
 *     { name: 'Blog', url: '/blog' },
 *     { name: 'Current Post' },
 *   ]}
 * />
 * ```
 */
export function Breadcrumb({
  items,
  separator = ' / ',
  className,
  linkClassName,
  activeClassName,
  includeJsonLd = true,
}: BreadcrumbProps) {
  // Build JSON-LD schema
  const jsonLdData = {
    '@context': 'https://schema.org' as const,
    '@type': 'BreadcrumbList' as const,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };

  const children: ReturnType<typeof createElement>[] = [];

  // Render visual breadcrumb
  const breadcrumbItems: ReturnType<typeof createElement>[] = [];
  items.forEach((item, index) => {
    if (index > 0) {
      breadcrumbItems.push(
        createElement('span', { key: `sep-${index}`, 'aria-hidden': 'true' }, separator),
      );
    }

    const isLast = index === items.length - 1;

    if (item.url && !isLast) {
      breadcrumbItems.push(
        createElement(
          'a',
          { key: `item-${index}`, href: item.url, className: linkClassName },
          item.name,
        ),
      );
    } else {
      breadcrumbItems.push(
        createElement(
          'span',
          {
            key: `item-${index}`,
            className: isLast ? activeClassName : undefined,
            'aria-current': isLast ? 'page' : undefined,
          },
          item.name,
        ),
      );
    }
  });

  children.push(
    createElement(
      'nav',
      { 'aria-label': 'Breadcrumb', className },
      createElement(
        'ol',
        {
          style: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexWrap: 'wrap' as const,
          },
        },
        ...breadcrumbItems,
      ),
    ),
  );

  // Render JSON-LD
  if (includeJsonLd) {
    children.push(
      createElement('script', {
        key: 'breadcrumb-jsonld',
        type: 'application/ld+json',
        dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLdData) },
      }),
    );
  }

  return createElement(Fragment, null, ...children);
}
