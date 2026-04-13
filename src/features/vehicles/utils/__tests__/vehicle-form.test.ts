import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isFormValid,
  isFormYearValid,
  getMaxVehicleFormYear,
  getMinVehicleFormYear,
  stablePartialVehicleFormKey,
  stableVehicleRecordKey,
} from '../vehicle-form';
import type { VehicleFormData, VehicleRecord } from '@/features/vehicles/types';

const baseForm: VehicleFormData = {
  country: 'DE',
  countryName: 'Germany',
  year: '2022',
  motorEnergy: 'ELC',
  motorEnergyName: 'Electricity',
  count: 100,
};

describe('vehicle-form', () => {
  describe('isFormYearValid', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-01T12:00:00Z'));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('allows empty year (required handled elsewhere)', () => {
      expect(isFormYearValid('')).toBe(true);
      expect(isFormYearValid('  ')).toBe(true);
    });

    it('allows years from 2018 through the current calendar year', () => {
      expect(isFormYearValid('2018')).toBe(true);
      expect(isFormYearValid('2026')).toBe(true);
    });

    it('rejects years before 2018 (Eurostat dataset baseline)', () => {
      expect(isFormYearValid('2017')).toBe(false);
      expect(isFormYearValid('1994')).toBe(false);
    });

    it('rejects years after the current calendar year', () => {
      expect(isFormYearValid('2027')).toBe(false);
      expect(isFormYearValid('2099')).toBe(false);
    });

    it('rejects non-4-digit numeric years', () => {
      expect(isFormYearValid('202')).toBe(false);
      expect(isFormYearValid('20a2')).toBe(false);
    });

    it('getMaxVehicleFormYear matches mocked clock', () => {
      expect(getMaxVehicleFormYear()).toBe(2026);
    });

    it('getMinVehicleFormYear is 2018', () => {
      expect(getMinVehicleFormYear()).toBe(2018);
    });
  });

  describe('isFormValid', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-01T12:00:00Z'));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('accepts a complete form with an allowed year', () => {
      expect(isFormValid(baseForm)).toBe(true);
    });

    it('rejects a future year even when other fields are valid', () => {
      expect(isFormValid({ ...baseForm, year: '2030' })).toBe(false);
    });

    it('rejects a year before 2018 even when other fields are valid', () => {
      expect(isFormValid({ ...baseForm, year: '1994' })).toBe(false);
    });
  });

  describe('stablePartialVehicleFormKey', () => {
    it('matches for different object references with same fields', () => {
      const a = { country: 'ES', countryName: 'Spain', year: '2024' };
      const b = { country: 'ES', countryName: 'Spain', year: '2024' };
      expect(stablePartialVehicleFormKey(a)).toBe(
        stablePartialVehicleFormKey(b)
      );
    });

    it('differs when a field value changes', () => {
      expect(
        stablePartialVehicleFormKey({
          country: 'ES',
          countryName: 'Spain',
          year: '2024',
        })
      ).not.toBe(
        stablePartialVehicleFormKey({
          country: 'ES',
          countryName: 'Spain',
          year: '2025',
        })
      );
    });
  });

  describe('stableVehicleRecordKey', () => {
    it('is empty when there is no record', () => {
      expect(stableVehicleRecordKey(null)).toBe('');
      expect(stableVehicleRecordKey(undefined)).toBe('');
    });

    it('uses record id', () => {
      const record = { id: 'abc' } as VehicleRecord;
      expect(stableVehicleRecordKey(record)).toBe('abc');
    });
  });
});
