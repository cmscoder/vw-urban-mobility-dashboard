import { useId, useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Table } from '@tanstack/react-table';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import {
  buildVehicleFilterFields,
  VEHICLE_GEO_YEAR_FILTER_FIELDS,
  AGGREGATED_TABLE_SORT_PRESETS,
  matchAggregatedTableSortPresetValue,
  type VehicleFilterFieldConfig,
} from '@/features/vehicles/constants';
import type {
  AggregatedRecord,
  FilterOption,
  VehicleFilters,
  VehicleFilterChangeHandler,
} from '@/features/vehicles/types';

interface MobileFiltersProps {
  table?: Table<AggregatedRecord>;
  filters: VehicleFilters;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  activeFilterCount: number;
  onFilterChange: VehicleFilterChangeHandler;
  onFiltersClear: () => void;
}

interface MobileFilterFieldProps {
  config: VehicleFilterFieldConfig;
  value: string;
  onChange: VehicleFilterChangeHandler;
}

function MobileFilterField({
  config,
  value,
  onChange,
}: MobileFilterFieldProps) {
  const triggerId = useId();

  return (
    <div className="space-y-1.5">
      <Label htmlFor={triggerId} className="text-sm font-medium">
        {config.label}
      </Label>
      <Select value={value} onValueChange={(v) => onChange(config.field, v)}>
        <SelectTrigger id={triggerId} aria-label={config.ariaLabel}>
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
    </div>
  );
}

export function MobileFilters({
  table,
  filters,
  countryOptions,
  yearOptions,
  activeFilterCount,
  onFilterChange,
  onFiltersClear,
}: MobileFiltersProps) {
  const [open, setOpen] = useState(false);
  const sortTriggerId = useId();

  const filterFields = useMemo(
    () =>
      buildVehicleFilterFields(countryOptions, yearOptions, 'mobile').filter(
        (f) => VEHICLE_GEO_YEAR_FILTER_FIELDS.includes(f.field)
      ),
    [countryOptions, yearOptions]
  );

  const sortSelectValue = table
    ? matchAggregatedTableSortPresetValue(table.getState().sorting)
    : AGGREGATED_TABLE_SORT_PRESETS[0].value;

  const handleSortChange = (value: string) => {
    if (!table) return;
    const preset = AGGREGATED_TABLE_SORT_PRESETS.find((p) => p.value === value);
    if (!preset) return;
    table.setSorting(preset.sorting);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={(e) => e.currentTarget.blur()}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 ? (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {activeFilterCount}
            </Badge>
          ) : null}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters & sort</DrawerTitle>
          <DrawerDescription>
            Narrow down and order the vehicle records.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 px-4">
          {table ? (
            <div className="space-y-1.5">
              <Label htmlFor={sortTriggerId} className="text-sm font-medium">
                Sort by
              </Label>
              <Select value={sortSelectValue} onValueChange={handleSortChange}>
                <SelectTrigger id={sortTriggerId} aria-label="Sort by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGGREGATED_TABLE_SORT_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {filterFields.map((config) => (
            <MobileFilterField
              key={config.field}
              config={config}
              value={filters[config.field]}
              onChange={onFilterChange}
            />
          ))}
        </div>

        <DrawerFooter>
          {activeFilterCount > 0 ? (
            <Button variant="outline" onClick={onFiltersClear}>
              <X className="mr-2 h-4 w-4" />
              Clear all filters
            </Button>
          ) : null}
          <DrawerClose asChild>
            <Button>Show results</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
