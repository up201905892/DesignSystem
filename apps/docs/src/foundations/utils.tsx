import type { CSSProperties, ReactNode } from 'react';

export type TokenTree = { readonly [key: string]: string | TokenTree };

export interface FlatToken {
  /** Dot path, e.g. `color.neutral.50`. */
  path: string;
  /** CSS custom property, e.g. `--ds-color-neutral-50`. */
  cssVar: string;
  value: string;
}

/** Flattens a nested token object into a list of leaves (no hand-written lists). */
export function flatten(node: TokenTree, path: string[] = []): FlatToken[] {
  return Object.entries(node).flatMap(([key, child]) => {
    const next = [...path, key];
    if (typeof child === 'string') {
      const name = next.map((p) => p.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());
      return [{ path: next.join('.'), cssVar: `--ds-${name.join('-')}`, value: child }];
    }
    return flatten(child, next);
  });
}

export const asTree = (value: unknown): TokenTree => value as TokenTree;

export const pageStyle: CSSProperties = {
  fontFamily: 'var(--ds-font-family-sans)',
  color: 'var(--ds-color-text-default)',
  lineHeight: 'var(--ds-font-lineHeight-normal)',
};

export const headingStyle: CSSProperties = {
  fontSize: 'var(--ds-font-size-xl)',
  fontWeight: 'var(--ds-font-weight-semibold)',
  margin: 'var(--ds-space-6) 0 var(--ds-space-3)',
};

export const codeStyle: CSSProperties = {
  fontFamily: 'var(--ds-font-family-mono)',
  fontSize: 'var(--ds-font-size-sm)',
};

export function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={pageStyle}>
      <h1
        style={{
          fontSize: 'var(--ds-font-size-3xl)',
          fontWeight: 'var(--ds-font-weight-bold)',
          margin: 0,
        }}
      >
        {title}
      </h1>
      {children}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 style={headingStyle}>{title}</h2>
      {children}
    </section>
  );
}
