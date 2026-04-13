import type { SortingState } from '@tanstack/react-table';

/** Debounce for search string before it is applied as TanStack `globalFilter`. */
export const VEHICLE_TABLE_SEARCH_DEBOUNCE_MS = 300;

/** Default sort for the aggregated dashboard table (newest year first, then country). */
export const DEFAULT_AGGREGATED_TABLE_SORTING: SortingState = [
  { id: 'year', desc: true },
  { id: 'countryName', desc: false },
];
