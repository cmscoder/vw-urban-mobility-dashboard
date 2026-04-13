/**
 * View-model from `useVehicleTable` for `TablePagination`.
 * Indices are **0-based**. With the current hook, `pageCount` is at least 1 even when
 * `filteredTotal` is 0. Navigation delegates to TanStack Table (`setPageIndex`, etc.).
 */
export interface PaginationInfo {
  /** Current page, zero-based. */
  pageIndex: number;
  /** Rows per page. */
  pageSize: number;
  /** Total pages given `filteredTotal` and `pageSize` (hook uses `Math.max(1, ceil(...))`). */
  pageCount: number;
  /** Row count after filters, before slicing to the current page. */
  filteredTotal: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  goToFirstPage: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  setPageSize: (size: number) => void;
}
