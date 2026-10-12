# @ds/icons

React icon components for the design system, generated from a subset of [Lucide](https://lucide.dev).

```tsx
import { CheckIcon } from '@ds/icons';

<CheckIcon />                      {/* decorative: aria-hidden, size 1em */}
<CheckIcon size={20} title="Done" /> {/* exposed as role="img" named "Done" */}
```

Every icon accepts `size` (number or string, default `"1em"`), `title`, `className`, a `ref` to the `<svg>` and any other `<svg>` prop. The stroke is `currentColor`, so icons follow the text colour.

## Adding or regenerating icons

The SVG files live in `svg/` and are copied from `lucide-static` (pinned version). The icon list is in `scripts/generate.mjs`.

```
pnpm --filter @ds/icons generate
```

This copies the SVG files, rewrites `src/generated/*` and `src/index.ts` with SVGR, and is idempotent. Never edit the generated files by hand.

## Credits

The icons come from [Lucide](https://lucide.dev), licensed under the ISC licence (some are derived from Feather, MIT). The licence text is in [`LICENSE-LUCIDE`](./LICENSE-LUCIDE).
