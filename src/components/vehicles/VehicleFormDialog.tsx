import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { VehicleFormData, VehicleRecord } from '@/types';
import { MOTOR_ENERGY_OPTIONS } from '@/constants';

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VehicleFormData) => void;
  record?: VehicleRecord | null;
}

const EMPTY_FORM: VehicleFormData = {
  country: '',
  countryName: '',
  year: '',
  motorEnergy: '',
  motorEnergyName: '',
  count: null,
};

function buildFormFromRecord(record: VehicleRecord): VehicleFormData {
  return {
    country: record.country,
    countryName: record.countryName,
    year: record.year,
    motorEnergy: record.motorEnergy,
    motorEnergyName: record.motorEnergyName,
    count: record.count,
  };
}

export function VehicleFormDialog({
  open,
  onOpenChange,
  onSubmit,
  record,
}: VehicleFormDialogProps) {
  const isEditing = !!record;
  const [form, setForm] = useState<VehicleFormData>(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setForm(record ? buildFormFromRecord(record) : EMPTY_FORM);
    }
  }, [open, record]);

  function handleEnergyChange(value: string) {
    const option = MOTOR_ENERGY_OPTIONS.find((o) => o.value === value);
    setForm((prev) => ({
      ...prev,
      motorEnergy: value,
      motorEnergyName: option?.label ?? value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    onOpenChange(false);
  }

  const isValid =
    form.country.trim() !== '' &&
    form.countryName.trim() !== '' &&
    form.year.trim() !== '' &&
    form.motorEnergy !== '' &&
    form.count !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Record' : 'Add New Record'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the vehicle registration data below.'
              : 'Fill in the details to add a new vehicle registration record.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="countryCode">Country Code</Label>
              <Input
                id="countryCode"
                placeholder="DE"
                maxLength={2}
                aria-required="true"
                value={form.country}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    country: e.target.value.toUpperCase(),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countryName">Country Name</Label>
              <Input
                id="countryName"
                placeholder="Germany"
                aria-required="true"
                value={form.countryName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, countryName: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                placeholder="2024"
                maxLength={4}
                aria-required="true"
                value={form.year}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, year: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Vehicle Count</Label>
              <Input
                id="count"
                type="number"
                placeholder="0"
                aria-required="true"
                value={form.count ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    count: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motorEnergy">Motor Energy</Label>
            <Select value={form.motorEnergy} onValueChange={handleEnergyChange}>
              <SelectTrigger id="motorEnergy" aria-required="true">
                <SelectValue placeholder="Select energy type" />
              </SelectTrigger>
              <SelectContent>
                {MOTOR_ENERGY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              {isEditing ? 'Save Changes' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
