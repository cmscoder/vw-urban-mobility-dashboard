import type { VehicleFormData } from '@/types';

export const EMPTY_FORM: VehicleFormData = {
  country: '',
  countryName: '',
  year: '',
  motorEnergy: '',
  motorEnergyName: '',
  count: null,
};

export const REQUIRED_FORM_FIELDS: (keyof VehicleFormData)[] = [
  'country',
  'countryName',
  'year',
  'motorEnergy',
  'count',
];
