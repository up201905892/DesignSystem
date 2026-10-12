import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import * as icons from './index';

// Vitest runs with the package directory as cwd (jsdom makes import.meta.url a non-file URL).
const svgDir = join(process.cwd(), 'svg');
const toComponentName = (file: string) =>
  file
    .replace(/\.svg$/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'Icon';

const expectedNames = readdirSync(svgDir)
  .filter((f) => f.endsWith('.svg'))
  .map(toComponentName)
  .sort();
const exportedNames = Object.keys(icons).sort();

async function violationsOf(container: HTMLElement) {
  const results = await axe.run(container);
  return results.violations;
}

describe('icon set', () => {
  it('has 30 svg files', () => {
    expect(expectedNames).toHaveLength(30);
  });

  it('exports one component per file in svg/', () => {
    expect(exportedNames).toEqual(expectedNames);
  });
});

describe('Icon API', () => {
  const { CheckIcon } = icons;

  it('defaults size to 1em', () => {
    const { container } = render(<CheckIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '1em');
    expect(svg).toHaveAttribute('height', '1em');
  });

  it('applies size to width and height', () => {
    const { container } = render(<CheckIcon size={24} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('uses currentColor for the stroke', () => {
    const { container } = render(<CheckIcon />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke', 'currentColor');
  });

  it('forwards the ref to the svg', () => {
    const ref = createRef<SVGSVGElement>();
    render(<CheckIcon ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('applies className and other svg props', () => {
    const { container } = render(<CheckIcon className="custom" data-testid="icon" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom');
    expect(svg).toHaveAttribute('data-testid', 'icon');
  });
});

describe('Icon accessibility', () => {
  const { CheckIcon } = icons;

  it('is hidden from assistive technology without a title', async () => {
    const { container } = render(<CheckIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(await violationsOf(container)).toEqual([]);
  });

  it('is exposed as an image with a title', async () => {
    const { container } = render(<CheckIcon title="Close" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).not.toHaveAttribute('aria-hidden');
    expect(container.querySelector('title')).toHaveTextContent('Close');
    expect(screen.getByRole('img', { name: 'Close' })).toBe(svg);
    expect(await violationsOf(container)).toEqual([]);
  });

  it('every icon follows the accessibility contract', () => {
    for (const [name, Icon] of Object.entries(icons)) {
      if (!name.endsWith('Icon')) continue;
      const Component = Icon as typeof icons.CheckIcon;
      const hidden = render(<Component />);
      expect(hidden.container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      hidden.unmount();
      const named = render(<Component title={name} />);
      expect(screen.getByRole('img', { name })).toBeInTheDocument();
      named.unmount();
    }
  });
});
