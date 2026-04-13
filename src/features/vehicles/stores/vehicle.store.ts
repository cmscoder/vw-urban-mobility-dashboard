import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { VehicleRecord, VehicleFormData } from '@/features/vehicles/types';
import { isFormValid } from '@/features/vehicles/utils';

/** Shown in UI when another row already uses this country × year × motor combination. */
export const DUPLICATE_VEHICLE_NATURAL_KEY_MESSAGE =
  'A record for this country, year, and motor type already exists.';

function assertValidVehicleForm(data: VehicleFormData): void {
  if (!isFormValid(data)) {
    throw new Error('Invalid vehicle record');
  }
}

function sameNaturalKey(
  a: { country: string; year: string; motorEnergy: string },
  b: { country: string; year: string; motorEnergy: string }
): boolean {
  return (
    a.country.toUpperCase() === b.country.toUpperCase() &&
    a.year.trim() === b.year.trim() &&
    a.motorEnergy === b.motorEnergy
  );
}

function hasNaturalKeyCollision(
  vehicles: VehicleRecord[],
  candidate: VehicleFormData,
  excludeId?: string
): boolean {
  return vehicles.some(
    (r) => r.id !== excludeId && sameNaturalKey(r, candidate)
  );
}

/**
 * Zustand store for vehicle records with localStorage persistence.
 * Acts as the single source of truth for local CRUD after the initial
 * Eurostat data is seeded (see ADR-002).
 */
interface VehicleStore {
  vehicles: VehicleRecord[];
  isSeeded: boolean;

  seed: (records: VehicleRecord[]) => void;
  addRecord: (data: VehicleFormData) => void;
  updateRecord: (id: string, data: VehicleFormData) => void;
  deleteRecord: (id: string) => void;
  /** Clears all local data so the next render re-seeds from the API. */
  resetData: () => void;
}

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set) => ({
      vehicles: [],
      isSeeded: false,

      seed: (records) => {
        set((state) => {
          if (state.isSeeded) return state;
          return { vehicles: records, isSeeded: true };
        });
      },

      addRecord: (data) => {
        assertValidVehicleForm(data);
        set((state) => {
          if (hasNaturalKeyCollision(state.vehicles, data)) {
            throw new Error(DUPLICATE_VEHICLE_NATURAL_KEY_MESSAGE);
          }
          const record: VehicleRecord = {
            ...data,
            id: crypto.randomUUID(),
            source: 'local',
          };
          return { vehicles: [...state.vehicles, record] };
        });
      },

      updateRecord: (id, data) => {
        assertValidVehicleForm(data);
        set((state) => {
          if (!state.vehicles.some((r) => r.id === id)) {
            throw new Error('Record not found');
          }
          if (hasNaturalKeyCollision(state.vehicles, data, id)) {
            throw new Error(DUPLICATE_VEHICLE_NATURAL_KEY_MESSAGE);
          }
          return {
            vehicles: state.vehicles.map((r) =>
              r.id === id ? { ...r, ...data, source: 'local' } : r
            ),
          };
        });
      },

      deleteRecord: (id) => {
        set((state) => ({
          vehicles: state.vehicles.filter((r) => r.id !== id),
        }));
      },

      resetData: () => {
        set({ vehicles: [], isSeeded: false });
      },
    }),
    {
      name: 'vehicle-store',
      partialize: (state) => ({
        vehicles: state.vehicles,
        isSeeded: state.isSeeded,
      }),
    }
  )
);
