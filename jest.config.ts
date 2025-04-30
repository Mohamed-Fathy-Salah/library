import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.spec.ts", "**/__tests__/**/*.test.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/node_modules/**",
    "!src/types/**/*.ts",
  ],
  coverageDirectory: "coverage",
  setupFiles: ["./jest.setup.ts"],
  clearMocks: true,
};

export default config;
