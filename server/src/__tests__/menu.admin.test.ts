import request from "supertest";
import jwt from "jsonwebtoken";

// Pretend a real MongoDB connection is active for these tests
jest.mock("../config/db", () => ({
  isDbConnected: jest.fn(() => true),
  connectDB: jest.fn(),
}));
jest.mock("../models/MenuItem");

import { app } from "../app";
import MenuItemModel from "../models/MenuItem";

const SECRET = "test-secret-do-not-use-in-production";

function adminToken() {
  return jwt.sign({ id: "admin-1", role: "superadmin" }, SECRET, { expiresIn: "1h" });
}

const validItemBody = {
  nameAr: "موساكا يونانية",
  descriptionAr: "طبقات باذنجان ولحم مفروم",
  price: 47000,
  categoryId: "greek",
  imageUrl: "https://example.com/moussaka.jpg",
};

describe("Admin menu-item CRUD (USE_MOCK_DB=false, MongoDB mocked)", () => {
  beforeAll(() => {
    process.env.USE_MOCK_DB = "false";
  });
  afterAll(() => {
    process.env.USE_MOCK_DB = "true";
  });

  describe("POST /api/menu", () => {
    it("rejects the request with no auth token", async () => {
      const res = await request(app).post("/api/menu").send(validItemBody);
      expect(res.status).toBe(401);
    });

    it("rejects a request missing required fields", async () => {
      const res = await request(app)
        .post("/api/menu")
        .set("Authorization", `Bearer ${adminToken()}`)
        .send({ nameAr: "بدون سعر أو قسم" });

      expect(res.status).toBe(400);
    });

    it("creates a menu item when authenticated with valid data", async () => {
      (MenuItemModel.create as jest.Mock).mockResolvedValueOnce({
        _id: "new-item-1",
        ...validItemBody,
        currency: "ل.س",
        isAvailable: true,
        isFeatured: false,
      });

      const res = await request(app)
        .post("/api/menu")
        .set("Authorization", `Bearer ${adminToken()}`)
        .send(validItemBody);

      expect(res.status).toBe(201);
      expect(res.body.nameAr).toBe(validItemBody.nameAr);
      expect(MenuItemModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("PUT /api/menu/:id", () => {
    it("rejects the request with no auth token", async () => {
      const res = await request(app).put("/api/menu/abc123").send({ price: 5000 });
      expect(res.status).toBe(401);
    });

    it("updates a menu item when authenticated", async () => {
      (MenuItemModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        _id: "item-1",
        ...validItemBody,
        price: 50000,
      });

      const res = await request(app)
        .put("/api/menu/item-1")
        .set("Authorization", `Bearer ${adminToken()}`)
        .send({ price: 50000 });

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(50000);
    });

    it("returns 404 when the item does not exist", async () => {
      (MenuItemModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .put("/api/menu/does-not-exist")
        .set("Authorization", `Bearer ${adminToken()}`)
        .send({ price: 1000 });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/menu/:id", () => {
    it("rejects the request with no auth token", async () => {
      const res = await request(app).delete("/api/menu/abc123");
      expect(res.status).toBe(401);
    });

    it("deletes a menu item when authenticated", async () => {
      (MenuItemModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({
        _id: "item-1",
      });

      const res = await request(app)
        .delete("/api/menu/item-1")
        .set("Authorization", `Bearer ${adminToken()}`);

      expect(res.status).toBe(200);
    });

    it("returns 404 when the item does not exist", async () => {
      (MenuItemModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .delete("/api/menu/does-not-exist")
        .set("Authorization", `Bearer ${adminToken()}`);

      expect(res.status).toBe(404);
    });
  });
});

describe("Admin menu-item CRUD blocked in mock-data mode (USE_MOCK_DB=true)", () => {
  beforeAll(() => {
    process.env.USE_MOCK_DB = "true";
  });

  it("refuses to create an item because there is no real DB to persist it in", async () => {
    const res = await request(app)
      .post("/api/menu")
      .set("Authorization", `Bearer ${adminToken()}`)
      .send(validItemBody);

    expect(res.status).toBe(400);
  });
});
