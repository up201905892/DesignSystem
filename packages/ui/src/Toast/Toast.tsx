import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon, XIcon } from '@ds/icons';
import { IconButton } from '../IconButton';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';
export type ToastPosition = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';

export interface ToastAction {
  /** Visible label of the action button. */
  label: string;
  /** Called when the action is activated; the toast closes afterwards. */
  onClick: () => void;
  /** Description of the action for screen reader users who cannot reach the button in time. */
  altText: string;
}

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  /** Colour role and icon. Defaults to `info`. */
  variant?: ToastVariant;
  /** Time in ms before the toast closes by itself. `Infinity` keeps it until dismissed. Defaults to 5000. */
  duration?: number;
  action?: ToastAction;
}

export interface ToastContextValue {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  /** Closes the toast with this id, or every toast when called without an id. */
  dismiss: (id?: string) => void;
}

export interface ToastProviderProps {
  /** Corner or edge of the screen where toasts appear. */
  position?: ToastPosition;
  /** Maximum number of visible toasts; the oldest leave first. */
  max?: number;
  /** Accessible name of the notifications region. */
  label?: string;
  /** Accessible name of the close button of each toast. */
  closeLabel?: string;
  children?: ReactNode;
}

interface ToastItem extends ToastOptions {
  id: string;
  open: boolean;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastVariant, ReactNode> = {
  info: <InfoIcon />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon />,
  danger: <CircleXIcon />,
};

const swipeDirections = {
  'top-right': 'right',
  'bottom-right': 'right',
  'top-center': 'up',
  'bottom-center': 'down',
} as const;

const DEFAULT_DURATION = 5000;

/** Time kept for the exit animation before a closed toast is dropped from the list. */
const EXIT_MS = 300;

/**
 * Returns `toast()` and `dismiss()`. Must be used inside a `ToastProvider`.
 *
 * @example
 * const { toast } = useToast();
 * toast({ title: 'Saved', variant: 'success' });
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a <ToastProvider>.');
  }
  return context;
}

/**
 * Renders the notifications region and provides `useToast()` to its children.
 *
 * Accessibility: each toast is announced without moving the focus (`danger` and `warning`
 * assertively, `info` and `success` politely). The timer pauses while the pointer is over the
 * region or the focus is inside it. F8 moves the focus to the region; Esc closes the focused
 * toast. A toast announces a result, so the element that started the action keeps the focus.
 */
export function ToastProvider({
  position = 'bottom-right',
  max = 3,
  label = 'Notifications',
  closeLabel = 'Close',
  children,
}: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  // Closed toasts stay mounted for the exit animation, then leave the list.
  const closedKey = items
    .filter((item) => !item.open)
    .map((item) => item.id)
    .join(',');
  useEffect(() => {
    if (closedKey === '') return undefined;
    const ids = closedKey.split(',');
    const timer = setTimeout(() => {
      setItems((current) => current.filter((item) => item.open || !ids.includes(item.id)));
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [closedKey]);

  const toast = useCallback(
    (options: ToastOptions) => {
      counter.current += 1;
      const id = `ds-toast-${counter.current}`;
      setItems((current) => {
        let excess = current.filter((item) => item.open).length + 1 - Math.max(max, 1);
        const trimmed = current.map((item) => {
          if (item.open && excess > 0) {
            excess -= 1;
            return { ...item, open: false };
          }
          return item;
        });
        return [...trimmed, { ...options, id, open: true }];
      });
      return id;
    },
    [max],
  );

  const dismiss = useCallback((id?: string) => {
    setItems((current) =>
      current.map((item) =>
        item.open && (id === undefined || item.id === id) ? { ...item, open: false } : item,
      ),
    );
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection={swipeDirections[position]} duration={DEFAULT_DURATION}>
        {children}
        {items.map((item) => {
          const variant = item.variant ?? 'info';
          const hasDescription =
            item.description !== undefined &&
            item.description !== null &&
            item.description !== false;
          return (
            <RadixToast.Root
              key={item.id}
              className="ds-toast"
              data-variant={variant}
              type={variant === 'danger' || variant === 'warning' ? 'foreground' : 'background'}
              duration={item.duration ?? DEFAULT_DURATION}
              open={item.open}
              onOpenChange={(open) => {
                if (!open) dismiss(item.id);
              }}
            >
              <span className="ds-toast__icon" aria-hidden="true">
                {icons[variant]}
              </span>
              <div className="ds-toast__content">
                <RadixToast.Title className="ds-toast__title">{item.title}</RadixToast.Title>
                {hasDescription ? (
                  <RadixToast.Description className="ds-toast__description">
                    {item.description}
                  </RadixToast.Description>
                ) : null}
                {item.action ? (
                  <RadixToast.Action
                    className="ds-toast__action"
                    altText={item.action.altText}
                    onClick={item.action.onClick}
                  >
                    {item.action.label}
                  </RadixToast.Action>
                ) : null}
              </div>
              <RadixToast.Close asChild>
                <IconButton
                  className="ds-toast__close"
                  variant="ghost"
                  size="sm"
                  aria-label={closeLabel}
                  icon={<XIcon />}
                />
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}
        <RadixToast.Viewport className="ds-toast-viewport" data-position={position} label={label} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = 'ToastProvider';
