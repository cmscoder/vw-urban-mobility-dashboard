import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from 'lucide-react';
import type { Table } from '@tanstack/react-table';

import { TableHead, TableRow } from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { cycleAggregatedColumnSort } from '@/features/vehicles/utils';
import type {
  AggregatedRecord,
  FilterOption,
  VehicleFilters,
  VehicleFilterChangeHandler,
} from '@/features/vehicles/types';

interface TableHeaderFiltersProps {
  table?: Table<AggregatedRecord>;
  filters: VehicleFilters;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  onFilterChange: VehicleFilterChangeHandler;
}

function ColumnSortButton({
  table,
  columnId,
  label,
}: {
  table: Table<AggregatedRecord>;
  columnId: string;
  label: string;
}) {
  const column = table.getColumn(columnId);
  if (!column?.getCanSort()) return null;

  const sorted = column.getIsSorted();
  const sortLabel =
    sorted === 'asc'
      ? `${label}, sorted ascending`
      : sorted === 'desc'
        ? `${label}, sorted descending`
        : `Sort by ${label}`;

  return (
    <button
      type="button"
      onClick={() => cycleAggregatedColumnSort(table, columnId)}
      className="inline-flex shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
      aria-label={sortLabel}
    >
      {sorted === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5" aria-hidden />
      ) : sorted === 'desc' ? (
        <ArrowDown className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
      )}
    </button>
  );
}

function filterMenuItemClass(selected: boolean) {
  return cn(
    'flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-left',
    selected
      ? 'bg-accent font-medium text-accent-foreground'
      : 'text-foreground hover:bg-accent'
  );
}

function ColumnFilterPopover({
  field,
  filterAriaLabel,
  resetLabel,
  options,
  value,
  onFilterChange,
}: {
  field: keyof VehicleFilters;
  filterAriaLabel: string;
  resetLabel: string;
  options: FilterOption[];
  value: string;
  onFilterChange: VehicleFilterChangeHandler;
}) {
  const [open, setOpen] = useState(false);
  const isActive = value !== 'all';

  const closeAndSet = (next: string) => {
    onFilterChange(field, next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative inline-flex shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={filterAriaLabel}
        >
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5',
              isActive ? 'text-primary' : 'opacity-70'
            )}
            aria-hidden
          />
          {isActive ? (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="start">
        <ul
          className="max-h-64 list-none space-y-0 overflow-y-auto p-0"
          role="list"
        >
          <li>
            <button
              type="button"
              className={filterMenuItemClass(!isActive)}
              onClick={() => closeAndSet('all')}
            >
              {resetLabel}
            </button>
          </li>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={filterMenuItemClass(value === opt.value)}
                onClick={() => closeAndSet(opt.value)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function SortableFilterableHeader({
  table,
  sortColumnId,
  label,
  align = 'left',
  filter,
}: {
  table?: Table<AggregatedRecord>;
  sortColumnId: string;
  label: string;
  align?: 'left' | 'right';
  filter?: {
    field: keyof VehicleFilters;
    filterAriaLabel: string;
    resetLabel: string;
    options: FilterOption[];
    value: string;
    onFilterChange: VehicleFilterChangeHandler;
  };
}) {
  const justify = align === 'right' ? 'justify-end' : '';
  return (
    <div className={cn('flex items-center gap-1', justify)}>
      <span>{label}</span>
      {table ? (
        <ColumnSortButton table={table} columnId={sortColumnId} label={label} />
      ) : null}
      {filter ? (
        <ColumnFilterPopover
          field={filter.field}
          filterAriaLabel={filter.filterAriaLabel}
          resetLabel={filter.resetLabel}
          options={filter.options}
          value={filter.value}
          onFilterChange={filter.onFilterChange}
        />
      ) : null}
    </div>
  );
}

export function TableHeaderFilters({
  table,
  filters,
  countryOptions,
  yearOptions,
  onFilterChange,
}: TableHeaderFiltersProps) {
  return (
    <TableRow>
      <TableHead scope="col" className="px-4 py-3 text-xs font-medium">
        <SortableFilterableHeader
          table={table}
          sortColumnId="countryName"
          label="Country"
          filter={{
            field: 'country',
            filterAriaLabel: 'Filter by country',
            resetLabel: 'All countries',
            options: countryOptions,
            value: filters.country,
            onFilterChange,
          }}
        />
      </TableHead>
      <TableHead scope="col" className="px-4 py-3 text-xs font-medium">
        <SortableFilterableHeader
          table={table}
          sortColumnId="year"
          label="Year"
          filter={{
            field: 'year',
            filterAriaLabel: 'Filter by year',
            resetLabel: 'All years',
            options: yearOptions,
            value: filters.year,
            onFilterChange,
          }}
        />
      </TableHead>
      <TableHead
        scope="col"
        className="px-4 py-3 text-right text-xs font-medium"
      >
        <SortableFilterableHeader
          table={table}
          sortColumnId="totalCount"
          label="Total Count"
          align="right"
        />
      </TableHead>
      <TableHead scope="col" className="px-4 py-3 text-xs font-medium">
        <SortableFilterableHeader
          table={table}
          sortColumnId="recordCount"
          label="Motor Types"
        />
      </TableHead>
      <TableHead scope="col" className="w-[120px] px-4 py-3 align-middle">
        <span className="sr-only">Actions</span>
      </TableHead>
    </TableRow>
  );
}
