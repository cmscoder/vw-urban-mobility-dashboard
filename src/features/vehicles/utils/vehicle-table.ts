import type {
  ColumnFiltersState,
  SortingState,
  Table,
} from '@tanstack/react-table';

import { EMPTY_FILTERS } from '@/features/vehicles/constants';
import type {
  AggregatedRecord,
  FilterOption,
  VehicleFilters,
} from '@/features/vehicles/types';

/** Columns where the first sort click applies descending (newest / high-first). */
const DESC_FIRST_SORT_COLUMN_IDS = new Set<string>([
  'year',
  'totalCount',
  'recordCount',
]);

/**
 * Next single-column sort state after clicking a header sort control.
 * Matches mobile presets: each click replaces the full `sorting` array (no multi-sort via UI).
 */
export function nextAggregatedColumnSortingState(
  columnId: string,
  sorting: SortingState
): SortingState {
  const descFirst = DESC_FIRST_SORT_COLUMN_IDS.has(columnId);
  const entry = sorting.find((s) => s.id === columnId);
  const sorted = entry === undefined ? false : entry.desc ? 'desc' : 'asc';

  if (sorted === false) {
    return [{ id: columnId, desc: descFirst }];
  }

  if (sorted === 'desc') {
    if (descFirst) {
      return [{ id: columnId, desc: false }];
    }
    return [];
  }

  if (descFirst) {
    return [];
  }
  return [{ id: columnId, desc: true }];
}

/** Applies {@link nextAggregatedColumnSortingState} via `table.setSorting` (same mechanism as mobile). */
export function cycleAggregatedColumnSort(
  table: Table<AggregatedRecord>,
  columnId: string
): void {
  const column = table.getColumn(columnId);
  if (!column?.getCanSort()) return;
  table.setSorting(
    nextAggregatedColumnSortingState(columnId, table.getState().sorting)
  );
}

/** Maps TanStack column filter state to the app's `VehicleFilters` shape. */
export function columnFiltersToVehicleFilters(
  colFilters: ColumnFiltersState
): VehicleFilters {
  return colFilters.reduce<VehicleFilters>(
    (acc, { id, value }) => {
      if (id in acc && typeof value === 'string') {
        return { ...acc, [id]: value };
      }
      return acc;
    },
    { ...EMPTY_FILTERS }
  );
}

/** Distinct countries from aggregated rows, sorted by display name. Codes are uppercased. */
export function countryOptionsFromAggregated(
  data: AggregatedRecord[]
): FilterOption[] {
  return [
    ...new Map(
      data.map((v) => [v.country.toUpperCase(), v.countryName])
    ).entries(),
  ]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Distinct years from aggregated rows, newest first. */
export function yearOptionsFromAggregated(
  data: AggregatedRecord[]
): FilterOption[] {
  const years = [...new Set(data.map((v) => v.year))].sort().reverse();
  return years.map((y) => ({ value: y, label: y }));
}
