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
// Run (headless):         npm test
// Run (browser visible):  npm run test:headed   ← recommended for learning!
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Signup form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ─────────────────────────────────────────────────────────────────────────
  // EXAMPLE TEST — complete, working, ready to run
  //
  // This simulates a user filling in all fields correctly and verifying that
  // the success message appears with their name.
  // ─────────────────────────────────────────────────────────────────────────

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

    console.log('Success message shown — signup flow works!')
  })

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISE 1 — Validation: submitting an empty form should show errors
  //
  // When the user clicks Sign up without filling anything in, each field
  // should display its error message.
  //
  // Hint: look for elements with the CSS class `.error.visible`
  // ─────────────────────────────────────────────────────────────────────────

  test('submitting an empty form shows validation errors (Exercise 1)', async ({ page }) => {
    // STEP 1: Click submit without filling in anything
    await page.click('button[type="submit"]')

    // STEP 2: Each error message should now be visible
    await expect(page.locator('#name-error')).toBeVisible()
    await expect(page.locator('#email-error')).toBeVisible()
    await expect(page.locator('#password-error')).toBeVisible()

    // STEP 3: The success banner must NOT appear
    await expect(page.locator('#success')).not.toBeVisible()

    console.log('Validation errors shown correctly!')
  })

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISE 2 — Mismatched passwords should show an error
  //
  // Fill in all fields correctly but use different values for password and
  // confirm password. The form should reject the submission.
  //
  // Hints:
  //   - Fill name, email, and a valid password
  //   - Type a different value into the confirm field
  //   - After submit, only the confirm-error should appear
  // ─────────────────────────────────────────────────────────────────────────

  test('mismatched passwords shows an error (Exercise 2)', async ({ page }) => {
    // TODO: fill in the fields with mismatched passwords
    //
    // await page.fill('#name',     '...')
    // await page.fill('#email',    '...')
    // await page.fill('#password', '...')
    // await page.fill('#confirm',  '...different...')
    // await page.click('button[type="submit"]')
    //
    // await expect(page.locator('#confirm-error')).toBeVisible()
    // await expect(page.locator('#success')).not.toBeVisible()
  })

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISE 3 — Write your own test scenario
  //
  // Pick one of the following:
  //
  //   a) Verify the page title:  await expect(page).toHaveTitle('Sign Up')
  //   b) Check that a short password (< 8 chars) shows the password error
  //   c) Verify that an invalid email like "notanemail" shows the email error
  //   d) Check that fixing errors after a failed submit clears the red borders
  //
  // Useful Playwright methods:
  //   page.locator('#id')                        — find an element by id
  //   await locator.fill('text')                 — type into an input
  //   await locator.click()                      — click an element
  //   await expect(locator).toBeVisible()        — assert it is visible
  //   await expect(locator).not.toBeVisible()    — assert it is hidden
  //   await expect(locator).toContainText('...')  — assert its text content
  //   await expect(page).toHaveTitle('...')      — assert the page title
  // ─────────────────────────────────────────────────────────────────────────

  test('your own scenario (Exercise 3)', async ({ page }) => {
    // Write your test here!
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// BONUS — More test ideas
//
//   1. Mock a "server" response by intercepting fetch:
//      await page.route('/api/signup', route => route.fulfill({ status: 409, body: 'Email taken' }))
//
//   2. Test on mobile viewport:
//      test.use({ viewport: { width: 390, height: 844 } })
//
//   3. Take a screenshot after submission:
//      await page.screenshot({ path: 'success.png' })
//
//   4. Check keyboard navigation — Tab through fields and submit with Enter:
//      await page.keyboard.press('Tab')
// ─────────────────────────────────────────────────────────────────────────────
