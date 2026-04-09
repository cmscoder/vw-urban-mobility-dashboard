import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';
import { EMPTY_FILTERS, vehicleColumns } from '@/constants';
import type { VehicleFilters, VehicleRecord, FilterOption } from '@/types';

const SEARCH_DEBOUNCE_MS = 300;

function columnFiltersToFilters(
  colFilters: ColumnFiltersState
): VehicleFilters {
  const result = { ...EMPTY_FILTERS };
  for (const { id, value } of colFilters) {
    if (id in result) {
      result[id as keyof VehicleFilters] = value as string;
    }
  }
  return result;
}

export function useVehicleTable(data: VehicleRecord[]) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  const table = useReactTable({
    data,
    columns: vehicleColumns,
    state: { columnFilters, globalFilter: debouncedSearch },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filters = useMemo(
    () => columnFiltersToFilters(columnFilters),
    [columnFilters]
  );

  const countryOptions: FilterOption[] = useMemo(() => {
    const unique = new Map<string, string>();
    for (const v of data) {
      if (!unique.has(v.country)) unique.set(v.country, v.countryName);
    }
    return Array.from(unique.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data]);

  const yearOptions: FilterOption[] = useMemo(() => {
    const years = [...new Set(data.map((v) => v.year))].sort().reverse();
    return years.map((y) => ({ value: y, label: y }));
  }, [data]);

  const activeFilterCount = columnFilters.length;
  const hasActiveFilters = activeFilterCount > 0;

  const updateFilter = useCallback(
    (field: keyof VehicleFilters, value: string) => {
      setColumnFilters((prev) => {
        const next = prev.filter((f) => f.id !== field);
        if (value !== 'all') {
          next.push({ id: field, value });
        }
        return next;
      });
    },
    []
  );

  const clearFilters = useCallback(() => {
    setColumnFilters([]);
  }, []);

  return {
    table,
    filters,
    searchQuery,
    setSearchQuery,
    countryOptions,
    yearOptions,
    hasActiveFilters,
    activeFilterCount,
    updateFilter,
    clearFilters,
  };
}
