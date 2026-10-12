# docs

Storybook 8 documentation for the design system.

## Scripts (run from the repository root)

- `pnpm storybook` starts Storybook at http://localhost:6006.
- `pnpm build:docs` builds the static site to `apps/docs/storybook-static/`.
- `pnpm test:a11y:setup` installs the Chromium browser used by the test runner.
  **Run it once** on each machine (and in CI) before `pnpm test:a11y`.
- `pnpm test:a11y` builds the static Storybook, serves it and runs axe
  (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) against every story. It exits
  with a non-zero code if any story has a violation.

## Themes

The toolbar has a **Theme** selector (`light` / `dark`, global `theme`). A
decorator in `.storybook/preview.tsx` sets it as `data-theme` on the `<html>`
element of the story iframe, and the page background uses
`--ds-color-bg-canvas`.

A story can force a theme with `parameters: { theme: 'dark' }`; that value wins
over the toolbar, so `pnpm test:a11y` checks it in the forced theme.

**Convention:** every component has a story exported as `DarkTheme` that shows
its main variants in the dark theme:

```tsx
export const DarkTheme: Story = {
  parameters: { theme: 'dark' },
  render: () => <Button variant="solid">Save</Button>,
};
```

## Foundations pages

`src/foundations/*.stories.tsx` document colours, spacing, typography, radii and
shadows. They are generated from the `tokens` and `themes` objects of
`@ds/tokens`, so there are no hand-written token lists. `@ds/tokens` is built
automatically before `storybook`, `build-storybook`, `test:a11y` and `typecheck`.
