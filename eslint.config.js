import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/storybook-static/',
      '**/coverage/',
      'docs/workflow/',
      '.claude/',
      '.github/',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.flat.recommended,
    settings: { react: { version: '19.0' } },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.flat['jsx-runtime'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    // The example app must be built only with the library components.
    files: ['apps/example/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...['button', 'input', 'textarea', 'select', 'table', 'dialog'].map((name) => ({
          selector: `JSXOpeningElement[name.name='${name}']`,
          message: `Use the design system component instead of the native <${name}>.`,
        })),
        {
          selector: "JSXAttribute[name.name='style']",
          message: 'No inline styles in the example app: use the layout file with tokens.',
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
);
