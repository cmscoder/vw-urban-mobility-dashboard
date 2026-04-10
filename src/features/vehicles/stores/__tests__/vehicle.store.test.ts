import { describe, it, expect, beforeEach } from 'vitest';
import { useVehicleStore } from '../vehicle.store';
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
