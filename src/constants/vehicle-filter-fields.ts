import { MOTOR_ENERGY_OPTIONS } from './motor-energy';
import { SOURCE_OPTIONS } from './source';
import type { FilterOption, VehicleFilters } from '@/types';

export interface VehicleFilterFieldConfig {
  field: keyof VehicleFilters;
  label: string;
  ariaLabel: string;
  allLabel: string;
  options: readonly FilterOption[];
}

type FilterVariant = 'desktop' | 'mobile';

export function buildVehicleFilterFields(
  countryOptions: readonly FilterOption[],
  yearOptions: readonly FilterOption[],
  variant: FilterVariant
): VehicleFilterFieldConfig[] {
  const labels =
    variant === 'mobile'
      ? {
          country: 'All Countries',
          year: 'All Years',
          motorEnergy: 'All Energy Types',
          source: 'All Sources',
        }
      : {
          country: 'Country',
          year: 'Year',
          motorEnergy: 'Motor Energy',
          source: 'Source',
        };
  const motorEnergyAriaLabel =
    variant === 'mobile'
      ? 'Filter by motor energy'
      : 'Filter by motor energy type';

  return [
    {
      field: 'country',
      label: 'Country',
      ariaLabel: 'Filter by country',
      allLabel: labels.country,
      options: countryOptions,
    },
    {
      field: 'year',
      label: 'Year',
      ariaLabel: 'Filter by year',
      allLabel: labels.year,
      options: yearOptions,
    },
    {
      field: 'motorEnergy',
      label: 'Motor Energy',
      ariaLabel: motorEnergyAriaLabel,
      allLabel: labels.motorEnergy,
      options: MOTOR_ENERGY_OPTIONS,
    },
    {
      field: 'source',
      label: 'Source',
      ariaLabel: 'Filter by source',
      allLabel: labels.source,
      options: SOURCE_OPTIONS,
    },
  ];
}
