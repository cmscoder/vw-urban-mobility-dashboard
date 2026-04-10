import { Eye } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCount } from '@/features/vehicles/utils';
import type { AggregatedRecord } from '@/features/vehicles/types';

interface VehicleTableRowProps {
  record: AggregatedRecord;
  onViewDetails: (record: AggregatedRecord) => void;
}

export function VehicleTableRow({
  record,
  onViewDetails,
}: VehicleTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{record.countryName}</TableCell>
      <TableCell>{record.year}</TableCell>
      <TableCell className="text-right">
        {formatCount(record.totalCount)}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          {record.recordCount} motor{' '}
          {record.recordCount === 1 ? 'type' : 'types'}
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => onViewDetails(record)}
          aria-label={`View details for ${record.countryName} ${record.year}`}
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </TableCell>
    </TableRow>
  );
}
