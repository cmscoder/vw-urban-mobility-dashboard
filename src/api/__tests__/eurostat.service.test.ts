import { describe, it, expect } from 'vitest';
import { transformResponse } from '../eurostat.service';
import type { EurostatResponse } from '@/types';

const mockResponse: EurostatResponse = {
  version: '2.0',
  class: 'dataset',
  label: 'Passenger cars, by type of motor energy',
  source: 'ESTAT',
  updated: '2024-01-01T00:00:00+0100',
  id: ['freq', 'unit', 'mot_nrg', 'engine', 'geo', 'time'],
  size: [1, 1, 2, 1, 3, 1],
  value: {
    '0': 1000,
    '1': 2000,
    '2': 500,
    '4': 800,
    '5': 1500,
  },
  dimension: {
    freq: {
      label: 'Time frequency',
      category: { index: { A: 0 }, label: { A: 'Annual' } },
    },
    unit: {
      label: 'Unit of measure',
      category: { index: { NR: 0 }, label: { NR: 'Number' } },
    },
    mot_nrg: {
      label: 'Motor energy',
      category: {
        index: { ELC: 0, PG_ELC: 1 },
        label: { ELC: 'Electricity', PG_ELC: 'Plug-in hybrid electric' },
      },
    },
    engine: {
      label: 'Engine capacity',
      category: { index: { TOTAL: 0 }, label: { TOTAL: 'Total' } },
    },
    geo: {
      label: 'Geopolitical entity',
      category: {
        index: { DE: 0, FR: 1, ES: 2 },
        label: { DE: 'Germany', FR: 'France', ES: 'Spain' },
      },
    },
    time: {
      label: 'Time',
      category: { index: { '2022': 0 }, label: { '2022': '2022' } },
    },
  },
};

describe('transformResponse', () => {
  it('transforms JSON-stat into VehicleRecord array', () => {
    const records = transformResponse(mockResponse);

    expect(records.length).toBe(5);
    expect(records[0]).toEqual({
      id: 'DE-ELC-2022',
      country: 'DE',
      countryName: 'Germany',
      year: '2022',
      motorEnergy: 'ELC',
      motorEnergyName: 'Electricity',
      count: 1000,
      source: 'eurostat',
    });
  });

  it('skips entries with no data', () => {
    const records = transformResponse(mockResponse);

    const ids = records.map((r) => r.id);
    expect(ids).not.toContain('DE-PG_ELC-2022');
  });

  it('maps all source fields as eurostat', () => {
    const records = transformResponse(mockResponse);

    expect(records.every((r) => r.source === 'eurostat')).toBe(true);
  });

  it('returns empty array when a required dimension is missing', () => {
    const incomplete = {
      ...mockResponse,
      dimension: {
        freq: mockResponse.dimension.freq,
        unit: mockResponse.dimension.unit,
        geo: mockResponse.dimension.geo,
        time: mockResponse.dimension.time,
        engine: mockResponse.dimension.engine,
      },
    };

    expect(transformResponse(incomplete)).toEqual([]);
  });

  it('returns empty array when value object is empty', () => {
    const empty = { ...mockResponse, value: {} };

    expect(transformResponse(empty)).toEqual([]);
  });
});
