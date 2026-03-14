import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";

loadEnvConfig(process.cwd(), false);

const isCI = Boolean(process.env.CI);
const shouldRunWebkit =
  isCI || process.platform !== "linux" || process.env.PLAYWRIGHT_INCLUDE_WEBKIT === "1";
const webServerEnv = {
  ...process.env,
  NODE_ENV: isCI ? "production" : "development",
};

export default defineConfig({
  fullyParallel: true,
  retries: 1,
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: isCI ? "npm run build && npm run start" : "npm run dev",
    env: webServerEnv,
    reuseExistingServer: !isCI,
    stderr: "pipe",
    stdout: "pipe",
    timeout: 120_000,
    url: "http://localhost:3000/dashboard",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    ...(shouldRunWebkit
      ? [
          {
            name: "webkit",
            use: {
              ...devices["Desktop Safari"],
            },
          },
        ]
      : []),
  ],
});
