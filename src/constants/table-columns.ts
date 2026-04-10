import { createColumnHelper } from '@tanstack/react-table';
import type { VehicleRecord, AggregatedRecord } from '@/types';

const vehicleHelper = createColumnHelper<VehicleRecord>();

export const vehicleColumns = [
  vehicleHelper.accessor('country', { filterFn: 'equalsString' }),
  vehicleHelper.accessor('countryName', { filterFn: 'equalsString' }),
  vehicleHelper.accessor('year', { filterFn: 'equalsString' }),
  vehicleHelper.accessor('motorEnergy', { filterFn: 'equalsString' }),
  vehicleHelper.accessor('motorEnergyName', { filterFn: 'equalsString' }),
  vehicleHelper.accessor('count', {}),
  vehicleHelper.accessor('source', { filterFn: 'equalsString' }),
];

const aggregatedHelper = createColumnHelper<AggregatedRecord>();

export const aggregatedColumns = [
  aggregatedHelper.accessor('country', { filterFn: 'equalsString' }),
  aggregatedHelper.accessor('countryName', { filterFn: 'equalsString' }),
  aggregatedHelper.accessor('year', { filterFn: 'equalsString' }),
  aggregatedHelper.accessor('totalCount', {}),
  aggregatedHelper.accessor('recordCount', {}),
];
