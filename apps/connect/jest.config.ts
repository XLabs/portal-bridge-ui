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
  moduleNameMapper: {
    "@env": "<rootDir>/src/env/index.ts"
  },
} as Config;
