import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Network requests need more time than local code
    testTimeout: 30_000,
  },
})
