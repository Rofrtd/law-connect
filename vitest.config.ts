import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.ts?(x)"],
    exclude: ["e2e/**", "node_modules/**"],
    coverage: { provider: "v8" },
    setupFiles: ["./vitest.setup.ts"],
  },
});
