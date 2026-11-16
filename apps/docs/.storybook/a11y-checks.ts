/**
 * Browser checks used by the Storybook test runner (`test-runner.ts`) in the `reflow` and `sizes`
 * modes. The exceptions are listed and justified on the "Accessibility/Conformance" page; a test
 * in `apps/docs/src/accessibility.test.ts` fails if a story or a rule is missing there.
 */
import type { Page } from 'playwright';

/** Stories allowed to scroll the page horizontally at 320px wide (WCAG 1.4.10). */
export const reflowExceptions: Record<string, string> = {};

/** Smallest rendered heights (px) per `size`, with a base font size of 16px. */
export const minHeights = { sm: 32, md: 40, lg: 48 } as const;

/** WCAG 2.5.8: the absolute minimum for any pointer target. */
export const minTarget = 24;

/** Stories where inline links inside a sentence are measured: they are exempt (WCAG 2.5.8). */
export const inlineLinkExemption = 'a link whose computed `display` is `inline`';

/** Story that renders every sized control in every size. */
export const sizesStoryPrefix = 'accessibility-sizes--';

interface Measurement {
  label: string;
  width: number;
  height: number;
}

export async function checkReflow(page: Page, storyId: string): Promise<void> {
  if (storyId in reflowExceptions) return;
  const result = await page.evaluate(() => {
    const root = document.documentElement;
    return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth };
  });
  if (result.scrollWidth > result.clientWidth) {
    throw new Error(
      `Reflow (WCAG 1.4.10): ${storyId} scrolls horizontally at 320px ` +
        `(scrollWidth ${result.scrollWidth}px > clientWidth ${result.clientWidth}px)`,
    );
  }
}

/** Interactive elements that are rendered, visible and not hidden from assistive technology. */
function collectTargets(): Measurement[] {
  const selector = [
    'button',
    'a[href]',
    'input:not([type="hidden"])',
    'select',
    'textarea',
    'summary',
    '[role="button"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="switch"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[role="menuitemcheckbox"]',
    '[role="menuitemradio"]',
    '[role="option"]',
    '[role="combobox"]',
  ].join(',');
  const result: Measurement[] = [];
  const measured = new Set<HTMLElement>();
  for (const element of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
    if (element.closest('[aria-hidden="true"], [hidden], [inert]')) continue;
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    // Inline links inside a sentence are exempt from the target size (WCAG 2.5.8).
    if (element.tagName === 'A' && style.display === 'inline') continue;
    // A control inside a `<label>` (Checkbox, RadioGroup, Switch) or inside the `Input` wrapper is
    // activated by pressing anywhere on the label or the wrapper, so that is the target measured.
    const host = element.closest<HTMLElement>('label, .ds-input') ?? element;
    if (measured.has(host)) continue;
    measured.add(host);
    const box = host.getBoundingClientRect();
    const name = element.getAttribute('aria-label') ?? element.textContent?.trim().slice(0, 30);
    const component = host.className.toString().split(/\s+/)[0] || host.tagName.toLowerCase();
    result.push({
      label: `${component}${name ? ` "${name}"` : ''}`,
      width: box.width,
      height: box.height,
    });
  }
  return result;
}

export async function checkTargets(page: Page, storyId: string): Promise<void> {
  const targets = await page.evaluate(collectTargets);
  const failures = targets
    .filter((target) => target.width < minTarget || target.height < minTarget)
    .map((t) => `${t.label} is ${t.width.toFixed(1)}x${t.height.toFixed(1)}px`);
  if (failures.length > 0) {
    throw new Error(
      `Target size (WCAG 2.5.8): ${storyId} has targets smaller than ${minTarget}x${minTarget}px:\n` +
        failures.join('\n'),
    );
  }
}

interface SizedMeasurement {
  component: string;
  size: string;
  width: number;
  height: number;
}

function collectSized(): SizedMeasurement[] {
  const groups: [string, string][] = [
    ['Button', '.ds-button[data-size]:not([data-icon-only])'],
    ['IconButton', '.ds-button[data-size][data-icon-only]'],
    ['Input', '.ds-input[data-size]'],
    ['Select', '.ds-select[data-size]'],
    ['Textarea', '.ds-textarea[data-size]'],
  ];
  const result: SizedMeasurement[] = [];
  for (const [component, selector] of groups) {
    for (const element of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
      const box = element.getBoundingClientRect();
      result.push({
        component,
        size: element.dataset.size ?? '',
        width: box.width,
        height: box.height,
      });
    }
  }
  return result;
}

