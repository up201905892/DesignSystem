import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { pageCount: 10 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const next = canvasElement.querySelector<HTMLButtonElement>('button[aria-label="Next page"]');
    if (!next) throw new Error('No next button');
    next.focus();
    // `click()` is what Enter does on a focused button.
    for (let i = 0; i < 4; i += 1) {
      next.click();
      await wait(20);
      if (document.activeElement !== next) throw new Error('Focus left the next button');
    }
    const current = canvasElement.querySelector('[aria-current="page"]');
    if (current?.textContent !== '5') throw new Error('Did not reach the last page');
    if (next.getAttribute('aria-disabled') !== 'true') throw new Error('Next is not disabled');
    if (next.hasAttribute('disabled')) throw new Error('Next must not use the disabled attribute');
    next.click();
    await wait(20);
    if (document.activeElement !== next) throw new Error('Focus left the next button');
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
