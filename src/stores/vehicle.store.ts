import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VehicleRecord, VehicleFormData } from '@/types';

interface VehicleStore {
  vehicles: VehicleRecord[];
  isSeeded: boolean;

  seed: (records: VehicleRecord[]) => void;
  addRecord: (data: VehicleFormData) => void;
  updateRecord: (id: string, data: VehicleFormData) => void;
  deleteRecord: (id: string) => void;
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
        const record: VehicleRecord = {
          ...data,
          id: crypto.randomUUID(),
          source: 'local',
        };
        set((state) => ({ vehicles: [...state.vehicles, record] }));
      },

      updateRecord: (id, data) => {
        set((state) => ({
          vehicles: state.vehicles.map((r) =>
            r.id === id ? { ...r, ...data, source: 'local' } : r
          ),
        }));
      },

      deleteRecord: (id) => {
        set((state) => ({
          vehicles: state.vehicles.filter((r) => r.id !== id),
        }));
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
