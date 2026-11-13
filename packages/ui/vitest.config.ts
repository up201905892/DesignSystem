import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Workspace packages resolve to their TypeScript source ("source" export condition).
  resolve: { conditions: ['source'] },
  test: {
    // Generates @up201905892/tokens/dist (CSS read by the tests) when it is missing.
    globalSetup: ['./test/global-setup.ts'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['../../test/setup.ts'],
    passWithNoTests: true,
  },
});
