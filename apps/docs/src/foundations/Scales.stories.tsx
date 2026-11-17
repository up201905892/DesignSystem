import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import { themes, tokens } from '@up201905892/tokens';
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
                border: 'var(--ds-border-width-2) solid var(--ds-color-accent-default)',
                borderRadius: `var(${r.cssVar})`,
              }}
            />
          </li>
        ))}
      </ul>
    </Page>
  ),
};

export const Borders: Story = {
  render: () => (
    <Page title="Borders">
      <ul style={list}>
        {[...tokensOf(t.border, 'border'), ...tokensOf(t.focus, 'focus')].map((b) => (
          <li key={b.cssVar} style={row}>
            <Label cssVar={b.cssVar} value={b.value} />
            <div
              aria-hidden="true"
              style={{
                width: 'var(--ds-space-16)',
                height: 'var(--ds-space-12)',
                margin: 'var(--ds-space-2)',
                background: 'var(--ds-color-bg-surface)',
                borderRadius: 'var(--ds-radius-md)',
                ...(b.path.startsWith('focus')
                  ? {
                      outline: `${
                        b.path.endsWith('width') ? `var(${b.cssVar})` : 'var(--ds-focus-ring-width)'
                      } solid var(--ds-color-focus-ring)`,
                      outlineOffset: b.path.endsWith('offset')
                        ? `var(${b.cssVar})`
                        : 'var(--ds-focus-ring-offset)',
                    }
                  : { border: `var(${b.cssVar}) solid var(--ds-color-border-strong)` }),
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
      <Section title="Primitive shadows">
        <p style={{ margin: 0, marginBottom: 'var(--ds-space-4)' }}>
          Components use the semantic shadows below, which change with the theme. Do not use the
          primitive shadows directly: they are the raw scale the semantic tokens point to.
        </p>
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
      </Section>
      <Section title="Semantic shadows">
        {(['light', 'dark'] as const).map((theme) => (
          <div
            key={theme}
            data-theme={theme}
            data-testid={`shadow-panel-${theme}`}
            style={{
              background: 'var(--ds-color-bg-canvas)',
              color: 'var(--ds-color-text-default)',
              padding: 'var(--ds-space-4)',
              marginTop: 'var(--ds-space-4)',
              borderRadius: 'var(--ds-radius-lg)',
              border: 'var(--ds-border-width-1) solid var(--ds-color-border-default)',
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 'var(--ds-space-3)' }}>Theme: {theme}</h3>
            <ul style={list}>
              {flatten(asTree(themes[theme].shadow), ['shadow']).map((s) => (
                <li key={s.cssVar} style={row}>
                  <Label cssVar={s.cssVar} value={s.value} />
                  <div
                    aria-hidden="true"
                    data-shadow-sample={s.path}
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
          </div>
        ))}
      </Section>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const panel = (theme: string) => `[data-testid="shadow-panel-${theme}"]`;
    for (const theme of ['light', 'dark']) {
      const count = canvasElement.querySelectorAll(`${panel(theme)} [data-shadow-sample]`).length;
      await expect(count).toBe(3);
    }
    const sample = (theme: string) =>
      canvasElement.querySelector<HTMLElement>(
        `${panel(theme)} [data-shadow-sample="shadow.raised"]`,
      );
    const light = sample('light');
    const dark = sample('dark');
    if (!light || !dark) throw new Error('Raised samples not found');
    await expect(getComputedStyle(dark).boxShadow).not.toBe(getComputedStyle(light).boxShadow);
  },
};
