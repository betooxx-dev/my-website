import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/__tests__/**/*.test.ts"],
};

const resolveJestConfig = createJestConfig(config);

export default async () => {
  const resolved = await resolveJestConfig();
  // Unified/remark/rehype are ESM-only; SWC must transpile their dependency
  // graph so the Markdown renderer is exercised instead of merely mocked.
  resolved.transformIgnorePatterns = ["^.+\\.module\\.(css|sass|scss)$"];
  return resolved;
};
