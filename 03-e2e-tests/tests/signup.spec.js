import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────────────────────────────────────
// End-to-end tests for the local signup form (signup.html)
//
// These tests simulate a real user filling in a registration form:
//   - opening a browser
//   - filling in form fields
//   - submitting the form
//   - seeing success or validation error messages
//
// Run (headless, fast):          npm test
// Run (browser visible, slow):   npm run test:headed
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Signup form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('user fills the form correctly and sees a success message', async ({ page }) => {
    // STEP 1: Check the form is visible on the page
    await expect(page.locator('#signup-form')).toBeVisible()

    // STEP 2: Fill in each field
    await page.fill('#name',     'Jane Doe')
    await page.fill('#email',    'jane@example.com')
    await page.fill('#password', 'supersecret')
    await page.fill('#confirm',  'supersecret')

    // STEP 3: Submit the form
    await page.click('button[type="submit"]')

    // STEP 4: The form should disappear and the success banner should appear
    await expect(page.locator('#success')).toBeVisible()
    await expect(page.locator('#success-message')).toContainText('Jane Doe')
  })

  test('submitting an empty form shows validation errors', async ({ page }) => {
    // STEP 1: Click submit without filling in anything
    await page.click('button[type="submit"]')

    // STEP 2: Each error message should now be visible
    await expect(page.locator('#name-error')).toBeVisible()
    await expect(page.locator('#email-error')).toBeVisible()
    await expect(page.locator('#password-error')).toBeVisible()

    // STEP 3: The success banner must NOT appear
    await expect(page.locator('#success')).not.toBeVisible()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISE 1 — Mismatched passwords
  //
  // Fill in all fields correctly but use different values for password and
  // confirm password. The form should reject the submission.
  //
  // Useful selectors: #name  #email  #password  #confirm  #confirm-error  #success
  // ─────────────────────────────────────────────────────────────────────────
  test('mismatched passwords shows an error (Exercise 1)', async ({ page }) => {
    // TODO: fill in the fields with mismatched passwords
    // await page.fill('#name',     '...')
    // await page.fill('#email',    '...')
    // await page.fill('#password', '...')
    // await page.fill('#confirm',  '...different...')
    // await page.click('button[type="submit"]')

    // TODO: assert that the confirm error is visible and the success banner is not
    // await expect(page.locator('#confirm-error')).toBeVisible()
    // await expect(page.locator('#success')).not.toBeVisible()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISE 2 — Write your own test
  //
  // Ideas:
  //   a) Verify the page title:  await expect(page).toHaveTitle('Sign Up')
  //   b) Check that a password shorter than 8 characters shows the password error
  //   c) Check that an invalid email like "notanemail" shows the email error
  //
  // Useful Playwright methods:
  //   await page.fill('#id', 'value')              — type into a field
  //   await page.click('button[type="submit"]')    — click the submit button
  //   await expect(locator).toBeVisible()          — assert something is visible
  //   await expect(locator).not.toBeVisible()      — assert something is hidden
  //   await expect(page).toHaveTitle('...')        — assert the page title
  // ─────────────────────────────────────────────────────────────────────────
  test('your own scenario (Exercise 2)', async ({ page }) => {
    // Write your test here!
  })
})
