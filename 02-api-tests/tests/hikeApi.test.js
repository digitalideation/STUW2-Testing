import { describe, test, expect } from 'vitest'

// ─────────────────────────────────────────────────────────────────────────────
// The Gowandr API — a real hiking route search service
//
// Endpoint: POST https://api.gowandr.app/find-hikes
// Body: JSON
//
// Response shape:  { "hikes": [ {...}, {...}, ... ] }
//   Note: the hikes are nested inside a "hikes" key — not a plain array.
//
// Modes:
//   "off"  — returns hikes from the full database, filtered by your parameters
//   "top"  — returns the closest hikes to a given location
//
// Useful response fields:
//   hike.title         — the name of the hike
//   hike.distance_km   — length of the route in kilometres (returned as a string, e.g. "8.50")
//   hike.isloop        — true = round trip, false = one way
//   hike.ascent_meters — total ascent in metres
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = 'https://api.gowandr.app/find-hikes'

/**
 * Sends a POST request to the API. Returns the raw Response object.
 * Use `await res.json()` to read the body — it has shape { hikes: [...] }.
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
// All of these should pass right away.
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
  test('response body has a "hikes" key', async () => {
    const res = await findHikes({ mode: 'off' })
    const data = await res.json()
    // The API wraps results: { "hikes": [...] }
    // It does NOT return a plain array.
    expect(data).toHaveProperty('hikes')
  })

  test('"hikes" is an array', async () => {
    const res = await findHikes({ mode: 'off' })
    const { hikes } = await res.json()
    expect(Array.isArray(hikes)).toBe(true)
  })

  test('array contains at least one hike', async () => {
    const res = await findHikes({ mode: 'off' })
    const { hikes } = await res.json()
    expect(hikes.length).toBeGreaterThan(0)
  })

  // ── DISCOVERY TEST ────────────────────────────────────────────────────────
  // This test logs the first hike object so you can see all its fields.
  // Read the console output — you'll need the field names for the exercises.
  // ─────────────────────────────────────────────────────────────────────────
  test('DISCOVERY: log the first hike object to understand its structure', async () => {
    const res = await findHikes({ mode: 'off' })
    const { hikes } = await res.json()

    console.log('\n📋 First hike object:')
    console.log(JSON.stringify(hikes[0], null, 2))
    console.log('\n🔑 Available fields:', Object.keys(hikes[0]))
    console.log(`\n📊 Total hikes returned: ${hikes.length}`)

    expect(hikes.length).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// STARTER TESTS — "top" mode (location-based results)
//
// "top" mode returns the closest hikes to a given location.
// The location is passed as: { "start": { "lat": ..., "lon": ... } }
// ─────────────────────────────────────────────────────────────────────────────

describe('"top" mode — results near a location', () => {
  // Bern, Switzerland — note the key is "lon", not "lng"
  const BERN = { start: { lat: 46.948, lon: 7.447 } }

  test('returns hikes near Bern', async () => {
    const res = await findHikes({ mode: 'top', ...BERN })
    expect(res.status).toBe(200)
    const { hikes } = await res.json()
    expect(Array.isArray(hikes)).toBe(true)
    expect(hikes.length).toBeGreaterThan(0)
  })

  test('DISCOVERY: show hike names near Bern', async () => {
    const res = await findHikes({ mode: 'top', ...BERN })
    const { hikes } = await res.json()
    console.log(`\n🗺️  ${hikes.length} hikes near Bern:`)
    hikes.slice(0, 5).forEach((h, i) => {
      console.log(`  ${i + 1}. ${h.title}  (${h.distance_km} km, ${h.isloop ? 'loop' : 'one way'})`)
    })
  })

  test('"top" mode near Zurich also returns results', async () => {
    const res = await findHikes({ mode: 'top', start: { lat: 47.3769, lon: 8.5417 } })
    expect(res.status).toBe(200)
    const { hikes } = await res.json()
    expect(hikes.length).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE 1 — Length filter tests
//
// The field name for hike length in the response is: distance_km
//
// Your task: fill in the assertions marked with TODO.
// After filling them in, all three tests should pass.
// ─────────────────────────────────────────────────────────────────────────────

describe('"off" mode — length filters (Exercise 1)', () => {
  test('minlength: all returned hikes should be at least this long', async () => {
    const MIN_KM = 8
    const res = await findHikes({ mode: 'off', minlength: MIN_KM })
    const { hikes } = await res.json()

    console.log(`\nWith minlength=${MIN_KM}: got ${hikes.length} hikes`)
    expect(hikes.length).toBeGreaterThan(0)

    // TODO: check that every hike satisfies the filter.
    // Hint: distance_km is a string ("8.50"), so convert it first: Number(hike.distance_km)
    // for (const hike of hikes) {
    //   expect(Number(hike.distance_km)).toBeGreaterThanOrEqual(MIN_KM)
    // }
  })

  test('maxlength: all returned hikes should be at most this long', async () => {
    const MAX_KM = 5
    const res = await findHikes({ mode: 'off', maxlength: MAX_KM })
    const { hikes } = await res.json()

    console.log(`\nWith maxlength=${MAX_KM}: got ${hikes.length} hikes`)
    expect(hikes.length).toBeGreaterThan(0)

    // TODO: check that every hike satisfies the filter
    // for (const hike of hikes) {
    //   expect(Number(hike.distance_km)).toBeLessThanOrEqual(MAX_KM)
    // }
  })

  test('combined min + max: all hikes should be within the range', async () => {
    const MIN_KM = 5
    const MAX_KM = 12
    const res = await findHikes({ mode: 'off', minlength: MIN_KM, maxlength: MAX_KM })
    const { hikes } = await res.json()

    expect(hikes.length).toBeGreaterThan(0)

    // TODO: check both bounds for every hike
    // for (const hike of hikes) {
    //   expect(Number(hike.distance_km)).toBeGreaterThanOrEqual(MIN_KM)
    //   expect(Number(hike.distance_km)).toBeLessThanOrEqual(MAX_KM)
    // }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE 2 — Direction filter
//
// The API filter parameter is called "direction".
// Valid values: "Round Trip"  (loop hikes — isloop: true in the response)
//               "One Way"     (non-loop hikes — isloop: false in the response)
//
// Notice: the filter value ("Round Trip") doesn't match the response field
// name ("isloop"). This is common with real APIs.
// ─────────────────────────────────────────────────────────────────────────────

describe('"off" mode — direction filter (Exercise 2)', () => {
  test('DISCOVERY: show the isloop distribution across hikes', async () => {
    const res = await findHikes({ mode: 'off' })
    const { hikes } = await res.json()

    const loops = hikes.filter(h => h.isloop === true).length
    const oneWay = hikes.filter(h => h.isloop === false).length
    console.log(`\n🧭 isloop distribution:`)
    console.log(`  Round Trip (isloop: true):  ${loops} hikes`)
    console.log(`  One Way (isloop: false):    ${oneWay} hikes`)
  })

  test('direction "Round Trip" returns only loop hikes', async () => {
    const res = await findHikes({ mode: 'off', direction: 'Round Trip' })
    const { hikes } = await res.json()

    console.log(`\nRound Trip filter: ${hikes.length} hikes`)
    expect(hikes.length).toBeGreaterThan(0)

    // TODO: check that every hike is a loop
    // for (const hike of hikes) {
    //   expect(hike.isloop).toBe(true)
    // }
  })

  test('direction "One Way" returns only non-loop hikes', async () => {
    const res = await findHikes({ mode: 'off', direction: 'One Way' })
    const { hikes } = await res.json()

    console.log(`\nOne Way filter: ${hikes.length} hikes`)
    expect(hikes.length).toBeGreaterThan(0)

    // TODO: check that no hike is a loop
    // for (const hike of hikes) {
    //   expect(hike.isloop).toBe(false)
    // }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE 3 — Edge cases and invalid inputs
//
// These tests already pass — but they only log the response.
// Add an assertion to each one based on what you observe.
// ─────────────────────────────────────────────────────────────────────────────

describe('Edge cases (Exercise 3)', () => {
  test('impossible range (minlength > maxlength): returns empty hikes array', async () => {
    const res = await findHikes({ mode: 'off', minlength: 100, maxlength: 1 })
    const data = await res.json()

    console.log('\nImpossible range — status:', res.status)
    console.log('Response:', JSON.stringify(data))

    // The API returns 200 with an empty hikes array — add the assertion:
    // expect(res.status).toBe(???)
    // expect(data.hikes.length).toBe(???)
  })

  test('unknown mode returns 400 with an error message', async () => {
    const res = await findHikes({ mode: 'unknown_mode' })
    const data = await res.json()

    console.log('\nUnknown mode — status:', res.status)
    console.log('Response:', JSON.stringify(data))

    // The API returns 400 with a { detail: "..." } error — add the assertion:
    // expect(res.status).toBe(???)
    // expect(data).toHaveProperty('detail')
  })

  test('minlength of 0 behaves the same as no filter', async () => {
    const { hikes: withZero } = await (await findHikes({ mode: 'off', minlength: 0 })).json()
    const { hikes: withNone } = await (await findHikes({ mode: 'off' })).json()

    console.log(`\nminlength=0: ${withZero.length} hikes`)
    console.log(`no filter:   ${withNone.length} hikes`)

    // Are these the same? Add an assertion based on what you observe.
    // expect(withZero.length).toBe(withNone.length)
  })

  // Write your own edge case below
  // test('your edge case', async () => { ... })
})

// ─────────────────────────────────────────────────────────────────────────────
// BONUS — Write your own!
//
// Ideas:
//   - Verify that "top" mode near the same city always returns the same results
//     (is the API deterministic? call it twice and compare)
//   - Find the longest hike in the full dataset
//   - Combine "top" mode with minlength/maxlength — does filtering still work?
//   - Test that all hike names are non-empty strings:
//       expect(hikes.every(h => typeof h.name === 'string' && h.name.length > 0)).toBe(true)
//   - Write a test that fails if the API takes longer than 3 seconds
// ─────────────────────────────────────────────────────────────────────────────
