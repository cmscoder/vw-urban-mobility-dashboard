import type { EurostatQueryParams } from '@/features/vehicles/types';

/** Root segment for TanStack Query keys used by `useVehicles`. */
export const VEHICLES_QUERY_ROOT = 'vehicles' as const;

/** How long Eurostat vehicle list stays fresh before background refetch is allowed. */
export const VEHICLES_QUERY_STALE_MS = 5 * 60 * 1000;

/**
 * Canonical string for `EurostatQueryParams` so the query key is stable when callers
 * pass a new object literal each render with the same field values.
 */
export function stableEurostatParamsKey(params?: EurostatQueryParams): string {
  if (params == null) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined) as [
    string,
    string | undefined,
  ][];
  if (entries.length === 0) return '';
  entries.sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(Object.fromEntries(entries));
}

/** TanStack Query key for the Eurostat vehicle list (see `useVehicles`). */
export function vehiclesQueryKey(params?: EurostatQueryParams) {
  return [VEHICLES_QUERY_ROOT, stableEurostatParamsKey(params)] as const;
}
