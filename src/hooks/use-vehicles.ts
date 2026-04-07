import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchVehicleData } from '@/api';
import { useVehicleStore } from '@/stores';
import type { EurostatQueryParams } from '@/types';

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
