import { Button } from '@up201905892/ui';

export function FirstButton() {
  // The default variant is "primary"; try "secondary", "ghost" or "danger".
  return <Button onClick={() => window.alert('Hello from the design system')}>Save changes</Button>;
}
