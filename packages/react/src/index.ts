// ============================================================================
// @power-seo/react — Main Entry Point
// ============================================================================

// Context
export { SEOContext, useDefaultSEO } from './context.js';

// Components
export { DefaultSEO } from './components/DefaultSEO.js';
export type { DefaultSEOProps } from './components/DefaultSEO.js';

export { SEO } from './components/SEO.js';
export type { SEOProps } from './components/SEO.js';

export { OpenGraph } from './components/OpenGraph.js';
export type { OpenGraphProps } from './components/OpenGraph.js';

export { TwitterCard } from './components/TwitterCard.js';
export type { TwitterCardProps } from './components/TwitterCard.js';

export { Canonical } from './components/Canonical.js';
export type { CanonicalProps } from './components/Canonical.js';

export { Robots } from './components/Robots.js';
export type { RobotsProps } from './components/Robots.js';

export { Hreflang } from './components/Hreflang.js';
export type { HreflangProps } from './components/Hreflang.js';

export { Breadcrumb } from './components/Breadcrumb.js';
export type { BreadcrumbProps, BreadcrumbItem } from './components/Breadcrumb.js';

// Head tag utilities
export { renderMetaTags, renderLinkTags } from './head-tags.js';
