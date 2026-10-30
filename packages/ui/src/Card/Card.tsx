import { forwardRef, type HTMLAttributes } from 'react';
import { Slot } from '../utils/Slot';
import { cx } from '../utils/cx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface style: a visible border (`outlined`) or a shadow (`elevated`). */
  variant?: 'outlined' | 'elevated';
  /** Inner padding of the card. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Render the child element (for example `<article>`, `<section>`, `<li>` or `<a>`) instead of a `<div>`. */
  asChild?: boolean;
}

/**
 * A surface that groups related content, with optional header, body and footer.
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Plan</CardTitle>
 *     <CardDescription>Billed monthly</CardDescription>
 *   </CardHeader>
 *   <CardBody>...</CardBody>
 *   <CardFooter><Button>Choose</Button></CardFooter>
 * </Card>
 *
 * Accessibility: a Card has no role and is not focusable. For a clickable card use
 * `asChild` over an `<a>`; it then gets the standard focus-visible ring.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'outlined', padding = 'md', asChild = false, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  return (
    <Comp
      ref={ref}
      className={cx('ds-card', className)}
      data-variant={variant}
      data-padding={padding}
      {...props}
    />
  );
});
Card.displayName = 'Card';

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

/** Groups the title and description at the top of a card. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('ds-card-header', className)} {...props} />;
});
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level, to keep the page's heading hierarchy correct. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/** The card heading. Renders an `<h3>` unless `as` says otherwise. */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as: Comp = 'h3', className, ...props },
  ref,
) {
  return <Comp ref={ref} className={cx('ds-card-title', className)} {...props} />;
});
CardTitle.displayName = 'CardTitle';

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

/** Secondary text under the title. */
export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cx('ds-card-description', className)} {...props} />;
  },
);
CardDescription.displayName = 'CardDescription';

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

/** The main content of a card. */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(function CardBody(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('ds-card-body', className)} {...props} />;
});
CardBody.displayName = 'CardBody';

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

/** Actions or metadata at the bottom of a card. */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('ds-card-footer', className)} {...props} />;
});
CardFooter.displayName = 'CardFooter';
