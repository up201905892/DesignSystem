import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../../../packages/*/src/**/*.stories.tsx',
    '../src/**/*.mdx',
    '../src/**/*.stories.tsx',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Workspace packages resolve to their TypeScript source ("source" export condition),
  // so Storybook does not need a previous build of @ds/icons.
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      conditions: ['source', ...(viteConfig.resolve?.conditions ?? [])],
    },
  }),
};

export default config;
