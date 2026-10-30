import {
  createContext,
  createElement,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@ds/icons';
import { cx } from '../utils/cx';

export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

const HeadingLevelContext = createContext<AccordionHeadingLevel>(3);

type CommonProps = {
  /**
   * Level of the heading that wraps every trigger (`<h2>` to `<h6>`). Pick the level that fits the
   * page outline. Defaults to `3`.
   */
  headingLevel?: AccordionHeadingLevel;
};

type SingleProps = Omit<RadixAccordion.AccordionSingleProps, 'dir' | 'orientation'> & CommonProps;
type MultipleProps = Omit<RadixAccordion.AccordionMultipleProps, 'dir' | 'orientation'> &
  CommonProps;

/**
 * `type` is required. With `'single'` one item is open at a time (`value` is a string and
 * `collapsible` lets the open item close); with `'multiple'` several items can be open
 * (`value` is an array).
 */
export type AccordionProps = SingleProps | MultipleProps;

/**
 * Sections that expand and collapse. Built on Radix Accordion; follows the WAI-ARIA APG accordion
 * pattern.
 *
 * @example
 * <Accordion type="single" collapsible defaultValue="a">
 *   <AccordionItem value="a">
 *     <AccordionTrigger>Section A</AccordionTrigger>
 *     <AccordionContent>Content A</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 *
 * Accessibility: each trigger is a `<button>` inside a heading (`headingLevel`) with
 * `aria-expanded` and `aria-controls`; each panel is a `region` labelled by its trigger and is
 * `hidden` while closed. Enter and Space toggle the focused item; Arrow Down/Up move the focus to
 * the next/previous trigger and wrap around; Home and End go to the first and last trigger.
 *
 * Props: `type`, `collapsible` (single only), `value` / `defaultValue` / `onValueChange`
 * (controlled and uncontrolled), `disabled`, `headingLevel`.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { className, headingLevel = 3, ...props },
  ref,
) {
  return (
    <HeadingLevelContext.Provider value={headingLevel}>
      <RadixAccordion.Root
        {...(props as RadixAccordion.AccordionSingleProps)}
        ref={ref}
        className={cx('ds-accordion', className)}
      />
    </HeadingLevelContext.Provider>
  );
});

Accordion.displayName = 'Accordion';

export type AccordionItemProps = ComponentPropsWithoutRef<typeof RadixAccordion.Item>;

/** One section. `value` is required and must be unique inside the accordion. */
export const AccordionItem = forwardRef<ElementRef<typeof RadixAccordion.Item>, AccordionItemProps>(
  function AccordionItem({ className, ...props }, ref) {
    return (
      <RadixAccordion.Item {...props} ref={ref} className={cx('ds-accordion__item', className)} />
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>;

/**
 * The button that toggles its item. It is wrapped in a heading of the accordion's `headingLevel`
 * and shows a chevron that rotates when the item is open. `className` goes on the button.
 */
export const AccordionTrigger = forwardRef<
  ElementRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(function AccordionTrigger({ className, children, ...props }, ref) {
  const level = useContext(HeadingLevelContext);
  return (
    <RadixAccordion.Header asChild>
      {createElement(
        `h${level}`,
        { className: 'ds-accordion__header' },
        <RadixAccordion.Trigger
          {...props}
          ref={ref}
          className={cx('ds-accordion__trigger', className)}
        >
          <span className="ds-accordion__trigger-label">{children}</span>
          <ChevronDownIcon className="ds-accordion__icon" aria-hidden="true" />
        </RadixAccordion.Trigger>,
      )}
    </RadixAccordion.Header>
  );
});

AccordionTrigger.displayName = 'AccordionTrigger';

export type AccordionContentProps = ComponentPropsWithoutRef<typeof RadixAccordion.Content>;

/** The panel of an item (`role="region"`). It is `hidden` while the item is closed. */
export const AccordionContent = forwardRef<
  ElementRef<typeof RadixAccordion.Content>,
  AccordionContentProps
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <RadixAccordion.Content {...props} ref={ref} className={cx('ds-accordion__content', className)}>
      <div className="ds-accordion__content-inner">{children}</div>
    </RadixAccordion.Content>
  );
});

AccordionContent.displayName = 'AccordionContent';
