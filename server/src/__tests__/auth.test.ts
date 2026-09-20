import request from "supertest";

// Mock the Admin model so no real database is needed for these tests.
jest.mock("../models/Admin");

import { app } from "../app";
import AdminModel from "../models/Admin";

const mockedFindOne = AdminModel.findOne as jest.Mock;

describe("POST /api/auth/login", () => {
  it("returns 400 when email or password is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "a@b.com" });
    expect(res.status).toBe(400);
  });

  it("returns 401 when no admin exists with that email", async () => {
    mockedFindOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@odessey.cafe", password: "whatever123" });

    expect(res.status).toBe(401);
  });

  it("returns 401 when the password does not match", async () => {
    mockedFindOne.mockResolvedValueOnce({
      _id: "admin-1",
      username: "admin",
      email: "admin@odessey.cafe",
      role: "admin",
      comparePassword: jest.fn().mockResolvedValue(false),
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@odessey.cafe", password: "wrong-password" });

    expect(res.status).toBe(401);
  });

  it("returns a token and admin info on successful login", async () => {
    mockedFindOne.mockResolvedValueOnce({
      _id: "admin-1",
      username: "admin",
      email: "admin@odessey.cafe",
      role: "superadmin",
      comparePassword: jest.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@odessey.cafe", password: "correct-password" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.admin).toMatchObject({
      username: "admin",
      email: "admin@odessey.cafe",
      role: "superadmin",
    });
  });
});
