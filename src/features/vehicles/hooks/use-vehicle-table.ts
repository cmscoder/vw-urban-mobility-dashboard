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
  type Table,
} from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';

import {
  DEFAULT_PAGE_SIZE,
  aggregatedColumns,
  VEHICLE_TABLE_SEARCH_DEBOUNCE_MS,
  DEFAULT_AGGREGATED_TABLE_SORTING,
} from '@/features/vehicles/constants';
import {
  columnFiltersToVehicleFilters,
  countryOptionsFromAggregated,
  yearOptionsFromAggregated,
} from '@/features/vehicles/utils';
import type {
  AggregatedRecord,
  PaginationInfo,
  VehicleFilters,
} from '@/features/vehicles/types';

/**
 * Headless table hook that wires TanStack Table with column filters,
 * global search (debounced), sorting (year desc by default), and pagination.
 * Returns the table instance plus derived helpers consumed by VehicleTable.
 *
 * @param data - Aggregated records to display.
 */
export function useVehicleTable(data: AggregatedRecord[]) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(
    DEFAULT_AGGREGATED_TABLE_SORTING
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(
    searchQuery,
    VEHICLE_TABLE_SEARCH_DEBOUNCE_MS
  );
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
    () => columnFiltersToVehicleFilters(columnFilters),
    [columnFilters]
  );

  const countryOptions = useMemo(
    () => countryOptionsFromAggregated(data),
    [data]
  );

  const yearOptions = useMemo(() => yearOptionsFromAggregated(data), [data]);

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

  const paginationInfo = useMemo(
    () => buildPaginationInfo(table, pagination, filteredTotal),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `pagination` identity changes often; pageIndex/pageSize are the meaningful deps.
    [table, pagination.pageIndex, pagination.pageSize, filteredTotal]
  );

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
    pagination: paginationInfo,
  };
}

function buildPaginationInfo(
  table: Table<AggregatedRecord>,
  pagination: PaginationState,
  filteredTotal: number
): PaginationInfo {
  const { pageIndex, pageSize } = pagination;
  const pageCount = Math.max(1, Math.ceil(filteredTotal / pageSize));

  return {
    pageIndex,
    pageSize,
    pageCount,
    filteredTotal,
    canPreviousPage: pageIndex > 0,
    canNextPage: pageIndex < pageCount - 1,
    goToFirstPage: () => table.setPageIndex(0),
    goToPreviousPage: () => table.previousPage(),
    goToNextPage: () => table.nextPage(),
    goToLastPage: () => table.setPageIndex(pageCount - 1),
    setPageSize: (size: number) => table.setPageSize(size),
  };
}
