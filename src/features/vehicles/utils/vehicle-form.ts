import type { VehicleFormData, VehicleRecord } from '@/features/vehicles/types';
import {
  EUROSTAT_SINCE_YEAR,
  REQUIRED_FORM_FIELDS,
} from '@/features/vehicles/constants';

/** Same lower bound as the Eurostat query (`sinceTimePeriod`). */
export function getMinVehicleFormYear(): number {
  return EUROSTAT_SINCE_YEAR;
}

/** Calendar year used to cap the form year (registration data is not future-dated). */
export function getMaxVehicleFormYear(): number {
  return new Date().getFullYear();
}

/**
 * True when `year` is empty (other rules handle required) or a 4-digit year
 * within [{@link getMinVehicleFormYear}, {@link getMaxVehicleFormYear}].
 */
export function isFormYearValid(year: string): boolean {
  const t = year.trim();
  if (t === '') return true;
  if (!/^\d{4}$/.test(t)) return false;
  const n = Number(t);
  return n >= EUROSTAT_SINCE_YEAR && n <= getMaxVehicleFormYear();
}

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
  const requiredOk = REQUIRED_FORM_FIELDS.every((field) => {
    const value = form[field];
    if (value === null) return false;
    return typeof value === 'string' ? value.trim() !== '' : true;
  });
  return requiredOk && isFormYearValid(form.year);
}
