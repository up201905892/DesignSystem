import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

function readNames(run: () => void) {
  const spy = vi.spyOn(CSSStyleDeclaration.prototype, 'getPropertyValue');
  run();
  const names = spy.mock.calls.map(([name]) => name);
  spy.mockRestore();
  return names;
}

describe('Tooltip offsets', () => {
  it('reads the default offset and collision padding from the spacing tokens', () => {
    const names = readNames(() =>
      render(
        <Tooltip content="Help" defaultOpen>
          <Button>Trigger</Button>
        </Tooltip>,
      ),
    );
    expect(names).toContain('--ds-space-2');
  });

  it('reads sideOffset from the token step given', () => {
    const names = readNames(() =>
      render(
        <Tooltip content="Help" defaultOpen sideOffset="4">
          <Button>Trigger</Button>
        </Tooltip>,
      ),
    );
    expect(names).toContain('--ds-space-4');
    expect(names).toContain('--ds-space-2');
  });

  it('rejects a numeric sideOffset at compile time', () => {
    const element = (
      // @ts-expect-error sideOffset is a step of the spacing scale, not a number
      <Tooltip content="Help" sideOffset={6}>
        <Button>Trigger</Button>
      </Tooltip>
    );
    expect(element).toBeTruthy();
  });
});
