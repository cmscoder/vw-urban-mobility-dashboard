import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormTextField } from '@/components/ui/form-text-field';
import { MotorEnergySelect } from '@/features/vehicles/components/MotorEnergySelect';
import { useVehicleForm } from '@/features/vehicles/hooks';
import type { VehicleFormData, VehicleRecord } from '@/features/vehicles/types';

interface LockedFields {
  country: string;
  countryName: string;
  year: string;
}

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VehicleFormData) => void;
  record?: VehicleRecord | null;
  lockedFields?: LockedFields;
}

export function VehicleFormDialog({
  open,
  onOpenChange,
  onSubmit,
  record,
  lockedFields,
}: VehicleFormDialogProps) {
  const isEditing = !!record;
  const hasLockedFields = !!lockedFields;

  const {
    form,
    isValid,
    updateField,
    updateCountry,
    updateMotorEnergy,
    updateCount,
  } = useVehicleForm(open, record, lockedFields);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(form);
    onOpenChange(false);
  }

  function getTitle() {
    if (isEditing) return 'Edit Record';
    if (hasLockedFields) return 'Add Motor Type';
    return 'Add New Record';
  }

  function getDescription() {
    if (isEditing) return 'Update the vehicle registration data below.';
    if (hasLockedFields)
      return `Add a new motor type for ${lockedFields.countryName} (${lockedFields.year}).`;
    return 'Fill in the details to add a new vehicle registration record.';
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormTextField
              id="countryCode"
              label="Country Code"
              placeholder="DE"
              maxLength={2}
              value={form.country}
              onChange={updateCountry}
              disabled={hasLockedFields}
            />
            <FormTextField
              id="countryName"
              label="Country Name"
              placeholder="Germany"
              value={form.countryName}
              onChange={(v) => updateField('countryName', v)}
              disabled={hasLockedFields}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormTextField
              id="year"
              label="Year"
              placeholder="2024"
              maxLength={4}
              value={form.year}
              onChange={(v) => updateField('year', v)}
              disabled={hasLockedFields}
            />
            <FormTextField
              id="count"
              label="Vehicle Count"
              placeholder="0"
              type="number"
              value={form.count}
              onChange={updateCount}
            />
          </div>

          <MotorEnergySelect
            value={form.motorEnergy}
            onChange={updateMotorEnergy}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              {isEditing ? 'Save Changes' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
