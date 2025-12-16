import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.ts?(x)"],
    exclude: ["e2e/**", "node_modules/**"],
    coverage: { provider: "v8" },
  },
});
