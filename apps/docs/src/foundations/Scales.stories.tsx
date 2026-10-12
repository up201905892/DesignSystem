import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '@ds/tokens';
import type { CSSProperties } from 'react';
import { asTree, codeStyle, flatten, Page, Section } from './utils';

const meta = {
  title: 'Foundations/Scales',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

const list: CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gap: 'var(--ds-space-3)',
};
const row: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(10rem, 16rem) 1fr',
  alignItems: 'center',
  gap: 'var(--ds-space-4)',
};
const muted: CSSProperties = { ...codeStyle, color: 'var(--ds-color-text-muted)' };

function Label({ cssVar, value }: { cssVar: string; value: string }) {
  return (
    <code style={muted}>
      {cssVar}
      <br />
      {value}
    </code>
  );
}

const tokensOf = (group: unknown, root: string) => flatten({ [root]: asTree(group) });
const t = tokens as unknown as Record<string, unknown>;

export const Spacing: Story = {
  render: () => (
    <Page title="Spacing">
      <ul style={list}>
        {tokensOf(t.space, 'space').map((s) => (
          <li key={s.cssVar} style={row}>
            <Label cssVar={s.cssVar} value={s.value} />
            <div
              aria-hidden="true"
              style={{
                width: `var(${s.cssVar})`,
                height: 'var(--ds-space-4)',
                background: 'var(--ds-color-accent-default)',
                borderRadius: 'var(--ds-radius-sm)',
              }}
            />
          </li>
        ))}
      </ul>
    </Page>
  ),
};

export const Typography: Story = {
  render: () => {
    const font = asTree(t.font);
    const groups = (key: string) =>
      flatten({ font: { [key]: font[key] as ReturnType<typeof asTree> } });
    return (
      <Page title="Typography">
        <Section title="Font families">
          <ul style={list}>
            {groups('family').map((f) => (
              <li key={f.cssVar} style={row}>
                <Label cssVar={f.cssVar} value={f.value} />
                <span
                  style={{ fontFamily: `var(${f.cssVar})`, fontSize: 'var(--ds-font-size-xl)' }}
                >
                  The quick brown fox jumps over the lazy dog
                </span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Font sizes">
          <ul style={list}>
            {groups('size').map((f) => (
              <li key={f.cssVar} style={row}>
                <Label cssVar={f.cssVar} value={f.value} />
                <span style={{ fontSize: `var(${f.cssVar})` }}>The quick brown fox</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Font weights">
          <ul style={list}>
            {groups('weight').map((f) => (
              <li key={f.cssVar} style={row}>
                <Label cssVar={f.cssVar} value={f.value} />
                <span style={{ fontWeight: `var(${f.cssVar})` }}>The quick brown fox</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Line heights">
          <ul style={list}>
            {groups('lineHeight').map((f) => (
              <li key={f.cssVar} style={row}>
                <Label cssVar={f.cssVar} value={f.value} />
                <p style={{ margin: 0, maxWidth: '24rem', lineHeight: `var(${f.cssVar})` }}>
                  Design tokens keep spacing, colour and type consistent across every component, so
                  a change in one place reaches the whole library.
                </p>
              </li>
            ))}
          </ul>
        </Section>
      </Page>
    );
  },
};

export const Radii: Story = {
  render: () => (
    <Page title="Radii">
      <ul style={list}>
        {tokensOf(t.radius, 'radius').map((r) => (
          <li key={r.cssVar} style={row}>
            <Label cssVar={r.cssVar} value={r.value} />
            <div
              aria-hidden="true"
              style={{
                width: 'var(--ds-space-16)',
                height: 'var(--ds-space-12)',
                background: 'var(--ds-color-accent-subtle)',
                border: '2px solid var(--ds-color-accent-default)',
                borderRadius: `var(${r.cssVar})`,
              }}
            />
          </li>
        ))}
      </ul>
    </Page>
  ),
};

export const Shadows: Story = {
  render: () => (
    <Page title="Shadows">
      <ul style={list}>
        {tokensOf(t.shadow, 'shadow').map((s) => (
          <li key={s.cssVar} style={row}>
            <Label cssVar={s.cssVar} value={s.value} />
            <div
              aria-hidden="true"
              style={{
                width: 'var(--ds-space-16)',
                height: 'var(--ds-space-12)',
                background: 'var(--ds-color-bg-surface)',
                borderRadius: 'var(--ds-radius-md)',
                boxShadow: `var(${s.cssVar})`,
              }}
            />
          </li>
        ))}
      </ul>
    </Page>
  ),
};
