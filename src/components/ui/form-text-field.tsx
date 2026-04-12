import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Reusable form field that composes a Label + Input with consistent
 * spacing, aria-required, and optional disabled state for locked fields.
 */
interface FormTextFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  maxLength?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function FormTextField({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  maxLength,
  min,
  max,
  disabled,
}: FormTextFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        max={max}
        aria-required="true"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
