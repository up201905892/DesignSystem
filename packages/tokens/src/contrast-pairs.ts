/**
 * Documented foreground/background pairs checked by `contrast.test.ts` in both themes.
 * Names are semantic token paths without the `--ds-` prefix.
 * - `text`: WCAG AA for text, ratio >= 4.5:1
 * - `non-text`: WCAG 2.1 SC 1.4.11 for control borders and focus indicators, ratio >= 3:1
 */
export type ContrastKind = 'text' | 'non-text';

export interface ContrastPair {
  readonly fg: string;
  readonly bg: string;
  readonly kind: ContrastKind;
}

export const MIN_RATIO: Record<ContrastKind, number> = { text: 4.5, 'non-text': 3 };

const surfaces = ['color-bg-canvas', 'color-bg-surface', 'color-bg-subtle'] as const;
const states = ['success', 'warning', 'danger', 'info'] as const;

export const contrastPairs: readonly ContrastPair[] = [
  ...(['color-text-default', 'color-text-muted'] as const).flatMap((fg) =>
    surfaces.map((bg): ContrastPair => ({ fg, bg, kind: 'text' })),
  ),
  ...states.flatMap((state) =>
    [...surfaces, `color-${state}-subtle`].map((bg): ContrastPair => ({
      fg: `color-${state}-text`,
      bg,
      kind: 'text',
    })),
  ),
  ...(['default', 'hover', 'active'] as const).map((step): ContrastPair => ({
    fg: 'color-text-on-accent',
    bg: `color-accent-${step}`,
    kind: 'text',
  })),
  ...surfaces.map((bg): ContrastPair => ({ fg: 'color-border-strong', bg, kind: 'non-text' })),
  ...surfaces.map((bg): ContrastPair => ({ fg: 'color-focus-ring', bg, kind: 'non-text' })),
];
