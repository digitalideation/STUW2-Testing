# Section 02 — API Tests

## What is an API test?

An **API test** (also called an integration test) sends real HTTP requests to a real service and checks the response.

Compared to unit tests:
- Slower (network round-trip)
- Tests multiple components working together
- Catches issues that only appear when things are connected

You're going to test the Gowandr hiking API — a live service that returns real hiking routes.

---

## The API

```
POST https://api.gowandr.app/find-hikes
Content-Type: application/json
```

**Modes:**

| Mode | What it does |
|------|-------------|
| `"off"` | Returns hikes matching your filters, from the full database |
| `"top"` | Returns the best hikes near a given location (`lat` + `lng`) |

**Filters (for `"off"` mode):**

| Parameter | Type | Description |
|-----------|------|-------------|
| `minlength` | number | Minimum hike length in km |
| `maxlength` | number | Maximum hike length in km |
| `direction` | string | Filter by route type (e.g. loop, one-way) |

**Example payloads:**

```json
// Off mode with length filters
{ "mode": "off", "minlength": 5, "maxlength": 15 }

// Top mode near Bern, Switzerland
{ "mode": "top", "lat": 46.948, "lng": 7.447 }
```

---

## Setup

```bash
cd 02-api-tests
npm install
npm test
```

**What to expect on first run:**

- The HTTP basics tests and structure tests should all **pass**
- The filter exercise tests will **partially pass** — you'll need to fill in the assertions
- The discovery tests print information to the console — read it!

---

## How the exercises work

This section is deliberately incomplete. The filter field names in the response might not be exactly what you expect, so one of the first things you'll do is run a **discovery test** to see what the API actually returns.

This reflects real API testing: you often have to explore before you can assert.

**Workflow for each exercise:**

1. Run `npm test`
2. Read the console output from the discovery tests
3. Find the right field names in the hike objects
4. Fill in the `???` placeholders in the test assertions
5. Run `npm test` again — your filter tests should now pass

---

## Exercise 1 — Length filters (~20 min)

Open `tests/hikeApi.test.js` and find the **"off" mode — length filters** describe block.

The three tests have `TODO` comments. Complete the assertions:
- Use the field name you found in the discovery test
- Verify that every hike in the response satisfies the filter

**Checkpoint:** All three length filter tests pass, with real assertions (not just `expect(hikes.length).toBeGreaterThan(0)`).

---

## Exercise 2 — Direction filter (~15 min)

Find the **direction filter** describe block.

1. Run the discovery test first — it prints all the direction values that exist
2. Complete the filter test: send a `direction` filter and verify every returned hike matches

**Questions to think about:**
- What happens if you filter by a direction that has no hikes?
- Does filtering by direction affect how many results you get?

---

## Exercise 3 — Edge cases (~15 min)

Find the **Edge cases** describe block.

For each test:
1. Read what it's testing
2. Run it and observe the status code and response body
3. Add an assertion that matches the actual behavior

Then add one edge case of your own.

---

## Bonus challenges

- **Performance:** Write a test that fails if the API takes longer than 3 seconds
- **Consistency:** Call the API twice with the same input and check that the results match
- **Exploration:** Can you combine `mode: "top"` with length filters? Does it work?
- **Data quality:** Verify that every hike in the response has a `name` that is a non-empty string

---

## Key terms

| Term | Meaning |
|------|---------|
| `fetch` | Built-in Node.js function for making HTTP requests |
| `res.status` | The HTTP status code (200, 404, 405, etc.) |
| `res.json()` | Parses the response body as JSON |
| `async/await` | Syntax for working with Promises (network calls return Promises) |
| `toBeGreaterThanOrEqual` | Vitest matcher: checks `value >= expected` |
| `toBeLessThanOrEqual` | Vitest matcher: checks `value <= expected` |
