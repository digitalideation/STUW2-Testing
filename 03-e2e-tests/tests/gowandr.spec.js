import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────────────────────────────────────
// End-to-end tests for https://gowandr.app
//
// These tests simulate a real user:
//   - opening a browser
//   - typing in a search box
//   - clicking on results
//   - applying filters
//
// Run (headless):  npm test
// Run (browser visible): npm run test:headed   ← recommended for learning!
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Gowandr — search for hikes', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the map page before each test
    await page.goto('/map')
    // Wait until the initial network activity settles
    await page.waitForLoadState('networkidle')
  })

  // ─────────────────────────────────────────────────────────────────────────
  // EXAMPLE TEST — complete, working, ready to run
  //
  // This simulates a user searching for hikes near Bern.
  // Read through it step by step before running it.
  // ─────────────────────────────────────────────────────────────────────────

  test('user searches for hikes near Bern and sees results on the map', async ({ page }) => {
    // STEP 1: Find the search input and type a location
    const searchInput = page.locator('.search-input')
    await expect(searchInput).toBeVisible()
    await searchInput.click()
    await searchInput.fill('Bern')

    // STEP 2: Wait for autocomplete suggestions to appear
    const suggestions = page.locator('.suggestion-item')
    await expect(suggestions.first()).toBeVisible({ timeout: 5_000 })
    console.log(`Found ${await suggestions.count()} autocomplete suggestions`)

    // STEP 3: Click the first suggestion
    // Also wait for the API call that fires when the user picks a location
    const [apiResponse] = await Promise.all([
      page.waitForResponse(
        res => res.url().includes('find-hikes') && res.status() === 200,
        { timeout: 15_000 }
      ),
      suggestions.first().click(),
    ])

    // STEP 4: Parse the API response to confirm hikes were returned
    const hikes = await apiResponse.json()
    console.log(`API returned ${hikes.length} hikes near Bern`)
    expect(hikes.length).toBeGreaterThan(0)

    // STEP 5: Confirm that hike paths are now drawn on the map
    const hikePaths = page.locator('.animated-hike-path')
    await expect(hikePaths.first()).toBeVisible({ timeout: 10_000 })

    const pathCount = await hikePaths.count()
    console.log(`${pathCount} hike paths visible on the map`)
    expect(pathCount).toBeGreaterThan(0)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISE 1 — Apply a filter after searching
  //
  // The map page has filter pills at the top (`.filter-pill`).
  // Your task: after finding hikes, click a filter pill and verify
  // that the results change.
  //
  // Hints:
  //   - Use the browser DevTools (right-click → Inspect) to understand
  //     what each filter pill does and how to identify them
  //   - After clicking a filter, the API will be called again
  //   - You can use page.waitForResponse(...) again to catch the new call
  //   - The hike count might go up or down — either is a valid test
  // ─────────────────────────────────────────────────────────────────────────

  test('applying a filter updates the search results (Exercise 1)', async ({ page }) => {
    // STEP 1: Perform a search first (same as the example test)
    const searchInput = page.locator('.search-input')
    await searchInput.click()
    await searchInput.fill('Bern')

    const [firstResponse] = await Promise.all([
      page.waitForResponse(
        res => res.url().includes('find-hikes') && res.status() === 200,
        { timeout: 15_000 }
      ),
      page.locator('.suggestion-item').first().click(),
    ])

    const hikesBeforeFilter = await firstResponse.json()
    const countBefore = hikesBeforeFilter.length
    console.log(`Before filter: ${countBefore} hikes`)

    // STEP 2: TODO — click a filter pill
    // Open the browser DevTools and inspect the filter pills.
    // Find the right selector and click one.
    //
    // const filterPill = page.locator('.filter-pill').first()
    // await filterPill.click()

    // STEP 3: TODO — wait for the map to update
    // The API might be called again, or the UI might update immediately.
    //
    // const [filteredResponse] = await Promise.all([
    //   page.waitForResponse(
    //     res => res.url().includes('find-hikes') && res.status() === 200,
    //     { timeout: 15_000 }
    //   ),
    //   page.locator('.popup-done-button').click(), // or wherever the filter is applied
    // ])

    // STEP 4: TODO — assert that the results changed
    //
    // const hikesAfterFilter = await filteredResponse.json()
    // const countAfter = hikesAfterFilter.length
    // console.log(`After filter: ${countAfter} hikes`)
    // expect(countAfter).not.toBe(countBefore)  // OR check a specific condition

    // Placeholder so the test doesn't error while you're working on it
    expect(countBefore).toBeGreaterThan(0)
  })

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISE 2 — Write your own test scenario
  //
  // Pick one of the following and write a test for it:
  //
  //   a) Search for hikes near a different city (Zurich, Geneva, Basel...)
  //      and verify you get results
  //
  //   b) Verify that the page title is correct
  //      Hint: expect(page).toHaveTitle(...)
  //
  //   c) Verify that the search input is visible and focused when the page loads
  //
  //   d) Test that searching for an invalid/unknown location shows no results
  //      or shows an appropriate message
  //
  //   e) Test that the language toggle works (English / Deutsch)
  //
  // Look at the Playwright docs for useful methods:
  //   https://playwright.dev/docs/api/class-page
  //   https://playwright.dev/docs/api/class-locator
  // ─────────────────────────────────────────────────────────────────────────

  test('your own scenario (Exercise 2)', async ({ page }) => {
    // Write your test here!
    //
    // Start by navigating somewhere or interacting with an element:
    // await page.goto('/map')
    // await page.locator('...').click()
    // await expect(page.locator('...')).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BONUS — More test ideas
//
// If you have time, try one of these:
//
//   1. Intercept the API call and replace it with mock data
//      (page.route(...) lets you intercept network requests)
//
//   2. Test mobile layout by changing the viewport:
//      test.use({ viewport: { width: 390, height: 844 } })
//
//   3. Write a test that takes a screenshot and saves it
//      await page.screenshot({ path: 'results.png' })
//
//   4. Verify accessibility: check that interactive elements have aria labels
// ─────────────────────────────────────────────────────────────────────────────
