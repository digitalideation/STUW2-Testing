import { describe, test, expect } from "vitest";

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
// Useful response fields per hike:
//   hike.title         — name of the hike
//   hike.distance_km   — length in km, returned as a string e.g. "8.50"
//   hike.isloop        — true = round trip, false = one way
//   hike.ascent_meters — total ascent in metres
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = "https://api.gowandr.app/find-hikes";

/**
 * Sends a POST request to the API. Returns the raw Response object.
 * Use `await res.json()` to read the body — it has shape { hikes: [...] }.
 */
async function findHikes(body = {}) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP basics
// ─────────────────────────────────────────────────────────────────────────────

describe("HTTP basics", () => {
  test("POST returns status 200", async () => {
    const res = await findHikes({ mode: "off" });
    expect(res.status).toBe(200);
  });

  test("GET request returns 405 Method Not Allowed", async () => {
    // The API only accepts POST — sending a GET should be rejected
    const res = await fetch(API_URL);
    expect(res.status).toBe(405);
  });

  test("response Content-Type header includes application/json", async () => {
    const res = await findHikes({ mode: "off" });
    expect(res.headers.get("content-type")).toContain("application/json");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Response structure
// ─────────────────────────────────────────────────────────────────────────────

describe("Response structure", () => {
  test('response body has a "hikes" key', async () => {
    const res = await findHikes({ mode: "off" });
    const data = await res.json();
    // The API wraps results: { "hikes": [...] }
    // It does NOT return a plain array.
    expect(data).toHaveProperty("hikes");
  });

  test('"hikes" is an array', async () => {
    const res = await findHikes({ mode: "off" });
    const { hikes } = await res.json();
    expect(Array.isArray(hikes)).toBe(true);
  });

  test("array contains at least one hike", async () => {
    const res = await findHikes({ mode: "off" });
    const { hikes } = await res.json();
    expect(hikes.length).toBeGreaterThan(0);
  });

  test("DISCOVERY: log the first hike object and all its fields", async () => {
    const res = await findHikes({ mode: "off" });
    const { hikes } = await res.json();
    console.log("\n📋 First hike object:");
    console.log(JSON.stringify(hikes[0], null, 2));
    console.log("\n🔑 Available fields:", Object.keys(hikes[0]));
    console.log(`\n📊 Total hikes returned: ${hikes.length}`);
    expect(hikes.length).toBeGreaterThan(0);
  });

  test("each hike has the expected fields", async () => {
    const res = await findHikes({ mode: "off" });
    const { hikes } = await res.json();
    const hike = hikes[0];
    expect(hike).toHaveProperty("title");
    expect(hike).toHaveProperty("distance_km");
    expect(hike).toHaveProperty("isloop");
    expect(hike).toHaveProperty("ascent_meters");
    // Curious what else is in there? Run: console.log(Object.keys(hike))
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// "top" mode — location-based results
//
// The location is passed as: { "start": { "lat": ..., "lon": ... } }
// Note: the key is "lon", not "lng".
// ─────────────────────────────────────────────────────────────────────────────

describe('"top" mode — results near a location', () => {
  const BERN = { start: { lat: 46.948, lon: 7.447 }, limit: 20 };
  const ZURICH = { start: { lat: 47.377, lon: 8.542 }, limit: 20 };

  test("returns hikes near Bern", async () => {
    const res = await findHikes({ mode: "top", ...BERN });
    expect(res.status).toBe(200);
    const { hikes } = await res.json();
    expect(hikes.length).toBeGreaterThan(0);
    console.log(`\n🗺️  ${hikes.length} hikes near Bern — closest 3:`);
    hikes
      .slice(0, 3)
      .forEach((h, i) =>
        console.log(
          `  ${i + 1}. ${h.title}  (${h.distance_km} km, ${h.isloop ? "loop" : "one way"})`,
        ),
      );
  });

  test("returns hikes near Zurich", async () => {
    const res = await findHikes({ mode: "top", ...ZURICH });
    expect(res.status).toBe(200);
    const { hikes } = await res.json();
    expect(hikes.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// "off" mode — length filters
//
// distance_km is returned as a string ("8.50"), so use Number() when comparing.
// ─────────────────────────────────────────────────────────────────────────────

describe('"off" mode — length filters', () => {
  test("minlength: every returned hike is at least as long as the minimum", async () => {
    const MIN_KM = 8;
    const res = await findHikes({ mode: "off", minlength: MIN_KM });
    const { hikes } = await res.json();

    expect(hikes.length).toBeGreaterThan(0);
    for (const hike of hikes) {
      expect(Number(hike.distance_km)).toBeGreaterThanOrEqual(MIN_KM);
    }
  });

  test("maxlength: every returned hike is no longer than the maximum", async () => {
    const MAX_KM = 5;
    const res = await findHikes({ mode: "off", maxlength: MAX_KM });
    const { hikes } = await res.json();

    expect(hikes.length).toBeGreaterThan(0);
    for (const hike of hikes) {
      expect(Number(hike.distance_km)).toBeLessThanOrEqual(MAX_KM);
    }
  });

  test("combined min + max: every hike falls within the range", async () => {
    const MIN_KM = 5;
    const MAX_KM = 12;
    const res = await findHikes({
      mode: "off",
      minlength: MIN_KM,
      maxlength: MAX_KM,
    });
    const { hikes } = await res.json();

    expect(hikes.length).toBeGreaterThan(0);
    for (const hike of hikes) {
      expect(Number(hike.distance_km)).toBeGreaterThanOrEqual(MIN_KM);
      expect(Number(hike.distance_km)).toBeLessThanOrEqual(MAX_KM);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// "off" mode — direction filter
//
// Filter values : "Round Trip" (loops) or "One Way" (non-loops)
// Response field: isloop — boolean (true = loop, false = one way)
//
// The filter value and the response field name are different — this is common
// with real-world APIs.
// ─────────────────────────────────────────────────────────────────────────────

describe('"off" mode — direction filter', () => {
  test('"Round Trip" returns only loop hikes (isloop: true)', async () => {
    const res = await findHikes({ mode: "off", direction: "Round Trip" });
    const { hikes } = await res.json();

    expect(hikes.length).toBeGreaterThan(0);
    for (const hike of hikes) {
      expect(hike.isloop).toBe(true);
    }
  });

  test('"One Way" returns only non-loop hikes (isloop: false)', async () => {
    const res = await findHikes({ mode: "off", direction: "One Way" });
    const { hikes } = await res.json();

    expect(hikes.length).toBeGreaterThan(0);
    for (const hike of hikes) {
      expect(hike.isloop).toBe(false);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Edge cases
// ─────────────────────────────────────────────────────────────────────────────

describe("Edge cases", () => {
  test("impossible range (minlength > maxlength) returns an empty hikes array", async () => {
    const res = await findHikes({ mode: "off", minlength: 100, maxlength: 1 });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.hikes.length).toBe(0);
  });

  test("unknown mode returns 400 with a descriptive error message", async () => {
    const res = await findHikes({ mode: "unknown_mode" });
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toHaveProperty("detail");
  });

  test("minlength of 0 returns the same results as no filter", async () => {
    const { hikes: withZero } = await (
      await findHikes({ mode: "off", minlength: 0 })
    ).json();
    const { hikes: withNone } = await (await findHikes({ mode: "off" })).json();

    expect(withZero.length).toBe(withNone.length);
  });
});
