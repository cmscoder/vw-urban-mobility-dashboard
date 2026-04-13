import { describe, it, expect } from 'vitest';
import {
  AGGREGATED_TABLE_SORT_PRESETS,
  DEFAULT_AGGREGATED_TABLE_SORTING,
  matchAggregatedTableSortPresetValue,
} from '../vehicle-table';

describe('aggregated table sort presets', () => {
  it('first preset matches default multi-column sort', () => {
    expect(AGGREGATED_TABLE_SORT_PRESETS[0].value).toBe('default');
    expect(AGGREGATED_TABLE_SORT_PRESETS[0].sorting).toEqual(
      DEFAULT_AGGREGATED_TABLE_SORTING
    );
  });

  it('matchAggregatedTableSortPresetValue returns default for initial table state', () => {
    expect(
      matchAggregatedTableSortPresetValue(DEFAULT_AGGREGATED_TABLE_SORTING)
    ).toBe('default');
  });

  it('matchAggregatedTableSortPresetValue maps single-column sorts', () => {
    expect(
      matchAggregatedTableSortPresetValue([{ id: 'year', desc: false }])
    ).toBe('year-asc');
    expect(
      matchAggregatedTableSortPresetValue([{ id: 'recordCount', desc: true }])
    ).toBe('types-desc');
  });

  it('falls back to default preset value for unknown sorting state', () => {
    expect(
      matchAggregatedTableSortPresetValue([
        { id: 'country', desc: true },
        { id: 'year', desc: false },
      ])
    ).toBe('default');
  });
});
