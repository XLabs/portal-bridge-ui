import type { Config } from "jest";

export default {
  coverageProvider: "v8",
  verbose: true,
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "html"],
  testMatch: ["<rootDir>/**/*.test.ts", "<rootDir>/**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
  testEnvironment: "jsdom",
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?uuid)'
  ],
  moduleNameMapper: {
    "@env": "<rootDir>/src/env/index.ts",
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx,js,jsx}",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/main.tsx",
    "!<rootDir>/src/env/**/*.*",
    "!<rootDir>/src/theme/**/*.*",
  ],
  coverageThreshold: {
    global: {
      // statements: 100,
      // branches: 100,
      // functions: 100,
      // lines: 100
    },
  },
  coverageReporters: ["lcov", "text", "text-summary"],
} as Config;
