import { describe, it, expect } from 'vitest';
import { buildChartData } from '../merge-by-motor-energy';
import { CHART_COLORS } from '@/features/vehicles/constants';
import type { VehicleRecord } from '@/features/vehicles/types';

function record(overrides: Partial<VehicleRecord>): VehicleRecord {
  return {
    id: '1',
    country: 'DE',
    countryName: 'Germany',
    year: '2022',
    motorEnergy: 'ELC',
    motorEnergyName: 'Electricity',
    count: 100,
    source: 'eurostat',
    ...overrides,
  };
}

describe('buildChartData', () => {
  it('returns empty array for no records', () => {
    expect(buildChartData([])).toEqual([]);
  });

  it('merges multiple rows with the same motorEnergyName', () => {
    const records = [
      record({ id: '1', motorEnergyName: 'Electricity', count: 100 }),
      record({ id: '2', motorEnergyName: 'Electricity', count: 50 }),
      record({ id: '3', motorEnergyName: 'Hybrid', count: 200 }),
    ];

    const result = buildChartData(records);

    expect(result).toHaveLength(2);
    const elec = result.find((e) => e.name === 'Electricity');
    expect(elec?.count).toBe(150);
    const hyb = result.find((e) => e.name === 'Hybrid');
    expect(hyb?.count).toBe(200);
  });

  it('sorts by count descending', () => {
    const records = [
      record({ id: '1', motorEnergyName: 'A', count: 10 }),
      record({ id: '2', motorEnergyName: 'B', count: 500 }),
    ];

    const result = buildChartData(records);
    expect(result.map((e) => e.name)).toEqual(['B', 'A']);
  });

  it('assigns colors from CHART_COLORS by first-seen motor order', () => {
    const records = [
      record({ id: '1', motorEnergyName: 'First', count: 1 }),
      record({ id: '2', motorEnergyName: 'Second', count: 2 }),
    ];

    const result = buildChartData(records);
    const byName = Object.fromEntries(result.map((e) => [e.name, e.fill]));

    expect(byName['First']).toBe(CHART_COLORS[0]);
    expect(byName['Second']).toBe(CHART_COLORS[1]);
  });
});
