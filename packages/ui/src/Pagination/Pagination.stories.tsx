import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { pageCount: 10 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { pageCount: 5, defaultPage: 2 } };

export const ManyPages: Story = { args: { pageCount: 20, defaultPage: 5 } };

const exception =
  'The "previous" and "next" buttons use `aria-disabled` and `data-disabled` instead of `disabled`, on purpose: ' +
  'they stay focusable, so a keyboard user who presses "next" up to the last page does not lose the focus.';

export const FirstPage: Story = {
  args: { pageCount: 10, defaultPage: 1 },
  parameters: {
    docs: { description: { story: `On the first page "previous" is disabled. ${exception}` } },
  },
};

export const LastPage: Story = {
  args: { pageCount: 10, defaultPage: 10 },
  parameters: {
    docs: { description: { story: `On the last page "next" is disabled. ${exception}` } },
  },
};

export const SinglePage: Story = { args: { pageCount: 1 } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
      <Pagination size="sm" pageCount={10} defaultPage={3} label="Small pagination" />
      <Pagination size="md" pageCount={10} defaultPage={3} label="Medium pagination" />
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [page, setPage] = useState(3);
    return (
      <>
        <Pagination pageCount={12} page={page} onPageChange={setPage} />
        <p>Current page: {page}</p>
      </>
    );
  },
};

export const KeyboardInteraction: Story = {
  args: { pageCount: 5, defaultPage: 1 },
  parameters: {
    docs: {
      description: {
        story:
          'Focus "next" and activate it until the last page: the focus never leaves the "next" button, even when it becomes disabled.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const next = within(canvasElement).getByRole('button', { name: 'Next page' });
    // Reach "next" with Tab, as a keyboard user would (previous and page buttons come first).
    for (let i = 0; i < 10 && document.activeElement !== next; i += 1) {
      await userEvent.tab();
    }
    await expect(next).toHaveFocus();
    for (let page = 2; page <= 5; page += 1) {
      await userEvent.keyboard('{Enter}');
      await waitFor(() =>
        expect(canvasElement.querySelector('[aria-current="page"]')).toHaveTextContent(`${page}`),
      );
      await expect(document.activeElement).toBe(next);
    }
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    await expect(next).not.toHaveAttribute('disabled');
    await userEvent.keyboard('{Enter}');
    await expect(canvasElement.querySelector('[aria-current="page"]')).toHaveTextContent('5');
    await expect(document.activeElement).toBe(next);
    // The disabled "next" stays in the tab order: leave it and come back with the keyboard.
    await userEvent.tab({ shift: true });
    await expect(next).not.toHaveFocus();
    await userEvent.tab();
    await expect(next).toHaveFocus();
  },
};

export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
      <Pagination pageCount={20} defaultPage={5} label="Many pages" />
      <Pagination pageCount={10} defaultPage={1} size="sm" label="First page" />
    </div>
  ),
};
