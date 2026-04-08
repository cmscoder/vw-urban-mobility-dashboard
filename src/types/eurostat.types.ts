export interface EurostatCategory {
  index: Record<string, number>;
  label: Record<string, string>;
}

export interface EurostatDimension {
  label: string;
  category: EurostatCategory;
}

export interface EurostatResponse {
  version: string;
  class: string;
  label: string;
  source: string;
  updated: string;
  value: Record<string, number>;
  id: string[];
  size: number[];
  dimension: Record<string, EurostatDimension>;
}

export interface EurostatQueryParams {
  format?: string;
  lang?: string;
  unit?: string;
  geo?: string;
  geoLevel?: 'country' | 'aggregate' | 'nuts1' | 'nuts2' | 'nuts3' | 'city';
  sinceTimePeriod?: string;
}
