import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',

  // Overall timeout per test
  timeout: 45_000,

  // Timeout for each expect() assertion
  expect: { timeout: 10_000 },

  use: {
    baseURL: 'https://gowandr.app',
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
