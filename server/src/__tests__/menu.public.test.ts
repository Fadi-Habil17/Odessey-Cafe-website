import request from "supertest";
import { app } from "../app";
import { mockCategories, mockMenuItems } from "../data/mockData";

describe("Public menu & category endpoints (USE_MOCK_DB=true)", () => {
  beforeAll(() => {
    process.env.USE_MOCK_DB = "true";
  });

  describe("GET /api/health", () => {
    it("returns ok status", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
    });
  });

  describe("GET /api/categories", () => {
    it("returns the full list of mock categories", async () => {
      const res = await request(app).get("/api/categories");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(mockCategories.length);
      expect(res.body[0]).toHaveProperty("nameAr");
    });
  });

  describe("GET /api/menu", () => {
    it("returns all mock menu items when no category filter is given", async () => {
      const res = await request(app).get("/api/menu");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(mockMenuItems.length);
    });

    it("filters items by category", async () => {
      const targetCategory = mockMenuItems[0].categoryId;
      const expectedCount = mockMenuItems.filter(
        (i) => i.categoryId === targetCategory
      ).length;

      const res = await request(app)
        .get("/api/menu")
        .query({ category: targetCategory });

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(expectedCount);
      for (const item of res.body) {
        expect(item.categoryId).toBe(targetCategory);
      }
    });

    it("returns every item when category=all", async () => {
      const res = await request(app).get("/api/menu").query({ category: "all" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(mockMenuItems.length);
    });

    it("returns an empty array for a category with no items", async () => {
      const res = await request(app)
        .get("/api/menu")
        .query({ category: "a-category-that-does-not-exist" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("GET /api/menu/:id", () => {
    it("returns a single mock item by id", async () => {
      const target = mockMenuItems[0];
      const res = await request(app).get(`/api/menu/${target._id}`);
      expect(res.status).toBe(200);
      expect(res.body.nameAr).toBe(target.nameAr);
    });

    it("returns 404 for an unknown id", async () => {
      const res = await request(app).get("/api/menu/does-not-exist");
      expect(res.status).toBe(404);
    });
  });

  describe("Unknown route", () => {
    it("returns 404 with an Arabic message", async () => {
      const res = await request(app).get("/api/this-route-does-not-exist");
      expect(res.status).toBe(404);
      expect(res.body.message).toBeDefined();
    });
  });

  describe("Admin-only mutations while USE_MOCK_DB=true", () => {
    it("blocks creating a menu item even with a valid-shaped request (no DB to write to)", async () => {
      // No Authorization header at all → should fail auth before anything else
      const res = await request(app).post("/api/menu").send({
        nameAr: "طبق تجريبي",
        descriptionAr: "وصف",
        price: 1000,
        categoryId: mockCategories[0].id,
      });
      expect(res.status).toBe(401);
    });
  });
});
