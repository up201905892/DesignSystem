import { axe } from 'vitest-axe';

/**
 * Runs axe on `container` and throws, listing the violations, if there are any.
 * Usable in any `*.test.tsx`: `await expectNoA11yViolations(container)`.
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe(container);
  if (results.violations.length > 0) {
    const report = results.violations
      .map((v) => `- ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
      .join('\n');
    throw new Error(`Expected no accessibility violations, found:\n${report}`);
  }
}
