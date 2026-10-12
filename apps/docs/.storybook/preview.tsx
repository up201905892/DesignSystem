import type { Decorator, Preview } from '@storybook/react';
import { useLayoutEffect } from 'react';
import '@ds/tokens/tokens.css';
import '@ds/tokens/themes.css';

type Theme = 'light' | 'dark';

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

function ThemeFrame({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const { body } = document;
    root.dataset.theme = theme;
    body.style.backgroundColor = 'var(--ds-color-bg-canvas)';
    body.style.color = 'var(--ds-color-text-default)';
  }, [theme]);
  return <>{children}</>;
}

/** `parameters.theme` of a story wins over the toolbar value (`globals.theme`). */
const withTheme: Decorator = (Story, context) => {
  const forced: unknown = context.parameters.theme;
  const theme: Theme = isTheme(forced)
    ? forced
    : isTheme(context.globals.theme)
      ? context.globals.theme
      : 'light';
  return (
    <ThemeFrame theme={theme}>
      <Story />
    </ThemeFrame>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'light' },
          { value: 'dark', title: 'dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    a11y: {
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    },
  },
};

export default preview;
