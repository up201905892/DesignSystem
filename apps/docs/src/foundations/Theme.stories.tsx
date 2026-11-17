import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import { tokens } from '@up201905892/tokens';
import { asTree, flatten, Page } from './utils';

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
        data-testid="theme-surface"
        style={{
          background: 'var(--ds-color-bg-surface)',
          border: 'var(--ds-border-width-1) solid var(--ds-color-border-default)',
          borderRadius: 'var(--ds-radius-md)',
          boxShadow: 'var(--ds-shadow-raised)',
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
  play: async ({ canvasElement }) => {
    const surface = canvasElement.querySelector<HTMLElement>('[data-testid="theme-surface"]');
    if (!surface) throw new Error('Surface not found');
    const root = getComputedStyle(document.documentElement);
    // Resolve a shadow token to the browser's normalised box-shadow string.
    const resolve = (cssVar: string) => {
      const probe = document.createElement('div');
      probe.style.boxShadow = root.getPropertyValue(cssVar).trim();
      document.body.appendChild(probe);
      const value = getComputedStyle(probe).boxShadow;
      probe.remove();
      return value;
    };
    const actual = getComputedStyle(surface).boxShadow;
    await expect(actual).not.toBe('none');
    await expect(actual).toBe(resolve('--ds-shadow-raised'));
    // The first primitive shadow (the old, nearly invisible one in dark) must not be used.
    const [primitive] = flatten(asTree({ shadow: tokens.shadow }));
    if (!primitive) throw new Error('No primitive shadow tokens');
    await expect(actual).not.toBe(resolve(primitive.cssVar));
  },
};