export async function checkSizes(page: Page, storyId: string): Promise<void> {
  const measured = await page.evaluate(collectSized);
  const seen = new Set<string>();
  const failures: string[] = [];
  for (const item of measured) {
    seen.add(`${item.component}/${item.size}`);
    const min = minHeights[item.size as keyof typeof minHeights];
    if (min === undefined) continue;
    if (item.height < min) {
      failures.push(`${item.component} size ${item.size}: height ${item.height}px < ${min}px`);
    }
    if (item.component === 'IconButton' && item.width < min) {
      failures.push(`IconButton size ${item.size}: width ${item.width}px < ${min}px`);
    }
  }
  for (const component of ['Button', 'IconButton', 'Input', 'Select', 'Textarea']) {
    for (const size of Object.keys(minHeights)) {
      if (!seen.has(`${component}/${size}`)) {
        failures.push(`${component} size ${size}: not found in ${storyId}`);
      }
    }
  }
  if (failures.length > 0) {
    throw new Error(`Control heights (${storyId}):\n${failures.join('\n')}`);
  }
}

/** Stories of `DataTable` get the visual review of the DS-040 audit, in both themes. */
export const dataTableStoryPrefix = 'components-datatable--';

interface FooterLayout {
  hasFooter: boolean;
  inside: boolean;
  overlap: boolean;
}

function measureFooter(): FooterLayout {
  const table = document.querySelector<HTMLElement>('.ds-data-table');
  const footer = document.querySelector<HTMLElement>('.ds-data-table__footer');
  if (!table || !footer) return { hasFooter: false, inside: true, overlap: false };
  const bounds = table.getBoundingClientRect();
  const rects = Array.from(footer.children).map((child) => child.getBoundingClientRect());
  const tolerance = 0.5;
  const inside = rects.every(
    (r) => r.left >= bounds.left - tolerance && r.right <= bounds.right + tolerance,
  );
  let overlap = false;
  for (let i = 0; i < rects.length; i += 1) {
    for (let j = i + 1; j < rects.length; j += 1) {
      const a = rects[i]!;
      const b = rects[j]!;
      if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) {
        overlap = true;
      }
    }
  }
  return { hasFooter: true, inside, overlap };
}

/** Presses Tab until `selector` has focus, then reports whether the focus ring is drawn. */
async function focusRingVisible(page: Page, selector: string): Promise<boolean | null> {
  const exists = await page.evaluate((s) => document.querySelector(s) !== null, selector);
  if (!exists) return null;
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  for (let i = 0; i < 60; i += 1) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(
      (s) => document.activeElement?.matches(s) === true,
      selector,
    );
    if (focused) {
      return page.evaluate(() => {
        const element = document.activeElement as HTMLElement;
        const style = getComputedStyle(element);
        return (
          element.matches(':focus-visible') &&
          style.outlineStyle !== 'none' &&
          Number.parseFloat(style.outlineWidth) > 0
        );
      });
    }
  }
  return false;
}

export async function checkDataTable(page: Page, storyId: string): Promise<void> {
  const failures: string[] = [];
  for (const theme of ['light', 'dark']) {
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    const footer = await page.evaluate(measureFooter);
    if (!footer.inside) failures.push(`${theme}: the footer leaves the DataTable`);
    if (footer.overlap) failures.push(`${theme}: the summary and the Pagination overlap`);
    const sortRing = await focusRingVisible(page, '.ds-table__sort-button');
    if (sortRing === false) failures.push(`${theme}: no focus ring on a sortable header`);
    const pageRing = await focusRingVisible(page, '.ds-pagination__button:not([aria-disabled])');
    if (pageRing === false) failures.push(`${theme}: no focus ring on a Pagination button`);
  }
  if (failures.length > 0) {
    throw new Error(`DataTable review (${storyId}):\n${failures.join('\n')}`);
  }
}
