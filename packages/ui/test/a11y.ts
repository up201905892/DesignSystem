import { axe } from 'vitest-axe';

/**
 * Tail of the queue of axe runs in this worker. axe-core allows one run at a
 * time per document and rejects overlapping calls with "Axe is already running".
 */
let queue: Promise<unknown> = Promise.resolve();

function describeElement(el: Element): string {
  const id = el.id ? `#${el.id}` : '';
  const cls =
    typeof el.className === 'string' && el.className
      ? `.${el.className.trim().split(/\s+/).join('.')}`
      : '';
  return `<${el.tagName.toLowerCase()}>${id}${cls}`;
}

function hiddenReason(el: Element): string | null {
  if (el.getAttribute('aria-hidden') === 'true') return 'aria-hidden="true"';
  if (el.hasAttribute('inert')) return 'inert';
  if (el.hasAttribute('hidden')) return 'hidden';
  if (getComputedStyle(el).display === 'none') return 'display: none';
  return null;
}

function assertExposed(target: Element): void {
  for (let el: Element | null = target; el; el = el.parentElement) {
    const reason = hiddenReason(el);
    if (reason) {
      const where = el === target ? 'the target' : 'an ancestor';
      throw new Error(
        `expectNoA11yViolations: target is hidden from assistive technology (${reason} on ${where} ${describeElement(el)}). Pass the exposed element, e.g. document.body or screen.getByRole('dialog').`,
      );
    }
  }
}

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
 * Hidden targets (DS-062): axe reports nothing (`inapplicable`) for content
 * inside a hidden subtree, which would be a false pass. Before running axe, the
 * helper checks `container` and every ancestor up to `document.documentElement`
 * and throws if one has `aria-hidden="true"`, the `inert` attribute, the
 * `hidden` attribute or computed `display: none`. The message starts with
 * `expectNoA11yViolations: target is hidden from assistive technology` and
 * names the reason, the element (tag, id, class) and whether it is the target
 * or an ancestor. Hidden content *inside* the target is fine.
 *
 * What to do: pass the element that is actually exposed, for example
 * `document.body` or `screen.getByRole('dialog')` when a modal overlay is open
 * (Radix sets `aria-hidden` on the siblings of its portal, which include the
 * Testing Library `container`).
 */
export function expectNoA11yViolations(container: Element): Promise<void> {
  const run = queue.then(async () => {
    assertExposed(container);
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
