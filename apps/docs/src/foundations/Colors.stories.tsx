import type { Meta, StoryObj } from '@storybook/react';
import { themes, tokens } from '@ds/tokens';
import { asTree, codeStyle, flatten, Page, Section } from './utils';

const meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

const swatchGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
  gap: 'var(--ds-space-3)',
  listStyle: 'none',
  padding: 0,
  margin: 0,
} as const;

function Swatch({ name, cssVar, value }: { name: string; cssVar: string; value: string }) {
  return (
    <li>
      <div
        aria-hidden="true"
        style={{
          height: 'var(--ds-space-12)',
          background: `var(${cssVar})`,
          border: '1px solid var(--ds-color-border-strong)',
          borderRadius: 'var(--ds-radius-md)',
        }}
      />
      <div
        style={{ fontSize: 'var(--ds-font-size-sm)', fontWeight: 'var(--ds-font-weight-medium)' }}
      >
        {name}
      </div>
      <code style={{ ...codeStyle, color: 'var(--ds-color-text-muted)' }}>
        {cssVar}
        <br />
        {value}
      </code>
    </li>
  );
}

function Palette({ title, tree }: { title: string; tree: ReturnType<typeof asTree> }) {
  return (
    <Section title={title}>
      <ul style={swatchGrid}>
        {flatten(tree).map((t) => (
          <Swatch key={t.cssVar} name={t.path} cssVar={t.cssVar} value={t.value} />
        ))}
      </ul>
    </Section>
  );
}

/** Primitive palettes, generated from the `tokens.color` object. */
export const Colors: Story = {
  render: () => {
    const color = asTree(tokens.color);
    // Groups with children are palettes; loose values (e.g. white) go into "Other".
    const palettes = Object.entries(color).filter(([, v]) => typeof v !== 'string');
    const loose = Object.fromEntries(
      Object.entries(color).filter(([, v]) => typeof v === 'string'),
    );
    return (
      <Page title="Colors">
        {palettes.map(([name, tree]) => (
          <Palette
            key={name}
            title={name}
            tree={{ color: { [name]: tree as ReturnType<typeof asTree> } }}
          />
        ))}
        {Object.keys(loose).length > 0 && <Palette title="other" tree={{ color: loose }} />}
      </Page>
    );
  },
};

/** Semantic tokens, shown in both themes (each panel scopes its own `data-theme`). */
export const Semantic: Story = {
  render: () => (
    <Page title="Semantic colors">
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{
            background: 'var(--ds-color-bg-canvas)',
            color: 'var(--ds-color-text-default)',
            padding: 'var(--ds-space-4)',
            marginTop: 'var(--ds-space-4)',
            borderRadius: 'var(--ds-radius-lg)',
            border: '1px solid var(--ds-color-border-default)',
          }}
        >
          <Section title={`Theme: ${theme}`}>
            <ul style={swatchGrid}>
              {flatten(asTree(themes[theme].color), ['color']).map((t) => (
                <Swatch key={t.cssVar} name={t.path} cssVar={t.cssVar} value={t.value} />
              ))}
            </ul>
          </Section>
        </div>
      ))}
    </Page>
  ),
};
