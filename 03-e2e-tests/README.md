# Section 03 — End-to-End Tests

## What is an E2E test?

An **end-to-end (E2E) test** controls a real browser and simulates what an actual user does: clicking buttons, typing in forms, navigating pages.

Compared to unit and API tests:
- Much slower (launches a full browser)
- Tests the entire stack at once: frontend, backend, database
- Catches bugs that only appear in the real UI
- Can be fragile (layout changes, network delays, animations)

You're going to test `https://gowandr.app` — a live hiking route finder.

---

## The tool: Playwright

Playwright is a browser automation library. It can:
- Open a browser (Chrome, Firefox, Safari) and navigate to URLs
- Click, type, scroll, and interact with any element
- Wait for things to appear, disappear, or change
- Intercept and mock network requests
- Take screenshots and record video

---

## Setup

```bash
cd 03-e2e-tests
npm install
npm run install:browsers   # downloads Chromium (~120 MB, one-time)
```

**Run tests (no browser visible — fast):**
```bash
npm test
```

**Run tests with the browser visible — recommended for this workshop:**
```bash
npm run test:headed
```

**Run with Playwright's interactive UI:**
```bash
npm run test:ui
```

> Tip: Use `--headed` when learning — watching the browser is the best way to understand what your test is doing.

---

## Files

```
03-e2e-tests/
├── playwright.config.js   ← timeouts, browser settings
└── tests/
    └── gowandr.spec.js    ← your tests
```

---

## Understanding the site

Before writing tests, open `https://gowandr.app/map` in your browser and spend 2–3 minutes exploring:

- Where is the search box?
- What happens when you type a location?
- What are the filter pills?
- How do you know when results have loaded?

Use **DevTools → Inspector** (right-click → Inspect) to find the CSS class names of elements you want to interact with.

Key selectors used in the starter code:

| Selector | Element |
|----------|---------|
| `.search-input` | The location text input |
| `.suggestion-item` | Autocomplete dropdown items |
| `.animated-hike-path` | Hike route paths drawn on the map |
| `.filter-pill` | Filter toggle buttons at the top |
| `.popup-done-button` | Confirm button inside a filter popup |

---

## Exercise 1 — Apply a filter (~25 min)

Open `tests/gowandr.spec.js` and find the **Exercise 1** test.

The test already performs a search. Your job is to complete it:

1. Click one of the filter pills
2. Wait for the results to update
3. Assert that the results changed

**Tips:**
- Use `npm run test:headed` so you can see what's happening
- Use `page.pause()` to freeze the browser mid-test (Playwright's debugger will open)
- Use `await page.locator('...').click()` to click elements
- Use `page.waitForResponse(...)` to wait for an API call to complete

**Checkpoint:** The test passes and makes a real assertion about the filter result.

---

## Exercise 2 — Write your own scenario (~25 min)

Find the **Exercise 2** test and write a complete test for a scenario of your choice.

Ideas are listed in the test file. Pick one that interests you.

**Checkpoint:** Your test passes and tests something meaningful.

---

## Debugging tips

| Problem | Solution |
|---------|----------|
| Test fails with "timeout" | The element didn't appear — use `--headed` to watch what happens |
| Element not found | Open DevTools and verify the CSS class name |
| Test passes but shouldn't | Your selector might be matching something unexpected |
| `page.waitForResponse` times out | The API call happened before the await — restructure with `Promise.all` |

---

## Useful Playwright APIs

```javascript
// Navigate
await page.goto('/map')

// Find elements
page.locator('.class-name')        // by CSS class
page.locator('text=Click me')      // by visible text
page.locator('[data-testid="foo"]') // by data attribute

// Interact
await locator.click()
await locator.fill('some text')
await locator.press('Enter')

// Wait and assert
await expect(locator).toBeVisible()
await expect(locator).toHaveText('Hello')
await expect(page).toHaveTitle('My Page')

// Wait for network
await page.waitForResponse(res => res.url().includes('api'))
await page.waitForLoadState('networkidle')

// Debug
await page.pause()  // opens Playwright Inspector
```

---

## Bonus challenges

- **Mock the API:** Use `page.route(...)` to intercept the API call and return fake data. Does the UI handle it correctly?
- **Mobile view:** Add `test.use({ viewport: { width: 390, height: 844 } })` and test the mobile layout
- **Screenshot test:** Take a screenshot after the results load and compare it visually
- **Accessibility:** Check that all interactive elements have accessible labels
