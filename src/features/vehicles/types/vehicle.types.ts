/** Single vehicle registration record from Eurostat or created locally. */
export interface VehicleRecord {
  id: string;
  country: string;
  countryName: string;
  year: string;
  motorEnergy: string;
  motorEnergyName: string;
  count: number | null;
  source: 'eurostat' | 'local';
}

/** Form payload for creating or editing a vehicle record (no id or source). */
export type VehicleFormData = Omit<VehicleRecord, 'id' | 'source'>;

/** Dashboard-level summary: all motor energies for a country × year group. */
export interface AggregatedRecord {
  id: string;
  country: string;
  countryName: string;
  year: string;
  totalCount: number;
  recordCount: number;
}

export interface VehicleFilters {
  country: string;
  year: string;
  motorEnergy: string;
  source: string;
}

export interface FilterOption {
  value: string;
  label: string;
}
