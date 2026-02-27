// @power-seo/integrations — Semrush Internal Types
// ----------------------------------------------------------------------------

export interface SemrushRawDomainResponse {
  Or: number;
  Ot: number;
  Oc: number;
  Ad: number;
  At: number;
  Ac: number;
  Bk: number;
  As: number;
}

export interface SemrushRawKeywordResponse {
  Ph: string;
  Po: number;
  Pp: number;
  Nq: number;
  Cp: number;
  Ur: string;
  Tr: number;
  Tc: number;
  Co: number;
  Td: number;
}

export interface SemrushRawBacklinkResponse {
  source_url: string;
  target_url: string;
  anchor: string;
  nofollow: boolean;
  first_seen: string;
  last_seen: string;
  source_ascore: number;
}

export interface SemrushRawKeywordDifficultyResponse {
  Ph: string;
  Kd: number;
  Nq: number;
  Cp: number;
  Co: number;
  Nr: number;
}

export interface SemrushRawRelatedKeywordResponse {
  Ph: string;
  Nq: number;
  Cp: number;
  Co: number;
  Nr: number;
  Rr: string;
}

export interface SemrushApiResponse<T> {
  data: T[];
  total: number;
}
