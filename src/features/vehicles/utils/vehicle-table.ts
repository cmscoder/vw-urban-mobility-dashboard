import type { ColumnFiltersState } from '@tanstack/react-table';

import { EMPTY_FILTERS } from '@/features/vehicles/constants';
import type {
  AggregatedRecord,
  FilterOption,
  VehicleFilters,
} from '@/features/vehicles/types';

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
