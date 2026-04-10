import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVehicleData } from '@/features/vehicles/api';
import { useVehicleStore } from '@/features/vehicles/stores';
import type { EurostatQueryParams } from '@/features/vehicles/types';

const VEHICLES_KEY = 'vehicles';

export function useVehicles(params?: EurostatQueryParams) {
  const seed = useVehicleStore((state) => state.seed);

  const query = useQuery({
    queryKey: [VEHICLES_KEY, params],
    queryFn: () => fetchVehicleData(params),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      seed(query.data);
    }
  }, [query.data, seed]);

  return query;
}
