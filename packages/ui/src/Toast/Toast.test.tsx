import { useEffect } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import {
  ToastProvider,
  useToast,
  type ToastContextValue,
  type ToastOptions,
  type ToastProviderProps,
} from './Toast';

const holder: { api: ToastContextValue } = { api: undefined as unknown as ToastContextValue };

const api: ToastContextValue = {
  toast: (options) => holder.api.toast(options),
  dismiss: (id) => holder.api.dismiss(id),
};

function Capture() {
  const value = useToast();
  useEffect(() => {
    holder.api = value;
  }, [value]);
  return <button type="button">Page</button>;
}

function renderToasts(props: ToastProviderProps = {}) {
  return render(
    <ToastProvider {...props}>
      <Capture />
    </ToastProvider>,
  );
}

function show(options: ToastOptions) {
  let id = '';
  act(() => {
    id = api.toast(options);
  });
  return id;
}

/** Visible toasts are the list items of the region (Radix adds a hidden duplicate for screen readers). */
const toasts = () => screen.queryAllByRole('listitem');

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Toast', () => {
  it('shows the title and description', () => {
    renderToasts();
    show({ title: 'Saved', description: 'Your changes are stored.' });
    const [item] = toasts();
    expect(within(item!).getByText('Saved')).toBeInTheDocument();
    expect(within(item!).getByText('Your changes are stored.')).toBeInTheDocument();
  });

  it('returns a different id for each toast', () => {
    renderToasts();
    const a = show({ title: 'A' });
    const b = show({ title: 'B' });
    expect(a).not.toBe(b);
  });

  it('defaults to the info variant and reflects the variant in data-variant', () => {
    renderToasts();
    show({ title: 'One' });
    show({ title: 'Two', variant: 'danger' });
    const [one, two] = toasts();
    expect(one).toHaveAttribute('data-variant', 'info');
    expect(two).toHaveAttribute('data-variant', 'danger');
  });

  it('closes by itself after the default duration (5000 ms)', () => {
    renderToasts();
    show({ title: 'Saved' });
    act(() => {
      vi.advanceTimersByTime(4900);
    });
    expect(toasts()).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(toasts()).toHaveLength(0);
  });

  it('respects a custom duration', () => {
    renderToasts();
    show({ title: 'Quick', duration: 1000 });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(toasts()).toHaveLength(0);
  });

  it('stays open with duration Infinity', () => {
    renderToasts();
    show({ title: 'Persistent', duration: Infinity });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(toasts()).toHaveLength(1);
  });

  it('dismiss(id) closes only that toast', () => {
    renderToasts();
    const first = show({ title: 'First', duration: Infinity });
    show({ title: 'Second', duration: Infinity });
    act(() => api.dismiss(first));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(toasts()).toHaveLength(1);
    expect(within(toasts()[0]!).getByText('Second')).toBeInTheDocument();
  });

  it('dismiss() closes every toast', () => {
    renderToasts();
    show({ title: 'First', duration: Infinity });
    show({ title: 'Second', duration: Infinity });
    act(() => api.dismiss());
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(toasts()).toHaveLength(0);
  });

  it('keeps at most `max` toasts (default 3), removing the oldest first', () => {
    renderToasts();
    for (const title of ['One', 'Two', 'Three', 'Four']) {
      show({ title, duration: Infinity });
    }
    act(() => {
      vi.advanceTimersByTime(500);
    });
    const titles = toasts().map((item) => within(item).getByText(/One|Two|Three|Four/).textContent);
    expect(titles).toEqual(['Two', 'Three', 'Four']);
  });

  it('honours a custom `max`', () => {
    renderToasts({ max: 1 });
    show({ title: 'One', duration: Infinity });
    show({ title: 'Two', duration: Infinity });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(toasts()).toHaveLength(1);
    expect(within(toasts()[0]!).getByText('Two')).toBeInTheDocument();
  });

  it('runs the action, then closes the toast', () => {
    const onClick = vi.fn();
    renderToasts();
    show({
      title: 'Deleted',
      duration: Infinity,
      action: { label: 'Undo', altText: 'Undo deletion', onClick },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(toasts()).toHaveLength(0);
  });

  it('closes with the close button, whose name comes from closeLabel', () => {
    renderToasts({ closeLabel: 'Dismiss' });
    show({ title: 'Saved', duration: Infinity });
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(toasts()).toHaveLength(0);
  });

  it('throws a clear error when useToast is used outside a ToastProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Capture />)).toThrow(/useToast must be used inside a <ToastProvider>/);
    spy.mockRestore();
  });

  it('names the region from `label` (default "Notifications")', () => {
    const { unmount } = renderToasts();
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    unmount();
    renderToasts({ label: 'Avisos' });
    expect(screen.getByRole('region', { name: 'Avisos' })).toBeInTheDocument();
  });

  it('positions the region with data-position (default bottom-right)', () => {
    const { unmount } = renderToasts();
    expect(document.querySelector('.ds-toast-viewport')).toHaveAttribute(
      'data-position',
      'bottom-right',
    );
    unmount();
    renderToasts({ position: 'top-center' });
    expect(document.querySelector('.ds-toast-viewport')).toHaveAttribute(
      'data-position',
      'top-center',
    );
  });

  it('keeps the icon decorative', () => {
    renderToasts();
    show({ title: 'Saved', variant: 'success', duration: Infinity });
    expect(toasts()[0]!.querySelector('.ds-toast__icon')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Toast accessibility', () => {
  it('has no axe violations with a toast visible', async () => {
    vi.useRealTimers();
    const { container } = renderToasts();
    show({
      title: 'Saved',
      description: 'Done.',
      duration: Infinity,
      action: { label: 'Undo', altText: 'Undo', onClick: () => undefined },
    });
    await expectNoA11yViolations(container);
    await expectNoA11yViolations(document.body);
  });

  it('announces danger and warning assertively, info and success politely', () => {
    renderToasts({ max: 4 });
    show({ title: 'D', variant: 'danger', duration: Infinity });
    show({ title: 'W', variant: 'warning', duration: Infinity });
    show({ title: 'I', variant: 'info', duration: Infinity });
    show({ title: 'S', variant: 'success', duration: Infinity });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    // Radix announces each toast through a visually hidden live region: foreground = assertive.
    const live = (text: string) =>
      screen
        .getAllByRole('status')
        .find((el) => el.textContent?.includes(text) && !el.closest('li'))
        ?.getAttribute('aria-live');
    expect(live('D')).toBe('assertive');
    expect(live('W')).toBe('assertive');
    expect(live('I')).toBe('polite');
    expect(live('S')).toBe('polite');
  });

  it('does not move the focus when a toast opens', () => {
    renderToasts();
    const button = screen.getByRole('button', { name: 'Page' });
    button.focus();
    show({ title: 'Saved', duration: Infinity });
    expect(document.activeElement).toBe(button);
  });

  it('moves the focus to the region with F8', () => {
    renderToasts();
    show({ title: 'Saved', duration: Infinity });
    fireEvent.keyDown(document, { key: 'F8', code: 'F8' });
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region.contains(document.activeElement)).toBe(true);
  });

  it('reaches the action and the close button with Tab, and Esc closes the focused toast', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderToasts();
    show({
      title: 'Deleted',
      duration: Infinity,
      action: { label: 'Undo', altText: 'Undo deletion', onClick: () => undefined },
    });
    const toastEl = toasts()[0]!;
    toastEl.focus();
    expect(document.activeElement).toBe(toastEl);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Undo' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' }));
    await user.keyboard('{Escape}');
    await vi.waitFor(() => expect(toasts()).toHaveLength(0));
  });

  it('pauses the timer while the focus is inside the region and resumes afterwards', () => {
    renderToasts();
    show({ title: 'Saved', duration: 2000 });
    const closeButton = screen.getByRole('button', { name: 'Close' });
    act(() => closeButton.focus());
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(toasts()).toHaveLength(1);
    act(() => closeButton.blur());
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(toasts()).toHaveLength(0);
  });

  it('pauses the timer while the pointer is over the region', () => {
    renderToasts();
    show({ title: 'Saved', duration: 2000 });
    const region = screen.getByRole('region', { name: 'Notifications' });
    fireEvent.pointerMove(region);
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(toasts()).toHaveLength(1);
    fireEvent.pointerLeave(region);
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(toasts()).toHaveLength(0);
  });
});
