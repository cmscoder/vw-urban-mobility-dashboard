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
import type { VehicleFilters, VehicleRecord } from '@/types';
import type { FilterOption } from '@/hooks';

interface VehicleTableProps {
  vehicles: VehicleRecord[];
  filters: VehicleFilters;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onFilterChange: (field: keyof VehicleFilters, value: string) => void;
  onFiltersClear: () => void;
  isLoading: boolean;
  onEdit: (record: VehicleRecord) => void;
  onDelete: (record: VehicleRecord) => void;
}

export function VehicleTable({
  vehicles,
  filters,
  countryOptions,
  yearOptions,
  hasActiveFilters,
  activeFilterCount,
  onFilterChange,
  onFiltersClear,
  isLoading,
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
            <CardSkeleton />
          ) : vehicles.length === 0 ? (
            emptyState
          ) : (
            vehicles.map((record) => (
              <VehicleCard
                key={record.id}
                record={record}
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
              <TableSkeleton />
            ) : vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((record) => (
                <VehicleTableRow
                  key={record.id}
                  record={record}
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
