import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SourceBadge } from '@/components/vehicles/SourceBadge';
import { formatCount } from '@/utils';
import type { VehicleRecord } from '@/types';

interface VehicleCardProps {
  record: VehicleRecord;
  onEdit: (record: VehicleRecord) => void;
  onDelete: (record: VehicleRecord) => void;
}

export function VehicleCard({ record, onEdit, onDelete }: VehicleCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-medium leading-none">{record.countryName}</p>
            <p className="text-xs text-muted-foreground">{record.country}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(record)}
              aria-label={`Edit ${record.countryName}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(record)}
              aria-label={`Delete ${record.countryName}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Year</p>
            <p>{record.year}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Motor Energy</p>
            <p className="truncate">{record.motorEnergyName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Count</p>
            <p className="font-medium">{formatCount(record.count)}</p>
          </div>
        </div>

        <div className="mt-3">
          <SourceBadge source={record.source} />
        </div>
      </CardContent>
    </Card>
  );
}
