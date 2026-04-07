import { useQuery } from '@tanstack/react-query';
import { fetchVehicleData } from '@/api';
import type { EurostatQueryParams } from '@/types';

const VEHICLES_KEY = 'vehicles';

export function useVehicles(params?: EurostatQueryParams) {
  return useQuery({
    queryKey: [VEHICLES_KEY, params],
    queryFn: () => fetchVehicleData(params),
    staleTime: 5 * 60 * 1000,
  });
}
