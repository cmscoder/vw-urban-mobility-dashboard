import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { VehicleRecord } from '@/types';

interface VehicleTableProps {
  vehicles: VehicleRecord[];
  isLoading: boolean;
  onEdit: (record: VehicleRecord) => void;
  onDelete: (record: VehicleRecord) => void;
}

function formatCount(count: number | null): string {
  if (count === null) return '—';
  return count.toLocaleString('en-US');
}

function SourceBadge({ source }: { source: VehicleRecord['source'] }) {
  return source === 'eurostat' ? (
    <Badge variant="secondary">Eurostat</Badge>
  ) : (
    <Badge variant="outline">Local</Badge>
  );
}

function TableSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 6 }).map((_, j) => (
        <TableCell key={j}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function VehicleTable({
  vehicles,
  isLoading,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Motor Energy</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="w-[60px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No records found.
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {record.countryName}
                </TableCell>
                <TableCell>{record.year}</TableCell>
                <TableCell>{record.motorEnergyName}</TableCell>
                <TableCell className="text-right">
                  {formatCount(record.count)}
                </TableCell>
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
