import { useCallback, useState } from 'react';

export interface UsePaginationOptions {
  /** Total number of items to paginate. Negative or fractional values are normalised. */
  totalItems: number;
  /** Items per page. Values below 1 are treated as 1. */
  pageSize: number;
  /** Current page (1-based) for controlled use. */
  page?: number;
  /** Initial page (1-based) for uncontrolled use. @default 1 */
  defaultPage?: number;
  /** Called with the new page whenever the page changes through `setPage`, `next` or `previous`. */
  onPageChange?: (page: number) => void;
}

export interface UsePaginationResult {
  /** Current page, always inside `[1, pageCount]`. */
  page: number;
  /** Number of pages; at least 1, even with no items. */
  pageCount: number;
  /** Index of the first item of the page (inclusive, 0-based). */
  startIndex: number;
  /** Index after the last item of the page (exclusive), so `items.slice(startIndex, endIndex)` works. */
  endIndex: number;
  /** Go to a page; the value is limited to `[1, pageCount]`. */
  setPage: (page: number) => void;
  next: () => void;
  previous: () => void;
  canNext: boolean;
  canPrevious: boolean;
}

function clamp(value: number, max: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(Math.floor(value), 1), max);
}

/**
 * Computes the page range and the item range of a paginated list. Works controlled
 * (`page`) or uncontrolled (`defaultPage`). When `totalItems` shrinks and the current page
 * no longer exists, the page is corrected: an uncontrolled page is updated, a controlled one
 * is only limited in the returned value (the consumer owns the state).
 *
 * @example
 * const { page, startIndex, endIndex, setPage } = usePagination({ totalItems: 95, pageSize: 10 });
 * const visible = items.slice(startIndex, endIndex);
 */
export function usePagination({
  totalItems,
  pageSize,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
}: UsePaginationOptions): UsePaginationResult {
  const total = Number.isFinite(totalItems) ? Math.max(0, Math.floor(totalItems)) : 0;
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 1;
  const pageCount = Math.max(1, Math.ceil(total / size));

  const isControlled = pageProp !== undefined;
  const [innerPage, setInnerPage] = useState(defaultPage);
  const page = clamp(isControlled ? pageProp : innerPage, pageCount);

  // Correct the stored page during render (React re-renders at once) when totalItems shrinks.
  if (!isControlled && innerPage !== page) setInnerPage(page);

  const setPage = useCallback(
    (next: number) => {
      const target = clamp(next, pageCount);
      if (target === page) return;
      if (!isControlled) setInnerPage(target);
      onPageChange?.(target);
    },
    [isControlled, onPageChange, page, pageCount],
  );

  const startIndex = Math.min((page - 1) * size, total);
  const endIndex = Math.min(startIndex + size, total);

  return {
    page,
    pageCount,
    startIndex,
    endIndex,
    setPage,
    next: () => setPage(page + 1),
    previous: () => setPage(page - 1),
    canNext: page < pageCount,
    canPrevious: page > 1,
  };
}
