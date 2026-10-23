/** Steps of the `--ds-space-*` scale that can be used as an offset. */
export type SpaceStep = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

/**
 * Reads a spacing token (`--ds-space-<step>`) and returns it in pixels, for libraries that only take
 * numbers (such as Radix positioning). Supports `rem` and `px` values; returns `fallback` when the
 * token is not defined (for example when the stylesheet is not loaded).
 */
export function readSpaceToken(step: SpaceStep, fallback = 0): number {
  if (typeof document === 'undefined') return fallback;
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const raw = style.getPropertyValue(`--ds-space-${step}`).trim();
  const value = Number.parseFloat(raw);
  if (raw === '' || Number.isNaN(value)) return fallback;
  if (raw.endsWith('rem')) {
    const rootSize = Number.parseFloat(style.fontSize);
    return value * (Number.isNaN(rootSize) ? 16 : rootSize);
  }
  return value;
}
