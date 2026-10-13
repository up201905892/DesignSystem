// Shared Vitest setup: registers the jest-dom matchers and their types.
// React Testing Library cleans up automatically because `globals: true`
// is set in each package's vitest config.
import '@testing-library/jest-dom/vitest';

// jsdom polyfills needed by Radix primitives.
if (typeof window !== 'undefined') {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver ??= ResizeObserverStub;
  globalThis.ResizeObserver ??= ResizeObserverStub;

  const proto = window.Element.prototype;
  proto.hasPointerCapture ||= () => false;
  proto.setPointerCapture ||= () => {};
  proto.releasePointerCapture ||= () => {};
  proto.scrollIntoView ||= () => {};

  window.matchMedia ??= (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
