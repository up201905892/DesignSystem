import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionProps,
} from './Accordion';

function Items({ disabledB = false }: { disabledB?: boolean }) {
  return (
    <>
      <AccordionItem value="a">
        <AccordionTrigger>Alpha</AccordionTrigger>
        <AccordionContent>
          Panel A <button type="button">Inside A</button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b" disabled={disabledB}>
        <AccordionTrigger>Beta</AccordionTrigger>
        <AccordionContent>Panel B</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Gamma</AccordionTrigger>
        <AccordionContent>Panel C</AccordionContent>
      </AccordionItem>
    </>
  );
}

function Example(props: AccordionProps & { disabledB?: boolean }) {
  const { disabledB, ...rest } = props;
  return (
    <Accordion {...rest}>
      <Items disabledB={disabledB} />
    </Accordion>
  );
}

const trigger = (name: string) => screen.getByRole('button', { name });
const expanded = (name: string) => trigger(name).getAttribute('aria-expanded');

describe('Accordion', () => {
  it('has button triggers in h3 headings with aria-expanded, aria-controls and region panels', () => {
    render(<Example type="single" defaultValue="a" />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    expect(trigger('Alpha').closest('h3')).not.toBeNull();
    expect(expanded('Alpha')).toBe('true');
    expect(expanded('Beta')).toBe('false');
    const region = screen.getByRole('region', { name: 'Alpha' });
    expect(trigger('Alpha')).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveAttribute('aria-labelledby', trigger('Alpha').id);
  });

  it('hides closed content from the accessibility tree and from focus', () => {
    render(<Example type="single" defaultValue="a" />);
    // Radix unmounts closed panels, so they are neither focusable nor read by screen readers.
    expect(screen.queryByText('Panel B')).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Beta' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('region')).toHaveLength(1);
  });

  it('renders the heading level given by headingLevel', () => {
    render(<Example type="single" headingLevel={2} />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    expect(trigger('Alpha').parentElement?.tagName).toBe('H2');
  });

  it('single: opening an item closes the previous one', async () => {
    render(<Example type="single" defaultValue="a" />);
    await userEvent.click(trigger('Beta'));
    expect(expanded('Beta')).toBe('true');
    expect(expanded('Alpha')).toBe('false');
  });

  it('single with collapsible: clicking the open item closes it', async () => {
    render(<Example type="single" collapsible defaultValue="a" />);
    await userEvent.click(trigger('Alpha'));
    expect(expanded('Alpha')).toBe('false');
  });

  it('single without collapsible: the open item stays open', async () => {
    render(<Example type="single" defaultValue="a" />);
    await userEvent.click(trigger('Alpha'));
    expect(expanded('Alpha')).toBe('true');
  });

  it('multiple: several items stay open and onValueChange gets an array', async () => {
    const onValueChange = vi.fn();
    render(<Example type="multiple" onValueChange={onValueChange} />);
    await userEvent.click(trigger('Alpha'));
    await userEvent.click(trigger('Gamma'));
    expect(expanded('Alpha')).toBe('true');
    expect(expanded('Gamma')).toBe('true');
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'c']);
  });

  it('single: onValueChange gets a string', async () => {
    const onValueChange = vi.fn();
    render(<Example type="single" onValueChange={onValueChange} />);
    await userEvent.click(trigger('Beta'));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('opens the defaultValue items', () => {
    render(<Example type="multiple" defaultValue={['b', 'c']} />);
    expect(expanded('Alpha')).toBe('false');
    expect(expanded('Beta')).toBe('true');
    expect(expanded('Gamma')).toBe('true');
  });

  it('works controlled', async () => {
    function Controlled() {
      const [value, setValue] = useState('a');
      return <Example type="single" value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    expect(expanded('Alpha')).toBe('true');
    await userEvent.click(trigger('Gamma'));
    expect(expanded('Gamma')).toBe('true');
    expect(expanded('Alpha')).toBe('false');
  });

  it('controlled value does not change without the parent updating it', async () => {
    render(<Example type="single" value="a" />);
    await userEvent.click(trigger('Beta'));
    expect(expanded('Alpha')).toBe('true');
    expect(expanded('Beta')).toBe('false');
  });

  it('a disabled item does not open', async () => {
    render(<Example type="single" disabledB />);
    expect(trigger('Beta')).toBeDisabled();
    await userEvent.click(trigger('Beta'));
    expect(expanded('Beta')).toBe('false');
  });

  it('a disabled accordion does not open any item', async () => {
    render(<Example type="single" disabled />);
    await userEvent.click(trigger('Alpha'));
    expect(expanded('Alpha')).toBe('false');
  });

  it('shows the chevron icon hidden from assistive technology', () => {
    render(<Example type="single" />);
    const icon = trigger('Alpha').querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('ds-accordion__icon');
  });

  describe('keyboard', () => {
    it('Tab goes through the triggers', async () => {
      render(<Example type="single" />);
      await userEvent.tab();
      expect(trigger('Alpha')).toHaveFocus();
      await userEvent.tab();
      expect(trigger('Beta')).toHaveFocus();
      await userEvent.tab();
      expect(trigger('Gamma')).toHaveFocus();
    });

    it('Enter and Space toggle the focused item', async () => {
      render(<Example type="multiple" />);
      trigger('Alpha').focus();
      await userEvent.keyboard('{Enter}');
      expect(expanded('Alpha')).toBe('true');
      await userEvent.keyboard('{Enter}');
      expect(expanded('Alpha')).toBe('false');
      await userEvent.keyboard(' ');
      expect(expanded('Alpha')).toBe('true');
      await userEvent.keyboard(' ');
      expect(expanded('Alpha')).toBe('false');
    });

    it('Arrow Down and Up move the focus and wrap around', async () => {
      render(<Example type="single" />);
      trigger('Alpha').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(trigger('Beta')).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(trigger('Gamma')).toHaveFocus();
      await userEvent.keyboard('{ArrowDown}');
      expect(trigger('Alpha')).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      expect(trigger('Gamma')).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      expect(trigger('Beta')).toHaveFocus();
    });

    it('Home and End go to the first and last trigger', async () => {
      render(<Example type="single" />);
      trigger('Beta').focus();
      await userEvent.keyboard('{End}');
      expect(trigger('Gamma')).toHaveFocus();
      await userEvent.keyboard('{Home}');
      expect(trigger('Alpha')).toHaveFocus();
    });

    it('arrow keys skip a disabled trigger', async () => {
      render(<Example type="single" disabledB />);
      trigger('Alpha').focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(trigger('Gamma')).toHaveFocus();
    });

    it('with an item open, Tab enters the focusable elements of the panel', async () => {
      render(<Example type="single" defaultValue="a" />);
      trigger('Alpha').focus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Inside A' })).toHaveFocus();
      await userEvent.tab();
      expect(trigger('Beta')).toHaveFocus();
    });

    it('does not reach elements inside a closed panel with Tab', async () => {
      render(<Example type="single" />);
      trigger('Alpha').focus();
      await userEvent.tab();
      expect(trigger('Beta')).toHaveFocus();
      expect(screen.queryByRole('button', { name: 'Inside A' })).not.toBeInTheDocument();
    });
  });

  it('forwards ref and className on every part', () => {
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    render(
      <Accordion type="single" defaultValue="a" ref={rootRef} className="custom-root">
        <AccordionItem value="a" ref={itemRef} className="custom-item">
          <AccordionTrigger ref={triggerRef} className="custom-trigger">
            Alpha
          </AccordionTrigger>
          <AccordionContent ref={contentRef} className="custom-content">
            Panel A
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(rootRef.current).toHaveClass('ds-accordion', 'custom-root');
    expect(itemRef.current).toHaveClass('ds-accordion__item', 'custom-item');
    expect(triggerRef.current).toHaveClass('ds-accordion__trigger', 'custom-trigger');
    expect(contentRef.current).toHaveClass('ds-accordion__content', 'custom-content');
  });

  it('passes native props to the root', () => {
    render(<Example type="single" data-testid="root" id="acc" />);
    expect(screen.getByTestId('root')).toHaveAttribute('id', 'acc');
  });

  it('sets displayName on every part', () => {
    expect(Accordion.displayName).toBe('Accordion');
    expect(AccordionItem.displayName).toBe('AccordionItem');
    expect(AccordionTrigger.displayName).toBe('AccordionTrigger');
    expect(AccordionContent.displayName).toBe('AccordionContent');
  });

  it('has no axe violations with open and closed items', async () => {
    const { container } = render(<Example type="multiple" defaultValue={['a']} />);
    await expectNoA11yViolations(container);
  });

  it('has no axe violations with all items closed or with a disabled item', async () => {
    const { container } = render(<Example type="single" collapsible disabledB />);
    await expectNoA11yViolations(container);
  });
});
