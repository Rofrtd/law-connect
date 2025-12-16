import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm run start -- --port 3001",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    env: {
      SQLITE_PATH: "db.e2e.sqlite",
      LLM_MODE: "fake",
    },
  },
});
