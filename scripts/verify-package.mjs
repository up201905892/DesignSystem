// Verifies the files that would go to npm, before any publication.
//
//   pnpm verify:package
//
// 1. builds all packages;
// 2. packs the three packages with `pnpm pack` into a temporary folder (outside the repository);
// 3. runs publint and @arethetypeswrong/cli on every tarball;
// 4. checks the content of every tarball (only dist/, package.json, README and licences,
//    and no `workspace:` left in the dependencies);
// 5. installs the tarballs in tests/consumer (copied to the temporary folder, so that the
//    repository stays clean) and runs its checks.
//
// Exits with 0 only if everything passes. It never publishes (not even with --dry-run).
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packages = ['tokens', 'icons', 'ui'];
const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function run(command, args, options = {}) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  return spawnSync(command, args, { cwd: root, stdio: 'inherit', ...options });
}

function capture(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
}

/** Names of the files that a package may ship, besides `dist/`. */
const allowedRoot = /^package\/(package\.json|README\.md|LICENSE(-[A-Za-z]+)?)$/;
const forbiddenInDist = /\.(test|stories)\.|\/(src|test|tests|__tests__|\.storybook)\//;

function checkTarball(name, tarball) {
  const list = capture('tar', ['-tzf', tarball]);
  if (list.status !== 0) return fail(`${name}: tar could not read ${tarball}`);
  const entries = list.stdout.split('\n').filter((entry) => entry && !entry.endsWith('/'));

  for (const entry of entries) {
    if (entry.startsWith('package/dist/')) {
      if (forbiddenInDist.test(entry)) fail(`${name}: ${entry} must not be in the tarball`);
    } else if (!allowedRoot.test(entry)) {
      fail(
        `${name}: ${entry} must not be in the tarball (only dist/, package.json, README and licences)`,
      );
    }
  }
  for (const required of ['package/package.json', 'package/README.md', 'package/LICENSE']) {
    if (!entries.includes(required)) fail(`${name}: ${required} is missing from the tarball`);
  }
  if (!entries.some((entry) => entry.startsWith('package/dist/'))) fail(`${name}: dist/ is empty`);

  const manifest = capture('tar', ['-xzOf', tarball, 'package/package.json']);
  if (manifest.status !== 0) return fail(`${name}: could not read package.json from the tarball`);
  if (manifest.stdout.includes('workspace:'))
    fail(`${name}: package.json still has a "workspace:" version`);

  // Every file that package.json points to must be in the tarball (this catches the
  // monorepo-only "source" condition of icons, which points to src/).
  const parsed = JSON.parse(manifest.stdout);
  const targets = [parsed.main, parsed.module, parsed.types, ...leaves(parsed.exports)];
  for (const target of targets.filter((value) => typeof value === 'string')) {
    if (!entries.includes(`package/${target.replace(/^\.\//, '')}`)) {
      fail(`${name}: package.json points to ${target}, which is not in the tarball`);
    }
  }
  console.log(`ok   ${name}: ${entries.length} files, no src/tests/stories/config, no workspace:`);
  return parsed;
}

/** All the string values of a nested `exports` object. */
function leaves(value) {
  if (typeof value === 'string') return [value];
  if (value && typeof value === 'object') return Object.values(value).flatMap(leaves);
  return [];
}

function main() {
  // --skip-build reuses the existing dist/ folders (only for quick local tries).
  if (!process.argv.includes('--skip-build') && run('pnpm', ['build']).status !== 0) {
    return fail('pnpm build');
  }

  const work = mkdtempSync(join(tmpdir(), 'ds-verify-package-'));
  console.log(`\nTemporary folder: ${work}`);
  try {
    const tarballs = {};
    for (const name of packages) {
      const packDir = join(work, 'packed');
      const result = run('pnpm', ['pack', '--pack-destination', packDir], {
        cwd: join(root, 'packages', name),
      });
      if (result.status !== 0) return fail(`pnpm pack @up201905892/${name}`);
      const file = readdirSync(packDir).find((entry) => entry.startsWith(`up201905892-${name}-`));
      if (!file) return fail(`no tarball found for ${name}`);
      tarballs[name] = join(packDir, file);
    }

    for (const name of packages) {
      const tarball = tarballs[name];
      const manifest = checkTarball(name, tarball);
      // CSS entry points have no JavaScript or types for attw to resolve.
      const cssEntries = Object.keys(manifest?.exports ?? {}).filter((key) => key.endsWith('.css'));
      // publint: errors and warnings fail; suggestions are only shown.
      if (
        run('pnpm', ['exec', 'publint', 'run', tarball, '--level', 'warning', '--strict'])
          .status !== 0
      ) {
        fail(`publint ${name}`);
      }
      // attw: node16 (ESM and CJS) and bundler; the profile ignores only node10 resolution.
      const attw = ['exec', 'attw', tarball, '--profile', 'node16'];
      if (cssEntries.length > 0) attw.push('--exclude-entrypoints', ...cssEntries);
      if (run('pnpm', attw).status !== 0) fail(`attw ${name}`);
    }
    if (failures.length > 0) return;

    // Consumer project, outside the pnpm workspace, installed from the tarballs.
    const consumer = join(work, 'consumer');
    cpSync(join(root, 'tests', 'consumer'), consumer, {
      recursive: true,
      filter: (source) => !source.includes('node_modules'),
    });
    const manifestPath = join(consumer, 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const spec = (name) => `file:${tarballs[name]}`;
    manifest.dependencies = {
      ...manifest.dependencies,
      '@up201905892/ui': spec('ui'),
      '@up201905892/icons': spec('icons'),
      '@up201905892/tokens': spec('tokens'),
    };
    // The ui tarball depends on @up201905892/icons, which is not on the registry yet.
    manifest.overrides = { '@up201905892/icons': '$@up201905892/icons' };
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const options = { cwd: consumer };
    if (
      run('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts'], options).status !== 0
    ) {
      return fail('npm install of the tarballs in tests/consumer');
    }
    if (!existsSync(join(consumer, 'node_modules', '@up201905892', 'ui', 'dist'))) {
      return fail('the ui tarball was not installed from its .tgz');
    }
    if (run('npm', ['test'], options).status !== 0) fail('tests/consumer checks');
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

main();

if (failures.length > 0) {
  console.error(`\nverify:package failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('\nverify:package passed');
