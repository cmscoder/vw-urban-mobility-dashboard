/** Single vehicle registration row from Eurostat or created locally. */
export interface VehicleRecord {
  id: string;
  /** ISO 3166-1 alpha-2 (uppercase in app data). */
  country: string;
  countryName: string;
  /** Four-digit calendar year as string. */
  year: string;
  /** Eurostat motor-energy code (e.g. `ELC`). */
  motorEnergy: string;
  motorEnergyName: string;
  /** `null` when the user cleared the count field in the form. */
  count: number | null;
  source: 'eurostat' | 'local';
}

/** Payload for create/edit dialogs (`id` and `source` are owned by the store). */
export type VehicleFormData = Omit<VehicleRecord, 'id' | 'source'>;

/**
 * One dashboard row: all motor-energy registrations aggregated for a country × year.
 * `recordCount` is how many underlying rows exist; `totalCount` is the sum of their counts.
 */
export interface AggregatedRecord {
  id: string;
  country: string;
  countryName: string;
  year: string;
  totalCount: number;
  recordCount: number;
}

/**
 * Filter model for the table and filter UI. Use `'all'` on a field to mean “no filter”
 * (see `EMPTY_FILTERS`). Other values are column-specific (country code, year string, etc.).
 */
export interface VehicleFilters {
  country: string;
  year: string;
  motorEnergy: string;
  source: string;
}

export type VehicleFilterChangeHandler = (
  field: keyof VehicleFilters,
  value: string
) => void;

/** Option for selects/comboboxes (`value` is stored; `label` is shown). */
export interface FilterOption {
  value: string;
  label: string;
}
