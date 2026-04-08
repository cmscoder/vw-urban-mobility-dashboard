import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormTextFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  maxLength?: number;
}

export function FormTextField({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  maxLength,
}: FormTextFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-required="true"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
