# Section 02 — API Tests

## What is an API test?

An **API test** sends real HTTP requests to a real service and checks the response.

Compared to a unit test, an API test doesn't just check a function in isolation — it checks that multiple pieces work together: your request format, the server logic, the response structure. If the API changes a field name, renames a filter, or starts returning errors, your tests will catch it.

---

## The API

```
POST https://api.gowandr.app/find-hikes
Content-Type: application/json
```

**Response shape:**

```json
{ "hikes": [ { "title": "...", "distance_km": "8.50", "isloop": true, ... }, ... ] }
```

The hikes are nested under a `"hikes"` key — not a plain array.

**Modes:**

| Mode | What it does |
|------|-------------|
| `"off"` | Returns hikes from the full database, filtered by your parameters |
| `"top"` | Returns the closest hikes to a given location |

**Key filters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `minlength` | number | Minimum hike length in km |
| `maxlength` | number | Maximum hike length in km |
| `direction` | string | `"Round Trip"` (loops) or `"One Way"` (non-loops) |

**Key response fields per hike:**

| Field | Type | Meaning |
|-------|------|---------|
| `title` | string | Name of the route |
| `distance_km` | string | Length in km — returned as a string, e.g. `"8.50"` |
| `isloop` | boolean | `true` = round trip, `false` = one way |
| `ascent_meters` | number | Total ascent in metres |

Note: `distance_km` is a string, not a number. Use `Number(hike.distance_km)` when comparing values in tests.

**Example payloads:**

```json
{ "mode": "off", "minlength": 5, "maxlength": 15 }

{ "mode": "top", "start": { "lat": 46.948, "lon": 7.447 }, "limit": 20 }
```

---

## Setup

```bash
cd 02-api-tests
npm install
npm test
```

All 18 tests should pass. The discovery test prints the first hike object to the console — read it to see the full response structure.

---

## What the tests cover

### HTTP basics
Verifies the protocol layer before touching any data: correct status codes, the right HTTP method, and the Content-Type header.

One useful check here is confirming that a `GET` request returns `405 Method Not Allowed` — this documents that the endpoint intentionally only accepts `POST`.

### Response structure
Checks the shape of the response independent of any specific hike's data. This catches breaking changes like the API switching from `{ hikes: [...] }` to a plain array, or renaming a field.

The **discovery test** logs the full first hike object and all its field names to the console. Run `npm test` and read that output — it's the fastest way to understand what the API actually returns.

### "top" mode
Sends a location (`lat`/`lon`) and verifies that hikes come back. The `limit` parameter caps the result count so the test doesn't wait for thousands of results.

Note the payload shape: the location goes inside a nested `"start"` object, and the key is `"lon"` — not `"lng"`. Getting this wrong produces a `400` error, which is exactly the kind of thing an API test catches.

### Length filters
Sends `minlength` and `maxlength` filters and then checks every hike in the response to confirm the API actually applied them. This is more than just checking the status code — it verifies the server's filtering logic is correct.

### Direction filter
The filter value (`"Round Trip"`) and the response field (`isloop: true`) use different names. The tests verify both sides: that the filter is accepted, and that every returned hike actually matches it.

### Edge cases
- An impossible range (`minlength: 100, maxlength: 1`) returns a `200` with an empty `hikes` array — not an error.
- An unknown mode returns `400` with a `detail` field explaining what went wrong.
- `minlength: 0` returns the same results as no filter at all.

These tests document the API's behaviour in unusual situations so there are no surprises in production.

---

## Key terms

| Term | Meaning |
|------|---------|
| `fetch` | Built-in Node.js function for making HTTP requests |
| `res.status` | The HTTP status code (200, 404, 405, etc.) |
| `res.json()` | Parses the response body as JSON |
| `async/await` | Syntax for working with Promises — network calls are asynchronous |
| `toBeGreaterThanOrEqual` | Vitest matcher: checks `value >= expected` |
| `toBeLessThanOrEqual` | Vitest matcher: checks `value <= expected` |
| `toHaveProperty` | Vitest matcher: checks that an object has a given key |
