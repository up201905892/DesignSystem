// Builds the static Storybook, serves it and runs the test runner (axe) against it.
import { spawn, spawnSync } from 'node:child_process';
import process from 'node:process';

const PORT = '6007';
const URL = `http://127.0.0.1:${PORT}`;
const bin = (name) => `pnpm exec ${name}`;

function run(cmd, args) {
  return spawnSync('pnpm', ['exec', cmd, ...args], { stdio: 'inherit' });
}

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
  const test = run('test-storybook', ['--url', URL]);
  code = test.status ?? 1;
} catch (error) {
  process.stderr.write(`${String(error)}\n`);
} finally {
  server.kill();
}
process.exit(code);
