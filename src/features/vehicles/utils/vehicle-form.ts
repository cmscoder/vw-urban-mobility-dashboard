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
 * within `getMinVehicleFormYear()` … `getMaxVehicleFormYear()` (inclusive).
 */
export function isFormYearValid(year: string): boolean {
  const t = year.trim();
  if (t === '') return true;
  if (!/^\d{4}$/.test(t)) return false;
  const n = Number(t);
  return n >= EUROSTAT_SINCE_YEAR && n <= getMaxVehicleFormYear();
}

/** Strips store-only fields so the dialog can edit a plain form payload. */
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

const VEHICLE_FORM_KEYS: (keyof VehicleFormData)[] = [
  'country',
  'countryName',
  'year',
  'motorEnergy',
  'motorEnergyName',
  'count',
];

/**
 * Stable key for `useVehicleForm` effect deps: inline `defaults` objects get a
 * new reference every render; this string only changes when values change.
 */
export function stablePartialVehicleFormKey(
  partial?: Partial<VehicleFormData>
): string {
  if (!partial) return '';
  const entries = VEHICLE_FORM_KEYS.filter(
    (key) => key in partial && partial[key] !== undefined
  )
    .map((key) => [key, partial[key]!] as [string, unknown])
    .sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(Object.fromEntries(entries));
}

/** Stable key for the record being edited (avoids effect churn on new object refs with same id). */
export function stableVehicleRecordKey(
  record: VehicleRecord | null | undefined
): string {
  return record?.id ?? '';
}

export function isFormValid(form: VehicleFormData): boolean {
  const requiredOk = REQUIRED_FORM_FIELDS.every((field) => {
    const value = form[field];
    if (value === null) return false;
    return typeof value === 'string' ? value.trim() !== '' : true;
  });
  return requiredOk && isFormYearValid(form.year);
}
