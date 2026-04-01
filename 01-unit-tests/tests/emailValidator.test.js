import { describe, test, expect } from "vitest";
import { isValidEmail } from "../src/emailValidator.js";

// ─────────────────────────────────────────────────────────────────────────────
// STARTER TESTS
//
// Run: npm test
//
// Two tests will PASS. Two will FAIL.
// Your first job: fix src/emailValidator.js so all four pass.
//
// Don't change the tests — change the implementation.
// ─────────────────────────────────────────────────────────────────────────────

describe("isValidEmail — starter tests", () => {
  test("accepts a standard email address", () => {
    expect(isValidEmail("hello@example.com")).toBe(true);
  });

  test("rejects a plain string with no @ symbol", () => {
    expect(isValidEmail("notanemail")).toBe(false);
  });

  test("rejects an email with nothing after the @", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  test("rejects a string that starts with @ and has no local part", () => {
    expect(isValidEmail("@example.com")).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE 1 — Uncomment these tests one at a time.
//
// For each one:
//   1. Uncomment the test
//   2. Run: npm test
//   3. If it fails, update emailValidator.js to make it pass
//   4. Make sure all previous tests still pass (no regressions!)
//
// Checkpoint: when all uncommented tests are green, move to Exercise 2.
// ─────────────────────────────────────────────────────────────────────────────

describe("isValidEmail — exercise 1 (more edge cases)", () => {
  // Uncomment tests below one at a time and make them pass.
  test.todo("uncomment the tests above and make them pass");

  // test('rejects an empty string', () => {
  //   expect(isValidEmail('')).toBe(false)
  // })

  // test('rejects a string with a space anywhere in it', () => {
  //   expect(isValidEmail('user @example.com')).toBe(false)
  // })

  // test('rejects a string with two @ symbols', () => {
  //   expect(isValidEmail('user@@example.com')).toBe(false)
  // })

  // test('rejects an email with no dot in the domain (e.g. user@localhost)', () => {
  //   expect(isValidEmail('user@localhost')).toBe(false)
  // })

  // test('accepts an email with a subdomain', () => {
  //   expect(isValidEmail('user@mail.example.co.uk')).toBe(true)
  // })

  // test('accepts an email with a + tag in the local part', () => {
  //   expect(isValidEmail('user+filter@example.com')).toBe(true)
  // })
});

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE 2 — Write your own tests.
//
// Add at least 3 new test cases here. Think about inputs that could trick
// or break your implementation.
//
// Some ideas to get you started (you don't have to use these):
//   - null or undefined passed as argument
//   - A number instead of a string: isValidEmail(42)
//   - A very long string (500+ characters)
//   - Unicode characters in the local part: 'üser@example.com'
//   - Dots at unusual positions: '.user@example.com', 'user.@example.com'
//   - An IP address as domain: 'user@192.168.1.1'
//
// There is no single right answer for all of these.
// The point is to think about edge cases and decide what your function should do.
// ─────────────────────────────────────────────────────────────────────────────

describe("isValidEmail — exercise 2 (your own tests)", () => {
  test.todo("write your own test cases here");
  // Write your tests here!
  //
  // test('describe what you are testing', () => {
  //   expect(isValidEmail('...')).toBe(true)  // or false
  // })
});

// ─────────────────────────────────────────────────────────────────────────────
// BONUS CHALLENGE
//
// Look up the HTML5 email validation regex (used by <input type="email">).
// Or the official spec: RFC 5321 / 5322.
//
// Questions to think about:
//   - What valid emails does your implementation reject that it shouldn't?
//   - What invalid emails does it accept that it shouldn't?
//   - Is "perfect" email validation actually worth the complexity?
//   - What would you do in a real app? (Hint: send a confirmation email.)
// ─────────────────────────────────────────────────────────────────────────────
