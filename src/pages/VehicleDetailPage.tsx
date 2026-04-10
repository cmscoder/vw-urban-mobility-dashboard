import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
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
  MotorEnergyBarChart,
  MotorEnergyPieChart,
  VehicleFormDialog,
  SourceBadge,
  useVehicleStore,
  formatCount,
  buildChartData,
} from '@/features/vehicles';
import type { VehicleFormData, VehicleRecord } from '@/features/vehicles';

export function VehicleDetailPage() {
  const { country, year } = useParams<{ country: string; year: string }>();
  const navigate = useNavigate();

  const vehicles = useVehicleStore((state) => state.vehicles);
  const addRecord = useVehicleStore((state) => state.addRecord);
  const updateRecord = useVehicleStore((state) => state.updateRecord);
  const deleteRecord = useVehicleStore((state) => state.deleteRecord);

  const records = useMemo(
    () => vehicles.filter((v) => v.country === country && v.year === year),
    [vehicles, country, year]
  );

  const countryName = records[0]?.countryName ?? country;
  const totalCount = records.reduce((sum, r) => sum + (r.count ?? 0), 0);
  const chartData = useMemo(() => buildChartData(records), [records]);

  const [addFormOpen, setAddFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<VehicleRecord | null>(
    null
  );
  const [deletingRecord, setDeletingRecord] = useState<VehicleRecord | null>(
    null
  );

  const lockedFields = useMemo(
    () => ({
      country: country ?? '',
      countryName,
      year: year ?? '',
    }),
    [country, countryName, year]
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

      if (records.length <= 1) {
        navigate('/');
      }
    }
  }

  if (records.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6">
          <p className="text-muted-foreground">
            No records found for this country and year.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 sm:py-6">
        {/* Back link + title */}
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 gap-1.5">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {countryName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {year} — {records.length} motor{' '}
                {records.length === 1 ? 'type' : 'types'} —{' '}
                {formatCount(totalCount)} total vehicles
              </p>
            </div>
            <Button
              size="sm"
              className="mt-2 gap-1.5 self-start sm:mt-0"
              onClick={() => setAddFormOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Motor Type
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Country</p>
              <p className="text-lg font-semibold">{countryName}</p>
              <p className="text-xs text-muted-foreground">{country}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Year</p>
              <p className="text-lg font-semibold">{year}</p>
            </CardContent>
          </Card>
          <Card className="col-span-2 sm:col-span-1">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Vehicles</p>
              <p className="text-lg font-semibold">{formatCount(totalCount)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <MotorEnergyBarChart data={chartData} />
          <MotorEnergyPieChart data={chartData} />
        </div>

        {/* Desktop: breakdown table */}
        <div className="hidden rounded-md border md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Motor Energy</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-[100px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.motorEnergyName}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCount(record.count)}
                  </TableCell>
                  <TableCell>
                    <SourceBadge source={record.source} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingRecord(record)}
                        aria-label={`Edit ${record.motorEnergyName}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeletingRecord(record)}
                        aria-label={`Delete ${record.motorEnergyName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile: breakdown cards */}
        <div className="space-y-3 md:hidden">
          {records.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">
                      {record.motorEnergyName}
                    </p>
                    <SourceBadge source={record.source} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingRecord(record)}
                      aria-label={`Edit ${record.motorEnergyName}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeletingRecord(record)}
                      aria-label={`Delete ${record.motorEnergyName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <p className="text-xs text-muted-foreground">Count</p>
                  <p className="text-lg font-semibold">
                    {formatCount(record.count)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Add motor type dialog */}
      <VehicleFormDialog
        open={addFormOpen}
        onOpenChange={setAddFormOpen}
        onSubmit={handleCreate}
        lockedFields={lockedFields}
      />

      {/* Edit dialog */}
      <VehicleFormDialog
        open={!!editingRecord}
        onOpenChange={(open) => !open && setEditingRecord(null)}
        onSubmit={handleEdit}
        record={editingRecord}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deletingRecord}
        onOpenChange={(open) => !open && setDeletingRecord(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{' '}
              <strong>{deletingRecord?.motorEnergyName}</strong> for{' '}
              {countryName} ({year}). This action cannot be undone.
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
