/**
 * Types for the Eurostat JSON-stat 2.0 subset consumed by `transformResponse` in
 * `eurostat.service.ts`. The live API returns a `dataset` object with `dimension`,
 * `id`, `size`, and `value` (flat string keys → numeric counts).
 *
 * @see https://json-stat.org/format/
 */

/** Dimension category: code → axis position, optional human-readable labels per code. */
export interface EurostatCategory {
  index: Record<string, number>;
  /** Omitted or partial in some responses; fall back to codes in the transformer. */
  label?: Record<string, string>;
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
  /** Flat cell index (string) → observation count. */
  value: Record<string, number>;
  /** Dimension id list, same order as `size` and strides in the decoder. */
  id: string[];
  size: number[];
  dimension: Record<string, EurostatDimension>;
}

/**
 * Optional query fields merged into the Eurostat SDMX JSON request
 * (see `DEFAULT_PARAMS` in `eurostat.service.ts`).
 */
export interface EurostatQueryParams {
  format?: string;
  lang?: string;
  unit?: string;
  geo?: string;
  geoLevel?: 'country' | 'aggregate' | 'nuts1' | 'nuts2' | 'nuts3' | 'city';
  sinceTimePeriod?: string;
}
