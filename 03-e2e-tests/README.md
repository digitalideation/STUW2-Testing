# Section 03 — End-to-End Tests

## What is an E2E test?

An **end-to-end (E2E) test** controls a real browser and simulates what an actual user does: clicking buttons, typing in forms, navigating pages.

Compared to unit and API tests:
- Much slower (launches a full browser)
- Tests the entire stack at once: frontend, backend, database
- Catches bugs that only appear in the real UI
- Can be fragile (layout changes, network delays, animations)

You are going to test a **local signup form** — a small web app that lives right here in this folder.

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

---

## Running the app and the tests

E2E tests need a running application to test against. You start the two pieces separately — just like in a real project.

**Step 1 — start the app** (in one terminal):
```bash
npm start
```
You should see:
```
Signup app running at http://localhost:4321
```
Open that URL in your browser and have a look at the signup form before writing any tests.

**Step 2 — run the tests** (in a second terminal):
```bash
npm test
```

The browser will open automatically so you can watch what Playwright is doing. That is intentional — seeing the browser is the best way to understand what your test is actually doing.

**Run with Playwright's interactive UI** (great for debugging):
```bash
npm run test:ui
```

---

## Files

```
03-e2e-tests/
├── signup.html            ← the web app being tested
├── server.js              ← tiny static file server (no dependencies)
├── playwright.config.js   ← timeouts, browser settings, base URL
└── tests/
    └── signup.spec.js     ← the tests
```

**Why `.spec.js`?**
`spec` is short for *specification*. A test file *specifies* how the software is supposed to behave. The convention comes from the Ruby testing world and spread across the JavaScript ecosystem. `.spec.js` and `.test.js` mean exactly the same thing — you'll see both in the wild.

---

## Understanding the app

Before writing tests, open `http://localhost:4321` in your browser and try the form:

- What happens when you submit with empty fields?
- What happens if the passwords don't match?
- What does a successful signup look like?

Use **DevTools → Inspector** (right-click → Inspect) to find the `id` attributes of elements you want to interact with.

Key selectors used in the starter code:

| Selector | Element |
|----------|---------|
| `#signup-form` | The signup form |
| `#name` | Full name input |
| `#email` | Email input |
| `#password` | Password input |
| `#confirm` | Confirm password input |
| `button[type="submit"]` | The submit button |
| `#name-error` | Validation error for name |
| `#email-error` | Validation error for email |
| `#password-error` | Validation error for password |
| `#confirm-error` | Validation error for confirm password |
| `#success` | Success banner shown after valid submission |
| `#success-message` | The text inside the success banner |

---

## Exercise 1 — Mismatched passwords (~15 min)

Open `tests/signup.spec.js` and find the **Exercise 2** test (mismatched passwords).

The skeleton is already there. Your job:

1. Fill in name, email, and a valid password
2. Type a *different* value into the confirm field
3. Click submit
4. Assert that `#confirm-error` is visible
5. Assert that `#success` is **not** visible

**Checkpoint:** The test passes with a real assertion.

---

## Exercise 2 — Write your own scenario (~20 min)

Find the **Exercise 3** test and write a complete test for a scenario of your choice.

Ideas listed in the test file:
- Verify the page title
- Check that a password shorter than 8 characters shows the password error
- Check that an invalid email (e.g. `notanemail`) shows the email error
- Verify that fixing an error after a failed submit makes the red border disappear

**Checkpoint:** Your test passes and tests something meaningful.

---

## Debugging tips

| Problem | Solution |
|---------|----------|
| "Connection refused" | The server is not running — open a terminal and run `npm start` first |
| Test fails with "timeout" | The element didn't appear — watch the browser to see what happened |
| Element not found | Open DevTools and verify the `id` or selector |
| Test passes but shouldn't | Your selector might be matching something unexpected |

---

## Useful Playwright APIs

```javascript
// Navigate
await page.goto('/')

// Find elements
page.locator('#id')                    // by id
page.locator('.class-name')            // by CSS class
page.locator('button[type="submit"]')  // by attribute
page.locator('text=Click me')          // by visible text

// Interact
await locator.click()
await locator.fill('some text')
await locator.press('Enter')

// Wait and assert
await expect(locator).toBeVisible()
await expect(locator).not.toBeVisible()
await expect(locator).toHaveText('Hello')
await expect(locator).toContainText('partial')
await expect(page).toHaveTitle('My Page')

// Debug — freezes the browser and opens Playwright Inspector
await page.pause()
```

---

## Bonus challenges

- **Mock a server response:** Use `page.route('/api/signup', ...)` to simulate a "email already taken" error from a backend
- **Mobile view:** Add `test.use({ viewport: { width: 390, height: 844 } })` and check the form still works
- **Screenshot:** Call `await page.screenshot({ path: 'result.png' })` after a successful signup and inspect the image
- **Keyboard navigation:** Tab through all fields and submit with Enter — does it work without a mouse?
