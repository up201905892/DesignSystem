import { createRef, useState, type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/a11y';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

function Example(props: ComponentProps<typeof Tabs>) {
  return (
    <Tabs defaultValue="a" {...props}>
      <TabsList aria-label="Letters">
        <TabsTrigger value="a">Alpha</TabsTrigger>
        <TabsTrigger value="b">Beta</TabsTrigger>
        <TabsTrigger value="c" disabled>
          Gamma
        </TabsTrigger>
        <TabsTrigger value="d">Delta</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Panel A</TabsContent>
      <TabsContent value="b">Panel B</TabsContent>
      <TabsContent value="c">Panel C</TabsContent>
      <TabsContent value="d">Panel D</TabsContent>
    </Tabs>
  );
}

const tab = (name: string) => screen.getByRole('tab', { name });

describe('Tabs', () => {
  it('shows the panel of defaultValue only', () => {
    render(<Example />);
    expect(screen.getByText('Panel A')).toBeVisible();
    expect(screen.queryByText('Panel B')).not.toBeInTheDocument();
  });

  it('has the tablist, tab and tabpanel semantics', () => {
    render(<Example />);
    const list = screen.getByRole('tablist', { name: 'Letters' });
    expect(list).toHaveAttribute('aria-orientation', 'horizontal');
    expect(tab('Alpha')).toHaveAttribute('aria-selected', 'true');
    expect(tab('Beta')).toHaveAttribute('aria-selected', 'false');
    const panel = screen.getByRole('tabpanel');
    expect(tab('Alpha')).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab('Alpha').id);
    expect(panel).toHaveAttribute('tabindex', '0');
  });

  it('changes panel on click and calls onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await userEvent.click(tab('Beta'));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByText('Panel B')).toBeVisible();
    expect(screen.queryByText('Panel A')).not.toBeInTheDocument();
  });

  it('works controlled', async () => {
    function Controlled() {
      const [value, setValue] = useState('a');
      return <Example value={value} onValueChange={setValue} defaultValue={undefined} />;
    }
    render(<Controlled />);
    await userEvent.click(tab('Delta'));
    expect(screen.getByText('Panel D')).toBeVisible();
  });

  it('does not change when the controlled value is not updated', async () => {
    render(<Example value="a" onValueChange={() => {}} defaultValue={undefined} />);
    await userEvent.click(tab('Beta'));
    expect(screen.getByText('Panel A')).toBeVisible();
  });

  it('does not activate a disabled tab', async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await userEvent.click(tab('Gamma'));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByText('Panel A')).toBeVisible();
  });

  it('keeps only the active tab in the tab order and Tab goes to the panel', async () => {
    render(<Example />);
    await userEvent.tab();
    expect(tab('Alpha')).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('moves with arrows, wraps, skips disabled and activates (automatic)', async () => {
    render(<Example />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Beta')).toHaveFocus();
    expect(screen.getByText('Panel B')).toBeVisible();
    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Delta')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Alpha')).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(tab('Delta')).toHaveFocus();
    expect(screen.getByText('Panel D')).toBeVisible();
  });

  it('goes to the first and last tab with Home and End', async () => {
    render(<Example />);
    await userEvent.tab();
    await userEvent.keyboard('{End}');
    expect(tab('Delta')).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(tab('Alpha')).toHaveFocus();
  });

  it('uses Up and Down arrows when vertical', async () => {
    render(<Example orientation="vertical" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Alpha')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(tab('Beta')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(tab('Alpha')).toHaveFocus();
  });

  it('only moves focus with arrows in manual mode; Enter and Space activate', async () => {
    render(<Example activationMode="manual" />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Beta')).toHaveFocus();
    expect(screen.getByText('Panel A')).toBeVisible();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Panel B')).toBeVisible();
    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Delta')).toHaveFocus();
    expect(screen.getByText('Panel B')).toBeVisible();
    await userEvent.keyboard(' ');
    expect(screen.getByText('Panel D')).toBeVisible();
  });

  it('forwards refs and className', () => {
    const root = createRef<HTMLDivElement>();
    const list = createRef<HTMLDivElement>();
    const trigger = createRef<HTMLButtonElement>();
    const content = createRef<HTMLDivElement>();
    render(
      <Tabs ref={root} defaultValue="a" className="x">
        <TabsList ref={list} aria-label="L" className="y">
          <TabsTrigger ref={trigger} value="a" className="z">
            A
          </TabsTrigger>
        </TabsList>
        <TabsContent ref={content} value="a" className="w">
          P
        </TabsContent>
      </Tabs>,
    );
    expect(root.current).toHaveClass('ds-tabs', 'x');
    expect(list.current).toHaveClass('ds-tabs__list', 'y');
    expect(trigger.current).toHaveClass('ds-tabs__trigger', 'z');
    expect(content.current).toHaveClass('ds-tabs__content', 'w');
  });

  it('defaults to horizontal orientation and automatic activation', async () => {
    const root = createRef<HTMLDivElement>();
    render(<Example ref={root} />);
    expect(root.current).toHaveAttribute('data-orientation', 'horizontal');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    expect(tab('Alpha')).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tab('Beta')).toHaveFocus();
    expect(tab('Beta')).toHaveAttribute('aria-selected', 'true');
  });

  it('wraps, skips disabled tabs and supports Home/End when vertical', async () => {
    render(<Example orientation="vertical" />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowUp}');
    expect(tab('Delta')).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(tab('Beta')).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(tab('Delta')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(tab('Alpha')).toHaveFocus();
    expect(tab('Alpha')).toHaveAttribute('aria-selected', 'true');
  });

  it('accepts aria-labelledby as the accessible name of the list', () => {
    render(
      <>
        <h2 id="lbl">Named by heading</h2>
        <Tabs defaultValue="a">
          <TabsList aria-labelledby="lbl">
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
          <TabsContent value="a">P</TabsContent>
        </Tabs>
      </>,
    );
    expect(screen.getByRole('tablist', { name: 'Named by heading' })).toBeInTheDocument();
  });

  it('requires an accessible name on TabsList (type level)', () => {
    render(
      <Tabs defaultValue="a">
        {/* @ts-expect-error TabsList needs aria-label or aria-labelledby */}
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<Example />);
    await expectNoA11yViolations(container);
  });
});
