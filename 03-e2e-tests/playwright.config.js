import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',

  // Overall timeout per test
  timeout: 30_000,

  // Timeout for each expect() assertion
  expect: { timeout: 5_000 },

  use: {
    baseURL: 'http://localhost:4321',
    headless: false,
    viewport: { width: 1280, height: 720 },

    // Save a screenshot and video when a test fails — useful for debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
