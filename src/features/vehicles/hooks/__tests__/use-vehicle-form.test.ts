import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useVehicleForm } from '../use-vehicle-form';
import { EMPTY_FORM } from '@/features/vehicles/constants';
import type { VehicleRecord } from '@/features/vehicles/types';

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
        {
          initialProps: {
            open: true,
            record: mockRecord as VehicleRecord | null,
          },
        }
      );

      expect(result.current.form.country).toBe('DE');

      rerender({ open: false, record: null });
      rerender({ open: true, record: null });

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
        {
          initialProps: {
            open: true,
            record: mockRecord as VehicleRecord | null,
          },
        }
      );

      expect(result.current.form.country).toBe('DE');

      rerender({ open: false, record: null });
      rerender({ open: true, record: otherRecord });

      expect(result.current.form.country).toBe('FR');
      expect(result.current.form.countryName).toBe('France');
    });
  });

  describe('updateCountrySelection', () => {
    it('sets both country code (uppercased) and name', () => {
      const { result } = renderHook(() => useVehicleForm(true));

      act(() => {
        result.current.updateCountrySelection('de', 'Germany');
      });

      expect(result.current.form.country).toBe('DE');
      expect(result.current.form.countryName).toBe('Germany');
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

  describe('defaults reference stability', () => {
    it('does not reset the form when defaults is a new object with the same values', () => {
      const locked = {
        country: 'ES',
        countryName: 'Spain',
        year: '2024',
      };

      const { result, rerender } = renderHook(
        ({ defaults }) => useVehicleForm(true, null, defaults),
        { initialProps: { defaults: { ...locked } } }
      );

      expect(result.current.form.country).toBe('ES');
      expect(result.current.form.year).toBe('2024');

      act(() => {
        result.current.updateCount('42');
      });
      expect(result.current.form.count).toBe(42);

      rerender({ defaults: { ...locked } });

      expect(result.current.form.count).toBe(42);
      expect(result.current.form.country).toBe('ES');
    });
  });

  describe('year validation', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-01T12:00:00Z'));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('is invalid when year is in the future', () => {
      const { result } = renderHook(() => useVehicleForm(true));

      act(() => {
        result.current.updateCountrySelection('DE', 'Germany');
        result.current.updateField('year', '2030');
        result.current.updateMotorEnergy('ELC');
        result.current.updateCount('10');
      });

      expect(result.current.isValid).toBe(false);
    });

    it('is invalid when year is before 2018', () => {
      const { result } = renderHook(() => useVehicleForm(true));

      act(() => {
        result.current.updateCountrySelection('DE', 'Germany');
        result.current.updateField('year', '1994');
        result.current.updateMotorEnergy('ELC');
        result.current.updateCount('10');
      });

      expect(result.current.isValid).toBe(false);
    });
  });
});
