import { axe } from 'vitest-axe';

/**
 * Tail of the queue of axe runs in this worker. axe-core allows one run at a
 * time per document and rejects overlapping calls with "Axe is already running".
 */
let queue: Promise<unknown> = Promise.resolve();

/**
 * Runs axe on `container` and throws, listing the violations, if there are any.
 * Usable in any `*.test.tsx`: `await expectNoA11yViolations(container)`.
 *
 * Mitigation (DS-059): calls are serialised, so two overlapping calls (for
 * example `Promise.all`) wait for each other instead of one of them failing
 * with "Axe is already running". The cause of the one-off pass of the
 * `<img>` without `alt` case on 2026-11-06 was not found (see DS-059 in
 * `docs/workflow/02-desenvolvimento.md`).
 *
 * Note: axe reports nothing (`inapplicable`) for content inside an
 * `aria-hidden`, `inert` or `display: none` ancestor, so pass the element that
 * is actually exposed to assistive technology.
 */
export function expectNoA11yViolations(container: Element): Promise<void> {
  const run = queue.then(async () => {
    const results = await axe(container);
    if (results.violations.length > 0) {
      const report = results.violations
        .map((v) => `- ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
        .join('\n');
      throw new Error(`Expected no accessibility violations, found:\n${report}`);
    }
  });
  queue = run.catch(() => undefined);
  return run;
}
