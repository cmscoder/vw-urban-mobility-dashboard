import { X } from 'lucide-react';
import { TableHead, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MOTOR_ENERGY_OPTIONS, SOURCE_OPTIONS } from '@/constants';
import type { FilterOption } from '@/hooks';
import type { VehicleFilters } from '@/types';

interface TableHeaderFiltersProps {
  filters: VehicleFilters;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  hasActiveFilters: boolean;
  onFilterChange: (field: keyof VehicleFilters, value: string) => void;
  onFiltersClear: () => void;
}

const TRIGGER_CLASS =
  'h-auto rounded-none border-0 bg-transparent px-4 py-3 text-xs font-medium shadow-none focus:ring-0';

export function TableHeaderFilters({
  filters,
  countryOptions,
  yearOptions,
  hasActiveFilters,
  onFilterChange,
  onFiltersClear,
}: TableHeaderFiltersProps) {
  return (
    <TableRow>
      <TableHead className="p-0">
        <Select
          value={filters.country}
          onValueChange={(v) => onFilterChange('country', v)}
        >
          <SelectTrigger
            className={TRIGGER_CLASS}
            aria-label="Filter by country"
          >
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Country</SelectItem>
            {countryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableHead>
      <TableHead className="p-0">
        <Select
          value={filters.year}
          onValueChange={(v) => onFilterChange('year', v)}
        >
          <SelectTrigger className={TRIGGER_CLASS} aria-label="Filter by year">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Year</SelectItem>
            {yearOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableHead>
      <TableHead className="p-0">
        <Select
          value={filters.motorEnergy}
          onValueChange={(v) => onFilterChange('motorEnergy', v)}
        >
          <SelectTrigger
            className={TRIGGER_CLASS}
            aria-label="Filter by motor energy type"
          >
            <SelectValue placeholder="Motor Energy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Motor Energy</SelectItem>
            {MOTOR_ENERGY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableHead>
      <TableHead className="text-right">Count</TableHead>
      <TableHead className="p-0">
        <Select
          value={filters.source}
          onValueChange={(v) => onFilterChange('source', v)}
        >
          <SelectTrigger
            className={TRIGGER_CLASS}
            aria-label="Filter by source"
          >
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Source</SelectItem>
            {SOURCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableHead>
      <TableHead className="w-[60px]">
        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onFiltersClear}
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <span className="sr-only">Actions</span>
        )}
      </TableHead>
    </TableRow>
  );
}
