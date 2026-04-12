import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVehicleData } from '@/features/vehicles/api';
import { useVehicleStore } from '@/features/vehicles/stores';
import type { EurostatQueryParams } from '@/features/vehicles/types';

const VEHICLES_KEY = 'vehicles';

/**
 * Fetches vehicle data from Eurostat via TanStack Query and seeds the
 * Zustand store on first load. Returns the standard query result object
 * (isLoading, isError, etc.) for UI state handling.
 */
export function useVehicles(params?: EurostatQueryParams) {
  const seed = useVehicleStore((state) => state.seed);
  const isSeeded = useVehicleStore((state) => state.isSeeded);

  const query = useQuery({
    queryKey: [VEHICLES_KEY, params],
    queryFn: () => fetchVehicleData(params),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data && !isSeeded) {
      seed(query.data);
    }
  }, [query.data, seed, isSeeded]);

  return query;
}
