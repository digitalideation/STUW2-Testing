import { describe, test, expect } from 'vitest'

// ─────────────────────────────────────────────────────────────────────────────
// The Gowandr API — a real hiking route search service
//
// Endpoint: POST https://api.gowandr.app/find-hikes
// Body: JSON
//
// Two modes:
//   "off"  — returns hikes based on filters you specify
//   "top"  — returns top hikes near a given location (lat/lng)
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = 'https://api.gowandr.app/find-hikes'

/**
 * Helper: sends a POST request to the API.
 * Returns the raw Response — call `await res.json()` to read the body.
 */
async function findHikes(body = {}) {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// STARTER TESTS — HTTP basics
//
// Run: npm test
// All of these should pass right away (they test the protocol, not the data).
// ─────────────────────────────────────────────────────────────────────────────

describe('HTTP basics', () => {
  test('POST returns status 200', async () => {
    const res = await findHikes({ mode: 'off' })
    expect(res.status).toBe(200)
  })

  test('GET request returns 405 Method Not Allowed', async () => {
    // The API only accepts POST — sending a GET should be rejected
    const res = await fetch(API_URL)
    expect(res.status).toBe(405)
  })

  test('response Content-Type header includes application/json', async () => {
    const res = await findHikes({ mode: 'off' })
    expect(res.headers.get('content-type')).toContain('application/json')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// STARTER TESTS — Response structure
// ─────────────────────────────────────────────────────────────────────────────

describe('Response structure', () => {
  test('response body is an array', async () => {
    const res = await findHikes({ mode: 'off' })
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  test('array contains at least one hike', async () => {
    const res = await findHikes({ mode: 'off' })
    const hikes = await res.json()
    expect(hikes.length).toBeGreaterThan(0)
  })

  // ── DISCOVERY TEST ────────────────────────────────────────────────────────
  // This test just logs the first hike object to the console.
  // Run it and look at the output — you need the field names for later tests.
  //
  // Look for: a name field, a distance/length field, a direction/type field
  // ─────────────────────────────────────────────────────────────────────────
  test('DISCOVERY: log the first hike object to understand its structure', async () => {
    const res = await findHikes({ mode: 'off' })
    const hikes = await res.json()

    console.log('\n📋 First hike object:')
    console.log(JSON.stringify(hikes[0], null, 2))
    console.log('\n🔑 Available fields:', Object.keys(hikes[0]))
    console.log(`\n📊 Total hikes returned: ${hikes.length}`)

    // Not a real assertion — just making sure we got data
    expect(hikes.length).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// STARTER TESTS — "top" mode (location-based results)
//
// "top" mode returns the best hikes near a given coordinate.
// ─────────────────────────────────────────────────────────────────────────────

describe('"top" mode — results near a location', () => {
  // Bern, Switzerland
  const BERN = { lat: 46.948, lng: 7.447 }

  test('returns hikes near Bern', async () => {
    const res = await findHikes({ mode: 'top', ...BERN })
    expect(res.status).toBe(200)
    const hikes = await res.json()
    expect(Array.isArray(hikes)).toBe(true)
    expect(hikes.length).toBeGreaterThan(0)
  })

  test('DISCOVERY: show hike names near Bern', async () => {
    const res = await findHikes({ mode: 'top', ...BERN })
    const hikes = await res.json()
    console.log(`\n🗺️  ${hikes.length} hikes near Bern:`)
    hikes.slice(0, 5).forEach((h, i) => {
      // Adjust the field name below if your discovery test showed a different one
      console.log(`  ${i + 1}. ${h.name ?? h.title ?? JSON.stringify(h).slice(0, 60)}`)
    })
  })

  test('"top" mode near a different city returns results too', async () => {
    // Zurich, Switzerland
    const ZURICH = { lat: 47.3769, lng: 8.5417 }
    const res = await findHikes({ mode: 'top', ...ZURICH })
    expect(res.status).toBe(200)
    const hikes = await res.json()
    expect(hikes.length).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE 1 — Filter tests
//
// Use the field names you found in the discovery test above.
// Replace the ??? comments with real assertions.
//
// Goal: verify that the API actually applies the filters correctly.
// ─────────────────────────────────────────────────────────────────────────────

describe('"off" mode — length filters (Exercise 1)', () => {
  test('minlength: all returned hikes should be at least this long', async () => {
    const MIN_KM = 8
    const res = await findHikes({ mode: 'off', minlength: MIN_KM })
    const hikes = await res.json()

    console.log(`\nWith minlength=${MIN_KM}: got ${hikes.length} hikes`)
    if (hikes.length > 0) {
      console.log('First hike length field:', hikes[0])
    }

    expect(hikes.length).toBeGreaterThan(0)

    // TODO: Replace ??? with the real field name for hike length
    // (find it in the discovery test output above)
    //
    // for (const hike of hikes) {
    //   expect(hike.???).toBeGreaterThanOrEqual(MIN_KM)
    // }
  })

  test('maxlength: all returned hikes should be at most this long', async () => {
    const MAX_KM = 5
    const res = await findHikes({ mode: 'off', maxlength: MAX_KM })
    const hikes = await res.json()

    console.log(`\nWith maxlength=${MAX_KM}: got ${hikes.length} hikes`)

    // TODO: Add your assertion here
    //
    // for (const hike of hikes) {
    //   expect(hike.???).toBeLessThanOrEqual(MAX_KM)
    // }
  })

  test('combined min + max: all hikes should be within the range', async () => {
    const MIN_KM = 5
    const MAX_KM = 12
    const res = await findHikes({ mode: 'off', minlength: MIN_KM, maxlength: MAX_KM })
    const hikes = await res.json()

    expect(hikes.length).toBeGreaterThan(0)

    // TODO: Assert both bounds for every hike
    //
    // for (const hike of hikes) {
    //   expect(hike.???).toBeGreaterThanOrEqual(MIN_KM)
    //   expect(hike.???).toBeLessThanOrEqual(MAX_KM)
    // }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE 2 — Direction filter
//
// The API supports filtering by direction (e.g. loop routes vs. one-way).
// First, discover what values are used — then filter by one.
// ─────────────────────────────────────────────────────────────────────────────

describe('"off" mode — direction filter (Exercise 2)', () => {
  test('DISCOVERY: what direction values exist in the response?', async () => {
    const res = await findHikes({ mode: 'off' })
    const hikes = await res.json()

    // Try different field names until you find the right one
    const directionField = 'direction' // might also be 'route_type', 'type', etc.
    const values = [...new Set(hikes.map(h => h[directionField]))]
    console.log(`\n🧭 Unique values for "${directionField}":`, values)
  })

  test('filtering by direction returns only matching hikes', async () => {
    // Step 1: Get all hikes and find a valid direction value
    const allRes = await findHikes({ mode: 'off' })
    const allHikes = await allRes.json()

    // TODO: Find the real field name and use it here
    const direction = allHikes[0]?.direction // adjust field name as needed
    console.log('\nTesting direction filter with:', direction)

    if (!direction) {
      console.log('⚠️  Could not find a direction value — check the field name')
      return
    }

    // Step 2: Filter by that direction
    const filteredRes = await findHikes({ mode: 'off', direction })
    const filtered = await filteredRes.json()

    console.log(`Filtered to direction="${direction}": ${filtered.length} hikes`)
    expect(filtered.length).toBeGreaterThan(0)

    // Step 3: Verify every returned hike actually matches
    // for (const hike of filtered) {
    //   expect(hike.direction).toBe(direction)
    // }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE 3 — Edge cases and invalid inputs
//
// What happens when you send unusual or invalid data?
// Run each test and observe — then add an assertion that matches the behavior.
// ─────────────────────────────────────────────────────────────────────────────

describe('Edge cases (Exercise 3)', () => {
  test('impossible range (minlength > maxlength): what does the API return?', async () => {
    const res = await findHikes({ mode: 'off', minlength: 100, maxlength: 1 })
    const data = await res.json()

    console.log('\nImpossible range — status:', res.status)
    console.log('Response:', JSON.stringify(data).slice(0, 200))

    // What do you expect? An empty array? An error? A 400 status?
    // Add your assertion here based on what you observe:
    // expect(???).???
  })

  test('minlength of 0: should behave the same as no filter', async () => {
    const withZero = await (await findHikes({ mode: 'off', minlength: 0 })).json()
    const withNone = await (await findHikes({ mode: 'off' })).json()

    console.log(`\nminlength=0: ${withZero.length} hikes`)
    console.log(`no filter:   ${withNone.length} hikes`)

    // Are these the same? Should they be?
    // expect(withZero.length).toBe(withNone.length)
  })

  test('unknown mode: what does the API do?', async () => {
    const res = await findHikes({ mode: 'unknown_mode' })
    console.log('\nUnknown mode — status:', res.status)
    const data = await res.json()
    console.log('Response:', JSON.stringify(data).slice(0, 200))
    // Add your assertion here
  })

  // Write your own edge case below
  // test('your edge case', async () => { ... })
})

// ─────────────────────────────────────────────────────────────────────────────
// BONUS — Write your own!
//
// Ideas:
//   - Verify that "top" mode near the same city always returns the same results
//     (is the API deterministic?)
//   - Find the longest hike in the entire dataset
//   - Combine "top" mode (location) + minlength/maxlength (filter)
//   - Write a test that measures response time and fails if it's too slow
//   - Verify that all hike names are strings (use hikes.every(...))
// ─────────────────────────────────────────────────────────────────────────────
