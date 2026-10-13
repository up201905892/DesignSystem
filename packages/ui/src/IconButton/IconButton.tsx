import { forwardRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../Button';

type NameProps =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-labelledby': string; 'aria-label'?: string };

export type IconButtonProps = Omit<ButtonProps, 'leadingIcon' | 'trailingIcon' | 'fullWidth'> &
  NameProps & {
    /** The icon to show. It is decorative and wrapped in an `aria-hidden` span. */
    icon: ReactNode;
  };

/**
 * A square button with only an icon. It always needs an accessible name.
 *
 * @example
 * <IconButton aria-label="Close" icon={<XIcon />} variant="ghost" />
 * <IconButton asChild aria-label="Settings" icon={<CogIcon />}><a href="/settings" /></IconButton>
 *
 * Accessibility: `aria-label` is required (or `aria-labelledby`), so the button is never
 * unnamed. Works with Tab, Enter and Space and shows a visible focus ring. Behaviour of
 * `disabled` and `asChild` is the same as in `Button`.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, ...props },
  ref,
) {
  return <Button ref={ref} {...props} leadingIcon={icon} data-icon-only="" />;
});

IconButton.displayName = 'IconButton';
