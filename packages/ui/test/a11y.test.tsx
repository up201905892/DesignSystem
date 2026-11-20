import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from './a11y';

describe('expectNoA11yViolations', () => {
  it('passes for accessible markup', async () => {
    const { container } = render(<button type="button">Save</button>);
    await expectNoA11yViolations(container);
  });

  it('fails for an img without alt', async () => {
    // eslint-disable-next-line jsx-a11y/alt-text -- intentionally invalid markup
    const { container } = render(<img src="x.png" />);
    await expect(expectNoA11yViolations(container)).rejects.toThrow(/image-alt/);
  });

  it('fails for a button without an accessible name', async () => {
    const { container } = render(<button type="button" />);
    await expect(expectNoA11yViolations(container)).rejects.toThrow(/button-name/);
  });

  it('fails for an input without a label', async () => {
    const { container } = render(<input type="text" />);
    await expect(expectNoA11yViolations(container)).rejects.toThrow(/label/);
  });

  it('handles overlapping calls without "Axe is already running"', async () => {
    // eslint-disable-next-line jsx-a11y/alt-text -- intentionally invalid markup
    const { container } = render(<img src="x.png" />);
    const results = await Promise.allSettled([
      expectNoA11yViolations(container),
      expectNoA11yViolations(container),
      expectNoA11yViolations(container),
    ]);
    for (const result of results) {
      expect(result.status).toBe('rejected');
      expect(String((result as PromiseRejectedResult).reason)).toMatch(/image-alt/);
    }
  });
});
