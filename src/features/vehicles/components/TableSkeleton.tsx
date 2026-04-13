import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  count?: number;
  columnsCount?: number;
}

export function TableSkeleton({
  count = 8,
  columnsCount = 6,
}: TableSkeletonProps) {
  return (
    <>
      {[...Array(count).keys()].map((rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(columnsCount).keys()].map((columnIndex) => (
            <TableCell key={columnIndex}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
