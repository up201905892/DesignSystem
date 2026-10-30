import { createRef, useState } from 'react';
import { act, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Pagination, type PaginationProps } from './Pagination';
import { usePagination } from './usePagination';

/** Text of the visible list items, with the ellipses as "…". */
function shown() {
  return screen
    .getAllByRole('listitem', { hidden: true })
    .map((li) => li.textContent?.trim() ?? '')
    .filter((text) => text !== '');
}

function pages() {
  return shown();
}

function renderPagination(props: Partial<PaginationProps> = {}) {
  return render(<Pagination pageCount={20} {...props} />);
}

describe('Pagination', () => {
  it('renders a named navigation with a list of buttons', () => {
    renderPagination({ pageCount: 5 });
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(within(nav).getByRole('list')).toBeInTheDocument();
    expect(within(nav).getAllByRole('listitem')).toHaveLength(7);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveTextContent('3');
  });

  it('marks the current page with aria-current', () => {
    renderPagination({ pageCount: 5, defaultPage: 3 });
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 2' })).not.toHaveAttribute('aria-current');
  });

  it('accepts custom labels', () => {
    renderPagination({
      pageCount: 3,
      label: 'Paginação',
      previousLabel: 'Anterior',
      nextLabel: 'Seguinte',
      getPageLabel: (n) => `Página ${n}`,
    });
    expect(screen.getByRole('navigation', { name: 'Paginação' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Seguinte' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument();
  });

  it('calls onPageChange with the clicked page', async () => {
    const onPageChange = vi.fn();
    renderPagination({ pageCount: 5, onPageChange });
    await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
  });

  it('does not call onPageChange for the current page', async () => {
    const onPageChange = vi.fn();
    renderPagination({ pageCount: 5, onPageChange });
    await userEvent.click(screen.getByRole('button', { name: 'Page 1' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('goes to the previous and the next page', async () => {
    const onPageChange = vi.fn();
    renderPagination({ pageCount: 5, defaultPage: 3, onPageChange });
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  describe('limits', () => {
    it('disables "previous" on the first page without the disabled attribute', async () => {
      const onPageChange = vi.fn();
      renderPagination({ pageCount: 5, onPageChange });
      const previous = screen.getByRole('button', { name: 'Previous page' });
      expect(previous).toHaveAttribute('aria-disabled', 'true');
      expect(previous).toHaveAttribute('data-disabled');
      expect(previous).not.toHaveAttribute('disabled');
      expect(previous).not.toHaveAttribute('tabindex');
      await userEvent.click(previous);
      expect(onPageChange).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'Next page' })).not.toHaveAttribute(
        'aria-disabled',
      );
    });

    it('disables "next" on the last page without the disabled attribute', async () => {
      const onPageChange = vi.fn();
      renderPagination({ pageCount: 5, defaultPage: 5, onPageChange });
      const next = screen.getByRole('button', { name: 'Next page' });
      expect(next).toHaveAttribute('aria-disabled', 'true');
      expect(next).toHaveAttribute('data-disabled');
      expect(next).not.toHaveAttribute('disabled');
      await userEvent.click(next);
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('keeps one page and both buttons disabled when pageCount <= 1', () => {
      for (const pageCount of [1, 0]) {
        const { unmount } = renderPagination({ pageCount });
        expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
          'aria-current',
          'page',
        );
        expect(screen.getByRole('button', { name: 'Previous page' })).toHaveAttribute(
          'aria-disabled',
          'true',
        );
        expect(screen.getByRole('button', { name: 'Next page' })).toHaveAttribute(
          'aria-disabled',
          'true',
        );
        unmount();
      }
    });

    it('limits an out-of-range page', () => {
      renderPagination({ pageCount: 5, page: 99 });
      expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });
  });

  describe('ellipses', () => {
    it('shows 1 2 3 4 5 … 20 on the first page', () => {
      renderPagination({ defaultPage: 1 });
      expect(pages()).toEqual(['', '1', '2', '3', '4', '5', '…', '20', ''].filter(Boolean));
    });

    it('shows 1 … 4 5 6 … 20 on page 5', () => {
      renderPagination({ defaultPage: 5 });
      expect(pages()).toEqual(['1', '…', '4', '5', '6', '…', '20']);
    });

    it('shows 1 … 16 17 18 19 20 on the last page', () => {
      renderPagination({ defaultPage: 20 });
      expect(pages()).toEqual(['1', '…', '16', '17', '18', '19', '20']);
    });

    it('respects siblingCount', () => {
      renderPagination({ defaultPage: 10, siblingCount: 2 });
      expect(pages()).toEqual(['1', '…', '8', '9', '10', '11', '12', '…', '20']);
    });

    it('keeps a constant number of entries and always shows the current page', () => {
      for (const siblingCount of [0, 1, 2]) {
        for (let page = 1; page <= 20; page += 1) {
          const { unmount } = renderPagination({ page, siblingCount });
          const entries = pages();
          expect(entries).toHaveLength(siblingCount * 2 + 5);
          expect(entries).toContain(String(page));
          expect(entries[0]).toBe('1');
          expect(entries.at(-1)).toBe('20');
          expect(screen.getByRole('button', { current: 'page' })).toHaveTextContent(String(page));
          unmount();
        }
      }
    });

    it('shows every page when they fit', () => {
      renderPagination({ pageCount: 7 });
      expect(pages()).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    });

    it('hides the ellipses from assistive technology and the Tab order', () => {
      renderPagination({ defaultPage: 5 });
      const dots = screen.getAllByText('…');
      expect(dots).toHaveLength(2);
      for (const dot of dots) {
        expect(dot.closest('[aria-hidden="true"]')).not.toBeNull();
        expect(dot.closest('button')).toBeNull();
      }
    });
  });

  describe('state', () => {
    it('works uncontrolled with defaultPage', async () => {
      renderPagination({ pageCount: 5, defaultPage: 2 });
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
      expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('works controlled: only the page prop changes the page', async () => {
      const onPageChange = vi.fn();
      const { rerender } = render(
        <Pagination pageCount={5} page={2} onPageChange={onPageChange} />,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
      expect(onPageChange).toHaveBeenCalledWith(4);
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      rerender(<Pagination pageCount={5} page={4} onPageChange={onPageChange} />);
      expect(screen.getByRole('button', { name: 'Page 4' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });
  });

  describe('keyboard', () => {
    it('Tab goes through previous, pages and next in order', async () => {
      renderPagination({ pageCount: 3 });
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Previous page' })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Page 1' })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Page 3' })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Next page' })).toHaveFocus();
    });

    it('Enter and Space change the page and keep the focus on the button', async () => {
      const onPageChange = vi.fn();
      renderPagination({ pageCount: 5, onPageChange });
      const page3 = screen.getByRole('button', { name: 'Page 3' });
      page3.focus();
      await userEvent.keyboard('{Enter}');
      expect(onPageChange).toHaveBeenLastCalledWith(3);
      expect(page3).toHaveFocus();
      const page4 = screen.getByRole('button', { name: 'Page 4' });
      page4.focus();
      await userEvent.keyboard(' ');
      expect(onPageChange).toHaveBeenLastCalledWith(4);
      expect(page4).toHaveFocus();
    });

    it('on the first page Tab still focuses "previous" and Enter/Space do nothing', async () => {
      const onPageChange = vi.fn();
      renderPagination({ pageCount: 5, onPageChange });
      await userEvent.tab();
      const previous = screen.getByRole('button', { name: 'Previous page' });
      expect(previous).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await userEvent.keyboard(' ');
      expect(onPageChange).not.toHaveBeenCalled();
      expect(previous).toHaveFocus();
    });

    it('keeps the focus on "next" when it becomes disabled on the last page', async () => {
      renderPagination({ pageCount: 5, defaultPage: 4 });
      const next = screen.getByRole('button', { name: 'Next page' });
      next.focus();
      await userEvent.keyboard('{Enter}');
      expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(next).toHaveAttribute('aria-disabled', 'true');
      expect(document.activeElement).toBe(next);
    });
  });

  it('applies size, className, ref, extra props and displayName', () => {
    const ref = createRef<HTMLElement>();
    renderPagination({
      pageCount: 3,
      size: 'sm',
      className: 'mine',
      ref,
      'data-testid': 'p',
    } as never);
    const nav = screen.getByTestId('p');
    expect(ref.current).toBe(nav);
    expect(nav.tagName).toBe('NAV');
    expect(nav).toHaveClass('ds-pagination', 'mine');
    expect(nav).toHaveAttribute('data-size', 'sm');
    expect(Pagination.displayName).toBe('Pagination');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderPagination({ defaultPage: 5 });
    await expectNoA11yViolations(container);
  });

  it('has no accessibility violations on the first page and with one page', async () => {
    const first = renderPagination();
    await expectNoA11yViolations(first.container);
    first.unmount();
    const single = renderPagination({ pageCount: 1 });
    await expectNoA11yViolations(single.container);
  });

  it('works inside a controlled parent', async () => {
    function Parent() {
      const [page, setPage] = useState(1);
      return <Pagination pageCount={3} page={page} onPageChange={setPage} />;
    }
    render(<Parent />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('usePagination', () => {
  it('computes the ranges for 95 items, 10 per page', () => {
    const first = renderHook(() => usePagination({ totalItems: 95, pageSize: 10 })).result.current;
    expect(first).toMatchObject({
      page: 1,
      pageCount: 10,
      startIndex: 0,
      endIndex: 10,
      canNext: true,
      canPrevious: false,
    });
    const last = renderHook(() => usePagination({ totalItems: 95, pageSize: 10, defaultPage: 10 }))
      .result.current;
    expect(last).toMatchObject({
      page: 10,
      startIndex: 90,
      endIndex: 95,
      canNext: false,
      canPrevious: true,
    });
  });

  it('limits a page outside the range', () => {
    const high = renderHook(() => usePagination({ totalItems: 95, pageSize: 10, page: 99 }));
    expect(high.result.current.page).toBe(10);
    const low = renderHook(() => usePagination({ totalItems: 95, pageSize: 10, defaultPage: -4 }));
    expect(low.result.current.page).toBe(1);
  });

  it('returns one page and an empty range for 0 items', () => {
    const { result } = renderHook(() => usePagination({ totalItems: 0, pageSize: 10 }));
    expect(result.current).toMatchObject({
      page: 1,
      pageCount: 1,
      startIndex: 0,
      endIndex: 0,
      canNext: false,
      canPrevious: false,
    });
  });

  it('setPage, next and previous move and limit the page', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ totalItems: 30, pageSize: 10, onPageChange }),
    );
    act(() => result.current.next());
    expect(result.current.page).toBe(2);
    act(() => result.current.setPage(50));
    expect(result.current.page).toBe(3);
    act(() => result.current.next());
    expect(onPageChange).toHaveBeenCalledTimes(2);
    act(() => result.current.previous());
    expect(result.current.page).toBe(2);
    expect(onPageChange).toHaveBeenLastCalledWith(2);
  });

  it('corrects the page when totalItems shrinks', () => {
    const { result, rerender } = renderHook(
      ({ total }) => usePagination({ totalItems: total, pageSize: 10, defaultPage: 10 }),
      { initialProps: { total: 100 } },
    );
    expect(result.current.page).toBe(10);
    rerender({ total: 35 });
    expect(result.current.page).toBe(4);
    rerender({ total: 100 });
    expect(result.current.page).toBe(4);
  });

  it('limits a controlled page when totalItems shrinks', () => {
    const { result, rerender } = renderHook(
      ({ total }) => usePagination({ totalItems: total, pageSize: 10, page: 10 }),
      { initialProps: { total: 100 } },
    );
    rerender({ total: 20 });
    expect(result.current.page).toBe(2);
  });
});
