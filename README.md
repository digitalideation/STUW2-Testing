# Software Testing Workshop

A hands-on workshop for learning software testing through real code and real systems.

No slides. No lecture. You'll run tests, break things, and fix them.

---

## What is a test?

A test is code that runs your code and checks whether it does what you expect.

```javascript
expect(isValidEmail('hello@example.com')).toBe(true)   // ✅ passes
expect(isValidEmail('notanemail')).toBe(false)          // ✅ passes
expect(isValidEmail('user@')).toBe(false)               // ❌ fails — bug found!
```

When tests fail, they tell you exactly what broke and why. That's the whole point.

---

## What is `npm test`?

Each folder in this workshop has a `package.json` file. Inside it is a `test` script:

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

Running `npm test` tells npm to execute that script, which launches **Vitest** — a testing framework. Vitest finds all files ending in `.test.js`, runs them one by one, and prints the results.

**Reading the output:**

```
✓ accepts a standard email address      ← this test passed
× rejects an email with nothing after @ ← this test failed
  → expected true to be false           ← what went wrong
```

---

## What is a testing framework?

A testing framework gives you:

- Functions to write tests (`test(...)`, `expect(...)`)
- A runner that finds and executes them automatically
- A readable report: which passed, which failed, and why

**Common JavaScript testing frameworks:**

| Framework | What it's used for |
|-----------|-------------------|
| **Vitest** | Unit and API tests — modern, fast. Used in sections 01 and 02. |
| **Jest** | The most widely used. Nearly identical API to Vitest. |
| **Playwright** | Browser automation and end-to-end testing. Used in section 03. |
| **Mocha / Jasmine** | Older frameworks, less common in new projects. |

Vitest and Jest share almost the same syntax. Learning one means you can read and write the other.

---

## Sections

| # | Topic | Tool |
|---|-------|------|
| [01 — Unit Tests](./01-unit-tests/) | Validating an email address | Vitest |
| [02 — API Tests](./02-api-tests/) | Testing a real hiking API | Vitest + fetch |
| [03 — E2E Tests](./03-e2e-tests/) | Testing a local signup form end-to-end | Playwright |

Finish with [Testing Concepts](./TESTING-CONCEPTS.md) — a short explanation of how all three types relate.

---

## Prerequisites

- **Node.js 18 or higher** — check with `node --version`
- **npm** — check with `npm --version`
- A code editor (VS Code recommended)
- A terminal

---

## Section 01 — Unit Tests

**What you'll do:** Fix a broken email validation function, then add your own test cases.

```bash
cd 01-unit-tests
npm install          # downloads the testing framework (one-time)
npm test             # runs the tests
```

When you run `npm test` for the first time, you'll see **2 passing and 2 failing** tests. That's intentional — the function in `src/emailValidator.js` has bugs.

**Your tasks:**
1. Open `src/emailValidator.js` and `tests/emailValidator.test.js` — read both
2. Look at the failing tests and understand *why* they fail
3. Fix the function until all 4 starter tests pass
4. Uncomment the edge-case tests one at a time (in the Exercise 1 block) and make those pass too
5. Write at least 3 tests of your own in the Exercise 2 block

Use `npm run test:watch` while working — it re-runs tests automatically every time you save.

---

## Section 02 — API Tests

**What you'll do:** Send real HTTP requests to a live hiking API and test the responses.

```bash
cd 02-api-tests
npm install
npm test
```

The API endpoint is `POST https://api.gowandr.app/find-hikes`. You don't need to set anything up — it's a real public API.

On first run, the HTTP basics tests will pass. The filter tests have `TODO` placeholders. Read the console output from the discovery tests to understand the API response structure, then fill in the assertions.

**Your tasks:**
1. Run `npm test` and read the console output — the discovery tests print the raw API response
2. Find the correct field name for hike length in the response
3. Complete the `TODO` assertions in the length filter tests (Exercise 1)
4. Discover what direction values exist and complete the direction filter test (Exercise 2)
5. Run the edge-case tests and add assertions based on what the API actually returns (Exercise 3)

---

## Section 03 — E2E Tests

**What you'll do:** Automate a real browser to fill in a signup form and verify the form behaves correctly.

```bash
cd 03-e2e-tests
npm install
npm run install:browsers   # downloads Chromium — required once (~120 MB)
npm start                  # start the local signup app (keep this terminal open)
```

Then, in a second terminal:
```bash
npm run test:ui            # opens Playwright's interactive UI — recommended for learning
```

**Your tasks:**
1. Open `http://localhost:4321` in your browser and try the signup form manually
2. Run `npm run test:ui` and watch the two example tests run — see each step highlighted in the browser
3. Complete Exercise 1: test that mismatched passwords show an error
4. Complete Exercise 2: write your own test scenario

---

## When you're done

Read [TESTING-CONCEPTS.md](./TESTING-CONCEPTS.md) — it explains the difference between the three types of tests and when to use each one.
