// Builds the static Storybook, serves it and runs the test runner (axe) against it.
import { spawn, spawnSync } from 'node:child_process';
import process from 'node:process';

// Modes: axe (default), reflow (320px viewport) and sizes (control heights and target sizes).
const mode = process.argv[2] ?? 'axe';
if (!['axe', 'reflow', 'sizes'].includes(mode)) {
  process.stderr.write(`Unknown mode "${mode}" (use axe, reflow or sizes)\n`);
  process.exit(2);
}

const PORT = '6007';
const URL = `http://127.0.0.1:${PORT}`;
const bin = (name) => `pnpm exec ${name}`;

function run(cmd, args) {
  return spawnSync('pnpm', ['exec', cmd, ...args], { stdio: 'inherit' });
}

// The stories import the generated token CSS and objects from @up201905892/tokens/dist.
const tokensBuild = spawnSync('pnpm', ['--filter', '@up201905892/tokens', 'build'], {
  stdio: 'inherit',
});
if (tokensBuild.status !== 0) process.exit(tokensBuild.status ?? 1);

const build = run('storybook', ['build', '--quiet']);
if (build.status !== 0) process.exit(build.status ?? 1);

const server = spawn(
  'pnpm',
  ['exec', 'http-server', 'storybook-static', '-p', PORT, '-a', '127.0.0.1', '-s'],
  { stdio: 'ignore' },
);

let code = 1;
try {
  const wait = run('wait-on', ['--timeout', '60000', `${URL}/index.json`]);
  if (wait.status !== 0) throw new Error(`Server did not start (${bin('wait-on')})`);
  const test = spawnSync('pnpm', ['exec', 'test-storybook', '--url', URL], {
    stdio: 'inherit',
    env: { ...process.env, A11Y_MODE: mode },
  });
  code = test.status ?? 1;
} catch (error) {
  process.stderr.write(`${String(error)}\n`);
} finally {
  server.kill();
}
process.exit(code);
