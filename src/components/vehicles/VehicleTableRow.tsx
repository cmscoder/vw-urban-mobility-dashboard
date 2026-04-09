import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SourceBadge } from '@/components/vehicles/SourceBadge';
import { formatCount } from '@/utils';
import type { VehicleRecord } from '@/types';

interface VehicleTableRowProps {
  record: VehicleRecord;
  onEdit: (record: VehicleRecord) => void;
  onDelete: (record: VehicleRecord) => void;
}

export function VehicleTableRow({
  record,
  onEdit,
  onDelete,
}: VehicleTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{record.countryName}</TableCell>
      <TableCell>{record.year}</TableCell>
      <TableCell>{record.motorEnergyName}</TableCell>
      <TableCell className="text-right">{formatCount(record.count)}</TableCell>
      <TableCell>
        <SourceBadge source={record.source} />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(record)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(record)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
