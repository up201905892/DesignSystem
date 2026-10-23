import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cx } from '../utils/cx';

const DEFAULT_DELAY = 400;

/** True below a `TooltipProvider`, so a lone `Tooltip` can create its own. */
const ProviderContext = createContext(false);

export interface TooltipProviderProps {
  /** Delay in milliseconds before a tooltip opens on hover. Defaults to 400. */
  delayDuration?: number;
  /** Time in milliseconds during which moving to another tooltip opens it without delay. Defaults to 300. */
  skipDelayDuration?: number;
  children?: ReactNode;
}

/**
 * Shares the opening delay between all the tooltips below it, so moving from one trigger to the
 * next shows the new tooltip immediately. Optional: a `Tooltip` without a provider works alone.
 */
export function TooltipProvider({
  delayDuration = DEFAULT_DELAY,
  skipDelayDuration,
  children,
}: TooltipProviderProps) {
  return (
    <ProviderContext.Provider value={true}>
      <RadixTooltip.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
        {children}
      </RadixTooltip.Provider>
    </ProviderContext.Provider>
  );
}

export interface TooltipProps extends Omit<
  ComponentPropsWithoutRef<typeof RadixTooltip.Content>,
  'content' | 'children'
> {
  /** Text or short content of the tooltip. It must not contain interactive elements. */
  content: ReactNode;
  /** The single element that triggers the tooltip. It must accept a ref and focus. */
  children: ReactElement;
  /** Side of the trigger where the tooltip appears. Defaults to `top`. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alignment relative to the trigger. */
  align?: 'start' | 'center' | 'end';
  /** Delay in milliseconds before opening on hover. Defaults to 400. */
  delayDuration?: number;
  /** Whether the tooltip is open (controlled). */
  open?: boolean;
  /** Whether the tooltip starts open (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the tooltip opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Short help text shown when the pointer rests on, or the keyboard focuses, an element. Built on
 * Radix Tooltip. `ref` and `className` apply to the tooltip content.
 *
 * @example
 * <Tooltip content="Save changes">
 *   <IconButton aria-label="Save" icon={<SaveIcon />} />
 * </Tooltip>
 *
 * Accessibility (WCAG 1.4.13): it opens on hover and on keyboard focus; Esc closes it without
 * moving the focus; it stays open while the pointer is over it and never closes on a timer. The
 * trigger gets `aria-describedby` pointing to the `role="tooltip"` content while it is open. The
 * tooltip only describes: the trigger must already have its own accessible name. For interactive
 * content use Popover.
 */
export const Tooltip = forwardRef<ElementRef<typeof RadixTooltip.Content>, TooltipProps>(
  function Tooltip(
    {
      content,
      children,
      side = 'top',
      align,
      delayDuration = DEFAULT_DELAY,
      open,
      defaultOpen,
      onOpenChange,
      className,
      sideOffset,
      ...props
    },
    ref,
  ) {
    const hasProvider = useContext(ProviderContext);
    const tooltip = (
      <RadixTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
      >
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            {...props}
            ref={ref}
            side={side}
            align={align}
            sideOffset={sideOffset ?? 6}
            collisionPadding={8}
            className={cx('ds-tooltip', className)}
          >
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    );
    return hasProvider ? (
      tooltip
    ) : (
      <RadixTooltip.Provider delayDuration={delayDuration}>{tooltip}</RadixTooltip.Provider>
    );
  },
);
Tooltip.displayName = 'Tooltip';
