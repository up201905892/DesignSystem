import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Field, FieldDescription, FieldError } from '../Field';
import { Radio, RadioGroup } from './RadioGroup';

function Basic(props: Partial<React.ComponentProps<typeof RadioGroup>>) {
  return (
    <RadioGroup aria-label="Plan" {...props}>
      <Radio value="free">Free</Radio>
      <Radio value="pro">Pro</Radio>
      <Radio value="team">Team</Radio>
    </RadioGroup>
  );
}

const radio = (name: string) => screen.getByRole('radio', { name });

/**
 * Radix selects a radio on focus only while an arrow key is still down, and it moves focus on
 * a timer. `user.keyboard('{ArrowDown}')` releases the key too soon in jsdom, so hold it first.
 */
async function press(user: ReturnType<typeof userEvent.setup>, key: string) {
  await user.keyboard(`{${key}>}`);
  await user.keyboard(`{/${key}}`);
}

describe('RadioGroup', () => {
  it('has role radiogroup with a name and radios named by children', () => {
    render(<Basic />);
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(radio('Free')).toHaveAttribute('aria-checked', 'false');
  });

  it('accepts aria-labelledby as the name', () => {
    render(
      <>
        <span id="lbl">Choose</span>
        <RadioGroup aria-labelledby="lbl">
          <Radio value="a">A</Radio>
        </RadioGroup>
      </>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Choose' })).toBeInTheDocument();
  });

  it('selects on click and unselects the previous one', async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(radio('Free'));
    expect(radio('Free')).toHaveAttribute('aria-checked', 'true');
    await user.click(radio('Pro'));
    expect(radio('Pro')).toHaveAttribute('aria-checked', 'true');
    expect(radio('Free')).toHaveAttribute('aria-checked', 'false');
  });

  it('selects when the label text is clicked', async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByText('Pro'));
    expect(radio('Pro')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onValueChange with the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} />);
    await user.click(radio('Team'));
    expect(onValueChange).toHaveBeenCalledWith('team');
  });

  it('respects defaultValue', () => {
    render(<Basic defaultValue="pro" />);
    expect(radio('Pro')).toHaveAttribute('aria-checked', 'true');
    expect(radio('Pro')).toHaveAttribute('data-state', 'checked');
  });

  it('only changes in controlled mode when the value prop changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Basic value="free" onValueChange={onValueChange} />);
    await user.click(radio('Pro'));
    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(radio('Free')).toHaveAttribute('aria-checked', 'true');
    rerender(<Basic value="pro" onValueChange={onValueChange} />);
    expect(radio('Pro')).toHaveAttribute('aria-checked', 'true');
  });

  it('works controlled with state', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('free');
      return <Basic value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    await user.click(radio('Team'));
    expect(radio('Team')).toHaveAttribute('aria-checked', 'true');
    expect(radio('Free')).toHaveAttribute('aria-checked', 'false');
  });

  it('does not select a disabled radio', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Plan" onValueChange={onValueChange}>
        <Radio value="free">Free</Radio>
        <Radio value="pro" disabled>
          Pro
        </Radio>
      </RadioGroup>,
    );
    await user.click(radio('Pro'));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(radio('Pro')).toBeDisabled();
  });

  it('disables every radio when the group is disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic disabled onValueChange={onValueChange} />);
    for (const item of screen.getAllByRole('radio')) expect(item).toBeDisabled();
    await user.click(radio('Free'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('puts the selected value in FormData when named', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Basic name="plan" defaultValue="free" />
      </form>,
    );
    const form = container.querySelector('form')!;
    expect(new FormData(form).get('plan')).toBe('free');
    await user.click(radio('Pro'));
    expect(new FormData(form).get('plan')).toBe('pro');
  });

  it('sets aria-orientation, vertical by default', () => {
    const { rerender } = render(<Basic />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'vertical');
    rerender(<Basic orientation="horizontal" />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'horizontal');
    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('forwards ref and className, sets displayName and size', () => {
    const ref = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    render(
      <RadioGroup ref={ref} aria-label="Plan" className="custom" data-testid="group">
        <Radio ref={itemRef} value="a" size="sm" className="mine">
          A
        </Radio>
      </RadioGroup>,
    );
    expect(ref.current).toBe(screen.getByTestId('group'));
    expect(ref.current).toHaveClass('ds-radio-group', 'custom');
    expect(itemRef.current).toBe(radio('A'));
    expect(itemRef.current).toHaveClass('ds-radio__control', 'mine');
    expect(itemRef.current).toHaveAttribute('data-size', 'sm');
    expect(RadioGroup.displayName).toBe('RadioGroup');
    expect(Radio.displayName).toBe('Radio');
  });

  it('marks the group invalid', () => {
    render(<Basic invalid />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
  });

  describe('keyboard', () => {
    it('Tab enters on the selected radio and the next Tab leaves the group', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Basic defaultValue="pro" />
          <button>After</button>
        </>,
      );
      await user.tab();
      expect(radio('Pro')).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('Tab enters on the first enabled radio when none is selected', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup aria-label="Plan">
          <Radio value="free" disabled>
            Free
          </Radio>
          <Radio value="pro">Pro</Radio>
          <Radio value="team">Team</Radio>
        </RadioGroup>,
      );
      await user.tab();
      expect(radio('Pro')).toHaveFocus();
    });

    it('has a single tab stop: Shift+Tab from outside lands on the selected radio', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Basic defaultValue="pro" />
          <button>After</button>
        </>,
      );
      screen.getByRole('button', { name: 'After' }).focus();
      await user.tab({ shift: true });
      expect(radio('Pro')).toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    });

    it('ArrowDown and ArrowRight move to the next radio and select it', async () => {
      const user = userEvent.setup();
      render(<Basic defaultValue="free" />);
      await user.tab();
      await press(user, 'ArrowDown');
      expect(radio('Pro')).toHaveFocus();
      expect(radio('Pro')).toHaveAttribute('aria-checked', 'true');
      await press(user, 'ArrowRight');
      expect(radio('Team')).toHaveFocus();
      expect(radio('Team')).toHaveAttribute('aria-checked', 'true');
      expect(radio('Pro')).toHaveAttribute('aria-checked', 'false');
    });

    it('ArrowUp and ArrowLeft move to the previous radio and select it', async () => {
      const user = userEvent.setup();
      render(<Basic defaultValue="team" />);
      await user.tab();
      await press(user, 'ArrowUp');
      expect(radio('Pro')).toHaveFocus();
      expect(radio('Pro')).toHaveAttribute('aria-checked', 'true');
      await press(user, 'ArrowLeft');
      expect(radio('Free')).toHaveFocus();
      expect(radio('Free')).toHaveAttribute('aria-checked', 'true');
    });

    it('wraps around from the last to the first and back', async () => {
      const user = userEvent.setup();
      render(<Basic defaultValue="team" />);
      await user.tab();
      await press(user, 'ArrowDown');
      expect(radio('Free')).toHaveFocus();
      await press(user, 'ArrowUp');
      expect(radio('Team')).toHaveFocus();
    });

    it('works the same in a horizontal group', async () => {
      const user = userEvent.setup();
      render(<Basic orientation="horizontal" defaultValue="free" />);
      await user.tab();
      await press(user, 'ArrowRight');
      expect(radio('Pro')).toHaveFocus();
      await press(user, 'ArrowDown');
      expect(radio('Team')).toHaveFocus();
    });

    it('skips disabled radios', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup aria-label="Plan" defaultValue="free">
          <Radio value="free">Free</Radio>
          <Radio value="pro" disabled>
            Pro
          </Radio>
          <Radio value="team">Team</Radio>
        </RadioGroup>,
      );
      await user.tab();
      await press(user, 'ArrowDown');
      expect(radio('Team')).toHaveFocus();
      await press(user, 'ArrowDown');
      expect(radio('Free')).toHaveFocus();
    });

    it('Space selects the focused radio', async () => {
      const user = userEvent.setup();
      render(<Basic />);
      await user.tab();
      expect(radio('Free')).toHaveFocus();
      expect(radio('Free')).toHaveAttribute('aria-checked', 'false');
      await user.keyboard(' ');
      expect(radio('Free')).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Field integration', () => {
    it('gets aria-describedby and aria-invalid from the Field', () => {
      render(
        <Field invalid>
          <Basic />
          <FieldDescription>Pick one.</FieldDescription>
          <FieldError>Required.</FieldError>
        </Field>,
      );
      const group = screen.getByRole('radiogroup');
      expect(group).toHaveAttribute('aria-invalid', 'true');
      const ids = group.getAttribute('aria-describedby')!.split(' ');
      expect(ids).toHaveLength(2);
      expect(document.getElementById(ids[0]!)).toHaveTextContent('Pick one.');
      expect(document.getElementById(ids[1]!)).toHaveTextContent('Required.');
    });

    it('is valid without error, and disabled by the Field', () => {
      render(
        <Field disabled>
          <Basic />
        </Field>,
      );
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');
      for (const item of screen.getAllByRole('radio')) expect(item).toBeDisabled();
    });

    it('lets direct props win over the Field', () => {
      render(
        <Field invalid disabled>
          <Basic invalid={false} disabled={false} aria-describedby="mine" />
        </Field>,
      );
      const group = screen.getByRole('radiogroup');
      expect(group).not.toHaveAttribute('aria-invalid', 'true');
      expect(group).toHaveAttribute('aria-describedby', 'mine');
      for (const item of screen.getAllByRole('radio')) expect(item).toBeEnabled();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Basic defaultValue="free" />);
      await expectNoA11yViolations(container);
    });

    it('has no axe violations with a disabled radio, horizontal and in a Field', async () => {
      const { container } = render(
        <Field invalid>
          <RadioGroup aria-label="Plan" orientation="horizontal">
            <Radio value="a">A</Radio>
            <Radio value="b" disabled>
              B
            </Radio>
          </RadioGroup>
          <FieldError>Required.</FieldError>
        </Field>,
      );
      await expectNoA11yViolations(container);
    });
  });
});
