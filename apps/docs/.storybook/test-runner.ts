import type { TestRunnerConfig } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
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
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    });
  },
};

export default config;
