import type { Meta, StoryObj } from '@storybook/react';
import { Page } from './utils';

const meta = {
  title: 'Foundations/Theme',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

function Sample() {
  return (
    <Page title="Theme example">
      <p style={{ color: 'var(--ds-color-text-muted)' }}>
        Follows the Theme selector in the toolbar, unless the story forces a theme.
      </p>
      <div
        style={{
          background: 'var(--ds-color-bg-surface)',
          border: '1px solid var(--ds-color-border-default)',
          borderRadius: 'var(--ds-radius-md)',
          boxShadow: 'var(--ds-shadow-sm)',
          padding: 'var(--ds-space-4)',
        }}
      >
        Surface with default text
      </div>
    </Page>
  );
}

export const Default: Story = { render: () => <Sample /> };

/** Convention for every component: a `DarkTheme` story forces the dark theme. */
export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => <Sample />,
};
