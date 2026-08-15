process.env.NODE_ENV = "test";

import request from "supertest";
import { createApp } from "../app";
import { db } from "../config/db";

const app = createApp();

beforeEach(() => {
  db.prepare("DELETE FROM users").run();
});

describe("POST /api/auth/register", () => {
  it("registers a new user and returns a token (unwrapped)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it("rejects a duplicate email with 409", async () => {
    await request(app).post("/api/auth/register").send({
      email: "dupe@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "dupe@example.com",
      password: "anotherPassword1",
    });

    expect(res.status).toBe(409);
  });

  it("rejects a weak password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "weak@example.com",
      password: "123",
    });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send({
      email: "login@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects an incorrect password with 401", async () => {
    await request(app).post("/api/auth/register").send({
      email: "login2@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login2@example.com",
      password: "wrongPassword",
    });

    expect(res.status).toBe(401);
  });

  it("rejects a non-existent email with 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "doesnotexist@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
  });
});