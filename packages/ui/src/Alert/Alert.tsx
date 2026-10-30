import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon, XIcon } from '@ds/icons';
import { IconButton } from '../IconButton';
import { cx } from '../utils/cx';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Colour role and default icon of the alert. */
  variant?: AlertVariant;
  /** Short heading shown above the description. */
  title?: ReactNode;
  /** Icon to show. Defaults to the icon of the variant; `false` removes it. */
  icon?: ReactNode | false;
  /** Called when the close button is clicked. The close button only exists when this is set. */
  onClose?: () => void;
  /** Accessible name of the close button. */
  closeLabel?: string;
}

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <InfoIcon />,
  success: <CircleCheckIcon />,
  warning: <TriangleAlertIcon />,
  danger: <CircleXIcon />,
};

/**
 * An inline message with feedback about something: information, success, a warning or an error.
 *
 * @example
 * <Alert variant="danger" title="Payment failed">Check your card details and try again.</Alert>
 * <Alert variant="success" onClose={() => setOpen(false)}>Saved.</Alert>
 *
 * Accessibility: `danger` and `warning` use `role="alert"` (announced at once); `info` and
 * `success` use `role="status"` (announced politely). Pass `role` to change it. The icon is
 * decorative; the variant is carried by the icon shape and the text, not by colour alone.
 * The alert never hides itself: the consumer controls its visibility through `onClose`.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = 'info',
    title,
    icon,
    onClose,
    closeLabel = 'Close',
    role,
    className,
    children,
    ...props
  },
  ref,
) {
  const resolvedIcon = icon === undefined ? defaultIcons[variant] : icon;
  const hasTitle = title !== undefined && title !== null && title !== false;
  const hasChildren = children !== undefined && children !== null && children !== false;
  return (
    <div
      ref={ref}
      role={role ?? (variant === 'danger' || variant === 'warning' ? 'alert' : 'status')}
      className={cx('ds-alert', className)}
      data-variant={variant}
      {...props}
    >
      {resolvedIcon !== false && resolvedIcon !== null ? (
        <span className="ds-alert-icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      ) : null}
      <div className="ds-alert-content">
        {hasTitle ? <div className="ds-alert-title">{title}</div> : null}
        {hasChildren ? <div className="ds-alert-description">{children}</div> : null}
      </div>
      {onClose ? (
        <IconButton
          className="ds-alert-close"
          variant="ghost"
          size="sm"
          aria-label={closeLabel}
          icon={<XIcon />}
          onClick={onClose}
        />
      ) : null}
    </div>
  );
});

Alert.displayName = 'Alert';
