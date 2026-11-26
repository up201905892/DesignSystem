import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../src/Dialog';
import { expectNoA11yViolations } from './a11y';

const PREFIX = 'expectNoA11yViolations: target is hidden from assistive technology';

/** Appends `<div#wrapper.outer.box ...attrs><div><img alt="ok"></div></div>` to the body. */
function mountInWrapper(attrs: Record<string, string>, img = '<img src="x.png" alt="ok">') {
  const wrapper = document.createElement('div');
  wrapper.id = 'wrapper';
  wrapper.className = 'outer box';
  for (const [k, v] of Object.entries(attrs)) wrapper.setAttribute(k, v);
  const target = document.createElement('div');
  target.innerHTML = img;
  wrapper.appendChild(target);
  document.body.appendChild(wrapper);
  return { target, wrapper };
}

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

  describe('hidden targets (DS-062)', () => {
    it.each([
      ['aria-hidden="true"', { 'aria-hidden': 'true' }],
      ['inert', { inert: '' }],
      ['hidden', { hidden: '' }],
      ['display: none', { style: 'display: none' }],
    ])('rejects a valid target under an ancestor with %s', async (reason, attrs) => {
      const { target, wrapper } = mountInWrapper(attrs);
      try {
        const error = await expectNoA11yViolations(target).then(
          () => null,
          (e: unknown) => e as Error,
        );
        expect(error).not.toBeNull();
        expect(error?.message.startsWith(PREFIX)).toBe(true);
        expect(error?.message).toContain(`(${reason} on an ancestor <div>#wrapper.outer.box)`);
      } finally {
        wrapper.remove();
      }
    });

    it('rejects a target that is itself aria-hidden', async () => {
      const { target, wrapper } = mountInWrapper({});
      target.setAttribute('aria-hidden', 'true');
      try {
        await expect(expectNoA11yViolations(target)).rejects.toThrow(
          /target is hidden from assistive technology \(aria-hidden="true" on the target <div>\)/,
        );
      } finally {
        wrapper.remove();
      }
    });

    it('regression: an img without alt under an aria-hidden ancestor no longer passes silently', async () => {
      const { target, wrapper } = mountInWrapper({ 'aria-hidden': 'true' }, '<img src="x.png">');
      try {
        await expect(expectNoA11yViolations(target)).rejects.toThrow(PREFIX);
      } finally {
        wrapper.remove();
      }
    });

    it('does not fail for aria-hidden="false" on an ancestor', async () => {
      const { target, wrapper } = mountInWrapper({ 'aria-hidden': 'false' });
      try {
        await expectNoA11yViolations(target);
      } finally {
        wrapper.remove();
      }
    });

    it('does not fail for hidden content inside the target', async () => {
      const { container } = render(
        <button type="button">
          <span aria-hidden="true">
            <svg width="8" height="8" />
          </span>
          Save
        </button>,
      );
      await expectNoA11yViolations(container);
    });

    it('with an open Dialog: rejects the container (aria-hidden), resolves document.body', async () => {
      const { container } = render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogContent>
        </Dialog>,
      );
      await screen.findByRole('dialog');
      await expect(expectNoA11yViolations(container)).rejects.toThrow(
        /\(aria-hidden="true" on an ancestor|\(aria-hidden="true" on the target/,
      );
      await expectNoA11yViolations(document.body);
    });

    it('serialises overlapping calls: hidden target rejects, valid target resolves', async () => {
      const { target, wrapper } = mountInWrapper({ 'aria-hidden': 'true' });
      const valid = render(<button type="button">Ok</button>);
      try {
        const results = await Promise.allSettled([
          expectNoA11yViolations(target),
          expectNoA11yViolations(valid.container),
        ]);
        expect(results[0].status).toBe('rejected');
        expect(String((results[0] as PromiseRejectedResult).reason)).toContain(PREFIX);
        expect(results[1].status).toBe('fulfilled');
      } finally {
        wrapper.remove();
      }
    });
  });
});
