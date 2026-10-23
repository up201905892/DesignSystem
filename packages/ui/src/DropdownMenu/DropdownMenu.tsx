import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import * as RadixMenu from '@radix-ui/react-dropdown-menu';
import { cx } from '../utils/cx';

const DropdownMenuContext = createContext<{ setOpen: (open: boolean) => void }>({
  setOpen: () => {},
});

/** True when the element is disabled natively or through `aria-disabled` (Button with `asChild`). */
function isDisabled(element: HTMLElement) {
  return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
}

export interface DropdownMenuProps {
  /** Whether the menu is open (controlled). */
  open?: boolean;
  /** Whether the menu starts open (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** A `DropdownMenuTrigger` and a `DropdownMenuContent`. */
  children?: ReactNode;
}

/**
 * Menu of actions opened by a button, built on Radix DropdownMenu. It renders no element of its own.
 *
 * @example
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild><Button>Actions</Button></DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem onSelect={edit}>Edit</DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem variant="danger" onSelect={remove}>Delete</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 *
 * Accessibility: the trigger has `aria-haspopup="menu"` and `aria-expanded`; the content is a
 * `role="menu"` with `role="menuitem"` items. Enter, Space or Arrow Down on the trigger open it
 * with the first item focused; arrows, Home, End and typing a letter move the focus; Enter or
 * Space activate; Esc closes and returns the focus to the trigger; Tab closes.
 */
export function DropdownMenu({ open, defaultOpen, onOpenChange, children }: DropdownMenuProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen ?? false);
  const current = open ?? innerOpen;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };
  return (
    <DropdownMenuContext.Provider value={{ setOpen }}>
      {/* Non-modal: the page behind keeps its scroll and is not aria-hidden (the trigger stays
          focusable and visible to assistive technology, as in the menu button pattern). */}
      <RadixMenu.Root open={current} onOpenChange={setOpen} modal={false}>
        {children}
      </RadixMenu.Root>
    </DropdownMenuContext.Provider>
  );
}

export type DropdownMenuTriggerProps = ComponentPropsWithoutRef<typeof RadixMenu.Trigger>;

/** Opens the menu. Use `asChild` to render your own `Button` or `IconButton`. */
export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ onPointerDown, onKeyDown, ...props }, ref) {
    // Radix only checks its own `disabled` prop; with `asChild` the child may be disabled by
    // itself, so a disabled trigger must not open on pointer, Enter, Space or Arrow Down.
    return (
      <RadixMenu.Trigger
        ref={ref}
        onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
          onPointerDown?.(event);
          if (isDisabled(event.currentTarget)) event.preventDefault();
        }}
        onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(event);
          if (isDisabled(event.currentTarget)) event.preventDefault();
        }}
        {...props}
      />
    );
  },
);

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export interface DropdownMenuContentProps extends Omit<
  ComponentPropsWithoutRef<typeof RadixMenu.Content>,
  'asChild'
> {
  /** Side of the trigger where the menu appears. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alignment relative to the trigger. */
  align?: 'start' | 'center' | 'end';
}

/** The menu panel, rendered in a portal. `ref` and `className` go to it. */
export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    { side = 'bottom', align = 'start', sideOffset = 4, className, onKeyDown, ...props },
    ref,
  ) {
    const { setOpen } = useContext(DropdownMenuContext);
    return (
      <RadixMenu.Portal>
        <RadixMenu.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cx('ds-dropdown-menu', className)}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            // Radix keeps Tab inside the menu; the menu button pattern closes it instead.
            if (event.key === 'Tab' && !event.defaultPrevented) setOpen(false);
          }}
          {...props}
        />
      </RadixMenu.Portal>
    );
  },
);

DropdownMenuContent.displayName = 'DropdownMenuContent';

export interface DropdownMenuItemProps extends Omit<
  ComponentPropsWithoutRef<typeof RadixMenu.Item>,
  'asChild'
> {
  /** `danger` marks destructive actions. */
  variant?: 'default' | 'danger';
  /** Icon shown before the text. Decorative: it is hidden from assistive technology. */
  leadingIcon?: ReactNode;
}

/** An action. Selecting it calls `onSelect`, closes the menu and returns focus to the trigger. */
export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    { variant = 'default', leadingIcon, className, children, ...props },
    ref,
  ) {
    return (
      <RadixMenu.Item
        ref={ref}
        className={cx('ds-dropdown-menu__item', className)}
        data-variant={variant}
        {...props}
      >
        {leadingIcon ? (
          <span className="ds-dropdown-menu__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        {children}
      </RadixMenu.Item>
    );
  },
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<typeof RadixMenu.Label>;

/** Non-interactive heading for a group of items. */
export const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ className, ...props }, ref) {
    return (
      <RadixMenu.Label ref={ref} className={cx('ds-dropdown-menu__label', className)} {...props} />
    );
  },
);

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export type DropdownMenuGroupProps = ComponentPropsWithoutRef<typeof RadixMenu.Group>;

/** Groups related items (`role="group"`). */
export const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup({ className, ...props }, ref) {
    return (
      <RadixMenu.Group ref={ref} className={cx('ds-dropdown-menu__group', className)} {...props} />
    );
  },
);

DropdownMenuGroup.displayName = 'DropdownMenuGroup';

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<typeof RadixMenu.Separator>;

/** Visual and semantic (`role="separator"`) divider between items. */
export const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ className, ...props }, ref) {
    return (
      <RadixMenu.Separator
        ref={ref}
        className={cx('ds-dropdown-menu__separator', className)}
        {...props}
      />
    );
  },
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
