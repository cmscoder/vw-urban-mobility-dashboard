import { useState, useMemo, useCallback } from 'react';
import { EMPTY_FILTERS } from '@/constants';
import type { VehicleFilters, VehicleRecord } from '@/types';

export interface FilterOption {
  value: string;
  label: string;
}

export function useVehicleFilters(vehicles: VehicleRecord[]) {
  const [filters, setFilters] = useState<VehicleFilters>(EMPTY_FILTERS);

  const filteredVehicles = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(
      ([, value]) => value !== 'all'
    );

    if (activeFilters.length === 0) return vehicles;

    return vehicles.filter((v) =>
      activeFilters.every(
        ([key, value]) => v[key as keyof VehicleFilters] === value
      )
    );
  }, [vehicles, filters]);

  const countryOptions: FilterOption[] = useMemo(() => {
    const unique = new Map<string, string>();
    for (const v of vehicles) {
      if (!unique.has(v.country)) unique.set(v.country, v.countryName);
    }
    return Array.from(unique.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [vehicles]);

  const yearOptions: FilterOption[] = useMemo(() => {
    const years = [...new Set(vehicles.map((v) => v.year))].sort().reverse();
    return years.map((y) => ({ value: y, label: y }));
  }, [vehicles]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v !== 'all').length,
    [filters]
  );

  const hasActiveFilters = activeFilterCount > 0;

  const updateFilter = useCallback(
    (field: keyof VehicleFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  return {
    filters,
    filteredVehicles,
    countryOptions,
    yearOptions,
    hasActiveFilters,
    activeFilterCount,
    updateFilter,
    clearFilters,
  };
}
