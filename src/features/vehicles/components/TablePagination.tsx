import { useId } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { PAGE_SIZE_OPTIONS } from '@/features/vehicles/constants';
import type { PaginationInfo } from '@/features/vehicles/types';

interface TablePaginationProps {
  pagination: PaginationInfo;
}

export function TablePagination({ pagination }: TablePaginationProps) {
  const pageSizeSelectId = useId();
  const {
    pageIndex,
    pageSize,
    filteredTotal,
    canPreviousPage,
    canNextPage,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    setPageSize,
  } = pagination;

  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, filteredTotal);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Page size selector — desktop only */}
      <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
        <Label htmlFor={pageSizeSelectId}>Rows per page</Label>
        <Select
          value={String(pageSize)}
          onValueChange={(v) => setPageSize(Number(v))}
        >
          <SelectTrigger id={pageSizeSelectId} className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
        <span className="text-sm text-muted-foreground">
          {filteredTotal === 0
            ? '0 results'
            : `${from}–${to} of ${filteredTotal}`}
        </span>

        <div className="flex items-center gap-1.5 sm:gap-1">
          {/* First / Last — desktop only (reduces fat-finger errors on mobile) */}
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 sm:inline-flex"
            onClick={goToFirstPage}
            disabled={!canPreviousPage}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 sm:h-8 sm:w-8"
            onClick={goToPreviousPage}
            disabled={!canPreviousPage}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 sm:h-8 sm:w-8"
            onClick={goToNextPage}
            disabled={!canNextPage}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden h-8 w-8 sm:inline-flex"
            onClick={goToLastPage}
            disabled={!canNextPage}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
