import { describe, it, expect } from 'vitest';
import {
  columnFiltersToVehicleFilters,
  countryOptionsFromAggregated,
  yearOptionsFromAggregated,
} from '../vehicle-table';
import { EMPTY_FILTERS } from '@/features/vehicles/constants';
import type { AggregatedRecord } from '@/features/vehicles/types';

describe('columnFiltersToVehicleFilters', () => {
  it('returns empty filters shape when no column filters', () => {
    expect(columnFiltersToVehicleFilters([])).toEqual(EMPTY_FILTERS);
  });

  it('maps known column ids onto VehicleFilters', () => {
    expect(
      columnFiltersToVehicleFilters([
        { id: 'country', value: 'DE' },
        { id: 'year', value: '2022' },
      ])
    ).toEqual({
      ...EMPTY_FILTERS,
      country: 'DE',
      year: '2022',
    });
  });
});

describe('countryOptionsFromAggregated', () => {
  const data: AggregatedRecord[] = [
    {
      id: 'DE-2022',
      country: 'DE',
      countryName: 'Germany',
      year: '2022',
      totalCount: 1,
      recordCount: 1,
    },
    {
      id: 'DE-2023',
      country: 'DE',
      countryName: 'Germany',
      year: '2023',
      totalCount: 1,
      recordCount: 1,
    },
    {
      id: 'FR-2022',
      country: 'FR',
      countryName: 'France',
      year: '2022',
      totalCount: 1,
      recordCount: 1,
    },
  ];

  it('deduplicates by country code and sorts by label', () => {
    expect(countryOptionsFromAggregated(data)).toEqual([
      { value: 'FR', label: 'France' },
      { value: 'DE', label: 'Germany' },
    ]);
  });

  it('deduplicates country codes that differ only by case', () => {
    const mixed: AggregatedRecord[] = [
      {
        id: '1',
        country: 'DE',
        countryName: 'Germany',
        year: '2022',
        totalCount: 1,
        recordCount: 1,
      },
      {
        id: '2',
        country: 'de',
        countryName: 'Germany',
        year: '2023',
        totalCount: 1,
        recordCount: 1,
      },
    ];
    expect(countryOptionsFromAggregated(mixed)).toEqual([
      { value: 'DE', label: 'Germany' },
    ]);
  });
});

describe('yearOptionsFromAggregated', () => {
  it('returns distinct years descending', () => {
    const data: AggregatedRecord[] = [
      {
        id: 'A',
        country: 'DE',
        countryName: 'Germany',
        year: '2022',
        totalCount: 1,
        recordCount: 1,
      },
      {
        id: 'B',
        country: 'FR',
        countryName: 'France',
        year: '2023',
        totalCount: 1,
        recordCount: 1,
      },
      {
        id: 'C',
        country: 'ES',
        countryName: 'Spain',
        year: '2022',
        totalCount: 1,
        recordCount: 1,
      },
    ];
    expect(yearOptionsFromAggregated(data).map((o) => o.value)).toEqual([
      '2023',
      '2022',
    ]);
  });
});
