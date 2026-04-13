import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  VehicleTable,
  VehicleFormDialog,
  useVehicles,
  useVehicleTable,
  useVehicleStore,
  aggregateByCountryYear,
} from '@/features/vehicles';
import type { VehicleFormData, AggregatedRecord } from '@/features/vehicles';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isLoading, isError, error } = useVehicles();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const addRecord = useVehicleStore((state) => state.addRecord);
  const resetData = useVehicleStore((state) => state.resetData);

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
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleCreate = useCallback(
    (data: VehicleFormData) => {
      try {
        addRecord(data);
        toast.success('Record added successfully.');
        const country = data.country.toUpperCase();
        navigate(`/vehicles/${country}/${encodeURIComponent(data.year)}`);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to add record.');
      }
    },
    [addRecord, navigate]
  );

  const handleConfirmReset = useCallback(() => {
    resetData();
    setResetDialogOpen(false);
    toast.success('Data reset to original Eurostat records.');
  }, [resetData]);

  const handleViewDetails = useCallback(
    (record: AggregatedRecord) => {
      navigate(
        `/vehicles/${record.country.toUpperCase()}/${encodeURIComponent(record.year)}`
      );
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => setResetDialogOpen(true)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Data
          </Button>
          <Button
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Button>
        </div>
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

        {isLoading ? (
          <LoadingSpinner message="Loading vehicle data…" />
        ) : (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {pagination.filteredTotal} of {aggregated.length} records
          </p>
        )}

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

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset data to Eurostat?</AlertDialogTitle>
            <AlertDialogDescription>
              This clears every local change (added, edited, or deleted records)
              and reloads the dataset from the Eurostat API. Your dashboard will
              match the original response again. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset}>
              Reset to original data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
