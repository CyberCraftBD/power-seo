// @power-seo/meta — Main Entry Point
// ----------------------------------------------------------------------------

// Types
export type { NextMetadata, NextOGImage, RemixMetaDescriptor, HeadTag } from './types.js';

// Next.js App Router
export { createMetadata } from './nextjs.js';

// Remix v2
export { createMetaDescriptors } from './remix.js';

// Generic SSR
export { createHeadTags, createHeadTagObjects } from './serialize.js';
