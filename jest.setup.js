/**
 * Jest Setup Configuration
 *
 * Configures the test environment with necessary mocks and utilities:
 * - Browser APIs (localStorage, matchMedia, IntersectionObserver, ResizeObserver)
 * - Next.js navigation hooks
 * - Console output filtering to reduce test noise
 * - Global fetch mock for API calls
 */

import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

configure({
  testIdAttribute: "data-testid",
});

/**
 * Global fetch mock
 * Returns a successful response with empty results by default
 */
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        success: true,
        data: { results: [] },
      }),
  })
);

/**
 * Mock Next.js navigation hooks
 * Provides mock implementations for useRouter, usePathname, and useSearchParams
 */
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

/**
 * Mock localStorage implementation
 * Provides an in-memory storage that mimics browser localStorage API
 */
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

/**
 * Mock window.matchMedia
 * Required for components that use media queries
 * Includes both modern (addEventListener) and legacy (addListener) APIs
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => {
    const mediaQuery = {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    mediaQuery.addEventListener = jest.fn((event, callback) => {
      // Mock implementation, no actual event handling
    });

    return mediaQuery;
  }),
});

/**
 * Mock IntersectionObserver
 * Required for components using intersection detection (e.g., lazy loading)
 */
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

/**
 * Mock ResizeObserver
 * Required for components that observe element size changes
 */
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

/**
 * Console output filtering patterns
 * Suppresses known non-critical warnings and errors to keep test output clean
 */
const filterPatterns = [
  /Warning: An update to .* inside a test was not wrapped in act/,
  /Warning: ReactDOMTestUtils.act/,
  /Warning: validateDOMNesting/,
  /Warning: Each child in a list should have a unique "key" prop/,
  /API Error/,
  /ReferenceError: fetch is not defined/,
  /Search error:/,
  /AuthContext:/,
  /ThemeContext:/,
  /Unable to set up system theme listener/,
  /TypeError: Cannot read properties of undefined \(reading 'addEventListener'\)/,
  /\[MSW\]/,
  /Warning: You seem to have overlapping act/,
  /Error: Uncaught \[TypeError/,
  /motionMediaQuery\.addListener/,
  /observer\.observe/,
  /Consider adding an error boundary/,
  /The above error occurred/,
  /DEP0040/,
  /punycode/,
];

/**
 * Check if a console message should be filtered
 */
const shouldFilterMessage = (message) => {
  // Convert to string if it's an Error object
  const msgStr =
    message instanceof Error
      ? message.message || message.toString()
      : typeof message === "string"
        ? message
        : String(message);

  return filterPatterns.some((pattern) => pattern.test(msgStr));
};

const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

/**
 * Override console methods to filter out noise
 */
console.error = (...args) => {
  // Check first argument and error stack
  if (shouldFilterMessage(args[0])) return;

  // Also check the full stringified output
  const fullMsg = args
    .map((a) => (a instanceof Error ? a.stack || a.message : String(a)))
    .join(" ");

  if (shouldFilterMessage(fullMsg)) return;

  originalError.call(console, ...args);
};

console.warn = (...args) => {
  const message = args[0];
  if (shouldFilterMessage(message)) {
    return;
  }
  originalWarn.call(console, ...args);
};

console.log = (...args) => {
  const message = args[0];
  if (shouldFilterMessage(message)) {
    return;
  }
  originalLog.call(console, ...args);
};

/**
 * Clean up after each test
 */
afterEach(() => {
  localStorageMock.clear();
  jest.clearAllTimers();

  if (global.fetch.mockClear) {
    global.fetch.mockClear();
  }
});

/**
 * Restore original console methods after all tests
 */
afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

/**
 * Suppress unhandled promise rejections that match filter patterns
 */
const originalListeners = process.listeners("unhandledRejection");
process.removeAllListeners("unhandledRejection");
process.on("unhandledRejection", (error) => {
  if (error.message && shouldFilterMessage(error.message)) {
    return;
  }
  originalError("Unhandled promise rejection:", error);
});

/**
 * Restore unhandled rejection listeners on exit
 */
process.on("exit", () => {
  originalListeners.forEach((listener) => {
    process.on("unhandledRejection", listener);
  });
});
