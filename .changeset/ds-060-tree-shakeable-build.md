---
'@up201905892/ui': patch
---

The build is now tree-shakeable: `import { Button } from '@up201905892/ui'` no longer pulls the whole library into the consumer's bundle. The public API does not change.
