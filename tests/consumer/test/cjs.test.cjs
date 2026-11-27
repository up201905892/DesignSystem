// Check (a) in CommonJS on Node 22, and (c) and (d) through require.
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');

test('(a) require of @up201905892/ui exposes the components', () => {
  const ui = require('@up201905892/ui');
  for (const name of ['Button', 'DataTable', 'Dialog', 'Select', 'ToastProvider']) {
    assert.ok(ui[name], `${name} is exported`);
  }
});

test('(a) require of @up201905892/icons and @up201905892/tokens works', () => {
  assert.ok(require('@up201905892/icons').CheckIcon);
  assert.equal(typeof require('@up201905892/tokens').tokens, 'object');
});

test('(c) renderToString of the CommonJS build has the ds-button class', () => {
  const { Button } = require('@up201905892/ui');
  const html = renderToString(createElement(Button, null, 'OK'));
  assert.match(html, /class="[^"]*\bds-button\b/);
});

test('(d) require.resolve finds @up201905892/ui/styles.css with the tokens', () => {
  const file = require.resolve('@up201905892/ui/styles.css');
  assert.match(readFileSync(file, 'utf8'), /--ds-color-bg-canvas/);
});
