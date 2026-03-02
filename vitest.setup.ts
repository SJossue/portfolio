import '@testing-library/jest-dom/vitest';

// Provide matchMedia stub for jsdom (used by reduced-motion detection)
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () =>
    ({
      matches: false,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
