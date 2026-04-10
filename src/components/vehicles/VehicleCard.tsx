import { Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCount } from '@/utils';
import type { AggregatedRecord } from '@/types';

interface VehicleCardProps {
  record: AggregatedRecord;
  onViewDetails: (record: AggregatedRecord) => void;
}

export function VehicleCard({ record, onViewDetails }: VehicleCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-medium leading-none">{record.countryName}</p>
            <p className="text-xs text-muted-foreground">{record.country}</p>
          </div>
          <Badge variant="secondary">
            {record.recordCount} motor{' '}
            {record.recordCount === 1 ? 'type' : 'types'}
          </Badge>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Year</p>
            <p>{record.year}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Vehicles</p>
            <p className="font-medium">{formatCount(record.totalCount)}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full gap-1.5"
          onClick={() => onViewDetails(record)}
          aria-label={`View details for ${record.countryName} ${record.year}`}
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
