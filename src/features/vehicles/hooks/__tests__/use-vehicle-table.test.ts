import type { MouseEvent } from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useVehicleTable } from '../use-vehicle-table';
import { EMPTY_FILTERS } from '@/features/vehicles/constants';
import type { AggregatedRecord } from '@/features/vehicles/types';

function createAggregated(
  overrides: Partial<AggregatedRecord> = {}
): AggregatedRecord {
  return {
    id: 'DE-2022',
    country: 'DE',
    countryName: 'Germany',
    year: '2022',
    totalCount: 5000,
    recordCount: 3,
    ...overrides,
  };
}

const mockData: AggregatedRecord[] = [
  createAggregated({
    id: 'DE-2022',
    country: 'DE',
    countryName: 'Germany',
    year: '2022',
  }),
  createAggregated({
    id: 'FR-2023',
    country: 'FR',
    countryName: 'France',
    year: '2023',
  }),
  createAggregated({
    id: 'DE-2023',
    country: 'DE',
    countryName: 'Germany',
    year: '2023',
  }),
  createAggregated({
    id: 'ES-2022',
    country: 'ES',
    countryName: 'Spain',
    year: '2022',
  }),
];

describe('useVehicleTable', () => {
  describe('initial state', () => {
    it('returns empty filters by default', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));
      expect(result.current.filters).toEqual(EMPTY_FILTERS);
    });

    it('returns empty search query', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));
      expect(result.current.searchQuery).toBe('');
    });

    it('has no active filters', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));
      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.activeFilterCount).toBe(0);
    });

    it('returns all rows on the first page', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));
      const rows = result.current.table.getRowModel().rows;
      expect(rows).toHaveLength(4);
    });
  });

  describe('filter options', () => {
    it('derives sorted country options from data', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));
      const labels = result.current.countryOptions.map((o) => o.label);
      expect(labels).toEqual(['France', 'Germany', 'Spain']);
    });

    it('deduplicates countries', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));
      expect(result.current.countryOptions).toHaveLength(3);
    });

    it('derives year options sorted descending', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));
      const years = result.current.yearOptions.map((o) => o.value);
      expect(years).toEqual(['2023', '2022']);
    });
  });

  describe('column filters', () => {
    it('filters rows by country', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));

      act(() => {
        result.current.updateFilter('country', 'DE');
      });

      const rows = result.current.table.getRowModel().rows;
      expect(rows).toHaveLength(2);
      expect(rows.every((r) => r.original.country === 'DE')).toBe(true);
    });

    it('filters rows by year', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));

      act(() => {
        result.current.updateFilter('year', '2023');
      });

      const rows = result.current.table.getRowModel().rows;
      expect(rows).toHaveLength(2);
      expect(rows.every((r) => r.original.year === '2023')).toBe(true);
    });

    it('combines multiple filters', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));

      act(() => {
        result.current.updateFilter('country', 'DE');
        result.current.updateFilter('year', '2023');
      });

      const rows = result.current.table.getRowModel().rows;
      expect(rows).toHaveLength(1);
      expect(rows[0].original.countryName).toBe('Germany');
      expect(rows[0].original.year).toBe('2023');
    });

    it('removes a filter when set to "all"', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));

      act(() => {
        result.current.updateFilter('country', 'DE');
      });
      expect(result.current.table.getRowModel().rows).toHaveLength(2);

      act(() => {
        result.current.updateFilter('country', 'all');
      });
      expect(result.current.table.getRowModel().rows).toHaveLength(4);
    });

    it('tracks active filter count', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));

      act(() => {
        result.current.updateFilter('country', 'DE');
        result.current.updateFilter('year', '2022');
      });

      expect(result.current.activeFilterCount).toBe(2);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('clearFilters resets all column filters', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));

      act(() => {
        result.current.updateFilter('country', 'DE');
        result.current.updateFilter('year', '2022');
      });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.activeFilterCount).toBe(0);
      expect(result.current.filters).toEqual(EMPTY_FILTERS);
      expect(result.current.table.getRowModel().rows).toHaveLength(4);
    });

    it('uses exact match filtering (equalsString)', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));

      act(() => {
        result.current.updateFilter('country', 'D');
      });

      expect(result.current.table.getRowModel().rows).toHaveLength(0);
    });
  });

  describe('pagination', () => {
    const manyRecords = Array.from({ length: 50 }, (_, i) =>
      createAggregated({
        id: `C${i}-${2020 + (i % 3)}`,
        country: `C${i}`,
        countryName: `Country ${i}`,
        year: String(2020 + (i % 3)),
      })
    );

    it('paginates to DEFAULT_PAGE_SIZE rows per page', () => {
      const { result } = renderHook(() => useVehicleTable(manyRecords));
      expect(result.current.table.getRowModel().rows).toHaveLength(20);
    });

    it('reports correct page count', () => {
      const { result } = renderHook(() => useVehicleTable(manyRecords));
      expect(result.current.pagination.pageCount).toBe(3);
    });

    it('reports filteredTotal as total rows before pagination', () => {
      const { result } = renderHook(() => useVehicleTable(manyRecords));
      expect(result.current.pagination.filteredTotal).toBe(50);
    });

    it('navigates to next page', () => {
      const { result } = renderHook(() => useVehicleTable(manyRecords));

      act(() => {
        result.current.pagination.goToNextPage();
      });

      expect(result.current.pagination.pageIndex).toBe(1);
      expect(result.current.table.getRowModel().rows).toHaveLength(20);
    });

    it('navigates to last page with remaining rows', () => {
      const { result } = renderHook(() => useVehicleTable(manyRecords));

      act(() => {
        result.current.pagination.goToLastPage();
      });

      expect(result.current.pagination.pageIndex).toBe(2);
      expect(result.current.table.getRowModel().rows).toHaveLength(10);
    });

    it('changes page size', () => {
      const { result } = renderHook(() => useVehicleTable(manyRecords));

      act(() => {
        result.current.pagination.setPageSize(50);
      });

      expect(result.current.pagination.pageSize).toBe(50);
      expect(result.current.table.getRowModel().rows).toHaveLength(50);
      expect(result.current.pagination.pageCount).toBe(1);
    });

    it('reports canPreviousPage and canNextPage correctly', () => {
      const { result } = renderHook(() => useVehicleTable(manyRecords));

      expect(result.current.pagination.canPreviousPage).toBe(false);
      expect(result.current.pagination.canNextPage).toBe(true);

      act(() => {
        result.current.pagination.goToLastPage();
      });

      expect(result.current.pagination.canPreviousPage).toBe(true);
      expect(result.current.pagination.canNextPage).toBe(false);
    });
  });

  describe('sorting', () => {
    it('applies default multi-column sort (year desc, then country name)', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));
      const ids = result.current.table
        .getRowModel()
        .rows.map((r) => r.original.id);
      expect(ids).toEqual(['FR-2023', 'DE-2023', 'DE-2022', 'ES-2022']);
    });

    it('toggles year sort order via column toggle handler', () => {
      const { result } = renderHook(() => useVehicleTable(mockData));
      const yearColumn = result.current.table.getColumn('year');
      expect(yearColumn).toBeDefined();

      act(() => {
        yearColumn?.getToggleSortingHandler()?.({} as unknown as MouseEvent);
      });

      const idsAscYear = result.current.table
        .getRowModel()
        .rows.map((r) => r.original.id);
      expect(idsAscYear[0]).toMatch(/2022$/);
      expect(idsAscYear[idsAscYear.length - 1]).toMatch(/2023$/);
    });
  });
});
