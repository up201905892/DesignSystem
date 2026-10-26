import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cx } from '../utils/cx';

export type TabsProps = Omit<ComponentPropsWithoutRef<typeof RadixTabs.Root>, 'dir'>;

/**
 * Tabs that switch between panels of content. Built on Radix Tabs; follows the WAI-ARIA APG tabs
 * pattern.
 *
 * @example
 * <Tabs defaultValue="account">
 *   <TabsList aria-label="Settings">
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="security">Security</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">Account settings</TabsContent>
 *   <TabsContent value="security">Security settings</TabsContent>
 * </Tabs>
 *
 * Accessibility: `tablist` / `tab` / `tabpanel` roles with `aria-selected`, `aria-controls` and
 * `aria-labelledby`. Only the active tab is in the tab order and the active panel is focusable.
 * Arrow keys (Left/Right, or Up/Down when `orientation="vertical"`) move between tabs and wrap
 * around; Home and End go to the first and last tab; disabled tabs are skipped. With
 * `activationMode="manual"` the arrows only move the focus and Enter or Space activate.
 *
 * Props: `value` / `defaultValue` / `onValueChange` (controlled and uncontrolled),
 * `orientation` (`'horizontal'` default | `'vertical'`), `activationMode` (`'automatic'` default |
 * `'manual'`).
 */
export const Tabs = forwardRef<ElementRef<typeof RadixTabs.Root>, TabsProps>(function Tabs(
  { className, orientation = 'horizontal', activationMode = 'automatic', ...props },
  ref,
) {
  return (
    <RadixTabs.Root
      {...props}
      ref={ref}
      orientation={orientation}
      activationMode={activationMode}
      className={cx('ds-tabs', className)}
    />
  );
});

Tabs.displayName = 'Tabs';

/** The tab list needs an accessible name. */
type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-labelledby': string; 'aria-label'?: string };

export type TabsListProps = Omit<
  ComponentPropsWithoutRef<typeof RadixTabs.List>,
  'aria-label' | 'aria-labelledby' | 'loop'
> &
  AccessibleName;

/** The row (or column) of tabs. It scrolls horizontally when the tabs do not fit. */
export const TabsList = forwardRef<ElementRef<typeof RadixTabs.List>, TabsListProps>(
  function TabsList({ className, ...props }, ref) {
    return <RadixTabs.List {...props} ref={ref} className={cx('ds-tabs__list', className)} />;
  },
);

TabsList.displayName = 'TabsList';

export type TabsTriggerProps = ComponentPropsWithoutRef<typeof RadixTabs.Trigger>;

/**
 * A tab. `value` is required and links it to the `TabsContent` with the same value. The value is
 * used to build element ids (`aria-controls`), so it must not contain spaces.
 */
export const TabsTrigger = forwardRef<ElementRef<typeof RadixTabs.Trigger>, TabsTriggerProps>(
  function TabsTrigger({ className, ...props }, ref) {
    return <RadixTabs.Trigger {...props} ref={ref} className={cx('ds-tabs__trigger', className)} />;
  },
);

TabsTrigger.displayName = 'TabsTrigger';

export type TabsContentProps = ComponentPropsWithoutRef<typeof RadixTabs.Content>;

/** The panel of a tab. Only the active one is shown; it is focusable (`tabIndex=0`). */
export const TabsContent = forwardRef<ElementRef<typeof RadixTabs.Content>, TabsContentProps>(
  function TabsContent({ className, ...props }, ref) {
    return <RadixTabs.Content {...props} ref={ref} className={cx('ds-tabs__content', className)} />;
  },
);

TabsContent.displayName = 'TabsContent';
