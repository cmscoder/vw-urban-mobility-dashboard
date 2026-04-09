import type { VehicleFormData, VehicleRecord } from '@/types';
import { REQUIRED_FORM_FIELDS } from '@/constants';

export function buildFormFromRecord(record: VehicleRecord): VehicleFormData {
  return {
    country: record.country,
    countryName: record.countryName,
    year: record.year,
    motorEnergy: record.motorEnergy,
    motorEnergyName: record.motorEnergyName,
    count: record.count,
  };
}

export function isFormValid(form: VehicleFormData): boolean {
  return REQUIRED_FORM_FIELDS.every((field) => {
    const value = form[field];
    if (value === null) return false;
    return typeof value === 'string' ? value.trim() !== '' : true;
  });
}
