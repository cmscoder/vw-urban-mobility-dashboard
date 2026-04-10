import { useState, useEffect, useCallback } from 'react';
import {
  MOTOR_ENERGY_OPTIONS,
  EMPTY_FORM,
} from '@/features/vehicles/constants';
import { buildFormFromRecord, isFormValid } from '@/features/vehicles/utils';
import type { VehicleFormData, VehicleRecord } from '@/features/vehicles/types';

export function useVehicleForm(
  open: boolean,
  record?: VehicleRecord | null,
  defaults?: Partial<VehicleFormData>
) {
  const [form, setForm] = useState<VehicleFormData>(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setForm(
        record ? buildFormFromRecord(record) : { ...EMPTY_FORM, ...defaults }
      );
    }
  }, [open, record, defaults]);

  const updateField = useCallback(
    <K extends keyof VehicleFormData>(field: K, value: VehicleFormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateCountry = useCallback((code: string) => {
    setForm((prev) => ({ ...prev, country: code.toUpperCase() }));
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
    updateCountry,
    updateMotorEnergy,
    updateCount,
  };
}
