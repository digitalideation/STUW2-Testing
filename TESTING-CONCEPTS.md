# Testing Concepts

## Start here: what is a test?

The simplest test you can write is an `if` statement that throws when something is wrong:

```javascript
function add(a, b) {
  return a + b
}

if (add(2, 3) !== 5) {
  throw new Error('Expected add(2, 3) to return 5')
}
```

That's it. No framework needed. Run the file — if nothing crashes, the test passed.

The problem is that as you write dozens or hundreds of these, you need:
- A way to run them all at once and see a summary
- Clear output showing which one failed and why
- A consistent, readable way to write the checks

That's why testing frameworks like **Vitest** and **Jest** exist. They replace the `if` statements with readable functions:

```javascript
import { test, expect } from 'vitest'

test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5)
})
```

The result is the same — either it passes or it fails — but now the framework handles running everything and formatting the output.

---

## Why write tests at all?

Consider this scenario: you fix a bug in your sign-up form. You test it manually — it works. You ship it.

Two days later someone reports the password reset link is broken. Your change accidentally broke something you didn't touch.

This is called a **regression** — code that worked before, broken by a later change.

Tests catch regressions automatically. Every time you change code, you re-run the tests. If something breaks, you know immediately — and you know *which* test failed, which points to *where* the problem is.

Without tests, the only way to know if you broke something is to manually test every feature after every change. That doesn't scale.

---

## Three kinds of tests

Not all tests work the same way. There are three main types, each with different trade-offs.

### 1. Unit tests

A unit test checks **one function in isolation**.

```javascript
test('rejects an email with no domain', () => {
  expect(isValidEmail('user@')).toBe(false)
})
```

- Runs in milliseconds
- No network, no database, no browser
- Always gives the same result
- Easy to debug when it fails — only one thing can be wrong

Unit tests are the foundation. Write them for any function with real logic.

**Limitation:** A function can pass all its unit tests and still be wired up wrong in the actual application.

---

### 2. API tests (integration tests)

An API test sends a **real HTTP request** to a real service and checks the response.

```javascript
test('returns hikes near Bern', async () => {
  const res = await fetch('https://api.gowandr.app/find-hikes', {
    method: 'POST',
    body: JSON.stringify({ mode: 'top', lat: 46.948, lng: 7.447 }),
  })
  expect(res.status).toBe(200)
  const hikes = await res.json()
  expect(hikes.length).toBeGreaterThan(0)
})
```

- Takes seconds (network round-trip)
- Tests that your code and the external service work together
- Catches issues that unit tests miss: wrong field names, unexpected data formats, API changes

**Limitation:** Relies on the external service being available. If the API is down or slow, the test fails for reasons unrelated to your code.

---

### 3. End-to-end (E2E) tests

An E2E test **controls a real browser** and simulates a user clicking through your application.

```javascript
test('user can search for hikes', async ({ page }) => {
  await page.goto('https://gowandr.app/map')
  await page.locator('.search-input').fill('Bern')
  await page.locator('.suggestion-item').first().click()
  await expect(page.locator('.animated-hike-path').first()).toBeVisible()
})
```

- Takes 5–30 seconds per test
- Tests the entire system: frontend, backend, database, rendering
- Closest thing to a real user — if this passes, you know it works
- Requires a browser installation

**Limitation:** Slow, and sensitive to UI changes. A CSS class rename or an animation timing change can break an E2E test even when the feature itself is working perfectly.

---

## How they compare

| | Unit | API | E2E |
|---|---|---|---|
| **Speed** | Milliseconds | Seconds | Seconds–minutes |
| **What breaks them** | Logic errors | API changes, network | UI changes, timing |
| **Failure diagnosis** | Easy — one function | Moderate | Hard — many moving parts |
| **Confidence** | Low (logic only) | Medium | High (real system) |
| **When to write them** | For all non-trivial functions | For important API contracts | For critical user flows |

---

## The testing pyramid

Teams write many unit tests, some API tests, and few E2E tests — not because E2E tests are bad, but because they're expensive:

```
           /\
          /  \
         / E2E \       ← a handful: login, checkout, critical paths
        /────────\
       /   API    \    ← key endpoints and integrations
      /────────────\
     /  Unit Tests  \  ← every function with real logic
    /────────────────\
```

If you wrote only E2E tests, a full suite could take 30 minutes to run. Developers stop running it. Bugs slip through.

If you wrote only unit tests, your functions are verified in isolation — but you have no idea if they work together.

You need all three layers, in the right proportions.

---

## A word on flaky tests

An E2E test that passes 9 times out of 10 is almost worse than no test. When a test fails intermittently, developers start ignoring failures. They assume it's "probably fine." Eventually a real bug gets ignored too.

Flakiness usually comes from:
- **Timing** — the test clicks before the page has fully loaded
- **Network** — an external API was slow or returned an unexpected response
- **State** — a previous test left data behind that affects this one

Good E2E tests use explicit waits (`page.waitForResponse(...)`) instead of `sleep` calls, and avoid depending on shared state.

---

## Why not just test manually?

Manual testing is fine for exploring a new feature. But it doesn't scale, and it doesn't catch regressions.

Every time you change code, you would need to manually re-test every feature that could have been affected. In a large application, that might take hours. And it's boring, so people skip it.

Automated tests run in seconds, run on every commit, and never get tired.

The goal is not a test suite that proves the code is perfect. It's a test suite that gives your team the **confidence to keep shipping**.
