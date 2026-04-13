import { Eye } from 'lucide-react';

import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  formatCount,
  formatMotorTypeCountLabel,
  viewDetailsAriaLabel,
} from '@/features/vehicles/utils';
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
          {formatMotorTypeCountLabel(record.recordCount)}
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => onViewDetails(record)}
          aria-label={viewDetailsAriaLabel(record)}
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </TableCell>
    </TableRow>
  );
}
