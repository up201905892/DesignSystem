import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

/** The active sort: one column and a direction, or `null` for the original order. */
export interface TableSortState {
  columnId: string;
  direction: SortDirection;
}

export interface TableSortColumn<T> {
  /** Unique id of the column; also the default key read from each row. */
  id: string;
  /** Read the value to sort by. Defaults to `row[id]`. */
  accessor?: (row: T) => unknown;
  /** Own comparison, ascending. The direction is applied by the hook. */
  compare?: (a: T, b: T) => number;
}

export interface UseTableSortOptions<T> {
  data: readonly T[];
  columns: readonly TableSortColumn<T>[];
  /** Controlled sort state. Use together with `onSortChange`. */
  sort?: TableSortState | null;
  /** Initial sort state when uncontrolled. */
  defaultSort?: TableSortState | null;
  onSortChange?: (sort: TableSortState | null) => void;
}

export interface TableSortProps {
  sortable: true;
  sortDirection: 'asc' | 'desc' | 'none';
  onSort: () => void;
}

export interface UseTableSortResult<T> {
  /** A sorted copy of `data`; `data` itself is never changed. */
  sortedData: T[];
  sort: TableSortState | null;
  /** Props to spread on the `TableHeaderCell` of the column. */
  getSortProps: (columnId: string) => TableSortProps;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

function defaultCompare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return collator.compare(String(a), String(b));
}

/**
 * Manage the sort state of a table and sort its data. Activating a column cycles
 * ascending, descending, then no sort; only one column is sorted at a time.
 * Numbers sort by value, strings with `localeCompare` (numeric, case-insensitive),
 * dates by time; `null` and `undefined` always go last. The sort is stable.
 *
 * @example
 * const { sortedData, getSortProps } = useTableSort({ data, columns: [{ id: 'name' }] });
 * <TableHeaderCell {...getSortProps('name')}>Name</TableHeaderCell>
 */
export function useTableSort<T>({
  data,
  columns,
  sort: controlledSort,
  defaultSort = null,
  onSortChange,
}: UseTableSortOptions<T>): UseTableSortResult<T> {
  const [internalSort, setInternalSort] = useState<TableSortState | null>(defaultSort);
  const isControlled = controlledSort !== undefined;
  const sort = isControlled ? controlledSort : internalSort;

  const setSort = useCallback(
    (next: TableSortState | null) => {
      if (!isControlled) setInternalSort(next);
      onSortChange?.(next);
    },
    [isControlled, onSortChange],
  );

  const sortedData = useMemo(() => {
    const copy = [...data];
    if (!sort) return copy;
    const column = columns.find((c) => c.id === sort.columnId);
    if (!column) return copy;
    const factor = sort.direction === 'asc' ? 1 : -1;
    const read =
      column.accessor ?? ((row: T) => (row as Record<string, unknown> | null)?.[column.id]);
    // Array.prototype.sort is stable, so equal elements keep their original order.
    return copy.sort((a, b) => {
      if (column.compare) return factor * column.compare(a, b);
      const va = read(a);
      const vb = read(b);
      if (isNil(va) || isNil(vb)) return Number(isNil(va)) - Number(isNil(vb));
      return factor * defaultCompare(va, vb);
    });
  }, [data, columns, sort]);

  const getSortProps = useCallback(
    (columnId: string): TableSortProps => {
      const direction = sort?.columnId === columnId ? sort.direction : 'none';
      return {
        sortable: true,
        sortDirection: direction,
        onSort: () => {
          if (direction === 'none') setSort({ columnId, direction: 'asc' });
          else if (direction === 'asc') setSort({ columnId, direction: 'desc' });
          else setSort(null);
        },
      };
    },
    [sort, setSort],
  );

  return { sortedData, sort, getSortProps };
}
