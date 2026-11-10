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

export const FocusRing: Story = {
  render: () => <Controls />,
  play: ({ canvasElement }) => {
    const button = canvasElement.querySelector<HTMLElement>('button');
    if (!button) throw new Error('No button');
    button.focus();
    const width = getComputedStyle(button).outlineWidth;
    if (width !== '2px') throw new Error(`Focus ring width is ${width}, expected 2px`);
  },
};

export const DarkTheme: Story = {
  name: 'FocusRing/DarkTheme',
  parameters: { theme: 'dark' },
  render: () => <Controls />,
};
