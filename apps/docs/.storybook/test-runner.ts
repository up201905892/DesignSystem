import type { TestRunnerConfig } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';
import {
  checkDataTable,
  checkReflow,
  checkSizes,
  checkTargets,
  dataTableStoryPrefix,
  sizesStoryPrefix,
} from './a11y-checks';

/**
 * `A11Y_MODE` picks what the runner checks (see `scripts/test-a11y.mjs`):
 * `axe` (default), `reflow` (320px wide viewport) or `sizes` (control heights and target sizes).
 */
const mode = process.env.A11Y_MODE ?? 'axe';

const config: TestRunnerConfig = {
  async preVisit(page) {
    if (mode === 'reflow') {
      await page.setViewportSize({ width: 320, height: 800 });
    } else if (mode === 'axe') {
      await injectAxe(page);
    }
  },
  async postVisit(page, context) {
    if (mode === 'reflow') {
      await checkReflow(page, context.id);
      // The review runs at 320px here and at the default 1280px in the `axe` mode.
      if (context.id.startsWith(dataTableStoryPrefix)) await checkDataTable(page, context.id);
      return;
    }
    if (mode === 'sizes') {
      await checkTargets(page, context.id);
      if (context.id.startsWith(sizesStoryPrefix)) await checkSizes(page, context.id);
      return;
    }
    if (context.id.startsWith(dataTableStoryPrefix)) {
      await checkDataTable(page, context.id);
    }
    if (context.id === 'components-table--horizontal-scroll') {
      // Real key presses: native arrow-key scrolling cannot be simulated in jsdom.
      const selector = '#storybook-root [role="region"]';
      const region = page.locator(selector);
      const scrollLeft = () => region.evaluate((el) => el.scrollLeft);
      const wider = await region.evaluate((el) => el.scrollWidth > el.clientWidth);
      if (!wider) throw new Error('Table should be wider than its container');
      await region.focus();
      if ((await scrollLeft()) !== 0) throw new Error('scrollLeft should start at 0');
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(
        (sel) => (document.querySelector(sel) as HTMLElement).scrollLeft > 0,
        selector,
      );
      await page.keyboard.press('ArrowLeft');
      await page.waitForFunction(
        (sel) => (document.querySelector(sel) as HTMLElement).scrollLeft === 0,
        selector,
      );
    }
    const runAxe = () =>
      checkA11y(page, '#storybook-root', {
        detailedReport: true,
        detailedReportOptions: { html: true },
        axeOptions: {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
          },
        },
      });
    if (context.id.startsWith(dataTableStoryPrefix)) {
      // Contrast of the header and the (striped) rows in both themes.
      for (const theme of ['light', 'dark']) {
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        await runAxe();
      }
      return;
    }
    await runAxe();
  },
};

export default config;
