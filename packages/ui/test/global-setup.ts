import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

/**
 * The CSS tests read the generated token files from `@ds/tokens/dist`, which only
 * exist after the Style Dictionary build. Run it first so `pnpm test` works on a
 * clean clone without a previous `pnpm build`.
 */
export default function setup(): void {
  const tokens = resolve(__dirname, '../../tokens');
  execFileSync('node', ['scripts/build.mjs'], { cwd: tokens, stdio: 'inherit' });
}
