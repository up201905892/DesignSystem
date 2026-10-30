import {
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useState,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { XIcon } from '@ds/icons';
import { cx } from '../utils/cx';
import { IconButton } from '../IconButton';

interface DialogContextValue {
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
}

const DialogContext = createContext<DialogContextValue>({
  hasDescription: false,
  setHasDescription: () => {},
});

export interface DialogProps {
  /** Whether the dialog is open (controlled). */
  open?: boolean;
  /** Whether the dialog starts open (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** A `DialogTrigger` and a `DialogContent`. */
  children?: ReactNode;
}

/**
 * Modal window with trapped focus, built on Radix Dialog. It renders no element of its own.
 *
 * @example
 * <Dialog>
 *   <DialogTrigger asChild><Button>Edit</Button></DialogTrigger>
 *   <DialogContent size="md">
 *     <DialogHeader>
 *       <DialogTitle>Edit profile</DialogTitle>
 *       <DialogDescription>Change your details.</DialogDescription>
 *     </DialogHeader>
 *     <DialogBody>...</DialogBody>
 *     <DialogFooter><DialogClose asChild><Button>Done</Button></DialogClose></DialogFooter>
 *   </DialogContent>
 * </Dialog>
 *
 * Accessibility: `role="dialog"` with `aria-modal`, named by `DialogTitle` (required) and
 * described by `DialogDescription`. Focus moves into the dialog on open, is trapped while open
 * and returns to the trigger on close; Esc closes; the page behind is inert and does not scroll.
 */
export function Dialog({ open, defaultOpen, onOpenChange, children }: DialogProps) {
  const [hasDescription, setHasDescription] = useState(false);
  return (
    <DialogContext.Provider value={{ hasDescription, setHasDescription }}>
      <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {children}
      </RadixDialog.Root>
    </DialogContext.Provider>
  );
}

export type DialogTriggerProps = ComponentPropsWithoutRef<typeof RadixDialog.Trigger>;

/** Opens the dialog. Use `asChild` to render your own `Button`. */
export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger(props, ref) {
    return <RadixDialog.Trigger ref={ref} {...props} />;
  },
);

DialogTrigger.displayName = 'DialogTrigger';

export interface DialogContentProps extends Omit<
  ComponentPropsWithoutRef<typeof RadixDialog.Content>,
  'asChild'
> {
  /** Width of the dialog: `sm` (24rem), `md` (32rem, default) or `lg` (48rem). */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Removes the close button in the corner. */
  hideClose?: boolean;
  /** Whether a click on the overlay closes the dialog. */
  closeOnOverlayClick?: boolean;
}

/** The dialog window, rendered in a portal with its overlay. `ref` and `className` go to it. */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  {
    size = 'md',
    closeLabel = 'Close',
    hideClose = false,
    closeOnOverlayClick = true,
    className,
    children,
    onPointerDownOutside,
    ...props
  },
  ref,
) {
  const { hasDescription } = useContext(DialogContext);
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="ds-dialog__overlay" />
      <RadixDialog.Content
        ref={ref}
        className={cx('ds-dialog', className)}
        aria-modal="true"
        data-size={size}
        // Without a description there is nothing to point to; opting out avoids the Radix warning.
        {...(hasDescription ? {} : { 'aria-describedby': undefined })}
        onPointerDownOutside={(event) => {
          onPointerDownOutside?.(event);
          if (!closeOnOverlayClick) event.preventDefault();
        }}
        {...props}
      >
        {children}
        {hideClose ? null : (
          <RadixDialog.Close asChild>
            <IconButton
              className="ds-dialog__close"
              variant="ghost"
              size="sm"
              aria-label={closeLabel}
              icon={<XIcon />}
            />
          </RadixDialog.Close>
        )}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
});

DialogContent.displayName = 'DialogContent';

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Fixed top area with the title and description. */
export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('ds-dialog__header', className)} {...props} />;
});

DialogHeader.displayName = 'DialogHeader';

export type DialogTitleProps = ComponentPropsWithoutRef<typeof RadixDialog.Title>;

/** Title of the dialog; it names the dialog (`aria-labelledby`). Required. */
export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { className, ...props },
  ref,
) {
  return <RadixDialog.Title ref={ref} className={cx('ds-dialog__title', className)} {...props} />;
});

DialogTitle.displayName = 'DialogTitle';

export type DialogDescriptionProps = ComponentPropsWithoutRef<typeof RadixDialog.Description>;

/** Short description of the dialog (`aria-describedby`). */
export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ className, ...props }, ref) {
    const { setHasDescription } = useContext(DialogContext);
    useLayoutEffect(() => {
      setHasDescription(true);
      return () => setHasDescription(false);
    }, [setHasDescription]);
    return (
      <RadixDialog.Description
        ref={ref}
        className={cx('ds-dialog__description', className)}
        {...props}
      />
    );
  },
);

DialogDescription.displayName = 'DialogDescription';

export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;

/** Main area; long content scrolls here while the header and footer stay visible. */
export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(function DialogBody(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('ds-dialog__body', className)} {...props} />;
});

DialogBody.displayName = 'DialogBody';

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

/** Fixed bottom area for the actions. */
export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('ds-dialog__footer', className)} {...props} />;
});

DialogFooter.displayName = 'DialogFooter';

export type DialogCloseProps = ComponentPropsWithoutRef<typeof RadixDialog.Close>;

/** Closes the dialog. Use `asChild` to render your own `Button`. */
export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose(props, ref) {
    return <RadixDialog.Close ref={ref} {...props} />;
  },
);

DialogClose.displayName = 'DialogClose';
