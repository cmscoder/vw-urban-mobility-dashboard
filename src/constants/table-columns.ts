import { createColumnHelper } from '@tanstack/react-table';
import type { VehicleRecord } from '@/types';

const columnHelper = createColumnHelper<VehicleRecord>();

export const vehicleColumns = [
  columnHelper.accessor('country', { filterFn: 'equalsString' }),
  columnHelper.accessor('countryName', { filterFn: 'equalsString' }),
  columnHelper.accessor('year', { filterFn: 'equalsString' }),
  columnHelper.accessor('motorEnergy', { filterFn: 'equalsString' }),
  columnHelper.accessor('motorEnergyName', { filterFn: 'equalsString' }),
  columnHelper.accessor('count', {}),
  columnHelper.accessor('source', { filterFn: 'equalsString' }),
];
