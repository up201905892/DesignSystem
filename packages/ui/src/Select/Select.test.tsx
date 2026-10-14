import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { expectNoA11yViolations } from '../../test/a11y';
import { Field, FieldDescription, FieldError, FieldLabel } from '../Field';
import { Select, SelectGroup, SelectItem, SelectSeparator } from './Select';

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

function Fruits(props: Partial<React.ComponentProps<typeof Select>>) {
  return (
    <Select aria-label="Fruit" placeholder="Pick a fruit" {...props}>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana" disabled>
        Banana
      </SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
      <SelectItem value="date">Date</SelectItem>
    </Select>
  );
}

describe('Select', () => {
  it('shows the placeholder without a value', () => {
    render(<Fruits />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveTextContent('Pick a fruit');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the item text for defaultValue', () => {
    render(<Fruits defaultValue="cherry" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });

  it('selects an item, calls onValueChange and closes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fruits onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onValueChange).toHaveBeenCalledWith('cherry');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });

  it('marks the selected item with aria-selected and a check icon', async () => {
    const user = userEvent.setup();
    render(<Fruits defaultValue="apple" />);
    await user.click(screen.getByRole('combobox'));
    const option = screen.getByRole('option', { name: 'Apple' });
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(option.querySelector('svg')).not.toBeNull();
    expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('works in controlled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Fruits value="apple" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Date' }));
    expect(onValueChange).toHaveBeenCalledWith('date');
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    rerender(<Fruits value="date" onValueChange={onValueChange} />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Date');
  });

  it('works with a controlled open state', async () => {
    const user = userEvent.setup();
    function Open() {
      const [open, setOpen] = useState(true);
      return <Fruits open={open} onOpenChange={setOpen} />;
    }
    render(<Open />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not select a disabled item', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Fruits onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    const banana = screen.getByRole('option', { name: 'Banana' });
    expect(banana).toHaveAttribute('aria-disabled', 'true');
    await user.click(banana);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Fruits disabled />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('puts the value in FormData', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Fruits name="fruit" defaultValue="apple" />
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    expect(new FormData(form).get('fruit')).toBe('apple');
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Date' }));
    expect(new FormData(form).get('fruit')).toBe('date');
  });

  it('sets data-size, className, ref and displayName on the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Fruits ref={ref} size="lg" className="custom" />);
    const trigger = screen.getByRole('combobox');
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveClass('ds-select', 'custom');
    expect(trigger).toHaveAttribute('data-size', 'lg');
    expect(Select.displayName).toBe('Select');
  });

  it('defaults to size md', () => {
    render(<Fruits />);
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'md');
  });

  it('sets aria-invalid and data-invalid with invalid', () => {
    render(<Fruits invalid />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAttribute('data-invalid');
  });

  it('renders groups and separators', async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="Food" placeholder="Pick">
        <SelectGroup label="Fruit">
          <SelectItem value="apple">Apple</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup label="Vegetables">
          <SelectItem value="carrot">Carrot</SelectItem>
        </SelectGroup>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('group', { name: 'Fruit' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Vegetables' })).toBeInTheDocument();
    // Radix hides the separator from assistive technology (it is decorative).
    expect(document.querySelector('.ds-select__separator')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the list in a portal outside the container', async () => {
    const user = userEvent.setup();
    const { container } = render(<Fruits />);
    await user.click(screen.getByRole('combobox'));
    expect(container.contains(screen.getByRole('listbox'))).toBe(false);
  });

  describe('keyboard', () => {
    it.each(['{Enter}', ' ', '{ArrowDown}', '{ArrowUp}'])('opens with %j', async (key) => {
      const user = userEvent.setup();
      render(<Fruits />);
      await user.tab();
      expect(screen.getByRole('combobox')).toHaveFocus();
      await user.keyboard(key);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('moves the active item with arrows, skipping disabled items', async () => {
      const user = userEvent.setup();
      render(<Fruits />);
      await user.tab();
      await user.keyboard('{Enter}');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('option', { name: 'Cherry' })).toHaveFocus();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();
    });

    it('goes to the first and last items with Home and End', async () => {
      const user = userEvent.setup();
      render(<Fruits defaultValue="cherry" />);
      await user.tab();
      await user.keyboard('{Enter}');
      await user.keyboard('{End}');
      expect(screen.getByRole('option', { name: 'Date' })).toHaveFocus();
      await user.keyboard('{Home}');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();
    });

    it('jumps to the item that starts with the typed letter', async () => {
      const user = userEvent.setup();
      render(<Fruits />);
      await user.tab();
      await user.keyboard('{Enter}');
      await user.keyboard('d');
      expect(screen.getByRole('option', { name: 'Date' })).toHaveFocus();
    });

    it.each(['{Enter}', ' '])('selects the active item with %j and returns focus', async (key) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Fruits onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard('{Enter}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard(key);
      expect(onValueChange).toHaveBeenCalledWith('cherry');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('closes with Escape without changing the value and returns focus', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Fruits defaultValue="apple" onValueChange={onValueChange} />);
      await user.tab();
      await user.keyboard('{Enter}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
  });

  describe('Field integration', () => {
    it('associates the label and applies aria-describedby and aria-invalid', () => {
      render(
        <Field invalid required>
          <FieldLabel>Fruit</FieldLabel>
          <Select placeholder="Pick">
            <SelectItem value="apple">Apple</SelectItem>
          </Select>
          <FieldDescription>Choose one.</FieldDescription>
          <FieldError>Required.</FieldError>
        </Field>,
      );
      const trigger = screen.getByRole('combobox', { name: /Fruit/ });
      expect(trigger).toHaveAttribute('aria-invalid', 'true');
      expect(trigger).toHaveAttribute('aria-required', 'true');
      expect(trigger).toHaveAccessibleDescription('Choose one. Required.');
    });

    it('lets direct props win over the Field', () => {
      render(
        <Field disabled>
          <FieldLabel>Fruit</FieldLabel>
          <Select disabled={false} placeholder="Pick">
            <SelectItem value="apple">Apple</SelectItem>
          </Select>
        </Field>,
      );
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    it('disables the trigger from a disabled Field', () => {
      render(
        <Field disabled>
          <FieldLabel>Fruit</FieldLabel>
          <Select placeholder="Pick">
            <SelectItem value="apple">Apple</SelectItem>
          </Select>
        </Field>,
      );
      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations when closed', async () => {
      const { container } = render(<Fruits />);
      await expectNoA11yViolations(container);
    });

    it('has no axe violations when open', async () => {
      const user = userEvent.setup();
      const { baseElement } = render(<Fruits defaultValue="apple" />);
      await user.click(screen.getByRole('combobox'));
      // The portal sits outside any landmark, so the page-level `region` rule does not apply.
      const results = await axe(baseElement, { rules: { region: { enabled: false } } });
      expect(results.violations).toEqual([]);
    });
  });
});
