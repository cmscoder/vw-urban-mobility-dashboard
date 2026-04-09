import { Badge } from '@/components/ui/badge';
import type { VehicleRecord } from '@/types';

export function SourceBadge({ source }: { source: VehicleRecord['source'] }) {
  return source === 'eurostat' ? (
    <Badge variant="secondary">Eurostat</Badge>
  ) : (
    <Badge variant="outline">Local</Badge>
  );
}
