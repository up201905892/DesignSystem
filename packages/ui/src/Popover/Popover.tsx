import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { XIcon } from '@ds/icons';
import { cx } from '../utils/cx';
import { IconButton } from '../IconButton';

export interface PopoverProps {
  /** Whether the popover is open (controlled). */
  open?: boolean;
  /** Whether the popover starts open (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** A `PopoverTrigger` and a `PopoverContent`. */
  children?: ReactNode;
}

/**
 * Non-modal floating panel anchored to a trigger, for interactive content such as filters or short
 * forms. Built on Radix Popover. It renders no element of its own.
 *
 * @example
 * <Popover>
 *   <PopoverTrigger asChild><Button>Filters</Button></PopoverTrigger>
 *   <PopoverContent aria-label="Filters" showClose>
 *     <Input aria-label="Name" />
 *   </PopoverContent>
 * </Popover>
 *
 * Accessibility: the trigger has `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`;
 * the content is a `role="dialog"` that needs an accessible name (`aria-label` or
 * `aria-labelledby`). Focus moves into the content on open; Esc, a click outside or a
 * `PopoverClose` close it and return the focus to the trigger. The page behind is not blocked
 * (use Dialog for that).
 */
export function Popover({ open, defaultOpen, onOpenChange, children }: PopoverProps) {
  return (
    <RadixPopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </RadixPopover.Root>
  );
}

export type PopoverTriggerProps = ComponentPropsWithoutRef<typeof RadixPopover.Trigger>;

/**
 * Opens and closes the popover. Use `asChild` to render your own `Button` or `IconButton`; a
 * disabled child does not open the popover and leaves the tab order.
 */
export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger(props, ref) {
    return <RadixPopover.Trigger ref={ref} {...props} />;
  },
);

PopoverTrigger.displayName = 'PopoverTrigger';

/** The popover is a dialog, so it must have an accessible name. */
type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-labelledby': string; 'aria-label'?: string };

export type PopoverContentProps = Omit<
  ComponentPropsWithoutRef<typeof RadixPopover.Content>,
  'asChild' | 'aria-label' | 'aria-labelledby'
> &
  AccessibleName & {
    /** Side of the trigger where the popover appears. Defaults to `bottom`. */
    side?: 'top' | 'right' | 'bottom' | 'left';
    /** Alignment relative to the trigger. Defaults to `center`. */
    align?: 'start' | 'center' | 'end';
    /** Shows a close button in the corner. */
    showClose?: boolean;
    /** Accessible name of the close button. Defaults to `"Close"`. */
    closeLabel?: string;
  };

/** The popover panel, rendered in a portal. `ref` and `className` go to it. */
export const PopoverContent = forwardRef<
  ElementRef<typeof RadixPopover.Content>,
  PopoverContentProps
>(function PopoverContent(
  {
    side = 'bottom',
    align = 'center',
    sideOffset = 6,
    showClose = false,
    closeLabel = 'Close',
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        collisionPadding={8}
        {...props}
        ref={ref}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cx('ds-popover', className)}
        data-close={showClose ? '' : undefined}
      >
        {children}
        {showClose ? (
          <RadixPopover.Close asChild>
            <IconButton
              className="ds-popover__close"
              variant="ghost"
              size="sm"
              aria-label={closeLabel}
              icon={<XIcon />}
            />
          </RadixPopover.Close>
        ) : null}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
});

PopoverContent.displayName = 'PopoverContent';

export type PopoverCloseProps = ComponentPropsWithoutRef<typeof RadixPopover.Close>;

/** Closes the popover. Use `asChild` to render your own `Button`. */
export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function PopoverClose(props, ref) {
    return <RadixPopover.Close ref={ref} {...props} />;
  },
);

PopoverClose.displayName = 'PopoverClose';
