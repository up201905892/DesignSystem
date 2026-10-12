// This package has @types/node, which gives vitest its own peer instance, so the jest-dom
// matcher types registered by ../../test/setup.ts do not reach it. Register them here too.
import '@testing-library/jest-dom/vitest';
