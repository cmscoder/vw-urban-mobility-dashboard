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
  const sourceField = fields.find((f) => f.field === 'source');

  return (
    <TableRow>
      {fields
        .filter((config) => config.field !== 'source')
        .map((config) => (
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
      <TableHead className="text-right">Count</TableHead>
      <TableHead className="p-0">
        {sourceField && (
          <Select
            value={filters.source}
            onValueChange={(v) => onFilterChange('source', v)}
          >
            <SelectTrigger
              className={TRIGGER_CLASS}
              aria-label={sourceField.ariaLabel}
            >
              <SelectValue placeholder={sourceField.allLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{sourceField.allLabel}</SelectItem>
              {sourceField.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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
