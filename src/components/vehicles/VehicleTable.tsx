import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { TableHeaderFilters } from '@/components/vehicles/TableHeaderFilters';
import { TableSkeleton } from '@/components/vehicles/TableSkeleton';
import { CardSkeleton } from '@/components/vehicles/CardSkeleton';
import { VehicleTableRow } from '@/components/vehicles/VehicleTableRow';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { MobileFilters } from '@/components/vehicles/MobileFilters';
import {
  TablePagination,
  type PaginationInfo,
} from '@/components/vehicles/TablePagination';
import type { Row } from '@tanstack/react-table';
import type { VehicleFilters, VehicleRecord, FilterOption } from '@/types';

interface VehicleTableProps {
  rows: Row<VehicleRecord>[];
  filters: VehicleFilters;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onFilterChange: (field: keyof VehicleFilters, value: string) => void;
  onFiltersClear: () => void;
  pagination: PaginationInfo;
  isLoading: boolean;
  columnsCount?: number;
  skeletonRowCount?: number;
  skeletonCardCount?: number;
  onEdit: (record: VehicleRecord) => void;
  onDelete: (record: VehicleRecord) => void;
}

export function VehicleTable({
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
  columnsCount = 6,
  skeletonRowCount = 8,
  skeletonCardCount = 6,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  const emptyState = (
    <p className="py-12 text-center text-sm text-muted-foreground">
      No records found.
    </p>
  );

  return (
    <>
      {/* Mobile: search + filters + cards */}
      <div className="md:hidden" data-testid="mobile-view">
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            className="flex-1"
          />
          <MobileFilters
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
            emptyState
          ) : (
            rows.map((row) => (
              <VehicleCard
                key={row.id}
                record={row.original}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
        {!isLoading && rows.length > 0 && (
          <TablePagination pagination={pagination} />
        )}
      </div>

      {/* Desktop: search + table */}
      <div className="hidden md:block" data-testid="desktop-view">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          className="mb-4 max-w-sm"
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableHeaderFilters
                filters={filters}
                countryOptions={countryOptions}
                yearOptions={yearOptions}
                hasActiveFilters={hasActiveFilters}
                onFilterChange={onFilterChange}
                onFiltersClear={onFiltersClear}
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
                  <TableCell
                    colSpan={columnsCount}
                    className="h-24 text-center"
                  >
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <VehicleTableRow
                    key={row.id}
                    record={row.original}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading && rows.length > 0 && (
          <TablePagination pagination={pagination} />
        )}
      </div>
    </>
  );
}
