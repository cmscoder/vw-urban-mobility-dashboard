import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MOTOR_ENERGY_OPTIONS } from '@/features/vehicles/constants';

interface MotorEnergySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function MotorEnergySelect({ value, onChange }: MotorEnergySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="motorEnergy">Motor Energy</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
}
