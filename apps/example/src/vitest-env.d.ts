// This package resolves its own vitest instance, so the jest-dom matcher types registered by
// ../../test/setup.ts do not reach it. Register them here too.
import '@testing-library/jest-dom/vitest';
