// Checks (a), (c) and (d) in ESM on Node 22.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import * as ui from '@up201905892/ui';
import * as icons from '@up201905892/icons';
import * as tokens from '@up201905892/tokens';

test('(a) the ESM import of @up201905892/ui exposes the components', () => {
  for (const name of ['Button', 'DataTable', 'Dialog', 'Select', 'ToastProvider']) {
    assert.ok(ui[name], `${name} is exported`);
  }
});

test('(a) the ESM import of @up201905892/icons and @up201905892/tokens works', () => {
  assert.ok(icons.CheckIcon);
  assert.equal(typeof tokens.tokens, 'object');
});

test('(c) importing the library does not need window or document, and renderToString works', () => {
  assert.equal(typeof globalThis.window, 'undefined');
  assert.equal(typeof globalThis.document, 'undefined');
  const html = renderToString(createElement(ui.Button, null, 'OK'));
  assert.match(html, /class="[^"]*\bds-button\b/);
  assert.match(html, />OK</);
});

test('(d) @up201905892/ui/styles.css resolves and has the tokens', () => {
  const file = fileURLToPath(import.meta.resolve('@up201905892/ui/styles.css'));
  assert.match(readFileSync(file, 'utf8'), /--ds-color-bg-canvas/);
});

test('(d) the token stylesheets of @up201905892/tokens resolve', () => {
  for (const name of ['tokens.css', 'themes.css']) {
    const file = fileURLToPath(import.meta.resolve(`@up201905892/tokens/${name}`));
    assert.ok(readFileSync(file, 'utf8').length > 0, name);
  }
});
