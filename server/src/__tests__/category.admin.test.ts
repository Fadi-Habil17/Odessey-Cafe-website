import request from "supertest";
import jwt from "jsonwebtoken";

jest.mock("../models/Category");

import { app } from "../app";
import CategoryModel from "../models/Category";

const SECRET = "test-secret-do-not-use-in-production";

function adminToken() {
  return jwt.sign({ id: "admin-1", role: "superadmin" }, SECRET, { expiresIn: "1h" });
}

describe("Admin category CRUD", () => {
  describe("POST /api/categories", () => {
    it("rejects the request with no auth token", async () => {
      const res = await request(app)
        .post("/api/categories")
        .send({ slug: "desserts", nameAr: "حلويات", nameEn: "Desserts" });

      expect(res.status).toBe(401);
    });

    it("rejects a request missing required fields", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken()}`)
        .send({ slug: "desserts" });

      expect(res.status).toBe(400);
    });

    it("rejects a duplicate slug", async () => {
      (CategoryModel.findOne as jest.Mock).mockResolvedValueOnce({ slug: "desserts" });

      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken()}`)
        .send({ slug: "desserts", nameAr: "حلويات", nameEn: "Desserts" });

      expect(res.status).toBe(409);
    });

    it("creates a category when authenticated with valid, unique data", async () => {
      (CategoryModel.findOne as jest.Mock).mockResolvedValueOnce(null);
      (CategoryModel.create as jest.Mock).mockResolvedValueOnce({
        _id: "cat-1",
        slug: "desserts",
        nameAr: "حلويات",
        nameEn: "Desserts",
        sortOrder: 10,
      });

      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken()}`)
        .send({ slug: "desserts", nameAr: "حلويات", nameEn: "Desserts", sortOrder: 10 });

      expect(res.status).toBe(201);
      expect(res.body.slug).toBe("desserts");
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("rejects the request with no auth token", async () => {
      const res = await request(app).put("/api/categories/cat-1").send({ nameAr: "جديد" });
      expect(res.status).toBe(401);
    });

    it("updates a category when authenticated", async () => {
      (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
        _id: "cat-1",
        slug: "desserts",
        nameAr: "حلويات محدثة",
        nameEn: "Desserts",
        sortOrder: 10,
      });

      const res = await request(app)
        .put("/api/categories/cat-1")
        .set("Authorization", `Bearer ${adminToken()}`)
        .send({ nameAr: "حلويات محدثة" });

      expect(res.status).toBe(200);
      expect(res.body.nameAr).toBe("حلويات محدثة");
    });

    it("returns 404 when the category does not exist", async () => {
      (CategoryModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .put("/api/categories/does-not-exist")
        .set("Authorization", `Bearer ${adminToken()}`)
        .send({ nameAr: "أي اسم" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("rejects the request with no auth token", async () => {
      const res = await request(app).delete("/api/categories/cat-1");
      expect(res.status).toBe(401);
    });

    it("deletes a category when authenticated", async () => {
      (CategoryModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({ _id: "cat-1" });

      const res = await request(app)
        .delete("/api/categories/cat-1")
        .set("Authorization", `Bearer ${adminToken()}`);

      expect(res.status).toBe(200);
    });

    it("returns 404 when the category does not exist", async () => {
      (CategoryModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app)
        .delete("/api/categories/does-not-exist")
        .set("Authorization", `Bearer ${adminToken()}`);

      expect(res.status).toBe(404);
    });
  });
});
