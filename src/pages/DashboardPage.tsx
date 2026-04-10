import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { VehicleTable } from '@/components/vehicles/VehicleTable';
import { VehicleFormDialog } from '@/components/vehicles/VehicleFormDialog';
import { Button } from '@/components/ui/button';
import { useVehicles, useVehicleTable } from '@/hooks';
import { useVehicleStore } from '@/stores';
import { aggregateByCountryYear } from '@/utils';
import type { VehicleFormData, AggregatedRecord } from '@/types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { isLoading, isError, error } = useVehicles();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const addRecord = useVehicleStore((state) => state.addRecord);

  const aggregated = useMemo(
    () => aggregateByCountryYear(vehicles),
    [vehicles]
  );

  const {
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
    pagination,
  } = useVehicleTable(aggregated);

  const rows = table.getRowModel().rows;
  const visibleColumnsCount = table.getVisibleLeafColumns().length || 5;

  const [formOpen, setFormOpen] = useState(false);

  function handleCreate(data: VehicleFormData) {
    addRecord(data);
  }

  function handleViewDetails(record: AggregatedRecord) {
    navigate(`/vehicles/${record.country}/${record.year}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Record
        </Button>
      </Header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 sm:py-6">
        {isError && (
          <div
            role="alert"
            className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error?.message ?? 'Failed to load data from Eurostat.'}
          </div>
        )}

        <p className="text-sm text-muted-foreground" aria-live="polite">
          {isLoading
            ? 'Loading...'
            : `${pagination.filteredTotal} of ${aggregated.length} records`}
        </p>

        <VehicleTable
          rows={rows}
          filters={filters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          countryOptions={countryOptions}
          yearOptions={yearOptions}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onFilterChange={updateFilter}
          onFiltersClear={clearFilters}
          pagination={pagination}
          isLoading={isLoading}
          columnsCount={visibleColumnsCount}
          skeletonCardCount={6}
          onViewDetails={handleViewDetails}
        />
      </main>

      <VehicleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />
    </div>
  );
}
