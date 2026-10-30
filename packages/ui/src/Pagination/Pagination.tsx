import { forwardRef, type HTMLAttributes } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@ds/icons';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { cx } from '../utils/cx';
import { usePagination } from './usePagination';

export interface PaginationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'defaultValue' | 'onChange'
> {
  /** Current page (1-based) for controlled use. */
  page?: number;
  /** Initial page for uncontrolled use. @default 1 */
  defaultPage?: number;
  /** Called with the new page number when the user picks another page. */
  onPageChange?: (page: number) => void;
  /** Total number of pages. Values below 1 are treated as 1. */
  pageCount: number;
  /** Pages shown on each side of the current page. @default 1 */
  siblingCount?: number;
  /** Size of the buttons. @default "md" */
  size?: 'sm' | 'md';
  /** Accessible name of the navigation landmark. @default "Pagination" */
  label?: string;
  /** Accessible name of the previous button. @default "Previous page" */
  previousLabel?: string;
  /** Accessible name of the next button. @default "Next page" */
  nextLabel?: string;
  /** Accessible name of a page button. @default (page) => `Page ${page}` */
  getPageLabel?: (page: number) => string;
}

type Entry = number | 'start-dots' | 'end-dots';

function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
}

/** Pages to show: first, last, current and `siblings` on each side, with dots for the gaps. */
function getEntries(page: number, count: number, siblings: number): Entry[] {
  const slots = siblings * 2 + 5;
  if (count <= slots) return range(1, count);
  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, count);
  const dotsLeft = left > 2;
  const dotsRight = right < count - 1;
  if (!dotsLeft) return [...range(1, slots - 2), 'end-dots', count];
  if (!dotsRight) return [1, 'start-dots', ...range(count - (slots - 3), count)];
  return [1, 'start-dots', ...range(left, right), 'end-dots', count];
}

/**
 * Page navigation: a `<nav>` with a list of buttons for the previous page, the pages and
 * the next page. With many pages it shows the first, the last, the current one and
 * `siblingCount` on each side, with ellipses in the gaps (for example `1 … 4 5 6 … 20`).
 *
 * @example
 * <Pagination pageCount={20} defaultPage={5} onPageChange={setPage} />
 *
 * Accessibility: the current page has `aria-current="page"`. Intentional exception to the
 * `disabled` of `Button` (which takes the element out of the Tab order): on the first page
 * "previous" and on the last page "next" use `aria-disabled="true"` and `data-disabled`,
 * without the `disabled` attribute and without `tabIndex={-1}`. The button stays focusable and
 * the click is blocked. Someone using the keyboard presses "next" until the last page and the
 * focused button becomes disabled; if it left the Tab order the focus would be lost.
 * The ellipses are `aria-hidden` and not focusable.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    pageCount: pageCountProp,
    siblingCount = 1,
    size = 'md',
    label = 'Pagination',
    previousLabel = 'Previous page',
    nextLabel = 'Next page',
    getPageLabel = (n) => `Page ${n}`,
    className,
    ...props
  },
  ref,
) {
  const safeCount = Number.isFinite(pageCountProp) ? Math.max(1, Math.floor(pageCountProp)) : 1;
  const siblings = Number.isFinite(siblingCount) ? Math.max(0, Math.floor(siblingCount)) : 1;
  // One item per page: the hook already handles clamping and controlled/uncontrolled state.
  const { page, pageCount, setPage, next, previous, canNext, canPrevious } = usePagination({
    totalItems: safeCount,
    pageSize: 1,
    page: pageProp,
    defaultPage,
    onPageChange,
  });
  const entries = getEntries(page, pageCount, siblings);

  return (
    <nav
      ref={ref}
      aria-label={label}
      className={cx('ds-pagination', className)}
      data-size={size}
      {...props}
    >
      <ul className="ds-pagination__list">
        <li className="ds-pagination__item">
          <IconButton
            className="ds-pagination__button"
            variant="ghost"
            size={size}
            aria-label={previousLabel}
            aria-disabled={canPrevious ? undefined : true}
            data-disabled={canPrevious ? undefined : ''}
            icon={<ChevronLeftIcon />}
            onClick={() => {
              if (canPrevious) previous();
            }}
          />
        </li>
        {entries.map((entry) =>
          typeof entry === 'number' ? (
            <li key={entry} className="ds-pagination__item">
              <Button
                className="ds-pagination__button"
                variant={entry === page ? 'primary' : 'ghost'}
                size={size}
                aria-label={getPageLabel(entry)}
                aria-current={entry === page ? 'page' : undefined}
                onClick={() => setPage(entry)}
              >
                {entry}
              </Button>
            </li>
          ) : (
            <li key={entry} className="ds-pagination__item" aria-hidden="true">
              <span className="ds-pagination__ellipsis">…</span>
            </li>
          ),
        )}
        <li className="ds-pagination__item">
          <IconButton
            className="ds-pagination__button"
            variant="ghost"
            size={size}
            aria-label={nextLabel}
            aria-disabled={canNext ? undefined : true}
            data-disabled={canNext ? undefined : ''}
            icon={<ChevronRightIcon />}
            onClick={() => {
              if (canNext) next();
            }}
          />
        </li>
      </ul>
    </nav>
  );
});

Pagination.displayName = 'Pagination';
