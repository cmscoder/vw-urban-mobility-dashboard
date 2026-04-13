import { X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { TableHeaderFilters } from '@/features/vehicles/components/TableHeaderFilters';
import { TableSkeleton } from '@/features/vehicles/components/TableSkeleton';
import { CardSkeleton } from '@/features/vehicles/components/CardSkeleton';
import { VehicleTableRow } from '@/features/vehicles/components/VehicleTableRow';
import { VehicleCard } from '@/features/vehicles/components/VehicleCard';
import { MobileFilters } from '@/features/vehicles/components/MobileFilters';
import { TablePagination } from '@/features/vehicles/components/TablePagination';
import type { Row, Table as TanstackTable } from '@tanstack/react-table';
import type {
  VehicleFilters,
  AggregatedRecord,
  FilterOption,
  VehicleFilterChangeHandler,
  PaginationInfo,
} from '@/features/vehicles/types';

const EMPTY_RECORDS_MESSAGE = 'No records found.';

interface VehicleTableProps {
  /** TanStack table instance for header sort controls (dashboard). */
  table?: TanstackTable<AggregatedRecord>;
  rows: Row<AggregatedRecord>[];
  filters: VehicleFilters;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onFilterChange: VehicleFilterChangeHandler;
  onFiltersClear: () => void;
  pagination: PaginationInfo;
  isLoading: boolean;
  columnsCount?: number;
  skeletonRowCount?: number;
  skeletonCardCount?: number;
  onViewDetails: (record: AggregatedRecord) => void;
}

interface VehicleTableMobileViewProps {
  table?: TanstackTable<AggregatedRecord>;
  rows: Row<AggregatedRecord>[];
  filters: VehicleFilters;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  activeFilterCount: number;
  onFilterChange: VehicleFilterChangeHandler;
  onFiltersClear: () => void;
  pagination: PaginationInfo;
  isLoading: boolean;
  skeletonCardCount: number;
  onViewDetails: (record: AggregatedRecord) => void;
  showPagination: boolean;
}

function VehicleTableMobileView({
  table,
  rows,
  filters,
  searchQuery,
  onSearchChange,
  countryOptions,
  yearOptions,
  activeFilterCount,
  onFilterChange,
  onFiltersClear,
  pagination,
  isLoading,
  skeletonCardCount,
  onViewDetails,
  showPagination,
}: VehicleTableMobileViewProps) {
  return (
    <div className="md:hidden" data-testid="mobile-view">
      <div className="flex items-center gap-2">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          className="flex-1"
        />
        <MobileFilters
          table={table}
          filters={filters}
          countryOptions={countryOptions}
          yearOptions={yearOptions}
          activeFilterCount={activeFilterCount}
          onFilterChange={onFilterChange}
          onFiltersClear={onFiltersClear}
        />
      </div>
      <div className="mt-3 space-y-3">
        {isLoading ? (
          <CardSkeleton count={skeletonCardCount} />
        ) : rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {EMPTY_RECORDS_MESSAGE}
          </p>
        ) : (
          rows.map((row) => (
            <VehicleCard
              key={row.id}
              record={row.original}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </div>
      {showPagination && <TablePagination pagination={pagination} />}
    </div>
  );
}

interface VehicleTableDesktopViewProps {
  table?: TanstackTable<AggregatedRecord>;
  rows: Row<AggregatedRecord>[];
  filters: VehicleFilters;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  hasActiveFilters: boolean;
  onFilterChange: VehicleFilterChangeHandler;
  onFiltersClear: () => void;
  pagination: PaginationInfo;
  isLoading: boolean;
  columnsCount: number;
  skeletonRowCount: number;
  onViewDetails: (record: AggregatedRecord) => void;
  showPagination: boolean;
}

function VehicleTableDesktopView({
  table,
  rows,
  filters,
  searchQuery,
  onSearchChange,
  countryOptions,
  yearOptions,
  hasActiveFilters,
  onFilterChange,
  onFiltersClear,
  pagination,
  isLoading,
  columnsCount,
  skeletonRowCount,
  onViewDetails,
  showPagination,
}: VehicleTableDesktopViewProps) {
  return (
    <div className="hidden md:block" data-testid="desktop-view">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          className="min-w-[12rem] max-w-sm flex-1"
        />
        {hasActiveFilters ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={onFiltersClear}
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4" aria-hidden />
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableHeaderFilters
              table={table}
              filters={filters}
              countryOptions={countryOptions}
              yearOptions={yearOptions}
              onFilterChange={onFilterChange}
            />
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton
                count={skeletonRowCount}
                columnsCount={columnsCount}
              />
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnsCount} className="h-24 text-center">
                  {EMPTY_RECORDS_MESSAGE}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <VehicleTableRow
                  key={row.id}
                  record={row.original}
                  onViewDetails={onViewDetails}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <TablePagination pagination={pagination} />}
    </div>
  );
}

export function VehicleTable({
  table,
  rows,
  filters,
  searchQuery,
  onSearchChange,
  countryOptions,
  yearOptions,
  hasActiveFilters,
  activeFilterCount,
  onFilterChange,
  onFiltersClear,
  pagination,
  isLoading,
  columnsCount = 5,
  skeletonRowCount = 8,
  skeletonCardCount = 6,
  onViewDetails,
}: VehicleTableProps) {
  const showPagination = !isLoading && rows.length > 0;

  return (
    <>
      <VehicleTableMobileView
        table={table}
        rows={rows}
        filters={filters}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        countryOptions={countryOptions}
        yearOptions={yearOptions}
        activeFilterCount={activeFilterCount}
        onFilterChange={onFilterChange}
        onFiltersClear={onFiltersClear}
        pagination={pagination}
        isLoading={isLoading}
        skeletonCardCount={skeletonCardCount}
        onViewDetails={onViewDetails}
        showPagination={showPagination}
      />
      <VehicleTableDesktopView
        table={table}
        rows={rows}
        filters={filters}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        countryOptions={countryOptions}
        yearOptions={yearOptions}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={onFilterChange}
        onFiltersClear={onFiltersClear}
        pagination={pagination}
        isLoading={isLoading}
        columnsCount={columnsCount}
        skeletonRowCount={skeletonRowCount}
        onViewDetails={onViewDetails}
        showPagination={showPagination}
      />
    </>
  );
}
