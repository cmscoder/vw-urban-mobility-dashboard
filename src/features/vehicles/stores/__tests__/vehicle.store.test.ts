import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DUPLICATE_VEHICLE_NATURAL_KEY_MESSAGE,
  useVehicleStore,
} from '../vehicle.store';
import type { VehicleRecord } from '@/features/vehicles/types';

const mockRecords: VehicleRecord[] = [
  {
    id: 'DE-ELC-2022',
    country: 'DE',
    countryName: 'Germany',
    year: '2022',
    motorEnergy: 'ELC',
    motorEnergyName: 'Electricity',
    count: 1000,
    source: 'eurostat',
  },
  {
    id: 'FR-ELC-2022',
    country: 'FR',
    countryName: 'France',
    year: '2022',
    motorEnergy: 'ELC',
    motorEnergyName: 'Electricity',
    count: 2000,
    source: 'eurostat',
  },
];

beforeEach(() => {
  useVehicleStore.setState({ vehicles: [], isSeeded: false });
});

describe('vehicle store', () => {
  describe('seed', () => {
    it('populates vehicles on first call', () => {
      useVehicleStore.getState().seed(mockRecords);

      const { vehicles, isSeeded } = useVehicleStore.getState();
      expect(vehicles).toEqual(mockRecords);
      expect(isSeeded).toBe(true);
    });

    it('ignores subsequent seed calls', () => {
      const { seed } = useVehicleStore.getState();
      seed(mockRecords);
      seed([]);

      expect(useVehicleStore.getState().vehicles).toEqual(mockRecords);
    });
  });

  describe('addRecord', () => {
    it('appends a local record with generated id', () => {
      useVehicleStore.getState().seed(mockRecords);
      useVehicleStore.getState().addRecord({
        country: 'ES',
        countryName: 'Spain',
        year: '2023',
        motorEnergy: 'ELC',
        motorEnergyName: 'Electricity',
        count: 300,
      });

      const { vehicles } = useVehicleStore.getState();
      expect(vehicles).toHaveLength(3);

      const added = vehicles[2];
      expect(added.source).toBe('local');
      expect(added.country).toBe('ES');
      expect(added.id).toBeDefined();
    });

    it('throws when year is in the future', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-01T12:00:00Z'));
      try {
        useVehicleStore.getState().seed(mockRecords);

        expect(() =>
          useVehicleStore.getState().addRecord({
            country: 'ES',
            countryName: 'Spain',
            year: '2099',
            motorEnergy: 'ELC',
            motorEnergyName: 'Electricity',
            count: 300,
          })
        ).toThrow('Invalid vehicle record');

        expect(useVehicleStore.getState().vehicles).toHaveLength(2);
      } finally {
        vi.useRealTimers();
      }
    });

    it('throws when year is before 2018', () => {
      useVehicleStore.getState().seed(mockRecords);

      expect(() =>
        useVehicleStore.getState().addRecord({
          country: 'ES',
          countryName: 'Spain',
          year: '1994',
          motorEnergy: 'ELC',
          motorEnergyName: 'Electricity',
          count: 300,
        })
      ).toThrow('Invalid vehicle record');

      expect(useVehicleStore.getState().vehicles).toHaveLength(2);
    });

    it('throws when country, year, and motor match an existing row', () => {
      useVehicleStore.getState().seed(mockRecords);

      expect(() =>
        useVehicleStore.getState().addRecord({
          country: 'DE',
          countryName: 'Germany',
          year: '2022',
          motorEnergy: 'ELC',
          motorEnergyName: 'Electricity',
          count: 1,
        })
      ).toThrow(DUPLICATE_VEHICLE_NATURAL_KEY_MESSAGE);

      expect(useVehicleStore.getState().vehicles).toHaveLength(2);
    });

    it('treats country code case-insensitively for duplicates', () => {
      useVehicleStore.getState().seed(mockRecords);

      expect(() =>
        useVehicleStore.getState().addRecord({
          country: 'de',
          countryName: 'Germany',
          year: '2022',
          motorEnergy: 'ELC',
          motorEnergyName: 'Electricity',
          count: 1,
        })
      ).toThrow(DUPLICATE_VEHICLE_NATURAL_KEY_MESSAGE);
    });
  });

  describe('updateRecord', () => {
    it('updates an existing record by id', () => {
      useVehicleStore.getState().seed(mockRecords);
      useVehicleStore.getState().updateRecord('DE-ELC-2022', {
        country: 'DE',
        countryName: 'Germany',
        year: '2022',
        motorEnergy: 'ELC',
        motorEnergyName: 'Electricity',
        count: 9999,
      });

      const updated = useVehicleStore
        .getState()
        .vehicles.find((r) => r.id === 'DE-ELC-2022');
      expect(updated?.count).toBe(9999);
    });

    it('changes source to local after editing an eurostat record', () => {
      useVehicleStore.getState().seed(mockRecords);
      useVehicleStore.getState().updateRecord('DE-ELC-2022', {
        country: 'DE',
        countryName: 'Germany',
        year: '2022',
        motorEnergy: 'ELC',
        motorEnergyName: 'Electricity',
        count: 9999,
      });

      const updated = useVehicleStore
        .getState()
        .vehicles.find((r) => r.id === 'DE-ELC-2022');
      expect(updated?.source).toBe('local');
    });

    it('does not affect other records', () => {
      useVehicleStore.getState().seed(mockRecords);
      useVehicleStore.getState().updateRecord('DE-ELC-2022', {
        country: 'DE',
        countryName: 'Germany',
        year: '2022',
        motorEnergy: 'ELC',
        motorEnergyName: 'Electricity',
        count: 9999,
      });

      const france = useVehicleStore
        .getState()
        .vehicles.find((r) => r.id === 'FR-ELC-2022');
      expect(france?.count).toBe(2000);
    });

    it('throws when id does not exist', () => {
      useVehicleStore.getState().seed(mockRecords);

      expect(() =>
        useVehicleStore.getState().updateRecord('missing-id', {
          country: 'DE',
          countryName: 'Germany',
          year: '2022',
          motorEnergy: 'ELC',
          motorEnergyName: 'Electricity',
          count: 1,
        })
      ).toThrow('Record not found');
    });

    it('throws when update would duplicate another row natural key', () => {
      useVehicleStore.getState().seed(mockRecords);

      expect(() =>
        useVehicleStore.getState().updateRecord('FR-ELC-2022', {
          country: 'DE',
          countryName: 'Germany',
          year: '2022',
          motorEnergy: 'ELC',
          motorEnergyName: 'Electricity',
          count: 2000,
        })
      ).toThrow(DUPLICATE_VEHICLE_NATURAL_KEY_MESSAGE);

      const fr = useVehicleStore
        .getState()
        .vehicles.find((r) => r.id === 'FR-ELC-2022');
      expect(fr?.country).toBe('FR');
    });

    it('throws when update sets year to the future', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-01T12:00:00Z'));
      try {
        useVehicleStore.getState().seed(mockRecords);

        expect(() =>
          useVehicleStore.getState().updateRecord('DE-ELC-2022', {
            country: 'DE',
            countryName: 'Germany',
            year: '2099',
            motorEnergy: 'ELC',
            motorEnergyName: 'Electricity',
            count: 1000,
          })
        ).toThrow('Invalid vehicle record');

        const unchanged = useVehicleStore
          .getState()
          .vehicles.find((r) => r.id === 'DE-ELC-2022');
        expect(unchanged?.year).toBe('2022');
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('resetData', () => {
    it('clears vehicles and isSeeded so seed can run again', () => {
      useVehicleStore.getState().seed(mockRecords);
      useVehicleStore.getState().addRecord({
        country: 'ES',
        countryName: 'Spain',
        year: '2023',
        motorEnergy: 'ELC',
        motorEnergyName: 'Electricity',
        count: 1,
      });

      useVehicleStore.getState().resetData();

      expect(useVehicleStore.getState().vehicles).toEqual([]);
      expect(useVehicleStore.getState().isSeeded).toBe(false);

      useVehicleStore.getState().seed(mockRecords);
      expect(useVehicleStore.getState().vehicles).toEqual(mockRecords);
      expect(useVehicleStore.getState().isSeeded).toBe(true);
    });
  });

  describe('deleteRecord', () => {
    it('removes a record by id', () => {
      useVehicleStore.getState().seed(mockRecords);
      useVehicleStore.getState().deleteRecord('DE-ELC-2022');

      const { vehicles } = useVehicleStore.getState();
      expect(vehicles).toHaveLength(1);
      expect(vehicles[0].id).toBe('FR-ELC-2022');
    });
  });
});
