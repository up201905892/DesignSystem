import { forwardRef, type ReactNode, type SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref' | 'title'> {
  /** Width and height of the icon. Numbers are pixels. Defaults to `"1em"`. */
  size?: number | string;
  /** Accessible name. Without it the icon is decorative and hidden from assistive technology. */
  title?: string;
}

interface IconBaseProps extends IconProps {
  children?: ReactNode;
}

/** Shared <svg> wrapper used by every generated icon. */
export const IconBase = forwardRef<SVGSVGElement, IconBaseProps>(function IconBase(
  { size = '1em', title, children, ...rest },
  ref,
) {
  const a11yProps = title ? { role: 'img' } : { 'aria-hidden': true, focusable: false };
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11yProps}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
});
