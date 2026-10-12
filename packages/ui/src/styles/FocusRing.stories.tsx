import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Foundations/FocusRing',
  parameters: {
    docs: {
      description: {
        component:
          'Common focus ring (`ds-focus-ring`): 2px outline with `--ds-color-focus-ring`. Press Tab to see it.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Controls() {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-4)', alignItems: 'center' }}>
      <button type="button" className="ds-focus-ring">
        Native button
      </button>
      <a href="#focus-ring" className="ds-focus-ring">
        Native link
      </a>
    </div>
  );
}

export const FocusRing: Story = { render: () => <Controls /> };

export const DarkTheme: Story = {
  name: 'FocusRing/DarkTheme',
  parameters: { theme: 'dark' },
  render: () => <Controls />,
};
