const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",

  // Module paths and aliases
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@/app/(.*)$": "<rootDir>/src/app/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/context/(.*)$": "<rootDir>/src/context/$1",
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png|jpg|jpeg)$": "<rootDir>/__mocks__/fileMock.js",
  },

  // Test patterns
  testMatch: [
    "**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)",
  ],

  // Coverage configuration
  collectCoverageFrom: [
    "src/components/**/*.{js,jsx,ts,tsx}",
    "src/app/**/*.{js,jsx,ts,tsx}",
    "src/pages/**/*.{js,jsx,ts,tsx}",
    "src/lib/**/*.{js,jsx,ts,tsx}",
    "src/hooks/**/*.{js,jsx,ts,tsx}",
    "src/context/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!jest.config.js",
    "!next.config.js",
    "!src/__tests__/**",
    "!src/__mocks__/**",
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },

  // Transform configuration
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  // Test timeout - increased for integration tests
  testTimeout: 30000,

  // Ignore patterns
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/out/",
  ],

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Reporters
  reporters: ["default"],

  // Verbose output
  verbose: false,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Coverage reporters
  coverageReporters: ["text", "lcov", "html"],

  // Coverage directory
  coverageDirectory: "coverage",

  // Enhanced test environment options for JSDOM
  testEnvironmentOptions: {
    url: "http://localhost:3000",
    userAgent: "jest-test-environment",
  },

  // Global setup and teardown
  globalSetup: undefined,
  globalTeardown: undefined,

  // Error handling
  errorOnDeprecated: false,
  
  // Additional Jest options for better stability
  maxWorkers: 1, // Run tests serially to avoid conflicts
  forceExit: true, // Force Jest to exit after tests complete
};

module.exports = createJestConfig(customJestConfig);