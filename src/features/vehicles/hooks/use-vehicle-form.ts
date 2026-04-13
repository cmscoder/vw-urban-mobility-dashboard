import { useState, useEffect, useCallback } from 'react';
import {
  MOTOR_ENERGY_OPTIONS,
  EMPTY_FORM,
} from '@/features/vehicles/constants';
import {
  buildFormFromRecord,
  isFormValid,
  stablePartialVehicleFormKey,
  stableVehicleRecordKey,
} from '@/features/vehicles/utils';
import type { VehicleFormData, VehicleRecord } from '@/features/vehicles/types';

/**
 * Manages form state for the vehicle create/edit dialog.
 * Resets to the record's data (edit) or to defaults (create) each time
 * the dialog opens. Provides field-level updaters and validation.
 *
 * @param open     - Whether the dialog is currently visible.
 * @param record   - Existing record to edit, or null/undefined for creation.
 * @param defaults - Pre-filled values for new records (e.g. locked country/year).
 *                   Prefer a stable reference (`useMemo`); the hook also keys the
 *                   reset effect on serialized values so inline objects with the
 *                   same fields do not wipe in-progress edits on re-render.
 */
export function useVehicleForm(
  open: boolean,
  record?: VehicleRecord | null,
  defaults?: Partial<VehicleFormData>
) {
  const [form, setForm] = useState<VehicleFormData>(EMPTY_FORM);

  const recordKey = stableVehicleRecordKey(record);
  const defaultsKey = stablePartialVehicleFormKey(defaults);

  useEffect(() => {
    if (open) {
      setForm(
        record ? buildFormFromRecord(record) : { ...EMPTY_FORM, ...defaults }
      );
    }
    // `record` / `defaults` are read from the closure when `recordKey` or
    // `defaultsKey` change (or `open` flips), avoiding resets on new object refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset keyed by stable keys; omitting `record`/`defaults` avoids spurious resets on new object refs.
  }, [open, recordKey, defaultsKey]);

  const updateField = useCallback(
    <K extends keyof VehicleFormData>(field: K, value: VehicleFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateCountrySelection = useCallback((code: string, name: string) => {
    setForm((prev) => ({
      ...prev,
      country: code.toUpperCase(),
      countryName: name,
    }));
  }, []);

  const updateMotorEnergy = useCallback((value: string) => {
    const option = MOTOR_ENERGY_OPTIONS.find((o) => o.value === value);
    setForm((prev) => ({
      ...prev,
      motorEnergy: value,
      motorEnergyName: option?.label ?? value,
    }));
  }, []);

  const updateCount = useCallback((raw: string) => {
    setForm((prev) => ({
      ...prev,
      count: raw ? Number(raw) : null,
    }));
  }, []);

  return {
    form,
    isValid: isFormValid(form),
    updateField,
    updateCountrySelection,
    updateMotorEnergy,
    updateCount,
  };
}
