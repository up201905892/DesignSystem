import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Select, SelectItem } from './Select';

// jsdom lacks these browser APIs, which Radix Select uses.
beforeAll(() => {
  const proto = window.HTMLElement.prototype;
  proto.scrollIntoView ??= vi.fn();
  proto.hasPointerCapture ??= vi.fn(() => false);
  proto.releasePointerCapture ??= vi.fn();
  proto.setPointerCapture ??= vi.fn();
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('Select offsets', () => {
  it('reads the offset and collision padding from the spacing tokens', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(CSSStyleDeclaration.prototype, 'getPropertyValue');
    render(
      <Select aria-label="Fruit" placeholder="Pick">
        <SelectItem value="apple">Apple</SelectItem>
      </Select>,
    );
    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    const names = spy.mock.calls.map(([name]) => name);
    spy.mockRestore();
    expect(names).toContain('--ds-space-1');
    expect(names).toContain('--ds-space-2');
  });
});
