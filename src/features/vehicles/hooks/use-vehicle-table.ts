import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';
import {
  EMPTY_FILTERS,
  DEFAULT_PAGE_SIZE,
  aggregatedColumns,
} from '@/features/vehicles/constants';
import type {
  VehicleFilters,
  AggregatedRecord,
  FilterOption,
} from '@/features/vehicles/types';

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

const DEFAULT_SORTING: SortingState = [
  { id: 'year', desc: true },
  { id: 'countryName', desc: false },
];

/**
 * Headless table hook that wires TanStack Table with column filters,
 * global search (debounced), sorting (year desc by default), and pagination.
 * Returns the table instance plus derived helpers consumed by VehicleTable.
 *
 * @param data - Aggregated records to display.
 */
export function useVehicleTable(data: AggregatedRecord[]) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const table = useReactTable({
    data,
    columns: aggregatedColumns,
    state: {
      columnFilters,
      sorting,
      globalFilter: debouncedSearch,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
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

  const filteredTotal = table.getFilteredRowModel().rows.length;

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
    pagination: {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      pageCount: table.getPageCount(),
      filteredTotal,
      canPreviousPage: table.getCanPreviousPage(),
      canNextPage: table.getCanNextPage(),
      goToFirstPage: () => table.setPageIndex(0),
      goToPreviousPage: () => table.previousPage(),
      goToNextPage: () => table.nextPage(),
      goToLastPage: () => table.setPageIndex(table.getPageCount() - 1),
      setPageSize: (size: number) => table.setPageSize(size),
    },
  };
}
