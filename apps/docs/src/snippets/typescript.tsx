import { Button } from '@up201905892/ui';
import type { ButtonProps } from '@up201905892/ui';

// Every component exports its props type, so wrappers stay type-safe.
export function DangerButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="danger" />;
}

// Invalid values are compile-time errors:
// <Button variant="huge" />  // Type '"huge"' is not assignable to type ...
