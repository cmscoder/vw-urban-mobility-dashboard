import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useVehicleForm } from '../use-vehicle-form';
import { EMPTY_FORM } from '@/constants';
import type { VehicleRecord } from '@/types';

const mockRecord: VehicleRecord = {
  id: '1',
  country: 'DE',
  countryName: 'Germany',
  year: '2022',
  motorEnergy: 'ELC',
  motorEnergyName: 'Electricity',
  count: 1000,
  source: 'eurostat',
};

describe('useVehicleForm', () => {
  describe('initial state', () => {
    it('returns empty form when no record is provided', () => {
      const { result } = renderHook(() => useVehicleForm(true));
      expect(result.current.form).toEqual(EMPTY_FORM);
    });

    it('populates form from record when provided', () => {
      const { result } = renderHook(() => useVehicleForm(true, mockRecord));
      expect(result.current.form.country).toBe('DE');
      expect(result.current.form.countryName).toBe('Germany');
      expect(result.current.form.year).toBe('2022');
      expect(result.current.form.count).toBe(1000);
    });

    it('is invalid when form is empty', () => {
      const { result } = renderHook(() => useVehicleForm(true));
      expect(result.current.isValid).toBe(false);
    });

    it('is valid when all required fields are filled', () => {
      const { result } = renderHook(() => useVehicleForm(true, mockRecord));
      expect(result.current.isValid).toBe(true);
    });
  });

  describe('reset on open', () => {
    it('resets to empty form when re-opened without a record', () => {
      const { result, rerender } = renderHook(
        ({ open, record }) => useVehicleForm(open, record),
        { initialProps: { open: true, record: mockRecord } }
      );

      expect(result.current.form.country).toBe('DE');

      rerender({ open: false, record: undefined });
      rerender({ open: true, record: undefined });

      expect(result.current.form).toEqual(EMPTY_FORM);
    });

    it('resets to record data when re-opened with a different record', () => {
      const otherRecord: VehicleRecord = {
        ...mockRecord,
        id: '2',
        country: 'FR',
        countryName: 'France',
      };

      const { result, rerender } = renderHook(
        ({ open, record }) => useVehicleForm(open, record),
        { initialProps: { open: true, record: mockRecord } }
      );

      expect(result.current.form.country).toBe('DE');

      rerender({ open: false, record: undefined });
      rerender({ open: true, record: otherRecord });

      expect(result.current.form.country).toBe('FR');
      expect(result.current.form.countryName).toBe('France');
    });
  });

  describe('updateCountry', () => {
    it('uppercases the country code', () => {
      const { result } = renderHook(() => useVehicleForm(true));

      act(() => {
        result.current.updateCountry('de');
      });

      expect(result.current.form.country).toBe('DE');
    });
  });

  describe('updateMotorEnergy', () => {
    it('sets motorEnergy and resolves motorEnergyName from options', () => {
      const { result } = renderHook(() => useVehicleForm(true));

      act(() => {
        result.current.updateMotorEnergy('ELC');
      });

      expect(result.current.form.motorEnergy).toBe('ELC');
      expect(result.current.form.motorEnergyName).toBe('Electricity');
    });

    it('falls back to raw value when option is not found', () => {
      const { result } = renderHook(() => useVehicleForm(true));

      act(() => {
        result.current.updateMotorEnergy('UNKNOWN');
      });

      expect(result.current.form.motorEnergy).toBe('UNKNOWN');
      expect(result.current.form.motorEnergyName).toBe('UNKNOWN');
    });
  });

  describe('updateCount', () => {
    it('parses numeric string to number', () => {
      const { result } = renderHook(() => useVehicleForm(true));

      act(() => {
        result.current.updateCount('500');
      });

      expect(result.current.form.count).toBe(500);
    });

    it('sets null for empty string', () => {
      const { result } = renderHook(() => useVehicleForm(true, mockRecord));

      act(() => {
        result.current.updateCount('');
      });

      expect(result.current.form.count).toBeNull();
    });
  });

  describe('updateField', () => {
    it('updates a single field', () => {
      const { result } = renderHook(() => useVehicleForm(true));

      act(() => {
        result.current.updateField('countryName', 'Spain');
      });

      expect(result.current.form.countryName).toBe('Spain');
    });
  });
});
