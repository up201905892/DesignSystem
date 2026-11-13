import { describe, expect, it } from 'vitest';
import page from './getting-started.mdx?raw';

const snippets = Object.keys(import.meta.glob('./snippets/*.tsx')).map((path) =>
  path.replace('./snippets/', ''),
);
const accessibilityPage = Object.keys(import.meta.glob('./accessibility.mdx'));

describe('Getting started page', () => {
  it('has snippets', () => {
    expect(snippets.length).toBeGreaterThan(0);
  });

  it.each(snippets)('references the snippet %s', (file) => {
    expect(page).toContain(`./snippets/${file}`);
  });

  it('uses the real package names and no placeholders', () => {
    expect(page).toContain('@up201905892/ui');
    expect(page).toContain('@up201905892/icons');
    expect(page).not.toMatch(/TODO|lorem ipsum|@your-scope|<scope>/i);
  });

  it('does not link to the accessibility page while it does not exist', () => {
    if (accessibilityPage.length === 0) {
      expect(page.toLowerCase()).not.toMatch(/conformance|accessibility\//);
    }
  });

  it('keeps the heading levels without gaps', () => {
    const levels = [...page.matchAll(/^(#{1,6}) /gm)].map((m) => m[1]?.length ?? 0);
    expect(levels.length).toBeGreaterThan(0);
    levels.reduce((previous, level) => {
      expect(level).toBeLessThanOrEqual(previous + 1);
      return level;
    }, 0);
  });
});
