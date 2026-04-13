import { describe, it, expect } from 'vitest';
import { aggregateByCountryYear } from '../aggregate-vehicles';
import type { VehicleRecord } from '@/features/vehicles/types';

function createRecord(overrides: Partial<VehicleRecord> = {}): VehicleRecord {
  return {
    id: '1',
    country: 'DE',
    countryName: 'Germany',
    year: '2022',
    motorEnergy: 'ELC',
    motorEnergyName: 'Electricity',
    count: 1000,
    source: 'eurostat',
    ...overrides,
  };
}

describe('aggregateByCountryYear', () => {
  it('returns empty array for empty input', () => {
    expect(aggregateByCountryYear([])).toEqual([]);
  });

  it('groups records by country and year', () => {
    const records = [
      createRecord({
        id: '1',
        country: 'DE',
        year: '2022',
        motorEnergy: 'ELC',
        count: 100,
      }),
      createRecord({
        id: '2',
        country: 'DE',
        year: '2022',
        motorEnergy: 'HYB',
        count: 200,
      }),
      createRecord({
        id: '3',
        country: 'FR',
        year: '2022',
        motorEnergy: 'ELC',
        count: 50,
      }),
    ];

    const result = aggregateByCountryYear(records);

    expect(result).toHaveLength(2);
  });

  it('sums totalCount across motor energies', () => {
    const records = [
      createRecord({ id: '1', country: 'DE', year: '2022', count: 100 }),
      createRecord({ id: '2', country: 'DE', year: '2022', count: 200 }),
      createRecord({ id: '3', country: 'DE', year: '2022', count: 300 }),
    ];

    const result = aggregateByCountryYear(records);
    expect(result[0].totalCount).toBe(600);
  });

  it('counts the number of records per group', () => {
    const records = [
      createRecord({
        id: '1',
        country: 'DE',
        year: '2022',
        motorEnergy: 'ELC',
      }),
      createRecord({
        id: '2',
        country: 'DE',
        year: '2022',
        motorEnergy: 'HYB',
      }),
      createRecord({
        id: '3',
        country: 'DE',
        year: '2022',
        motorEnergy: 'PET',
      }),
    ];

    const result = aggregateByCountryYear(records);
    expect(result[0].recordCount).toBe(3);
  });

  it('builds composite id from country and year', () => {
    const records = [createRecord({ id: '1', country: 'DE', year: '2022' })];

    const result = aggregateByCountryYear(records);
    expect(result[0].id).toBe('DE-2022');
  });

  it('preserves countryName from the first record in the group', () => {
    const records = [
      createRecord({
        id: '1',
        country: 'DE',
        countryName: 'Germany',
        year: '2022',
      }),
      createRecord({
        id: '2',
        country: 'DE',
        countryName: 'Germany',
        year: '2022',
      }),
    ];

    const result = aggregateByCountryYear(records);
    expect(result[0].countryName).toBe('Germany');
  });

  it('treats null count as 0', () => {
    const records = [
      createRecord({ id: '1', country: 'DE', year: '2022', count: null }),
      createRecord({ id: '2', country: 'DE', year: '2022', count: 500 }),
    ];

    const result = aggregateByCountryYear(records);
    expect(result[0].totalCount).toBe(500);
  });

  it('keeps different years separate for the same country', () => {
    const records = [
      createRecord({ id: '1', country: 'DE', year: '2022', count: 100 }),
      createRecord({ id: '2', country: 'DE', year: '2023', count: 200 }),
    ];

    const result = aggregateByCountryYear(records);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id).sort()).toEqual(['DE-2022', 'DE-2023']);
  });

  it('merges rows when country code differs only by case', () => {
    const records = [
      createRecord({
        id: '1',
        country: 'DE',
        year: '2022',
        motorEnergy: 'ELC',
        count: 100,
      }),
      createRecord({
        id: '2',
        country: 'de',
        year: '2022',
        motorEnergy: 'HYB',
        count: 200,
      }),
    ];

    const result = aggregateByCountryYear(records);
    expect(result).toHaveLength(1);
    expect(result[0].country).toBe('DE');
    expect(result[0].totalCount).toBe(300);
    expect(result[0].recordCount).toBe(2);
  });
});
