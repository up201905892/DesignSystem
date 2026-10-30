import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Alert } from './Alert';

describe('Alert edge cases', () => {
  it('accepts ReactNode as title and description', () => {
    render(
      <Alert title={<strong data-testid="t">Bold</strong>}>
        <em data-testid="d">Em</em>
      </Alert>,
    );
    expect(screen.getByTestId('t').closest('.ds-alert-title')).toBeInTheDocument();
    expect(screen.getByTestId('d').closest('.ds-alert-description')).toBeInTheDocument();
  });

  it('renders only the icon wrapper content and no text blocks when empty', async () => {
    const { container } = render(<Alert variant="danger" icon={false} />);
    expect(container.querySelector('.ds-alert-icon')).toBeNull();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('the close button has type button and the default name is "Close"', () => {
    render(
      <form>
        <Alert onClose={() => {}}>x</Alert>
      </form>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('type', 'button');
  });

  it('closing inside a form does not submit it', async () => {
    const onSubmit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Alert onClose={() => {}}>x</Alert>
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps the close button inside the alert and after the content in Tab order', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>before</button>
        <Alert onClose={() => {}}>x</Alert>
        <button>after</button>
      </>,
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
  });

  it('keeps a custom role and has no axe violations without title and icon', async () => {
    const { container } = render(
      <Alert variant="success" role="alert" icon={false} onClose={() => {}} closeLabel="Dismiss">
        Long Averyveryveryveryverylongwordwithoutanyspacesthatmustnotbreakthelayoutofthealertatall
      </Alert>,
    );
    expect(screen.getByRole('alert')).toHaveAttribute('data-variant', 'success');
    await expectNoA11yViolations(container);
  });
});
