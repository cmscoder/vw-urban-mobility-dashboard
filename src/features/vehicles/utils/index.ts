export {
  formatCount,
  formatMotorTypeCountLabel,
  viewDetailsAriaLabel,
} from './format';
export {
  buildFormFromRecord,
  isFormValid,
  isFormYearValid,
  getMinVehicleFormYear,
  getMaxVehicleFormYear,
  stablePartialVehicleFormKey,
  stableVehicleRecordKey,
} from './vehicle-form';
export { aggregateByCountryYear } from './aggregate-vehicles';
export { buildChartData } from './merge-by-motor-energy';
export type { ChartDataEntry } from './merge-by-motor-energy';
export {
  columnFiltersToVehicleFilters,
  countryOptionsFromAggregated,
  yearOptionsFromAggregated,
  cycleAggregatedColumnSort,
  nextAggregatedColumnSortingState,
} from './vehicle-table';
