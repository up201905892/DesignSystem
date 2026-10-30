import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Button } from '../Button';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

describe('Popover (edge cases)', () => {
  it('keeps long unbroken content and passes axe in the dark theme', async () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    render(
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="Long" showClose>
          {'x'.repeat(300)}
        </PopoverContent>
      </Popover>,
    );
    expect(screen.getByRole('dialog')).toHaveTextContent('x'.repeat(300));
    await expectNoA11yViolations(document.body);
    document.documentElement.removeAttribute('data-theme');
  });
});
