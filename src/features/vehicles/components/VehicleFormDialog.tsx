import type { SubmitEvent } from 'react';

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
import { CountryCombobox } from '@/features/vehicles/components/CountryCombobox';
import { useVehicleForm } from '@/features/vehicles/hooks';
import {
  getMaxVehicleFormYear,
  getMinVehicleFormYear,
  isFormYearValid,
} from '@/features/vehicles/utils';
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
    updateCountrySelection,
    updateMotorEnergy,
    updateCount,
  } = useVehicleForm(open, record, lockedFields);

  const minYear = getMinVehicleFormYear();
  const maxYear = getMaxVehicleFormYear();
  const yearInvalid =
    !hasLockedFields && form.year.trim() !== '' && !isFormYearValid(form.year);

  const title = isEditing
    ? 'Edit Record'
    : hasLockedFields
      ? 'Add Motor Type'
      : 'Add New Record';

  const description = isEditing
    ? 'Update the vehicle registration data below.'
    : lockedFields
      ? `Add a new motor type for ${lockedFields.countryName} (${lockedFields.year}).`
      : 'Fill in the details to add a new vehicle registration record.';

  const submitLabel = isEditing
    ? 'Save Changes'
    : hasLockedFields
      ? 'Add Motor Type'
      : 'Add Record';

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(form);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CountryCombobox
            value={form.country}
            onChange={updateCountrySelection}
            disabled={hasLockedFields}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <FormTextField
                id="year"
                label="Year"
                type="number"
                placeholder="2024"
                value={form.year}
                onChange={(v) => updateField('year', v)}
                min={minYear}
                max={maxYear}
                disabled={hasLockedFields}
              />
              {yearInvalid ? (
                <p className="text-xs text-destructive" role="alert">
                  Year must be between {minYear} and {maxYear} (same range as
                  the Eurostat dataset).
                </p>
              ) : null}
            </div>
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
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
