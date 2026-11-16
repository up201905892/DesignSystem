import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * DS-040: every interactive component has keyboard tests for the keys of its pattern in the WAI-ARIA
 * Authoring Practices. This test only checks that the keys appear in the tests of the component
 * (the tests themselves check the behaviour); a missing key is a gap to fill with a new test.
 */
const srcDir = import.meta.dirname;

const keys = {
  tab: /\.tab\(\)|\{Tab\}/,
  enter: /\{Enter\}/,
  // `keyboard(' ')` or a list of keys such as `['{Enter}', ' ']`.
  space: /['"`] ['"`]/,
  escape: /\{Escape\}/,
  arrowDown: /ArrowDown/,
  arrowUp: /ArrowUp/,
  arrowLeft: /ArrowLeft/,
  arrowRight: /ArrowRight/,
  home: /\{Home\}/,
  end: /\{End\}/,
} satisfies Record<string, RegExp>;

type Key = keyof typeof keys;

const expected: Record<string, Key[]> = {
  Accordion: ['tab', 'enter', 'space', 'arrowDown', 'arrowUp', 'home', 'end'],
  Button: ['tab', 'enter', 'space'],
  Checkbox: ['tab', 'space'],
  DataTable: ['tab', 'enter'],
  Dialog: ['tab', 'escape', 'enter', 'space'],
  DropdownMenu: ['tab', 'enter', 'space', 'escape', 'arrowDown', 'arrowUp', 'home', 'end'],
  IconButton: ['tab', 'enter', 'space'],
  Input: ['tab'],
  Pagination: ['tab', 'enter', 'space'],
  Popover: ['tab', 'escape', 'enter', 'space'],
  RadioGroup: ['tab', 'arrowDown', 'arrowUp', 'arrowRight', 'arrowLeft', 'space'],
  Select: ['tab', 'enter', 'space', 'escape', 'arrowDown', 'arrowUp', 'home', 'end'],
  Switch: ['tab', 'space', 'enter'],
  Table: ['tab', 'enter', 'space'],
  Tabs: ['tab', 'arrowDown', 'arrowUp', 'arrowRight', 'arrowLeft', 'home', 'end'],
  Textarea: ['tab', 'enter'],
  Toast: ['tab', 'escape'],
  Tooltip: ['tab', 'escape'],
};

function testSource(component: string): string {
  const dir = join(srcDir, component);
  return readdirSync(dir)
    .filter((file) => /\.test\.tsx?$/.test(file))
    .map((file) => readFileSync(join(dir, file), 'utf8'))
    .join('\n');
}

describe('keyboard coverage per component (WCAG 2.1.1)', () => {
  describe.each(Object.entries(expected))('%s', (component, required) => {
    const source = testSource(component);
    it.each(required)('tests the %s key', (key) => {
      expect(source).toMatch(keys[key]);
    });
  });
});
