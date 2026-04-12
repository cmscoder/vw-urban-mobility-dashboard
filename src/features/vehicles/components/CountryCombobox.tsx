import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { COUNTRIES } from '@/features/vehicles/constants';

interface CountryComboboxProps {
  value: string;
  onChange: (code: string, name: string) => void;
  disabled?: boolean;
}

/**
 * Searchable country selector with emoji flags.
 * Uses Shadcn's Combobox pattern (Popover + Command) to let the user
 * search and pick a country. On selection it emits both the ISO code
 * and the full country name so the form gets both in one action.
 */
export function CountryCombobox({
  value,
  onChange,
  disabled = false,
}: CountryComboboxProps) {
  const [open, setOpen] = useState(false);

  const selected = COUNTRIES.find((c) => c.code === value);

  return (
    <div className="space-y-2">
      <Label>Country</Label>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select country"
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            {selected ? (
              <span className="truncate">
                {selected.flag} {selected.name} ({selected.code})
              </span>
            ) : (
              <span className="text-muted-foreground">Select country…</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search country…" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {COUNTRIES.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.code}`}
                    onSelect={() => {
                      onChange(country.code, country.name);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === country.code ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {country.flag} {country.name} ({country.code})
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
