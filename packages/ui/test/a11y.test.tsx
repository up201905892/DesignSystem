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
});
