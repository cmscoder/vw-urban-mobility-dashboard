import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableHeaderFilters } from '@/components/vehicles/TableHeaderFilters';
import { TableSkeleton } from '@/components/vehicles/TableSkeleton';
import { CardSkeleton } from '@/components/vehicles/CardSkeleton';
import { VehicleTableRow } from '@/components/vehicles/VehicleTableRow';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { MobileFilters } from '@/components/vehicles/MobileFilters';
import type { Row } from '@tanstack/react-table';
import type { VehicleFilters, VehicleRecord, FilterOption } from '@/types';

interface VehicleTableProps {
  rows: Row<VehicleRecord>[];
  filters: VehicleFilters;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onFilterChange: (field: keyof VehicleFilters, value: string) => void;
  onFiltersClear: () => void;
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
  countryOptions,
  yearOptions,
  hasActiveFilters,
  activeFilterCount,
  onFilterChange,
  onFiltersClear,
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
      {/* Mobile: filters + cards */}
      <div className="md:hidden" data-testid="mobile-view">
        <MobileFilters
          filters={filters}
          countryOptions={countryOptions}
          yearOptions={yearOptions}
          activeFilterCount={activeFilterCount}
          onFilterChange={onFilterChange}
          onFiltersClear={onFiltersClear}
        />
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
      </div>

      {/* Desktop: traditional table */}
      <div
        className="hidden rounded-md border md:block"
        data-testid="desktop-view"
      >
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
                <TableCell colSpan={columnsCount} className="h-24 text-center">
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
    </>
  );
}
