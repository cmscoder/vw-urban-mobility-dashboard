import { describe, it, expect } from 'vitest';
import {
  columnFiltersToVehicleFilters,
  countryOptionsFromAggregated,
  nextAggregatedColumnSortingState,
  yearOptionsFromAggregated,
} from '../vehicle-table';
import {
  DEFAULT_AGGREGATED_TABLE_SORTING,
  EMPTY_FILTERS,
} from '@/features/vehicles/constants';
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

describe('nextAggregatedColumnSortingState', () => {
  it('from default multi-sort (year desc), year cycles asc → cleared → desc', () => {
    const s0 = DEFAULT_AGGREGATED_TABLE_SORTING;
    const s1 = nextAggregatedColumnSortingState('year', s0);
    expect(s1).toEqual([{ id: 'year', desc: false }]);
    const s2 = nextAggregatedColumnSortingState('year', s1);
    expect(s2).toEqual([]);
    const s3 = nextAggregatedColumnSortingState('year', s2);
    expect(s3).toEqual([{ id: 'year', desc: true }]);
  });

  it('countryName cycles asc → desc → cleared (desc-first false)', () => {
    expect(nextAggregatedColumnSortingState('countryName', [])).toEqual([
      { id: 'countryName', desc: false },
    ]);
    expect(
      nextAggregatedColumnSortingState('countryName', [
        { id: 'countryName', desc: false },
      ])
    ).toEqual([{ id: 'countryName', desc: true }]);
    expect(
      nextAggregatedColumnSortingState('countryName', [
        { id: 'countryName', desc: true },
      ])
    ).toEqual([]);
  });

  it('totalCount uses desc-first cycle', () => {
    expect(nextAggregatedColumnSortingState('totalCount', [])).toEqual([
      { id: 'totalCount', desc: true },
    ]);
    expect(
      nextAggregatedColumnSortingState('totalCount', [
        { id: 'totalCount', desc: true },
      ])
    ).toEqual([{ id: 'totalCount', desc: false }]);
    expect(
      nextAggregatedColumnSortingState('totalCount', [
        { id: 'totalCount', desc: false },
      ])
    ).toEqual([]);
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
