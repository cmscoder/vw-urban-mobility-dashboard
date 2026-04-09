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

export type VehicleFormData = Omit<VehicleRecord, 'id' | 'source'>;

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
