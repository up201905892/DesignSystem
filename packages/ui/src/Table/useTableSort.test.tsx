import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTableSort, type TableSortColumn, type UseTableSortOptions } from './useTableSort';

interface Row {
  name: string | null | undefined;
  n?: number | null;
  date?: Date | null;
  tag?: string;
}

const col = (id: string, extra: Partial<TableSortColumn<Row>> = {}): TableSortColumn<Row> => ({
  id,
  ...extra,
});

function setup(
  data: Row[],
  columns: TableSortColumn<Row>[] = [col('name'), col('n'), col('date')],
  options: Partial<UseTableSortOptions<Row>> = {},
) {
  return renderHook((props: Partial<UseTableSortOptions<Row>>) =>
    useTableSort<Row>({ data, columns, ...options, ...props }),
  );
}

const names = (rows: Row[]) => rows.map((r) => r.name);

describe('useTableSort', () => {
  it('starts unsorted with a copy of the data', () => {
    const data = [{ name: 'b' }, { name: 'a' }];
    const { result } = setup(data);
    expect(result.current.sort).toBeNull();
    expect(names(result.current.sortedData)).toEqual(['b', 'a']);
    expect(result.current.sortedData).not.toBe(data);
    expect(result.current.getSortProps('name').sortDirection).toBe('none');
  });

  it('cycles asc, desc, none', () => {
    const { result } = setup([{ name: 'b' }, { name: 'c' }, { name: 'a' }]);
    act(() => result.current.getSortProps('name').onSort());
    expect(result.current.sort).toEqual({ columnId: 'name', direction: 'asc' });
    expect(names(result.current.sortedData)).toEqual(['a', 'b', 'c']);
    expect(result.current.getSortProps('name').sortDirection).toBe('asc');

    act(() => result.current.getSortProps('name').onSort());
    expect(result.current.sort).toEqual({ columnId: 'name', direction: 'desc' });
    expect(names(result.current.sortedData)).toEqual(['c', 'b', 'a']);

    act(() => result.current.getSortProps('name').onSort());
    expect(result.current.sort).toBeNull();
    expect(names(result.current.sortedData)).toEqual(['b', 'c', 'a']);
  });

  it('starts another column in asc and clears the previous one', () => {
    const { result } = setup([
      { name: 'b', n: 1 },
      { name: 'a', n: 2 },
    ]);
    act(() => result.current.getSortProps('name').onSort());
    act(() => result.current.getSortProps('name').onSort());
    act(() => result.current.getSortProps('n').onSort());
    expect(result.current.sort).toEqual({ columnId: 'n', direction: 'asc' });
    expect(result.current.getSortProps('name').sortDirection).toBe('none');
    expect(result.current.getSortProps('n').sortDirection).toBe('asc');
  });

  it('sorts numbers by value, not as text', () => {
    const { result } = setup(
      [
        { name: 'x', n: 10 },
        { name: 'y', n: 9 },
        { name: 'z', n: 100 },
      ],
      [col('n')],
    );
    act(() => result.current.getSortProps('n').onSort());
    expect(result.current.sortedData.map((r) => r.n)).toEqual([9, 10, 100]);
  });

  it('sorts strings with accents, case and numbers naturally', () => {
    const { result } = setup([
      { name: 'zebra' },
      { name: 'Émile' },
      { name: 'item 10' },
      { name: 'Item 2' },
      { name: 'apple' },
    ]);
    act(() => result.current.getSortProps('name').onSort());
    expect(names(result.current.sortedData)).toEqual([
      'apple',
      'Émile',
      'Item 2',
      'item 10',
      'zebra',
    ]);
  });

  it('sorts dates by time', () => {
    const { result } = setup([
      { name: 'a', date: new Date('2024-03-01') },
      { name: 'b', date: new Date('2023-12-31') },
      { name: 'c', date: new Date('2024-01-15') },
    ]);
    act(() => result.current.getSortProps('date').onSort());
    expect(names(result.current.sortedData)).toEqual(['b', 'c', 'a']);
  });

  it('always puts null and undefined last, in both directions', () => {
    const { result } = setup([
      { name: 'none', n: null },
      { name: 'two', n: 2 },
      { name: 'undef' },
      { name: 'one', n: 1 },
    ]);
    act(() => result.current.getSortProps('n').onSort());
    expect(names(result.current.sortedData)).toEqual(['one', 'two', 'none', 'undef']);
    act(() => result.current.getSortProps('n').onSort());
    expect(names(result.current.sortedData)).toEqual(['two', 'one', 'none', 'undef']);
  });

  it('uses a custom compare, reversed for desc', () => {
    const order = ['low', 'mid', 'high'];
    const compare = (a: Row, b: Row) => order.indexOf(a.tag ?? '') - order.indexOf(b.tag ?? '');
    const { result } = setup(
      [
        { name: '1', tag: 'high' },
        { name: '2', tag: 'low' },
        { name: '3', tag: 'mid' },
      ],
      [col('tag', { compare })],
    );
    act(() => result.current.getSortProps('tag').onSort());
    expect(result.current.sortedData.map((r) => r.tag)).toEqual(['low', 'mid', 'high']);
    act(() => result.current.getSortProps('tag').onSort());
    expect(result.current.sortedData.map((r) => r.tag)).toEqual(['high', 'mid', 'low']);
  });

  it('uses a custom accessor', () => {
    const { result } = setup(
      [{ name: 'bb' }, { name: 'a' }, { name: 'ccc' }],
      [col('len', { accessor: (r) => r.name?.length })],
    );
    act(() => result.current.getSortProps('len').onSort());
    expect(names(result.current.sortedData)).toEqual(['a', 'bb', 'ccc']);
  });

  it('is stable: equal elements keep their original order', () => {
    const data = [
      { name: 'first', tag: 'x' },
      { name: 'second', tag: 'x' },
      { name: 'third', tag: 'a' },
      { name: 'fourth', tag: 'x' },
    ];
    const { result } = setup(data, [col('tag')]);
    act(() => result.current.getSortProps('tag').onSort());
    expect(names(result.current.sortedData)).toEqual(['third', 'first', 'second', 'fourth']);
    act(() => result.current.getSortProps('tag').onSort());
    expect(names(result.current.sortedData)).toEqual(['first', 'second', 'fourth', 'third']);
  });

  it('does not mutate the original data', () => {
    const data = [{ name: 'b' }, { name: 'a' }, { name: 'c' }];
    const snapshot = [...data];
    const { result } = setup(data);
    act(() => result.current.getSortProps('name').onSort());
    expect(data).toEqual(snapshot);
    expect(data.every((row, i) => row === snapshot[i])).toBe(true);
  });

  it('supports defaultSort', () => {
    const { result } = setup([{ name: 'a' }, { name: 'b' }], undefined, {
      defaultSort: { columnId: 'name', direction: 'desc' },
    });
    expect(names(result.current.sortedData)).toEqual(['b', 'a']);
    expect(result.current.getSortProps('name').sortDirection).toBe('desc');
  });

  it('ignores a sort on an unknown column', () => {
    const { result } = setup([{ name: 'b' }, { name: 'a' }], undefined, {
      defaultSort: { columnId: 'missing', direction: 'asc' },
    });
    expect(names(result.current.sortedData)).toEqual(['b', 'a']);
  });

  it('calls onSortChange in uncontrolled mode too', () => {
    const onSortChange = vi.fn();
    const { result } = setup([{ name: 'a' }], undefined, { onSortChange });
    act(() => result.current.getSortProps('name').onSort());
    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'asc' });
    expect(result.current.sort).toEqual({ columnId: 'name', direction: 'asc' });
  });

  it('controlled: calls onSortChange and keeps the internal state untouched', () => {
    const onSortChange = vi.fn();
    const { result, rerender } = setup([{ name: 'b' }, { name: 'a' }], undefined, {
      sort: null,
      onSortChange,
    });
    act(() => result.current.getSortProps('name').onSort());
    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'asc' });
    expect(result.current.sort).toBeNull();
    expect(names(result.current.sortedData)).toEqual(['b', 'a']);

    rerender({ sort: { columnId: 'name', direction: 'asc' } });
    expect(names(result.current.sortedData)).toEqual(['a', 'b']);
    act(() => result.current.getSortProps('name').onSort());
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'desc' });
    expect(result.current.sort).toEqual({ columnId: 'name', direction: 'asc' });
  });
});
