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
import { buildVehicleFilterFields } from '@/constants';
import type { VehicleFilters, FilterOption } from '@/types';

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
  const fields = buildVehicleFilterFields(
    countryOptions,
    yearOptions,
    'desktop'
  );
  const visibleFilters = fields.filter(
    (f) => f.field === 'country' || f.field === 'year'
  );

  return (
    <TableRow>
      {visibleFilters.map((config) => (
        <TableHead key={config.field} className="p-0">
          <Select
            value={filters[config.field]}
            onValueChange={(v) => onFilterChange(config.field, v)}
          >
            <SelectTrigger
              className={TRIGGER_CLASS}
              aria-label={config.ariaLabel}
            >
              <SelectValue placeholder={config.allLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{config.allLabel}</SelectItem>
              {config.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableHead>
      ))}
      <TableHead className="px-4 py-3 text-right text-xs font-medium">
        Total Count
      </TableHead>
      <TableHead className="px-4 py-3 text-xs font-medium">
        Motor Types
      </TableHead>
      <TableHead className="w-[120px]">
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
