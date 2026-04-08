import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
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
import { MOTOR_ENERGY_OPTIONS, SOURCE_OPTIONS } from '@/constants';
import type { FilterOption } from '@/hooks';
import type { VehicleFilters } from '@/types';

interface MobileFiltersProps {
  filters: VehicleFilters;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  activeFilterCount: number;
  onFilterChange: (field: keyof VehicleFilters, value: string) => void;
  onFiltersClear: () => void;
}

export function MobileFilters({
  filters,
  countryOptions,
  yearOptions,
  activeFilterCount,
  onFilterChange,
  onFiltersClear,
}: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>
            Narrow down the vehicle records.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 px-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Country</label>
            <Select
              value={filters.country}
              onValueChange={(v) => onFilterChange('country', v)}
            >
              <SelectTrigger aria-label="Filter by country">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Year</label>
            <Select
              value={filters.year}
              onValueChange={(v) => onFilterChange('year', v)}
            >
              <SelectTrigger aria-label="Filter by year">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Motor Energy</label>
            <Select
              value={filters.motorEnergy}
              onValueChange={(v) => onFilterChange('motorEnergy', v)}
            >
              <SelectTrigger aria-label="Filter by motor energy">
                <SelectValue placeholder="All Energy Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Energy Types</SelectItem>
                {MOTOR_ENERGY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Source</label>
            <Select
              value={filters.source}
              onValueChange={(v) => onFilterChange('source', v)}
            >
              <SelectTrigger aria-label="Filter by source">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {SOURCE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter>
          {activeFilterCount > 0 && (
            <Button variant="outline" onClick={onFiltersClear}>
              <X className="mr-2 h-4 w-4" />
              Clear all filters
            </Button>
          )}
          <DrawerClose asChild>
            <Button>Show results</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
