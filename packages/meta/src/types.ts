// ============================================================================
// @power-seo/meta — Framework Type Definitions
// ============================================================================
// Local types that mirror framework shapes (no framework dependencies).

// --- Next.js App Router Metadata ---

export interface NextOGImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
}

export interface NextMetadata {
  title?: string | { default?: string; template?: string; absolute?: string };
  description?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    notranslate?: boolean;
    unavailableAfter?: string;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
      noimageindex?: boolean;
      nosnippet?: boolean;
      'max-video-preview'?: number | string;
      'max-image-preview'?: 'none' | 'standard' | 'large';
      'max-snippet'?: number;
    };
  };
  openGraph?: {
    type?: string;
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    images?: NextOGImage[];
    article?: {
      publishedTime?: string;
      modifiedTime?: string;
      authors?: string[];
      section?: string;
      tags?: string[];
    };
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    images?: string[];
  };
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  other?: Record<string, string>;
}

// --- Remix v2 MetaDescriptor ---

export type RemixMetaDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { httpEquiv: string; content: string }
  | {
      tagName: 'link';
      rel: string;
      href: string;
      hrefLang?: string;
      type?: string;
      sizes?: string;
      media?: string;
    };

// --- Generic SSR Head Tag ---

export interface HeadTag {
  tag: 'meta' | 'link' | 'title';
  attributes: Record<string, string>;
  content?: string;
}
