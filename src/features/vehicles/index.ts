// Components
export { VehicleTable } from './components/VehicleTable';
export { VehicleFormDialog } from './components/VehicleFormDialog';
export { SourceBadge } from './components/SourceBadge';
export { MotorEnergyBarChart } from './components/charts/MotorEnergyBarChart';
export { MotorEnergyPieChart } from './components/charts/MotorEnergyPieChart';

// Hooks
export { useVehicles } from './hooks/use-vehicles';
export { useVehicleTable } from './hooks/use-vehicle-table';
export { useVehicleForm } from './hooks/use-vehicle-form';

// Store
export { useVehicleStore } from './stores/vehicle.store';

// Utils
export { aggregateByCountryYear } from './utils/aggregate-vehicles';
export { buildChartData } from './utils/merge-by-motor-energy';
export { formatCount } from './utils/format';

// Types
export type {
  VehicleRecord,
  VehicleFormData,
  AggregatedRecord,
  VehicleFilters,
  FilterOption,
} from './types/vehicle.types';

export type { ChartDataEntry } from './utils/merge-by-motor-energy';
