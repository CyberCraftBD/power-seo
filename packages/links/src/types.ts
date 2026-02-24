// @power-seo/links — Types
// ----------------------------------------------------------------------------

export interface PageData {
  url: string;
  title?: string;
  content?: string;
  links: string[];
}

export interface LinkNode {
  url: string;
  inbound: string[];
  outbound: string[];
  inboundCount: number;
  outboundCount: number;
}

export interface LinkGraph {
  nodes: Map<string, LinkNode>;
  totalPages: number;
  totalLinks: number;
}

export interface OrphanPage {
  url: string;
  title?: string;
  outboundCount: number;
}

export interface LinkSuggestion {
  from: string;
  to: string;
  anchorText: string;
  relevanceScore: number;
}

export interface LinkEquityScore {
  url: string;
  score: number;
  inboundCount: number;
}

export interface LinkSuggestionOptions {
  maxSuggestions?: number;
  minRelevance?: number;
}

export interface LinkEquityOptions {
  damping?: number;
  iterations?: number;
}
