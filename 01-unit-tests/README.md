# Section 01 — Unit Tests

## What is a unit test?

A **unit test** checks one small piece of logic in isolation.

- Input goes in → expected output comes out
- Runs in milliseconds
- No network, no database, no side effects

You're going to test a function that validates email addresses. This is a good first example because:
- Everyone already has an intuition for what a valid email looks like
- There are surprising edge cases that easy implementations miss
- A bug in production breaks sign-up forms, password resets, and notifications

---

## Setup

```bash
cd 01-unit-tests
npm install
npm test
```

**Expected output:** You should see 2 passing tests and 2 failing tests.

That's intentional. The implementation in `src/emailValidator.js` is incomplete.

---

## How does `npm test` know what to run?

Open `package.json` in this folder. You'll see this:

```json
{
  "scripts": {
    "test": "vitest run --reporter=verbose",
    "test:watch": "vitest"
  }
}
```

`npm test` is a shortcut. All it does is look up the `"test"` key inside `"scripts"` and run that command — in this case `vitest run --reporter=verbose`.

**Vitest** is the testing framework. It does the actual work:
1. Looks for files ending in `.test.js`
2. Runs every `test(...)` block it finds
3. Prints which passed and which failed

You could run `npx vitest run --reporter=verbose` directly and get the exact same result. `npm test` is just a convenient shorthand that works the same way in every project, regardless of which framework is being used underneath.

---

## Files

```
01-unit-tests/
├── src/
│   └── emailValidator.js   ← the function you'll fix
└── tests/
    └── emailValidator.test.js   ← the tests (read these first)
```

Open both files before starting. Read the tests to understand what the function is supposed to do.

---

## Exercise 1 — Fix the failing tests (~15 min)

Run `npm test` and look at which tests fail.

For each failing test:
1. Read the test name — it describes what the function *should* do
2. Look at `emailValidator.js` — what does it actually do?
3. Fix the function
4. Run `npm test` again

**Checkpoint:** All 4 starter tests should pass before moving on.

> Tip: `npm run test:watch` re-runs tests every time you save a file — useful for fast feedback.

---

## Exercise 2 — Uncomment the edge cases (~15 min)

Open `tests/emailValidator.test.js` and find the **Exercise 1** describe block.

Uncomment the tests one at a time. For each one:

1. Uncomment the test
2. Run `npm test`
3. If it fails, update `emailValidator.js` to make it pass
4. Make sure earlier tests still pass

**Important:** When you fix a new edge case, you might accidentally break an older test. This is called a **regression**. Fix it before moving on.

**Checkpoint:** All uncommented tests are green.

---

## Exercise 3 — Write your own tests (~15 min)

Find the **Exercise 2** describe block in the test file.

Write at least 3 test cases. Think about inputs that could trick or break your implementation. There are hints in the comments.

---

## Key terms

| Term | What it means |
|------|--------------|
| `describe` | Groups related tests together |
| `test` | A single test case |
| `expect` | Makes an assertion about a value |
| `.toBe(x)` | Checks that the value is exactly `x` |
| `toBeTruthy` / `toBeFalsy` | Checks truthiness |
| **regression** | A previously passing test that now fails after a change |

---

## Bonus challenge

Look up how email validation actually works:
- The HTML `<input type="email">` element uses a specific regex
- The official spec (RFC 5322) is much more permissive than you'd expect

Questions to discuss:
- What valid emails does your implementation incorrectly reject?
- What invalid emails does it incorrectly accept?
- Is "perfect" validation worth the complexity? What's the alternative?
