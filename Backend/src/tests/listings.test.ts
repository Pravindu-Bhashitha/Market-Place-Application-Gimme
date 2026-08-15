process.env.NODE_ENV = "test";

import request from "supertest";
import { createApp } from "../app";
import { db } from "../config/db";

const app = createApp();

function insertListing(overrides: Partial<Record<string, unknown>> = {}) {
  const base = {
    title: "Test Chair",
    category: "Furniture",
    price: 50,
    condition: "good",
    description: "A perfectly fine test chair used in the automated suite.",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
  const result = db
    .prepare(
      `INSERT INTO listings (title, category, price, condition, description, imageUrl, createdAt)
       VALUES (@title, @category, @price, @condition, @description, @imageUrl, @createdAt)`
    )
    .run(base);
  return result.lastInsertRowid as number;
}

async function getAuthToken(): Promise<string> {
  const email = `user_${Date.now()}_${Math.random()}@example.com`;
  const res = await request(app).post("/api/auth/register").send({
    email,
    password: "password123",
  });
  return res.body.token;
}

beforeEach(() => {
  db.prepare("DELETE FROM listings").run();
  db.prepare("DELETE FROM users").run();
});

describe("GET /api/listings", () => {
  it("returns paginated results with a default page size", async () => {
    for (let i = 0; i < 15; i++) insertListing({ title: `Item ${i}` });

    const res = await request(app).get("/api/listings");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(12);
    expect(res.body.pagination.total).toBe(15);
    expect(res.body.pagination.totalPages).toBe(2);
  });

  it("filters by category and price range", async () => {
    insertListing({ title: "Cheap Chair", category: "Furniture", price: 20 });
    insertListing({ title: "Pricey Chair", category: "Furniture", price: 500 });
    insertListing({ title: "Laptop", category: "Electronics", price: 800 });

    const res = await request(app)
      .get("/api/listings")
      .query({ category: "Furniture", minPrice: 10, maxPrice: 100 });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Cheap Chair");
  });

  it("searches by title case-insensitively", async () => {
    insertListing({ title: "Vintage Lamp" });
    insertListing({ title: "Modern Desk" });

    const res = await request(app).get("/api/listings").query({ search: "lamp" });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Vintage Lamp");
  });
});

describe("GET /api/listings/:id", () => {
  it("returns the listing directly (unwrapped) with similar items", async () => {
    const id = insertListing({ title: "Main Item", category: "Books" });
    insertListing({ title: "Similar Book", category: "Books" });
    insertListing({ title: "Different Category", category: "Electronics" });

    const res = await request(app).get(`/api/listings/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Main Item");
    expect(res.body.similarListings).toHaveLength(1);
    expect(res.body.similarListings[0].title).toBe("Similar Book");
  });

  it("returns 404 for a missing listing", async () => {
    const res = await request(app).get("/api/listings/999999");
    expect(res.status).toBe(404);
  });

  it("returns 400 for a non-numeric id", async () => {
    const res = await request(app).get("/api/listings/abc");
    expect(res.status).toBe(400);
  });
});

describe("POST /api/listings (protected)", () => {
  it("rejects creation without a token", async () => {
    const res = await request(app).post("/api/listings").send({
      title: "No Auth Desk",
      category: "Furniture",
      price: 100,
      condition: "new",
      description: "This should be rejected since no token was provided.",
    });

    expect(res.status).toBe(401);
  });

  it("creates a listing (unwrapped response) with a valid token", async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Brand New Desk",
        category: "Furniture",
        price: 120,
        condition: "new",
        description: "A brand new standing desk, still in the box.",
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe("Brand New Desk");
  });

  it("rejects invalid input with a 400 even when authenticated", async () => {
    const token = await getAuthToken();

    const res = await request(app)
      .post("/api/listings")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "AB",
        category: "NotACategory",
        price: -5,
        condition: "mint",
        description: "short",
      });

    expect(res.status).toBe(400);
    expect(res.body.error.description).toBeDefined();
  });
});

describe("DELETE /api/listings/:id (protected)", () => {
  it("rejects deletion without a token", async () => {
    const id = insertListing();
    const res = await request(app).delete(`/api/listings/${id}`);
    expect(res.status).toBe(401);
  });

  it("deletes an existing listing when authenticated", async () => {
    const token = await getAuthToken();
    const id = insertListing();

    const res = await request(app)
      .delete(`/api/listings/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const followUp = await request(app).get(`/api/listings/${id}`);
    expect(followUp.status).toBe(404);
  });

  it("returns 404 when deleting a missing listing", async () => {
    const token = await getAuthToken();
    const res = await request(app)
      .delete("/api/listings/999999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});