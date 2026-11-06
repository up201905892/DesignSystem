import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type DropdownMenuContentProps,
} from './DropdownMenu';

function Example({ content }: { content?: DropdownMenuContentProps }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent {...content}>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function openAndReadNames(content?: DropdownMenuContentProps) {
  const user = userEvent.setup();
  const spy = vi.spyOn(CSSStyleDeclaration.prototype, 'getPropertyValue');
  render(<Example content={content} />);
  await user.click(screen.getByRole('button', { name: 'Actions' }));
  const names = spy.mock.calls.map(([name]) => name);
  spy.mockRestore();
  return names;
}

describe('DropdownMenu offsets', () => {
  it('reads the default offset and collision padding from the spacing tokens', async () => {
    const names = await openAndReadNames();
    expect(names).toContain('--ds-space-1');
    expect(names).toContain('--ds-space-2');
  });

  it('reads sideOffset from the token step given', async () => {
    const names = await openAndReadNames({ sideOffset: '4' });
    expect(names).toContain('--ds-space-4');
    expect(names).toContain('--ds-space-2');
  });

  it('rejects a numeric sideOffset at compile time', () => {
    // @ts-expect-error sideOffset is a step of the spacing scale, not a number
    const content: DropdownMenuContentProps = { sideOffset: 6 };
    expect(content).toBeTruthy();
  });
});
