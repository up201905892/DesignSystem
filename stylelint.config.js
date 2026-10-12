// Applies to packages/ui/src/**/*.css (see the "lint" script). Values must come from
// tokens: var(--ds-*). Documented exceptions: 0, 1px/2px in border and outline,
// currentColor, transparent, inherit and percentages.
const LENGTH_PROPERTIES =
  /^(margin|padding|gap|row-gap|column-gap|border-radius|font-size|box-shadow)/;

export default {
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'hwb',
      'lab',
      'lch',
      'oklab',
      'oklch',
      'color',
    ],
    // margin/padding/gap/border-radius/font-size/box-shadow: no px, rem or em literals.
    'declaration-property-value-disallowed-list': [
      { [LENGTH_PROPERTIES.toString()]: [/(^|[^\w-])-?\d*\.?\d+(px|rem|em)\b/] },
      { message: 'Use a var(--ds-*) token instead of a hand-written length.' },
    ],
    // Only ds-* classes.
    'selector-class-pattern': [
      '^ds-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9-]+)?$',
      { message: 'Class names must start with "ds-".' },
    ],
  },
};
