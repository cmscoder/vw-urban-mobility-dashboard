import type { SortingState } from '@tanstack/react-table';

/** Debounce for search string before it is applied as TanStack `globalFilter`. */
export const VEHICLE_TABLE_SEARCH_DEBOUNCE_MS = 300;

/** Default sort for the aggregated dashboard table (newest year first, then country). */
export const DEFAULT_AGGREGATED_TABLE_SORTING: SortingState = [
  { id: 'year', desc: true },
  { id: 'countryName', desc: false },
];

function sortingStateEqual(a: SortingState, b: SortingState): boolean {
  if (a.length !== b.length) return false;
  return a.every((s, i) => s.id === b[i]?.id && s.desc === b[i]?.desc);
}

/** Preset for mobile "Sort by" and for aligning UI with TanStack `sorting` state. */
export interface AggregatedTableSortPreset {
  value: string;
  label: string;
  sorting: SortingState;
}

/**
 * Ordered list shown in the mobile drawer. First entry matches {@link DEFAULT_AGGREGATED_TABLE_SORTING}.
 * Use {@link matchAggregatedTableSortPresetValue} to map live table state to a select value.
 */
export const AGGREGATED_TABLE_SORT_PRESETS: AggregatedTableSortPreset[] = [
  {
    value: 'default',
    label: 'Year (newest), then country (A–Z)',
    sorting: DEFAULT_AGGREGATED_TABLE_SORTING,
  },
  {
    value: 'year-desc',
    label: 'Year (newest first)',
    sorting: [{ id: 'year', desc: true }],
  },
  {
    value: 'year-asc',
    label: 'Year (oldest first)',
    sorting: [{ id: 'year', desc: false }],
  },
  {
    value: 'country-asc',
    label: 'Country (A–Z)',
    sorting: [{ id: 'countryName', desc: false }],
  },
  {
    value: 'country-desc',
    label: 'Country (Z–A)',
    sorting: [{ id: 'countryName', desc: true }],
  },
  {
    value: 'total-desc',
    label: 'Total count (high to low)',
    sorting: [{ id: 'totalCount', desc: true }],
  },
  {
    value: 'total-asc',
    label: 'Total count (low to high)',
    sorting: [{ id: 'totalCount', desc: false }],
  },
  {
    value: 'types-desc',
    label: 'Motor types (most first)',
    sorting: [{ id: 'recordCount', desc: true }],
  },
  {
    value: 'types-asc',
    label: 'Motor types (fewest first)',
    sorting: [{ id: 'recordCount', desc: false }],
  },
];

/** Maps current TanStack sorting to a preset `value`, or the default preset if no exact match. */
export function matchAggregatedTableSortPresetValue(
  sorting: SortingState
): string {
  const match = AGGREGATED_TABLE_SORT_PRESETS.find((p) =>
    sortingStateEqual(sorting, p.sorting)
  );
  return match?.value ?? AGGREGATED_TABLE_SORT_PRESETS[0].value;
}
