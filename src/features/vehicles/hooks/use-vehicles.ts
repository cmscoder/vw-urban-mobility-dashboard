import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchVehicleData } from '@/features/vehicles/api';
import {
  VEHICLES_QUERY_STALE_MS,
  vehiclesQueryKey,
} from '@/features/vehicles/constants';
import { useVehicleStore } from '@/features/vehicles/stores';
import type { EurostatQueryParams } from '@/features/vehicles/types';

/**
 * Fetches vehicle data from Eurostat via TanStack Query and seeds the
 * Zustand store on first load. Returns the standard query result object
 * (isLoading, isError, etc.) for UI state handling.
 *
 * `params` is merged into the request by `fetchVehicleData`; for a stable
 * TanStack cache key, pass memoized params or rely on the built-in sorted
 * serialization in {@link vehiclesQueryKey}.
 */
export function useVehicles(params?: EurostatQueryParams) {
  const seed = useVehicleStore((state) => state.seed);
  const isSeeded = useVehicleStore((state) => state.isSeeded);

  const query = useQuery({
    queryKey: vehiclesQueryKey(params),
    queryFn: () => fetchVehicleData(params),
    staleTime: VEHICLES_QUERY_STALE_MS,
  });

  useEffect(() => {
    if (!query.isSuccess || isSeeded) return;
    seed(query.data);
  }, [query.isSuccess, query.data, seed, isSeeded]);

  return query;
}
