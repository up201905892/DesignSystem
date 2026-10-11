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
