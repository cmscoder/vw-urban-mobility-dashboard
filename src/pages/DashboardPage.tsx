import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { VehicleTable } from '@/components/vehicles/VehicleTable';
import { VehicleFormDialog } from '@/components/vehicles/VehicleFormDialog';
import { Button } from '@/components/ui/button';
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
import { useVehicles, useVehicleTable } from '@/hooks';
import { useVehicleStore } from '@/stores';
import type { VehicleFormData, VehicleRecord } from '@/types';

export function DashboardPage() {
  const { isLoading, isError, error } = useVehicles();
  const vehicles = useVehicleStore((state) => state.vehicles);
  const addRecord = useVehicleStore((state) => state.addRecord);
  const updateRecord = useVehicleStore((state) => state.updateRecord);
  const deleteRecord = useVehicleStore((state) => state.deleteRecord);

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
  } = useVehicleTable(vehicles);

  const rows = table.getRowModel().rows;
  const visibleColumnsCount = table.getVisibleLeafColumns().length || 6;

  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VehicleRecord | null>(
    null
  );
  const [deletingRecord, setDeletingRecord] = useState<VehicleRecord | null>(
    null
  );

  function handleCreate(data: VehicleFormData) {
    addRecord(data);
  }

  function handleEdit(data: VehicleFormData) {
    if (editingRecord) {
      updateRecord(editingRecord.id, data);
      setEditingRecord(null);
    }
  }

  function handleConfirmDelete() {
    if (deletingRecord) {
      deleteRecord(deletingRecord.id);
      setDeletingRecord(null);
    }
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
            : `${rows.length} of ${vehicles.length} records`}
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
          isLoading={isLoading}
          columnsCount={visibleColumnsCount}
          skeletonCardCount={6}
          onEdit={(record) => setEditingRecord(record)}
          onDelete={(record) => setDeletingRecord(record)}
        />
      </main>

      <VehicleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleCreate}
      />

      <VehicleFormDialog
        open={!!editingRecord}
        onOpenChange={(open) => !open && setEditingRecord(null)}
        onSubmit={handleEdit}
        record={editingRecord}
      />

      <AlertDialog
        open={!!deletingRecord}
        onOpenChange={(open) => !open && setDeletingRecord(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the record for{' '}
              <strong>{deletingRecord?.countryName}</strong> —{' '}
              {deletingRecord?.motorEnergyName} ({deletingRecord?.year}). This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
