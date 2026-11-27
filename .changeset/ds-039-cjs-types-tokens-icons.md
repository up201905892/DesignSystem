---
'@up201905892/tokens': patch
'@up201905892/icons': patch
---

Fix the TypeScript types for CommonJS consumers: the packages now ship a `.d.cts` file and the `exports` map has separate `types` conditions for `import` and `require`. The `source` condition of `@up201905892/icons` (monorepo only) is no longer in the published `package.json`. The public API does not change.
