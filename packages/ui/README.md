# @ds/ui

React components of the design system.

## How to create a component

Every component follows the same checklist. `src/VisuallyHidden/` is the reference example.

- **C1 Structure.** Folder `src/<Component>/` with `<Component>.tsx`, `<Component>.test.tsx`, `<Component>.stories.tsx`, `<Component>.css` and `index.ts`. Export the component and its props type in `src/index.ts` and import the `.css` in `src/styles.css`. `src/conventions.test.ts` checks this.
- **C2 Base API.** `forwardRef` to the root DOM element, a `displayName`, the consumer `className` appended to the base class (never replacing it), and native props passed to the root. Use `cx` from `src/utils/cx.ts` and `Slot` from `src/utils/Slot.ts` for `asChild`.
- **C3 Styles.** Only `ds-*` classes and `var(--ds-*)` tokens; variants, sizes and states as `data-*` attributes; no hard-coded colors, spacing, radii or shadows, no inline styles, no CSS-in-JS.
- **C4 Accessibility.** A unit test with `expectNoA11yViolations` from `test/a11y.ts`; every story passes `pnpm test:a11y`, including `DarkTheme`; contrast and focus visibility in both themes; keyboard patterns follow the WAI-ARIA APG.
- **C5 Stories.** One story per variant and state, plus a `DarkTheme` story, with `tags: ['autodocs']` and prop descriptions in JSDoc.
